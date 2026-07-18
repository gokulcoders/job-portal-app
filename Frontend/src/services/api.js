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
export async function fetchAdminUsers({ page = 1, limit = 20, q, role, status } = {}) {
  const { data } = await axiosInstance.get(ENDPOINTS.ADMIN_USERS, { params: { page, limit, q, role, status } })
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
