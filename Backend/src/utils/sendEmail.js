import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }
  return transporter
}

export async function sendOtpEmail(email, code, purpose) {
  const label = purpose === 'reset' ? 'Password reset' : 'Verification'
  const mailer = getTransporter()

  if (!mailer) {
    // No email credentials configured — log the OTP instead so flows are
    // still testable end-to-end without external setup.
    console.log(`\n[email:${label}] To: ${email} — OTP code: ${code} (valid 10 minutes)\n`)
    return
  }

  await mailer.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: `${label} code: ${code}`,
    text: `Your ${label.toLowerCase()} code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your ${label.toLowerCase()} code is:</p><h2 style="letter-spacing:4px">${code}</h2><p>It expires in 10 minutes.</p>`,
  })
}
