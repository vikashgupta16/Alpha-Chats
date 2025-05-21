import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {Provider, provider} from 'react-redux'
export const serverUrl= "http://localhost:4000"
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={provider}>
    <App />
  </Provider>
  </BrowserRouter>
    
)
