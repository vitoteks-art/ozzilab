export function absoluteUrl(pathname: string) {
  const base = process.env.PUBLIC_BASE_URL || 'http://localhost:3000'
  return new URL(pathname, base).toString()
}
