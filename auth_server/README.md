**Crowdfunding App - Authentication Module**

**Overview**

This is an overview of the authentication module for the Crowdfunding App built using NestJS, GraphQL, Prisma, MongoDB, and Gmail for email services. The authentication module includes user registration, login, email verification, password reset, and user management functionalities.

**Features**

- User registration with email verification
- User login with JWT authentication
- Password reset functionality
- Secure password storage using bcrypt
- Integration with Gmail for email notifications

**Endpoints**

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Description:** Registers a new user and sends an activation email.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone_number": "number"
}
```

### 2. User Activation

**Endpoint:** `POST /auth/activate`

**Description:** Activates a user account using an activation token and activation code.

**Request Body:**
```json
{
  "activationToken": "string",
  "activationCode": "string"
}
```

### 3. User Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticates a user and returns access and refresh tokens.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

### 4. Get Logged-In User

**Endpoint:** `GET /auth/me`

**Description:** Retrieves the currently logged-in user's information.

### 5. User Logout

**Endpoint:** `POST /auth/logout`

**Description:** Logs out the currently logged-in user.

### 6. Generate Forgot Password Link

**Endpoint:** `POST /auth/forgot-password`

**Description:** Sends a password reset link to the user's email.

**Request Body:**
```json
{
  "email": "string"
}
```

### 7. Reset Password

**Endpoint:** `POST /auth/reset-password`

**Description:** Resets the user's password using a token.

**Request Body:**
```json
{
  "password": "string",
  "activationToken": "string"
}
```

### 8. Get All Users

**Endpoint:** `GET /auth/users`

**Description:** Retrieves all registered users.

## Technologies Used

- **NestJS:** A progressive Node.js framework for building efficient and scalable server-side applications.
- **GraphQL:** A query language for your API that allows clients to request only the data they need.
- **Prisma:** An open-source database toolkit for TypeScript and Node.js.
- **MongoDB:** A NoSQL database for high availability and scalability.
- **Gmail API:** Used for sending emails for user activation and password resets.

## Security

- Passwords are hashed using bcrypt before storage.
- JWT tokens are used for secure authentication and authorization.
- Activation and reset tokens are generated securely and have expiration times.

## Installation

To set up the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/crowdfunding-app.git
   cd crowdfunding-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file (refer to `.env.example`).

4. Start the application:
   ```bash
   npm run start
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [NestJS Documentation](https://docs.nestjs.com/)
- [GraphQL Documentation](https://graphql.org/)
- [Prisma Documentation](https://www.prisma.io/docs)