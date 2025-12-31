# Quick Start Guide

## What's Been Created

Your FinanceFlow frontend now has a complete authentication system with:

✅ Landing Page (`/`)
✅ Login Page (`/login`)
✅ Dashboard (`/dashboard` - protected)
✅ Full API integration layer
✅ JWT token management
✅ Route protection

## File Structure

```
src/
├── components/
│   └── ProtectedRoute.jsx          # Route protection component
├── pages/
│   ├── LandingPage.jsx             # Marketing homepage
│   ├── LoginPage.jsx               # User login page
│   └── Dashboard.jsx               # Protected dashboard
├── services/
│   ├── api.js                      # Axios configuration
│   └── auth.js                     # Auth API calls
├── contexts/
│   └── AuthContext.jsx             # Global auth state
├── hooks/
│   └── useAuth.js                  # Auth custom hook
├── constants/
│   └── api.js                      # API endpoints & config
├── App.jsx                         # Routes & providers
└── main.jsx                        # Entry point
```

## How to Use

### 1. Configure Backend URL

Edit `.env` file:
```env
VITE_API_BASE_URL=http://your-backend-url/api
```

### 2. Start Development Server

```bash
npm run dev
```

The app runs at http://localhost:3000/

### 3. Test the Flow

1. Visit http://localhost:3000/ - Landing page
2. Click "Login" or "Get Started"
3. Enter credentials on login page
4. After login, redirected to dashboard
5. Click "Logout" to end session

## Backend API Requirements

Your backend must implement these endpoints:

### POST /api/auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "user@example.com"
  },
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
```

### POST /api/auth/logout
**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

### POST /api/auth/refresh
**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "accessToken": "new_jwt_token_here"
}
```

## Using Authentication in Your Components

```javascript
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();

  const handleLogin = async () => {
    const result = await login({ email, password });

    if (result.success) {
      console.log('Login successful!');
      // Navigate or show success message
    } else {
      console.error('Login failed:', result.error);
      // Show error message
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Please log in</p>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}
```

## Making API Calls

```javascript
import { api } from './services/api';
import { API_ENDPOINTS } from './constants/api';

// GET request
const fetchData = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.GET_PROFILE);
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// POST request
const createData = async (data) => {
  try {
    const response = await api.post(API_ENDPOINTS.CREATE_EXPENSE, data);
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Adding New Routes

1. Create your page component in `src/pages/`
2. Import it in `src/App.jsx`
3. Add a route:

```javascript
// For public routes
<Route path="/your-route" element={<YourPage />} />

// For protected routes
<Route
  path="/protected-route"
  element={
    <ProtectedRoute>
      <YourProtectedPage />
    </ProtectedRoute>
  }
/>
```

## Environment Variables

Available environment variables:

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Token Storage

Tokens are stored in localStorage:

- `financeflow_access_token` - JWT access token
- `financeflow_refresh_token` - Refresh token
- `financeflow_user_data` - User information

## Automatic Token Refresh

The API service automatically:
1. Adds token to all requests
2. Refreshes token when it expires (401 error)
3. Redirects to login if refresh fails
4. Retries original request with new token

## Next Steps

1. ✅ Configure your backend URL in `.env`
2. ✅ Implement the required endpoints in your backend
3. ✅ Test the login flow
4. 📝 Add registration page
5. 📝 Add password reset flow
6. 📝 Build expense tracking features
7. 📝 Add financial analytics

## Troubleshooting

### Login not working?
- Check backend URL in `.env`
- Check backend is running
- Check Network tab in browser DevTools
- Verify backend response format matches expected format

### CORS errors?
Configure CORS on your backend:
```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Token not persisting?
- Check localStorage in browser DevTools
- Ensure backend returns tokens in correct format
- Check for JavaScript errors in console

## Support

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

For general information, see [README.md](./README.md)
