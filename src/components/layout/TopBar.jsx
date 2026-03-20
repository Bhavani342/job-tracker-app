import { memo } from 'react'
import { useTracker } from '@/context/TrackerContext'
import { Btn } from '@/components/ui'
import { exportCSV } from '@/utils/helpers'

const TopBar = memo(({ onAdd }) => {
  const { view, setView, search, setSearch, filter, setFilter, jobs, allTags } = useTracker()

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10,
      padding:'12px 20px', borderBottom:'1px solid var(--border)',
      flexShrink:0, flexWrap:'wrap',
      background:'var(--bg2)',
    }}>
      {/* Brand */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginRight:8 }}>
        <div style={{
          width:34, height:34, borderRadius:10,
          background:'linear-gradient(135deg, #6366F1, #8B5CF6)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:18, flexShrink:0,
          boxShadow:'0 4px 16px #6366F140',
        }}>🎯</div>
        <div>
          <h1 style={{ fontSize:16, fontWeight:800, color:'var(--text)', fontFamily:'var(--font-head)', letterSpacing:'-0.02em', lineHeight:1 }}>
            JobTracker
          </h1>
          <p style={{ fontSize:10, color:'var(--text3)', marginTop:1 }}>Your job hunt HQ</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position:'relative', flex:1, minWidth:180, maxWidth:320 }}>
        <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:14, color:'var(--text4)' }}>🔍</span>
        <input
          value={search}
          onChange={e=>setSearch(e.target.value)}
          placeholder="Search company, role, tag…"
          style={{ width:'100%', padding:'8px 10px 8px 32px', borderRadius:10, fontSize:13 }}
        />
        {search && (
          <button onClick={()=>setSearch('')}
            style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', fontSize:16, color:'var(--text3)' }}
          >×</button>
        )}
      </div>

      {/* Filters */}
      <select value={filter.priority} onChange={e=>setFilter({priority:e.target.value})}
        style={{ padding:'8px 10px', borderRadius:10, fontSize:12, cursor:'pointer', minWidth:110 }}>
        <option value="all">All Priority</option>
        <option value="high">🔥 High</option>
        <option value="medium">⚡ Medium</option>
        <option value="low">💤 Low</option>
      </select>

      <select value={filter.type} onChange={e=>setFilter({type:e.target.value})}
        style={{ padding:'8px 10px', borderRadius:10, fontSize:12, cursor:'pointer', minWidth:110 }}>
        <option value="all">All Types</option>
        {['Full-time','Part-time','Internship','Contract','Freelance'].map(t=>(
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {allTags.length > 0 && (
        <select value={filter.tag} onChange={e=>setFilter({tag:e.target.value})}
          style={{ padding:'8px 10px', borderRadius:10, fontSize:12, cursor:'pointer', minWidth:110 }}>
          <option value="all">All Tags</option>
          {allTags.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
      )}

      <div style={{ flex:1 }}/>

      {/* View toggle */}
      <div style={{
        display:'flex', background:'var(--bg3)',
        border:'1px solid var(--border)', borderRadius:10,
        padding:2, gap:2,
      }}>
        {[['kanban','⊞'],['list','☰']].map(([v,icon])=>(
          <button key={v} onClick={()=>setView(v)}
            style={{
              padding:'5px 10px', borderRadius:8, fontSize:16,
              background: view===v ? 'var(--bg4)' : 'transparent',
              color: view===v ? 'var(--text)' : 'var(--text3)',
              border: view===v ? '1px solid var(--border2)' : '1px solid transparent',
              transition:'all 0.12s',
            }}
            title={v==='kanban' ? 'Kanban view' : 'List view'}
          >{icon}</button>
        ))}
      </div>

      {/* Export */}
      <Btn onClick={()=>exportCSV(jobs)} variant="ghost" size="sm" title="Export to CSV">
        📊 Export
      </Btn>

      {/* Add */}
      <Btn onClick={onAdd} variant="primary" size="md">
        + Add Job
      </Btn>
    </div>
  )
})

export default TopBar
