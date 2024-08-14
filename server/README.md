# NeuroSync Server

NeuroSync is a modern web application designed to offer secure user authentication, responsive design, data visualization, and environment-specific configurations. It aims to provide a seamless user experience through features like Google OAuth login, dark mode support, interactive charts, and the ability to export reports as PDFs and CSVs.

## Overview

This server component is part of a full-stack web application designed to interface with various health tracking IoT-enabled devices, including smartwatches, bracelets, and headbands from brands like Samsung, Apple, Xiaomi, Fitbit, Dreem, and Muse. The server handles backend operations such as authentication, device management, data retrieval, and serving the frontend assets.


## Table of Contents
- [NeuroSync Server](#neurosync-server)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Project](#running-the-project)
      - [Development](#development)
      - [Testing](#testing)
      - [Production](#production)
  - [Environment Configuration](#environment-configuration)
  - [Project Structure](#project-structure)
  - [Key Functions](#key-functions)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [User Management](#user-management)
  - [Services](#services)
    - [Device Factory](#device-factory)
    - [Device Services](#device-services)
  - [Utilities](#utilities)
  - [Testing](#testing-1)
    - [Unit Tests](#unit-tests)
  - [Scripts](#scripts)
  - [Dependencies](#dependencies)
  - [Development Tools](#development-tools)

## Features

- **User Authentication**: Secure login and registration using Firebase.
- **Security Policy**: Protection against common web vulnerabilities.
- **Device Management**: Link and unlink various health tracking devices.
- **Data Visualization**: Process data to produce analytics from linked devices.
- **Modular Architecture**: Well-structured code with clear separation of concerns.

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB
- Mongoose
### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/GalBitton/Web-Project.git
    cd server
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

### Running the Project

#### Development

To run the server in development mode with live reload using `nodemon`:
```sh
npm run dev
```

#### Testing

To run the server in testing mode with live reload using `nodemon`:
```sh
npm run test
```

#### Production

To run the server in production mode (for Vercel):
```sh
npm start
```

## Environment Configuration

The server uses configuration files located in the config directory. Different configurations are available for development, production, and testing environments.
* development.json: Configuration for development environment.
* production.json: Configuration for production environment.
* testing.json: Configuration for testing environment.

To switch between environments, set the NODE_ENV environment variable accordingly.

## Project Structure
```
server/
├── api/
│   └── index.js                                # Entry point
├── config/                                     # Configuration
│   ├── development.json                        # Development environment 
│   ├── production.json                         # Production environment 
│   └── test.json                               # Testing environment
├── controllers/                                # Controllers
│   ├── auth.controller.js                      # Controller for authentication
│   └── user.controller.js                      # Controller for user operations
├── database/                                   # Database
│   ├── demo-data/                              # Used for seeding the database with demo data using the migration scripts
│   ├── migrations/                             # Database migrations scripts
│   │   ├── database-curator.js                 # Script for deleting collections
│   │   └── migrate-demo-data-to-db.js          # Migrates device data to MongoDB
│   ├── models/                                 # Mongoose models
│   │   ├── Device.model.js                     # Device model
│   │   ├── DeviceData.model.js                 # DeviceData model
│   │   └── User.model.js                       # User model
│   └── connect.js                              # Database connection setup
├── enums/
│   ├── device-statuses.js                      # Device Statuses
│   ├── mappings.js                             # Field mappings for device data datapoints
│   └── supported-devices.js                    # Utility for supported devices
├── logs/                                       # Log files directory (if log2File is enabled in config)
├── middlewares/
│   ├── auth.middleware.js                      # Middleware for authentication
│   ├── errorHandler.middleware.js              # Middleware for error handling
│   ├── index.js                                # Exports error handler and rate limiter
│   └── rateLimiters.middleware.js              # Middleware for rate limiting
├── public/
│   ├── docs/
│       └── swagger.yaml                        # API for user authentication and device management
│   └── robots.txt
├── routes/
│   ├── auth.routes.js                          # Routes for authentication
│   └── user.routes.js                          # Routes for user operations
├── services/
│   ├── devices/                                # Devices using Template Method design pattern
│   │   ├── apple.js                            # Apple devices
│   │   ├── device.js                           # Device abstract class
│   │   ├── dreem.js                            # Dreem devices
│   │   ├── fitbit.js                           # Fitbit devices
│   │   ├── muse.js                             # Muse devices
│   │   ├── samsung.js                          # Samsung devices
│   │   └── xiaomi.js                           # Xiaomi devices
│   ├── deviceFactory.js                        # Factory design pattern for devices
│   ├── deviceStructureConverter.js             # Transforms unified data fields structure to device-specific structure
│   ├── healthStory.js                          # Generates health-related narratives
│   └── unifiedStructureConverter.js            # Transforms device-specific data fields to the unified structure
├── tests/
│   └── unit-tests                              # Unit tests
│       ├── dataSeeding.test.js                 # Tests data generation & validation.
│       ├── deviceFactory.test.js               # Tests devices getFieldValue method functionality
│       ├── devices.test.js                     # Tests for device data retrieval
│       ├── healthstory.test.js                 # Tests health story generation & analysis
│       ├── mathUtils.test.js                   # Tests average calculation accuracy
│       └── translateUnifiedStructure.test.js   # Tests device data transformation and access
├── utils/
│   ├── expirationDateConverter.js              # Utility for converting expiration dates
│   ├── mathUtils.js                            # Utility for math operations
│   └── sleepTranslation.js                     # Utility for translating sleep quality/index
├── .babelrc                                    # Babel configuration file
├── containerConfig.js                          # Dependency injection container configuration
├── logger.js                                   # Logger class
├── package-lock.json                           # Lock file for npm package versions
├── package.json                                # Project metadata and dependencies
├── README.md                                   # Project overview and instructions
├── server.js                                   # Server class
├── vercel-setup.js                             # Vercel deployment setup configuration
└── vercel.json                                 # Vercel deployment configuration file
```

## Key Functions

**logger.js**

| Method                     | Description                                             |
|:---------------------------|:--------------------------------------------------------|
| constructor(config)        | Creates an instance of Logger.                          |
| _createLogger()            | Initializes the logger with defined transports.         |



**server.js**

| Method                       | Description                                                 |
|:-----------------------------|:------------------------------------------------------------|
| constructor(config, logger)  | Creates an instance of Server.                              |
| run()                        | Starts the server and connects to the database.             |
| _getCorsOptions()            | Returns CORS options based on the environment.              |
| _setupPolicies()             | Returns a list of the supported graphs.                     |
| _setupRoutes()               | Sets up the server routes and Swagger UI.                   |
| _setupMiddlewares()          | Sets up middlewares for rate limiting and error handling.   |


**controllers/auth.controller.js**

| Method                            | Description                                                                           |
|:----------------------------------|:--------------------------------------------------------------------------------------|
| constructor(config, logger)       | Creates an instance of AuthController.                                                |
| register(req, res)                | Registers a new user with the provided email and password.                            |
| authenticate(req, res)            | Authenticates a user with the provided details, and returns JWT tokens.               |
| authenticateGoogleToken(req, res) | Authenticates a user using a Google ID token and returns JWT tokens.                  |
| refresh(req, res)                 | Refreshes the access token using a valid refresh token.                               |
| logout(req, res)                  | Logs out the user by clearing the JWT cookie and updating the user's refresh token.   |



**controllers/user.controller.js**

| Method                                     | Description                                        |
|:-------------------------------------------|:---------------------------------------------------|
| constructor(config, logger, deviceFactory) | Creates an instance of UserController.             |
| linkDevice(req, res)                       | Links a device to the user.                        |
| unlinkDevice(req, res)                     | Unlinks a device from the user.                    |
| getLinkedDevices(req, res)                 | Retrieves all linked devices for the user.         |
| getDeviceData(req, res)                    | Retrieves data for a specific device.              |
| getAverageDataAllDevices(req, res)         | Calculates average data for all linked devices.    |
| getHealthStory(req, res)                   | Generates a health story based on device data.     |



**database/migrations/database-curator.js**

| Method              | Description                                                   |
|---------------------|:--------------------------------------------------------------|
| deleteCollections() | Connects to MongoDB and deletes specified collections.        |



**database/migrations/migrate-demo-data-to-db.js**

| Method           | Description                                                             |
|------------------|:------------------------------------------------------------------------|
| migrateData()    | Connects to MongoDB, reads JSON files, and migrates data to MongoDB.    |



**database/connect.js**

| Method               | Description                     |
|:---------------------|:--------------------------------|
| connect(url, logger) | Connects to a MongoDB database. |



**enums/supported-devices.js**

| Method                          | Description                                                     |
|:--------------------------------|:----------------------------------------------------------------|
| getSupportedDeviceBrands()      | Returns an array of supported device brands.                    |
| getSupportedDeviceTypes(brand)  | Returns an array of supported device types for the given brand. |



**middlewares/auth.middleware.js**

| Method                            | Description                                      |
|:----------------------------------|:-------------------------------------------------|
| constructor(config, logger)       | Creates an instance of AuthMiddleware.           |
| authenticateJWT(req, res, next)   | Middleware function to authenticate JWT.         |



**middlewares/errorHandler.middleware.js**

| Method                            | Description                                  |
|:----------------------------------|:---------------------------------------------|
| errorHandler(err, req, res, next) | Middleware function for handling errors.     |



**middlewares/rateLimiters.middleware.js**

| Method                    | Description                                  |
|:--------------------------|:---------------------------------------------|
| limiter                   | Rate limiter for general API requests.       |
| registerLimiter           | Rate limiter for registration attempts.      |
| loginLimiter              | Rate limiter for login attempts.             |



**routes/auth.routes.js**

| Method                                      | Description                                                                   |
|:--------------------------------------------|:------------------------------------------------------------------------------|
| constructor(authController, authMiddleware) | Creates an instance of AuthRouter.                                            |
| getRouter()                                 | Retrieves the configured Express router.                                      |
| _registerRoutes()                           | Registers routes for authentication endpoints with rate limiting middleware.  |



**routes/user.routes.js**

| Method                | Description                                                                                  |
|:----------------------|:---------------------------------------------------------------------------------------------|
| constructor()         | Initializes the router, sets up controllers and middleware, and registers routes.            |
| getRouter()           | Retrieves the configured Express router.                                                     |
| _registerRoutes()     | Registers user-related routes with authentication middleware.                                |



**services/devices/apple.js**

| Method                      | Description                                                         |
|:----------------------------|:--------------------------------------------------------------------|
| constructor()               | Represents an Apple Watch device extending the Device class.        |
| getFieldValue(entry, field) | Retrieves the value for a specific field from the data entry.       |
| getFields()                 | Returns an array of field names specific to the Apple Watch.        |



**services/devices/device.js**

| Method                                                                                    | Description                                                                                                       |
|:------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------|
| constructor(config, logger, id, name, lastSeeded)                                         | Initializes the device with given details.                                                                        |
| convertSleepIndex(qualityIndex)                                                           | Converts sleep quality index to a meaningful value.                                                               |
| getFieldValue(entry, field)                                                               | Gets the value of a specific field from the data entry.                                                           |
| getFields()                                                                               | Lists the field names supported by the device.                                                                    |
| computeValueForField(field, lastValue = null, accumulate, timestamp)                      | Handles the computation of a random value for a field.                                                            |
| generateSleepData()                                                                       | Generates sleep data and handles the conversion of the quality index.                                             |
| generateRandomValueForNestedField(mappingValue, lastEntry = {}, generateSleep, timestamp) | Handles nested object keys for random value generation.                                                           |
| generateRandomValue(fieldMappings, lastEntry = {}, generateSleep, timestamp)              | Handles the cases for various data generation paths.                                                              |
| generateDataBatch(batchStart, batchEnd, intervalMinutes)                                  | Creates a batch of data entries for a time range.                                                                 |
| seedDatabase()                                                                            | Seeds the database with data based on config and time, utilizing batching and asynchronous operations.            |
| extractGraphData(datapoints)                                                              | Processes data for graphing, by converting the device data to the unified structure, returning labels and values. |



**services/devices/dreem.js**

| Method                      | Description                                                     |
|:----------------------------|:----------------------------------------------------------------|
| constructor()               | Represents a Dreem Headband extending the Device class.         |
| getFieldValue(entry, field) | Retrieves the value for a specific field from the data entry.   |
| getFields()                 | Returns an array of field names specific to the Dreem Headband. |



**services/devices/fitbit.js**

| Method                      | Description                                                        |
|:----------------------------|:-------------------------------------------------------------------|
| constructor()               | Represents a Fitbit Bracelet extending the Device class.           |
| getFieldValue(entry, field) | Retrieves the value for a specific field from the data entry.      |
| getFields()                 | Returns an array of field names specific to the Fitbit Bracelet.   |



**services/devices/muse.js**

| Method                      | Description                                                        |
|:----------------------------|:-------------------------------------------------------------------|
| constructor()               | Represents a Muse Headband extending the Device class.             |
| getFieldValue(entry, field) | Retrieves the value for a specific field from the data entry.      |
| getFields()                 | Returns an array of field names specific to the Muse Headband.     |



**services/devices/samsung.js**

SamsungWatch:

| Method                      | Description                                                        |
|:----------------------------|:-------------------------------------------------------------------|
| constructor()               | Represents a Samsung Watch device extending the Device class.      |
| getFieldValue(entry, field) | Retrieves the value for a specific field from the data entry.      |
| getFields()                 | Returns an array of field names specific to the Samsung Watch.     |

SamsungBracelet:

| Method                      | Description                                                        |
|:----------------------------|:-------------------------------------------------------------------|
| constructor()               | Represents a Samsung Bracelet device extending the Device class.   |
| getFieldValue(entry, field) | Retrieves the value for a specific field from the data entry.      |
| getFields()                 | Returns an array of field names specific to the Samsung Bracelet.  |



**services/devices/xiaomi.js**

XiaomiWatch:

| Method                      | Description                                                        |
|:----------------------------|:-------------------------------------------------------------------|
| constructor()               | Represents a Xiaomi Watch device extending the Device class.       |
| getFieldValue(entry, field) | Retrieves the value for a specific field from the data entry.      |
| getFields()                 | Returns an array of field names specific to the Xiaomi Watch.      |

XiaomiBracelet:

| Method                      | Description                                                        |
|:----------------------------|:-------------------------------------------------------------------|
| constructor()               | Represents a Xiaomi Bracelet device extending the Device class.    |
| getFieldValue(entry, field) | Retrieves the value for a specific field from the data entry.      |
| getFields()                 | Returns an array of field names specific to the Xiaomi Bracelet.   |



**services/deviceFactory.js**

| Method                                      | Description                                                        |
|:--------------------------------------------|:-------------------------------------------------------------------|
| constructor(config, logger)                 | Initializes the DeviceFactory with configuration and a logger.     |
| createDevice(brand, device, id, lastSeeded) | Creates and returns an instance of a device.                       |



**services/deviceStructureConverter.js**

| Method                                     | Description                                                                 |
|:-------------------------------------------|:----------------------------------------------------------------------------|
| constructor()                              | Initializes the DeviceStructureConverter.                                   |
| transformObjectWithValues(mapping, values) | Transforms an object based on the provided field mappings and values.       |
| setValueByPath(obj, pathArray, value)      | Sets a value in an object based on a given path.                            |
| convertEntry(mapping, timestamp, values)   | Transforms an object and adds a timestamp at the top level.                 |



**services/healthStory.js**

| Method                      | Description                                                             |
|:----------------------------|:------------------------------------------------------------------------|
| constructor(healthStats)    | Initializes the HealthStory with health statistics.                     |
| createStory()               | Generates a personalized health story based on the provided statistics. |
| analyzeEEG()                | Analyzes EEG data and provides insights into brain activity.            |



**services/unifiedStructureConverter.js**

| Method                             | Description                                                                 |
|:-----------------------------------|:----------------------------------------------------------------------------|
| constructor(deviceInstance)        | Initializes the UnifiedStructureConverter with a device instance.           |
| translateToUnifiedStructure(entry) | Converts an entry from device-specific to unified structure.                |
| getNestedField(entry, field)       | Retrieves a specific nested field from the unified data entry.              |
| getValueByPath(obj, pathArray)     | Retrieves the value from an object based on the specified path.             |



**utils/expirationDateConverter.js**

| Method                                       | Description                                          |
|:---------------------------------------------|:-----------------------------------------------------|
| convertExpirationDateToMilliseconds(timeStr) | Converts a time duration string into milliseconds.   |



**utils/mathUtils.js**

| Method                            | Description                                             |
|:----------------------------------|:--------------------------------------------------------|
| calculateOverallAverage(averages) | Calculates the overall average of an array of numbers.  |



**utils/sleepTranslation.js**

| Method                                | Description                                                                     |
|:--------------------------------------|:--------------------------------------------------------------------------------|
| translateSleepQualityToIndex(quality) | Converts a sleep quality string to a corresponding numerical index.             |
| translateSleepIndex(index)            | Converts a numerical sleep index to a corresponding sleep quality description.  |



## API Endpoints

See Swagger API documentation at /api-docs route.

### Authentication

* POST /auth/register
: Register a new user.

* POST /auth/authenticate
: Log in an existing user.

* POST /auth/authenticate-google
: Log in an existing Google-signed user.

* POST /auth/refresh
: Refresh the access token.

### User Management

* GET /user/linked-devices
: Retrieve all linked devices for the authenticated user.

* GET /user/average-devices-data
: Retrieve the average data for all linked devices for the authenticated user.

* GET /user/device-data/:deviceId
: Retrieve the data for a specific device for the authenticated user.

* POST /user/link-device
: Link a device to the authenticated user.

* POST /user/unlink-device
: Unlink a device from the authenticated user.

* GET /user/health-story
: Generate a health story based on the device data for the authenticated user.

## Services

### Device Factory
The deviceFactory.js file in the services directory implements a factory pattern to create instances of different device types (Apple, Dreem, Fitbit, Muse, Samsung, Xiaomi).

### Device Services
Each device type has its own service file in the services/devices directory. These files handle device-specific operations and interactions.

## Utilities
The utils directory contains utility functions such as:

* expirationDateConverter.js
: Converts expiration dates to a specific format.

* mathUtils.js
: Contains mathematical utility functions.

## Testing

### Unit Tests

To run unit tests:
```sh
npm run test
```

**ensure that the testing environment is configured correctly in config/testing.json.**

## Scripts

* ```npm run dev```: Start the server in development mode with live reload.
* ```npm start```: Start the server in production mode.
* ```npm test```: Run unit tests.
* ```npm run curator```: Run the database curator to clean up all data.
* ```npm run migrate-demo-data```: Seed the database with demo data.

## Dependencies

* **express**: Web framework for Node.js.
* **mongoose**: ODM for MongoDB.
* **mongodb**: NoSQL database.
* **jsonwebtoken**: Library for generating and verifying JSON Web Tokens.
* **bcryptjs**: Library for hashing passwords.
* **dotenv**: Module for loading environment variables.
* **winston**: Logging library.
* **winston-daily-rotate-file**: Logging library for rotating log files.
* **winston-mongodb**: Logging library for MongoDB.
* **express-rate-limit**: Rate limiting middleware for Express.
* **express-validator**: Middleware for request validation.
* **cors**: Middleware for enabling CORS.
* **ejs**: Templating engine for rendering views.
* **google-auth-library**: Google authentication library.
* **cross-env**: Utility for setting environment variables.
* **helmet**: Middleware for setting HTTP headers.
* **kontainer-di**: Dependency injection container.
* **nodemon**: Utility that automatically restarts the server during development.

## Development Tools

* **ESLint**: Linter for identifying and fixing code quality issues.
* **Prettier**: Code formatter to maintain a consistent coding style.
* **Jest**: Testing framework for unit and integration tests.
