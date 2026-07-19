import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStores } from '@hooks/useStores'
import {
  IconUsers, IconBarChart, IconUserCircle, IconChevronDown, IconDot, IconLayoutGrid,
} from '@components/icons'

// ── Role-based nav config ─────────────────────────────────────────────────
const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconBilling = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
)
const IconSubscription = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.24 6.9H21l-5.88 4.27L17.36 20 12 15.73 6.64 20l2.24-6.83L3 8.9h6.76z"/>
  </svg>
)
const IconMegaphone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 0 1-5.8-1.6"/>
  </svg>
)
const IconGlobe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)
const IconBriefcase = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)
const IconIntern = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
)
const IconCompany = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconCourse = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)
const IconCareer = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)
const IconUrgent = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const IconWalkIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1"/><path d="M9 20l3-8 3 8"/><path d="M6 9l6 1 6-1"/>
  </svg>
)

function buildNavSections(role) {
  const sections = [
    {
      section: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: IconLayoutGrid, path: '/dashboard' },
      ],
    },
    {
      section: 'OPPORTUNITIES',
      items: [
        { id: 'jobs',        label: 'Browse Jobs',    icon: IconBriefcase, path: '/jobs' },
        { id: 'urgent',      label: 'Urgent Hiring',  icon: IconUrgent,    path: '/urgent-hiring' },
        { id: 'internships', label: 'Internships',    icon: IconIntern,    path: '/internships' },
        { id: 'walkin',      label: 'Walk-in Drives', icon: IconWalkIn,    path: '/walk-in' },
      ],
    },
    {
      section: 'EXPLORE',
      items: [
        { id: 'companies',   label: 'Companies',      icon: IconCompany,   path: '/companies' },
        { id: 'courses',     label: 'Courses',        icon: IconCourse,    path: '/courses' },
        { id: 'career',      label: 'Career Advice',  icon: IconCareer,    path: '/career' },
      ],
    },
    {
      section: 'ACCOUNT',
      items: [
        { id: 'profile', label: 'Profile', icon: IconUserCircle, path: '/dashboard/profile' },
        { id: 'subscription', label: 'Subscription', icon: IconSubscription, path: '/dashboard/subscription' },
      ],
    },
  ]

  if (role === 'admin' || role === 'super_admin') {
    sections.push({
      section: 'MANAGEMENT',
      items: [
        { id: 'users',     label: 'Users',     icon: IconUsers,    path: '/dashboard/users' },
        { id: 'analytics', label: 'Analytics', icon: IconBarChart, path: '/dashboard/analytics' },
      ],
    })
  }

  if (role === 'super_admin') {
    sections.push({
      section: 'SYSTEM',
      items: [
        { id: 'featured-posts', label: 'Featured Posts', icon: IconMegaphone, path: '/dashboard/featured-posts' },
        { id: 'courses-manager', label: 'Courses',        icon: IconCourse,    path: '/dashboard/courses-manager' },
        { id: 'billing',  label: 'Billing',       icon: IconBilling, path: '/dashboard/billing' },
        { id: 'tenants',  label: 'All Tenants',   icon: IconGlobe,   path: '/dashboard/tenants' },
        { id: 'sys-settings', label: 'System Settings', icon: IconShield, path: '/dashboard/system-settings' },
      ],
    })
  }

  return sections
}

// ── Role badge ────────────────────────────────────────────────────────────
const ROLE_STYLE = {
  super_admin: { label: 'Super Admin', bg: '#7c3aed', color: '#fff' },
  admin:       { label: 'Admin',       bg: '#2563eb', color: '#fff' },
  user:        { label: 'User',        bg: '#e2e8f0', color: '#475569' },
}

// ── Logo ──────────────────────────────────────────────────────────────────
function SidebarLogo({ collapsed }) {
  return (
    <div className="sidebar-logo">
      <div className="sidebar-logo-icon">
        <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
          <rect width="44" height="44" rx="10" fill="#1a1a2e" />
          <path d="M22 10L30.66 15V25L22 30L13.34 25V15Z" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.5" />
          <path d="M18 20L22 17L26 20L22 23Z" fill="white" />
          <path d="M22 23V28" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      {!collapsed && <span className="sidebar-logo-text">HireVerse</span>}
    </div>
  )
}

// ── Nav item (leaf) ───────────────────────────────────────────────────────
function NavItem({ item, collapsed }) {
  const { themeStore } = useStores()
  const Icon = item.icon
  return (
    <NavLink
      to={item.path}
      end={item.path === '/dashboard'}
      className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
      title={collapsed ? item.label : undefined}
      onClick={() => themeStore.closeMobileSidebar()}
    >
      <span className="nav-item-icon"><Icon /></span>
      {!collapsed && <span className="nav-item-label">{item.label}</span>}
    </NavLink>
  )
}

// ── Nav group ─────────────────────────────────────────────────────────────
function NavGroup({ item, collapsed }) {
  const { themeStore } = useStores()
  const location = useLocation()
  const hasActiveChild = item.children?.some((c) => c.path && location.pathname.startsWith(c.path))
  const [open, setOpen] = useState(hasActiveChild)
  const Icon = item.icon

  if (collapsed) return (
    <div className="nav-item nav-item--group" title={item.label}>
      <span className="nav-item-icon"><Icon /></span>
    </div>
  )

  return (
    <div className="nav-group">
      <button
        type="button"
        className={`nav-item nav-item--group ${hasActiveChild ? 'nav-item--active-parent' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="nav-item-icon"><Icon /></span>
        <span className="nav-item-label">{item.label}</span>
        <span className={`nav-chevron ${open ? 'nav-chevron--open' : ''}`}>
          <IconChevronDown />
        </span>
      </button>
      {open && item.children?.length > 0 && (
        <div className="nav-submenu">
          {item.children.map((child) => (
            <NavLink key={child.id} to={child.path}
              className={({ isActive }) => `nav-subitem ${isActive ? 'nav-subitem--active' : ''}`}
              onClick={() => themeStore.closeMobileSidebar()}
            >
              <span className="nav-subitem-dot"><IconDot /></span>
              <span>{child.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────
const Sidebar = observer(() => {
  const { themeStore, authStore } = useStores()
  const { sidebarCollapsed: collapsed } = themeStore
  const role       = authStore.role
  const userName   = authStore.userName
  const roleMeta   = ROLE_STYLE[role] || ROLE_STYLE.user
  const navSections = buildNavSections(role)

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <SidebarLogo collapsed={collapsed} />

      <nav className="sidebar-nav">
        {navSections.map(({ section, items }) => (
          <div key={section} className="nav-section">
            {!collapsed && <p className="nav-section-title">{section}</p>}
            {items.map((item) =>
              item.children !== undefined ? (
                <NavGroup key={item.id} item={item} collapsed={collapsed} />
              ) : (
                <NavItem key={item.id} item={item} collapsed={collapsed} />
              )
            )}
          </div>
        ))}
      </nav>

      {/* Role badge at bottom */}
      {!collapsed && (
        <div className="sidebar-role-wrap">
          <div className="sidebar-role-avatar">{userName?.[0]?.toUpperCase() || 'U'}</div>
          <div className="sidebar-role-info">
            <span className="sidebar-role-name">{userName}</span>
            <span className="sidebar-role-badge" style={{ background: roleMeta.bg, color: roleMeta.color }}>
              {roleMeta.label}
            </span>
          </div>
        </div>
      )}
    </aside>
  )
})

export default Sidebar
