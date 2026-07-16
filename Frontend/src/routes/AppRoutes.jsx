import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from '@hooks/useStores'

// Layouts
import AppLayout from '@components/layout/AppLayout'

// Eagerly loaded (critical path)
import Home from '@pages/Home/Home'
import Jobs from '@pages/Jobs/Jobs'
import Login from '@pages/Login/Login'
import Register from '@pages/Register/Register'
import OTP from '@pages/OTP/OTP'
import NotFound from '@pages/NotFound/NotFound'

// Lazy loaded (non-critical)
const UrgentHiring = lazy(() => import('@pages/UrgentHiring/UrgentHiring'))
const WalkIn = lazy(() => import('@pages/WalkIn/WalkIn'))
const Internships = lazy(() => import('@pages/Internships/Internships'))
const UserManagement = lazy(() => import('@pages/Dashboard/UserManagement'))
const Companies = lazy(() => import('@pages/Companies/Companies'))
const Courses = lazy(() => import('@pages/Courses/Courses'))
const Career = lazy(() => import('@pages/Career/Career'))
const ForgotPassword = lazy(() => import('@pages/ForgotPassword/ForgotPassword'))
const ResetPassword = lazy(() => import('@pages/ResetPassword/ResetPassword'))
const Dashboard = lazy(() => import('@pages/Dashboard/Dashboard'))
const Profile = lazy(() => import('@pages/Dashboard/Profile'))
const About = lazy(() => import('@pages/About/About'))
const Pricing = lazy(() => import('@pages/Pricing/Pricing'))
const Contact = lazy(() => import('@pages/Contact/Contact'))
const Privacy = lazy(() => import('@pages/Legal/Privacy'))
const Terms = lazy(() => import('@pages/Legal/Terms'))

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #ede9fe', borderTopColor: '#7c3aed', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ── Auth guard — wraps pages that require login ──────────────────────
const RequireAuth = observer(({ children }) => {
  const { authStore } = useStores()
  return authStore.isAuthenticated
    ? children
    : <Navigate to="/login" replace />
})

// ── Role guard — requires minimum role level ──────────────────────────
const ROLE_RANK = { user: 0, admin: 1, super_admin: 2 }
const RequireRole = observer(({ minRole, children }) => {
  const { authStore } = useStores()
  const rank = ROLE_RANK[authStore.role] ?? 0
  return rank >= (ROLE_RANK[minRole] ?? 0)
    ? children
    : <Navigate to="/dashboard/profile" replace />
})

// ── Stub page for routes under construction ───────────────────────────
function ComingSoon({ title }) {
  return (
    <div style={{ padding: '2rem', maxWidth: 600 }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>{title}</h1>
      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>This section is under construction. Check back soon.</p>
    </div>
  )
}

// ── Redirect logged-in users away from login page ────────────────────
const GuestOnly = observer(({ children }) => {
  const { authStore } = useStores()
  return authStore.isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : children
})

// ── App routes ────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public marketing pages ── */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<RequireAuth><AppLayout><Jobs /></AppLayout></RequireAuth>} />
        <Route path="/urgent-hiring" element={<RequireAuth><AppLayout><UrgentHiring /></AppLayout></RequireAuth>} />
        <Route path="/walk-in" element={<RequireAuth><AppLayout><WalkIn /></AppLayout></RequireAuth>} />
        <Route path="/internships" element={<RequireAuth><AppLayout><Internships /></AppLayout></RequireAuth>} />
        <Route path="/companies" element={<RequireAuth><AppLayout><Companies /></AppLayout></RequireAuth>} />
        <Route path="/courses" element={<RequireAuth><AppLayout><Courses /></AppLayout></RequireAuth>} />
        <Route path="/career" element={<RequireAuth><AppLayout><Career /></AppLayout></RequireAuth>} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        {/* ── Auth pages (guest only — authenticated → /jobs) ── */}
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
        <Route path="/otp" element={<GuestOnly><OTP /></GuestOnly>} />
        <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
        <Route path="/reset-password" element={<GuestOnly><ResetPassword /></GuestOnly>} />

        {/* ── Dashboard (optional secondary feature, requires auth) ── */}
        <Route path="/dashboard" element={<RequireAuth><AppLayout><Dashboard /></AppLayout></RequireAuth>} />
        <Route path="/dashboard/profile" element={<RequireAuth><AppLayout><Profile /></AppLayout></RequireAuth>} />
        <Route path="/dashboard/users" element={<RequireAuth><RequireRole minRole="admin"><AppLayout><UserManagement /></AppLayout></RequireRole></RequireAuth>} />
        <Route path="/dashboard/analytics" element={<RequireAuth><RequireRole minRole="admin"><AppLayout><ComingSoon title="Analytics" /></AppLayout></RequireRole></RequireAuth>} />
        <Route path="/dashboard/billing" element={<RequireAuth><RequireRole minRole="super_admin"><AppLayout><ComingSoon title="Billing" /></AppLayout></RequireRole></RequireAuth>} />
        <Route path="/dashboard/tenants" element={<RequireAuth><RequireRole minRole="super_admin"><AppLayout><ComingSoon title="All Tenants" /></AppLayout></RequireRole></RequireAuth>} />
        <Route path="/dashboard/system-settings" element={<RequireAuth><RequireRole minRole="super_admin"><AppLayout><ComingSoon title="System Settings" /></AppLayout></RequireRole></RequireAuth>} />

        {/* ── Catch-all ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
