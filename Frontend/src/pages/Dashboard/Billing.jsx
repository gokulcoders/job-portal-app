import { useState, useEffect, useCallback } from 'react'
import { fetchBillingStats, fetchAdminUsers, updateAdminUserPlan } from '@services/api'
import './Billing.css'

const PLAN_META = {
  free:  { label: 'Free',  color: '#6b7280' },
  pro:   { label: 'Pro',   color: '#7c3aed' },
  teams: { label: 'Teams', color: '#0891b2' },
}

const WalletIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
  </svg>
)
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bl-stat-card">
      <div className="bl-stat-icon" style={{ background: `${color}18`, color }}>{icon}</div>
      <div>
        <p className="bl-stat-value">{value ?? '—'}</p>
        <p className="bl-stat-label">{label}</p>
      </div>
    </div>
  )
}

export default function Billing() {
  const [stats, setStats]     = useState(null)
  const [users, setUsers]     = useState([])
  const [total, setTotal]     = useState(0)
  const [planFilter, setPlanFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [saving, setSaving]   = useState({})
  const [toast, setToast]     = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    fetchBillingStats().then(setStats).catch(() => {})
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchAdminUsers({ limit: 50, plan: planFilter || undefined })
      .then(data => { setUsers(data.users); setTotal(data.total) })
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false))
  }, [planFilter])

  useEffect(() => { load() }, [load])

  async function handlePlanChange(user, plan) {
    setSaving(s => ({ ...s, [user._id]: true }))
    try {
      const { user: updated } = await updateAdminUserPlan(user._id, plan)
      setUsers(prev => planFilter && updated.plan !== planFilter
        ? prev.filter(u => u._id !== updated._id)
        : prev.map(u => u._id === updated._id ? { ...u, plan: updated.plan } : u))
      showToast(`${user.name}'s plan set to ${PLAN_META[updated.plan].label}`)
      fetchBillingStats().then(setStats).catch(() => {})
    } catch {
      showToast('Failed to update plan', 'error')
    } finally {
      setSaving(s => ({ ...s, [user._id]: false }))
    }
  }

  const mrr = stats?.mrr ?? 0

  return (
    <div className="bl-root">
      {toast && <div className={`bl-toast bl-toast--${toast.type}`}>{toast.msg}</div>}

      <div className="bl-header">
        <h1 className="bl-title">Billing</h1>
        <p className="bl-sub">Platform-wide subscription overview — mock plans, no real payment gateway wired up</p>
      </div>

      <div className="bl-stats-grid">
        <StatCard icon={<WalletIcon />} label="Estimated MRR" value={`₹${mrr.toLocaleString('en-IN')}`} color="#16a34a" />
        <StatCard icon={<UsersIcon />}  label="Free users"    value={stats?.planCounts.free}  color="#6b7280" />
        <StatCard icon={<UsersIcon />}  label="Pro users"     value={stats?.planCounts.pro}   color="#7c3aed" />
        <StatCard icon={<UsersIcon />}  label="Teams users"   value={stats?.planCounts.teams} color="#0891b2" />
      </div>

      <div className="bl-filters">
        <select className="bl-select" value={planFilter} onChange={e => setPlanFilter(e.target.value)}>
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="teams">Teams</option>
        </select>
        <span className="bl-filter-count">{total} user{total === 1 ? '' : 's'}</span>
      </div>

      <div className="bl-table-wrap">
        {error ? (
          <div className="bl-empty">{error}</div>
        ) : loading ? (
          <div className="bl-empty">Loading…</div>
        ) : users.length === 0 ? (
          <div className="bl-empty">No users on this plan.</div>
        ) : (
          <table className="bl-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Plan</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="bl-user-cell">
                      <div className="bl-avatar">{(user.name || user.email)[0].toUpperCase()}</div>
                      <div>
                        <p className="bl-name">{user.name || '—'}</p>
                        <p className="bl-email">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      className="bl-plan-select"
                      value={user.plan || 'free'}
                      disabled={!!saving[user._id]}
                      onChange={e => handlePlanChange(user, e.target.value)}
                      style={{ color: PLAN_META[user.plan || 'free'].color }}
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="teams">Teams</option>
                    </select>
                  </td>
                  <td className="bl-date">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
