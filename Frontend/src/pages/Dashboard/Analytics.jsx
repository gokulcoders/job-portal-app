import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAnalyticsOverview } from '@services/api'
import './Analytics.css'

// ── Icons ─────────────────────────────────────────────────────────────────
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const BriefcaseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)
const WalletIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
  </svg>
)
const CourseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
)
const BuildingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
  </svg>
)
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

// ── Palette (validated: PASS on CVD + normal-vision floors) ────────────────
const BLUE = '#2a78d6'
const BLUE_DARK = '#3987e5'
const SOURCE_COLORS = { linkedin: '#0a66c2', naukri: '#f97316' }
const PLAN_COLORS = { free: '#8a8f98', pro: '#7c3aed', teams: '#0891b2' }

function formatCompact(n) {
  if (n == null) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

// ── Stat tile ────────────────────────────────────────────────────────────
function StatTile({ icon, label, value, color }) {
  return (
    <div className="an-stat-tile">
      <div className="an-stat-icon" style={{ background: `${color}18`, color }}>{icon}</div>
      <div>
        <p className="an-stat-value">{value}</p>
        <p className="an-stat-label">{label}</p>
      </div>
    </div>
  )
}

// ── Line/area chart — single series, sequential blue, with crosshair ───────
function LineChart({ data, height = 180 }) {
  const [hover, setHover] = useState(null)
  const svgRef = useRef(null)
  const W = 600
  const H = height
  const padL = 8, padR = 8, padT = 16, padB = 24

  const max = Math.max(1, ...data.map(d => d.count))
  const stepX = (W - padL - padR) / Math.max(1, data.length - 1)
  const yFor = (v) => H - padB - (v / max) * (H - padT - padB)
  const xFor = (i) => padL + i * stepX

  const linePoints = data.map((d, i) => `${xFor(i)},${yFor(d.count)}`).join(' ')
  const areaPoints = `${padL},${H - padB} ${linePoints} ${xFor(data.length - 1)},${H - padB}`

  function handleMove(e) {
    const rect = svgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    const idx = Math.round((x - padL) / stepX)
    setHover(Math.max(0, Math.min(data.length - 1, idx)))
  }

  const yTicks = [0, Math.round(max / 2), max]

  return (
    <div className="an-chart-wrap">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="an-svg" preserveAspectRatio="none"
        onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
        {yTicks.map((t, i) => (
          <line key={i} x1={padL} x2={W - padR} y1={yFor(t)} y2={yFor(t)} className="an-gridline" />
        ))}
        <polygon points={areaPoints} fill={BLUE} opacity="0.1" />
        <polyline points={linePoints} fill="none" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {hover != null && (
          <>
            <line x1={xFor(hover)} x2={xFor(hover)} y1={padT} y2={H - padB} className="an-crosshair" />
            <circle cx={xFor(hover)} cy={yFor(data[hover].count)} r="5" fill={BLUE} stroke="var(--bg-card)" strokeWidth="2" />
          </>
        )}
      </svg>
      {hover != null && (
        <div
          className="an-tooltip"
          style={{ left: `${(xFor(hover) / W) * 100}%`, top: `${(yFor(data[hover].count) / H) * 100}%` }}
        >
          <strong>{data[hover].count}</strong> signup{data[hover].count === 1 ? '' : 's'}
          <span>{new Date(data[hover].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
      )}
    </div>
  )
}

// ── Bar chart — categories compared by magnitude, single hue ───────────────
function BarChart({ data }) {
  const [hover, setHover] = useState(null)
  const max = Math.max(1, ...data.map(d => d.value))
  return (
    <div className="an-bars">
      {data.map((d, i) => (
        <div
          key={d.label}
          className="an-bar-row"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
        >
          <span className="an-bar-label">{d.label}</span>
          <div className="an-bar-track">
            <div
              className="an-bar-fill"
              style={{ width: `${(d.value / max) * 100}%`, background: hover === i ? BLUE_DARK : BLUE }}
            />
          </div>
          <span className="an-bar-value">{d.value}</span>
        </div>
      ))}
    </div>
  )
}

// ── Donut chart — part-to-whole, categorical, direct-labeled + legend ──────
function DonutChart({ segments }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1
  const R = 15.9155
  let cumulative = 0

  return (
    <div className="an-donut-wrap">
      <svg viewBox="0 0 40 40" className="an-donut-svg">
        <circle cx="20" cy="20" r={R} fill="none" className="an-donut-track" strokeWidth="6" />
        {segments.map(seg => {
          const pct = (seg.value / total) * 100
          const dash = `${pct} ${100 - pct}`
          const offset = 25 - cumulative
          cumulative += pct
          return (
            <circle
              key={seg.label}
              cx="20" cy="20" r={R} fill="none"
              stroke={seg.color} strokeWidth="6"
              strokeDasharray={dash} strokeDashoffset={offset}
              pathLength="100"
            />
          )
        })}
        <text x="20" y="19" textAnchor="middle" className="an-donut-center-value">{total}</text>
        <text x="20" y="25" textAnchor="middle" className="an-donut-center-label">total</text>
      </svg>
      <div className="an-donut-legend">
        {segments.map(seg => (
          <div key={seg.label} className="an-donut-legend-row">
            <span className="an-donut-swatch" style={{ background: seg.color }} />
            <span className="an-donut-legend-label">{seg.label}</span>
            <span className="an-donut-legend-value">{seg.value} · {total ? Math.round((seg.value / total) * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Analytics() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalyticsOverview()
      .then(setData)
      .catch(() => setError('Failed to load analytics.'))
      .finally(() => setLoading(false))
  }, [])

  const jobTypeBars = useMemo(() => {
    if (!data) return []
    return [
      { label: 'Full-time', value: data.jobs.byType.fulltime },
      { label: 'Urgent', value: data.jobs.byType.urgent },
      { label: 'Walk-in', value: data.jobs.byType['walk-in'] },
      { label: 'Internship', value: data.jobs.byType.internship },
    ]
  }, [data])

  if (loading) return <div className="an-root"><div className="an-empty">Loading analytics…</div></div>
  if (error || !data) return <div className="an-root"><div className="an-empty">{error || 'No data.'}</div></div>

  const { users, jobs, courses, featuredPosts, billing, tenants, notifications } = data

  return (
    <div className="an-root">
      <div className="an-header">
        <h1 className="an-title">Analytics</h1>
        <p className="an-sub">Live platform overview — recomputed on every load</p>
      </div>

      {/* ── KPI row ── */}
      <div className="an-stats-grid">
        <StatTile icon={<UsersIcon />}      label="Total users"      value={formatCompact(users.total)}          color="#2a78d6" />
        <StatTile icon={<BriefcaseIcon />}  label="Total listings"   value={formatCompact(jobs.total)}           color="#eb6834" />
        <StatTile icon={<CourseIcon />}     label="Courses"          value={formatCompact(courses.totalCourses)} color="#4a3aa7" />
        <StatTile icon={<WalletIcon />}     label="Estimated MRR"    value={`₹${formatCompact(billing.mrr)}`}    color="#008300" />
        <StatTile icon={<BuildingIcon />}   label="Active tenants"   value={formatCompact(tenants.active)}       color="#1baf7a" />
        <StatTile icon={<BellIcon />}       label="Notifications sent" value={formatCompact(notifications.total)} color="#e34948" />
      </div>

      <div className="an-grid-2">
        {/* ── Signups over time ── */}
        <div className="an-card an-card-wide">
          <div className="an-card-head">
            <h2 className="an-card-title">User signups — last 30 days</h2>
            <span className="an-card-badge">{users.total} total · {users.verified} verified</span>
          </div>
          <LineChart data={users.signupsByDay} />
        </div>

        {/* ── Plan distribution ── */}
        <div className="an-card">
          <div className="an-card-head">
            <h2 className="an-card-title">Plan distribution</h2>
          </div>
          <DonutChart segments={[
            { label: 'Free',  value: billing.planCounts.free,  color: PLAN_COLORS.free },
            { label: 'Pro',   value: billing.planCounts.pro,   color: PLAN_COLORS.pro },
            { label: 'Teams', value: billing.planCounts.teams, color: PLAN_COLORS.teams },
          ]} />
          <button type="button" className="an-link-btn" onClick={() => navigate('/dashboard/billing')}>View billing →</button>
        </div>
      </div>

      <div className="an-grid-2">
        {/* ── Jobs by type ── */}
        <div className="an-card">
          <div className="an-card-head">
            <h2 className="an-card-title">Listings by type</h2>
            <span className="an-card-badge">{jobs.total} total</span>
          </div>
          <BarChart data={jobTypeBars} />
        </div>

        {/* ── Jobs by source ── */}
        <div className="an-card">
          <div className="an-card-head">
            <h2 className="an-card-title">Scraped jobs by source</h2>
          </div>
          <DonutChart segments={[
            { label: 'LinkedIn', value: jobs.bySource.linkedin, color: SOURCE_COLORS.linkedin },
            { label: 'Naukri',   value: jobs.bySource.naukri,   color: SOURCE_COLORS.naukri },
          ]} />
        </div>
      </div>

      <div className="an-grid-2">
        {/* ── Course engagement ── */}
        <div className="an-card">
          <div className="an-card-head">
            <h2 className="an-card-title">Course engagement</h2>
            <span className="an-card-badge">{courses.completionRate}% completion rate</span>
          </div>
          {courses.topCourses.length === 0 ? (
            <div className="an-empty an-empty-inline">No watch activity yet.</div>
          ) : (
            <div className="an-meter-list">
              {courses.topCourses.map(c => (
                <div key={c._id} className="an-meter-row">
                  <div className="an-meter-top">
                    <span className="an-meter-label">{c.title}</span>
                    <span className="an-meter-value">{c.avgProgress}% avg · {c.watchCount} viewer{c.watchCount === 1 ? '' : 's'}</span>
                  </div>
                  <div className="an-meter-track">
                    <div className="an-meter-fill" style={{ width: `${c.avgProgress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <button type="button" className="an-link-btn" onClick={() => navigate('/dashboard/courses-manager')}>Manage courses →</button>
        </div>

        {/* ── Recent signups ── */}
        <div className="an-card">
          <div className="an-card-head">
            <h2 className="an-card-title">Recent signups</h2>
          </div>
          {users.recentSignups.length === 0 ? (
            <div className="an-empty an-empty-inline">No signups yet.</div>
          ) : (
            <table className="an-table">
              <tbody>
                {users.recentSignups.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div className="an-user-cell">
                        <div className="an-avatar">{(u.name || u.email)[0].toUpperCase()}</div>
                        <div>
                          <p className="an-name">{u.name}</p>
                          <p className="an-email">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="an-date">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button type="button" className="an-link-btn" onClick={() => navigate('/dashboard/users')}>Manage users →</button>
        </div>
      </div>

      {/* ── Secondary stats footer ── */}
      <div className="an-footer-grid">
        <div className="an-footer-stat">
          <span className="an-footer-label">Featured posts</span>
          <span className="an-footer-value">{featuredPosts.active} active / {featuredPosts.total} total</span>
        </div>
        <div className="an-footer-stat">
          <span className="an-footer-label">Walk-in listings</span>
          <span className="an-footer-value">{jobs.walkInTotal}</span>
        </div>
        <div className="an-footer-stat">
          <span className="an-footer-label">Internship listings</span>
          <span className="an-footer-value">{jobs.internshipTotal}</span>
        </div>
        <div className="an-footer-stat">
          <span className="an-footer-label">Blocked users</span>
          <span className="an-footer-value">{users.inactive}</span>
        </div>
        <div className="an-footer-stat">
          <span className="an-footer-label">Unread notifications</span>
          <span className="an-footer-value">{notifications.unread}</span>
        </div>
        <div className="an-footer-stat">
          <span className="an-footer-label">Suspended tenants</span>
          <span className="an-footer-value">{tenants.suspended}</span>
        </div>
      </div>
    </div>
  )
}
