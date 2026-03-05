import nodemailer from 'nodemailer'

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const host = process.env.MAILTRAP_HOST
  const port = Number(process.env.MAILTRAP_PORT || 587)
  const user = process.env.MAILTRAP_USER
  const pass = process.env.MAILTRAP_PASS
  const from = process.env.MAIL_FROM || 'Ozzilab <hello@ozzilab.cloud>'

  if (!host || !user || !pass) {
    console.warn('Mailtrap SMTP not configured (MAILTRAP_HOST/USER/PASS).')
    return
  }

  const transporter = nodemailer.createTransport({ host, port, auth: { user, pass } })

  await transporter.sendMail({ from, to, subject, html })
}
