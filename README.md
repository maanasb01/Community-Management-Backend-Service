
# TIF-Assignment

A backend service that enables users to make their communities and add members to it.
## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [Development](#development)
  - [Build](#build)
  - [Start](#start-the-server)
- [Dependencies](#dependencies)

## Tech Stack
**Language:** Typescript  
**Server:** Node, Express  
**Database:** MongoDB with Mongoose  
**Authentication:** JSON-Web-Token used with httpOnly Cookies  
**Encryption:** bcryptJS  
**Validator:** express-validator 

## Getting Started

### Prerequisites

To run this project, you need to have the following dependencies installed:

- [Node.js](https://nodejs.org/)

### Installation

1. Clone the main repository to your local machine.

2. Install the project dependencies using npm:

       npm install
    

## Environment Variables
Before running the server, you need to set up environment variables. Create a .env file in the root of your project and add the following variables:

#### Example .env file
    PORT=3000
    DB_CONNECTION_STRING=your-mongodb-url
    AUTH_SEC_KEY=your-secret-key

## Usage

### Scripts
#### Development

To start development, run the following command:

    npm run dev

#### Build
To Build the app, run the following command:

    npm run build

#### Start the server
To start the app, run the following command:

    npm run start




## Dependencies

The project depends on the following npm packages:

- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [express-validator](https://www.npmjs.com/package/express-validator)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [ts-node](https://www.npmjs.com/package/ts-node)
