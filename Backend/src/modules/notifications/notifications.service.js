import Notification from '../../models/Notification.js'
import { ApiError } from '../../utils/ApiError.js'

export async function createNotification({ recipient, message, type, sentBy }) {
  return Notification.create({ recipient, message, type, sentBy })
}

export async function listForUser(userId, { limit = 20 } = {}) {
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ recipient: userId }).sort({ createdAt: -1 }).limit(limit).lean(),
    Notification.countDocuments({ recipient: userId, isRead: false }),
  ])
  return { notifications, unreadCount }
}

export async function markRead(id, userId) {
  const notif = await Notification.findOneAndUpdate(
    { _id: id, recipient: userId },
    { isRead: true },
    { new: true }
  )
  if (!notif) throw new ApiError(404, 'Notification not found')
  return notif
}

export async function markAllRead(userId) {
  await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true })
  return { updated: true }
}
