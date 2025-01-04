# Ticket System Web App (MERN Stack)

## Project Description
This project is a web-based ticketing system designed to simplify event management and ticket sales. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js), it provides three user roles: customers, vendors, and admins. Customers can browse events and purchase tickets, vendors can manage events and sales, and admins can oversee the platform and add vendors. The app ensures secure authentication using JWT and provides features like ticket history and downloadable reports.

## Features

### 1. **Customers**
- View all available events.
- Purchase tickets for events.
- View ticket purchase history.

### 2. **Vendors**
- Add, update, and delete events.
- Enable or disable events for ticket sales.
- Download details of purchased tickets for their events.

### 3. **Admins**
- Delete events from the system.
- Add vendors to the system.

### Authentication
- Uses **JWT (JSON Web Tokens)** for secure user authentication and authorization.

---

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
  
---


## Screenshots

<img src="https://github.com/user-attachments/assets/e6e87d19-e8f6-44af-9e34-ab8933d4084b" alt="Screenshot 1" width="400"/>
<img src="https://github.com/user-attachments/assets/ba7d4472-a2bf-4f1a-ab52-8cac2d7e4225" alt="Screenshot 2" width="400"/>
<img src="https://github.com/user-attachments/assets/24387037-2afb-490c-8a0e-b62fcdc977ca" alt="Screenshot 3" width="400"/>
<img src="https://github.com/user-attachments/assets/f6627c13-5798-453e-849a-b67492ced65c" alt="Screenshot 4" width="400"/>
<img src="https://github.com/user-attachments/assets/2638ff70-b076-4f80-b9d0-0f97baaea801" alt="Screenshot 5" width="400"/>
<img src="https://github.com/user-attachments/assets/6eadce47-3d7e-4a3c-878f-1fd005e368cd" alt="Screenshot 6" width="400"/>
<img src="https://github.com/user-attachments/assets/0555f481-3198-4a43-b5e1-a801191705ae" alt="Screenshot 7" width="400"/>
<img src="https://github.com/user-attachments/assets/a42e19eb-8153-4819-a0b6-ae633ff116a4" alt="Screenshot 8" width="400"/>
<img src="https://github.com/user-attachments/assets/453edfa0-7bbc-4116-be22-ec221b5d8f20" alt="Screenshot 9" width="400"/>


---

## Installation

### Prerequisites
Make sure you have **Node.js** and **MongoDB** installed on your machine.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ticket-system.git
   cd ticket-system
   ```

2. Install dependencies for both frontend and backend:
- Backend:
  ```bash
  cd backend
  npm install
  ```
- Frontend:
  ```bash
  cd frontend
  npm install
  ```

3. Set up environment variables in the `.env` file in the backend directory:
   ```bash
   PORT=5000
   MONGO_URI=your-mongo-db-uri
   JWT_SECRET=your-jwt-secret-key
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

5. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

6. The app should now be running at:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

---

## Screenshots

### Customer View
<img src="https://github.com/user-attachments/assets/4caf29b6-4321-4b8e-9bc4-e1a7db4dab82" alt="Event List View" width="400"/>
<img src="https://github.com/user-attachments/assets/583c3ea2-839e-4684-ba22-670130552fb2" alt="Purchase History" width="400"/>

### Vendor View
<img src="https://github.com/user-attachments/assets/485dc7ba-a886-4d7d-b776-09c747d8e0d0" alt="Event Management" width="400"/>
<img src="https://github.com/user-attachments/assets/0d1692eb-7ec4-4be3-963a-43bfcb1a0448" alt="Download Tickets" width="400"/>

### Admin View
<img src="https://github.com/user-attachments/assets/a8e8ad34-3def-4d43-8f22-8f6352daf3af" alt="Admin Dashboard" width="400"/>

---

## Usage

### Customer
- View events and purchase tickets.
- Check ticket purchase history.

### Vendor
- Add, update, and delete events.
- Enable/disable ticket sales for events.
- Download ticket purchase details.

### Admin
- Manage events and add vendors.

---

## Security
- JWT is used for authentication.
- Protected routes ensure only authorized access.



