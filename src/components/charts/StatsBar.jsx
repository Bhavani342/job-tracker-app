import { memo } from 'react'
import { useTracker } from '@/context/TrackerContext'
import { buildStatusChart, buildTimelineChart } from '@/utils/helpers'
import { COLUMNS } from '@/context/TrackerContext'

const StatCard = memo(({ label, value, sub, color, icon }) => (
  <div style={{
    background:'var(--bg2)', border:'1px solid var(--border)',
    borderRadius:14, padding:'16px 18px',
    display:'flex', flexDirection:'column', gap:4,
    flex:1, minWidth:0,
  }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <span style={{ fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</span>
      <span style={{ fontSize:18 }}>{icon}</span>
    </div>
    <p className="stat-num" style={{ fontSize:28, fontWeight:800, color: color || 'var(--text)', letterSpacing:'-0.03em', fontFamily:'var(--font-head)' }}>
      {value}
    </p>
    {sub && <p style={{ fontSize:11, color:'var(--text3)' }}>{sub}</p>}
  </div>
))

// Mini bar chart
const MiniBar = memo(({ jobs }) => {
  const data = buildStatusChart(jobs, COLUMNS)
  const max  = Math.max(...data.map(d => d.count), 1)
  return (
    <div style={{
      background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:14, padding:'16px 18px', flex:2, minWidth:200,
    }}>
      <p style={{ fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>
        By Status
      </p>
      <div style={{ display:'flex', gap:6, alignItems:'flex-end', height:48 }}>
        {data.map(d => (
          <div key={d.label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
            <span style={{ fontSize:10, color:'var(--text3)', fontWeight:600 }}>{d.count||''}</span>
            <div style={{
              width:'100%', borderRadius:4,
              height: d.count ? Math.max(4, (d.count/max)*40) : 4,
              background: d.count ? d.color : 'var(--bg4)',
              transition:'height 0.4s ease',
            }}/>
            <span style={{ fontSize:9, color:'var(--text4)', textAlign:'center' }}>{d.label.slice(0,4)}</span>
          </div>
        ))}
      </div>
    </div>
  )
})

// Applications over time
const TimelineBar = memo(({ jobs }) => {
  const data = buildTimelineChart(jobs)
  const max  = Math.max(...data.map(d => d.count), 1)
  return (
    <div style={{
      background:'var(--bg2)', border:'1px solid var(--border)',
      borderRadius:14, padding:'16px 18px', flex:2, minWidth:200,
    }}>
      <p style={{ fontSize:11, fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>
        Applications / Month
      </p>
      <div style={{ display:'flex', gap:8, alignItems:'flex-end', height:48 }}>
        {data.length === 0 ? (
          <p style={{ fontSize:12, color:'var(--text4)' }}>No data yet</p>
        ) : data.map(d => (
          <div key={d.label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
            <span style={{ fontSize:10, color:'var(--text3)', fontWeight:600 }}>{d.count}</span>
            <div style={{
              width:'100%', borderRadius:4,
              height:Math.max(4, (d.count/max)*40),
              background:'#6366F1',
              transition:'height 0.4s ease',
            }}/>
            <span style={{ fontSize:9, color:'var(--text4)' }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
})

const StatsBar = memo(() => {
  const { stats, jobs } = useTracker()
  return (
    <div style={{
      display:'flex', gap:10, padding:'14px 20px',
      borderBottom:'1px solid var(--border)',
      flexShrink:0, overflowX:'auto',
    }}>
      <StatCard label="Total"        value={stats.total}        icon="📋" sub="applications" />
      <StatCard label="In Progress"  value={stats.inProgress}   icon="🔄" color="#8B5CF6" sub="active" />
      <StatCard label="Offers"       value={stats.offers}       icon="🎉" color="#10B981" sub="received" />
      <StatCard label="Response Rate" value={`${stats.responseRate}%`} icon="📈" color="#F59E0B" sub="replied" />
      <MiniBar jobs={jobs} />
      <TimelineBar jobs={jobs} />
    </div>
  )
})

export default StatsBar
