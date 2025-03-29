import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL||import.meta.env.REACT_APP_API_BASE_URL);
console.log(import.meta.env);

createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <App />
  </StrictMode>,
)
