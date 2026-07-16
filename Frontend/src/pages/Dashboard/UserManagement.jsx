import { useEffect, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from '@hooks/useStores'
import { fetchAdminUsers, updateAdminUserRole, updateAdminUserStatus, deleteAdminUser } from '@services/api'
import './UserManagement.css'

const ROLES     = ['user', 'admin', 'super_admin']
const ROLE_META = {
  user:        { label: 'User',        bg: '#e2e8f0', color: '#475569' },
  admin:       { label: 'Admin',       bg: '#dbeafe', color: '#1d4ed8' },
  super_admin: { label: 'Super Admin', bg: '#ede9fe', color: '#6d28d9' },
}

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

function RoleBadge({ role }) {
  const m = ROLE_META[role] || ROLE_META.user
  return (
    <span className="um-role-badge" style={{ background: m.bg, color: m.color }}>
      {m.label}
    </span>
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
  const [saving,   setSaving]   = useState({})

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchAdminUsers({ page, limit: 15, q: q.trim() || undefined, role: roleFilter || undefined, status: statusFilter || undefined })
      .then(data => { setUsers(data.users); setTotal(data.total); setPages(data.pages) })
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false))
  }, [page, q, roleFilter, statusFilter])

  useEffect(() => { load() }, [load])

  async function handleRoleChange(user, newRole) {
    setSaving(s => ({ ...s, [user._id]: true }))
    try {
      const { user: updated } = await updateAdminUserRole(user._id, newRole)
      setUsers(prev => prev.map(u => u._id === updated._id ? { ...u, role: updated.role } : u))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role')
    } finally {
      setSaving(s => ({ ...s, [user._id]: false }))
    }
  }

  async function handleStatusToggle(user) {
    setSaving(s => ({ ...s, [user._id]: true }))
    try {
      const { user: updated } = await updateAdminUserStatus(user._id, !user.isActive)
      setUsers(prev => prev.map(u => u._id === updated._id ? { ...u, isActive: updated.isActive } : u))
    } catch {
      alert('Failed to update status')
    } finally {
      setSaving(s => ({ ...s, [user._id]: false }))
    }
  }

  async function handleDelete() {
    if (!toDelete) return
    try {
      await deleteAdminUser(toDelete._id)
      setUsers(prev => prev.filter(u => u._id !== toDelete._id))
      setTotal(t => t - 1)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
    } finally {
      setToDelete(null)
    }
  }

  return (
    <div className="um-root">
      {toDelete && <ConfirmModal user={toDelete} onConfirm={handleDelete} onCancel={() => setToDelete(null)} />}

      <div className="um-header">
        <div>
          <h1 className="um-title">User Management</h1>
          <p className="um-sub">{total} total users</p>
        </div>
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
          <option value="inactive">Inactive</option>
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
                {isSuperAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const isBusy = !!saving[user._id]
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
                      <button
                        type="button"
                        className={`um-status-btn ${user.isActive ? 'um-status-active' : 'um-status-inactive'}`}
                        disabled={isBusy}
                        onClick={() => handleStatusToggle(user)}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="um-date">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="um-date">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    {isSuperAdmin && (
                      <td>
                        <button
                          type="button"
                          className="um-delete-btn"
                          disabled={isBusy}
                          onClick={() => setToDelete(user)}
                          title="Delete user"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    )}
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
