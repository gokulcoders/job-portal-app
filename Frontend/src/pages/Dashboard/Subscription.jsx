import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from '@hooks/useStores'
import { updateMyPlan } from '@services/api'
import './Subscription.css'

// ── Icons ─────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const CalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const CardIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
)
const ReceiptIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16l3-2 3 2 3-2 3 2 3-2V8z"/><path d="M14 2v6h6"/>
    <line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/>
  </svg>
)

// ── Plan catalog ──────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    color: '#6b7280',
    tagline: 'For getting started',
    features: ['Browse all jobs', 'Basic search & filters', 'Save up to 5 jobs', 'Email job alerts', 'Profile page'],
    limits: [
      { label: 'Saved jobs', used: 3, max: 5 },
      { label: 'Applications / month', used: 8, max: 15 },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    color: '#7c3aed',
    tagline: 'For active job seekers',
    features: ['Everything in Free', 'Unlimited job saves', 'AI resume match score', 'Priority application', 'Early access to urgent jobs', 'Interview preparation kit', 'Remove ads'],
    limits: [
      { label: 'Saved jobs', used: 0, max: null },
      { label: 'Applications / month', used: 0, max: null },
    ],
    highlighted: true,
  },
  {
    id: 'teams',
    name: 'Teams',
    price: 999,
    color: '#0891b2',
    tagline: 'For hiring teams',
    features: ['Everything in Pro', 'Up to 10 team members', 'Employer dashboard', 'Post unlimited jobs', 'ATS integration', 'Dedicated support', 'Custom branding'],
    limits: [
      { label: 'Saved jobs', used: 0, max: null },
      { label: 'Applications / month', used: 0, max: null },
    ],
  },
]

function addMonths(date, n) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + n)
  return d
}

// ── Toast ─────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className={`sub-toast sub-toast--${type}`}>
      <span>{msg}</span>
      <button onClick={onClose}>✕</button>
    </div>
  )
}

// ── Confirm modal ─────────────────────────────────────────────────────────
function ConfirmModal({ title, body, confirmLabel, danger, onConfirm, onCancel, busy }) {
  return (
    <div className="sub-modal-backdrop" onClick={onCancel}>
      <div className="sub-modal" onClick={e => e.stopPropagation()}>
        <h3 className="sub-modal-title">{title}</h3>
        <p className="sub-modal-body">{body}</p>
        <div className="sub-modal-actions">
          <button className="sub-btn-ghost" onClick={onCancel} disabled={busy}>Cancel</button>
          <button
            className={danger ? 'sub-btn-danger' : 'sub-btn-primary'}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? <><span className="sub-spin" /> Processing…</> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Subscription component ──────────────────────────────────────────
const Subscription = observer(() => {
  const { authStore } = useStores()
  const user = authStore.user || {}

  const [planId, setPlanId] = useState(user.plan || 'free')
  const [renewsAt] = useState(() => addMonths(new Date(), 1))
  const [toast, setToast] = useState(null)
  const [pendingPlan, setPendingPlan] = useState(null) // plan being switched to, awaiting confirm
  const [cancelling, setCancelling] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    authStore.loadProfile().then(() => setPlanId(authStore.user?.plan || 'free'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const plan = PLANS.find(p => p.id === planId) || PLANS[0]
  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const applyPlanChange = async (target) => {
    setBusy(true)
    try {
      await updateMyPlan(target.id) // no real payment gateway — updates the account's plan directly
      setPlanId(target.id)
      showToast(target.id === 'free' ? 'Subscription cancelled' : `You're now on the ${target.name} plan`)
    } catch {
      showToast('Failed to update your plan', 'error')
    } finally {
      setBusy(false)
      setPendingPlan(null)
    }
  }

  const handleCancelConfirm = async () => {
    setBusy(true)
    try {
      await updateMyPlan('free')
      setPlanId('free')
      showToast('Subscription cancelled — you have been moved to the Free plan')
    } catch {
      showToast('Failed to cancel your plan', 'error')
    } finally {
      setBusy(false)
      setCancelling(false)
    }
  }

  const renewalLabel = plan.id === 'free'
    ? '—'
    : renewsAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="sub-container">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {pendingPlan && (
        <ConfirmModal
          title={`Switch to ${pendingPlan.name}?`}
          body={pendingPlan.price > plan.price
            ? `You'll be upgraded to ${pendingPlan.name} for ₹${pendingPlan.price}/month. This is a demo checkout — no real payment is processed.`
            : `You'll be moved to ${pendingPlan.name}. This is a demo checkout — no real payment is processed.`}
          confirmLabel={`Confirm ${pendingPlan.name}`}
          busy={busy}
          onConfirm={() => applyPlanChange(pendingPlan)}
          onCancel={() => setPendingPlan(null)}
        />
      )}
      {cancelling && (
        <ConfirmModal
          title="Cancel subscription?"
          body={`You'll lose access to ${plan.name} features at the end of your billing period and move to the Free plan.`}
          confirmLabel="Cancel subscription"
          danger
          busy={busy}
          onConfirm={handleCancelConfirm}
          onCancel={() => setCancelling(false)}
        />
      )}

      <div className="sub-page-header">
        <h1 className="sub-page-title">Subscription</h1>
        <p className="sub-page-sub">Manage your plan, usage, and billing details</p>
      </div>

      {/* ── Current plan card ── */}
      <div className="sub-current-card" style={{ '--plan-color': plan.color }}>
        <div className="sub-current-main">
          <div className="sub-current-badge-row">
            <span className="sub-current-plan-name">{plan.name} Plan</span>
            <span className="sub-status-pill">Active</span>
          </div>
          <div className="sub-current-price">
            {plan.price === 0 ? 'Free' : `₹${plan.price}`}
            {plan.price > 0 && <span className="sub-current-period">/ month</span>}
          </div>
          <div className="sub-current-meta">
            <span className="sub-current-meta-row"><CalIcon /> {plan.id === 'free' ? 'No renewal — free forever' : `Renews on ${renewalLabel}`}</span>
            <span className="sub-current-meta-row"><CardIcon /> {plan.id === 'free' ? 'No payment method on file' : 'Visa •••• 4242'}</span>
          </div>
        </div>
        {plan.id !== 'free' && (
          <button className="sub-btn-ghost sub-current-cancel" onClick={() => setCancelling(true)}>
            Cancel subscription
          </button>
        )}
      </div>

      {/* ── Usage ── */}
      <div className="sub-section-block">
        <h2 className="sub-section-heading">This month's usage</h2>
        <div className="sub-usage-grid">
          {plan.limits.map(l => {
            const pct = l.max ? Math.min(100, Math.round((l.used / l.max) * 100)) : 0
            return (
              <div key={l.label} className="sub-usage-card">
                <div className="sub-usage-top">
                  <span className="sub-usage-label">{l.label}</span>
                  <span className="sub-usage-count">
                    {l.max ? `${l.used} / ${l.max}` : <span className="sub-usage-unlimited">Unlimited</span>}
                  </span>
                </div>
                {l.max && (
                  <div className="sub-usage-bar">
                    <div className="sub-usage-bar-fill" style={{ width: `${pct}%`, background: pct >= 90 ? '#ef4444' : plan.color }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Plans ── */}
      <div className="sub-section-block">
        <h2 className="sub-section-heading">Available plans</h2>
        <div className="sub-plans-grid">
          {PLANS.map(p => {
            const isCurrent = p.id === plan.id
            return (
              <div key={p.id} className={`sub-plan-card ${p.highlighted ? 'sub-plan-card--highlighted' : ''} ${isCurrent ? 'sub-plan-card--current' : ''}`}>
                {p.highlighted && !isCurrent && <div className="sub-plan-ribbon">Most popular</div>}
                {isCurrent && <div className="sub-plan-ribbon sub-plan-ribbon--current">Current plan</div>}
                <div className="sub-plan-name" style={{ color: p.color }}>{p.name}</div>
                <div className="sub-plan-tagline">{p.tagline}</div>
                <div className="sub-plan-price">
                  {p.price === 0 ? 'Free' : `₹${p.price}`}
                  {p.price > 0 && <span className="sub-plan-period">/mo</span>}
                </div>
                <ul className="sub-plan-features">
                  {p.features.map(f => (
                    <li key={f}><span style={{ color: p.color }}><CheckIcon /></span>{f}</li>
                  ))}
                </ul>
                <button
                  className={isCurrent ? 'sub-btn-ghost' : 'sub-btn-primary'}
                  disabled={isCurrent}
                  onClick={() => setPendingPlan(p)}
                  style={!isCurrent ? { background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)` } : undefined}
                >
                  {isCurrent ? 'Current plan' : p.price > plan.price ? `Upgrade to ${p.name}` : `Switch to ${p.name}`}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Billing history ── */}
      <div className="sub-section-block">
        <h2 className="sub-section-heading">Billing history</h2>
        <div className="sub-invoice-empty">
          <ReceiptIcon />
          <p className="sub-invoice-empty-title">No invoices yet</p>
          <p className="sub-invoice-empty-sub">
            {plan.id === 'free'
              ? "You're on the Free plan — invoices will appear here once you upgrade."
              : 'Your first invoice will appear here after your next billing cycle.'}
          </p>
        </div>
      </div>
    </div>
  )
})

export default Subscription
