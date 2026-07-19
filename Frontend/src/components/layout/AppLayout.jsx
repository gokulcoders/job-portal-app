import { observer } from 'mobx-react-lite'
import { useStores } from '@hooks/useStores'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ThemeConfigPanel from './ThemeConfigPanel'
import './app-layout.css'

/**
 * AppLayout — authenticated shell
 * Renders sidebar + top navbar + main content area.
 * The ThemeConfigPanel is always mounted here (shown/hidden via store).
 */
const AppLayout = observer(({ children }) => {
  const { themeStore } = useStores()

  return (
    <div className={`app-shell ${themeStore.sidebarCollapsed ? 'app-shell--collapsed' : ''} ${themeStore.mobileSidebarOpen ? 'app-shell--mobile-open' : ''}`}>
      <Sidebar />
      {themeStore.mobileSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => themeStore.closeMobileSidebar()} />
      )}
      <div className="app-content-area">
        <Navbar />
        <main className="app-main">
          {children}
        </main>
      </div>
      <ThemeConfigPanel />
    </div>
  )
})

export default AppLayout
