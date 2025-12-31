# Signup Page Implementation

## Overview

The signup page allows new users to create accounts with comprehensive validation and error handling.

## Features

### ✅ Form Fields
- Full Name (required)
- Email Address (required)
- Password (required, with strength validation)
- Confirm Password (required, must match password)
- Terms & Conditions checkbox (required)

### ✅ Validation

#### Name Validation
- Minimum 2 characters
- Maximum 50 characters

#### Email Validation
- Valid email format (regex validation)
- Required field

#### Password Validation
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

#### Confirm Password
- Must match the password field
- Shows error if passwords don't match

### ✅ UI Features
- Password visibility toggle (eye icon)
- Real-time validation error messages
- Loading state during signup
- Error alerts for API failures
- Disabled form during submission
- Social signup options (Google, GitHub) - UI ready, not yet implemented

### ✅ User Experience
- Clear error messages
- Inline validation feedback
- Responsive design (mobile-friendly)
- Testimonial section for social proof
- Feature highlights
- Smooth transitions and animations

## File Structure

```
src/
├── pages/
│   └── SignupPage.jsx          # Main signup page component
├── utils/
│   └── validation.js           # Validation utilities
├── services/
│   └── auth.js                 # Auth service (includes register method)
└── contexts/
    └── AuthContext.jsx         # Auth context (includes register function)
```

## API Integration

### Backend Endpoint Required

**POST `/api/auth/register`**

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Expected Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

**Error Response:**
```json
{
  "error": {
    "message": "Email already exists",
    "code": "EMAIL_EXISTS"
  }
}
```

## Usage

### Accessing the Signup Page

1. Navigate to `/signup` directly
2. Click "Get Started" button on landing page
3. Click "Start Free Trial" button on landing page
4. Click "Sign up for free" link on login page

### Flow

1. User fills out the form
2. Client-side validation runs on submit
3. If validation passes, API call is made to backend
4. On success:
   - User data and tokens stored in localStorage
   - User redirected to `/dashboard`
   - Auth context updated with user info
5. On failure:
   - Error message displayed at top of form
   - User can retry

## Validation Utilities

Located in `src/utils/validation.js`:

```javascript
import {
  validatePassword,
  doPasswordsMatch,
  validateName,
  isValidEmail
} from './utils/validation';

// Validate password
const result = validatePassword('MyPass123');
// { isValid: true, errors: [] }

// Check if passwords match
const match = doPasswordsMatch('pass123', 'pass123');
// true

// Validate name
const nameCheck = validateName('John');
// { isValid: true, error: null }

// Validate email
const emailCheck = isValidEmail('test@example.com');
// true
```

## Component Structure

```jsx
<SignupPage>
  <LeftSide>
    - Branding
    - Value propositions
    - Feature list with checkmarks
    - Testimonial card
  </LeftSide>

  <RightSide>
    <Form>
      - Full Name Input
      - Email Input
      - Password Input (with toggle)
      - Confirm Password Input (with toggle)
      - Terms Checkbox
      - Submit Button
      - Social Signup Buttons
      - Login Link
    </Form>
  </RightSide>
</SignupPage>
```

## Error Handling

### Client-Side Validation Errors
- Shown inline below each field
- Red border on invalid fields
- Cleared when user starts typing

### API Errors
- Shown in alert box at top of form
- Examples:
  - "Email already exists"
  - "Registration failed. Please try again."
  - Network errors

### Loading State
- Submit button shows spinner
- Form fields disabled
- Social buttons disabled

## Testing

### Manual Testing Steps

1. **Test Valid Signup:**
   - Fill all fields correctly
   - Accept terms
   - Submit and verify redirect to dashboard

2. **Test Name Validation:**
   - Try single character name (should fail)
   - Try very long name (should fail)

3. **Test Email Validation:**
   - Try invalid email format (should fail)
   - Try empty email (should fail)

4. **Test Password Validation:**
   - Try password < 8 chars (should fail)
   - Try password without uppercase (should fail)
   - Try password without lowercase (should fail)
   - Try password without number (should fail)

5. **Test Password Match:**
   - Enter different passwords (should fail)
   - Enter matching passwords (should pass)

6. **Test Terms Checkbox:**
   - Submit without checking (should fail)
   - Check and submit (should pass)

7. **Test API Errors:**
   - Use existing email (backend should reject)
   - Verify error message displays

## Customization

### Change Validation Rules

Edit `src/utils/validation.js`:

```javascript
// Example: Change minimum password length
if (password.length < 10) {  // Changed from 8 to 10
  errors.push('Password must be at least 10 characters long');
}
```

### Add Additional Fields

1. Add to formData state
2. Add input field in JSX
3. Add validation in handleSubmit
4. Update API call if needed

### Customize Styling

All styling uses Tailwind CSS classes. Modify classes directly in SignupPage.jsx.

## Common Issues

### Issue: Form submits but no redirect
**Solution:** Check backend response format matches expected structure

### Issue: Validation not working
**Solution:** Ensure validation.js functions are imported correctly

### Issue: API call fails
**Solution:**
- Check `.env` has correct `VITE_API_BASE_URL`
- Verify backend is running
- Check CORS configuration on backend

## Social Signup (Future)

Social signup buttons are in place but not yet functional. To implement:

1. Set up OAuth with Google/GitHub
2. Create backend endpoints for OAuth
3. Update `handleSocialSignup` function
4. Store tokens returned from OAuth flow

## Security Considerations

- ✅ Password validation enforces strong passwords
- ✅ HTTPS required in production
- ✅ Tokens stored in localStorage (consider httpOnly cookies for production)
- ✅ Client-side validation (backend must validate too!)
- ⚠️ Implement rate limiting on backend
- ⚠️ Implement CAPTCHA for production
- ⚠️ Email verification recommended

## Next Steps

1. Implement email verification flow
2. Add password strength meter
3. Add social authentication
4. Implement CAPTCHA
5. Add welcome email after signup
