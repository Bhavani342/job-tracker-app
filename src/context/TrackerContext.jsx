import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { v4 as uuid } from './uuid.js'

// ── Column definitions ─────────────────────────────────────────────────────
export const COLUMNS = [
  { id: 'applied',    label: 'Applied',     color: '#6366F1', emoji: '📤' },
  { id: 'screening',  label: 'Screening',   color: '#F59E0B', emoji: '📞' },
  { id: 'interview',  label: 'Interview',   color: '#8B5CF6', emoji: '🎯' },
  { id: 'offer',      label: 'Offer',       color: '#10B981', emoji: '🎉' },
  { id: 'rejected',   label: 'Rejected',    color: '#EF4444', emoji: '❌' },
  { id: 'withdrawn',  label: 'Withdrawn',   color: '#6B7280', emoji: '🚫' },
]

// ── Seed data ──────────────────────────────────────────────────────────────
const SEED = [
  {
    id: uuid(), status: 'interview', company: 'Razorpay', role: 'Frontend Developer',
    location: 'Bangalore, India', salary: '₹8-12 LPA', type: 'Full-time',
    appliedDate: '2024-12-10', interviewDate: '2024-12-20',
    url: 'https://razorpay.com/careers', priority: 'high',
    notes: 'HR screening done. Technical round scheduled.',
    tags: ['React', 'TypeScript'], contact: 'Priya HR', contactEmail: 'hr@razorpay.com',
    timeline: [
      { date: '2024-12-10', event: 'Applied via LinkedIn' },
      { date: '2024-12-12', event: 'HR reached out' },
      { date: '2024-12-15', event: 'Phone screening done' },
    ]
  },
  {
    id: uuid(), status: 'applied', company: 'Swiggy', role: 'React Developer',
    location: 'Remote', salary: '₹6-9 LPA', type: 'Full-time',
    appliedDate: '2024-12-14', interviewDate: '',
    url: 'https://swiggy.com/careers', priority: 'medium',
    notes: 'Applied through company website. Waiting for response.',
    tags: ['React', 'Node.js'], contact: '', contactEmail: '',
    timeline: [{ date: '2024-12-14', event: 'Applied via company website' }]
  },
  {
    id: uuid(), status: 'screening', company: 'CRED', role: 'UI Developer',
    location: 'Bangalore, India', salary: '₹7-10 LPA', type: 'Full-time',
    appliedDate: '2024-12-08', interviewDate: '',
    url: 'https://cred.club/careers', priority: 'high',
    notes: 'Got referral from college senior. HR call scheduled.',
    tags: ['React', 'CSS', 'Figma'], contact: 'Arjun (Referral)', contactEmail: '',
    timeline: [
      { date: '2024-12-08', event: 'Applied via referral' },
      { date: '2024-12-11', event: 'HR scheduled screening call' },
    ]
  },
  {
    id: uuid(), status: 'offer', company: 'Zepto', role: 'Junior Frontend Engineer',
    location: 'Mumbai, India', salary: '₹6 LPA', type: 'Full-time',
    appliedDate: '2024-11-28', interviewDate: '2024-12-05',
    url: 'https://zepto.com/careers', priority: 'medium',
    notes: 'Offer received! Negotiating salary. Deadline: Dec 25.',
    tags: ['React', 'Redux'], contact: 'Sneha Talent', contactEmail: 'talent@zepto.com',
    timeline: [
      { date: '2024-11-28', event: 'Applied via LinkedIn' },
      { date: '2024-12-01', event: 'Technical round 1' },
      { date: '2024-12-05', event: 'Final round - HR' },
      { date: '2024-12-10', event: '🎉 Offer received!' },
    ]
  },
  {
    id: uuid(), status: 'rejected', company: 'Meesho', role: 'Frontend Engineer',
    location: 'Bangalore, India', salary: '₹5-8 LPA', type: 'Full-time',
    appliedDate: '2024-11-20', interviewDate: '2024-11-28',
    url: '', priority: 'low',
    notes: 'Rejected after technical round. Need to improve DSA.',
    tags: ['React', 'JavaScript'], contact: '', contactEmail: '',
    timeline: [
      { date: '2024-11-20', event: 'Applied via company website' },
      { date: '2024-11-28', event: 'Technical interview' },
      { date: '2024-12-02', event: '❌ Rejection email received' },
    ]
  },
  {
    id: uuid(), status: 'applied', company: 'PhonePe', role: 'React Developer',
    location: 'Pune, India', salary: '₹7-11 LPA', type: 'Full-time',
    appliedDate: '2024-12-15', interviewDate: '',
    url: 'https://phonepe.com/en-in/careers', priority: 'high',
    notes: 'Dream company. Applied through LinkedIn Easy Apply.',
    tags: ['React', 'Redux', 'TypeScript'], contact: '', contactEmail: '',
    timeline: [{ date: '2024-12-15', event: 'Applied via LinkedIn Easy Apply' }]
  },
]

// ── Reducer ────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_JOB':
      return { ...state, jobs: [action.job, ...state.jobs] }

    case 'UPDATE_JOB':
      return { ...state, jobs: state.jobs.map(j => j.id === action.job.id ? action.job : j) }

    case 'DELETE_JOB':
      return { ...state, jobs: state.jobs.filter(j => j.id !== action.id) }

    case 'MOVE_JOB': {
      const job = state.jobs.find(j => j.id === action.id)
      if (!job) return state
      const updated = {
        ...job, status: action.status,
        timeline: [...job.timeline, { date: new Date().toISOString().slice(0,10), event: `Moved to ${action.status}` }]
      }
      return { ...state, jobs: state.jobs.map(j => j.id === action.id ? updated : j) }
    }

    case 'SET_FILTER':
      return { ...state, filter: { ...state.filter, ...action.filter } }

    case 'SET_VIEW':
      return { ...state, view: action.view }

    case 'SET_SEARCH':
      return { ...state, search: action.search }

    default:
      return state
  }
}

// ── Context ────────────────────────────────────────────────────────────────
const Ctx = createContext()
export const useTracker = () => useContext(Ctx)

const STORAGE_KEY = 'jobtracker_v1'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function save(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

const initState = {
  jobs: load()?.jobs || SEED,
  view: 'kanban',   // 'kanban' | 'list'
  search: '',
  filter: { priority: 'all', type: 'all', tag: 'all' },
}

export function TrackerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState)

  // Persist to localStorage
  useEffect(() => { save({ jobs: state.jobs }) }, [state.jobs])

  const addJob = useCallback(data => {
    const job = {
      id: uuid(), status: 'applied',
      company: '', role: '', location: '', salary: '',
      type: 'Full-time', appliedDate: new Date().toISOString().slice(0,10),
      interviewDate: '', url: '', priority: 'medium',
      notes: '', tags: [], contact: '', contactEmail: '',
      timeline: [{ date: new Date().toISOString().slice(0,10), event: 'Application submitted' }],
      ...data,
    }
    dispatch({ type: 'ADD_JOB', job })
    return job
  }, [])

  const updateJob  = useCallback(job  => dispatch({ type: 'UPDATE_JOB', job }), [])
  const deleteJob  = useCallback(id   => dispatch({ type: 'DELETE_JOB', id }), [])
  const moveJob    = useCallback((id, status) => dispatch({ type: 'MOVE_JOB', id, status }), [])
  const setFilter  = useCallback(f    => dispatch({ type: 'SET_FILTER', filter: f }), [])
  const setView    = useCallback(v    => dispatch({ type: 'SET_VIEW', view: v }), [])
  const setSearch  = useCallback(s    => dispatch({ type: 'SET_SEARCH', search: s }), [])

  // Derived stats
  const stats = {
    total:       state.jobs.length,
    applied:     state.jobs.filter(j => j.status === 'applied').length,
    inProgress:  state.jobs.filter(j => ['screening','interview'].includes(j.status)).length,
    offers:      state.jobs.filter(j => j.status === 'offer').length,
    rejected:    state.jobs.filter(j => j.status === 'rejected').length,
    responseRate: state.jobs.length
      ? Math.round((state.jobs.filter(j => j.status !== 'applied').length / state.jobs.length) * 100)
      : 0,
  }

  // Filtered jobs
  const filtered = state.jobs.filter(j => {
    const q = state.search.toLowerCase()
    if (q && !`${j.company} ${j.role} ${j.location} ${j.tags.join(' ')}`.toLowerCase().includes(q)) return false
    if (state.filter.priority !== 'all' && j.priority !== state.filter.priority) return false
    if (state.filter.type     !== 'all' && j.type     !== state.filter.type)     return false
    if (state.filter.tag      !== 'all' && !j.tags.includes(state.filter.tag))   return false
    return true
  })

  // All unique tags
  const allTags = [...new Set(state.jobs.flatMap(j => j.tags))].sort()

  return (
    <Ctx.Provider value={{
      ...state, stats, filtered, allTags,
      addJob, updateJob, deleteJob, moveJob,
      setFilter, setView, setSearch,
    }}>
      {children}
    </Ctx.Provider>
  )
}
