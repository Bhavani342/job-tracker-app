import { memo, useState } from 'react'
import JobCard from './JobCard'
import { EmptyState } from '@/components/ui'
import { useTracker } from '@/context/TrackerContext'

const KanbanColumn = memo(({ col, jobs, onCardClick, onAddClick }) => {
  const { moveJob } = useTracker()
  const [dragOver, setDragOver] = useState(false)
  const [draggingId, setDraggingId] = useState(null)

  const handleDrop = e => {
    e.preventDefault()
    const jobId = e.dataTransfer.getData('jobId')
    if (jobId) moveJob(jobId, col.id)
    setDragOver(false)
    setDraggingId(null)
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      style={{
        width:280, flexShrink:0,
        display:'flex', flexDirection:'column',
        background: dragOver ? `${col.color}08` : 'var(--bg2)',
        border:`1px solid ${dragOver ? col.color + '60' : 'var(--border)'}`,
        borderRadius:16,
        transition:'border-color 0.15s, background 0.15s',
        maxHeight:'100%',
        overflow:'hidden',
      }}
    >
      {/* Column header */}
      <div style={{
        padding:'14px 14px 10px',
        borderBottom:'1px solid var(--border)',
        flexShrink:0,
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{
              width:8, height:8, borderRadius:'50%',
              background:col.color,
              boxShadow:`0 0 8px ${col.color}80`,
            }}/>
            <span style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>
              {col.label}
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{
              fontSize:11, fontWeight:700,
              background:`${col.color}22`, color:col.color,
              padding:'2px 8px', borderRadius:20,
              border:`1px solid ${col.color}33`,
            }}>{jobs.length}</span>
            <button
              onClick={() => onAddClick(col.id)}
              title="Add job"
              style={{
                width:22, height:22, borderRadius:6,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:16, color:'var(--text3)',
                transition:'all 0.1s',
              }}
              onMouseEnter={e=>{ e.currentTarget.style.background='var(--bg4)'; e.currentTarget.style.color=col.color }}
              onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text3)' }}
            >+</button>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{
        flex:1, overflowY:'auto',
        padding:'10px 10px 14px',
        display:'flex', flexDirection:'column', gap:8,
      }}>
        {jobs.length === 0 ? (
          <EmptyState
            icon={col.emoji}
            title={`No ${col.label} jobs`}
            subtitle="Drag cards here or click +"
          />
        ) : (
          jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onClick={onCardClick}
              onDragStart={setDraggingId}
              onDragEnd={() => setDraggingId(null)}
            />
          ))
        )}

        {/* Drop zone indicator */}
        {dragOver && (
          <div style={{
            border:`2px dashed ${col.color}60`,
            borderRadius:12, padding:'20px',
            textAlign:'center', fontSize:12,
            color:col.color,
            background:`${col.color}08`,
          }}>
            Drop here to move to {col.label}
          </div>
        )}
      </div>
    </div>
  )
})

export default KanbanColumn
