# Payment Gateway Application

A robust backend application built with Node.js, Express, and MongoDB that provides user authentication, course management, and payment processing via Razorpay integration.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Middleware](#middleware)
- [Authentication](#authentication)
- [Payment Processing](#payment-processing)
- [Error Handling](#error-handling)
- [Security Features](#security-features)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🔐 User Authentication (Sign Up, Sign In, Sign Out)
- 👤 User Profile Management with Avatar Upload
- 🎓 Course Management System
- 💳 Secure Payment Processing with Razorpay Integration
- 🛡️ Comprehensive Security Measures
- 📁 File Upload Support with Cloudinary Integration
- 🧪 Health Check Endpoint
- 🔄 MongoDB Connection with Retry Logic
- 📊 Rate Limiting for API Protection

## Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Processing**: Razorpay
- **File Storage**: Cloudinary
- **Validation**: express-validator
- **Security**: 
  - Helmet (HTTP headers security)
  - HPP (HTTP Parameter Pollution protection)
  - express-mongo-sanitize (MongoDB query injection protection)
  - CORS configuration
  - Rate Limiting
- **Utilities**:
  - bcryptjs (Password hashing)
  - cookie-parser
  - dotenv (Environment variables)
  - morgan (HTTP request logging)

## Prerequisites

- Node.js >= 14.x
- MongoDB instance (local or cloud)
- Cloudinary account
- Razorpay account

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd payment-gateway
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MongoDB_URI=your_mongodb_connection_string

# JWT Secret
SECRET_KEY=your_jwt_secret_key

# Cloudinary Configuration
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
CLOUD_NAME=your_cloudinary_cloud_name

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Project Structure

```
.
├── controllers/          # Request handlers
├── database/             # Database connection logic
├── middleware/           # Custom middleware functions
├── models/               # Mongoose models
├── routes/               # API route definitions
├── utils/                # Utility functions
├── index.js              # Application entry point
├── package.json          # Project dependencies and scripts
└── .env                  # Environment variables
```

## API Endpoints

### Health Check
- `GET /health` - Application health status

### Authentication
- `POST /api/v1/user/signup` - Create a new user account
- `POST /api/v1/user/signin` - Authenticate user
- `POST /api/v1/user/signout` - Sign out user

### User Profile
- `GET /api/v1/user/profile` - Get current user profile (authenticated)
- `PATCH /api/v1/user/profile` - Update user profile (authenticated)

### Payment Processing
- `POST /api/v1/payment/order` - Create Razorpay order
- `POST /api/v1/payment/verify` - Verify payment

## Database Models

### User Model
- name (String)
- email (String, unique)
- password (String, hashed)
- role (String: student, instructor, admin)
- avatar (String, Cloudinary URL)
- bio (String)
- enrolledCourses (Array of course references)
- createdCourses (Array of course references)
- resetPasswordToken (String)
- resetPasswordExpire (Date)
- lastActive (Date)

### Course Model
- title (String)
- subtitle (String)
- description (String)
- category (String)
- level (String: beginner, intermediate, advanced)
- price (Number)
- thumbnail (String, Cloudinary URL)
- enrolledStudents (Array of user references)
- lectures (Array of lecture references)
- instructor (User reference)
- isPublished (Boolean)
- totalDuration (Number)
- totalLectures (Number)

### Course Purchase Model
- course (Course reference)
- user (User reference)
- amount (Number)
- status (String: pending, completed)
- paymentId (String, Razorpay order ID)

## Middleware

### Authentication Middleware
- `isAuthenticated` - Verifies JWT token and attaches user ID to request

### Error Handling Middleware
- `catchAsync` - Wrapper for async route handlers
- `ApiError` - Custom error class for consistent error responses

### Validation Middleware
- `validateSignUp` - Validates user signup data
- `validate` - General validation middleware

## Authentication

The application uses JWT-based authentication:

1. User signs up with email, password, and name
2. Password is hashed using bcrypt before storing in database
3. Upon successful authentication, a JWT token is generated and sent in a secure HTTP-only cookie
4. Protected routes require the JWT token to be present in cookies
5. Token contains user ID and expires after 24 hours

## Payment Processing

The application integrates with Razorpay for payment processing:

1. User initiates course purchase
2. Backend creates a Razorpay order with course details
3. Frontend collects payment details using Razorpay checkout
4. Payment verification endpoint validates the payment signature
5. Upon successful verification, purchase record is updated

## Error Handling

The application implements a centralized error handling system:

- Custom `ApiError` class for consistent error responses
- `catchAsync` wrapper for handling async route errors
- Global error handling middleware in [index.js](index.js)
- Detailed error messages in development mode
- Generic error messages in production mode

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **HPP**: Protects against HTTP Parameter Pollution attacks
- **express-mongo-sanitize**: Prevents MongoDB operator injection
- **Rate Limiting**: Limits requests per IP to prevent abuse
- **CORS**: Configured to allow only trusted origins
- **Secure Cookies**: HTTP-only, same-site cookies for JWT tokens
- **Input Validation**: Server-side validation for all user inputs
- **Password Hashing**: bcrypt for secure password storage

## Running the Application

### Development Mode
```bash
npm run dev
```
Uses nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```
Runs the application with Node.js directly.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.