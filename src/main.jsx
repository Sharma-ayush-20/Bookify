import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FirebaseContextProvider } from './context/firebase.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FirebaseContextProvider>
        <App />
      </FirebaseContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
