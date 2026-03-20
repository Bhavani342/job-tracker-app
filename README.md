# 🎯 JobTracker — Your Job Hunt HQ

A Kanban-style job application tracker built with React. No backend, no login — everything saves to your browser's localStorage.

---

## 🚀 Run in 2 commands

```bash
npm install
npm run dev
```

Open → **http://localhost:5173**

---

## ✨ Features

| Feature | Details |
|---|---|
| 🗂 Kanban Board | 6 columns: Applied → Screening → Interview → Offer → Rejected → Withdrawn |
| 🖱 Drag & Drop | Drag cards between columns to update status |
| 📋 List View | Sortable table view with all applications |
| 📊 Stats Dashboard | Total, in progress, offers, response rate, charts |
| ➕ Add Jobs | Full form with company, role, salary, tags, priority |
| ✏️ Edit Jobs | Inline editing with all fields |
| 🕐 Timeline | Per-job activity timeline with event log |
| 📝 Notes | Per-job notes for interview prep, salary negotiation |
| 🔍 Search | Real-time search across company, role, location, tags |
| 🏷 Tags | Skill tags with auto-color coding |
| 🔥 Priority | High / Medium / Low priority with visual indicators |
| 📅 Interview Countdown | "Tomorrow!" / "In 3 days" / "2d overdue" warnings |
| 📊 Export CSV | Download all applications as spreadsheet |
| 💾 Auto-save | All data saved to localStorage instantly |
| 🌑 Dark theme | Sleek dark UI — easy on the eyes |

---

## 🗂 Structure

```
jobtracker/
├── src/
│   ├── main.jsx
│   ├── context/
│   │   ├── TrackerContext.jsx   ← All state, localStorage, reducer
│   │   └── uuid.js             ← UUID generator (no package needed)
│   ├── utils/helpers.js        ← Date format, CSV export, colors
│   ├── styles/index.css        ← Dark theme CSS variables
│   ├── components/
│   │   ├── ui/index.jsx        ← Badge, Button, Field, Select, EmptyState
│   │   ├── kanban/
│   │   │   ├── JobCard.jsx     ← Draggable job card
│   │   │   └── KanbanBoard.jsx ← Drop-target column
│   │   ├── charts/StatsBar.jsx ← Stats cards + mini bar charts
│   │   ├── modals/
│   │   │   ├── JobModal.jsx    ← Full job detail / edit / timeline
│   │   │   └── AddJobModal.jsx ← New application form
│   │   └── layout/
│   │       ├── TopBar.jsx      ← Search + filters + view toggle
│   │       └── ListView.jsx    ← Table view
│   └── pages/App.jsx           ← Root layout
├── index.html
├── vite.config.js
└── package.json
```

---

## 🛠 Scripts

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Production build → /dist
npm run preview  # Preview production build
```

## 🚀 Deploy (Free)

```bash
npm run build
# Upload /dist folder to Netlify Drop: netlify.com/drop
# Or deploy to Vercel: vercel --prod
```

---

## 💡 Interview Talking Points

- **"I'm using this to track my own job applications right now"**
- Built with React useReducer for state management (not Redux)
- HTML5 Drag & Drop API — no external library
- localStorage persistence — offline-first
- CSV export with Blob API
- Zero external dependencies beyond React + Vite
