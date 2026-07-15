import SiteNavbar from '@components/marketing/SiteNavbar'
import SiteFooter from '@components/marketing/SiteFooter'

const SECTIONS = [
  { title: 'Acceptance of Terms', body: 'By accessing or using HireVerse, you agree to be bound by these Terms of Use. If you do not agree, please do not use the platform.' },
  { title: 'Eligibility', body: 'You must be at least 16 years old to use HireVerse. By using the platform, you represent that you meet this requirement and that all information you provide is accurate.' },
  { title: 'Account Responsibilities', body: 'You are responsible for maintaining the security of your account credentials. Do not share your password. Notify us immediately at security@hireverse.in if you believe your account has been compromised.' },
  { title: 'Acceptable Use', body: 'You may not use HireVerse to post false job listings, spam candidates, scrape data without permission, impersonate others, or engage in any unlawful activity. Violation may result in immediate account termination.' },
  { title: 'Intellectual Property', body: 'All content on HireVerse — including logos, designs, text, and software — is owned by HireVerse Technologies Pvt. Ltd. or licensed to us. You may not reproduce or distribute it without written permission.' },
  { title: 'Disclaimers', body: 'HireVerse is a marketplace that connects candidates and employers. We do not guarantee employment or the accuracy of job listings posted by third-party employers. We are not liable for hiring decisions.' },
  { title: 'Limitation of Liability', body: 'To the maximum extent permitted by law, HireVerse shall not be liable for indirect, incidental, or consequential damages arising from your use of the platform.' },
  { title: 'Governing Law', body: 'These Terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.' },
  { title: 'Changes to Terms', body: 'We may update these Terms from time to time. We will notify you of significant changes via email or an in-app notification. Continued use after the effective date constitutes acceptance.' },
]

export default function Terms() {
  return (
    <div className="hv-root">
      <SiteNavbar />
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '4rem 2rem 5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.5rem' }}>Legal</p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Terms of Use</h1>
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
