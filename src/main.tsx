// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer'
// import { applyStoredTheme } from './utils/theme'

if (!(globalThis as any).Buffer) {
    (globalThis as any).Buffer = Buffer
}

// Apply theme before initial render to avoid flash
// applyStoredTheme();
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(<App />)
