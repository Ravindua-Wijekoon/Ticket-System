# Ticket System - MERN Stack Application

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Environment Variables](#environment-variables)
6. [Usage](#usage)
7. [API Endpoints](#api-endpoints)
8. [Authentication](#authentication)
9. [Roles and Permissions](#roles-and-permissions)
10. [License](#license)

---

## Overview
This is a ticketing system web application built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). The system supports three types of users:
1. **Customers** - Purchase tickets and view ticket history.
2. **Vendors** - Manage events and ticket sales.
3. **Admin** - Manage vendors and delete events.

The application uses **JWT Authentication** to secure user data and control access based on roles.

---

## Features
- **Customers:**
  - View all events.
  - Purchase tickets for events.
  - View purchase history.

- **Vendors:**
  - Add, update, and delete events.
  - Enable/disable ticket sales for events.
  - Download details of purchased tickets for events.

- **Admin:**
  - Add vendors.
  - Delete events.

- **Authentication:**
  - Secure login using JWT tokens.
  - Role-based access control.

---

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)

---

## Screenshots




---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository/ticket-system.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ticket-system
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```
4. Start the development server:
   ```bash
   cd backend
   npm start
   cd ../frontend
   npm start
   ```

---

## Environment Variables
Create a `.env` file in the `backend` directory with the following variables:
```
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=5000
```

---

## Usage
1. Open the application in the browser:
   ```
   http://localhost:3000
   ```
2. Register as a Customer, Vendor, or Admin.
3. Login and access features based on roles.

---

## Authentication
- The application uses JWT for authentication.
- Routes are protected based on user roles.

---

## Roles and Permissions
1. **Customer:**
   - View events, purchase tickets, and view history.
2. **Vendor:**
   - Manage events and sales data.
3. **Admin:**
   - Manage vendors and delete events.



