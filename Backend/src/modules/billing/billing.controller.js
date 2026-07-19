import { asyncHandler } from '../../utils/asyncHandler.js'
import * as billingService from './billing.service.js'

export const getStats = asyncHandler(async (req, res) => {
  const stats = await billingService.getBillingStats()
  res.json({ stats })
})
