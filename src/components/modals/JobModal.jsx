import { memo, useState, useCallback } from 'react'
import { useTracker, COLUMNS } from '@/context/TrackerContext'
import { StatusBadge, PriorityBadge, TagChip, Btn, Field, Select } from '@/components/ui'
import { fmtDate, PRIORITY } from '@/utils/helpers'
import { v4 as uuid } from '@/context/uuid.js'

const JobModal = memo(({ job, onClose }) => {
  const { updateJob, deleteJob, moveJob } = useTracker()
  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState(job)
  const [tagInput, setTagInput] = useState('')
  const [tab, setTab]         = useState('details')  // 'details' | 'timeline' | 'notes'

  const set = key => val => setForm(f => ({ ...f, [key]: val }))

  const handleSave = useCallback(() => {
    updateJob(form)
    setEditing(false)
  }, [form, updateJob])

  const handleDelete = useCallback(() => {
    if (confirm(`Delete "${job.company}" application?`)) {
      deleteJob(job.id)
      onClose()
    }
  }, [job, deleteJob, onClose])

  const addTag = useCallback(() => {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }))
    }
    setTagInput('')
  }, [tagInput, form.tags])

  const addTimelineEntry = useCallback(() => {
    const text = prompt('Add timeline entry:')
    if (!text) return
    const entry = { date: new Date().toISOString().slice(0,10), event: text }
    const updated = { ...form, timeline: [...form.timeline, entry] }
    setForm(updated)
    updateJob(updated)
  }, [form, updateJob])

  const col = COLUMNS.find(c => c.id === form.status)

  return (
    <div
      className="fade-in"
      style={{
        position:'fixed', inset:0, zIndex:1000,
        background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="pop-in" style={{
        width:'100%', maxWidth:680,
        background:'var(--bg2)', border:'1px solid var(--border2)',
        borderRadius:20, overflow:'hidden',
        boxShadow:'var(--shadow-lg)',
        display:'flex', flexDirection:'column',
        maxHeight:'90vh',
      }}>
        {/* Header */}
        <div style={{
          padding:'20px 24px 16px',
          borderBottom:'1px solid var(--border)',
          display:'flex', alignItems:'flex-start', justifyContent:'space-between',
          flexShrink:0,
          background:`linear-gradient(135deg, ${col?.color}12, transparent)`,
        }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:6 }}>
              <StatusBadge status={form.status} size="md" />
              <PriorityBadge priority={form.priority} />
            </div>
            {editing ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:8 }}>
                <input value={form.company} onChange={e=>set('company')(e.target.value)}
                  placeholder="Company name"
                  style={{ fontSize:20, fontWeight:700, padding:'6px 10px', borderRadius:8, width:'100%' }}/>
                <input value={form.role} onChange={e=>set('role')(e.target.value)}
                  placeholder="Job role"
                  style={{ fontSize:15, padding:'6px 10px', borderRadius:8, width:'100%' }}/>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize:22, fontWeight:800, color:'var(--text)', letterSpacing:'-0.02em', fontFamily:'var(--font-head)' }}>
                  {form.company}
                </h2>
                <p style={{ fontSize:15, color:'var(--text2)', marginTop:2 }}>{form.role}</p>
              </>
            )}
          </div>
          <div style={{ display:'flex', gap:6, marginLeft:12 }}>
            {editing ? (
              <>
                <Btn onClick={handleSave}   variant="primary" size="sm">💾 Save</Btn>
                <Btn onClick={()=>setEditing(false)} variant="ghost" size="sm">Cancel</Btn>
              </>
            ) : (
              <>
                <Btn onClick={()=>setEditing(true)} variant="ghost" size="sm">✏️ Edit</Btn>
                <Btn onClick={handleDelete}  variant="danger" size="sm">🗑</Btn>
              </>
            )}
            <Btn onClick={onClose} variant="ghost" size="sm" style={{ padding:'5px 8px' }}>✕</Btn>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          {['details','timeline','notes'].map(t => (
            <button key={t} onClick={()=>setTab(t)}
              style={{
                padding:'10px 20px', fontSize:13, fontWeight:600,
                color: tab===t ? col?.color : 'var(--text3)',
                borderBottom: tab===t ? `2px solid ${col?.color}` : '2px solid transparent',
                transition:'all 0.12s', background:'none',
                textTransform:'capitalize',
              }}
            >{t}</button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>

          {/* ── Details tab ── */}
          {tab === 'details' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

              {/* Move to status */}
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Move to</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {COLUMNS.map(c => (
                    <button key={c.id}
                      onClick={() => { moveJob(job.id, c.id); setForm(f=>({...f, status:c.id})); onClose() }}
                      style={{
                        padding:'5px 12px', borderRadius:20, fontSize:12, fontWeight:600,
                        background: form.status===c.id ? `${c.color}30` : 'var(--bg4)',
                        color: form.status===c.id ? c.color : 'var(--text3)',
                        border:`1px solid ${form.status===c.id ? c.color+'50' : 'var(--border)'}`,
                        transition:'all 0.1s',
                      }}
                    >{c.emoji} {c.label}</button>
                  ))}
                </div>
              </div>

              {/* Info grid */}
              {editing ? (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <Field label="Location" value={form.location} onChange={set('location')} placeholder="City, Country / Remote"/>
                  <Field label="Salary"   value={form.salary}   onChange={set('salary')}   placeholder="₹ or $ range"/>
                  <Field label="Applied Date" value={form.appliedDate} onChange={set('appliedDate')} type="date"/>
                  <Field label="Interview Date" value={form.interviewDate} onChange={set('interviewDate')} type="date"/>
                  <Field label="Contact Person" value={form.contact} onChange={set('contact')} placeholder="HR name"/>
                  <Field label="Contact Email" value={form.contactEmail} onChange={set('contactEmail')} placeholder="hr@company.com"/>
                  <Field label="Job URL" value={form.url} onChange={set('url')} placeholder="https://..." />
                  <Select label="Job Type" value={form.type} onChange={set('type')}
                    options={['Full-time','Part-time','Internship','Contract','Freelance']}/>
                  <Select label="Priority" value={form.priority} onChange={set('priority')}
                    options={Object.entries(PRIORITY).map(([k,v])=>({value:k,label:v.label}))}/>
                </div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {[
                    ['📍 Location',       form.location],
                    ['💰 Salary',         form.salary],
                    ['📅 Applied',        fmtDate(form.appliedDate)],
                    ['🎯 Interview',      fmtDate(form.interviewDate)],
                    ['👤 Contact',        form.contact],
                    ['📧 Email',          form.contactEmail],
                    ['💼 Type',           form.type],
                  ].filter(([,v])=>v).map(([label,value])=>(
                    <div key={label} style={{ background:'var(--bg3)', borderRadius:8, padding:'10px 12px', border:'1px solid var(--border)' }}>
                      <p style={{ fontSize:10, color:'var(--text3)', marginBottom:3 }}>{label}</p>
                      <p style={{ fontSize:13, fontWeight:500, color:'var(--text)' }}>{value}</p>
                    </div>
                  ))}
                  {form.url && (
                    <a href={form.url} target="_blank" rel="noopener noreferrer"
                      style={{ display:'block', background:'var(--bg3)', borderRadius:8, padding:'10px 12px', border:'1px solid var(--border)', textDecoration:'none' }}>
                      <p style={{ fontSize:10, color:'var(--text3)', marginBottom:3 }}>🔗 Job URL</p>
                      <p style={{ fontSize:12, color:'#6366F1', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Open listing →</p>
                    </a>
                  )}
                </div>
              )}

              {/* Tags */}
              <div>
                <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Skills / Tags</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:8 }}>
                  {form.tags.map(t => (
                    <TagChip key={t} tag={t} onRemove={editing ? t => setForm(f=>({...f, tags:f.tags.filter(x=>x!==t)})) : null}/>
                  ))}
                  {form.tags.length === 0 && <span style={{ fontSize:12, color:'var(--text4)' }}>No tags yet</span>}
                </div>
                {editing && (
                  <div style={{ display:'flex', gap:6 }}>
                    <input value={tagInput} onChange={e=>setTagInput(e.target.value)}
                      onKeyDown={e=>{ if(e.key==='Enter'||e.key===','){e.preventDefault();addTag()} }}
                      placeholder="Add tag + Enter" style={{ flex:1, padding:'6px 10px' }}/>
                    <Btn onClick={addTag} variant="ghost" size="sm">Add</Btn>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Timeline tab ── */}
          {tab === 'timeline' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <p style={{ fontSize:13, color:'var(--text2)', fontWeight:500 }}>{form.timeline.length} events</p>
                <Btn onClick={addTimelineEntry} variant="ghost" size="sm">+ Add Event</Btn>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {[...form.timeline].reverse().map((t, i) => (
                  <div key={i} className="fade-up" style={{ display:'flex', gap:12, paddingBottom:16 }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                      <div style={{
                        width:10, height:10, borderRadius:'50%', flexShrink:0,
                        background: i===0 ? col?.color : 'var(--border2)',
                        border:`2px solid ${i===0 ? col?.color : 'var(--border)'}`,
                        boxShadow: i===0 ? `0 0 8px ${col?.color}60` : 'none',
                      }}/>
                      {i < form.timeline.length-1 && (
                        <div style={{ width:1, flex:1, background:'var(--border)', marginTop:4 }}/>
                      )}
                    </div>
                    <div style={{ flex:1, paddingTop:0 }}>
                      <p style={{ fontSize:13, color:'var(--text)', fontWeight:500, lineHeight:1.4 }}>{t.event}</p>
                      <p style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{fmtDate(t.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Notes tab ── */}
          {tab === 'notes' && (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <textarea
                value={form.notes}
                onChange={e=>set('notes')(e.target.value)}
                placeholder="Add notes, interview questions, salary negotiation details…"
                rows={12}
                style={{ width:'100%', padding:'12px', resize:'vertical', lineHeight:1.6, borderRadius:10, fontSize:13 }}
              />
              <Btn onClick={()=>updateJob({...job, notes:form.notes})} variant="primary" size="sm" style={{ alignSelf:'flex-start' }}>
                💾 Save Notes
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default JobModal
