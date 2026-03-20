import { useState, useCallback } from 'react'
import { useTracker, COLUMNS } from '@/context/TrackerContext'
import TopBar       from '@/components/layout/TopBar'
import StatsBar     from '@/components/charts/StatsBar'
import KanbanColumn from '@/components/kanban/KanbanBoard'
import ListView     from '@/components/layout/ListView'
import JobModal     from '@/components/modals/JobModal'
import AddJobModal  from '@/components/modals/AddJobModal'
import { EmptyState, Btn } from '@/components/ui'

export default function App() {
  const { view, filtered } = useTracker()
  const [selectedJob, setSelectedJob]   = useState(null)
  const [addStatus, setAddStatus]       = useState(null)   // null = closed, string = default status

  const openAdd  = useCallback(status => setAddStatus(status || 'applied'), [])
  const closeAdd = useCallback(() => setAddStatus(null), [])
  const openJob  = useCallback(job   => setSelectedJob(job), [])
  const closeJob = useCallback(() => setSelectedJob(null), [])

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden' }}>

      <TopBar onAdd={() => openAdd('applied')} />
      <StatsBar />

      {/* Main content */}
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {view === 'kanban' ? (
          <div style={{
            flex:1, display:'flex', gap:12,
            padding:'16px 20px', overflowX:'auto', overflowY:'hidden',
            alignItems:'stretch',
          }}>
            {COLUMNS.map(col => {
              const colJobs = filtered.filter(j => j.status === col.id)
              return (
                <KanbanColumn
                  key={col.id}
                  col={col}
                  jobs={colJobs}
                  onCardClick={openJob}
                  onAddClick={openAdd}
                />
              )
            })}
          </div>
        ) : (
          <ListView onJobClick={openJob} onAddClick={openAdd} />
        )}
      </div>

      {/* Modals */}
      {selectedJob && (
        <JobModal job={selectedJob} onClose={closeJob} />
      )}
      {addStatus !== null && (
        <AddJobModal defaultStatus={addStatus} onClose={closeAdd} />
      )}
    </div>
  )
}
