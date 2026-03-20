import { memo } from 'react'
import { useTracker } from '@/context/TrackerContext'
import { StatusBadge, PriorityBadge, TagChip, EmptyState, Btn } from '@/components/ui'
import { fmtDate, daysAgo } from '@/utils/helpers'

const ListView = memo(({ onJobClick, onAddClick }) => {
  const { filtered } = useTracker()

  if (filtered.length === 0) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <EmptyState icon="🔍" title="No applications found" subtitle="Try adjusting your search or filters"
        action={<Btn onClick={()=>onAddClick('applied')} variant="primary">+ Add Application</Btn>}/>
    </div>
  )

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ borderBottom:'1px solid var(--border)' }}>
            {['Company','Role','Status','Location','Salary','Applied','Priority','Tags',''].map(h => (
              <th key={h} style={{
                padding:'8px 12px', textAlign:'left', fontSize:10,
                fontWeight:700, color:'var(--text3)',
                textTransform:'uppercase', letterSpacing:'0.06em',
                whiteSpace:'nowrap', background:'var(--bg2)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((job, i) => (
            <tr key={job.id}
              onClick={() => onJobClick(job)}
              className="fade-up"
              style={{
                borderBottom:'1px solid var(--border)',
                cursor:'pointer', transition:'background 0.1s',
                animationDelay:`${i * 0.03}s`,
              }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >
              <td style={{ padding:'12px 12px' }}>
                <p style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>{job.company}</p>
              </td>
              <td style={{ padding:'12px 12px' }}>
                <p style={{ fontSize:12, color:'var(--text2)', whiteSpace:'nowrap', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis' }}>{job.role}</p>
              </td>
              <td style={{ padding:'12px 12px' }}>
                <StatusBadge status={job.status} />
              </td>
              <td style={{ padding:'12px 12px' }}>
                <p style={{ fontSize:12, color:'var(--text3)', whiteSpace:'nowrap' }}>{job.location || '—'}</p>
              </td>
              <td style={{ padding:'12px 12px' }}>
                <p style={{ fontSize:12, color:'var(--text2)', fontFamily:'var(--font-mono)', whiteSpace:'nowrap' }}>{job.salary || '—'}</p>
              </td>
              <td style={{ padding:'12px 12px' }}>
                <p style={{ fontSize:11, color:'var(--text3)', whiteSpace:'nowrap' }}>{daysAgo(job.appliedDate)}</p>
              </td>
              <td style={{ padding:'12px 12px' }}>
                <PriorityBadge priority={job.priority} />
              </td>
              <td style={{ padding:'12px 12px' }}>
                <div style={{ display:'flex', gap:4, flexWrap:'nowrap' }}>
                  {job.tags.slice(0,2).map(t=><TagChip key={t} tag={t}/>)}
                  {job.tags.length>2 && <span style={{fontSize:10,color:'var(--text4)',alignSelf:'center'}}>+{job.tags.length-2}</span>}
                </div>
              </td>
              <td style={{ padding:'12px 12px' }}>
                {job.url && (
                  <a href={job.url} target="_blank" rel="noopener noreferrer"
                    onClick={e=>e.stopPropagation()}
                    style={{ fontSize:12, color:'#6366F1' }}>↗</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default ListView
