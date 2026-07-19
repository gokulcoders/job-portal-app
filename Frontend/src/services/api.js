import axiosInstance from '@api/axiosInstance'
import { ENDPOINTS } from '@api/endpoints'

export async function fetchJobs({ page = 1, limit = 20, q, keyword, company, place, jobType, source, signal } = {}) {
  const { data } = await axiosInstance.get('/api/jobs', {
    params: { page, limit, q, keyword, company, place, jobType, source },
    signal,
  })
  return data
}

export async function fetchLatestJobs(limit = 10) {
  const { data } = await axiosInstance.get('/api/jobs/latest', {
    params: { limit },
  })
  return data.jobs
}

export async function deleteJob(id) {
  const { data } = await axiosInstance.delete(`/api/jobs/${id}`)
  return data
}

// ── Admin ────────────────────────────────────────────────────────────────────
export async function fetchAdminUsers({ page = 1, limit = 20, q, role, status, plan } = {}) {
  const { data } = await axiosInstance.get(ENDPOINTS.ADMIN_USERS, { params: { page, limit, q, role, status, plan } })
  return data
}

export async function fetchAdminUserStats() {
  const { data } = await axiosInstance.get(`${ENDPOINTS.ADMIN_USERS}/stats`)
  return data.stats
}

export async function updateAdminUserRole(id, role) {
  const { data } = await axiosInstance.patch(`${ENDPOINTS.ADMIN_USERS}/${id}/role`, { role })
  return data
}

export async function updateAdminUserStatus(id, isActive) {
  const { data } = await axiosInstance.patch(`${ENDPOINTS.ADMIN_USERS}/${id}/status`, { isActive })
  return data
}

export async function deleteAdminUser(id) {
  const { data } = await axiosInstance.delete(`${ENDPOINTS.ADMIN_USERS}/${id}`)
  return data
}

export async function sendAdminUserNotification(id, { message, type }) {
  const { data } = await axiosInstance.post(`${ENDPOINTS.ADMIN_USERS}/${id}/notify`, { message, type })
  return data
}

export async function updateAdminUserPlan(id, plan) {
  const { data } = await axiosInstance.patch(`${ENDPOINTS.ADMIN_USERS}/${id}/plan`, { plan })
  return data
}

export async function updateAdminUserTenant(id, tenantId) {
  const { data } = await axiosInstance.patch(`${ENDPOINTS.ADMIN_USERS}/${id}/tenant`, { tenantId })
  return data
}

// ── Plan (self-service) ──────────────────────────────────────────────────────
export async function updateMyPlan(plan) {
  const { data } = await axiosInstance.patch(ENDPOINTS.UPDATE_PLAN, { plan })
  return data.user
}

// ── System settings (super_admin) ───────────────────────────────────────────
export async function fetchSettings() {
  const { data } = await axiosInstance.get(ENDPOINTS.ADMIN_SETTINGS)
  return data.settings
}

export async function updateSettings(payload) {
  const { data } = await axiosInstance.patch(ENDPOINTS.ADMIN_SETTINGS, payload)
  return data.settings
}

// ── Tenants (super_admin) ───────────────────────────────────────────────────
export async function fetchTenants() {
  const { data } = await axiosInstance.get(ENDPOINTS.ADMIN_TENANTS)
  return data.tenants
}

export async function createTenant(payload) {
  const { data } = await axiosInstance.post(ENDPOINTS.ADMIN_TENANTS, payload)
  return data.tenant
}

export async function updateTenant(id, payload) {
  const { data } = await axiosInstance.patch(`${ENDPOINTS.ADMIN_TENANTS}/${id}`, payload)
  return data.tenant
}

export async function deleteTenant(id) {
  const { data } = await axiosInstance.delete(`${ENDPOINTS.ADMIN_TENANTS}/${id}`)
  return data
}

// ── Billing (super_admin) ───────────────────────────────────────────────────
export async function fetchBillingStats() {
  const { data } = await axiosInstance.get(ENDPOINTS.ADMIN_BILLING_STATS)
  return data.stats
}

// ── Analytics (admin+) ───────────────────────────────────────────────────────
export async function fetchAnalyticsOverview() {
  const { data } = await axiosInstance.get(ENDPOINTS.ADMIN_ANALYTICS)
  return data
}

// ── System health (super_admin) ─────────────────────────────────────────────
export async function fetchSystemHealth() {
  const { data } = await axiosInstance.get(ENDPOINTS.ADMIN_SYSTEM_HEALTH)
  return data
}

export async function flushSystemCache() {
  const { data } = await axiosInstance.post(ENDPOINTS.ADMIN_SYSTEM_FLUSH_CACHE)
  return data
}

export async function runSystemCleanup() {
  const { data } = await axiosInstance.post(ENDPOINTS.ADMIN_SYSTEM_RUN_CLEANUP)
  return data
}

// ── Notifications (own inbox) ───────────────────────────────────────────────
export async function fetchMyNotifications() {
  const { data } = await axiosInstance.get(`${ENDPOINTS.NOTIFICATIONS}/me`)
  return data
}

export async function markNotificationRead(id) {
  const { data } = await axiosInstance.patch(`${ENDPOINTS.NOTIFICATIONS}/${id}/read`)
  return data
}

export async function markAllNotificationsRead() {
  const { data } = await axiosInstance.patch(`${ENDPOINTS.NOTIFICATIONS}/read-all`)
  return data
}

// ── Courses ──────────────────────────────────────────────────────────────────
export async function fetchCourses({ q, category, level } = {}) {
  const { data } = await axiosInstance.get(ENDPOINTS.COURSES, { params: { q, category, level } })
  return data.courses
}

export async function fetchCourse(id) {
  const { data } = await axiosInstance.get(`${ENDPOINTS.COURSES}/${id}`)
  return data.course
}

export async function fetchMyCourseProgress(id) {
  const { data } = await axiosInstance.get(`${ENDPOINTS.COURSES}/${id}/progress`)
  return data.progress
}

export async function saveCourseProgress(id, { watchedSeconds, durationSeconds }) {
  const { data } = await axiosInstance.post(`${ENDPOINTS.COURSES}/${id}/progress`, { watchedSeconds, durationSeconds })
  return data.progress
}

export async function fetchMyCoursesInProgress() {
  const { data } = await axiosInstance.get(`${ENDPOINTS.COURSES}/my-progress`)
  return data.progress
}

export async function fetchAdminCourses() {
  const { data } = await axiosInstance.get(`${ENDPOINTS.COURSES_ADMIN}/all`)
  return data.courses
}

export async function createCourse(payload) {
  const { data } = await axiosInstance.post(ENDPOINTS.COURSES_ADMIN, payload)
  return data.course
}

export async function updateCourse(id, payload) {
  const { data } = await axiosInstance.patch(`${ENDPOINTS.COURSES_ADMIN}/${id}`, payload)
  return data.course
}

export async function deleteCourse(id) {
  const { data } = await axiosInstance.delete(`${ENDPOINTS.COURSES_ADMIN}/${id}`)
  return data
}

// ── Walk-in & Internship (separate collections) ───────────────────────────────
export async function fetchWalkInJobs({ page = 1, limit = 20, q, keyword, company, place, source, signal } = {}) {
  const { data } = await axiosInstance.get(ENDPOINTS.WALKIN_JOBS, {
    params: { page, limit, q, keyword, company, place, source },
    signal,
  })
  return data
}

export async function fetchInternshipJobs({ page = 1, limit = 20, q, keyword, company, place, source, signal } = {}) {
  const { data } = await axiosInstance.get(ENDPOINTS.INTERNSHIP_JOBS, {
    params: { page, limit, q, keyword, company, place, source },
    signal,
  })
  return data
}

// ── Featured posts (admin-managed banners) ──────────────────────────────────
export async function fetchFeaturedPosts(page) {
  const { data } = await axiosInstance.get(ENDPOINTS.FEATURED_POSTS, { params: { page } })
  return data.posts
}

export async function fetchAdminFeaturedPosts() {
  const { data } = await axiosInstance.get(ENDPOINTS.FEATURED_POSTS_ADMIN)
  return data.posts
}

export async function createFeaturedPost(formData) {
  const { data } = await axiosInstance.post(ENDPOINTS.FEATURED_POSTS_ADMIN, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.post
}

export async function deleteFeaturedPost(id) {
  const { data } = await axiosInstance.delete(`${ENDPOINTS.FEATURED_POSTS_ADMIN}/${id}`)
  return data
}
