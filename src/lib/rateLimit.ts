const globalForRate = global as unknown as { rl?: Map<string, { count: number; resetAt: number }> }

const store = globalForRate.rl ?? new Map<string, { count: number; resetAt: number }>()
if (!globalForRate.rl) globalForRate.rl = store

export function rateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string
  limit: number
  windowMs: number
}): { ok: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(key)
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1 }
  }
  if (entry.count >= limit) return { ok: false, remaining: 0 }
  entry.count += 1
  store.set(key, entry)
  return { ok: true, remaining: limit - entry.count }
}
