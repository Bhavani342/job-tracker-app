import { memo } from 'react'
import { PRIORITY, tagColor } from '@/utils/helpers'
import { COLUMNS } from '@/context/TrackerContext'

// ── Status Badge ──────────────────────────────────────────────────────────
export const StatusBadge = memo(({ status, size = 'sm' }) => {
  const col = COLUMNS.find(c => c.id === status)
  if (!col) return null
  const fs = size === 'sm' ? 10 : 12
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:4,
      padding: size === 'sm' ? '2px 7px' : '4px 10px',
      borderRadius:20, fontSize:fs, fontWeight:700,
      letterSpacing:'0.03em', textTransform:'uppercase',
      background:`${col.color}22`, color:col.color,
      border:`1px solid ${col.color}44`,
      whiteSpace:'nowrap',
    }}>
      {col.emoji} {col.label}
    </span>
  )
})

// ── Priority Badge ────────────────────────────────────────────────────────
export const PriorityBadge = memo(({ priority }) => {
  const p = PRIORITY[priority]
  if (!p) return null
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:3,
      padding:'2px 7px', borderRadius:20,
      fontSize:10, fontWeight:700, letterSpacing:'0.03em',
      background:p.bg, color:p.color,
      border:`1px solid ${p.color}44`,
    }}>
      {priority === 'high' ? '🔥' : priority === 'medium' ? '⚡' : '💤'} {p.label}
    </span>
  )
})

// ── Tag Chip ──────────────────────────────────────────────────────────────
export const TagChip = memo(({ tag, onRemove }) => {
  const color = tagColor(tag)
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:4,
      padding:'2px 8px', borderRadius:20,
      fontSize:11, fontWeight:600,
      background:`${color}18`, color,
      border:`1px solid ${color}35`,
    }}>
      {tag}
      {onRemove && (
        <button onClick={()=>onRemove(tag)} style={{ fontSize:13, opacity:0.7, lineHeight:1, color, padding:'0 2px' }}>×</button>
      )}
    </span>
  )
})

// ── Button ────────────────────────────────────────────────────────────────
export const Btn = memo(({ children, onClick, variant='ghost', size='md', disabled, title, style:sx={} }) => {
  const variants = {
    primary: { background:'#6366F1', color:'#fff', border:'none', boxShadow:'0 2px 12px #6366F140' },
    ghost:   { background:'transparent', color:'var(--text2)', border:'1px solid var(--border)' },
    danger:  { background:'transparent', color:'#EF4444', border:'1px solid #EF444440' },
    success: { background:'#10B98120', color:'#10B981', border:'1px solid #10B98140' },
  }
  const sizes = {
    sm: { padding:'5px 10px', fontSize:12, borderRadius:8 },
    md: { padding:'7px 14px', fontSize:13, borderRadius:9 },
    lg: { padding:'10px 20px', fontSize:14, borderRadius:10 },
  }
  return (
    <button onClick={onClick} disabled={disabled} title={title}
      style={{
        display:'inline-flex', alignItems:'center', gap:5,
        fontWeight:600, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition:'all 0.12s',
        ...variants[variant], ...sizes[size], ...sx,
      }}
      onMouseEnter={e=>{ if(!disabled && variant==='ghost') e.currentTarget.style.background='var(--bg4)' }}
      onMouseLeave={e=>{ if(!disabled && variant==='ghost') e.currentTarget.style.background='transparent' }}
    >{children}</button>
  )
})

// ── Text Input ────────────────────────────────────────────────────────────
export const Field = memo(({ label, value, onChange, placeholder, type='text', required, multiline, rows=3 }) => (
  <label style={{ display:'flex', flexDirection:'column', gap:5 }}>
    {label && (
      <span style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>
        {label}{required && <span style={{color:'#EF4444'}}> *</span>}
      </span>
    )}
    {multiline ? (
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ padding:'9px 12px', resize:'vertical', lineHeight:1.5 }}/>
    ) : (
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ padding:'9px 12px' }}/>
    )}
  </label>
))

// ── Select ────────────────────────────────────────────────────────────────
export const Select = memo(({ label, value, onChange, options }) => (
  <label style={{ display:'flex', flexDirection:'column', gap:5 }}>
    {label && (
      <span style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>
        {label}
      </span>
    )}
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{ padding:'9px 12px', cursor:'pointer' }}>
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  </label>
))

// ── Empty State ───────────────────────────────────────────────────────────
export const EmptyState = memo(({ icon='📭', title, subtitle, action }) => (
  <div style={{
    display:'flex', flexDirection:'column', alignItems:'center',
    justifyContent:'center', gap:10, padding:'40px 20px',
    color:'var(--text3)', textAlign:'center',
  }}>
    <span style={{ fontSize:40 }}>{icon}</span>
    <p style={{ fontSize:14, fontWeight:600, color:'var(--text2)' }}>{title}</p>
    {subtitle && <p style={{ fontSize:12 }}>{subtitle}</p>}
    {action}
  </div>
))
