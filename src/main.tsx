import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeDatabase } from './services/database'

// Initialize database before rendering app
initializeDatabase().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}).catch(error => {
  console.error('Failed to initialize database:', error)
})
