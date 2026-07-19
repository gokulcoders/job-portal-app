import { Link, useNavigate } from 'react-router-dom'
import SiteNavbar from '@components/marketing/SiteNavbar'
import heroImg from '../../assets/hero_illustration.png'
import './Home.css'

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const ChevronDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3" /></svg>
)
const CompassIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
)
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" /></svg>
)

// ── Real platform features (kept in sync with the actual product) ─────────
const FEATURES = [
  { icon: '🔍', title: 'Live Job Aggregation', desc: 'Fresh listings pulled continuously from LinkedIn and Naukri, deduplicated into one feed.' },
  { icon: '⚡', title: 'Urgent Hiring Alerts', desc: 'A dedicated feed for roles companies need to fill immediately.' },
  { icon: '🚶', title: 'Walk-in Drive Finder', desc: 'Track walk-in interview drives by date, venue and company.' },
  { icon: '🎓', title: 'Internship Listings', desc: 'Internship opportunities filtered separately from full-time roles.' },
  { icon: '🏢', title: 'Company Directory', desc: 'Browse companies actively hiring and see what they\'re posting.' },
  { icon: '📚', title: 'Skill-Building Courses', desc: 'Video lessons with automatic progress tracking, right inside your dashboard.' },
  { icon: '🧭', title: 'Career Advice', desc: 'Curated articles on resumes, interviews and career roadmaps.' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Get notified about new matches and reminders to finish what you started.' },
  { icon: '📌', title: 'Featured Opportunities', desc: 'Hand-picked urgent hiring banners curated by our team.' },
  { icon: '📊', title: 'Personalized Dashboard', desc: 'One place for your profile, plan, notifications and saved activity.' },
  { icon: '💳', title: 'Flexible Plans', desc: 'Start free, upgrade to Pro or Teams as your needs grow.' },
  { icon: '🎨', title: 'Theme Personalization', desc: 'Dark mode, accent colors and layout — tuned to how you like to work.' },
]

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
        <div className="hp-hero-inner">
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

        <div className="hp-hero-visual">
          <svg className="hp-hero-curves" viewBox="0 0 1000 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M200,100 Q 300,-50 500,50 T 800,80" stroke="rgba(0,0,0,0.05)" strokeWidth="4" strokeLinecap="round" />
            <path d="M220,180 Q 200,120 180,100" stroke="rgba(0,0,0,0.05)" strokeWidth="4" strokeLinecap="round" />
          </svg>

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

          <div className="hp-hero-center">
            <img src={heroImg} alt="Hero Illustration" className="hp-hero-image" />
          </div>

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

      {/* ════════ SECTION 2: TRUSTED BY ════════ */}
      <section className="hp-section hp-trusted">
        <div className="hp-container">
          <p className="hp-trusted-text">Trusted by thousands of developers, freshers and experienced professionals searching for their next opportunity.</p>
          <div className="hp-trusted-logos-grid">
            {['Google', 'Microsoft', 'Amazon', 'Zoho', 'Freshworks', 'TCS', 'Infosys', 'Accenture', 'Cognizant', 'Capgemini'].map(company => (
              <div key={company} className="hp-trusted-logo-pill">{company}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 3: THE PROBLEM ════════ */}
      <section className="hp-section hp-problem">
        <div className="hp-container hp-split">
          <div className="hp-problem-left">
            <div className="hp-badge hp-badge-red">The Problem</div>
            <h2 className="hp-title-lg">Job searching is broken.</h2>
            <div className="hp-problem-list">
              {[
                { text: 'Users spend hours every day', type: 'normal' },
                { text: 'Searching LinkedIn & Naukri', type: 'normal' },
                { text: 'Searching company websites', type: 'normal' },
                { text: 'Missing walk-in drives & internships', type: 'red' },
                { text: 'Duplicate listings & Expired jobs', type: 'red' },
                { text: 'Fake jobs & No salary information', type: 'red' }
              ].map((item, i) => (
                <div key={i} className={`hp-problem-item ${item.type === 'red' ? 'hp-red' : ''}`}>
                  <div className="hp-pi-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hp-problem-right">
            <div className="hp-frustration-illustration">
              <div className="hp-frust-glow"></div>
              <div className="hp-frust-card hp-f1">
                <div className="hp-fc-icon">!</div>
                <div>
                  <div className="hp-fc-title">404 Error</div>
                  <div className="hp-fc-desc">Job listing has expired</div>
                </div>
              </div>
              <div className="hp-frust-card hp-f2">
                <div className="hp-fc-icon">!</div>
                <div>
                  <div className="hp-fc-title">Duplicate Found</div>
                  <div className="hp-fc-desc">You applied to this yesterday</div>
                </div>
              </div>
              <div className="hp-frust-card hp-f3">
                <div className="hp-fc-icon">?</div>
                <div>
                  <div className="hp-fc-title">Salary Hidden</div>
                  <div className="hp-fc-desc">Not disclosed by employer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ SECTION 4: OUR SOLUTION ════════ */}
      <section className="hp-section hp-solution">
        <div className="hp-container hp-split hp-reverse">
          <div className="hp-solution-left">
            <div className="hp-badge hp-badge-green">Our Solution</div>
            <h2 className="hp-title-lg">HireVerse does the searching for you.</h2>
            <p className="hp-solution-desc">Our AI and automation continuously monitor multiple trusted hiring sources. Everything is collected into one clean dashboard. Users only need to search once.</p>
            <div className="hp-solution-tags">
              {['LinkedIn', 'Company Career Pages', 'Walk-in Drives', 'Startup Hiring Pages', 'Recruiters', 'Internships', 'Government Jobs', 'Remote Jobs', 'Freshers Jobs'].map(tag => (
                <span key={tag} className="hp-sol-tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className="hp-solution-right">
            <div className="hp-solution-graphic">
              <div className="hp-sol-center">HireVerse AI</div>
              <div className="hp-sol-orbit"></div>
              <div className="hp-sol-dot hp-d1">LinkedIn</div>
              <div className="hp-sol-dot hp-d2">Careers</div>
              <div className="hp-sol-dot hp-d3">Walk-ins</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ SECTION 5: HOW HIREVERSE WORKS ════════ */}
      <section className="hp-section hp-how">
        <div className="hp-container">
          <h2 className="hp-title-lg hp-text-center">How HireVerse Works</h2>
          <div className="hp-timeline">
            {[
              { title: 'AI discovers jobs every few minutes' },
              { title: 'Jobs are verified' },
              { title: 'Duplicates removed' },
              { title: 'Salary estimated' },
              { title: 'Skills extracted' },
              { title: 'Users receive notifications' },
              { title: 'Apply directly on company website' }
            ].map((step, i) => (
              <div key={i} className="hp-timeline-step">
                <div className="hp-tl-num">{i + 1}</div>
                <div className="hp-tl-content">{step.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 6: WHY HIREVERSE IS BETTER ════════ */}
      <section className="hp-section hp-compare">
        <div className="hp-container">
          <h2 className="hp-title-lg hp-text-center">Why HireVerse is Better</h2>
          <div className="hp-compare-table-wrap">
            <table className="hp-compare-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>LinkedIn</th>
                  <th>Naukri</th>
                  <th>Indeed</th>
                  <th className="hp-highlight-col">HireVerse</th>
                </tr>
              </thead>
              <tbody>
                {[
                  'Live Scraping', 'Walk-in Detection', 'Internships', 'Company Careers',
                  'Direct Apply', 'Salary Insights', 'Smart Filters', 'AI Recommendations',
                  'Referral Detection', 'Freshness Score', 'No Fake Listings', 'Job Alerts',
                  'Resume Matching', 'ATS Resume Score', 'Career Roadmaps', 'Skill Gap Analysis',
                  'Application Tracker', 'Company Reviews', 'One Dashboard'
                ].map(feat => (
                  <tr key={feat}>
                    <td className="hp-feat-name">{feat}</td>
                    <td className="hp-cross">−</td>
                    <td className="hp-cross">−</td>
                    <td className="hp-cross">−</td>
                    <td className="hp-check hp-highlight-col">✓</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ════════ SECTION 7: EVERYTHING YOU GET ════════ */}
      <section className="hp-section hp-features">
        <div className="hp-container">
          <div className="hp-badge" style={{ display: 'block', width: 'fit-content', margin: '0 auto 1rem' }}>Everything In One Place</div>
          <h2 className="hp-title-lg hp-text-center">Everything you get with HireVerse</h2>
          <p className="hp-features-sub">No separate tools for job search, learning and career advice — it's all one dashboard.</p>
          <div className="hp-features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="hp-feature-card">
                <div className="hp-f-icon">{f.icon}</div>
                <div className="hp-f-title">{f.title}</div>
                <div className="hp-f-desc">{f.desc}</div>
              </div>
            ))}
          </div>
          <div className="hp-features-cta">
            <span>Every one of these is free to start.</span>
            <Link to="/register" className="hp-inline-link">Create your free account →</Link>
          </div>
        </div>
      </section>

      {/* ════════ SECTION 7B: GROW YOUR CAREER ════════ */}
      <section className="hp-section hp-career">
        <div className="hp-container hp-split hp-reverse">
          <div className="hp-career-left">
            <div className="hp-badge hp-badge-green">Beyond The Job Offer</div>
            <h2 className="hp-title-lg">Land the job. Then grow the career.</h2>
            <p className="hp-solution-desc">
              HireVerse doesn't stop once you're hired. Learn in-demand skills with built-in
              video courses, pick up exactly where you left off, and read career advice written
              for wherever you are right now — all from the same dashboard where you found your job.
            </p>
            <div className="hp-career-points">
              <div className="hp-career-point">
                <div className="hp-cp-icon"><PlayIcon /></div>
                <div>
                  <div className="hp-cp-title">Courses with real progress tracking</div>
                  <div className="hp-cp-desc">Every lesson you watch is saved automatically, so you always know how far you've come.</div>
                </div>
              </div>
              <div className="hp-career-point">
                <div className="hp-cp-icon"><CompassIcon /></div>
                <div>
                  <div className="hp-cp-title">Career advice, curated</div>
                  <div className="hp-cp-desc">Resume tips, interview prep and role roadmaps — practical, not generic.</div>
                </div>
              </div>
              <div className="hp-career-point">
                <div className="hp-cp-icon"><BellIcon /></div>
                <div>
                  <div className="hp-cp-title">A nudge when you go quiet</div>
                  <div className="hp-cp-desc">Started a course and drifted off? We'll remind you to pick it back up.</div>
                </div>
              </div>
            </div>
            <div className="hp-career-cta">
              <Link to="/courses" className="hp-btn-primary">Explore Courses</Link>
              <Link to="/career" className="hp-btn-outline">Read Career Advice</Link>
            </div>
          </div>

          <div className="hp-career-right">
            <div className="hp-career-graphic">
              <div className="hp-cg-glow" />
              <div className="hp-cg-course-card">
                <div className="hp-cg-thumb"><PlayIcon /></div>
                <div className="hp-cg-course-info">
                  <div className="hp-cg-course-title">React Fundamentals</div>
                  <div className="hp-cg-progress-track"><div className="hp-cg-progress-fill" style={{ width: '72%' }} /></div>
                  <div className="hp-cg-progress-label">72% complete</div>
                </div>
              </div>
              <div className="hp-cg-badge hp-cg-badge-1"><CheckIcon /> Lesson completed</div>
              <div className="hp-cg-badge hp-cg-badge-2"><StarIcon /> New: Interview prep guide</div>
              <div className="hp-cg-ring">
                <svg viewBox="0 0 80 80" width="80" height="80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border-color)" strokeWidth="7" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#10b981" strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34}`} strokeDashoffset={`${2 * Math.PI * 34 * (1 - 0.82)}`}
                    transform="rotate(-90 40 40)" />
                </svg>
                <div className="hp-cg-ring-label"><strong>82%</strong><span>avg. finish rate</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ SECTION 8: LIVE STATISTICS ════════ */}
      <section className="hp-section hp-stats2">
        <div className="hp-container">
          <h2 className="hp-title-lg hp-text-center">Live Statistics</h2>
          <div className="hp-stats2-grid">
            {[
              { val: '24,500+', label: 'Jobs scraped today' },
              { val: '1,200+', label: 'Companies monitored' },
              { val: '350+', label: 'Walk-ins found today' },
              { val: '5,000+', label: 'Internships' },
              { val: '12,000+', label: 'Users placed' },
              { val: '80K+', label: 'Daily visitors' },
              { val: '4,500+', label: 'Recruiters' },
              { val: '₹14 LPA', label: 'Average salary' },
              { val: '12', label: 'Countries' },
              { val: '45+', label: 'Cities' },
            ].map(s => (
              <div key={s.label} className="hp-stat2-card">
                <div className="hp-s2-val">{s.val}</div>
                <div className="hp-s2-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 9: SPECIAL TECHNOLOGY ════════ */}
      <section className="hp-section hp-tech">
        <div className="hp-container">
          <h2 className="hp-title-lg hp-text-center">Special Technology</h2>
          <div className="hp-tech-graphic">
            <div className="hp-tech-core">HireVerse Engine</div>
            <div className="hp-tech-nodes">
              {['AI Job Discovery', 'Crawler Engine', 'Duplicate Detection', 'Smart Ranking', 'Keyword Matching', 'Resume Matching', 'Notification Engine', 'Recommendation Engine', 'Real-time Database', 'Search Engine'].map(node => (
                <div key={node} className="hp-tech-node">{node}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ SECTION 10: WHY COMPANIES LOVE HIREVERSE ════════ */}
      <section className="hp-section hp-companies-love">
        <div className="hp-container hp-split">
          <div className="hp-cl-left">
            <h2 className="hp-title-lg">Why Companies Love HireVerse</h2>
            <p className="hp-cl-desc">Reach the top 1% of talent instantly. Skip the noise and hire faster.</p>
          </div>
          <div className="hp-cl-right">
            <div className="hp-cl-grid">
              {['Receive qualified applicants', 'Faster hiring', 'Verified candidates', 'Resume filtering', 'Company branding', 'Analytics dashboard', 'Hiring campaigns', 'Walk-in promotion', 'Internship management', 'Campus hiring'].map(c => (
                <div key={c} className="hp-cl-item">
                  <CheckIcon /> {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ SECTION 11: SUCCESS STORIES ════════ */}
      <section className="hp-section hp-success">
        <div className="hp-container">
          <h2 className="hp-title-lg hp-text-center">Success Stories</h2>
          <div className="hp-success-grid">
            {[
              { name: 'Arun Kumar', role: 'SDE at Amazon', inc: '+120% Salary', timeline: ['Joined HireVerse', 'Matched to Amazon', 'Offer Received'] },
              { name: 'Neha Sharma', role: 'Frontend at Zoho', inc: '+85% Salary', timeline: ['Uploaded Resume', 'Attended Walk-in', 'Company Joined'] },
              { name: 'Ravi Teja', role: 'Data Analyst at TCS', inc: 'Fresher to 8LPA', timeline: ['Started Job Hunt', 'Interview Prep', 'Offer Received'] }
            ].map((st, i) => (
              <div key={i} className="hp-success-card">
                <div className="hp-sc-head">
                  <div className="hp-sc-avatar">{st.name[0]}</div>
                  <div>
                    <div className="hp-sc-name">{st.name}</div>
                    <div className="hp-sc-role">{st.role}</div>
                  </div>
                  <div className="hp-sc-inc">{st.inc}</div>
                </div>
                <div className="hp-sc-timeline">
                  {st.timeline.map((t, j) => (
                    <div key={j} className="hp-sct-item">
                      <div className="hp-sct-dot"></div>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 12: FAQ ════════ */}
      <section className="hp-section hp-faq">
        <div className="hp-container">
          <h2 className="hp-title-lg hp-text-center">Frequently Asked Questions</h2>
          <div className="hp-faq-grid">
            {[
              { q: 'Where do jobs come from?', a: 'Our AI aggregates jobs from LinkedIn, company career pages, and direct employer postings.' },
              { q: 'How often are jobs updated?', a: 'We run discovery engines every few minutes to ensure you get live alerts.' },
              { q: 'Are jobs verified?', a: 'Yes. Our duplicate detection and AI verification removes fake and expired listings.' },
              { q: 'How do walk-ins work?', a: 'We specifically track local walk-in drives and notify you with dates, venues, and requirements.' },
              { q: 'Can I upload a resume?', a: 'Yes! Our ATS resume checker will parse it and match you with the best roles automatically.' },
              { q: 'Is HireVerse free?', a: 'Absolutely free for job seekers.' }
            ].map((faq, i) => (
              <div key={i} className="hp-faq-item">
                <div className="hp-faq-q">{faq.q}</div>
                <div className="hp-faq-a">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SECTION 13: FINAL CTA ════════ */}
      <section className="hp-section hp-final-cta">
        <div className="hp-container hp-fcta-inner">
          <div className="hp-fcta-bg"></div>
          <h2 className="hp-title-lg">Your Dream Job Is Already Waiting.</h2>
          <p>Start finding opportunities before everyone else.</p>
          <div className="hp-fcta-btns">
            <Link to="/register" className="hp-btn-primary">Start Free</Link>
            <Link to="/jobs" className="hp-btn-secondary">Explore Jobs</Link>
          </div>
        </div>
      </section>

      {/* ════════ SECTION 14: PREMIUM FOOTER ════════ */}
      <footer className="hp-premium-footer">
        <div className="hp-container">
          <div className="hp-footer-grid">
            <div className="hp-footer-col">
              <h3 className="hp-footer-logo">HireVerse</h3>
              <p className="hp-footer-tagline">The modern job discovery platform powered by AI.</p>
            </div>
            <div className="hp-footer-col">
              <h4>Products</h4>
              <Link to="/jobs">Jobs</Link>
              <Link to="/walk-in">Walk-ins</Link>
              <Link to="/internships">Internships</Link>
              <Link to="/companies">Companies</Link>
            </div>
            <div className="hp-footer-col">
              <h4>Career Guidance</h4>
              <Link to="#">Resume Builder</Link>
              <Link to="#">ATS Checker</Link>
              <Link to="#">Salary Calculator</Link>
              <Link to="#">Interview Prep</Link>
            </div>
            <div className="hp-footer-col">
              <h4>Resources</h4>

              <Link to="#">Success Stories</Link>
              <Link to="#">Community</Link>
              <Link to="#">Support</Link>
            </div>
          </div>
          <div className="hp-footer-bottom">
            <div className="hp-fb-links">
              <Link to="#">Privacy</Link>
              <Link to="#">Terms</Link>

            </div>
            <div className="hp-fb-socials">
              <span>LinkedIn</span>
              <span>GitHub</span>
              <span>Twitter</span>
              <span>Discord</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
