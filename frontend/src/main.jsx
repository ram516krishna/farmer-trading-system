import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { AdminProvider } from './context/AdminContext'

createRoot(document.getElementById('root')).render(
  <AdminProvider>
    <App />
    <Toaster />
  </AdminProvider>,
)
