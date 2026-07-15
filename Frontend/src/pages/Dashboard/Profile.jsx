import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from '@hooks/useStores'
import validationAxios from '@api/validationAxios'
import './Profile.css'

// ── Role config ───────────────────────────────────────────────────────────
const ROLE_META = {
  super_admin: { label: 'Super Admin', bg: '#7c3aed', color: '#fff' },
  admin:       { label: 'Admin',       bg: '#2563eb', color: '#fff' },
  user:        { label: 'User',        bg: '#e2e8f0', color: '#475569' },
}

// ── Tab icons ─────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const ActivityIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)
const MapPinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const CalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const EmailIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)
const EyeIcon = ({ show }) => show ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

// ── Password field ────────────────────────────────────────────────────────
function PwdField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="pf-field">
      <label className="pf-label">{label}</label>
      <div className="pf-pwd-wrap">
        <input
          type={show ? 'text' : 'password'}
          className="pf-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
        />
        <button type="button" className="pf-eye" onClick={() => setShow(v => !v)}>
          <EyeIcon show={show} />
        </button>
      </div>
    </div>
  )
}

// ── Toast notification ────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className={`pf-toast pf-toast--${type}`}>
      <span>{msg}</span>
      <button onClick={onClose}>✕</button>
    </div>
  )
}

// ── Main Profile component ────────────────────────────────────────────────
const Profile = observer(() => {
  const { authStore } = useStores()
  const role     = authStore.role
  const roleMeta = ROLE_META[role] || ROLE_META.user

  const [tab,      setTab]      = useState('personal')
  const [saving,   setSaving]   = useState(false)
  const [toast,    setToast]    = useState(null)
  const [valStats, setValStats] = useState(null)

  // Personal info form
  const u = authStore.user || {}
  const [name,       setName]       = useState(u.name       || '')
  const [phone,      setPhone]      = useState(u.phone      || '')
  const [bio,        setBio]        = useState(u.bio        || '')
  const [city,       setCity]       = useState(u.city       || '')
  const [country,    setCountry]    = useState(u.country    || '')
  const [postalCode, setPostalCode] = useState(u.postalCode || '')

  // Security form
  const [curPwd,  setCurPwd]  = useState('')
  const [newPwd,  setNewPwd]  = useState('')
  const [confPwd, setConfPwd] = useState('')
  const [pwdErr,  setPwdErr]  = useState('')

  // Load full profile + validation stats on mount
  useEffect(() => {
    authStore.loadProfile().then(() => {
      const p = authStore.user || {}
      setName(p.name || '')
      setPhone(p.phone || '')
      setBio(p.bio || '')
      setCity(p.city || '')
      setCountry(p.country || '')
      setPostalCode(p.postalCode || '')
    })
    validationAxios.get('/validate/stats')
      .then(({ data }) => setValStats(data))
      .catch(() => {})
  }, [])

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  // Save personal info
  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await authStore.updateProfile({ name, phone, bio, city, country, postalCode })
      showToast('Profile updated successfully')
    } catch (err) {
      showToast(err.message || 'Update failed', 'error')
    } finally { setSaving(false) }
  }

  // Change password
  const handleChangePwd = async (e) => {
    e.preventDefault()
    setPwdErr('')
    if (newPwd !== confPwd) { setPwdErr('New passwords do not match'); return }
    if (newPwd.length < 8)  { setPwdErr('Password must be at least 8 characters'); return }
    setSaving(true)
    try {
      await authStore.changePassword(curPwd, newPwd)
      setCurPwd(''); setNewPwd(''); setConfPwd('')
      showToast('Password changed successfully')
    } catch (err) {
      setPwdErr(err.message || 'Failed to change password')
    } finally { setSaving(false) }
  }

  const user      = authStore.user || {}
  const initials  = (user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'
  const lastLogin   = user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
  const location    = [user.city, user.country].filter(Boolean).join(', ') || '—'

  return (
    <div className="pf-container">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="pf-page-header">
        <h1 className="pf-page-title">Profile</h1>
        <p className="pf-page-sub">Manage your personal information and account security</p>
      </div>

      <div className="pf-layout">
        {/* ── Left profile card ── */}
        <aside className="pf-sidebar">
          {/* Avatar */}
          <div className="pf-avatar-section">
            <div className="pf-avatar-ring">
              <div className="pf-avatar">{initials}</div>
            </div>
            <div className="pf-avatar-info">
              <h2 className="pf-user-name">{user.name || '—'}</h2>
              <span className="pf-role-badge" style={{ background: roleMeta.bg, color: roleMeta.color }}>
                {roleMeta.label}
              </span>
            </div>
          </div>

          {/* Info rows */}
          <div className="pf-info-rows">
            <div className="pf-info-row"><EmailIcon /><span>{user.email || '—'}</span></div>
            {user.phone && <div className="pf-info-row"><PhoneIcon /><span>{user.phone}</span></div>}
            {location !== '—' && <div className="pf-info-row"><MapPinIcon /><span>{location}</span></div>}
            <div className="pf-info-row"><CalIcon /><span>Member since {memberSince}</span></div>
            <div className="pf-info-row"><CalIcon /><span>Last login {lastLogin}</span></div>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="pf-bio-section">
              <p className="pf-bio-text">"{user.bio}"</p>
            </div>
          )}

          {/* Validation stats */}
          {valStats && (
            <div className="pf-stats-section">
              <p className="pf-stats-title">Your Stats</p>
              <div className="pf-stats-grid">
                <div className="pf-stat">
                  <span className="pf-stat-val" style={{ color: '#6366f1' }}>
                    {(valStats.totalValidated || 0).toLocaleString()}
                  </span>
                  <span className="pf-stat-lbl">Validated</span>
                </div>
                <div className="pf-stat">
                  <span className="pf-stat-val" style={{ color: '#10b981' }}>
                    {(valStats.stats?.valid || 0).toLocaleString()}
                  </span>
                  <span className="pf-stat-lbl">Delivered</span>
                </div>
                <div className="pf-stat">
                  <span className="pf-stat-val" style={{ color: '#3b82f6' }}>
                    {(valStats.totalBulkJobs || 0).toLocaleString()}
                  </span>
                  <span className="pf-stat-lbl">Bulk Jobs</span>
                </div>
                <div className="pf-stat">
                  <span className="pf-stat-val" style={{ color: '#f59e0b' }}>
                    {(valStats.stats?.risky || 0).toLocaleString()}
                  </span>
                  <span className="pf-stat-lbl">Risky</span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ── Right content ── */}
        <div className="pf-main">
          {/* Tabs */}
          <div className="pf-tabs">
            {[
              { key: 'personal', label: 'Personal Info', icon: <UserIcon /> },
              { key: 'security', label: 'Security',      icon: <LockIcon /> },
              { key: 'activity', label: 'Activity',      icon: <ActivityIcon /> },
            ].map(t => (
              <button
                key={t.key}
                className={`pf-tab ${tab === t.key ? 'pf-tab--active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* ── Personal Info tab ── */}
          {tab === 'personal' && (
            <form className="pf-form" onSubmit={handleSave}>
              <div className="pf-section">
                <h3 className="pf-section-title">Personal Information</h3>
                <div className="pf-form-grid">
                  <div className="pf-field">
                    <label className="pf-label">Full Name</label>
                    <input className="pf-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
                  </div>
                  <div className="pf-field">
                    <label className="pf-label">Email Address <span className="pf-read-only-tag">Read only</span></label>
                    <input className="pf-input pf-input--readonly" value={user.email || ''} readOnly />
                  </div>
                  <div className="pf-field">
                    <label className="pf-label">Phone Number</label>
                    <input className="pf-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 8900" type="tel" />
                  </div>
                  <div className="pf-field pf-field--full">
                    <label className="pf-label">Bio <span className="pf-optional">optional</span></label>
                    <textarea className="pf-textarea" value={bio} onChange={e => setBio(e.target.value)} placeholder="A short description about yourself…" rows={3} maxLength={500} />
                    <span className="pf-char-count">{bio.length}/500</span>
                  </div>
                </div>
              </div>

              <div className="pf-section">
                <h3 className="pf-section-title">Location</h3>
                <div className="pf-form-grid">
                  <div className="pf-field">
                    <label className="pf-label">City</label>
                    <input className="pf-input" value={city} onChange={e => setCity(e.target.value)} placeholder="San Francisco" />
                  </div>
                  <div className="pf-field">
                    <label className="pf-label">Country</label>
                    <input className="pf-input" value={country} onChange={e => setCountry(e.target.value)} placeholder="United States" />
                  </div>
                  <div className="pf-field">
                    <label className="pf-label">Postal Code</label>
                    <input className="pf-input" value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="94105" />
                  </div>
                </div>
              </div>

              <div className="pf-form-actions">
                <button type="submit" className="pf-btn-primary" disabled={saving}>
                  {saving ? <><span className="pf-spin" /> Saving…</> : 'Save Changes'}
                </button>
                <button type="button" className="pf-btn-ghost" onClick={() => {
                  const p = authStore.user || {}
                  setName(p.name || ''); setPhone(p.phone || ''); setBio(p.bio || '')
                  setCity(p.city || ''); setCountry(p.country || ''); setPostalCode(p.postalCode || '')
                }}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* ── Security tab ── */}
          {tab === 'security' && (
            <form className="pf-form" onSubmit={handleChangePwd}>
              <div className="pf-section">
                <h3 className="pf-section-title">Change Password</h3>
                <p className="pf-section-desc">Use a strong password that you don't use elsewhere</p>
                <div className="pf-form-grid pf-form-grid--single">
                  <PwdField label="Current Password" value={curPwd} onChange={setCurPwd} placeholder="Enter current password" />
                  <PwdField label="New Password" value={newPwd} onChange={setNewPwd} placeholder="Min. 8 characters" />
                  <PwdField label="Confirm New Password" value={confPwd} onChange={setConfPwd} placeholder="Repeat new password" />
                  {pwdErr && <p className="pf-error">{pwdErr}</p>}
                </div>
              </div>

              {/* Password strength */}
              {newPwd.length > 0 && (
                <div className="pf-strength-wrap">
                  <div className="pf-strength-bar">
                    {[1,2,3,4].map(i => {
                      const lvl = newPwd.length >= 12 && /[A-Z]/.test(newPwd) && /\d/.test(newPwd) && /[^A-Za-z0-9]/.test(newPwd) ? 4
                        : newPwd.length >= 10 && /[A-Z]/.test(newPwd) && /\d/.test(newPwd) ? 3
                        : newPwd.length >= 8 ? 2 : 1
                      const colors = ['#ef4444','#f59e0b','#3b82f6','#10b981']
                      return <div key={i} className="pf-strength-seg" style={{ background: i <= lvl ? colors[lvl - 1] : '#e2e8f0' }} />
                    })}
                  </div>
                  <span className="pf-strength-label" style={{ color: ['#ef4444','#f59e0b','#3b82f6','#10b981'][
                    (newPwd.length >= 12 && /[A-Z]/.test(newPwd) && /\d/.test(newPwd) && /[^A-Za-z0-9]/.test(newPwd) ? 3 :
                     newPwd.length >= 10 && /[A-Z]/.test(newPwd) && /\d/.test(newPwd) ? 2 :
                     newPwd.length >= 8 ? 1 : 0)] }}>
                    {['Weak','Fair','Good','Strong'][
                      newPwd.length >= 12 && /[A-Z]/.test(newPwd) && /\d/.test(newPwd) && /[^A-Za-z0-9]/.test(newPwd) ? 3 :
                      newPwd.length >= 10 && /[A-Z]/.test(newPwd) && /\d/.test(newPwd) ? 2 :
                      newPwd.length >= 8 ? 1 : 0]}
                  </span>
                </div>
              )}

              <div className="pf-form-actions">
                <button type="submit" className="pf-btn-primary" disabled={saving || !curPwd || !newPwd || !confPwd}>
                  {saving ? <><span className="pf-spin" /> Updating…</> : 'Update Password'}
                </button>
              </div>
            </form>
          )}

          {/* ── Activity tab ── */}
          {tab === 'activity' && (
            <div className="pf-form">
              <div className="pf-section">
                <h3 className="pf-section-title">Account Activity</h3>
                <div className="pf-activity-list">
                  <div className="pf-activity-row">
                    <div className="pf-activity-dot" style={{ background: '#10b981' }} />
                    <div>
                      <p className="pf-activity-title">Account created</p>
                      <p className="pf-activity-time">{memberSince}</p>
                    </div>
                  </div>
                  <div className="pf-activity-row">
                    <div className="pf-activity-dot" style={{ background: '#6366f1' }} />
                    <div>
                      <p className="pf-activity-title">Last login</p>
                      <p className="pf-activity-time">{lastLogin}</p>
                    </div>
                  </div>
                  {user.geoInfo?.city && (
                    <div className="pf-activity-row">
                      <div className="pf-activity-dot" style={{ background: '#3b82f6' }} />
                      <div>
                        <p className="pf-activity-title">Last login location</p>
                        <p className="pf-activity-time">{[user.geoInfo.city, user.geoInfo.regionName, user.geoInfo.country].filter(Boolean).join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {user.geoInfo?.isp && (
                    <div className="pf-activity-row">
                      <div className="pf-activity-dot" style={{ background: '#f59e0b' }} />
                      <div>
                        <p className="pf-activity-title">Internet Provider</p>
                        <p className="pf-activity-time">{user.geoInfo.isp}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pf-section">
                <h3 className="pf-section-title">Account Info</h3>
                <div className="pf-info-table">
                  {[
                    ['User ID',      user._id || user.id || '—'],
                    ['Role',         roleMeta.label],
                    ['Status',       user.isVerified ? 'Verified' : 'Pending verification'],
                    ['Account',      user.isActive ? 'Active' : 'Suspended'],
                    ['Tenant ID',    user.tenantId || '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="pf-info-table-row">
                      <span className="pf-info-key">{k}</span>
                      <span className="pf-info-val">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default Profile
