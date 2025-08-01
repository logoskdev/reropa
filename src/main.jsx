import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'  // <-- Importa el CSS global aquí
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
