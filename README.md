# Eventify - Event Management System

## Overview
Eventify is a comprehensive event management platform that allows users to create, manage, and participate in various events. The system features user authentication, event creation/management, admin dashboard, and real-time event updates.

## Deployment Links
- **Frontend**: [Eventify Web App](https://eventify-frontend.vercel.app)
- **Backend**: [API Server](https://eventify-0ibh.onrender.com/api)

## Test Login Credentials

### Admin Account
- **Email**: admin@example.com
- **Password**: Adminpassword1234

### Test User Account
- **Email**: qunani@mailinator.com
- **Password**: User1234

## Features

### User Management
- [x] User registration with multi-step form
- [x] Secure authentication with JWT
- [x] User profile management
- [x] Role-based access control (Admin/User)

### Event Management
- [x] Create, edit, and delete events (Admin)
- [x] Event registration and RSVP
- [x] Event categories and filtering
- [x] Event capacity management
- [x] Event calendar view

### Admin Features
- [x] Admin dashboard
- [x] User management
- [x] Event analytics
- [x] Request admin access functionality

### Additional Features
- [x] Responsive design
- [x] Dark theme
- [x] Real-time notifications
- [x] Search functionality

## Stack

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios
- React Hook Form
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt
- Nodemailer

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Frontend Setup
```bash
# Navigate to the frontend directory
cd Frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### Backend Setup
```bash
# Navigate to the backend directory
cd Backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables
Create a `.env` file in the backend directory with the following:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3001
```

## API Documentation

### Authentication Endpoints
- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/refresh-token` - Refresh access token

### Event Endpoints
- **GET** `/api/events` - Get all events
- **POST** `/api/events` - Create new event (Admin)
- **PUT** `/api/events/:id` - Update event (Admin)
- **DELETE** `/api/events/:id` - Delete event (Admin)

### User Endpoints
- **GET** `/api/users` - Get all users (Admin)
- **PUT** `/api/users/be-admin` - Request admin access
- **PUT** `/api/users/:id` - Update user status

## License
This project is licensed under the MIT License - see the LICENSE file for details.

