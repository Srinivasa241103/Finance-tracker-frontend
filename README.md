# FinanceFlow Frontend

A modern React application for personal finance management built with Vite, React, and Tailwind CSS.

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   └── ProtectedRoute.jsx
│   ├── pages/            # Page components
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── Dashboard.jsx
│   ├── services/         # API services
│   │   ├── api.js        # Axios configuration & interceptors
│   │   └── auth.js       # Authentication service
│   ├── contexts/         # React contexts
│   │   └── AuthContext.jsx
│   ├── hooks/            # Custom React hooks
│   │   └── useAuth.js
│   ├── constants/        # App constants
│   │   └── api.js        # API endpoints & config
│   ├── assets/           # Images, icons, etc.
│   ├── styles/           # Additional CSS files
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main App component with routes
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles & Tailwind directives
├── .env                  # Environment variables
├── .env.example          # Environment variables template
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## Technologies Used

- **React 18.3.1** - UI library
- **Vite 6.x** - Build tool and dev server
- **Tailwind CSS 3.4.x** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library
- **PostCSS & Autoprefixer** - CSS processing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env and set your backend API URL
# VITE_API_BASE_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The app will open at http://localhost:3000/

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

### Current Features

- ✅ Modern, responsive landing page
- ✅ Complete authentication system (login/signup/logout)
- ✅ User registration with comprehensive validation
- ✅ Password strength validation
- ✅ Protected routes with automatic redirection
- ✅ JWT token management with auto-refresh
- ✅ RESTful API integration with Axios
- ✅ Global authentication state with Context API
- ✅ Custom hooks for auth management
- ✅ Form validation utilities
- ✅ Smooth scroll animations
- ✅ Mobile-friendly design
- ✅ Production-ready folder structure
- ✅ Error handling and loading states

### Pages

1. **Landing Page** (`/`) - Marketing homepage with features showcase
2. **Login Page** (`/login`) - User authentication with email/password
3. **Signup Page** (`/signup`) - User registration with validation
4. **Dashboard** (`/dashboard`) - Protected user dashboard (requires login)

### API Integration

The app includes a complete API integration layer:

- **API Service** - Axios instance with interceptors
- **Auth Service** - Authentication-related API calls
- **Token Management** - Automatic token refresh on expiry
- **Error Handling** - Centralized error handling

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Backend Requirements

Your backend API should implement these endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/user/profile` - Get user profile

**Note:** The current `VITE_API_BASE_URL` is set to `http://localhost:5000/api`. Change this in your `.env` file to match your backend URL.

## Usage

### Testing the Login

1. Start the development server
2. Navigate to `/login`
3. Enter your credentials
4. Upon successful login, you'll be redirected to `/dashboard`

### Using Authentication in Components

```javascript
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Your component logic
}
```

## Future Development

Planned features and pages:
- Password reset flow
- Forgot password page
- Email verification
- Expense tracking interface
- Goal setting and tracking
- Financial analytics dashboard
- Profile management
- Settings page

## License

Private project
