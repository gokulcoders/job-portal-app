import { useState, useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { useStores } from '@hooks/useStores'
import {
  IconMenu, IconSearch, IconBell, IconPalette,
  IconUserCircle, IconLogout,
} from '@components/icons'

const TYPE_DOT = { info: '#3b82f6', warning: '#f59e0b', success: '#10b981', error: '#ef4444' }

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// ── User avatar dropdown ──────────────────────────────────────────────
const UserMenu = observer(() => {
  const { authStore } = useStores()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    authStore.logout()
    navigate('/login')
  }

  const displayName = authStore.user?.name || 'Admin'
  const displayEmail = authStore.user?.email || 'admin@ecme.com'
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="user-menu-wrap" ref={ref}>
      <button
        id="user-avatar-btn"
        type="button"
        className="user-avatar-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <div className="user-avatar">{initials}</div>
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          {/* User info */}
          <div className="user-dropdown-header">
            <div className="user-avatar user-avatar--lg">{initials}</div>
            <div>
              <p className="user-dropdown-name">{displayName}</p>
              <p className="user-dropdown-email">{displayEmail}</p>
            </div>
          </div>
          <div className="user-dropdown-divider" />
          <button
            type="button"
            className="user-dropdown-item"
            onClick={() => { navigate('/dashboard/profile'); setOpen(false) }}
          >
            <IconUserCircle />
            <span>Profile</span>
          </button>
          <div className="user-dropdown-divider" />
          <button
            id="logout-btn"
            type="button"
            className="user-dropdown-item user-dropdown-item--danger"
            onClick={handleLogout}
          >
            <IconLogout />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  )
})

// ── Search bar ─────────────────────────────────────────────────────────
function SearchBar() {
  const [focused, setFocused] = useState(false)
  return (
    <div className={`navbar-search ${focused ? 'navbar-search--focused' : ''}`}>
      <span className="navbar-search-icon"><IconSearch /></span>
      <input
        id="navbar-search-input"
        type="text"
        placeholder="Search..."
        className="navbar-search-input"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <span className="navbar-search-shortcut">⌘K</span>
    </div>
  )
}

// ── Notification bell + dropdown ────────────────────────────────────────
const NotificationBtn = observer(() => {
  const { notificationStore } = useStores()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    notificationStore.startPolling()
    return () => notificationStore.stopPolling()
  }, [notificationStore])

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const { notifications, unreadCount } = notificationStore

  return (
    <div className="notif-wrap" ref={ref}>
      <button
        id="notif-btn"
        type="button"
        className="navbar-icon-btn"
        aria-label="Notifications"
        onClick={() => setOpen(v => !v)}
      >
        <IconBell />
        {unreadCount > 0 && <span className="navbar-badge" />}
      </button>

      {open && (
        <div className="notif-panel" role="menu">
          <div className="notif-panel-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button type="button" className="notif-mark-all" onClick={() => notificationStore.markAllRead()}>
                Mark all read
              </button>
            )}
          </div>
          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">No notifications yet</div>
            ) : (
              notifications.map(n => (
                <button
                  type="button"
                  key={n._id}
                  className={`notif-item ${n.isRead ? '' : 'notif-item--unread'}`}
                  onClick={() => !n.isRead && notificationStore.markRead(n._id)}
                >
                  <span className="notif-dot" style={{ background: TYPE_DOT[n.type] || TYPE_DOT.info }} />
                  <span className="notif-item-body">
                    <span className="notif-item-msg">{n.message}</span>
                    <span className="notif-item-time">{timeAgo(n.createdAt)}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
})

// ── Navbar ────────────────────────────────────────────────────────────
const Navbar = observer(() => {
  const { themeStore } = useStores()

  return (
    <header className="navbar">
      {/* Left: hamburger + search */}
      <div className="navbar-left">
        <button
          id="sidebar-toggle-btn"
          type="button"
          className="navbar-icon-btn"
          onClick={() => themeStore.toggleSidebar()}
          aria-label="Toggle sidebar"
        >
          <IconMenu />
        </button>
        <SearchBar />
      </div>

      {/* Right: notifications, theme config, user */}
      <div className="navbar-right">
        <NotificationBtn />

        <button
          id="theme-config-btn"
          type="button"
          className="navbar-icon-btn"
          onClick={() => themeStore.openThemeConfig()}
          aria-label="Theme configuration"
          title="Theme config"
        >
          <IconPalette />
        </button>

        <UserMenu />
      </div>
    </header>
  )
})

export default Navbar
