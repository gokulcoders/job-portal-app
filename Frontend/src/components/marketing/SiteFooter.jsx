import { Link } from 'react-router-dom'
import './site.css'

const FOOTER_COLS = [
  {
    heading: 'For Candidates',
    links: [
      { label: 'Browse Jobs',     to: '/jobs' },
      { label: 'Urgent Hiring',   to: '/urgent-hiring' },
      { label: 'Walk-in Drives',  to: '/walk-in' },
      { label: 'Internships',     to: '/internships' },
    ],
  },
  {
    heading: 'Explore',
    links: [
      { label: 'Companies',       to: '/companies' },
      { label: 'Courses',         to: '/courses' },
      { label: 'Career Guidance', to: '/career' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',        to: '/about' },
      { label: 'Pricing',         to: '/pricing' },
      { label: 'Contact',         to: '/contact' },
      { label: 'Privacy Policy',  to: '/privacy' },
      { label: 'Terms of Use',    to: '/terms' },
    ],
  },
]

export default function SiteFooter() {
  return (
    <footer className="hv-footer">
      <div className="hv-footer-inner">
        <div className="hv-footer-brand">
          <Link to="/" className="hv-logo">
            <span className="hv-logo-dot" />
            Hire<span className="hv-logo-accent">Verse</span>
          </Link>
          <p>The premier job platform built for the modern career. AI-powered matching, walk-in events, and world-class companies — all in one place.</p>
        </div>
        {FOOTER_COLS.map((col) => (
          <div className="hv-footer-col" key={col.heading}>
            <h4>{col.heading}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="hv-footer-bottom">
        <span>© 2026 HireVerse. All rights reserved.</span>
        <span>Built for ambitious careers.</span>
      </div>
    </footer>
  )
}
