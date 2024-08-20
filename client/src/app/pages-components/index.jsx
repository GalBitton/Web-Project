/**
 * Exports all the main components of the application.
 *
 * This module provides named exports for various components representing different pages 
 * and views of the application, including the index page, dashboard, login, and other 
 * common pages like terms, privacy policy, and contact.
 * 
 * @module components
 */

import IndexPage from './index-page.jsx';
import Dashboard from './dashboard.jsx';
import Login from './login.jsx';
import Register from './register.jsx';
import NotFound from './not-found.jsx';
import UnderConstruction from './under-construction.jsx';
import Maintenance from './maintenance.jsx';
import PrivacyPolicy from './privacy.jsx';
import TermsOfService from './terms.jsx';
import AboutUs from './about-us.jsx';
import ContactUs from './contact.jsx';

export {
    IndexPage,
    Dashboard,
    Login,
    Register,
    NotFound,
    UnderConstruction,
    Maintenance,
    PrivacyPolicy,
    TermsOfService,
    AboutUs,
    ContactUs
}
