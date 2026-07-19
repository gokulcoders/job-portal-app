import User from '../../models/User.js'
import Job from '../../models/Job.js'
import WalkInJob from '../../models/WalkInJob.js'
import InternshipJob from '../../models/InternshipJob.js'
import Course from '../../models/Course.js'
import CourseProgress from '../../models/CourseProgress.js'
import FeaturedPost from '../../models/FeaturedPost.js'
import Notification from '../../models/Notification.js'
import Tenant from '../../models/Tenant.js'
import { PLAN_PRICES } from '../billing/billing.service.js'

const DAY_MS = 24 * 60 * 60 * 1000

// Builds a zero-filled array of the last `days` calendar days (oldest first),
// each as { date: 'YYYY-MM-DD', count }, merging in real aggregation results.
function fillDailySeries(rows, days) {
  const map = new Map(rows.map(r => [r._id, r.count]))
  const series = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY_MS)
    const key = d.toISOString().slice(0, 10)
    series.push({ date: key, count: map.get(key) || 0 })
  }
  return series
}

async function getUserAnalytics() {
  const since30 = new Date(Date.now() - 30 * DAY_MS)

  const [total, verified, active, roleCounts, signupRows, recentSignups] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ isVerified: true }),
    User.countDocuments({ isActive: true }),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    User.aggregate([
      { $match: { createdAt: { $gte: since30 } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    ]),
    User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(5).lean(),
  ])

  const byRole = { user: 0, admin: 0, super_admin: 0 }
  roleCounts.forEach(r => { byRole[r._id] = r.count })

  return {
    total, verified, active, inactive: total - active, byRole,
    signupsByDay: fillDailySeries(signupRows, 30),
    recentSignups,
  }
}

async function getJobAnalytics() {
  const [total, sourceCounts, typeCounts, walkInTotal, internshipTotal] = await Promise.all([
    Job.countDocuments({}),
    Job.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
    Job.aggregate([{ $group: { _id: '$jobType', count: { $sum: 1 } } }]),
    WalkInJob.countDocuments({}),
    InternshipJob.countDocuments({}),
  ])

  const bySource = { linkedin: 0, naukri: 0 }
  sourceCounts.forEach(r => { if (r._id in bySource) bySource[r._id] = r.count })

  const byType = { fulltime: 0, urgent: 0, 'walk-in': 0, internship: 0 }
  typeCounts.forEach(r => {
    const key = r._id || 'fulltime'
    if (key in byType) byType[key] += r.count
  })
  byType['walk-in'] += walkInTotal
  byType.internship += internshipTotal

  return {
    total: total + walkInTotal + internshipTotal,
    scrapedTotal: total,
    bySource,
    byType,
    walkInTotal,
    internshipTotal,
  }
}

async function getCourseAnalytics() {
  const [totalCourses, progressAgg, topCourses] = await Promise.all([
    Course.countDocuments({}),
    CourseProgress.aggregate([
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          avgProgress: { $avg: '$progressPercent' },
        },
      },
    ]),
    CourseProgress.aggregate([
      { $group: { _id: '$course', watchCount: { $sum: 1 }, avgProgress: { $avg: '$progressPercent' } } },
      { $sort: { watchCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $project: { title: '$course.title', watchCount: 1, avgProgress: { $round: ['$avgProgress', 0] } } },
    ]),
  ])

  const agg = progressAgg[0] || { totalSessions: 0, completed: 0, avgProgress: 0 }
  return {
    totalCourses,
    totalSessions: agg.totalSessions,
    completedSessions: agg.completed,
    completionRate: agg.totalSessions > 0 ? Math.round((agg.completed / agg.totalSessions) * 100) : 0,
    avgProgress: Math.round(agg.avgProgress || 0),
    topCourses,
  }
}

async function getFeaturedPostAnalytics() {
  const [total, active, pageCounts] = await Promise.all([
    FeaturedPost.countDocuments({}),
    FeaturedPost.countDocuments({ isActive: true }),
    FeaturedPost.aggregate([{ $group: { _id: '$page', count: { $sum: 1 } } }]),
  ])
  const byPage = { jobs: 0, urgent: 0, internship: 0, walkin: 0 }
  pageCounts.forEach(r => { if (r._id in byPage) byPage[r._id] = r.count })
  return { total, active, byPage }
}

async function getBillingAnalytics() {
  const planCounts = await User.aggregate([{ $group: { _id: '$plan', count: { $sum: 1 } } }])
  const counts = { free: 0, pro: 0, teams: 0 }
  planCounts.forEach(r => { counts[r._id || 'free'] = r.count })
  const mrr = counts.pro * PLAN_PRICES.pro + counts.teams * PLAN_PRICES.teams
  return { planCounts: counts, mrr }
}

async function getTenantAnalytics() {
  const [total, active] = await Promise.all([
    Tenant.countDocuments({}),
    Tenant.countDocuments({ status: 'active' }),
  ])
  return { total, active, suspended: total - active }
}

async function getNotificationAnalytics() {
  const [total, unread] = await Promise.all([
    Notification.countDocuments({}),
    Notification.countDocuments({ isRead: false }),
  ])
  return { total, unread }
}

export async function getOverview() {
  const [users, jobs, courses, featuredPosts, billing, tenants, notifications] = await Promise.all([
    getUserAnalytics(),
    getJobAnalytics(),
    getCourseAnalytics(),
    getFeaturedPostAnalytics(),
    getBillingAnalytics(),
    getTenantAnalytics(),
    getNotificationAnalytics(),
  ])

  return { users, jobs, courses, featuredPosts, billing, tenants, notifications, generatedAt: new Date() }
}
