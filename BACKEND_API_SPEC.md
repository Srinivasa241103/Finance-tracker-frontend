# Backend API Specification for Transactions

This document outlines the expected API response structure for the transactions feature to minimize API calls and optimize data transfer.

## Overview

The transactions feature is designed to use **minimal API calls** by combining summary statistics with transaction data. The main endpoint returns both paginated transactions and summary data in a single response.

## API Endpoints

### 1. Get Transactions (with Summary)

**Endpoint:** `GET /transactions`

**Description:** Fetch paginated transactions with filtering options. This is the primary endpoint that combines transaction data and summary statistics.

**Query Parameters:**
```javascript
{
  // Filtering
  type: 'income' | 'expense' | '',           // Filter by transaction type (optional)
  category: string,                          // Filter by category (optional)
  search: string,                            // Search in description/merchant (optional)
  dateRange: string,                         // Date range filter (optional, e.g., 'last30days', 'thisMonth')
  minAmount: number,                         // Minimum amount filter (optional)
  maxAmount: number,                         // Maximum amount filter (optional)

  // Pagination
  page: number,                              // Page number (default: 1)
  limit: number,                             // Items per page (default: 10)
}
```

**Response Structure:**
```javascript
{
  success: true,
  data: {
    // Pagination Info
    transactions: [
      {
        _id: string,                         // Transaction ID
        userId: string,                      // User ID
        type: 'income' | 'expense',          // Transaction type
        amount: number,                      // Transaction amount (stored in INR)
        currency: 'INR' | 'USD',             // Original currency
        originalAmount: number,              // Amount in original currency
        amountInINR: number,                 // Amount converted to INR
        exchangeRate: number,                // Exchange rate at time of transaction (1 for INR)
        category: string,                    // Category name
        description: string,                 // Transaction description
        merchant: string,                    // Merchant name (optional)
        date: string,                        // ISO date string
        createdAt: string,                   // ISO date string
        updatedAt: string,                   // ISO date string
      }
    ],

    // Pagination metadata
    currentPage: number,
    totalPages: number,
    totalItems: number,
    itemsPerPage: number,

    // Summary statistics (based on current filters)
    summary: {
      totalTransactions: number,             // Total count of transactions
      totalIncome: number,                   // Sum of all income transactions
      totalExpenses: number,                 // Sum of all expense transactions
      incomeCount: number,                   // Number of income transactions
      expenseCount: number,                  // Number of expense transactions
    }
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "_id": "65f4a8b9e1234567890abcde",
        "userId": "65e3a7b8d1234567890abcdf",
        "type": "expense",
        "amount": 87.50,
        "currency": "INR",
        "originalAmount": 87.50,
        "amountInINR": 87.50,
        "exchangeRate": 1,
        "category": "Food & Dining",
        "description": "Grocery Shopping",
        "merchant": "Whole Foods",
        "date": "2024-12-14T18:45:00.000Z",
        "createdAt": "2024-12-14T18:45:00.000Z",
        "updatedAt": "2024-12-14T18:45:00.000Z"
      },
      {
        "_id": "65f4a8b9e1234567890abcdf",
        "userId": "65e3a7b8d1234567890abcdf",
        "type": "income",
        "amount": 5240.00,
        "currency": "INR",
        "originalAmount": 5240.00,
        "amountInINR": 5240.00,
        "exchangeRate": 1,
        "category": "Salary",
        "description": "Monthly Salary",
        "merchant": "Company Inc.",
        "date": "2024-12-15T14:30:00.000Z",
        "createdAt": "2024-12-15T14:30:00.000Z",
        "updatedAt": "2024-12-15T14:30:00.000Z"
      },
      {
        "_id": "65f4a8b9e1234567890abce0",
        "userId": "65e3a7b8d1234567890abcdf",
        "type": "expense",
        "amount": 4175.00,
        "currency": "USD",
        "originalAmount": 50.00,
        "amountInINR": 4175.00,
        "exchangeRate": 83.5,
        "category": "Shopping",
        "description": "Online Purchase",
        "merchant": "Amazon",
        "date": "2024-12-13T10:30:00.000Z",
        "createdAt": "2024-12-13T10:30:00.000Z",
        "updatedAt": "2024-12-13T10:30:00.000Z"
      }
    ],
    "currentPage": 1,
    "totalPages": 16,
    "totalItems": 156,
    "itemsPerPage": 10,
    "summary": {
      "totalTransactions": 156,
      "totalIncome": 5240.00,
      "totalExpenses": 3182.00,
      "incomeCount": 3,
      "expenseCount": 153
    }
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error message here",
    "code": "ERROR_CODE"
  }
}
```

---

### 2. Get Transaction Summary (Alternative/Fallback)

**Endpoint:** `GET /transactions/summary`

**Description:** Get summary statistics for transactions. This is used as a fallback or alternative endpoint if the main endpoint doesn't include summary data.

**Query Parameters:**
```javascript
{
  type: 'income' | 'expense' | '',           // Filter by transaction type (optional)
  category: string,                          // Filter by category (optional)
  dateRange: string,                         // Date range filter (optional)
}
```

**Response Structure:**
```javascript
{
  success: true,
  data: {
    totalTransactions: number,
    totalIncome: number,
    totalExpenses: number,
    incomeCount: number,
    expenseCount: number,
  }
}
```

---

### 3. Get Single Transaction

**Endpoint:** `GET /transactions/:id`

**Description:** Get details of a single transaction.

**Response Structure:**
```javascript
{
  success: true,
  data: {
    _id: string,
    userId: string,
    type: 'income' | 'expense',
    amount: number,
    category: string,
    description: string,
    merchant: string,
    date: string,
    createdAt: string,
    updatedAt: string,
  }
}
```

---

### 4. Create Transaction

**Endpoint:** `POST /transactions`

**Description:** Create a new transaction.

**Request Body:**
```javascript
{
  type: 'income' | 'expense',                // Required
  amount: number,                            // Required, positive number (will be stored as originalAmount)
  currency: 'INR' | 'USD',                   // Required, default: 'INR'
  amountInINR: number,                       // Required, converted amount in INR
  originalAmount: number,                    // Required, amount in original currency
  exchangeRate: number,                      // Required, exchange rate at time of transaction (1 for INR)
  category: string,                          // Required
  description: string,                       // Required
  merchant: string,                          // Optional
  date: string,                              // Required, ISO date string
}
```

**Example Request (INR):**
```json
{
  "type": "expense",
  "amount": 500,
  "currency": "INR",
  "amountInINR": 500,
  "originalAmount": 500,
  "exchangeRate": 1,
  "category": "Food & Dining",
  "description": "Lunch",
  "merchant": "Restaurant",
  "date": "2024-12-19T12:00:00.000Z"
}
```

**Example Request (USD):**
```json
{
  "type": "expense",
  "amount": 10,
  "currency": "USD",
  "amountInINR": 835,
  "originalAmount": 10,
  "exchangeRate": 83.5,
  "category": "Shopping",
  "description": "Online Purchase",
  "merchant": "Amazon",
  "date": "2024-12-19T12:00:00.000Z"
}
```

**Response Structure:**
```javascript
{
  success: true,
  data: {
    _id: string,
    userId: string,
    type: 'income' | 'expense',
    amount: number,                          // Stored in INR (amountInINR)
    currency: 'INR' | 'USD',
    originalAmount: number,
    amountInINR: number,
    exchangeRate: number,
    category: string,
    description: string,
    merchant: string,
    date: string,
    createdAt: string,
    updatedAt: string,
  },
  message: "Transaction created successfully"
}
```

---

### 5. Update Transaction

**Endpoint:** `PUT /transactions/:id`

**Description:** Update an existing transaction.

**Request Body:**
```javascript
{
  type: 'income' | 'expense',                // Optional
  amount: number,                            // Optional
  category: string,                          // Optional
  description: string,                       // Optional
  merchant: string,                          // Optional
  date: string,                              // Optional, ISO date string
}
```

**Response Structure:**
```javascript
{
  success: true,
  data: {
    _id: string,
    userId: string,
    type: 'income' | 'expense',
    amount: number,
    category: string,
    description: string,
    merchant: string,
    date: string,
    createdAt: string,
    updatedAt: string,
  },
  message: "Transaction updated successfully"
}
```

---

### 6. Delete Transaction

**Endpoint:** `DELETE /transactions/:id`

**Description:** Delete a transaction.

**Response Structure:**
```javascript
{
  success: true,
  message: "Transaction deleted successfully"
}
```

---

### 7. Export Transactions

**Endpoint:** `GET /transactions/export`

**Description:** Export transactions as CSV file.

**Query Parameters:** Same as GET /transactions

**Response:** CSV file download

**Headers:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="transactions-2024-12-19.csv"
```

---

## Optimization Strategy

### Single API Call Approach

The transactions page is designed to minimize API calls by:

1. **Combined Data Fetch**: The main `GET /transactions` endpoint returns both the paginated transaction list AND the summary statistics in a single response. This eliminates the need for separate API calls.

2. **Filter-Aware Summary**: The summary statistics (totalIncome, totalExpenses, etc.) reflect the current filter state, so users get relevant stats without additional API calls.

3. **Client-Side Filtering**: Simple filters like "All", "Income", "Expense" can be applied client-side if needed, though server-side filtering is preferred for accuracy.

### Expected API Call Pattern

**Initial Page Load:**
- 1 API call: `GET /transactions?page=1&limit=10`
  - Returns: transactions + pagination + summary

**When User Changes Filters:**
- 1 API call: `GET /transactions?page=1&limit=10&type=expense&category=Food`
  - Returns: filtered transactions + updated pagination + updated summary

**When User Changes Page:**
- 1 API call: `GET /transactions?page=2&limit=10` (with existing filters)
  - Returns: next page transactions + pagination + summary

**When User Adds Transaction:**
- 1 API call: `POST /transactions` (create)
- 1 API call: `GET /transactions?page=1&limit=10` (refresh list)

**Total API Calls Per Session:**
- Initial load: 1 call
- Each filter change: 1 call
- Each page change: 1 call
- Create/Update/Delete: 2 calls (action + refresh)

### Alternative: Separate Summary Endpoint (Higher API Usage)

If the backend cannot combine summary with transactions:

**Initial Page Load:**
- 2 API calls:
  1. `GET /transactions?page=1&limit=10`
  2. `GET /transactions/summary`

**When User Changes Filters:**
- 2 API calls:
  1. `GET /transactions?page=1&limit=10&type=expense`
  2. `GET /transactions/summary?type=expense`

This doubles the API calls, so the combined approach is strongly preferred.

---

## Data Validation

### Transaction Schema
```javascript
{
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,                            // Stored in INR (same as amountInINR)
    required: true,
    min: 0.01
  },
  currency: {
    type: String,
    enum: ['INR', 'USD'],
    default: 'INR',
    required: true
  },
  originalAmount: {
    type: Number,                            // Amount in original currency
    required: true,
    min: 0.01
  },
  amountInINR: {
    type: Number,                            // Converted amount in INR
    required: true,
    min: 0.01
  },
  exchangeRate: {
    type: Number,                            // Exchange rate at time of transaction
    required: true,
    default: 1,                              // 1 for INR transactions
    min: 0.01
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500
  },
  merchant: {
    type: String,
    trim: true,
    maxLength: 200
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  }
}
```

**Important Notes:**
- All amounts should be stored in INR for consistency
- The `amount` field should equal `amountInINR` for backend storage
- For INR transactions: `originalAmount = amountInINR` and `exchangeRate = 1`
- For USD transactions: `amountInINR = originalAmount * exchangeRate`
- Exchange rate should be captured at the time of transaction creation
- Use Decimal128 or Number with 2 decimal places for currency precision

---

## Categories

Standard categories that should be available:

**Income Categories:**
- Salary
- Freelance
- Investment
- Gift
- Other Income

**Expense Categories:**
- Food & Dining
- Groceries
- Transport
- Shopping
- Bills & Utilities
- Entertainment
- Healthcare
- Education
- Travel
- Other Expenses

---

## Authentication

All transaction endpoints require authentication via Bearer token:

```
Authorization: Bearer <access_token>
```

The token should be included automatically via the axios interceptor configured in `/src/services/api.js`.

---

## Error Codes

Common error codes that should be handled:

- `UNAUTHORIZED` (401): User not authenticated
- `FORBIDDEN` (403): User doesn't have permission
- `NOT_FOUND` (404): Transaction not found
- `VALIDATION_ERROR` (400): Invalid input data
- `SERVER_ERROR` (500): Internal server error

---

## Notes for Backend Implementation

1. **Combine Summary with Transactions**: The most important optimization is to include summary statistics in the GET /transactions response to reduce API calls from 2 to 1.

2. **Filter-Aware Summary**: Summary statistics should respect the current filters (type, category, dateRange, etc.).

3. **Efficient Queries**: Use database aggregation pipelines to calculate summary statistics efficiently.

4. **Pagination**: Always paginate transaction lists to avoid loading too much data at once.

5. **Indexing**: Create indexes on userId, date, type, and category fields for faster queries.

6. **Date Handling**: Store dates as Date objects in the database, return as ISO strings in the API.

7. **Amount Precision**: Store amounts as Decimal128 or Number with 2 decimal places for currency.

8. **Currency Conversion**:
   - Accept both INR and USD currencies
   - Frontend handles real-time conversion and sends both original amount and converted INR amount
   - Backend should store the exchange rate to maintain historical accuracy
   - All summary calculations should use `amountInINR` for consistency
   - Display can optionally show original currency alongside INR

---

## Currency Conversion Feature

### Overview
The application supports multi-currency transactions (INR and USD). All amounts are stored in INR for consistency, but users can enter transactions in USD which are automatically converted.

### How It Works

**Frontend:**
1. User selects currency (INR or USD) in the transaction form
2. If USD is selected:
   - Frontend fetches real-time USD to INR exchange rate from external API
   - As user types amount in USD, frontend shows live conversion in brackets
   - On form submission, frontend sends:
     - `currency`: 'USD'
     - `originalAmount`: USD amount entered by user
     - `amountInINR`: Converted INR amount
     - `exchangeRate`: Current exchange rate used for conversion

3. If INR is selected:
   - User enters amount in INR
   - Frontend sends:
     - `currency`: 'INR'
     - `originalAmount`: INR amount
     - `amountInINR`: Same as originalAmount
     - `exchangeRate`: 1

**Backend:**
1. Receives transaction data with currency information
2. Validates that `amountInINR` calculation is correct
3. Stores all fields including exchange rate
4. Uses `amountInINR` for all calculations (totals, summaries, analytics)

### Example Flow

**User enters $10 expense:**
```
1. User selects "USD" currency
2. User types "10" in amount field
3. Frontend shows: "Equivalent: ₹835.00 (Will be stored in INR)"
4. User submits form
5. Frontend sends to backend:
   {
     "type": "expense",
     "amount": 10,
     "currency": "USD",
     "originalAmount": 10,
     "amountInINR": 835,
     "exchangeRate": 83.5,
     "category": "Shopping",
     "description": "Amazon purchase",
     ...
   }
6. Backend stores transaction with all currency fields
7. Dashboard/Analytics use amountInINR (835) for calculations
```

### Benefits
- **Historical Accuracy**: Exchange rate is stored with each transaction, preserving the conversion rate at transaction time
- **Consistent Calculations**: All summaries and analytics use INR amounts
- **User Flexibility**: Users can enter transactions in their preferred currency
- **Transparency**: User sees the conversion before submitting

### Exchange Rate API
Frontend uses: `https://api.exchangerate-api.com/v4/latest/USD`
- Free API, no authentication required
- Rate refreshes every 30 minutes
- Fallback to default rate (83.5) if API fails
