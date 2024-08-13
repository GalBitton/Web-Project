/**
 * Main entry point for the React application.
 * 
 * This file sets up the React application with routing using React Router.
 * It renders the main application component and defines the application's routes.
 * 
 * @module
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/components/routes/protectedroute';
import PublicRoute from "@/components/routes/publicroute";
import { IndexPage, Dashboard, Login, Register, NotFound, Maintenance, UnderConstruction, PrivacyPolicy, TermsOfService, AboutUs, ContactUs } from './app/pages-components/index.jsx';
import App from './app/App.jsx'
import './index.css'

/**
 * Renders the React application and sets up routing.
 * 
 * @function
 * @name renderApp
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Router>
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<IndexPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="dashboard" element={<Dashboard />} />
                </Route>
                <Route path="about-us" element={<AboutUs />} />
                <Route path="contact-us" element={<ContactUs />} />
                <Route element={<PublicRoute />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
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
