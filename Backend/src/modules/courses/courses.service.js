import Course from '../../models/Course.js'
import CourseProgress from '../../models/CourseProgress.js'
import { ApiError } from '../../utils/ApiError.js'
import { extractYouTubeId } from '../../utils/youtube.js'
import * as notificationsService from '../notifications/notifications.service.js'

function buildFilter({ q, category, level }) {
  const filter = { isActive: true }
  if (category && category !== 'All') filter.category = category
  if (level) filter.level = level
  if (q) {
    const re = new RegExp(q.trim(), 'i')
    filter.$or = [{ title: re }, { instructor: re }, { category: re }]
  }
  return filter
}

export async function listCourses(query) {
  return Course.find(buildFilter(query)).sort({ createdAt: -1 }).lean()
}

export async function getCourseById(id) {
  const course = await Course.findById(id).lean()
  if (!course) throw new ApiError(404, 'Course not found')
  return course
}

export async function listAllCourses() {
  return Course.find().sort({ createdAt: -1 }).lean()
}

export async function createCourse({ title, description, youtubeUrl, duration, category, level, instructor, price, createdBy }) {
  const youtubeId = extractYouTubeId(youtubeUrl)
  if (!youtubeId) throw new ApiError(400, 'Could not find a valid YouTube video in that link')

  return Course.create({ title, description, youtubeUrl, youtubeId, duration, category, level, instructor, price, createdBy })
}

export async function updateCourse(id, data) {
  const update = { ...data }
  if (update.youtubeUrl) {
    const youtubeId = extractYouTubeId(update.youtubeUrl)
    if (!youtubeId) throw new ApiError(400, 'Could not find a valid YouTube video in that link')
    update.youtubeId = youtubeId
  }
  const course = await Course.findByIdAndUpdate(id, update, { new: true, runValidators: true })
  if (!course) throw new ApiError(404, 'Course not found')
  return course
}

export async function deleteCourse(id) {
  const course = await Course.findByIdAndDelete(id)
  if (!course) throw new ApiError(404, 'Course not found')
  await CourseProgress.deleteMany({ course: id })
  return { deleted: true }
}

// ── Progress tracking ────────────────────────────────────────────────────

export async function getProgress(userId, courseId) {
  return CourseProgress.findOne({ user: userId, course: courseId }).lean()
}

export async function listMyProgress(userId) {
  return CourseProgress.find({ user: userId })
    .sort({ lastWatchedAt: -1 })
    .populate('course', 'title category level duration youtubeId instructor')
    .lean()
}

export async function saveProgress(userId, courseId, { watchedSeconds, durationSeconds }) {
  const course = await Course.findById(courseId).select('_id')
  if (!course) throw new ApiError(404, 'Course not found')

  const safeWatched  = Math.max(0, Math.floor(watchedSeconds || 0))
  const safeDuration = Math.max(0, Math.floor(durationSeconds || 0))
  const progressPercent = safeDuration > 0 ? Math.min(100, Math.round((safeWatched / safeDuration) * 100)) : 0

  const existing = await CourseProgress.findOne({ user: userId, course: courseId })

  const update = {
    // never let the tracked position go backwards (e.g. user re-opens and seeks to start)
    watchedSeconds: Math.max(safeWatched, existing?.watchedSeconds || 0),
    durationSeconds: safeDuration || existing?.durationSeconds || 0,
    lastWatchedAt: new Date(),
  }
  update.progressPercent = update.durationSeconds > 0
    ? Math.min(100, Math.round((update.watchedSeconds / update.durationSeconds) * 100))
    : progressPercent
  update.completed = update.progressPercent >= 90

  return CourseProgress.findOneAndUpdate(
    { user: userId, course: courseId },
    { $set: update },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
}

// Reminds users who started a course, haven't finished it, and haven't watched
// in the last `staleDays` days (and haven't already been reminded that recently).
export async function sendWatchReminders(staleDays = 2) {
  const cutoff = new Date(Date.now() - staleDays * 24 * 60 * 60 * 1000)

  const stale = await CourseProgress.find({
    completed: false,
    progressPercent: { $gt: 0 },
    lastWatchedAt: { $lt: cutoff },
    $or: [{ lastRemindedAt: null }, { lastRemindedAt: { $lt: cutoff } }],
  }).populate('course', 'title')

  for (const progress of stale) {
    if (!progress.course) continue
    await notificationsService.createNotification({
      recipient: progress.user,
      message: `Continue watching "${progress.course.title}" — you're ${progress.progressPercent}% done!`,
      type: 'info',
    })
    progress.lastRemindedAt = new Date()
    await progress.save()
  }

  return stale.length
}
