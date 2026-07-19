import { asyncHandler } from '../../utils/asyncHandler.js'
import * as systemService from './system.service.js'

export const getHealth = asyncHandler(async (req, res) => {
  const health = await systemService.getHealth()
  res.json(health)
})

export const flushCache = asyncHandler(async (req, res) => {
  const result = await systemService.flushCache()
  res.json(result)
})

export const runCleanupJobs = asyncHandler(async (req, res) => {
  const result = await systemService.runCleanupJobs()
  res.json(result)
})
