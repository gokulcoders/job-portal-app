import { makeAutoObservable, runInAction } from 'mobx'
import { fetchMyNotifications, markNotificationRead, markAllNotificationsRead } from '@services/api'

const POLL_INTERVAL_MS = 5 * 60 * 60 * 1000 // 5 hours

class NotificationStore {
  notifications = []
  unreadCount = 0
  loading = false

  constructor() {
    makeAutoObservable(this)
  }

  startPolling() {
    if (this._timer) return
    this.load()
    this._timer = setInterval(() => this.load(), POLL_INTERVAL_MS)
  }

  stopPolling() {
    clearInterval(this._timer)
    this._timer = null
  }

  async load() {
    this.loading = true
    try {
      const { notifications, unreadCount } = await fetchMyNotifications()
      runInAction(() => {
        this.notifications = notifications
        this.unreadCount = unreadCount
      })
    } catch { /* ignore — keep last known state */ } finally {
      runInAction(() => { this.loading = false })
    }
  }

  async markRead(id) {
    try {
      await markNotificationRead(id)
      runInAction(() => {
        const n = this.notifications.find(n => n._id === id)
        if (n && !n.isRead) { n.isRead = true; this.unreadCount = Math.max(0, this.unreadCount - 1) }
      })
    } catch { /* ignore */ }
  }

  async markAllRead() {
    try {
      await markAllNotificationsRead()
      runInAction(() => {
        this.notifications.forEach(n => { n.isRead = true })
        this.unreadCount = 0
      })
    } catch { /* ignore */ }
  }
}

export default NotificationStore
