// Date, id and formatting helpers shared by every page.

export function makeId() {
  return (
    Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9)
  )
}

/** Today's date as YYYY-MM-DD (local time). */
export function todayISO() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** Parse YYYY-MM-DD into a local Date at midnight. */
export function parseDate(iso) {
  if (!iso || typeof iso !== 'string') return null
  const parts = iso.split('-').map((p) => parseInt(p, 10))
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null
  return new Date(parts[0], parts[1] - 1, parts[2])
}

/** Whole-day difference (target - today). Negative means the date has passed. */
export function daysUntil(iso) {
  const target = parseDate(iso)
  if (!target) return null
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((target - today) / 86400000)
}

/** Human friendly date such as "24 Oct 2026". */
export function formatDate(iso) {
  const d = parseDate(iso)
  if (!d) return 'No date'
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Human friendly 24h start time combined with duration. */
export function formatTimeRange(startTime, durationMinutes) {
  if (!startTime) return 'Time not set'
  const [h, m] = startTime.split(':').map((n) => parseInt(n, 10))
  if (Number.isNaN(h)) return startTime
  const start = new Date()
  start.setHours(h, m || 0, 0, 0)
  const end = new Date(start.getTime() + (Number(durationMinutes) || 0) * 60000)
  const fmt = (d) =>
    d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  return `${fmt(start)} - ${fmt(end)}`
}

/** Friendly label for a relative day. */
export function relativeDayLabel(iso) {
  const diff = daysUntil(iso)
  if (diff === null) return ''
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  if (diff > 1) return `In ${diff} days`
  return `${Math.abs(diff)} days ago`
}

export function clampPercent(value) {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 0
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function percentOf(part, total) {
  if (!total) return 0
  return clampPercent((part / total) * 100)
}
