import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStores } from '@hooks/useStores'
import './Dashboard.css'

// ── Icons ─────────────────────────────────────────────────────────────────
const IconBriefcase = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)
const IconIntern = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
)
const IconCompany = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconCourse = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)
const IconCareer = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)
const IconUrgent = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)
const IconWalkIn = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1"/><path d="M9 20l3-8 3 8"/><path d="M6 9l6 1 6-1"/>
  </svg>
)
const IconProfile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

// ── Quick-access cards config ─────────────────────────────────────────────
const CARDS = [
  {
    id: 'jobs',
    label: 'Browse Jobs',
    desc: 'Explore thousands of full-time openings',
    path: '/jobs',
    color: '#6366f1',
    bg: '#eef2ff',
    Icon: IconBriefcase,
  },
  {
    id: 'urgent',
    label: 'Urgent Hiring',
    desc: 'Companies hiring right now — apply fast',
    path: '/urgent-hiring',
    color: '#ef4444',
    bg: '#fef2f2',
    Icon: IconUrgent,
  },
  {
    id: 'internships',
    label: 'Internships',
    desc: 'Kick-start your career with an internship',
    path: '/internships',
    color: '#10b981',
    bg: '#ecfdf5',
    Icon: IconIntern,
  },
  {
    id: 'walkin',
    label: 'Walk-in Drives',
    desc: 'Attend walk-in interviews near you',
    path: '/walk-in',
    color: '#f59e0b',
    bg: '#fffbeb',
    Icon: IconWalkIn,
  },
  {
    id: 'companies',
    label: 'Companies',
    desc: 'Discover top employers and their culture',
    path: '/companies',
    color: '#3b82f6',
    bg: '#eff6ff',
    Icon: IconCompany,
  },
  {
    id: 'courses',
    label: 'Courses',
    desc: 'Upskill with curated learning resources',
    path: '/courses',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    Icon: IconCourse,
  },
  {
    id: 'career',
    label: 'Career Advice',
    desc: 'Tips, guides, and resume templates',
    path: '/career',
    color: '#06b6d4',
    bg: '#ecfeff',
    Icon: IconCareer,
  },
  {
    id: 'profile',
    label: 'My Profile',
    desc: 'Update your info and account settings',
    path: '/dashboard/profile',
    color: '#64748b',
    bg: '#f8fafc',
    Icon: IconProfile,
  },
]

// ── Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = observer(() => {
  const { authStore } = useStores()
  const navigate = useNavigate()
  const name = authStore.user?.name || authStore.userName || 'there'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="dash-container">
      {/* Welcome banner */}
      <div className="dash-banner">
        <div className="dash-banner-text">
          <h1 className="dash-banner-title">{greeting}, {name}!</h1>
          <p className="dash-banner-sub">
            Welcome to HireVerse — your launchpad for every career opportunity.
          </p>
        </div>
        <div className="dash-banner-art" aria-hidden="true">
          <div className="dash-banner-circle dash-banner-circle--1" />
          <div className="dash-banner-circle dash-banner-circle--2" />
          <div className="dash-banner-circle dash-banner-circle--3" />
        </div>
      </div>

      {/* Section heading */}
      <div className="dash-section-head">
        <h2 className="dash-section-title">What are you looking for?</h2>
        <p className="dash-section-sub">Jump to any section from here</p>
      </div>

      {/* Quick-access grid */}
      <div className="dash-grid">
        {CARDS.map(({ id, label, desc, path, color, bg, Icon }) => (
          <button
            key={id}
            className="dash-card"
            onClick={() => navigate(path)}
            style={{ '--card-color': color, '--card-bg': bg }}
          >
            <div className="dash-card-icon">
              <Icon />
            </div>
            <div className="dash-card-body">
              <p className="dash-card-label">{label}</p>
              <p className="dash-card-desc">{desc}</p>
            </div>
            <span className="dash-card-arrow">
              <IconArrow />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
})

export default Dashboard
