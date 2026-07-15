import { observer } from 'mobx-react-lite'
import { useStores } from '@hooks/useStores'
import { IconX } from '@components/icons'
import { THEME_COLORS } from '@stores/ThemeStore'

// ── Toggle switch ─────────────────────────────────────────────────────
function Toggle({ checked, onChange, id }) {
  return (
    <label htmlFor={id} className="toggle-wrap" aria-label="Toggle">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="toggle-input" />
      <span className={`toggle-track ${checked ? 'toggle-track--on' : ''}`}>
        <span className="toggle-thumb" />
      </span>
    </label>
  )
}

// ── Layout preview mini-card ──────────────────────────────────────────
function LayoutCard({ id, label, active, onClick, preview }) {
  return (
    <button
      type="button"
      className={`layout-card ${active ? 'layout-card--active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
      title={label}
    >
      <div className="layout-preview">{preview}</div>
      <span className="layout-card-label">{label}</span>
    </button>
  )
}

// Tiny SVG previews for layout options
const LayoutPreviews = {
  collapsible: (
    <svg viewBox="0 0 60 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="60" height="45" rx="3" fill="#f3f4f6"/>
      <rect x="0" y="0" width="14" height="45" rx="3" fill="#e0e7ff"/>
      <rect x="16" y="0" width="44" height="9" rx="2" fill="#c7d2fe"/>
      <rect x="18" y="13" width="38" height="4" rx="1" fill="#e5e7eb"/>
      <rect x="18" y="20" width="30" height="4" rx="1" fill="#e5e7eb"/>
      <rect x="18" y="27" width="34" height="4" rx="1" fill="#e5e7eb"/>
    </svg>
  ),
  stacked: (
    <svg viewBox="0 0 60 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="60" height="45" rx="3" fill="#f3f4f6"/>
      <rect x="0" y="0" width="60" height="9"  rx="3" fill="#c7d2fe"/>
      <rect x="0" y="9" width="60" height="7"  fill="#e0e7ff"/>
      <rect x="4" y="20" width="52" height="4" rx="1" fill="#e5e7eb"/>
      <rect x="4" y="27" width="40" height="4" rx="1" fill="#e5e7eb"/>
      <rect x="4" y="34" width="46" height="4" rx="1" fill="#e5e7eb"/>
    </svg>
  ),
  'top-bar': (
    <svg viewBox="0 0 60 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="60" height="45" rx="3" fill="#f3f4f6"/>
      <rect x="0" y="0" width="60" height="10" rx="3" fill="#c7d2fe"/>
      <rect x="4" y="14" width="52" height="4" rx="1" fill="#e5e7eb"/>
      <rect x="4" y="21" width="38" height="4" rx="1" fill="#e5e7eb"/>
      <rect x="4" y="28" width="44" height="4" rx="1" fill="#e5e7eb"/>
    </svg>
  ),
  frameless: (
    <svg viewBox="0 0 60 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="60" height="45" rx="3" fill="#f3f4f6"/>
      <rect x="0" y="0" width="13" height="45" rx="2" fill="#e0e7ff"/>
      <rect x="15" y="4" width="41" height="6"  rx="1" fill="#c7d2fe"/>
      <rect x="15" y="14" width="41" height="4" rx="1" fill="#e5e7eb"/>
      <rect x="15" y="21" width="30" height="4" rx="1" fill="#e5e7eb"/>
      <rect x="15" y="28" width="35" height="4" rx="1" fill="#e5e7eb"/>
    </svg>
  ),
  overlay: (
    <svg viewBox="0 0 60 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="60" height="45" rx="3" fill="#f3f4f6"/>
      <rect x="0" y="0" width="60" height="9"  rx="3" fill="#c7d2fe"/>
      <rect x="4" y="13" width="52" height="4" rx="1" fill="#e5e7eb"/>
      <rect x="4" y="20" width="38" height="4" rx="1" fill="#e5e7eb"/>
      <rect x="4" y="27" width="45" height="4" rx="1" fill="#e5e7eb"/>
      <rect x="0" y="9" width="18" height="36" fill="#e0e7ff" fillOpacity="0.8"/>
    </svg>
  ),
  blank: (
    <svg viewBox="0 0 60 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="60" height="45" rx="3" fill="#f3f4f6"/>
      <rect x="4" y="8"  width="52" height="4" rx="1" fill="#e5e7eb"/>
      <rect x="4" y="16" width="38" height="4" rx="1" fill="#e5e7eb"/>
      <rect x="4" y="24" width="44" height="4" rx="1" fill="#e5e7eb"/>
      <rect x="4" y="32" width="30" height="4" rx="1" fill="#e5e7eb"/>
    </svg>
  ),
}

const LAYOUTS = [
  { id: 'collapsible', label: 'Collapsible' },
  { id: 'stacked',     label: 'Stacked' },
  { id: 'top-bar',     label: 'Top bar' },
  { id: 'frameless',   label: 'Frameless' },
  { id: 'overlay',     label: 'Overlay' },
  { id: 'blank',       label: 'Blank' },
]

const COLOR_OPTIONS = [
  { id: 'blue',   hex: '#3b82f6' },
  { id: 'black',  hex: '#1f2937' },
  { id: 'green',  hex: '#10b981' },
  { id: 'purple', hex: '#8b5cf6' },
  { id: 'orange', hex: '#f97316' },
]

// ── ThemeConfigPanel ──────────────────────────────────────────────────
const ThemeConfigPanel = observer(() => {
  const { themeStore } = useStores()

  if (!themeStore.themeConfigOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="theme-backdrop" onClick={() => themeStore.closeThemeConfig()} />

      {/* Panel */}
      <div className="theme-panel" role="dialog" aria-label="Theme configuration">
        {/* Header */}
        <div className="theme-panel-header">
          <h2 className="theme-panel-title">Theme Config</h2>
          <button
            id="theme-panel-close"
            type="button"
            className="theme-panel-close"
            onClick={() => themeStore.closeThemeConfig()}
            aria-label="Close"
          >
            <IconX />
          </button>
        </div>

        <div className="theme-panel-body">
          {/* Dark mode */}
          <div className="theme-row">
            <div>
              <p className="theme-row-label">Dark Mode</p>
              <p className="theme-row-desc">Switch theme to dark mode</p>
            </div>
            <Toggle
              id="dark-mode-toggle"
              checked={themeStore.darkMode}
              onChange={() => themeStore.toggleDarkMode()}
            />
          </div>

          <div className="theme-divider" />

          {/* Direction */}
          <div className="theme-row">
            <div>
              <p className="theme-row-label">Direction</p>
              <p className="theme-row-desc">Select a direction</p>
            </div>
            <div className="dir-tabs">
              {['ltr', 'rtl'].map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`dir-tab ${themeStore.direction === d ? 'dir-tab--active' : ''}`}
                  onClick={() => themeStore.setDirection(d)}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="theme-divider" />

          {/* Theme color */}
          <div>
            <p className="theme-section-label">Theme</p>
            <div className="color-row">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`color-dot ${themeStore.themeColor === c.id ? 'color-dot--active' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => themeStore.setThemeColor(c.id)}
                  aria-label={`Theme color: ${c.id}`}
                  title={c.id}
                />
              ))}
            </div>
          </div>

          <div className="theme-divider" />

          {/* Layout */}
          <div>
            <p className="theme-section-label">Layout</p>
            <div className="layout-grid">
              {LAYOUTS.map((l) => (
                <LayoutCard
                  key={l.id}
                  id={l.id}
                  label={l.label}
                  active={themeStore.layoutMode === l.id}
                  onClick={() => themeStore.setLayoutMode(l.id)}
                  preview={LayoutPreviews[l.id]}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="theme-panel-footer">
          <button
            id="copy-config-btn"
            type="button"
            className="copy-config-btn"
            onClick={() => themeStore.copyConfig()}
          >
            Copy config
          </button>
        </div>
      </div>
    </>
  )
})

export default ThemeConfigPanel
