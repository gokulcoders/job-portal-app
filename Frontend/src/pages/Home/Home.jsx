import { Link, useNavigate } from 'react-router-dom'
import SiteNavbar from '@components/marketing/SiteNavbar'
import jobRecsUi from '../../assets/images/job_recommendations_ui.png'
import userFriendlyUi from '../../assets/images/user_friendly_interface_ui.png'
import advancedFilteringUi from '../../assets/images/advanced_filtering_ui.png'
import jobRoleLogo from '../../assets/images/jobrole_logo.png'
import './Home.css'

// SVGs
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
  </svg>
)
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" /></svg>
)
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3" /></svg>
)

export default function Home() {
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/jobs')
  }

  return (
    <div className="home-root">
      <SiteNavbar active="Home" />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="badge-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          #1 Top product on ProductHunt
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">Supporting Job Seekers Every Step of the Way</h1>
          <p className="hero-subtitle">Unlock your true potential and discover a world of opportunities that align with your skills, interests, and aspirations.</p>
          
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-input">
              <SearchIcon />
              <input type="text" placeholder="Find job title" />
            </div>
            <div className="hero-search-input">
              <LocationIcon />
              <input type="text" placeholder="Location, ZIP" />
            </div>
            <button type="submit" className="btn-primary">Search</button>
          </form>
        </div>

        {/* Floating Elements */}
        <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" alt="User" className="float-img img-tl" />
        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop" alt="User" className="float-img img-tr" />
        <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop" alt="User" className="float-img img-bl" />
        <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop" alt="User" className="float-img img-br" />

        <div className="float-el float-card-1">
          <div className="fc1-title">Complete your profile</div>
          <div className="fc1-stars"><StarIcon/><StarIcon/><StarIcon/><StarIcon/><StarIcon/></div>
          <div className="fc1-bar"><span></span></div>
          <div className="fc1-desc">Very good (8/10)</div>
        </div>

        <div className="float-el float-card-2">
          <div className="fc2-icon">G</div>
          <div className="fc2-text">
            <h5>Product Designer</h5>
            <p>Google • Full time</p>
          </div>
        </div>
      </section>

      {/* ── STATS & LOGOS ── */}
      <section className="section stats-section">
        <div>
          <div className="badge-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            More about JobRole
          </div>
          <h2 className="section-title" style={{fontSize: '2rem'}}>Unlock Your True Potential And Discover A World Of Opportunities That Align With Your Skills, Interests, And Aspirations</h2>
          <div className="stats-logos">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" alt="Spotify" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/McAfee_logo.svg" alt="McAfee" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" />
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-item"><h3>400K</h3><p>Job list</p></div>
          <div className="stat-item"><h3>800K</h3><p>Resume hired</p></div>
          <div className="stat-item"><h3>20K</h3><p>Company</p></div>
          <div className="stat-item"><h3>120</h3><p>Available country</p></div>
        </div>
      </section>

      {/* ── FEATURE SPLIT 1 ── */}
      <section className="section feat-split">
        <div className="feat-image-wrap">
          <video 
            src="https://cdn.dribbble.com/userupload/8110121/file/large-924a99917a9a5be1c0df90dce3876026.mp4" 
            autoPlay loop muted playsInline 
            style={{ width: '100%', borderRadius: '32px', objectFit: 'cover', height: '550px' }}
          />
          <div className="feat-card-float fc-1">
            <div className="fcf-icon"><CheckIcon /></div>
            <div className="fcf-text">
              <p>Good Morning</p>
              <span>You have successfully submitted your application...</span>
            </div>
          </div>
          <div className="feat-card-float fc-2">
            <div className="fcf-icon green"><CheckIcon /></div>
            <div className="fcf-text">
              <p>You successfully passed</p>
              <span>Congratulations you are selected!</span>
            </div>
          </div>
        </div>
        <div>
          <div className="badge-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            More about JobRole
          </div>
          <h2 className="section-title">The things you care about job matter to JobRole</h2>
          <p className="section-subtitle" style={{marginBottom: '2rem'}}>Unlock your true potential and discover a world of opportunities that align with your skills, interests, and aspirations.</p>
          <button className="btn-primary" onClick={() => navigate('/register')}>Get started free</button>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="feat-cards">
        <div className="fc-grid-inner">
          <div className="f-card">
            <div className="f-card-img" style={{ padding: 0, border: 'none', background: 'transparent' }}>
              <img src={jobRecsUi} alt="Job Recommendations UI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h4>Personalized Job Recommendations</h4>
            <p>Our algorithms track your preferences and skills to curate the perfect job match.</p>
          </div>
          <div className="f-card">
            <div className="f-card-img" style={{ padding: 0, border: 'none', background: 'transparent' }}>
              <img src={userFriendlyUi} alt="User Interface UI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h4>User-friendly and intuitive interface that is both easy to use and intuitive</h4>
            <p>You can discover what matters most - finding the perfect opportunity to boost your career forward.</p>
          </div>
          <div className="f-card">
            <div className="f-card-img" style={{ padding: 0, border: 'none', background: 'transparent' }}>
              <img src={advancedFilteringUi} alt="Advanced Filtering UI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h4>Advanced Job Filtering Options</h4>
            <p>Use advanced job filters to focus your search on the right opportunities.</p>
          </div>
        </div>
      </section>

      {/* ── FEATURE SPLIT 2 ── */}
      <section className="section feat-split-2" style={{paddingTop: '8rem'}}>
        <div>
          <div className="badge-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            JobRole's advantage
          </div>
          <h2 className="section-title">We Empower Job Seekers Like You To Streamline And Supercharge Your Job Search.</h2>
        </div>
        <div>
          <p className="section-subtitle" style={{marginBottom: '1.5rem'}}>Unlock your true potential and discover a world of opportunities that align with your skills, interests, and aspirations.</p>
          <button className="btn-primary" onClick={() => navigate('/register')}>Get started free</button>
        </div>
      </section>

      {/* ── JOB LIST ── */}
      <section className="jobs-section">
        <div className="badge-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          JobRole's features
        </div>
        <h2 className="section-title" style={{maxWidth: '800px', margin: '0 auto'}}>We Empower Job Seekers Like You To Streamline And Supercharge Your Job Search.</h2>
        <p className="section-subtitle" style={{maxWidth: '600px', margin: '1rem auto 0'}}>Unlock your true potential and discover a world of opportunities that align with your skills, interests, and aspirations.</p>
        
        <div className="jobs-tabs">
          <span className="job-tab">All</span>
          <span className="job-tab active">UI Designer</span>
          <span className="job-tab">Designer</span>
          <span className="job-tab">Accountant</span>
          <span className="job-tab">Project Manager</span>
          <span className="job-tab">Human Resource</span>
          <span className="job-tab">Marketing</span>
        </div>

        <div className="jobs-grid">
          {[
            {title: "UX/UI Designer", comp: "Flipkart", type: "Full time", loc: "Bangalore", logo: "https://ui-avatars.com/api/?name=F&background=0ea5e9&color=fff&size=128"},
            {title: "UI Designer", comp: "Zomato", type: "Full time", loc: "Gurugram", logo: "https://ui-avatars.com/api/?name=Z&background=ef4444&color=fff&size=128"},
            {title: "Senior UI Designer", comp: "Swiggy", type: "Full time", loc: "Bangalore", logo: "https://ui-avatars.com/api/?name=S&background=f97316&color=fff&size=128"},
            {title: "Product Designer", comp: "TCS", type: "Full time", loc: "Mumbai", logo: "https://ui-avatars.com/api/?name=T&background=8b5cf6&color=fff&size=128"},
            {title: "UI Designer", comp: "Infosys", type: "Full time", loc: "Pune", logo: "https://ui-avatars.com/api/?name=I&background=06b6d4&color=fff&size=128"},
            {title: "UI/UX Designer", comp: "Wipro", type: "Full time", loc: "Hyderabad", logo: "https://ui-avatars.com/api/?name=W&background=ec4899&color=fff&size=128"}
          ].map((job, i) => (
            <div key={i} className="job-card">
              <div className="jc-header">
                <div>
                  <div className="jc-title">{job.title}</div>
                  <div className="jc-company">{job.comp}</div>
                </div>
                <img className="jc-logo" src={job.logo} alt={job.comp} style={{ flexShrink: 0 }} />
              </div>
              <p className="jc-desc">You will stay connected via diverse chapters around mostly visual or user interface for our product.</p>
              <div className="jc-meta">
                <span className="jc-tag"><LocationIcon /> {job.loc}</span>
                <span className="jc-tag">⏱ {job.type}</span>
              </div>
              <div className="jc-footer">
                <button className="btn-dark" onClick={() => navigate('/jobs')}>Apply now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="section reviews-section">
        <div>
          <div className="badge-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            Testimonial
          </div>
          <h2 className="section-title">Reviews of people who get jobs using JobRole</h2>
          <p className="section-subtitle" style={{marginBottom: '2rem'}}>Unlock your true potential and discover a world of opportunities that align with your skills, interests, and aspirations.</p>
          <button className="btn-primary" onClick={() => navigate('/register')}>Join community</button>
        </div>
        <div className="review-cards">
          <div className="r-card r-card-1">
            <div className="stars"><StarIcon/><StarIcon/><StarIcon/><StarIcon/><StarIcon/></div>
            <p className="r-text">Thanks to JobRole, I secured a job in my dream company! I couldn't be happier with the support and opportunities this platform offered. Highly recommended to anyone serious about finding their perfect job.</p>
            <div className="r-author">
              <img src="https://i.pravatar.cc/150?img=11" alt="James" />
              <div>
                <h5>James Rhys</h5>
                <p>UX Researcher at Stripe</p>
              </div>
            </div>
          </div>
          <div className="r-card r-card-2">
            <div className="stars"><StarIcon/><StarIcon/><StarIcon/><StarIcon/><StarIcon/></div>
            <p className="r-text">If you're a job seeker looking for a platform that truly cares about your success, look no further. This platform is a game-changer, and I highly recommend it to anyone serious about their career.</p>
            <div className="r-author">
              <img src="https://i.pravatar.cc/150?img=5" alt="Sarah" />
              <div>
                <h5>Sarah Robinson</h5>
                <p>Software Engineer at Google</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-box">
          <div className="cta-content">
            <h2 className="cta-title">Join our community of ambitious professionals today and unlock the doors to your dream career.</h2>
            <p className="cta-desc">Unlock your true potential and discover a world of opportunities that align with your skills, interests, and aspirations.</p>
            <button className="btn-dark" onClick={() => navigate('/register')}>Get started free</button>
          </div>
          <div className="cta-graphics">
            <div className="cg-card cg-card-1">
              <div className="cg-icon">G</div>
              <div className="cg-text"><h5>UI/UX Designer</h5><p>Google • Full time</p></div>
            </div>
            <div className="cg-card cg-card-2">
              <div className="cg-icon" style={{background: '#635bff', color: 'white'}}>S</div>
              <div className="cg-text"><h5>Product Designer</h5><p>Stripe • Full time</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-logo">
              <img src={jobRoleLogo} alt="JobRole Logo" style={{ height: '44px', mixBlendMode: 'multiply', objectFit: 'contain' }} />
            </div>
            <p className="footer-logo-sub">The modern job discovery platform powered by AI.</p>
            <p className="footer-logo-sub" style={{marginTop: '1rem'}}>2023 JobRole UI. All Rights Reserved.<br/>By <b>UI8.net</b></p>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/companies">Companies</Link>
            <Link to="/jobs">Find a job</Link>
            <Link to="/register">Join</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h4>Discovering</h4>
            <Link to="#">Articles</Link>
            <Link to="#">Guides</Link>
            <Link to="#">Interview</Link>
            <Link to="#">Reports</Link>
            <Link to="#">Courses</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <Link to="#">Blog</Link>
            <Link to="#">Podcast</Link>
            <Link to="#">Content library</Link>
          </div>
          <div className="footer-col">
            <h4>Newsletter</h4>
            <p style={{color: '#64748b', fontSize: '0.9rem'}}>Subscribe to our newsletter to get latest updates.</p>
            <form className="newsletter-box" onSubmit={(e) => { e.preventDefault(); navigate('/register'); }}>
              <input type="email" placeholder="What's your email?" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-social">
            <Link to="#">Instagram</Link>
            <Link to="#">Twitter</Link>
            <Link to="#">Facebook</Link>
            <Link to="#">Linkedin</Link>
          </div>
          <div>©JobRole 2023. All Rights Reserved.</div>
        </div>
      </footer>
    </div>
  )
}
