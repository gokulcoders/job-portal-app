import SiteNavbar from '@components/marketing/SiteNavbar'
import SiteFooter from '@components/marketing/SiteFooter'
import { Link } from 'react-router-dom'

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    color: '#6b7280',
    features: ['Browse all jobs','Basic search & filters','Save up to 5 jobs','Email job alerts','Profile page'],
    cta: 'Get started free',
    to: '/register',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '₹299',
    period: '/ month',
    color: '#7c3aed',
    features: ['Everything in Free','Unlimited job saves','AI resume match score','Priority application','Early access to urgent jobs','Interview preparation kit','Remove ads'],
    cta: 'Start Pro — ₹299/mo',
    to: '/register',
    highlighted: true,
  },
  {
    name: 'Teams',
    price: '₹999',
    period: '/ month',
    color: '#0891b2',
    features: ['Everything in Pro','Up to 10 team members','Employer dashboard','Post unlimited jobs','ATS integration','Dedicated support','Custom branding'],
    cta: 'Contact sales',
    to: '/contact',
    highlighted: false,
  },
]

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function Pricing() {
  return (
    <div className="hv-root">
      <SiteNavbar active="Pricing" />

      <section style={{ textAlign: 'center', padding: '4.5rem 2rem 3rem', background: 'radial-gradient(120% 100% at 50% 0%,#fbe8ff 0%,#f6f1ff 40%,#fff 80%)' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.75rem' }}>Simple pricing</p>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 1rem' }}>Pay for what you need.</h1>
        <p style={{ color: '#6b7280', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>Start free. Upgrade when you're ready. No hidden fees, no lock-in.</p>
      </section>

      <section style={{ maxWidth: 1050, margin: '0 auto', padding: '3rem 2rem 5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.25rem', alignItems: 'start' }}>
        {PLANS.map(p => (
          <div key={p.name} style={{
            background: p.highlighted ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#fff',
            border: p.highlighted ? 'none' : '1.5px solid #ede9fe',
            borderRadius: 24, padding: '2rem',
            boxShadow: p.highlighted ? '0 20px 60px rgba(124,58,237,0.3)' : 'none',
            transform: p.highlighted ? 'scale(1.04)' : 'none',
            position: 'relative',
          }}>
            {p.highlighted && (
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#7c3aed', fontWeight: 700, fontSize: '0.72rem', padding: '0.3rem 1rem', borderRadius: 99, border: '1.5px solid #ede9fe', whiteSpace: 'nowrap' }}>
                Most popular
              </div>
            )}
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: p.highlighted ? 'rgba(255,255,255,0.8)' : '#6b7280', marginBottom: '0.5rem' }}>{p.name}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: p.highlighted ? '#fff' : '#111827', lineHeight: 1 }}>{p.price}</div>
            <div style={{ fontSize: '0.82rem', color: p.highlighted ? 'rgba(255,255,255,0.7)' : '#9ca3af', marginBottom: '1.75rem' }}>{p.period}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {p.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.87rem', color: p.highlighted ? '#fff' : '#374151' }}>
                  <span style={{ color: p.highlighted ? '#c4b5fd' : '#7c3aed', flexShrink: 0 }}><CheckIcon /></span>
                  {f}
                </li>
              ))}
            </ul>
            <Link to={p.to} style={{
              display: 'block', textAlign: 'center',
              background: p.highlighted ? '#fff' : 'linear-gradient(135deg,#7c3aed,#a855f7)',
              color: p.highlighted ? '#7c3aed' : '#fff',
              padding: '0.75rem 1.5rem', borderRadius: 999,
              fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}>
              {p.cta}
            </Link>
          </div>
        ))}
      </section>

      <SiteFooter />
    </div>
  )
}
