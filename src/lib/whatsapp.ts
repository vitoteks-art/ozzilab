export async function sendWhatsAppText({ to, text }: { to: string; text: string }) {
  const baseUrl = process.env.EVOLUTION_API_BASE_URL
  const apiKey = process.env.EVOLUTION_API_KEY
  const instance = process.env.EVOLUTION_API_INSTANCE || 'Vitotek Systems'

  if (!baseUrl || !apiKey) {
    console.warn('Evolution API not configured (EVOLUTION_API_BASE_URL/EVOLUTION_API_KEY).')
    return
  }

  // Evolution API flavors differ by deployment; this is a common shape.
  // Adjust endpoint on VPS if your Evolution instance uses a different route.
  const res = await fetch(`${baseUrl}/message/sendText/${encodeURIComponent(instance)}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: apiKey,
    },
    body: JSON.stringify({ number: to, text }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('WhatsApp send failed', res.status, body)
  }
}
