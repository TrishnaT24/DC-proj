import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import LoginInForm from './Login.jsx'
import SignUpForm from './Signup.jsx'
import './App.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginInForm />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
)
