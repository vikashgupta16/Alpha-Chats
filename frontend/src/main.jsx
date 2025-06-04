import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux'
import { store } from './redux/store.js'
import { ThemeProvider } from './components/ThemeContext';

export const serverUrl = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? window.location.origin : "http://localhost:4000")

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>
)
