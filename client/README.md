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
  - [Key Functions](#key-functions)
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
├── public/                                 # Static assets
│   └── assets/                             # Images and other assets
│       └── ...
├── src/                                    # Source code
│   ├── app/                                # App components
│   │   ├── pages-components/               # Pages components
│   │   │   ├── about-us.jsx                # Team background and info
│   │   │   ├── contact.jsx                 # Contact form and details
│   │   │   ├── dashboard.jsx               # Main user dashboard view
│   │   │   ├── index-page.jsx              # Landing page
│   │   │   ├── index.jsx                   # Consolidates and exports all pages
│   │   │   ├── login.jsx                   # User login form
│   │   │   ├── maintenance.jsx             # Maintenance mode page
│   │   │   ├── not-found.jsx               # 404 error page for missing content
│   │   │   ├── privacy.jsx                 # Privacy policy information
│   │   │   ├── register.jsx                # User registration form
│   │   │   ├── terms.jsx                   # Terms of service
│   │   │   └── under-construction.jsx      # Page under construction notice
│   │   └── App.jsx                         # Main App component
│   ├── components/                         # React components
│   │   ├── cards/                          # Cards components
│   │   │   ├── devicecard.jsx              # Displays device info with hover effect
│   │   │   ├── teammembercard.jsx          # Displays team member with LinkedIn link
│   │   │   └── textcard.jsx                # Displays card with text and index
│   │   ├── charts/                         # Charts components
│   │   │   ├── chart.jsx                   # Custom generic chart component
│   │   │   └── responsive-charts.jsx       # Chart with zoom, pan, and export
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
│   ├── hooks/                              # Custom React hooks and providers
│   │   ├── AppProvider.jsx                 # App context provider to set title and app div wrapper class
│   │   ├── useAPIService.jsx               # API service hook
│   │   ├── useChartData.jsx                # Custom hook for managing chart data
│   │   ├── useLinkedDevices.jsx            # Custom hook for managing devices
│   │   ├── useLocation.jsx                 # Custom hook to get current location and check specific routes
│   │   ├── useNavigation.jsx               # Custom hook for programmatic navigation
│   │   └── UseTheme.jsx                    # Theme provider for dark mode/light mode
│   ├── services/                           # API services and data classes
│   │   ├── api/                            # API functions using Axios
│   │   │   ├── APIService.js               # API service class to handle API callbacks
│   │   │   ├── AxiosHandler.js             # AxiosHandler to create an axios instance with custom configurations
│   │   │   └── ControllerService.js        # API callbacks
│   │   ├── DataAnalytics.js                # Manages and analyzes health data metrics
│   │   └── device.js                       # Device class utilized for IoT devices
│   ├── tests/                              # Contains test cases and related files
│   │   ├── __mocks__/                      # Contains mock implementations for testing
│   │   │   ├── lottie-web
│   │   │   │  └── index.js                 # Mock for lottie-web library
│   │   │   ├── react-dark-mode-toggle
│   │   │   │   └── index.js                # Mock for react-dark-mode-toggle library
│   │   │   └── react-lottie-player
│   │   │       └── index.js                # Mock for react-lottie-player library
│   │   ├── unit-tests/                     # Unit tests
│   │   │   ├── exporter.test.js            # Tests for Exporter class methods
│   │   │   └── graphUtils.test.js          # Tests for getGraphSummary function
│   │   └── integration-tests/              # Integration tests - Placeholder
│   ├── utils/                              # Utilities and helper functions
│   │   ├── exporter.js                     # Provides CSV and PDF export functionalities
│   │   ├── graphUtils.js                   # Provides data summary based on type
│   │   └── index.js                        # Manages exports and summary functions
│   ├── index.css                           # Global CSS styles
│   └── main.jsx                            # Entry point for React, includes React Router
├── .eslintrc.cjs                           # ESLint configuration
├── .prettierignore                         # Prettier ignore file
├── .prettierrc                             # Prettier configuration
├── babel.config.js                         # Babel configuration
├── index.html                              # Main HTML file
├── package-lock.json                       # Lock file for npm package versions
├── package.json                            # NPM package file
├── postcss.config.cjs                      # PostCSS configuration
├── README.md                               # Project documentation
├── tailwind.config.cjs                     # Tailwind CSS configuration
├── vercel.json                             # Vercel configuration file
└── vite.config.js                          # Vite configuration
```

## Key Functions

**src/app/App.js**

| Method | Description |
|:-------|:------------|
| App()  | App component that sets up the main structure of the application. |



**src/app/pages-components/about-us.jsx**

| Method    | Description                                                                                 |
|:----------|:--------------------------------------------------------------------------------------------|
| AboutUs() | AboutUs component for displaying information about the company or organization.             |



**src/app/pages-components/contact.jsx**

| Method               | Description                                                                    |
|:---------------------|:-------------------------------------------------------------------------------|
| ContactUs()          | ContactUs component for displaying contact information and a contact form.     |
| handleInputChange(e) | Handles input changes for the form fields.                                     |
| handleSubmit(e)      | Handles form submission.                                                       |



**src/app/pages-components/dashboard.jsx**

| Method                       | Description                                                   |
|:-----------------------------|:--------------------------------------------------------------|
| Dashboard()                  | Renders the Dashboard component with device data and charts.  |
| handleHealthStory()          | Fetches and updates the health story of the current device.   |
| filteredSpecificDeviceGraphs | Filters and returns graphs with data for specific devices.    |
| filteredAllDevicesGraphs     | Filters and returns graphs with data for all devices.         |



**src/app/pages-components/index-page.jsx**

| Method                  | Description                                                                   |
|:------------------------|:------------------------------------------------------------------------------|
| IndexPage()             | Renders the landing page with a background image, text, cards, and logos.     |
| BackgroundImage         | Styled component for the background image with responsive adjustments.        |
| cardContent             | Array of objects representing the content for text cards on the landing page. |
| companies               | Array of objects representing the supported companies and their logos.        |



**src/app/pages-components/login.jsx**

| Method                        | Description                                        |
|:------------------------------|:---------------------------------------------------|
| handleSubmit(e)               | Handles form submission for email/password login.  |
| handleGoogleSuccess(response) | Handles successful Google authentication.          |
| handleGoogleFailure(error)    | Handles failure of Google authentication.          |



**src/app/pages-components/maintenance.jsx**

| Method        | Description                                                    |
|:--------------|:---------------------------------------------------------------|
| Maintenance   | Renders a full-page maintenance message with a theme switcher. |



**src/app/pages-components/not-found.jsx**

| Method   | Description                                                             |
|----------|-------------------------------------------------------------------------|
| NotFound | Renders a full-page 404 error message with a link to the homepage.      |



**src/app/pages-components/privacy.jsx**

| Method          | Description                                                                               |
|-----------------|-------------------------------------------------------------------------------------------|
| PrivacyPolicy   | Displays the privacy policy page with sections on data handling, usage, and user choices. |



**src/app/pages-components/register.jsx**

| Method                | Description                                                      |
|-----------------------|------------------------------------------------------------------|
| Register              | Renders the registration form for new users.                     |
| handleSubmit          | Submits registration form, validates passwords, and handles API. |
| handleGoogleSuccess   | Processes successful Google login and redirects.                 |
| handleGoogleFailure   | Logs error and displays failure message for Google login.        |



**src/app/pages-components/terms.jsx**

| Method         | Description                               |
|----------------|-------------------------------------------|
| TermsOfService | Renders the terms of use page.            |



**src/app/pages-components/under-construction.jsx**

| Method               | Description                                             |
|----------------------|---------------------------------------------------------|
| UnderConstruction    | Displays a message that the page is under construction. |



**src/components/loading.jsx**

| Method               | Description                                               |
|----------------------|-----------------------------------------------------------|
| LoadingAnimation     | Displays a loading animation centered on the screen.      |



**src/components/slider.jsx**

| Method                | Description                                           |
|-----------------------|-------------------------------------------------------|
| GenericSlider         | A generic slider component for displaying items.      |



**src/components/cards/devicecard.jsx**

| Method      | Description                                             |
|-------------|---------------------------------------------------------|
| DeviceCard  | Displays a card with a device image and hover effect.   |



**src/components/cards/teammemercard.jsx**

| Method           | Description                                                                |
|------------------|----------------------------------------------------------------------------|
| TeamMemberCard   | Displays a card with a team member's image, name, role, and LinkedIn link. |



**src/components/cards/textcard.jsx**

| Method       | Description                                    |
|--------------|------------------------------------------------|
| TextCard     | Displays a card with a title and text content. |



**src/charts/chart.jsx**

| Method         | Description                                                                    |
|----------------|--------------------------------------------------------------------------------|
| ChartComponent | Renders a chart with date range filtering and export options.                  |



**src/charts/responsive-charts.jsx**

| Method                   | Description                                    |
|--------------------------|------------------------------------------------|
| ResponsiveChartComponent | Renders a responsive, zoomable chart.          |
| handleResetZoom          | Resets the chart zoom.                         |



**src/dashbocard/ChartCarousel.jsx**

| Method              | Description                                      |
|---------------------|--------------------------------------------------|
| ChartCarousel       | Displays a carousel of charts with navigation.   |



**src/dashboard/DeviceList.jsx**

| Method         | Description                                                             |
|----------------|-------------------------------------------------------------------------|
| DeviceList     | Displays linked devices in a carousel with options to link new devices. |



**src/dashboard/DeviceSummary.jsx**

| Method          | Description                                |
|-----------------|--------------------------------------------|
| DeviceSummary   | Displays the selected brand and type.      |



**src/dashboard/LoadingErrorComponent.jsx**

| Method                | Description                                            |
|-----------------------|--------------------------------------------------------|
| LoadingErrorComponent | Renders a loading animation or an error message.       |



**src/form/form.jsx**

| Method   | Description                                                                |
|----------|----------------------------------------------------------------------------|
| Form     | Renders a form with optional Google Login integration and custom handlers. |



**src/form/formbutton.jsx**

| Method      | Description                                                       |
|-------------|-------------------------------------------------------------------|
| FormButton  | Renders a styled button with customizable text and click handler. |



**src/form/forminput.jsx**

| Method    | Description                                              |
|-----------|----------------------------------------------------------|
| FormInput | Renders a styled input field with label and placeholder. |



**src/form/inputfield.jsx**

| Method     | Description                                        |
|------------|----------------------------------------------------|
| InputField | Renders an input field or textarea with a label.   |



**src/layouts/footer.jsx**

| Method  | Description                                                            |
|---------|------------------------------------------------------------------------|
| Footer  | Footer component for displaying the footer content of the application. |



**src/layouts/menu.jsx**

| Method  | Description                                                                |
|---------|----------------------------------------------------------------------------|
| AppMenu | Renders a responsive navigation menu with a burger menu on smaller screens |



**src/layouts/profile-menu.jsx**

| Method             | Description                                                                  |
|--------------------|------------------------------------------------------------------------------|
| ProfileMenu        | Displays a user profile menu with a logout option.                           |
| handleToggleMenu   | Toggles the menu open/close state.                                           |
| handleClickOutside | Closes the menu if a click is detected outside of it.                        |
| handleLogoutClick  | Handles logout action, calls API to log out, and navigates to the home page. |



**src/routes/protectedroute.jsx**

| Method          | Description                                                               |
|-----------------|---------------------------------------------------------------------------|
| ProtectedRoute  | A route component that renders its children if the user is logged in.     |



**src/routes/publicroute.jsx**

| Method        | Description                                                                   |
|---------------|-------------------------------------------------------------------------------|
| PublicRoute   | A route component that renders its children if the user is not logged in.     |



**src/contexts/AuthContext.jsx**

| Method                  | Description                                                                      |
|-------------------------|----------------------------------------------------------------------------------|
| AuthProvider            | Provides authentication status and identity information to the component tree.   |
| getIdentity(identifier) | Retrieves user identity information from local storage.                          |
| useAuth                 | Custom hook to access authentication context.                                    |



**src/hooks/AppProvider.jsx**

| Method      | Description                                                                         |
|-------------|-------------------------------------------------------------------------------------|
| AppProvider | Provides global styles and sets the document title based on the application's name. |



**src/hooks/useAPIService.jsx**

| Method          | Description                                               |
|-----------------|-----------------------------------------------------------|
| useAPIService   | Custom hook for managing API service requests.            |



**src/hooks/useChartData.jsx**

| Method                 | Description                                                        |
|------------------------|--------------------------------------------------------------------|
| useChartData           | Custom hook for managing chart data.                               |
| resetCharts            | Resets the charts data.                                            |
| updateCharts           | Updates charts data for a specific device.                         |
| updateAllDevicesCharts | Updates charts data for all devices based on average data.         |



**src/hooks/useLinkedDevices.jsx**

| Method              | Description                                                               |
|---------------------|---------------------------------------------------------------------------|
| useLinkedDevices    | Custom hook to manage linked devices, including linking and unlinking.    |
| handleLinkDevice    | Links a device by brand and type.                                         |
| handleUnlinkDevice  | Unlinks a device by its ID.                                               |



**src/hooks/useLocation.jsx**

| Method       | Description                                                                   |
|--------------|-------------------------------------------------------------------------------|
| useLocation  | Custom hook providing the current location and whether it is the dashboard.   |



**src/hooks/useNavigate.jsx**

| Method         | Description                                                                                |
|----------------|--------------------------------------------------------------------------------------------|
| useNavigate    | Custom hook for navigating programmatically with optional delay.                           |
| navigate       | Navigates to a specified route with an optional delay.                                     |



**src/hooks/useTheme.jsx**

| Method    | Description                                                            |
|-----------|------------------------------------------------------------------------|
| UseTheme  | Component for toggling between light and dark themes.                  |



**src/services/DataAnalytics.js**

| Method                                                     | Description                                      |
|:-----------------------------------------------------------|:-------------------------------------------------|
| constructor(data)                                          | Initializes with data.                           |
| getFieldValue(entry, field)                                | Retrieves field value from an entry.             |
| generateDataForField(field)                                | Generates data for the specified field.          |
| getFields()                                                | Returns an array of field names.                 |
| getAnalysisSummary(field, startTime, endTime)              | Summarizes data for a field within a time frame. |
| _filterDataByTimeFrame(startTime, endTime, labels, values) | Filters values by time frame.                    |



**src/services/device.js**

| Method                        | Description                                        |
|:------------------------------|:---------------------------------------------------|
| constructor(id)               | Initializes with a unique device ID.               |
| fetchAnalyzeData()            | Fetches and analyzes data from the API.            |
| getAnalysisData(field)        | Gets data for a specific field.                    |
| getAnalysisSummary(field)     | Gets a summary of data for a field.                |



**src/services/api/APIService.jsx**

| Method                        | Description                                           |
|:------------------------------|:------------------------------------------------------|
| constructor(request)          | Initializes with request details.                     |
| execute()                     | Executes the API request based on initialized action. |



**src/services/api/AxiosHandler.jsx**

| Method                                  | Description                                            |
|:----------------------------------------|:-------------------------------------------------------|
| processQueue(error, token)              | Handles request queue with error or new token.         |
| refreshToken(retryCount)                | Refreshes the authentication token.                    |
| forceLogout()                           | Forces the user to logout.                             |
| axiosInstance.interceptors.request.use  | Adds Authorization header to requests.                 |
| axiosInstance.interceptors.response.use | Handles token refresh on 401 errors.                   |



**src/services/api/ControllerService.jsx**

| Method                        | Description                                        |
|:------------------------------|:---------------------------------------------------|
| login(email, password)        | Logs in a user with email and password.           |
| loginGoogle(idToken)          | Logs in a user with Google authentication.        |
| register(email, password)     | Registers a new user with email and password.     |
| logout()                      | Logs out the user and revokes Google token.       |
| refreshToken()                | Refreshes the authentication token.               |
| getLinkedDevices()            | Retrieves the list of linked devices.             |
| getAverageDataAllDevices()    | Retrieves average data for all linked devices.    |
| getDeviceData(deviceId)       | Retrieves data for a specific device.             |
| linkDevice(brand, type)       | Links a new device to the user account.           |
| unlinkDevice(deviceId)        | Unlinks a device from the user account.           |
| getHealthStory()              | Retrieves the user's health story.                |



**src/utils/exporter.js**

| Method                                  | Description                                         |
|:----------------------------------------|:----------------------------------------------------|
| exportToCSV(labels, datasets, fileName) | Exports data to a CSV file and triggers a download. |
| exportToPDF(labels, datasets, fileName) | Exports data to a PDF file and triggers a download. |



**src/utils/graphUtils.js**

| Method                         | Description                                                              |
|:-------------------------------|:-------------------------------------------------------------------------|
| getGraphSummary(average, type) | Generates a summary message based on the average value and type of data. |




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
