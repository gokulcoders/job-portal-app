import { useState } from 'react'
import { toast } from 'sonner'
import SiteNavbar from '@components/marketing/SiteNavbar'
import SiteFooter from '@components/marketing/SiteFooter'

const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)
const MessageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)
const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.34 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.49 5.49l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const CHANNELS = [
  { Icon: MailIcon,    iconBg: '#ede9fe', iconColor: '#7c3aed', label: 'Email',     value: 'support@hireverse.in' },
  { Icon: MessageIcon, iconBg: '#d1fae5', iconColor: '#065f46', label: 'Live Chat', value: 'Available 9am – 6pm IST' },
  { Icon: PhoneIcon,   iconBg: '#dbeafe', iconColor: '#1d4ed8', label: 'Phone',     value: '+91 80 4567 8900' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.')
      return
    }
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    toast.success('Message sent! We\'ll get back to you within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const field = { background: '#fff', border: '1.5px solid #ede9fe', borderRadius: 12, padding: '0.75rem 1rem', fontSize: '0.9rem', width: '100%', outline: 'none', fontFamily: 'inherit', color: '#111827', boxSizing: 'border-box', transition: 'border-color 0.15s' }

  return (
    <div className="hv-root">
      <SiteNavbar active="Contact" />

      <section style={{ textAlign: 'center', padding: '4rem 2rem 2.5rem', background: 'radial-gradient(120% 100% at 50% 0%,#fbe8ff 0%,#f6f1ff 40%,#fff 80%)' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.75rem' }}>Get in touch</p>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.75rem' }}>We'd love to hear from you.</h1>
        <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>Have a question, feedback, or partnership inquiry? Drop us a line.</p>
      </section>

      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '3rem 2rem 5rem', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* Contact info */}
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Contact channels</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {CHANNELS.map(({ Icon, iconBg, iconColor, label, value }) => (
              <div key={label} style={{ background: '#fff', border: '1.5px solid #ede9fe', borderRadius: 16, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{label}</div>
                  <div style={{ fontSize: '0.83rem', color: '#6b7280', marginTop: '0.15rem' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1.5px solid #ede9fe', borderRadius: 24, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.25rem' }}>Send a message</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Name *</label>
              <input style={field} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Your name" required />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Email *</label>
              <input type="email" style={field} value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="you@email.com" required />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Subject</label>
            <input style={field} value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} placeholder="How can we help?" />
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Message *</label>
            <textarea style={{ ...field, minHeight: 140, resize: 'vertical' }} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} placeholder="Tell us more..." required />
          </div>
          <button type="submit" disabled={sending} style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', color: '#fff', border: 'none', borderRadius: 999, padding: '0.8rem 1.75rem', fontWeight: 700, fontSize: '0.9rem', cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1, fontFamily: 'inherit' }}>
            {sending ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </section>

      <SiteFooter />
    </div>
  )
}
