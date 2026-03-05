import { customAlphabet } from 'nanoid'

const alpha = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 4)

function yyyymmdd(d = new Date()) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}${mm}${dd}`
}

export function makeAuditId() {
  return `AUD-${yyyymmdd()}-${alpha()}`
}

export function makeSubmissionId() {
  return `SUB-${yyyymmdd()}-${alpha()}`
}
