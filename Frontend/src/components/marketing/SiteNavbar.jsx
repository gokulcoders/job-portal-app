import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStores } from '@hooks/useStores'
import { toast } from 'sonner'
import './site.css'

const NAV_LINKS = [
  // { label: 'Home', to: '/' },

]

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const SiteNavbar = observer(({ active }) => {
  const { authStore } = useStores()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    setMenuOpen(false)
    await authStore.logout()
    toast.success('Signed out successfully')
    navigate('/')
  }

  const initials = (authStore.user?.name || authStore.user?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="hv-nav">
      <div className="hv-nav-inner">
        {/* Logo */}
        <Link to="/" className="hv-logo" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2a10 10 0 1 0 10 10H12V2z" fill="#111" />
            <circle cx="8" cy="8" r="2" fill="#fff" />
          </svg>
          <span style={{ color: '#111', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em' }}>Quiety</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hv-nav-links">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} to={l.to} className={active === l.label ? 'hv-nav-active' : ''}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Auth area */}
        <div className="hv-nav-actions">
          {authStore.isAuthenticated ? (
            <div className="hv-user-menu" ref={dropRef}>
              <button
                type="button"
                className="hv-user-trigger"
                onClick={() => setMenuOpen(v => !v)}
                aria-label="User menu"
                aria-expanded={menuOpen}
              >
                <span className="hv-user-avatar">{initials}</span>
                <span className="hv-user-name">{authStore.user?.name?.split(' ')[0] || 'Account'}</span>
                <ChevronIcon />
              </button>

              {menuOpen && (
                <div className="hv-user-dropdown">
                  <div className="hv-dropdown-header">
                    <span className="hv-dropdown-name">{authStore.user?.name || 'User'}</span>
                    <span className="hv-dropdown-email">{authStore.user?.email}</span>
                  </div>
                  <div className="hv-dropdown-divider" />
                  <Link to="/jobs" className="hv-dropdown-item" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
                  <Link to="/dashboard" className="hv-dropdown-item" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/dashboard/profile" className="hv-dropdown-item" onClick={() => setMenuOpen(false)}>My Profile</Link>
                  <div className="hv-dropdown-divider" />
                  <button type="button" className="hv-dropdown-item hv-dropdown-logout" onClick={handleLogout}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hv-signin-link">Sign in</Link>
              <Link to="/register" className="hv-btn-dark">Get started</Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="hv-mobile-menu-btn"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="hv-mobile-menu">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} to={l.to} className="hv-mobile-link" onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="hv-mobile-divider" />
          {authStore.isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hv-mobile-link" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link to="/dashboard/profile" className="hv-mobile-link" onClick={() => setMobileOpen(false)}>Profile</Link>
              <button type="button" className="hv-mobile-link hv-mobile-logout" onClick={() => { handleLogout(); setMobileOpen(false) }}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hv-mobile-link" onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link to="/register" className="hv-mobile-link hv-mobile-cta" onClick={() => setMobileOpen(false)}>Get started</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
})

export default SiteNavbar
