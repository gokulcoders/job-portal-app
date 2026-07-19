import { asyncHandler } from '../../utils/asyncHandler.js'
import * as analyticsService from './analytics.service.js'

export const getOverview = asyncHandler(async (req, res) => {
  const overview = await analyticsService.getOverview()
  res.json(overview)
})
