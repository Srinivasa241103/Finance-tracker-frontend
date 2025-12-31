# API Documentation

This document describes the API integration in the FinanceFlow frontend application.

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=FinanceFlow
VITE_APP_VERSION=1.0.0
```

**Note:** Change `VITE_API_BASE_URL` to your actual backend URL.

## API Structure

### Base Configuration

**File:** `src/constants/api.js`

- **API_BASE_URL:** Base URL for all API requests
- **API_ENDPOINTS:** Object containing all API endpoint paths
- **STORAGE_KEYS:** Keys used for localStorage storage

### API Service

**File:** `src/services/api.js`

The API service uses Axios with configured interceptors for:
- Automatic token injection in request headers
- Token refresh on 401 errors
- Global error handling

#### Methods

```javascript
import { api } from './services/api';

// GET request
api.get('/endpoint', config);

// POST request
api.post('/endpoint', data, config);

// PUT request
api.put('/endpoint', data, config);

// PATCH request
api.patch('/endpoint', data, config);

// DELETE request
api.delete('/endpoint', config);
```

## Authentication API

**File:** `src/services/auth.js`

### Login

```javascript
import authService from './services/auth';

const credentials = {
  email: 'user@example.com',
  password: 'password123'
};

try {
  const response = await authService.login(credentials);
  // response.data contains: { user, accessToken, refreshToken }
} catch (error) {
  console.error('Login failed:', error);
}
```

**Expected Backend Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

### Register

```javascript
const userData = {
  name: 'John Doe',
  email: 'user@example.com',
  password: 'password123'
};

try {
  const response = await authService.register(userData);
  // response.data contains: { user, accessToken, refreshToken }
} catch (error) {
  console.error('Registration failed:', error);
}
```

**Expected Backend Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

### Logout

```javascript
try {
  await authService.logout();
  // User is logged out, tokens are cleared
} catch (error) {
  console.error('Logout failed:', error);
}
```

### Forgot Password

```javascript
try {
  const response = await authService.forgotPassword('user@example.com');
  // Password reset email sent
} catch (error) {
  console.error('Failed to send reset email:', error);
}
```

### Reset Password

```javascript
try {
  const response = await authService.resetPassword(token, newPassword);
  // Password reset successful
} catch (error) {
  console.error('Password reset failed:', error);
}
```

### Helper Methods

```javascript
// Get current user from localStorage
const user = authService.getCurrentUser();

// Check if user is authenticated
const isAuth = authService.isAuthenticated();

// Get access token
const token = authService.getAccessToken();
```

## Using Authentication in Components

### useAuth Hook

```javascript
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();

  const handleLogin = async () => {
    const result = await login({ email, password });
    if (result.success) {
      // Login successful
    } else {
      // Handle error: result.error
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.name}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

## Backend API Endpoints

Your backend should implement the following endpoints:

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/auth/login` | User login | `{ email, password }` | `{ user, accessToken, refreshToken }` |
| POST | `/api/auth/register` | User registration | `{ name, email, password }` | `{ user, accessToken, refreshToken }` |
| POST | `/api/auth/logout` | User logout | - | `{ message }` |
| POST | `/api/auth/refresh` | Refresh access token | `{ refreshToken }` | `{ accessToken }` |
| POST | `/api/auth/forgot-password` | Send reset email | `{ email }` | `{ message }` |
| POST | `/api/auth/reset-password` | Reset password | `{ token, password }` | `{ message }` |
| POST | `/api/auth/verify-email` | Verify email | `{ token }` | `{ message }` |

### User Endpoints

| Method | Endpoint | Description | Headers | Response |
|--------|----------|-------------|---------|----------|
| GET | `/api/user/profile` | Get user profile | `Authorization: Bearer {token}` | `{ user }` |
| PUT | `/api/user/profile` | Update profile | `Authorization: Bearer {token}` | `{ user }` |
| POST | `/api/user/change-password` | Change password | `Authorization: Bearer {token}` | `{ message }` |

### Expense Endpoints

| Method | Endpoint | Description | Headers | Request Body |
|--------|----------|-------------|---------|--------------|
| GET | `/api/expenses` | Get all expenses | `Authorization: Bearer {token}` | - |
| POST | `/api/expenses` | Create expense | `Authorization: Bearer {token}` | `{ amount, category, description, date }` |
| PUT | `/api/expenses/:id` | Update expense | `Authorization: Bearer {token}` | `{ amount, category, description, date }` |
| DELETE | `/api/expenses/:id` | Delete expense | `Authorization: Bearer {token}` | - |

## Error Handling

The API service automatically handles errors and will:
1. Try to refresh the token if a 401 error occurs
2. Redirect to login if token refresh fails
3. Return error messages from the backend

### Error Response Format

Backend should return errors in this format:

```json
{
  "error": {
    "message": "Error message here",
    "code": "ERROR_CODE"
  }
}
```

## Token Management

- **Access Token:** Stored in `localStorage` as `financeflow_access_token`
- **Refresh Token:** Stored in `localStorage` as `financeflow_refresh_token`
- **User Data:** Stored in `localStorage` as `financeflow_user_data`

### Token Refresh Flow

1. Request fails with 401 status
2. Interceptor catches the error
3. Attempts to refresh token using refresh token
4. If successful, retries original request
5. If failed, logs user out and redirects to login

## Security Considerations

1. **HTTPS:** Always use HTTPS in production
2. **Token Expiry:** Implement short-lived access tokens (15-30 minutes)
3. **Refresh Token:** Use longer-lived refresh tokens (7-30 days)
4. **CORS:** Configure CORS properly on backend
5. **Input Validation:** Validate all inputs on both frontend and backend
6. **XSS Protection:** React handles most XSS protection automatically
7. **CSRF Protection:** Implement CSRF tokens if using cookies

## Testing the API

You can test the API integration using the login page:

1. Start the development server: `npm run dev`
2. Navigate to `/login`
3. Enter credentials
4. Check browser console and Network tab for API calls

## Troubleshooting

### CORS Errors

If you see CORS errors, configure your backend to allow requests from your frontend origin:

```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Network Timeout

Default timeout is 10 seconds. To change it, edit `src/services/api.js`:

```javascript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // 20 seconds
});
```

### Token Not Being Sent

Ensure the token is stored in localStorage and the API service is importing correctly.
