import './Career.css'

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.8 5.6L19.4 9l-5.6 1.8L12 16.4l-1.8-5.6L4.6 9l5.6-1.4L12 2z" />
  </svg>
)
const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" />
  </svg>
)
const TrendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
)
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)

const STATS = [
  { value: '12K+', label: 'Roadmaps built' },
  { value: '2 yrs', label: 'Avg. plan length' },
  { value: '87%', label: 'Hit a milestone' },
  { value: '4.9', label: 'Avg. rating' },
]

const STEPS = [
  {
    icon: <TargetIcon />, iconClass: 'hv-icon-purple',
    title: 'Set your target role',
    desc: 'Tell us where you want to be — title, industry, and timeline — and we anchor your plan around it.',
  },
  {
    icon: <SparkleIcon />, iconClass: 'hv-icon-blue',
    title: 'Get a milestone-by-milestone plan',
    desc: 'Skills to learn, projects to ship, and roles to target — sequenced across the next 2 years.',
  },
  {
    icon: <TrendingIcon />, iconClass: 'hv-icon-green',
    title: 'Track progress & adjust',
    desc: 'Your roadmap updates as you complete milestones, change goals, or the market shifts.',
  },
]

const PATHS = [
  { from: 'Software Engineer', to: 'Staff Engineer', milestones: 9, gradient: 'linear-gradient(135deg,#6366f1,#a855f7)' },
  { from: 'Product Designer', to: 'Design Lead', milestones: 7, gradient: 'linear-gradient(135deg,#a855f7,#ec4899)' },
  { from: 'Data Analyst', to: 'Data Scientist', milestones: 8, gradient: 'linear-gradient(135deg,#0ea5e9,#22d3ee)' },
  { from: 'HR Coordinator', to: 'People Ops Manager', milestones: 6, gradient: 'linear-gradient(135deg,#f97316,#ec4899)' },
]

const TESTIMONIALS = [
  { quote: 'The roadmap turned a vague "I want to grow" into a concrete plan with dates. I hit my first milestone in 6 weeks.', name: 'Priya Nair', role: 'Data Analyst @ Airbnb' },
  { quote: 'Seeing the exact skill gaps between me and a Staff Engineer role made the next two years feel achievable, not abstract.', name: 'Marcus Webb', role: 'Software Engineer @ Stripe' },
  { quote: 'I switched from HR coordination to people ops in 14 months by following the milestones exactly as laid out.', name: 'Elena Petrova', role: 'People Ops @ Shopify' },
]

export default function Career() {
  return (
    <div className="hv-root">

      <section className="hv-page-hero">
        <div className="hv-page-hero-inner">
          <span className="hv-badge"><SparkleIcon /> Career Mapping</span>
          <h1 className="hv-page-hero-title">Your path to the top.</h1>
          <p className="hv-page-hero-sub">Data-driven roadmaps, salary insights, and milestones for 200+ roles.</p>
          <button type="button" className="hv-search-btn crr-cta-btn">Build my roadmap <ArrowIcon /></button>
        </div>
      </section>

      <section className="hv-stats">
        {STATS.map((s) => (
          <div className="hv-stat-card" key={s.label}>
            <span className="hv-stat-value">{s.value}</span>
            <span className="hv-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      <section className="hv-section">
        <div className="hv-section-head hv-center">
          <span className="hv-eyebrow">How it works</span>
          <h2>Three steps to a plan you'll actually follow.</h2>
        </div>
        <div className="crr-steps">
          {STEPS.map((s) => (
            <div className="hv-feature" key={s.title}>
              <span className={`hv-feature-icon ${s.iconClass}`}>{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hv-why">
        <div className="hv-section-head hv-center">
          <span className="hv-eyebrow">Popular paths</span>
          <h2>Roadmaps other candidates are following.</h2>
        </div>
        <div className="crr-paths">
          {PATHS.map((p) => (
            <div className="crr-path-card" key={p.to}>
              <div className="crr-path-strip" style={{ background: p.gradient }} />
              <div className="crr-path-body">
                <p className="crr-path-route">{p.from} <ArrowIcon /> <strong>{p.to}</strong></p>
                <span className="crr-path-milestones">{p.milestones} milestones</span>
                <a href="#" className="hv-view-all">View path <ArrowIcon /></a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="hv-section">
        <div className="hv-section-head hv-center">
          <span className="hv-eyebrow">Success stories</span>
          <h2>Careers, leveled up.</h2>
        </div>
        <div className="hv-testimonial-grid crr-testimonial-grid">
          {TESTIMONIALS.map((t) => (
            <div className="hv-testimonial-card" key={t.name}>
              <p className="hv-testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="hv-testimonial-person">
                <span className="hv-testimonial-avatar">{t.name[0]}</span>
                <div>
                  <span className="hv-testimonial-name">{t.name}</span>
                  <span className="hv-testimonial-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="hv-cta-row">
        <div className="hv-cta-purple">
          <SparkleIcon />
          <h3>Ready to chart your path?</h3>
          <p>Answer a few questions about your target role and get your first roadmap in under 5 minutes.</p>
          <button type="button">Build my roadmap <ArrowIcon /></button>
        </div>
        <div className="hv-cta-dark">
          <TargetIcon />
          <h3>Talk to a career coach.</h3>
          <p>Book a free 20-minute call to sanity-check your roadmap with a human.</p>
          <div className="hv-cta-app-btns">
            <button type="button">Book a call</button>
          </div>
        </div>
      </section>

    </div>
  )
}
