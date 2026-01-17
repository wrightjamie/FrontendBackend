import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/Toast/ToastContainer'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <ToastContainer />
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </DataProvider>
  </StrictMode>,
)
