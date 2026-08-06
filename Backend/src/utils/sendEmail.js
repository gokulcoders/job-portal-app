export async function sendOtpEmail(email, code, purpose) {
  const label = purpose === 'reset' ? 'Password reset' : 'Verification'

  // If EmailJS is configured, use it (This bypasses Render's SMTP block)
  if (process.env.EMAILJS_SERVICE_ID) {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': process.env.FRONTEND_URL || 'http://localhost:5173',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY,      // EmailJS Public Key
          accessToken: process.env.EMAILJS_PRIVATE_KEY, // EmailJS Private Key
          template_params: {
            to_email: email,
            label: label,
            code: code,
          },
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        console.error('EmailJS Error:', text)
      } else {
        console.log(`EmailJS: Successfully sent ${label} to ${email}`)
      }
    } catch (error) {
      console.error('EmailJS request failed:', error)
    }
    return
  }

  // Fallback to console logging if no Email provider is configured
  console.log(`\n[email:${label}] To: ${email} — OTP code: ${code} (valid 10 minutes)\n`)
}
