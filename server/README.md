# NeuroSync Server

NeuroSync is a modern web application designed to offer secure user authentication, responsive design, data visualization, and environment-specific configurations. It aims to provide a seamless user experience through features like Google OAuth login, dark mode support, interactive charts, and the ability to export reports as PDFs and CSVs.

## Overview

This server component is part of a full-stack web application designed to interface with various health tracking IoT-enabled devices, including smartwatches, bracelets, and headbands from brands like Samsung, Apple, Xiaomi, Fitbit, Dreem, and Muse. The server handles backend operations such as authentication, device management, data retrieval, and serving the frontend assets.


## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Project](#running-the-project)
- [Environment Configuration](#environment-configuration)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Services](#services)
- [Utilities](#utilities)
- [Testing](#testing)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Development Tools](#development-tools)
- [CI/CD](#cicd)

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

To run the server in production mode:
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
├── config/
│   ├── development.json            # Development environment configuration
│   └── testing.json                # Testing environment configuration
├── controllers/                    # Controllers
│   ├── auth.controller.js          # Controller for authentication
│   └── user.controller.js          # Controller for user operations
├── database/
│   ├── connect.js                  # Database connection setup
│   ├── migrations/                 # Database migrations scripts
│       ├── ...
│   ├── demo-data/                  # Used for seeding the database with demo data using the migration scripts
│   └── models/                     # Mongoose models
│       ├── Device.model.js         # Device model
│       ├── DeviceData.model.js     # DeviceData model
│       └── User.model.js           # User model
├── enums/
│   ├── supported-devices.js        # Utility for supported devices
├── logs/                           # Log files directory
├── middlewares/
│   ├── auth.middleware.js          # Middleware for authentication
│   ├── rateLimiters.middleware.js  # Middleware for rate limiting
│   └── errorHandler.middleware.js  # Middleware for error handling
├── public/
│   ├── robots.txt
├── routes/
│   ├── auth.routes.js              # Routes for authentication
│   └── user.routes.js              # Routes for user operations
├── services/
│   ├── deviceFactory.js            # Factory design pattern for devices
│   └── devices/                    # Devices using Template Method design pattern
│       ├── apple.js                # Apple devices
│       ├── device.js               # Device abstract class
│       ├── dreem.js                # Dreem devices
│       ├── fitbit.js               # Fitbit devices
│       ├── muse.js                 # Muse devices
│       ├── samsung.js              # Samsung devices
│       └── xiaomi.js               # Xiaomi devices
├── tests/
│   ├── unit-tests                  # Unit tests
│       ├── ...
├── utils/
│   ├── expirationDateConverter.js  # Utility for converting expiration dates  
│   └── mathUtils.js                # Utility for math operations
├── views/
│   └── index.ejs                   # Main view
├── containerConfig.js              # Dependency injection container configuration
├── server.js                       # Server class
├── logger.js                       # Logger class
├── index.js                        # Entry point
├── package.json
├── package-lock.json
└── README.md
```
