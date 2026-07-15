import { useNavigate } from 'react-router-dom'
import notFoundArt from '@/assets/images/404-illustration.png'
import './NotFound.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="notfound-root">


      {/* ── Main Content ── */}
      <main className="notfound-main">
        {/* Left Side: Illustration */}
        <div className="notfound-illustration">
          <img src={notFoundArt} alt="404 Not Found" />
        </div>

        {/* Right Side: Text & CTA */}
        <div className="notfound-content">
          <h1 className="notfound-title">
            Oops,<br />
            <span className="notfound-highlight">nothing</span> here...
          </h1>
          
          <p className="notfound-desc">
            Uh oh, we can't seem to find the page you're looking for.<br />
            Try going back to previous page or Contact us for more information.
          </p>
          
          <button 
            type="button" 
            className="notfound-btn-back"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </main>

      {/* ── Footer (Mockup) ── */}
      <footer className="notfound-footer">
        <div className="notfound-copyright">
          © 2026 Ecme. All rights reserved.
        </div>
        <div className="notfound-socials">
          <span className="social-icon">f</span>
          <span className="social-icon">G</span>
          <span className="social-icon">t</span>
          <span className="social-icon">in</span>
        </div>
      </footer>
    </div>
  )
}
