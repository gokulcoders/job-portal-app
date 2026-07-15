import { makeAutoObservable, reaction } from 'mobx'

const THEME_COLORS = {
  blue:   { primary: '#3b82f6', primaryHover: '#2563eb', primaryLight: '#eff6ff', primaryText: '#1d4ed8' },
  black:  { primary: '#1f2937', primaryHover: '#111827', primaryLight: '#f3f4f6', primaryText: '#111827' },
  green:  { primary: '#10b981', primaryHover: '#059669', primaryLight: '#ecfdf5', primaryText: '#065f46' },
  purple: { primary: '#8b5cf6', primaryHover: '#7c3aed', primaryLight: '#f5f3ff', primaryText: '#5b21b6' },
  orange: { primary: '#f97316', primaryHover: '#ea580c', primaryLight: '#fff7ed', primaryText: '#c2410c' },
}

class ThemeStore {
  darkMode       = false
  direction      = 'ltr'       // 'ltr' | 'rtl'
  themeColor     = 'blue'      // 'blue'|'black'|'green'|'purple'|'orange'
  layoutMode     = 'collapsible' // 'collapsible'|'stacked'|'top-bar'|'frameless'|'overlay'|'blank'
  sidebarCollapsed = false
  themeConfigOpen  = false

  constructor() {
    makeAutoObservable(this)
    this._loadFromStorage()
    this._applyTheme()

    // persist on change
    reaction(
      () => ({ darkMode: this.darkMode, direction: this.direction, themeColor: this.themeColor, layoutMode: this.layoutMode }),
      () => { this._saveToStorage(); this._applyTheme() }
    )
  }

  toggleDarkMode()      { this.darkMode = !this.darkMode }
  setDirection(d)       { this.direction = d }
  setThemeColor(c)      { this.themeColor = c }
  setLayoutMode(l)      { this.layoutMode = l }
  toggleSidebar()       { this.sidebarCollapsed = !this.sidebarCollapsed }
  openThemeConfig()     { this.themeConfigOpen = true }
  closeThemeConfig()    { this.themeConfigOpen = false }

  _applyTheme() {
    const root = document.documentElement
    const colors = THEME_COLORS[this.themeColor] || THEME_COLORS.blue
    root.setAttribute('data-mode',      this.darkMode   ? 'dark'  : 'light')
    root.setAttribute('data-direction', this.direction)
    root.setAttribute('data-layout',    this.layoutMode)
    root.style.setProperty('--color-primary',       colors.primary)
    root.style.setProperty('--color-primary-hover', colors.primaryHover)
    root.style.setProperty('--color-primary-light', colors.primaryLight)
    root.style.setProperty('--color-primary-text',  colors.primaryText)
  }

  _saveToStorage() {
    localStorage.setItem('ecme_theme', JSON.stringify({
      darkMode: this.darkMode,
      direction: this.direction,
      themeColor: this.themeColor,
      layoutMode: this.layoutMode,
    }))
  }

  _loadFromStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem('ecme_theme') || '{}')
      if (saved.darkMode    !== undefined) this.darkMode    = saved.darkMode
      if (saved.direction   !== undefined) this.direction   = saved.direction
      if (saved.themeColor  !== undefined) this.themeColor  = saved.themeColor
      if (saved.layoutMode  !== undefined) this.layoutMode  = saved.layoutMode
    } catch {}
  }

  copyConfig() {
    const cfg = {
      themeColor: this.themeColor,
      direction:  this.direction,
      layoutMode: this.layoutMode,
      darkMode:   this.darkMode,
    }
    navigator.clipboard?.writeText(JSON.stringify(cfg, null, 2))
  }
}

export default ThemeStore
export { THEME_COLORS }
