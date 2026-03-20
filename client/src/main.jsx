import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { ToastProvider } from './context/ToastContext'
import { ModalProvider } from './context/ModalContext'
import ToastContainer from './components/ui/Toast/ToastContainer'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      <ToastProvider>
        <ModalProvider>
          <AuthProvider>
            <BrowserRouter>
              <ToastContainer />
              <App />
            </BrowserRouter>
          </AuthProvider>
        </ModalProvider>
      </ToastProvider>
    </DataProvider>
  </StrictMode>,
)
