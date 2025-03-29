import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
console.log("VITE API BASE URL:", import.meta.env.VITE_API_BASE_URL);
console.log("REACT  API BASE URL:",import.meta.env.REACT_APP_API_BASE_URL);



createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <App />
  </StrictMode>,
)
