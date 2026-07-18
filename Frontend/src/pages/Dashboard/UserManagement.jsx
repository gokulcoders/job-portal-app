import { useEffect, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from '@hooks/useStores'
import {
  fetchAdminUsers, fetchAdminUserStats, updateAdminUserRole,
  updateAdminUserStatus, deleteAdminUser, sendAdminUserNotification,
} from '@services/api'
import './UserManagement.css'

const ROLES     = ['user', 'admin', 'super_admin']
const ROLE_META = {
  user:        { label: 'User',        bg: '#e2e8f0', color: '#475569' },
  admin:       { label: 'Admin',       bg: '#dbeafe', color: '#1d4ed8' },
  super_admin: { label: 'Super Admin', bg: '#ede9fe', color: '#6d28d9' },
}
const NOTIF_TYPES = [
  { value: 'info',    label: 'Info',    color: '#3b82f6' },
  { value: 'success', label: 'Success', color: '#10b981' },
  { value: 'warning', label: 'Warning', color: '#f59e0b' },
  { value: 'error',   label: 'Alert',   color: '#ef4444' },
]

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const BellIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)
const BlockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="4.9" y1="4.9" x2="19.1" y2="19.1"/>
  </svg>
)
const CheckCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const UserCheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>
  </svg>
)
const UserXIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

function RoleBadge({ role }) {
  const m = ROLE_META[role] || ROLE_META.user
  return (
    <span className="um-role-badge" style={{ background: m.bg, color: m.color }}>
      {m.label}
    </span>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="um-stat-card">
      <div className="um-stat-icon" style={{ background: `${color}18`, color }}>{icon}</div>
      <div>
        <p className="um-stat-value">{value ?? '—'}</p>
        <p className="um-stat-label">{label}</p>
      </div>
    </div>
  )
}

function ConfirmModal({ user, onConfirm, onCancel }) {
  return (
    <div className="um-overlay">
      <div className="um-modal">
        <p className="um-modal-title">Delete user?</p>
        <p className="um-modal-sub">
          <strong>{user.name}</strong> ({user.email}) will be permanently removed. This cannot be undone.
        </p>
        <div className="um-modal-actions">
          <button type="button" className="um-btn um-btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="um-btn um-btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

function BlockModal({ user, onConfirm, onCancel }) {
  return (
    <div className="um-overlay">
      <div className="um-modal">
        <p className="um-modal-title">Block this user?</p>
        <p className="um-modal-sub">
          <strong>{user.name}</strong> ({user.email}) will lose access immediately. You can unblock them any time from this page.
        </p>
        <div className="um-modal-actions">
          <button type="button" className="um-btn um-btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="um-btn um-btn-danger" onClick={onConfirm}>Block user</button>
        </div>
      </div>
    </div>
  )
}

function NotifyModal({ user, onSend, onCancel, sending }) {
  const [message, setMessage] = useState('')
  const [type, setType]       = useState('info')

  return (
    <div className="um-overlay">
      <div className="um-modal um-modal-wide">
        <p className="um-modal-title">Notify {user.name}</p>
        <p className="um-modal-sub">Sends a message straight to their notification bell.</p>

        <div className="um-notify-types">
          {NOTIF_TYPES.map(t => (
            <button
              key={t.value}
              type="button"
              className={`um-notify-type ${type === t.value ? 'um-notify-type--active' : ''}`}
              style={type === t.value ? { background: t.color, borderColor: t.color, color: '#fff' } : { color: t.color, borderColor: `${t.color}55` }}
              onClick={() => setType(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <textarea
          className="um-notify-textarea"
          rows={3}
          maxLength={300}
          placeholder="Write a message for this user…"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <span className="um-notify-count">{message.length}/300</span>

        <div className="um-modal-actions">
          <button type="button" className="um-btn um-btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            type="button"
            className="um-btn um-btn-primary"
            disabled={!message.trim() || sending}
            onClick={() => onSend({ message: message.trim(), type })}
          >
            {sending ? 'Sending…' : 'Send notification'}
          </button>
        </div>
      </div>
    </div>
  )
}

const UserManagement = observer(() => {
  const { authStore } = useStores()
  const isSuperAdmin = authStore.role === 'super_admin'

  const [users,    setUsers]    = useState([])
  const [total,    setTotal]    = useState(0)
  const [pages,    setPages]    = useState(1)
  const [page,     setPage]     = useState(1)
  const [q,        setQ]        = useState('')
  const [roleFilter,   setRoleFilter]   = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [toBlock,  setToBlock]  = useState(null)
  const [toNotify, setToNotify] = useState(null)
  const [notifying, setNotifying] = useState(false)
  const [saving,   setSaving]   = useState({})
  const [toast,    setToast]    = useState(null)
  const [stats,    setStats]    = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchAdminUsers({ page, limit: 15, q: q.trim() || undefined, role: roleFilter || undefined, status: statusFilter || undefined })
      .then(data => { setUsers(data.users); setTotal(data.total); setPages(data.pages) })
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false))
  }, [page, q, roleFilter, statusFilter])

  useEffect(() => { load() }, [load])
  useEffect(() => { fetchAdminUserStats().then(setStats).catch(() => {}) }, [])

  async function handleRoleChange(user, newRole) {
    setSaving(s => ({ ...s, [user._id]: true }))
    try {
      const { user: updated } = await updateAdminUserRole(user._id, newRole)
      setUsers(prev => prev.map(u => u._id === updated._id ? { ...u, role: updated.role } : u))
      showToast(`${user.name}'s role updated to ${ROLE_META[updated.role].label}`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update role', 'error')
    } finally {
      setSaving(s => ({ ...s, [user._id]: false }))
    }
  }

  async function handleStatusToggle(user) {
    setSaving(s => ({ ...s, [user._id]: true }))
    try {
      const { user: updated } = await updateAdminUserStatus(user._id, !user.isActive)
      setUsers(prev => prev.map(u => u._id === updated._id ? { ...u, isActive: updated.isActive } : u))
      showToast(updated.isActive ? `${user.name} unblocked` : `${user.name} blocked`)
    } catch {
      showToast('Failed to update status', 'error')
    } finally {
      setSaving(s => ({ ...s, [user._id]: false }))
      setToBlock(null)
    }
  }

  async function handleDelete() {
    if (!toDelete) return
    try {
      await deleteAdminUser(toDelete._id)
      setUsers(prev => prev.filter(u => u._id !== toDelete._id))
      setTotal(t => t - 1)
      showToast(`${toDelete.name} deleted`)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user', 'error')
    } finally {
      setToDelete(null)
    }
  }

  async function handleSendNotification({ message, type }) {
    if (!toNotify) return
    setNotifying(true)
    try {
      await sendAdminUserNotification(toNotify._id, { message, type })
      showToast(`Notification sent to ${toNotify.name}`)
      setToNotify(null)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send notification', 'error')
    } finally {
      setNotifying(false)
    }
  }

  return (
    <div className="um-root">
      {toast && <div className={`um-toast um-toast--${toast.type}`}>{toast.msg}</div>}
      {toDelete && <ConfirmModal user={toDelete} onConfirm={handleDelete} onCancel={() => setToDelete(null)} />}
      {toBlock && <BlockModal user={toBlock} onConfirm={() => handleStatusToggle(toBlock)} onCancel={() => setToBlock(null)} />}
      {toNotify && <NotifyModal user={toNotify} onSend={handleSendNotification} onCancel={() => setToNotify(null)} sending={notifying} />}

      <div className="um-header">
        <div>
          <h1 className="um-title">User Management</h1>
          <p className="um-sub">{total} total users</p>
        </div>
      </div>

      {/* Stats */}
      <div className="um-stats-grid">
        <StatCard icon={<UsersIcon />}      label="Total users" value={stats?.total}    color="#6366f1" />
        <StatCard icon={<UserCheckIcon />}  label="Active"      value={stats?.active}   color="#10b981" />
        <StatCard icon={<UserXIcon />}      label="Blocked"     value={stats?.inactive} color="#ef4444" />
        <StatCard icon={<ShieldIcon />}     label="Admins"      value={stats?.admins}   color="#7c3aed" />
      </div>

      {/* Filters */}
      <div className="um-filters">
        <div className="um-search-wrap">
          <SearchIcon />
          <input
            className="um-search"
            type="text"
            placeholder="Search by name or email…"
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1) }}
          />
        </div>

        <select className="um-select" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1) }}>
          <option value="">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
        </select>

        <select className="um-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div className="um-table-wrap">
        {error ? (
          <div className="um-empty">{error}</div>
        ) : loading ? (
          <div className="um-empty">Loading…</div>
        ) : users.length === 0 ? (
          <div className="um-empty">No users found.</div>
        ) : (
          <table className="um-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const isBusy = !!saving[user._id]
                const isSelf = user._id === authStore.user?._id
                return (
                  <tr key={user._id} className={!user.isActive ? 'um-row-inactive' : ''}>
                    <td>
                      <div className="um-user-cell">
                        <div className="um-avatar">{(user.name || user.email)[0].toUpperCase()}</div>
                        <div>
                          <p className="um-name">{user.name || '—'}</p>
                          <p className="um-email">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      {isSuperAdmin ? (
                        <select
                          className="um-role-select"
                          value={user.role}
                          disabled={isBusy}
                          onChange={e => handleRoleChange(user, e.target.value)}
                        >
                          {ROLES.map(r => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
                        </select>
                      ) : (
                        <RoleBadge role={user.role} />
                      )}
                    </td>
                    <td>
                      <span className={`um-status-pill ${user.isActive ? 'um-status-active' : 'um-status-inactive'}`}>
                        {user.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="um-date">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="um-date">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td>
                      <div className="um-actions">
                        <button
                          type="button"
                          className="um-action-btn um-action-notify"
                          disabled={isBusy}
                          onClick={() => setToNotify(user)}
                          title="Send notification"
                        >
                          <BellIcon />
                        </button>
                        <button
                          type="button"
                          className={`um-action-btn ${user.isActive ? 'um-action-block' : 'um-action-unblock'}`}
                          disabled={isBusy || isSelf}
                          onClick={() => user.isActive ? setToBlock(user) : handleStatusToggle(user)}
                          title={isSelf ? "You can't block yourself" : user.isActive ? 'Block user' : 'Unblock user'}
                        >
                          {user.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                        </button>
                        {isSuperAdmin && (
                          <button
                            type="button"
                            className="um-action-btn um-action-delete"
                            disabled={isBusy || isSelf}
                            onClick={() => setToDelete(user)}
                            title={isSelf ? "You can't delete yourself" : 'Delete user'}
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="um-pagination">
          <button className="um-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span className="um-page-info">Page {page} of {pages}</span>
          <button className="um-page-btn" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  )
})

export default UserManagement
