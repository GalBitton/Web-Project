# NeuroSync Client

NeuroSync is a modern web application designed to offer secure user authentication, responsive design, data visualization, and environment-specific configurations. It aims to provide a seamless user experience through features like Google OAuth login, dark mode support, interactive charts, and the ability to export reports as PDFs and CSVs.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Project](#running-the-project)
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
│   ├── assets/                         # Images and other assets
├── src/                                # Source code
│   ├── app/                            # App components
│       ├── views-components/           # Pages components
│           ├── ...
│       ├── App.jsx                     # Main App component
│   ├── components/                     # React components
        └── layouts/                    # Layout components
│           ├── ...        
        └── chart.jsx                   # Chart.js custom generic chart component
│       └── protectedroute.jsx          # Protected Route client middleware component
│       └── ...
│   ├── config/                         # Environment configuration files
│       └── .env.development
│       └── .env.production
│       └── .env.testing
│   ├── context/                        # React context providers
│       └── AuthContext.jsx             # Authentication context provider
│   ├── hooks/                          # Custom React hooks and providers
│       └── useAPIService.jsx           # API service hook
│       └── AppProvider.jsx             # App context provider to set title and app div wrapper class
│       └── ThemeProvider.jsx           # Theme provider for dark mode/light mode
│       └── useLocation.jsx             # Custom hook to get current location and check specific routes
│   ├── services/                       # API services and data classes
│       ├── device.js                   # Device class utilized for IoT devices
│       ├── api/                        # API functions using Axios
│           └── APIService.js           # API service class to handle API callbacks
│           └── AxiosHandler.js         # AxiosHandler to create an axios instance with custom configurations
│           └── ControllerService.js    # API callbacks
│   ├── tests/                          # Tests
│       ├── __mocks__/                  # Mocks for unit tests
│           └── ...
│       ├── unit-tests/                 # Unit tests
│           └── ...
│       ├── integration-tests/          # Integration tests - Placeholder
│   ├── utils/                          # Utilities and helper functions
│   ├── main.jsx                        # Entry point for React, includes React Router
│   ├── index.css                       # Global CSS styles
├── .eslintrc.cjs                       # ESLint configuration
├── .gitignore                          # Git ignore file
├── .prettierignore                     # Prettier ignore file
├── .prettierrc                         # Prettier configuration
├── babel.config.js                     # Babel configuration
├── index.html                          # Main HTML file
├── package.json                        # NPM package file
├── postcss.config.cjs                  # PostCSS configuration
├── tailwind.config.cjs                 # Tailwind CSS configuration
├── vite.config.js                      # Vite configuration
└── README.md                           # Project documentation
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
