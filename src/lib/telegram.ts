export async function telegramNotify(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.warn('Telegram not configured (TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID).')
    return
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('Telegram notify failed', res.status, body)
  }
}
