import { memo, useState } from 'react'
import { StatusBadge, PriorityBadge, TagChip } from '@/components/ui'
import { daysAgo, daysUntil } from '@/utils/helpers'

const JobCard = memo(({ job, onClick, onDragStart, onDragEnd }) => {
  const [hover, setHover] = useState(false)
  const countdown = job.interviewDate ? daysUntil(job.interviewDate) : null
  const isUrgent  = countdown && (countdown.includes('Today') || countdown.includes('Tomorrow') || countdown.includes('overdue'))

  return (
    <div
      draggable
      onDragStart={e => { e.dataTransfer.setData('jobId', job.id); onDragStart?.(job.id) }}
      onDragEnd={onDragEnd}
      onClick={() => onClick(job)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="fade-up"
      style={{
        background: hover ? 'var(--bg4)' : 'var(--bg3)',
        border:`1px solid ${hover ? 'var(--border2)' : 'var(--border)'}`,
        borderRadius:12, padding:'12px 14px',
        cursor:'pointer',
        transition:'all 0.12s',
        boxShadow: hover ? '0 4px 20px rgba(0,0,0,0.4)' : 'var(--shadow-card)',
        transform: hover ? 'translateY(-1px)' : 'none',
        userSelect:'none',
      }}
    >
      {/* Top row */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:8 }}>
        <div style={{ minWidth:0 }}>
          <p style={{
            fontSize:14, fontWeight:700, color:'var(--text)',
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{job.company}</p>
          <p style={{
            fontSize:12, color:'var(--text2)',
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            marginTop:1,
          }}>{job.role}</p>
        </div>
        <PriorityBadge priority={job.priority} />
      </div>

      {/* Meta row */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:8, fontSize:11, color:'var(--text3)' }}>
        {job.location && (
          <span style={{ display:'flex', alignItems:'center', gap:3 }}>
            📍 {job.location}
          </span>
        )}
        {job.salary && (
          <span style={{ display:'flex', alignItems:'center', gap:3 }}>
            💰 {job.salary}
          </span>
        )}
      </div>

      {/* Tags */}
      {job.tags.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:8 }}>
          {job.tags.slice(0,3).map(t => <TagChip key={t} tag={t} />)}
          {job.tags.length > 3 && (
            <span style={{ fontSize:10, color:'var(--text3)', alignSelf:'center' }}>+{job.tags.length-3}</span>
          )}
        </div>
      )}

      {/* Interview countdown */}
      {countdown && (
        <div style={{
          padding:'4px 8px', borderRadius:6, marginBottom:8,
          background: isUrgent ? '#EF444420' : '#6366F115',
          border:`1px solid ${isUrgent ? '#EF444440' : '#6366F130'}`,
          fontSize:11, fontWeight:600,
          color: isUrgent ? '#EF4444' : '#6366F1',
          display:'flex', alignItems:'center', gap:4,
        }}>
          {isUrgent ? '⏰' : '📅'} Interview: {countdown}
        </div>
      )}

      {/* Footer */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:4 }}>
        <span style={{ fontSize:10, color:'var(--text4)' }}>
          Applied {daysAgo(job.appliedDate)}
        </span>
        {job.notes && (
          <span title={job.notes} style={{ fontSize:12, cursor:'default' }}>📝</span>
        )}
      </div>
    </div>
  )
})

export default JobCard
