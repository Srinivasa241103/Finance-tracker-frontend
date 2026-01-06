# Budget API Documentation

This document describes all the API endpoints used by the Budget feature in the frontend, along with the expected request and response formats.

## Table of Contents
1. [Get All Budgets](#1-get-all-budgets)
2. [Get Single Budget](#2-get-single-budget)
3. [Create Budget](#3-create-budget)
4. [Update Budget](#4-update-budget)
5. [Delete Budget](#5-delete-budget)
6. [Get Budget Summary](#6-get-budget-summary)
7. [Get Budget Progress](#7-get-budget-progress)
8. [Get Budget Alerts](#8-get-budget-alerts)

---

## Base URL
```
http://localhost:2010
```

All requests should include authentication headers:
```
Authorization: Bearer <access_token>
```

---

## 1. Get All Budgets

**Endpoint:** `GET /budgets`

**Description:** Fetches all budgets for the authenticated user.

### Frontend Implementation
```javascript
// Service call
import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';

const response = await api.get(API_ENDPOINTS.GET_BUDGETS);
const budgets = response.data.data;
```

### Expected Backend Response
```json
{
  "success": true,
  "message": "Budgets fetched successfully",
  "data": [
    {
      "id": "budget-uuid-1",
      "userId": "user-uuid",
      "category": "Food & Dining",
      "limit": "5000",
      "spent": "3500",
      "remaining": "1500",
      "period": "monthly",
      "startDate": "2026-01-01",
      "endDate": "2026-01-31",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-06T00:00:00.000Z"
    },
    {
      "id": "budget-uuid-2",
      "userId": "user-uuid",
      "category": "Shopping",
      "limit": "10000",
      "spent": "8500",
      "remaining": "1500",
      "period": "monthly",
      "startDate": "2026-01-01",
      "endDate": "2026-01-31",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-06T00:00:00.000Z"
    }
  ]
}
```

### Data Transformation in Frontend
```javascript
const transformedBudgets = budgets.map(budget => ({
  ...budget,
  limit: parseFloat(budget.limit),
  spent: parseFloat(budget.spent),
  remaining: parseFloat(budget.remaining),
}));
```

---

## 2. Get Single Budget

**Endpoint:** `GET /budgets/:budgetId`

**Description:** Fetches details of a specific budget by ID.

### Frontend Implementation
```javascript
const budgetId = "budget-uuid-1";
const response = await api.get(`${API_ENDPOINTS.GET_BUDGET}/${budgetId}`);
const budget = response.data.data;
```

### Expected Backend Response
```json
{
  "success": true,
  "message": "Budget fetched successfully",
  "data": {
    "id": "budget-uuid-1",
    "userId": "user-uuid",
    "category": "Food & Dining",
    "limit": "5000",
    "spent": "3500",
    "remaining": "1500",
    "period": "monthly",
    "startDate": "2026-01-01",
    "endDate": "2026-01-31",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-06T00:00:00.000Z"
  }
}
```

---

## 3. Create Budget

**Endpoint:** `POST /budgets/create`

**Description:** Creates a new budget for a category.

### Frontend Implementation
```javascript
const budgetData = {
  category: "Food & Dining",
  limit: 5000,
  period: "monthly"
};

const response = await api.post(API_ENDPOINTS.CREATE_BUDGET, budgetData);
const newBudget = response.data.data;
```

### Request Body
```json
{
  "category": "Food & Dining",
  "limit": 5000,
  "period": "monthly"
}
```

**Note:** Dates are not included as budgets automatically track expenses for the current period based on the `period` field.

### Expected Backend Response
```json
{
  "success": true,
  "message": "Budget created successfully",
  "data": {
    "id": "budget-uuid-3",
    "userId": "user-uuid",
    "category": "Food & Dining",
    "limit": "5000",
    "spent": "0",
    "remaining": "5000",
    "period": "monthly",
    "startDate": "2026-01-01",
    "endDate": "2026-01-31",
    "createdAt": "2026-01-06T00:00:00.000Z",
    "updatedAt": "2026-01-06T00:00:00.000Z"
  }
}
```

### Validation Rules
- `category` (required): Must be a non-empty string
- `limit` (required): Must be a positive number
- `period` (optional): One of ["monthly", "weekly", "yearly"], defaults to "monthly"

**Important:** The backend should automatically calculate the date range based on the current date and the `period` field. For example, if `period` is "monthly", track expenses from the 1st to the last day of the current month.

---

## 4. Update Budget

**Endpoint:** `PUT /budgets/update/:budgetId`

**Description:** Updates an existing budget.

### Frontend Implementation
```javascript
const budgetId = "budget-uuid-1";
const updatedData = {
  category: "Food & Dining",
  limit: 6000,
  period: "monthly"
};

const response = await api.put(`${API_ENDPOINTS.UPDATE_BUDGET}/${budgetId}`, updatedData);
const updatedBudget = response.data.data;
```

### Request Body
```json
{
  "category": "Food & Dining",
  "limit": 6000,
  "period": "monthly"
}
```

### Expected Backend Response
```json
{
  "success": true,
  "message": "Budget updated successfully",
  "data": {
    "id": "budget-uuid-1",
    "userId": "user-uuid",
    "category": "Food & Dining",
    "limit": "6000",
    "spent": "3500",
    "remaining": "2500",
    "period": "monthly",
    "startDate": "2026-01-01",
    "endDate": "2026-01-31",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-06T12:00:00.000Z"
  }
}
```

---

## 5. Delete Budget

**Endpoint:** `DELETE /budgets/delete/:budgetId`

**Description:** Deletes a specific budget.

### Frontend Implementation
```javascript
const budgetId = "budget-uuid-1";
const response = await api.delete(`${API_ENDPOINTS.DELETE_BUDGET}/${budgetId}`);
```

### Expected Backend Response
```json
{
  "success": true,
  "message": "Budget deleted successfully"
}
```

---

## 6. Get Budget Summary

**Endpoint:** `GET /budgets/summary`

**Description:** Fetches a summary of all budgets including total budget, total spent, and total remaining.

### Frontend Implementation
```javascript
const response = await api.get(API_ENDPOINTS.GET_BUDGET_SUMMARY);
const summary = response.data.data;
```

### Expected Backend Response
```json
{
  "success": true,
  "message": "Budget summary fetched successfully",
  "data": {
    "totalBudget": "25000",
    "totalSpent": "18500",
    "totalRemaining": "6500",
    "budgetCount": 5,
    "period": "monthly",
    "spentPercentage": 74
  }
}
```

### Data Transformation in Frontend
```javascript
const transformedSummary = {
  ...summary,
  totalBudget: parseFloat(summary.totalBudget),
  totalSpent: parseFloat(summary.totalSpent),
  totalRemaining: parseFloat(summary.totalRemaining),
};
```

---

## 7. Get Budget Progress

**Endpoint:** `GET /budgets/progress`

**Description:** Fetches budget progress for all categories with spending percentages.

### Frontend Implementation
```javascript
const response = await api.get(API_ENDPOINTS.GET_BUDGET_PROGRESS);
const progress = response.data.data;
```

### Expected Backend Response
```json
{
  "success": true,
  "message": "Budget progress fetched successfully",
  "data": [
    {
      "category": "Food & Dining",
      "budget": "5000",
      "spent": "3500",
      "remaining": "1500",
      "percentage": 70
    },
    {
      "category": "Shopping",
      "budget": "10000",
      "spent": "8500",
      "remaining": "1500",
      "percentage": 85
    },
    {
      "category": "Transport",
      "budget": "3000",
      "spent": "3200",
      "remaining": "-200",
      "percentage": 106.67
    }
  ]
}
```

### Data Transformation in Frontend
```javascript
const transformedProgress = progress.map(item => ({
  ...item,
  budget: parseFloat(item.budget),
  spent: parseFloat(item.spent),
  percentage: parseFloat(item.percentage),
}));
```

---

## 8. Get Budget Alerts

**Endpoint:** `GET /budgets/alerts`

**Description:** Fetches alerts for budgets that are overspent or approaching limits.

### Frontend Implementation
```javascript
const response = await api.get(API_ENDPOINTS.GET_BUDGET_ALERTS);
const alerts = response.data.data;
```

### Expected Backend Response
```json
{
  "success": true,
  "message": "Budget alerts fetched successfully",
  "data": [
    {
      "id": "alert-1",
      "budgetId": "budget-uuid-2",
      "category": "Shopping",
      "type": "approaching_limit",
      "severity": "medium",
      "title": "Shopping budget at 85%",
      "message": "You've spent ₹8,500 of your ₹10,000 budget",
      "percentage": 85,
      "createdAt": "2026-01-06T00:00:00.000Z"
    },
    {
      "id": "alert-2",
      "budgetId": "budget-uuid-3",
      "category": "Transport",
      "type": "overspent",
      "severity": "high",
      "title": "Transport budget exceeded",
      "message": "You've overspent by ₹200 this month",
      "percentage": 106.67,
      "createdAt": "2026-01-05T00:00:00.000Z"
    }
  ]
}
```

### Alert Types
- `approaching_limit`: Budget is at 80-99% (severity: medium)
- `at_limit`: Budget is at 100% (severity: medium)
- `overspent`: Budget exceeded (severity: high)
- `underspent`: Budget is below 50% usage near end of period (severity: low/info)

---

## Error Responses

All API endpoints may return error responses in the following format:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid budget data",
  "error": "Category is required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication failed",
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Budget not found",
  "error": "No budget exists with the provided ID"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "An unexpected error occurred"
}
```

---

## Frontend Data Flow

### 1. **Component Mount**
```javascript
// Budget.jsx uses useBudget hook
const { loading, error, budgets, summary, progress, alerts, refresh } = useBudget();
```

### 2. **useBudget Hook**
```javascript
// Fetches all budget data on mount
useEffect(() => {
  fetchBudgetData();
}, []);

// Makes parallel API calls
const [budgetsData, summaryData, progressData, alertsData] = await Promise.allSettled([
  budgetService.getBudgets(),
  budgetService.getBudgetSummary(),
  budgetService.getBudgetProgress(),
  budgetService.getBudgetAlerts(),
]);
```

### 3. **Budget Service**
```javascript
// Makes API call using axios instance
const response = await api.get(API_ENDPOINTS.GET_BUDGETS);
return response.data.data; // Returns nested data object
```

### 4. **Data Transformation**
- All numeric strings are converted to numbers
- Dates are kept as ISO strings
- Percentages are calculated if not provided
- Empty arrays/null values are handled gracefully

---

## Category Options

The frontend provides these predefined categories for budgets:
- Food & Dining
- Shopping
- Transport
- Entertainment
- Bills & Utilities
- Groceries
- Healthcare
- Education
- Travel
- Personal Care
- Other

The backend should accept any string as a category, but these are the suggested defaults.

---

## Notes for Backend Implementation

1. **Authentication**: All endpoints require valid JWT authentication
2. **User Isolation**: Only return budgets for the authenticated user
3. **Numeric Fields**: Store as decimal/float but return as strings for precision
4. **Dates**: Use ISO 8601 format (YYYY-MM-DD)
5. **Timestamps**: Use ISO 8601 format with timezone
6. **Date Range Calculation**: Automatically calculate start/end dates based on:
   - **Monthly**: 1st day to last day of current month
   - **Weekly**: Start of current week (Monday) to end of current week (Sunday)
   - **Yearly**: January 1st to December 31st of current year
7. **Spent Calculation**: Calculate from transactions table filtered by:
   - Category matching budget category
   - Date within the current period's date range
   - Transaction type = 'expense'
8. **Remaining Calculation**: `remaining = limit - spent`
9. **Percentage Calculation**: `percentage = (spent / limit) * 100`
10. **Alert Generation**: Create alerts when percentage >= 80%
11. **Period Handling**: Support monthly, weekly, and yearly periods
12. **Auto-Reset**: When a new period starts (e.g., new month), spent amount should reset to 0 automatically

---

## Testing the API

### Using cURL

**Get all budgets:**
```bash
curl -X GET http://localhost:2010/budgets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Create a budget:**
```bash
curl -X POST http://localhost:2010/budgets/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Food & Dining",
    "limit": 5000,
    "period": "monthly"
  }'
```

**Update a budget:**
```bash
curl -X PUT http://localhost:2010/budgets/update/BUDGET_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Food & Dining",
    "limit": 6000,
    "period": "monthly"
  }'
```

**Note:** The backend should automatically determine the date range based on the period and current date.

**Delete a budget:**
```bash
curl -X DELETE http://localhost:2010/budgets/delete/BUDGET_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Frontend File Structure

```
src/
├── constants/
│   └── api.js                 # API endpoint constants
├── services/
│   └── budget.js              # Budget API service
├── hooks/
│   └── useBudget.js           # Budget data management hook
├── pages/
│   └── Budget.jsx             # Budget page component
└── components/
    └── Sidebar.jsx            # Updated with Budget link
```

---

## Summary

The Budget feature provides a complete budget management system with:
- Create, read, update, and delete operations for budgets
- Real-time budget tracking with progress bars
- Summary statistics (total budget, spent, remaining)
- Visual alerts for overspending
- Category-based budget organization
- Period-based budgeting (monthly, weekly, yearly)

All API calls follow a consistent pattern with proper error handling and data transformation to ensure a smooth user experience.
