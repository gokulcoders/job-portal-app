import { asyncHandler } from '../../utils/asyncHandler.js'
import { ApiError } from '../../utils/ApiError.js'
import * as jobsService from './jobs.service.js'

export const listJobs = asyncHandler(async (req, res) => {
  const result = await jobsService.listJobs(req.query)
  res.json(result)
})

export const getJobById = asyncHandler(async (req, res) => {
  const job = await jobsService.getJobById(req.params.id)
  if (!job) throw new ApiError(404, 'Job not found')
  res.json(job)
})

export const searchJobs = asyncHandler(async (req, res) => {
  const result = await jobsService.searchJobs(req.query.q, req.query)
  res.json(result)
})

export const latestJobs = asyncHandler(async (req, res) => {
  const jobs = await jobsService.latestJobs(Number(req.query.limit) || 10)
  res.json({ jobs })
})

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await jobsService.deleteJob(req.params.id)
  if (!job) throw new ApiError(404, 'Job not found')
  res.json({ message: 'Job deleted successfully' })
})

export const getScraperStats = asyncHandler(async (req, res) => {
  const stats = await jobsService.getScraperStats()
  res.json(stats)
})

export const clearScraperData = asyncHandler(async (req, res) => {
  const deletedCount = await jobsService.clearScraperData(req.query.source)
  res.json({ message: `Successfully cleared ${deletedCount} jobs`, deletedCount })
})
export const triggerScraper = asyncHandler(async (req, res) => {
  const result = await jobsService.triggerScraper(req.body.source)
  res.json(result)
})
