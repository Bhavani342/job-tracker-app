// ── Date formatting ───────────────────────────────────────────────────────
export function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
}

export function daysAgo(d) {
  if (!d) return ''
  const diff = Math.floor((Date.now() - new Date(d)) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return `${diff}d ago`
}

export function daysUntil(d) {
  if (!d) return null
  const diff = Math.ceil((new Date(d) - Date.now()) / 86400000)
  if (diff < 0)  return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Today!'
  if (diff === 1) return 'Tomorrow!'
  return `In ${diff} days`
}

// ── Priority ──────────────────────────────────────────────────────────────
export const PRIORITY = {
  high:   { label: 'High',   color: '#EF4444', bg: '#EF444420' },
  medium: { label: 'Medium', color: '#F59E0B', bg: '#F59E0B20' },
  low:    { label: 'Low',    color: '#6B7280', bg: '#6B728020' },
}

// ── Export CSV ────────────────────────────────────────────────────────────
export function exportCSV(jobs) {
  const headers = ['Company','Role','Status','Location','Salary','Type','Applied Date','Interview Date','Priority','Notes','URL','Tags']
  const rows    = jobs.map(j => [
    j.company, j.role, j.status, j.location, j.salary,
    j.type, j.appliedDate, j.interviewDate || '',
    j.priority, j.notes.replace(/,/g,''), j.url,
    j.tags.join('; '),
  ])
  const csv  = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `job-applications-${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Tag colors ────────────────────────────────────────────────────────────
const TAG_PALETTE = [
  '#6366F1','#8B5CF6','#EC4899','#F59E0B',
  '#10B981','#3B82F6','#14B8A6','#F97316',
]
const tagCache = {}
export function tagColor(tag) {
  if (!tagCache[tag]) {
    const idx = tag.split('').reduce((a,c) => a + c.charCodeAt(0), 0)
    tagCache[tag] = TAG_PALETTE[idx % TAG_PALETTE.length]
  }
  return tagCache[tag]
}

// ── Chart data builder ────────────────────────────────────────────────────
export function buildTimelineChart(jobs) {
  const counts = {}
  jobs.forEach(j => {
    const d = j.appliedDate?.slice(0, 7) // YYYY-MM
    if (d) counts[d] = (counts[d] || 0) + 1
  })
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, count]) => ({
      label: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      count,
    }))
}

export function buildStatusChart(jobs, columns) {
  return columns.map(col => ({
    label: col.label,
    count: jobs.filter(j => j.status === col.id).length,
    color: col.color,
    emoji: col.emoji,
  }))
}
