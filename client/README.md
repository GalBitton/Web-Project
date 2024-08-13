# NeuroSync Client

NeuroSync is a modern web application designed to offer secure user authentication, responsive design, data visualization, and environment-specific configurations. It aims to provide a seamless user experience through features like Google OAuth login, dark mode support, interactive charts, and the ability to export reports as PDFs and CSVs.

## Table of Contents
- [NeuroSync Client](#neurosync-client)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Project](#running-the-project)
      - [Development](#development)
      - [Production](#production)
    - [Environment Configuration](#environment-configuration)
  - [Project Structure](#project-structure)
  - [Scripts](#scripts)
  - [Dependencies](#dependencies)
  - [Development Tools](#development-tools)

## Features

- **User Authentication**: Google OAuth integration for easy and secure login.
- **Protected Routes**: Ensures that only authenticated users can access certain parts of the application.
- **Responsive Design**: Uses Tailwind CSS for a mobile-friendly and consistent UI.
- **Dark Mode Support**: Enhances user experience in low-light environments.
- **Data Visualization**: Interactive charts using Chart.js.
- **PDF Export**: Generate PDF reports using jsPDF.
- **Environment-Specific Configurations**: Handle different settings for development, testing, and production.
- **Maintenance and Under Construction Pages**: Inform users about ongoing maintenance or development.

## Getting Started

### Prerequisites

- Node.js and npm installed on your local machine.
- A Google OAuth client ID for authentication.

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/neurosync.git
    cd neurosync
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

### Running the Project

#### Development

To start the development server:
```sh
npm run dev
```
This will start the Vite development server with hot module replacement.

#### Production
To build the project for production:
```sh
npm run build
```
To preview the built project:
```sh
npm run preview
```

### Environment Configuration

Environment variables are used to configure different settings for development, testing, and production environments.
Vite loads environment variables from .env files located in the project root.

* `.env.development:`: Used for development.
* `.env.production:`: Used for production.
* `.env.testing:`: Used for testing.

These files can be adjusted to control the behavior of the application based on the environment.

## Project Structure
```
client/
│
├── public/                             # Static assets
│   └── assets/                         # Images and other assets
│       └── ...
├── src/                                # Source code
│   ├── app/                            # App components
│   │   ├── pages-components/           # Pages components
│   │   │   ├── about-us.jsx            # Team background and info
│   │   │   ├── contact.jsx             # Contact form and details
│   │   │   ├── dashboard.jsx           # Main user dashboard view
│   │   │   ├── index-page.jsx          # Landing page
│   │   │   ├── index.jsx               # Consolidates and exports all pages
│   │   │   ├── login.jsx               # User login form
│   │   │   ├── maintenance.jsx         # Maintenance mode page
│   │   │   ├── not-found.jsx           # 404 error page for missing content
│   │   │   ├── privacy.jsx             # Privacy policy information
│   │   │   ├── register.jsx            # User registration form
│   │   │   ├── terms.jsx               # Terms of service
│   │   │   └── under-construction.jsx  # Page under construction notice
│   │   └── App.jsx                     # Main App component
│   ├── components/                     # React components
│   │   ├── cards/                      # Cards components
│   │   │   ├── devicecard.jsx          # Displays device info with hover effect
│   │   │   ├── teammembercard.jsx      # Displays team member with LinkedIn link
│   │   │   └── textcard.jsx            # Displays card with text and index
│   │   ├── charts/                     # Charts components
│   │   │   ├── chart.jsx               # Custom generic chart component
│   │   │   └── responsive-charts.jsx   # Chart with zoom, pan, and export
│   │   ├── dashboard/                      # Dashboard components
│   │   │   ├── ChartCarousel.jsx           # Carousel for navigating through charts
│   │   │   ├── DeviceList.jsx              # Carousel for linked device management
│   │   │   ├── DeviceSummary.jsx           # Displays selected brand and type
│   │   │   └── LoadingErrorComponent.jsx   # Displays loading animation or error message
│   │   ├── form/                           # Form components
│   │   │   ├── form.jsx                    # Form with optional Google Login
│   │   │   ├── formbutton.jsx              # Customizable styled button component
│   │   │   ├── forminput.jsx               # Styled input field with label
│   │   │   └── inputfield.jsx              # Renders input or textarea with label
│   │   ├── layouts/                        # Layout components
│   │   │   ├── footer.jsx                  # Displays footer with links and info
│   │   │   ├── index.jsx                   # Exports Footer and AppMenu components
│   │   │   ├── menu.jsx                    # Renders a responsive navigation menu
│   │   │   └── profile-menu.jsx            # Displays user profile menu with logout
│   │   ├── routes/                         # Routes components
│   │   │   ├── protectedroute.jsx          # Protected Route client middleware component
│   │   │   └── publicroute.jsx             # Conditional route rendering for non-authenticated users
│   │   ├── loading.jsx                     # Displays a centered loading animation
│   │   └── slider.jsx                      # Generic slider for displaying items
│   ├── config/                             # Environment configuration files
│   │   ├── .env.development                
│   │   ├── .env.production
│   │   └── .env.testing
│   ├── contexts/                           # React context providers
│   │   └── AuthContext.jsx                 # Authentication context provider
│   ├── hooks/                          # Custom React hooks and providers
│   │   ├── AppProvider.jsx             # App context provider to set title and app div wrapper class
│   │   ├── useAPIService.jsx           # API service hook
│   │   ├── useChartData.jsx            # Custom hook for managing chart data
│   │   ├── useLinkedDevices.jsx        # Custom hook for managing devices
│   │   ├── useLocation.jsx             # Custom hook to get current location and check specific routes
│   │   ├── useNavigation.jsx           # Custom hook for programmatic navigation
│   │   └── UseTheme.jsx                # Theme provider for dark mode/light mode
│   ├── services/                       # API services and data classes
│   │   ├── api/                        # API functions using Axios
│   │   │   ├── APIService.js           # API service class to handle API callbacks
│   │   │   ├── AxiosHandler.js         # AxiosHandler to create an axios instance with custom configurations
│   │   │   └── ControllerService.js    # API callbacks
│   │   ├── DataAnalytics.js            # Manages and analyzes health data metrics
│   │   └── device.js                   # Device class utilized for IoT devices
│   ├── tests/                          # Contains test cases and related files
│   │   ├── __mocks__/                  # Contains mock implementations for testing
│   │   │   ├── lottie-web
│   │   │   │  └── index.js             # Mock for lottie-web library
│   │   │   ├── react-dark-mode-toggle
│   │   │   │   └── index.js            # Mock for react-dark-mode-toggle library
│   │   │   └── react-lottie-player
│   │   │       └── index.js            # Mock for react-lottie-player library
│   │   ├── unit-tests/                 # Unit tests
│   │   │   ├── exporter.test.js        # Tests for Exporter class methods
│   │   │   └── graphUtils.test.js      # Tests for getGraphSummary function
│   │   └── integration-tests/          # Integration tests - Placeholder
│   ├── utils/                          # Utilities and helper functions
│   │   ├── exporter.js                 # Provides CSV and PDF export functionalities
│   │   ├── graphUtils.js               # Provides data summary based on type
│   │   └── index.js                    # Manages exports and summary functions
│   ├── index.css                       # Global CSS styles
│   └── main.jsx                        # Entry point for React, includes React Router
├── .eslintrc.cjs                       # ESLint configuration
├── .prettierignore                     # Prettier ignore file
├── .prettierrc                         # Prettier configuration
├── babel.config.js                     # Babel configuration
├── index.html                          # Main HTML file
├── package-lock.json                           # Lock file for npm package versions
├── package.json                        # NPM package file
├── postcss.config.cjs                  # PostCSS configuration
├── README.md                           # Project documentation
├── tailwind.config.cjs                 # Tailwind CSS configuration
├── vercel.json                         # Vercel configuration file
└── vite.config.js                      # Vite configuration
```

## Scripts
* `npm run dev`: Starts the development server.
* `npm run build`: Builds the project for production.
* `npm run lint`: Runs ESLint to check for code quality issues.
* `npm run preview`: Previews the built project.

## Dependencies
- [React](https://reactjs.org/): JavaScript library for building user interfaces.
- [React Router](https://reactrouter.com/): Declarative routing for React.
- [React Query](https://react-query.tanstack.com/): Data fetching and caching library.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework.
- [Chart.js](https://www.chartjs.org/): Simple yet flexible JavaScript charting.
- [jsPDF](https://github.com/parallax/jsPDF): Generate PDF files in JavaScript.
- [ReactOAuth-Google](https://github.com/MomenSherif/react-oauth): Google OAuth integration for React applications.

## Development Tools
- [Vite](https://vitejs.dev/): Next-generation frontend tooling.
- [ESLint](https://eslint.org/): Pluggable linting utility for JavaScript.
- [Prettier](https://prettier.io/): Opinionated code formatter.
- [PostCSS](https://postcss.org/): A tool for transforming CSS with JavaScript plugins.
- [Jest](https://jestjs.io/): JavaScript testing framework.
- [Tailwind CSS Plugins](): Additional plugins for Tailwind CSS.
