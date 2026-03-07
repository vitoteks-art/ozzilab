import nodemailer from 'nodemailer'

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const from = process.env.MAIL_FROM || 'Ozzilab <hello@ozzilab.cloud>'

  // Prefer Mailtrap API if token is provided.
  const apiToken = process.env.MAILTRAP_API_TOKEN
  if (apiToken) {
    const inboxId = process.env.MAILTRAP_INBOX_ID // required for API send
    if (!inboxId) {
      console.warn('Mailtrap API token set but MAILTRAP_INBOX_ID is missing.')
      return
    }

    const res = await fetch(`https://send.api.mailtrap.io/api/send`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        to: [{ email: to }],
        from: parseFrom(from),
        subject,
        html,
        category: 'ozzilab',
        // Mailtrap supports sandbox usage; inboxId is used for sandbox routing.
        // Some accounts may not require it; we keep it explicit.
        custom_variables: { inboxId },
      }),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error('Mailtrap API send failed', res.status, body)
      throw new Error(`Mail send failed (${res.status})`)
    }

    return
  }

  // Fallback: Mailtrap SMTP
  const host = process.env.MAILTRAP_HOST
  const port = Number(process.env.MAILTRAP_PORT || 587)
  const user = process.env.MAILTRAP_USER
  const pass = process.env.MAILTRAP_PASS

  if (!host || !user || !pass) {
    console.warn('Email not configured (MAILTRAP_API_TOKEN or MAILTRAP_HOST/USER/PASS).')
    return
  }

  const transporter = nodemailer.createTransport({ host, port, auth: { user, pass } })
  await transporter.sendMail({ from, to, subject, html })
}

function parseFrom(from: string) {
  // Supports "Name <email>" or plain email.
  const m = from.match(/^(.*)<([^>]+)>$/)
  if (!m) return { email: from.trim() }
  return { name: m[1].trim().replace(/^\"|\"$/g, ''), email: m[2].trim() }
}
