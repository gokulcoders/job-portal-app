import SiteNavbar from '@components/marketing/SiteNavbar'
import SiteFooter from '@components/marketing/SiteFooter'

const SECTIONS = [
  { title: 'Information We Collect', body: 'We collect information you provide directly (name, email, resume, work history) and information generated when you use HireVerse (search queries, application clicks, page views, device info). We do not sell your personal information to third parties.' },
  { title: 'How We Use Your Information', body: 'We use your data to match you with relevant jobs, improve our AI recommendations, send you job alerts you opt into, and keep the platform secure. We never use your data for unrelated advertising.' },
  { title: 'Data Sharing', body: 'We share your profile only with employers you explicitly apply to. Aggregated, anonymised statistics may be shared with research partners. We will never share your information without your consent beyond what is described here.' },
  { title: 'Cookies & Tracking', body: 'We use essential cookies for session management and optional analytics cookies to improve the product. You can manage cookie preferences at any time through your browser or our cookie settings panel.' },
  { title: 'Data Retention', body: 'Your account data is retained as long as your account is active. You can delete your account at any time from Settings → Account. After deletion, we remove identifiable data within 30 days.' },
  { title: 'Your Rights', body: 'Under PDPB (India) and GDPR (EU), you have the right to access, correct, port, or delete your personal data. Submit a request to privacy@hireverse.in and we will respond within 30 days.' },
  { title: 'Contact Us', body: 'For privacy questions, contact our Data Protection Officer at privacy@hireverse.in or write to HireVerse Technologies Pvt. Ltd., 100 Brigade Road, Bengaluru, KA 560025, India.' },
]

export default function Privacy() {
  return (
    <div className="hv-root">
      <SiteNavbar />
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '4rem 2rem 5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.5rem' }}>Legal</p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Privacy Policy</h1>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '3rem' }}>Last updated: 1 January 2026</p>
        {SECTIONS.map(s => (
          <div key={s.title} style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #f3f4f6' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.6rem', color: '#111827' }}>{s.title}</h2>
            <p style={{ fontSize: '0.92rem', color: '#4b5563', lineHeight: 1.75, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </section>
      <SiteFooter />
    </div>
  )
}
