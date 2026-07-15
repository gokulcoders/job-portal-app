import SiteNavbar from '@components/marketing/SiteNavbar'
import SiteFooter from '@components/marketing/SiteFooter'
import { Link } from 'react-router-dom'

const TargetIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const CpuIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
    <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
  </svg>
)
const ShieldCheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
)
const GlobeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

const TEAM = [
  { name: 'Arjun Mehta',  role: 'CEO & Co-Founder',  init: 'A' },
  { name: 'Priya Sharma', role: 'CTO & Co-Founder',  init: 'P' },
  { name: 'Rohan Das',    role: 'Head of Product',    init: 'R' },
  { name: 'Sneha Kapoor', role: 'Head of Design',     init: 'S' },
]

const VALUES = [
  { Icon: TargetIcon,    iconBg: '#ede9fe', iconColor: '#7c3aed', title: 'Candidate-First', desc: 'Every decision starts with how it helps job seekers land better opportunities faster.' },
  { Icon: CpuIcon,       iconBg: '#dbeafe', iconColor: '#1d4ed8', title: 'AI-Powered',       desc: 'We use machine learning to match skills, not just keywords — so you find roles where you truly fit.' },
  { Icon: ShieldCheckIcon, iconBg: '#d1fae5', iconColor: '#065f46', title: 'Trust & Safety', desc: 'Every job is verified. No ghost listings, no spam. Your data stays yours.' },
  { Icon: GlobeIcon,     iconBg: '#fce7f3', iconColor: '#9d174d', title: 'Built for India', desc: 'From Bengaluru to Bhopal — we understand local hiring, regional languages, and walk-in culture.' },
]

export default function About() {
  return (
    <div className="hv-root">
      <SiteNavbar active="About" />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 60%, #7c3aed 100%)', padding: '5rem 2rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <p style={{ color: '#c4b5fd', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Our Story</p>
          <h1 style={{ color: '#fff', fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 1.25rem' }}>
            We built the platform<br />we wished existed.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
            HireVerse was born from frustration — outdated job boards, ghost listings, and applications that vanished into the void.
            We set out to build something better: fast, transparent, and genuinely useful for every career stage.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#faf9ff', borderBottom: '1px solid #ede9fe', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem', textAlign: 'center' }}>
          {[['2.4M+','Live jobs'],['180K+','Companies'],['5.6M+','Hires made'],['4.8 / 5','App rating']].map(([v,l]) => (
            <div key={l}>
              <div style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(90deg,#7c3aed,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 2rem' }}>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.5rem' }}>What we stand for</p>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>Our values</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '1.25rem' }}>
          {VALUES.map(({ Icon, iconBg, iconColor, title, desc }) => (
            <div key={title} style={{ background: '#fff', border: '1.5px solid #ede9fe', borderRadius: 20, padding: '1.75rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.9rem' }}>
                <Icon />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ fontSize: '0.87rem', color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ background: '#faf9ff', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>Meet the team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1.5rem' }}>
            {TEAM.map(t => (
              <div key={t.name} style={{ textAlign: 'center', background: '#fff', border: '1.5px solid #ede9fe', borderRadius: 20, padding: '1.75rem 1rem' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', fontWeight: 800, fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>{t.init}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>Ready to find your next role?</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.75rem' }}>Join millions of candidates who found their dream job on HireVerse.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/jobs" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', padding: '0.75rem 1.75rem', borderRadius: 999, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>Browse Jobs</Link>
          <Link to="/register" style={{ border: '1.5px solid #ede9fe', color: '#7c3aed', padding: '0.75rem 1.75rem', borderRadius: 999, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>Create Account</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
