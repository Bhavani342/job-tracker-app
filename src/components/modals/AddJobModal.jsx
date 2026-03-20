import { memo, useState, useCallback } from 'react'
import { useTracker, COLUMNS } from '@/context/TrackerContext'
import { Btn, Field, Select } from '@/components/ui'
import { PRIORITY } from '@/utils/helpers'
import { TagChip } from '@/components/ui'

const AddJobModal = memo(({ defaultStatus = 'applied', onClose }) => {
  const { addJob } = useTracker()
  const [form, setForm] = useState({
    company:'', role:'', location:'', salary:'',
    type:'Full-time', status: defaultStatus,
    appliedDate: new Date().toISOString().slice(0,10),
    interviewDate:'', url:'', priority:'medium',
    notes:'', tags:[], contact:'', contactEmail:'',
  })
  const [tagInput, setTagInput] = useState('')
  const [error, setError]       = useState('')

  const set = key => val => setForm(f => ({ ...f, [key]: val }))

  const addTag = useCallback(() => {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) setForm(f=>({...f, tags:[...f.tags,t]}))
    setTagInput('')
  }, [tagInput, form.tags])

  const handleSubmit = useCallback(() => {
    if (!form.company.trim()) { setError('Company name is required'); return }
    if (!form.role.trim())    { setError('Job role is required'); return }
    addJob(form)
    onClose()
  }, [form, addJob, onClose])

  return (
    <div className="fade-in"
      style={{
        position:'fixed', inset:0, zIndex:1000,
        background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:20,
      }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose() }}
    >
      <div className="pop-in" style={{
        width:'100%', maxWidth:560,
        background:'var(--bg2)', border:'1px solid var(--border2)',
        borderRadius:20, overflow:'hidden',
        boxShadow:'var(--shadow-lg)',
        maxHeight:'90vh', display:'flex', flexDirection:'column',
      }}>
        {/* Header */}
        <div style={{
          padding:'18px 24px', borderBottom:'1px solid var(--border)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          flexShrink:0,
        }}>
          <h2 style={{ fontSize:18, fontWeight:800, color:'var(--text)', fontFamily:'var(--font-head)' }}>
            🎯 Add New Application
          </h2>
          <Btn onClick={onClose} variant="ghost" size="sm">✕</Btn>
        </div>

        {/* Form */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {error && (
              <div style={{ background:'#EF444420', border:'1px solid #EF444440', borderRadius:8, padding:'8px 12px', fontSize:13, color:'#EF4444' }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Field label="Company *"  value={form.company}  onChange={v=>{set('company')(v);setError('')}} placeholder="e.g. Google" required />
              <Field label="Job Role *" value={form.role}     onChange={v=>{set('role')(v);setError('')}}    placeholder="e.g. Frontend Developer" required />
              <Field label="Location"   value={form.location} onChange={set('location')} placeholder="City / Remote" />
              <Field label="Salary"     value={form.salary}   onChange={set('salary')}   placeholder="₹6-10 LPA" />
              <Field label="Applied Date" value={form.appliedDate} onChange={set('appliedDate')} type="date" />
              <Field label="Interview Date" value={form.interviewDate} onChange={set('interviewDate')} type="date" />
              <Select label="Status" value={form.status} onChange={set('status')}
                options={COLUMNS.map(c=>({value:c.id,label:`${c.emoji} ${c.label}`}))}/>
              <Select label="Priority" value={form.priority} onChange={set('priority')}
                options={Object.entries(PRIORITY).map(([k,v])=>({value:k,label:v.label}))}/>
              <Select label="Job Type" value={form.type} onChange={set('type')}
                options={['Full-time','Part-time','Internship','Contract','Freelance']}/>
              <Field label="Job URL" value={form.url} onChange={set('url')} placeholder="https://..." />
            </div>

            {/* Tags */}
            <div>
              <p style={{ fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Skills / Tags</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:8 }}>
                {form.tags.map(t=>(
                  <TagChip key={t} tag={t} onRemove={t=>setForm(f=>({...f, tags:f.tags.filter(x=>x!==t)}))}/>
                ))}
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <input value={tagInput} onChange={e=>setTagInput(e.target.value)}
                  onKeyDown={e=>{if(e.key==='Enter'||e.key===','){e.preventDefault();addTag()}}}
                  placeholder="React, Node.js, TypeScript… + Enter"
                  style={{ flex:1, padding:'8px 12px', borderRadius:8 }}/>
                <Btn onClick={addTag} variant="ghost" size="sm">Add</Btn>
              </div>
            </div>

            <Field label="Notes" value={form.notes} onChange={set('notes')}
              placeholder="Any details, referrals, interview prep notes…"
              multiline rows={3}/>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding:'14px 24px', borderTop:'1px solid var(--border)',
          display:'flex', gap:8, justifyContent:'flex-end',
          flexShrink:0, background:'var(--bg3)',
        }}>
          <Btn onClick={onClose}    variant="ghost"   size="md">Cancel</Btn>
          <Btn onClick={handleSubmit} variant="primary" size="md">🎯 Add Application</Btn>
        </div>
      </div>
    </div>
  )
})

export default AddJobModal
