import { Link, useNavigate } from 'react-router-dom'
import SiteNavbar from '@components/marketing/SiteNavbar'
import SiteFooter from '@components/marketing/SiteFooter'
import heroImg from '../../assets/hero_illustration.png'
import './Home.css'

// ── UI Icons ────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)
const BriefcaseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)
const ChevronDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const TrendUp = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
)

// ── Category SVG Icons ───────────────────────────────────────────
const CodeIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
)
const ChartBarIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
  </svg>
)
const PenToolIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
  </svg>
)
const SmartphoneIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
)
const CloudIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
)
const ShieldIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const MegaphoneIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
)
const TrendingIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

// ── Stat SVG Icons ───────────────────────────────────────────────
const BuildingIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
)
const AwardIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
)
const TargetIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
)
const ZapIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

// ── Hero visual SVG ──────────────────────────────────────────────
const LaptopIllustration = () => (
  <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 180, height: 135 }}>
    {/* Screen body */}
    <rect x="20" y="8" width="160" height="104" rx="10" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
    {/* Screen inner */}
    <rect x="28" y="16" width="144" height="88" rx="6" fill="rgba(255,255,255,0.06)" />
    {/* Code lines */}
    <rect x="38" y="28" width="50" height="5" rx="2.5" fill="rgba(196,181,253,0.7)" />
    <rect x="38" y="40" width="78" height="5" rx="2.5" fill="rgba(255,255,255,0.25)" />
    <rect x="44" y="52" width="60" height="5" rx="2.5" fill="rgba(244,114,182,0.6)" />
    <rect x="44" y="64" width="72" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" />
    <rect x="44" y="76" width="44" height="5" rx="2.5" fill="rgba(196,181,253,0.5)" />
    <rect x="38" y="88" width="66" height="5" rx="2.5" fill="rgba(255,255,255,0.15)" />
    {/* Cursor blink */}
    <rect x="107" y="88" width="3" height="5" rx="1" fill="rgba(196,181,253,0.9)" />
    {/* Sidebar accent */}
    <rect x="148" y="28" width="18" height="5" rx="2.5" fill="rgba(255,255,255,0.1)" />
    <rect x="148" y="40" width="14" height="5" rx="2.5" fill="rgba(255,255,255,0.1)" />
    <rect x="148" y="52" width="16" height="5" rx="2.5" fill="rgba(255,255,255,0.1)" />
    {/* Keyboard base */}
    <rect x="10" y="112" width="180" height="10" rx="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    {/* Hinge */}
    <rect x="85" y="122" width="30" height="4" rx="2" fill="rgba(0,0,0,0.2)" />
    {/* Shadow */}
    <ellipse cx="100" cy="140" rx="70" ry="6" fill="rgba(0,0,0,0.15)" />
  </svg>
)

// ── Spinning SVG Star ────────────────────────────────────────────
const SpinningStar = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="hp-hero-star-svg" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2 L22.5 17.5 L38 20 L22.5 22.5 L20 38 L17.5 22.5 L2 20 L17.5 17.5 Z" fill="#7c3aed" opacity="0.85" />
    <path d="M20 8 L21.5 18.5 L32 20 L21.5 21.5 L20 32 L18.5 21.5 L8 20 L18.5 18.5 Z" fill="#a855f7" opacity="0.5" />
  </svg>
)

// ── Data ─────────────────────────────────────────────────────────
const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Flipkart', 'Infosys',
  'Wipro', 'TCS', 'Swiggy', 'Zomato', 'Razorpay',
  'CRED', 'Meesho', 'Ola', 'PhonePe',
  'Freshworks', 'Zoho', 'HCL', 'Cognizant', 'Accenture',
]
const MARQUEE_ITEMS = [...COMPANIES, ...COMPANIES]

const CATEGORIES = [
  { Icon: CodeIcon, label: 'Software Dev', count: '2,400+', bg: '#ede9fe', color: '#6d28d9' },
  { Icon: ChartBarIcon, label: 'Data & AI', count: '980+', bg: '#e0f2fe', color: '#0369a1' },
  { Icon: PenToolIcon, label: 'Design & UX', count: '640+', bg: '#fce7f3', color: '#9d174d' },
  { Icon: SmartphoneIcon, label: 'Mobile Dev', count: '520+', bg: '#d1fae5', color: '#065f46' },
  { Icon: CloudIcon, label: 'Cloud & DevOps', count: '870+', bg: '#fff7ed', color: '#9a3412' },
  { Icon: ShieldIcon, label: 'Cybersecurity', count: '310+', bg: '#fef3c7', color: '#92400e' },
  { Icon: MegaphoneIcon, label: 'Marketing', count: '790+', bg: '#fee2e2', color: '#991b1b' },
  { Icon: TrendingIcon, label: 'Finance & Ops', count: '1,100+', bg: '#f0fdf4', color: '#14532d' },
]

const STATS = [
  { Icon: BuildingIcon, value: '12,000+', label: 'Active Job Listings', color: '#7c3aed' },
  { Icon: AwardIcon, value: '850+', label: 'Verified Companies', color: '#0ea5e9' },
  { Icon: TargetIcon, value: '98%', label: 'Placement Success', color: '#10b981' },
  { Icon: ZapIcon, value: 'Daily', label: 'Live Scraping Updates', color: '#f97316' },
]

// Letter avatar colors for company logos
const LOGO_COLORS = [
  ['#f0fdf4', '#166534'], ['#eff6ff', '#1d4ed8'], ['#fefce8', '#a16207'],
  ['#fdf4ff', '#7e22ce'], ['#fff7ed', '#9a3412'], ['#f0fdf4', '#15803d'],
]
function CompanyLogo({ name, size = 52 }) {
  const letter = (name || '?')[0].toUpperCase()
  const [bg, color] = LOGO_COLORS[letter.charCodeAt(0) % LOGO_COLORS.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: 14,
      background: bg, color, border: `1.5px solid ${bg === '#f0fdf4' ? '#bbf7d0' : '#e9e4ff'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 800, flexShrink: 0, letterSpacing: '-0.02em',
    }}>{letter}</div>
  )
}

const FEATURED_JOBS = [
  { id: 1, title: 'Senior React Developer', company: 'Razorpay', location: 'Bengaluru', type: 'Full-time', exp: '3–5 yrs', tags: ['React', 'Node.js', 'TypeScript'], salary: '₹18–30 LPA', urgent: true },
  { id: 2, title: 'Machine Learning Engineer', company: 'Flipkart', location: 'Bengaluru', type: 'Full-time', exp: '2–4 yrs', tags: ['Python', 'TensorFlow', 'MLOps'], salary: '₹22–40 LPA', urgent: false },
  { id: 3, title: 'Product Designer', company: 'CRED', location: 'Remote', type: 'Full-time', exp: '2–4 yrs', tags: ['Figma', 'Motion', 'Design System'], salary: '₹16–26 LPA', urgent: true },
  { id: 4, title: 'Backend Engineer (Go)', company: 'Meesho', location: 'Bengaluru', type: 'Hybrid', exp: '3–6 yrs', tags: ['Golang', 'gRPC', 'Kafka'], salary: '₹20–35 LPA', urgent: false },
  { id: 5, title: 'DevOps Lead', company: 'PhonePe', location: 'Hyderabad', type: 'Full-time', exp: '4–7 yrs', tags: ['AWS', 'Kubernetes', 'Terraform'], salary: '₹25–45 LPA', urgent: false },
  { id: 6, title: 'Full Stack (MERN)', company: 'Freshworks', location: 'Chennai', type: 'Full-time', exp: '2–5 yrs', tags: ['React', 'MongoDB', 'Express'], salary: '₹12–22 LPA', urgent: true },
]

const TESTIMONIALS = [
  { quote: 'Got placed at Razorpay within 3 weeks of using HireVerse. The job cards show everything — salary, apply link — no more wasted clicks.', name: 'Arun Selvam', role: 'SDE-II at Razorpay', initials: 'AS', bg: 'linear-gradient(135deg,#7c3aed,#a855f7)', stars: 5 },
  { quote: 'As a fresher from Coimbatore, I was struggling to find Chennai/remote jobs. HireVerse pulled live LinkedIn jobs every day and saved me weeks.', name: 'Priya Lakshmi', role: 'Frontend Dev at Zoho', initials: 'PL', bg: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', stars: 5 },
  { quote: 'The design is clean, fast, and works great on my phone. Finally a job portal that feels like 2025, not 2010.', name: 'Karthik Raja', role: 'ML Intern at Freshworks', initials: 'KR', bg: 'linear-gradient(135deg,#10b981,#34d399)', stars: 5 },
]

const POPULAR_TAGS = ['MERN Stack', 'Python', 'React', 'Data Science', 'Remote', 'Fresher']
const BARS = [30, 50, 40, 65, 45, 70, 55]

// ── Component ─────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/jobs')
  }

  return (
    <div className="hv-root">
      <SiteNavbar active="Home" />

      {/* ════════ HERO ════════ */}
      <section className="hp-hero">
        <div className="hp-hero-bg-accent" />

        {/* Text block */}
        <div className="hp-hero-inner">


          {/* Search bar */}
          <form className="hp-search-wrap" onSubmit={handleSearch}>
            <div className="hp-search-field">
              <input placeholder="etc: Search Your Needs" />
            </div>
            <div className="hp-search-sep" />
            <div className="hp-cat-select-wrap">
              <select className="hp-cat-select" defaultValue="web-dev">
                <option value="web-dev">Web Devleoment</option>
                <option value="data">Data Science</option>
                <option value="design">UI / UX Design</option>
                <option value="mobile">Mobile Dev</option>
                <option value="devops">DevOps / Cloud</option>
                <option value="marketing">Marketing</option>
              </select>
              <span className="hp-cat-select-arrow"><ChevronDown /></span>
            </div>
            <button type="submit" className="hp-search-btn" aria-label="Search">
              <SearchIcon />
            </button>
          </form>

          <div className="hp-popular">
            <span>Popular Jobs:</span>
            {['Designer', 'Web Developer', 'Software Engineer'].map(t => (
              <span key={t} className="hp-popular-link" onClick={() => navigate('/jobs')}>{t}</span>
            ))}
          </div>
        </div>

        {/* Visual — floating cards + center image */}
        <div className="hp-hero-visual">
          {/* Decorative curved lines (approximated with SVG) */}
          <svg className="hp-hero-curves" viewBox="0 0 1000 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M200,100 Q 300,-50 500,50 T 800,80" stroke="rgba(0,0,0,0.05)" strokeWidth="4" strokeLinecap="round" />
            <path d="M220,180 Q 200,120 180,100" stroke="rgba(0,0,0,0.05)" strokeWidth="4" strokeLinecap="round" />
          </svg>

          {/* Left cards */}
          <div className="hp-hero-left">
            <div className="hp-float-icon-pink">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
              </svg>
            </div>

            <div className="hp-float-card hp-card-categories">
              <div className="hp-float-card-text">
                <div className="title">Top Categories</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 46 }}>
                <div className="hp-bar-pink" style={{ height: '70%' }} />
                <div className="hp-bar-lightpink" style={{ height: '100%' }} />
                <div className="hp-bar-lightpink" style={{ height: '60%' }} />
                <div className="hp-bar-gradient" style={{ height: '85%' }} />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="hp-mini-dot"></span>
                <span className="hp-mini-dot"></span>
                <span className="hp-mini-dot"></span>
                <span className="hp-mini-dot"></span>
              </div>
            </div>
          </div>

          {/* Center Image */}
          <div className="hp-hero-center">
            <img src={heroImg} alt="Hero Illustration" className="hp-hero-image" />
          </div>

          {/* Right cards */}
          <div className="hp-hero-right">
            <div className="hp-float-icon-white">
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.85-2.22.83-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>

            <div className="hp-float-card hp-card-customer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="hp-customer-avatar">
                  <img src="https://i.pravatar.cc/100?img=11" alt="Avatar" />
                </div>
                <div className="hp-float-card-text">
                  <div className="title" style={{ fontSize: '0.75rem', color: '#6b7280' }}>Customer Success</div>
                  <div className="value" style={{ fontSize: '1rem' }}>8.50%</div>
                </div>
              </div>
            </div>

            <div className="hp-float-card hp-card-tagline">
              <div style={{ display: 'flex', marginBottom: '0.4rem' }}>
                {[12, 13, 14].map((id, idx) => (
                  <img key={id} src={`https://i.pravatar.cc/100?img=${id}`} alt="Avatar" className="hp-mini-avatar" style={{ marginLeft: idx > 0 ? -8 : 0 }} />
                ))}
              </div>
              <div className="hp-float-card-text">
                <div className="title" style={{ fontSize: '0.75rem', lineHeight: 1.45, fontWeight: 500, color: '#374151' }}>
                  We work towards <span style={{ color: '#f43f5e', fontWeight: 700 }}>ensuring a life</span><br />
                  free from inequality.
                </div>
              </div>
            </div>

            <div className="hp-hero-sparkle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#ef4444" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ COMPANY STRIP ════════ */}
      <div className="hp-marquee-wrap">
        <div className="hp-trusted-banner">
          <div className="hp-trusted-left">
            Trusted By 1M+<br />Business
          </div>
          <div className="hp-trusted-divider"></div>
          <div className="hp-trusted-logos">
            <span className="hp-t-logo">Luminous</span>
            <span className="hp-t-logo">Lightbox</span>
            <span className="hp-t-logo">FocalPoint</span>
            <span className="hp-t-logo">Polymath</span>
            <span className="hp-t-logo">Alt+Shift</span>
            <span className="hp-t-logo">Nietzsche</span>
          </div>
        </div>
      </div>

      {/* ════════ TOP RATED TALENT ════════ */}
      <section className="hp-top-rated">
        <div className="hp-top-rated-inner">
          <h2>Top Rated Talent</h2>
          <p>Onboard your own talent pool to Quitey, invite them to projects, sign<br />contracts and kick off the projects</p>
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section className="hp-stats">
        <div className="hp-stats-inner">
          {STATS.map(({ Icon, value, label, color }) => (
            <div key={label} className="hp-stat-card">
              <div className="hp-stat-icon" style={{ color }}><Icon /></div>
              <span className="hp-stat-value">{value}</span>
              <span className="hp-stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════════ CATEGORIES ════════ */}
      <section className="hp-categories">
        <div className="hp-categories-inner">
          <p className="hp-section-eyebrow">Browse by Domain</p>
          <h2 className="hp-section-title">Find jobs in your field</h2>
          <p className="hp-section-sub">Explore thousands of roles across every tech and business domain</p>
          <div className="hp-cat-grid">
            {CATEGORIES.map(({ Icon, label, count, bg, color }) => (
              <Link key={label} to="/jobs" className="hp-cat-card">
                <div className="hp-cat-icon" style={{ background: bg, color }}><Icon /></div>
                <div className="hp-cat-name">{label}</div>
                <div className="hp-cat-count">{count} jobs</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section className="hp-how">
        <div className="hp-how-inner">
          <p className="hp-section-eyebrow">Simple Process</p>
          <h2 className="hp-section-title">Get hired in 3 steps</h2>
          <p className="hp-section-sub">From registration to your offer letter — we keep it simple</p>
          <div className="hp-steps">
            <div className="hp-step">
              <div className="hp-step-num">1</div>
              <h3>Create Your Profile</h3>
              <p>Sign up free in 60 seconds. Tell us your skills, experience, and job preferences. No resume uploads required.</p>
            </div>
            <div className="hp-step">
              <div className="hp-step-num">2</div>
              <h3>Discover Live Listings</h3>
              <p>We scrape LinkedIn every day and present the freshest jobs in a clean, fast interface — filtered for you.</p>
            </div>
            <div className="hp-step">
              <div className="hp-step-num">3</div>
              <h3>Apply &amp; Get Hired</h3>
              <p>One click takes you directly to the company's official application portal. No middlemen, no fees, no hassle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FEATURED JOBS ════════ */}
      <section className="hp-jobs">
        <div className="hp-jobs-inner">
          <div className="hp-jobs-head">
            <div>
              <p className="hp-section-eyebrow" style={{ textAlign: 'left', marginBottom: '0.3rem' }}>Fresh Today</p>
              <h2 className="hp-section-title" style={{ textAlign: 'left', margin: 0 }}>Featured Opportunities</h2>
            </div>
            <Link to="/jobs" className="hp-view-all">View all jobs <ArrowIcon /></Link>
          </div>
          <div className="hp-jobs-grid">
            {FEATURED_JOBS.map((job) => (
              <div key={job.id} className="hp-job-card" onClick={() => navigate('/jobs')}>
                <div className="hp-job-top">
                  <CompanyLogo name={job.company} />
                  {job.urgent && (
                    <span className="hp-job-urgent">
                      <ZapIcon style={{ width: 10, height: 10, marginRight: 2 }} /> Urgent
                    </span>
                  )}
                </div>
                <div className="hp-job-title">{job.title}</div>
                <div className="hp-job-company">{job.company}</div>
                <div className="hp-job-meta">
                  <span className="hp-job-meta-item"><MapPinIcon /> {job.location}</span>
                  <span className="hp-job-meta-item"><BriefcaseIcon /> {job.type}</span>
                  <span className="hp-job-meta-item"><ClockIcon /> {job.exp}</span>
                </div>
                <div className="hp-job-tags">
                  {job.tags.map(t => <span key={t} className="hp-job-tag">{t}</span>)}
                </div>
                <div className="hp-job-footer">
                  <span className="hp-job-salary">{job.salary}</span>
                  <Link to="/jobs" className="hp-job-apply" onClick={e => e.stopPropagation()}>
                    Apply <ArrowIcon />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section className="hp-testimonials">
        <div className="hp-testimonials-inner">
          <p className="hp-section-eyebrow">Real Stories</p>
          <h2 className="hp-section-title">Loved by job seekers</h2>
          <p className="hp-section-sub">From Tamil Nadu to Bengaluru — our users land real jobs</p>
          <div className="hp-testi-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="hp-testi-card">
                <div className="hp-testi-stars">
                  {Array.from({ length: t.stars }).map((_, i) => <StarIcon key={i} />)}
                </div>
                <p className="hp-testi-quote">"{t.quote}"</p>
                <div className="hp-testi-person">
                  <div className="hp-testi-avatar" style={{ background: t.bg }}>{t.initials}</div>
                  <div>
                    <div className="hp-testi-name">{t.name}</div>
                    <div className="hp-testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ CTA ════════ */}
      <section className="hp-cta">
        <div className="hp-cta-inner">
          <h2>Ready to find your next role?</h2>
          <p>Join thousands of professionals who use Quiety to discover and land their dream job — for free.</p>
          <div className="hp-cta-btns">
            <Link to="/register" className="hp-cta-btn-white">
              <CheckIcon /> Get Started Free
            </Link>
            <Link to="/jobs" className="hp-cta-btn-outline">
              Browse Jobs <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ SEO CONTENT ════════ */}
      <section className="hp-seo-content">
        <div className="hp-seo-inner">
          <article className="hp-seo-article">
            <h2>Your Ultimate Partner in the Modern Job Search</h2>
            <p>
              Navigating the contemporary job market requires more than just submitting resumes. At <strong>Quiety</strong>, we streamline the entire <em>job search experience</em> by connecting ambitious professionals with top-tier tech companies, startups, and global enterprises. Whether you are looking for roles in <strong>Software Development, Data Science, Product Design</strong>, or <strong>Digital Marketing</strong>, our platform curates the most relevant and verified opportunities to accelerate your career growth.
            </p>
            <h3>Why Choose Quiety for Hiring and Job Seeking?</h3>
            <p>
              We believe in creating a transparent ecosystem for both job seekers and recruiters. For candidates, our intuitive interface, real-time scraping of verified listings, and rich company profiles ensure you have all the data needed to make informed career moves. For businesses, Quiety offers a robust talent pool, enabling streamlined onboarding, effective contract management, and faster project kick-offs. We are committed to fostering a workplace environment free from inequality, where talent meets genuine opportunity.
            </p>
            <h3>Explore Diverse Career Opportunities</h3>
            <p>
              From remote software engineering roles to hybrid marketing positions, our platform is updated daily with thousands of active listings. Discover competitive salaries, flexible work environments, and companies that align with your core values. Start your journey with Quiety today and experience the future of recruitment.
            </p>
          </article>
        </div>
      </section>

      {/* ════════ NEWSLETTER ════════ */}
      <section className="hp-newsletter">
        <h2>Get job alerts in your inbox</h2>
        <p>We'll send you matching roles every morning — no spam, unsubscribe anytime.</p>
        <form className="hp-nl-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email address" />
          <button type="submit" className="hp-nl-btn">
            <SendIcon /> Notify Me
          </button>
        </form>
      </section>

      <SiteFooter />
    </div>
  )
}
