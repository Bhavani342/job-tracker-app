import React from 'react'
import ReactDOM from 'react-dom/client'
import { TrackerProvider } from '@/context/TrackerContext'
import App from '@/pages/App'
import '@/styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TrackerProvider>
      <App />
    </TrackerProvider>
  </React.StrictMode>
)
