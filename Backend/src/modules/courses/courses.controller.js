import { asyncHandler } from '../../utils/asyncHandler.js'
import { ApiError } from '../../utils/ApiError.js'
import * as coursesService from './courses.service.js'

export const listPublic = asyncHandler(async (req, res) => {
  const courses = await coursesService.listCourses(req.query)
  res.json({ courses })
})

export const getOne = asyncHandler(async (req, res) => {
  const course = await coursesService.getCourseById(req.params.id)
  res.json({ course })
})

export const listAllAdmin = asyncHandler(async (req, res) => {
  const courses = await coursesService.listAllCourses()
  res.json({ courses })
})

export const create = asyncHandler(async (req, res) => {
  const { title, description, youtubeUrl, duration, category, level, instructor, price } = req.body
  if (!title?.trim() || !youtubeUrl?.trim() || !duration) {
    throw new ApiError(400, 'Title, YouTube link and duration are required')
  }

  const course = await coursesService.createCourse({
    title: title.trim(),
    description: description?.trim() || '',
    youtubeUrl: youtubeUrl.trim(),
    duration: Number(duration),
    category: category?.trim() || 'General',
    level,
    instructor: instructor?.trim() || '',
    price: price?.trim() || 'Free',
    createdBy: req.user.id,
  })
  res.status(201).json({ course })
})

export const update = asyncHandler(async (req, res) => {
  const { title, description, youtubeUrl, duration, category, level, instructor, price, isActive } = req.body
  const data = {}
  if (title !== undefined) data.title = title.trim()
  if (description !== undefined) data.description = description.trim()
  if (youtubeUrl !== undefined) data.youtubeUrl = youtubeUrl.trim()
  if (duration !== undefined) data.duration = Number(duration)
  if (category !== undefined) data.category = category.trim()
  if (level !== undefined) data.level = level
  if (instructor !== undefined) data.instructor = instructor.trim()
  if (price !== undefined) data.price = price.trim()
  if (isActive !== undefined) data.isActive = isActive

  const course = await coursesService.updateCourse(req.params.id, data)
  res.json({ course })
})

export const remove = asyncHandler(async (req, res) => {
  const result = await coursesService.deleteCourse(req.params.id)
  res.json(result)
})

export const getMyProgressForCourse = asyncHandler(async (req, res) => {
  const progress = await coursesService.getProgress(req.user.id, req.params.id)
  res.json({ progress })
})

export const listMyProgress = asyncHandler(async (req, res) => {
  const progress = await coursesService.listMyProgress(req.user.id)
  res.json({ progress })
})

export const saveProgress = asyncHandler(async (req, res) => {
  const { watchedSeconds, durationSeconds } = req.body
  const progress = await coursesService.saveProgress(req.user.id, req.params.id, { watchedSeconds, durationSeconds })
  res.json({ progress })
})
