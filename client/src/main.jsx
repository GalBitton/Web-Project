import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/protectedroute';
import { IndexPage, Dashboard, Login, Register, NotFound, Maintenance, UnderConstruction, PrivacyPolicy, TermsOfService } from './app/views-components/index.jsx';
import App from './app/App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Router>
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<IndexPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<Dashboard />} />
                </Route>
                <Route path="about-us" element={<UnderConstruction />} />
                <Route path="contact-us" element={<UnderConstruction />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<UnderConstruction />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="terms-of-service" element={<TermsOfService />} />
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
      </Router>
  </React.StrictMode>,
)
