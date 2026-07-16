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
