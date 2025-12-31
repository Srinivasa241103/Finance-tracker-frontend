# Dashboard Implementation Guide

## Overview

The dashboard is the main interface for logged-in users, displaying financial statistics, spending trends, category breakdowns, recent transactions, and savings goals.

## Features

### ✅ Components Created

1. **Sidebar** (`src/components/Sidebar.jsx`)
   - Fixed navigation sidebar
   - Active route highlighting
   - Navigation links for all major sections
   - Logout functionality

2. **TopNavigation** (`src/components/TopNavigation.jsx`)
   - Welcome message with user name
   - Search functionality
   - Notification bell with indicator
   - User profile button

3. **StatCard** (`src/components/StatCard.jsx`)
   - Reusable statistics display card
   - Customizable colors and icons
   - Trend indicators
   - Progress bar support

### ✅ Features

- **Real-time Dashboard Stats**
  - Total Balance
  - Total Income
  - Total Expenses
  - Savings Goal Progress

- **Interactive Charts**
  - Spending Trend (Area Chart)
  - Category Breakdown (Pie Chart)

- **Recent Transactions List**
  - Latest 10 transactions
  - Income/Expense indicators
  - Category and date display

- **Savings Goals Tracker**
  - Visual progress bars
  - Current vs Target amounts
  - Add new goal functionality

- **Fallback Data**
  - Default data shown when backend is not connected
  - Seamless transition to real data when backend is ready

## File Structure

```
src/
├── components/
│   ├── Sidebar.jsx               # Navigation sidebar
│   ├── TopNavigation.jsx         # Top header with search
│   ├── StatCard.jsx             # Reusable stat card
│   └── ProtectedRoute.jsx       # Already exists
├── pages/
│   └── Dashboard.jsx            # Main dashboard page
├── services/
│   └── dashboard.js             # Dashboard API service
├── hooks/
│   └── useDashboard.js          # Dashboard data management hook
└── constants/
    └── api.js                   # API endpoints (updated)
```

## API Integration

### Backend Endpoints Required

#### 1. GET `/api/dashboard/stats`

Get overall dashboard statistics.

**Query Parameters:**
- `period` (optional): "thisMonth" | "lastMonth" | "thisYear"

**Response:**
```json
{
  "totalBalance": 12458.50,
  "totalIncome": 5240.00,
  "totalExpenses": 3182.00,
  "balanceChange": 12.5,
  "incomeTransactions": 3,
  "expenseTransactions": 42,
  "savingsGoal": {
    "name": "Vacation Fund",
    "current": 7500,
    "target": 10000,
    "progress": 75
  }
}
```

#### 2. GET `/api/dashboard/spending-trend`

Get spending trend data for charts.

**Query Parameters:**
- `period` (optional): "thisWeek" | "thisMonth" | "lastMonth"

**Response:**
```json
[
  { "day": "Mon", "amount": 420 },
  { "day": "Tue", "amount": 680 },
  { "day": "Wed", "amount": 450 },
  { "day": "Thu", "amount": 820 },
  { "day": "Fri", "amount": 550 },
  { "day": "Sat", "amount": 920 },
  { "day": "Sun", "amount": 720 }
]
```

#### 3. GET `/api/dashboard/category-breakdown`

Get spending by category.

**Query Parameters:**
- `period` (optional): "thisMonth" | "lastMonth" | "thisYear"

**Response:**
```json
[
  { "name": "Food", "value": 856, "color": "#f59e0b" },
  { "name": "Transport", "value": 512, "color": "#3b82f6" },
  { "name": "Shopping", "value": 734, "color": "#8b5cf6" },
  { "name": "Bills", "value": 1080, "color": "#ef4444" }
]
```

#### 4. GET `/api/dashboard/recent-transactions`

Get recent transactions.

**Query Parameters:**
- `limit` (optional): number of transactions (default: 10)

**Response:**
```json
[
  {
    "name": "Salary Deposit",
    "category": "Income",
    "date": "2024-12-15",
    "amount": 5240.00,
    "type": "income"
  },
  {
    "name": "Whole Foods",
    "category": "Groceries",
    "date": "2024-12-14",
    "amount": 87.50,
    "type": "expense"
  }
]
```

#### 5. GET `/api/goals`

Get user's savings goals.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Vacation Fund",
    "current": 7500,
    "target": 10000,
    "progress": 75
  },
  {
    "id": "2",
    "name": "Emergency Fund",
    "current": 4200,
    "target": 15000,
    "progress": 28
  }
]
```

#### 6. POST `/api/goals`

Create a new savings goal.

**Request Body:**
```json
{
  "name": "New Car",
  "target": 25000,
  "current": 0
}
```

**Response:**
```json
{
  "id": "3",
  "name": "New Car",
  "current": 0,
  "target": 25000,
  "progress": 0,
  "createdAt": "2024-12-17T00:00:00Z"
}
```

## Usage

### Using the Dashboard Hook

```javascript
import useDashboard from '../hooks/useDashboard';

function MyComponent() {
  const { loading, error, data, refresh, createGoal } = useDashboard('thisMonth');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Balance: ${data.stats.totalBalance}</p>
      <button onClick={refresh}>Refresh Data</button>
    </div>
  );
}
```

### Using Dashboard Service Directly

```javascript
import dashboardService from '../services/dashboard';

// Get dashboard stats
const stats = await dashboardService.getDashboardStats('thisMonth');

// Get spending trend
const trend = await dashboardService.getSpendingTrend('thisWeek');

// Get category breakdown
const categories = await dashboardService.getCategoryBreakdown('thisMonth');

// Get recent transactions
const transactions = await dashboardService.getRecentTransactions(10);

// Get goals
const goals = await dashboardService.getGoals();

// Create a new goal
const newGoal = await dashboardService.createGoal({
  name: 'Dream Vacation',
  target: 5000,
  current: 0
});
```

### Using Reusable Components

#### Sidebar

```javascript
import Sidebar from '../components/Sidebar';

function MyLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1">
        {/* Your content */}
      </main>
    </div>
  );
}
```

#### TopNavigation

```javascript
import TopNavigation from '../components/TopNavigation';

function MyPage() {
  return (
    <div>
      <TopNavigation
        title="Custom Title"
        subtitle="Custom subtitle"
      />
      {/* Rest of your page */}
    </div>
  );
}
```

#### StatCard

```javascript
import StatCard from '../components/StatCard';
import { Wallet } from 'lucide-react';

function MyStats() {
  return (
    <StatCard
      title="Total Balance"
      value="$12,458"
      change="12.5%"
      icon={Wallet}
      trendUp={true}
      footer="+$1,245 from last month"
    />
  );
}
```

## Customization

### Changing Colors

Edit the StatCard props:

```javascript
<StatCard
  iconBgColor="bg-blue-600"      // Icon background
  bgColor="bg-blue-50"           // Card background
  borderColor="border-blue-100"  // Card border
  progressColor="bg-blue-500"    // Progress bar color
/>
```

### Adding New Navigation Items

Edit `src/components/Sidebar.jsx`:

```javascript
const navItems = [
  // ... existing items
  {
    name: 'Reports',
    path: '/reports',
    icon: FileText,  // Import from lucide-react
  },
];
```

### Changing Chart Colors

Edit the color definitions in Dashboard.jsx:

```javascript
const defaultCategoryData = [
  { name: 'Food', value: 856, color: '#yourColor' },
  // ...
];
```

## Fallback Behavior

The dashboard includes default data that displays when:
- Backend is not connected
- API calls fail
- No data is available yet

This ensures the UI is always functional and allows for development without a running backend.

## Error Handling

The dashboard handles errors gracefully:

1. **Loading State**: Shows a spinner while data loads
2. **Error State**: Displays error message with retry button
3. **Empty State**: Shows default data when no backend data exists

## Performance Considerations

### Data Fetching

- All dashboard data is fetched in parallel using `Promise.all`
- Data is cached in the hook to prevent unnecessary re-fetches
- Refresh function available for manual data updates

### Chart Rendering

- Charts use `ResponsiveContainer` for responsive design
- Recharts library handles optimization
- Data is memoized in the hook

## Testing

### Manual Testing Steps

1. **Login Flow**
   - Log in with valid credentials
   - Verify redirect to dashboard

2. **Data Display**
   - Check all stat cards show correct data
   - Verify charts render properly
   - Check transactions list displays

3. **Navigation**
   - Click sidebar links
   - Verify active state highlighting
   - Test logout functionality

4. **Error Handling**
   - Disconnect backend
   - Verify error state displays
   - Test retry functionality

5. **Responsive Design**
   - Test on mobile viewport
   - Test on tablet viewport
   - Verify sidebar behavior

## Next Steps

1. Implement other navigation pages:
   - `/transactions` - Full transactions list
   - `/analytics` - Detailed analytics
   - `/goals` - Savings goals management
   - `/accounts` - Bank account management
   - `/settings` - User settings

2. Add features:
   - Period selector functionality
   - Search implementation
   - Notifications system
   - Profile dropdown menu
   - Export data functionality

3. Enhancements:
   - Real-time data updates
   - Websocket integration
   - Advanced filtering
   - Data export (PDF, CSV)
   - Goal creation modal

## Dependencies

- `recharts` - Chart library
- `lucide-react` - Icon library
- `react-router-dom` - Routing
- `axios` - HTTP client

## Common Issues

### Charts not displaying
**Solution:** Ensure `recharts` is installed: `npm install recharts`

### Sidebar not showing
**Solution:** Check that Dashboard has `className="flex"` on the container div

### Data not loading
**Solution:**
- Check `.env` has correct `VITE_API_BASE_URL`
- Verify backend is running
- Check browser console for errors
- Verify authentication tokens are valid

### Navigation not working
**Solution:**
- Ensure React Router is properly configured
- Check that routes are wrapped in `<Router>`
- Verify `ProtectedRoute` is working

## Security Notes

- All dashboard routes are protected with `ProtectedRoute`
- API calls include authentication tokens automatically
- Tokens are refreshed automatically on expiry
- User is redirected to login if authentication fails
