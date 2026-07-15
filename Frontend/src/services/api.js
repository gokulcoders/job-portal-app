import axiosInstance from '@api/axiosInstance'

export async function fetchJobs({ page = 1, limit = 20, q, keyword, company, place, signal } = {}) {
  const { data } = await axiosInstance.get('/api/jobs', {
    params: { page, limit, q, keyword, company, place },
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
