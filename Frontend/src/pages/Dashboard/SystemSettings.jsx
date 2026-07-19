import { useState, useEffect } from 'react'
import { fetchSettings, updateSettings } from '@services/api'
import './SystemSettings.css'

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className={`sys-toast sys-toast--${type}`}>
      <span>{msg}</span>
      <button onClick={onClose}>✕</button>
    </div>
  )
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      className={`sys-toggle ${checked ? 'sys-toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
    >
      <span className="sys-toggle-knob" />
    </button>
  )
}

export default function SystemSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [toast, setToast]       = useState(null)

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(() => showToast('Failed to load settings', 'error'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await updateSettings(settings)
      setSettings(updated)
      showToast('Settings saved')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="sys-root"><div className="sys-empty">Loading…</div></div>
  if (!settings) return <div className="sys-root"><div className="sys-empty">Could not load settings.</div></div>

  return (
    <div className="sys-root">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="sys-header">
        <h1 className="sys-title">System Settings</h1>
        <p className="sys-sub">Platform-wide configuration — changes take effect immediately for all users</p>
      </div>

      <form className="sys-card" onSubmit={handleSave}>
        <div className="sys-section">
          <h2 className="sys-section-title">General</h2>

          <div className="sys-field">
            <label className="sys-label">Site name</label>
            <input
              className="sys-input"
              value={settings.siteName}
              onChange={e => setSettings(s => ({ ...s, siteName: e.target.value }))}
            />
          </div>

          <div className="sys-field">
            <label className="sys-label">Support email <span className="sys-optional">optional</span></label>
            <input
              className="sys-input"
              type="email"
              value={settings.supportEmail}
              onChange={e => setSettings(s => ({ ...s, supportEmail: e.target.value }))}
              placeholder="support@yourdomain.com"
            />
          </div>
        </div>

        <div className="sys-section">
          <h2 className="sys-section-title">Access control</h2>

          <div className="sys-toggle-row">
            <div>
              <p className="sys-toggle-label">Allow new registrations</p>
              <p className="sys-toggle-desc">When off, the register page rejects new sign-ups</p>
            </div>
            <Toggle checked={settings.allowRegistrations} onChange={v => setSettings(s => ({ ...s, allowRegistrations: v }))} />
          </div>

          <div className="sys-toggle-row">
            <div>
              <p className="sys-toggle-label">Maintenance mode</p>
              <p className="sys-toggle-desc">Blocks regular users from logging in. Admins can still sign in.</p>
            </div>
            <Toggle checked={settings.maintenanceMode} onChange={v => setSettings(s => ({ ...s, maintenanceMode: v }))} />
          </div>

          {settings.maintenanceMode && (
            <div className="sys-warning">Maintenance mode is ON — regular users cannot log in right now.</div>
          )}
        </div>

        <div className="sys-form-actions">
          <button type="submit" className="sys-btn-primary" disabled={saving}>
            {saving ? <><span className="sys-spin" /> Saving…</> : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
