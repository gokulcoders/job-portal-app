import { asyncHandler } from '../../utils/asyncHandler.js'
import * as notificationsService from './notifications.service.js'

export const listMine = asyncHandler(async (req, res) => {
  const result = await notificationsService.listForUser(req.user.id, { limit: 20 })
  res.json(result)
})

export const markRead = asyncHandler(async (req, res) => {
  const notif = await notificationsService.markRead(req.params.id, req.user.id)
  res.json({ notification: notif })
})

export const markAllRead = asyncHandler(async (req, res) => {
  const result = await notificationsService.markAllRead(req.user.id)
  res.json(result)
})
