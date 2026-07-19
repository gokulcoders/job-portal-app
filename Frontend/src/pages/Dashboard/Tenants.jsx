import { useState, useEffect, useCallback } from 'react'
import { fetchTenants, createTenant, updateTenant, deleteTenant } from '@services/api'
import './Tenants.css'

const PLAN_META = {
  free:  { label: 'Free',  bg: '#e2e8f0', color: '#475569' },
  pro:   { label: 'Pro',   bg: '#ede9fe', color: '#6d28d9' },
  teams: { label: 'Teams', bg: '#cffafe', color: '#0e7490' },
}

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const BuildingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
    <line x1="9" y1="9" x2="9" y2="9.01"/><line x1="9" y1="12" x2="9" y2="12.01"/><line x1="9" y1="15" x2="9" y2="15.01"/>
  </svg>
)

function PlanBadge({ plan }) {
  const m = PLAN_META[plan] || PLAN_META.free
  return <span className="tn-plan-badge" style={{ background: m.bg, color: m.color }}>{m.label}</span>
}

function ConfirmModal({ tenant, onConfirm, onCancel }) {
  return (
    <div className="tn-overlay">
      <div className="tn-modal">
        <p className="tn-modal-title">Delete this tenant?</p>
        <p className="tn-modal-sub">
          <strong>{tenant.name}</strong> will be removed. Its {tenant.memberCount} member{tenant.memberCount === 1 ? '' : 's'} will stay as regular users, just unassigned from any tenant.
        </p>
        <div className="tn-modal-actions">
          <button type="button" className="tn-btn tn-btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="tn-btn tn-btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function Tenants() {
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [toast, setToast]     = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [saving, setSaving]   = useState({})

  const [form, setForm] = useState({ name: '', contactEmail: '', plan: 'free' })
  const [creating, setCreating] = useState(false)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchTenants()
      .then(setTenants)
      .catch(() => setError('Failed to load tenants.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      showToast('Tenant name is required', 'error')
      return
    }
    setCreating(true)
    try {
      const tenant = await createTenant(form)
      setTenants(prev => [{ ...tenant, memberCount: 0 }, ...prev])
      setForm({ name: '', contactEmail: '', plan: 'free' })
      showToast(`${tenant.name} created`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create tenant', 'error')
    } finally {
      setCreating(false)
    }
  }

  async function handleToggleStatus(tenant) {
    setSaving(s => ({ ...s, [tenant._id]: true }))
    try {
      const nextStatus = tenant.status === 'active' ? 'suspended' : 'active'
      const updated = await updateTenant(tenant._id, { status: nextStatus })
      setTenants(prev => prev.map(t => t._id === tenant._id ? { ...t, status: updated.status } : t))
      showToast(`${tenant.name} ${nextStatus === 'active' ? 'activated' : 'suspended'}`)
    } catch {
      showToast('Failed to update tenant', 'error')
    } finally {
      setSaving(s => ({ ...s, [tenant._id]: false }))
    }
  }

  async function handleDelete() {
    if (!toDelete) return
    try {
      await deleteTenant(toDelete._id)
      setTenants(prev => prev.filter(t => t._id !== toDelete._id))
      showToast(`${toDelete.name} deleted`)
    } catch {
      showToast('Failed to delete tenant', 'error')
    } finally {
      setToDelete(null)
    }
  }

  return (
    <div className="tn-root">
      {toast && <div className={`tn-toast tn-toast--${toast.type}`}>{toast.msg}</div>}
      {toDelete && <ConfirmModal tenant={toDelete} onConfirm={handleDelete} onCancel={() => setToDelete(null)} />}

      <div className="tn-header">
        <h1 className="tn-title">All Tenants</h1>
        <p className="tn-sub">{tenants.length} tenant{tenants.length === 1 ? '' : 's'}</p>
      </div>

      <div className="tn-layout">
        {/* ── Create form ── */}
        <form className="tn-form-card" onSubmit={handleCreate}>
          <h2 className="tn-card-title">New tenant</h2>
          <div className="tn-field">
            <label className="tn-label">Organization name *</label>
            <input className="tn-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Acme Corp" />
          </div>
          <div className="tn-field">
            <label className="tn-label">Contact email <span className="tn-optional">optional</span></label>
            <input className="tn-input" type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} placeholder="hr@acme.com" />
          </div>
          <div className="tn-field">
            <label className="tn-label">Plan</label>
            <select className="tn-input" value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="teams">Teams</option>
            </select>
          </div>
          <button type="submit" className="tn-btn tn-btn-primary" disabled={creating}>
            {creating ? 'Creating…' : 'Create tenant'}
          </button>
        </form>

        {/* ── Tenant list ── */}
        <div className="tn-table-wrap">
          {error ? (
            <div className="tn-empty">{error}</div>
          ) : loading ? (
            <div className="tn-empty">Loading…</div>
          ) : tenants.length === 0 ? (
            <div className="tn-empty"><BuildingIcon /><p>No tenants yet — create one to get started.</p></div>
          ) : (
            <table className="tn-table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Plan</th>
                  <th>Members</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(t => {
                  const isBusy = !!saving[t._id]
                  return (
                    <tr key={t._id} className={t.status === 'suspended' ? 'tn-row-suspended' : ''}>
                      <td>
                        <p className="tn-name">{t.name}</p>
                        <p className="tn-slug">{t.slug}{t.contactEmail ? ` · ${t.contactEmail}` : ''}</p>
                      </td>
                      <td><PlanBadge plan={t.plan} /></td>
                      <td className="tn-member-count">{t.memberCount}</td>
                      <td>
                        <button
                          type="button"
                          className={`tn-status-btn ${t.status === 'active' ? 'tn-status-active' : 'tn-status-suspended'}`}
                          disabled={isBusy}
                          onClick={() => handleToggleStatus(t)}
                        >
                          {t.status === 'active' ? 'Active' : 'Suspended'}
                        </button>
                      </td>
                      <td className="tn-date">{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <button type="button" className="tn-delete-btn" disabled={isBusy} onClick={() => setToDelete(t)} title="Delete tenant">
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
