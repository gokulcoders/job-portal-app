import { asyncHandler } from '../../utils/asyncHandler.js'
import * as settingsService from './settings.service.js'

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettings()
  res.json({ settings })
})

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body, req.user.id)
  res.json({ settings })
})
