import { useState, useRef, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { useStores } from '@hooks/useStores'
import {
  IconMenu, IconSearch, IconBell, IconPalette,
  IconUserCircle, IconLogout,
} from '@components/icons'

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

// ── Notification badge ────────────────────────────────────────────────
function NotificationBtn() {
  return (
    <button id="notif-btn" type="button" className="navbar-icon-btn" aria-label="Notifications">
      <IconBell />
      <span className="navbar-badge" />
    </button>
  )
}

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
