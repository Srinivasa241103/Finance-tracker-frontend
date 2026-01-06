# Savings Goals Page - API Documentation

This document details all API calls made from the Savings Goals page, including request payloads and expected responses.

---

## 1. Get All Savings Goals

**Endpoint:** `GET /goals`

**Description:** Fetches all savings goals for the authenticated user with optional filtering.

### Request Parameters (Query Params)
```javascript
{
  status: string,    // Optional: "active" | "completed"
  category: string   // Optional: "vacation" | "emergency" | "tech" | "home" | "career" | "entertainment"
}
```

### Request Example
```javascript
// Request with filters
GET /goals?status=active&category=vacation

// Request without filters
GET /goals
```

### Expected Response
```javascript
{
  goals: [
    {
      _id: string,              // Unique goal ID
      name: string,             // Goal name
      description: string,      // Goal description
      targetAmount: number,     // Target amount to save
      currentAmount: number,    // Current saved amount
      deadline: string,         // ISO date string (YYYY-MM-DD)
      category: string,         // "vacation" | "emergency" | "tech" | "home" | "career" | "entertainment"
      status: string,           // "active" | "completed"
      createdAt: string,        // ISO timestamp
      updatedAt: string,        // ISO timestamp
      completedDate: string     // ISO timestamp (only if status is "completed")
    }
  ]
}
```

### Why This Data Is Required

| Field | Purpose |
|-------|---------|
| `_id` | Unique identifier for performing update, delete, and contribution operations |
| `name` | Display goal title in goal cards |
| `description` | Show additional context about the goal in the card header |
| `targetAmount` | Display the total goal amount and calculate progress percentage |
| `currentAmount` | Show current savings and calculate progress percentage and progress bar width |
| `deadline` | Display target completion date and calculate monthly savings target |
| `category` | Determine which icon to display and apply category-specific color themes |
| `status` | Filter goals into "Active Goals" and "Completed Goals" sections |
| `createdAt` | Track when goal was created (not currently displayed) |
| `updatedAt` | Track last modification (not currently displayed) |
| `completedDate` | Display completion date for completed goals |

### How Data Is Displayed

**Active Goals Section:**
- Each goal is displayed as a large card with:
  - **Category Icon** (top-left): Icon based on category (Plane for vacation, Heart for emergency, etc.)
  - **Goal Name** (header): Large bold title
  - **Description** (header): Subtitle text below name
  - **Current Amount** (body): Left side showing current savings with rupee symbol
  - **Target Amount** (body): Right side showing goal amount with rupee symbol
  - **Progress Percentage** (body): Large percentage number showing (currentAmount/targetAmount * 100)
  - **Progress Bar** (body): Visual bar filled to the progress percentage with category-specific color
  - **Deadline** (footer): Formatted as "Due MMM YYYY"
  - **On Track Status** (footer): Green checkmark if on track, amber warning if needs attention
  - **Monthly Target** (footer): Calculated recommended monthly savings amount
  - **Action Buttons**: "Add Contribution" button, and "Mark Complete" button (if progress >= 100%)
  - **Background Color**: Category-specific light background (amber for vacation, rose for emergency, etc.)

**Completed Goals Section:**
- Smaller cards showing:
  - **Checkmark Icon**: Green circle with checkmark
  - **Goal Name**: Bold title
  - **Target Amount**: Final saved amount
  - **Completion Date**: Formatted date when goal was marked complete
  - **"Completed" Badge**: Green badge in top-right corner

---

## 2. Get Goals Summary

**Endpoint:** `GET /goals/summary`

**Description:** Retrieves summary statistics for all savings goals.

### Request Parameters
None

### Expected Response
```javascript
{
  activeGoals: number,        // Count of active goals
  totalSaved: number,         // Total amount saved across all active goals
  averageProgress: number,    // Average progress percentage across all active goals
  completedGoals: number      // Count of completed goals
}
```

### Response Example
```javascript
{
  activeGoals: 5,
  totalSaved: 13590,
  averageProgress: 58,
  completedGoals: 2
}
```

### Why This Data Is Required

| Field | Purpose |
|-------|---------|
| `activeGoals` | Show total count of goals currently being worked on |
| `totalSaved` | Display cumulative savings across all active goals |
| `averageProgress` | Show overall progress percentage across all goals |
| `completedGoals` | Track number of successfully achieved goals (not currently displayed) |

### How Data Is Displayed

**Overview Stats Section** (Three cards at top of page):

1. **Active Goals Card** (Left)
   - Green Target icon in emerald background circle
   - Label: "Active Goals"
   - Value: `activeGoals` in large font
   - Badge: "Active" tag in green

2. **Total Saved Card** (Center)
   - Blue DollarSign icon in blue background circle
   - Label: "Total Saved"
   - Value: `₹{totalSaved.toLocaleString()}` in large font
   - Badge: "Total" tag in blue

3. **Average Progress Card** (Right)
   - Amber TrendingUp icon in amber background circle
   - Label: "Average Progress"
   - Value: `{averageProgress}%` in large font
   - Badge: "Avg Progress" tag in amber

Each card has:
- White background with border
- Rounded corners
- Icon in colored circle at top-left
- Small colored badge at top-right
- Label in small gray text
- Large bold number as main value

---

## 3. Create Savings Goal

**Endpoint:** `POST /goals/create`

**Description:** Creates a new savings goal.

### Request Body
```javascript
{
  name: string,              // Required: Goal name
  targetAmount: number,      // Required: Target amount (parsed as float)
  currentAmount: number,     // Optional: Starting amount (default: 0, parsed as float)
  deadline: string,          // Required: Target date (YYYY-MM-DD format)
  category: string,          // Required: "vacation" | "emergency" | "tech" | "home" | "career" | "entertainment"
  description: string        // Optional: Goal description
}
```

### Request Example
```javascript
{
  name: "Summer Vacation",
  targetAmount: 50000,
  currentAmount: 5000,
  deadline: "2025-06-30",
  category: "vacation",
  description: "Trip to Bali this summer"
}
```

### Expected Response
```javascript
{
  success: boolean,
  message: string,
  goal: {
    _id: string,
    name: string,
    description: string,
    targetAmount: number,
    currentAmount: number,
    deadline: string,
    category: string,
    status: string,
    createdAt: string,
    updatedAt: string
  }
}
```

### Why This Data Is Required

| Field | Purpose |
|-------|---------|
| `name` | Identify the goal - displayed as card title |
| `targetAmount` | Set the savings target - used to calculate progress and monthly targets |
| `currentAmount` | Track starting amount if user already has some savings - used in progress calculation |
| `deadline` | Set target completion date - used to calculate monthly savings needed |
| `category` | Categorize the goal - determines icon and color scheme |
| `description` | Provide context about the goal - displayed as subtitle in card |

### How Data Is Collected

**"Create New Goal" Modal Form:**
- **Goal Name**: Text input field with placeholder "e.g., Summer Vacation"
- **Category**: 6 icon buttons in a grid (Plane, Heart, Laptop, Home, Briefcase, Music) - user clicks to select
- **Target Amount**: Number input with rupee symbol prefix, placeholder "10,000"
- **Current Amount**: Number input with rupee symbol prefix, placeholder "0" (optional)
- **Target Date**: Date picker with calendar icon
- **Description**: Multi-line textarea with placeholder "Add notes about your goal..." (optional)
- **Buttons**: "Cancel" (gray) and "Create Goal" (black) buttons at bottom

On submit:
- Form data is validated (required fields must be filled)
- `targetAmount` and `currentAmount` are parsed as floats
- API request is sent
- On success: Modal closes, form resets, goals list refreshes
- On error: Alert displays error message

---

## 4. Update Savings Goal

**Endpoint:** `POST /goals/update`

**Description:** Updates an existing savings goal.

### Request Body
```javascript
{
  goalId: string,            // Required: Goal ID to update
  name: string,              // Optional: Updated goal name
  targetAmount: number,      // Optional: Updated target amount (parsed as float)
  currentAmount: number,     // Optional: Updated current amount (parsed as float)
  deadline: string,          // Optional: Updated deadline (YYYY-MM-DD)
  category: string,          // Optional: Updated category
  description: string        // Optional: Updated description
}
```

### Request Example
```javascript
{
  goalId: "507f1f77bcf86cd799439011",
  name: "Updated Vacation Fund",
  targetAmount: 60000,
  currentAmount: 7500,
  deadline: "2025-08-31",
  category: "vacation",
  description: "Extended trip to Bali and Singapore"
}
```

### Expected Response
```javascript
{
  success: boolean,
  message: string,
  goal: {
    _id: string,
    name: string,
    description: string,
    targetAmount: number,
    currentAmount: number,
    deadline: string,
    category: string,
    status: string,
    createdAt: string,
    updatedAt: string
  }
}
```

### Why This Data Is Required

| Field | Purpose |
|-------|---------|
| `goalId` | Identify which goal to update |
| `name` | Update goal title if user wants to rename it |
| `targetAmount` | Adjust savings target if goal scope changes |
| `currentAmount` | Manually adjust saved amount if needed |
| `deadline` | Extend or shorten timeline for goal completion |
| `category` | Recategorize goal if needed (affects icon and colors) |
| `description` | Update or add context about the goal |

### How Data Is Collected

**"Edit Goal" Modal Form:**
Triggered when user clicks the Edit icon (pencil) on a goal card

- Pre-fills all fields with current goal data:
  - **Goal Name**: Text input with current name
  - **Category**: Icon grid with current category selected
  - **Target Amount**: Number input with current target
  - **Current Amount**: Number input with current savings
  - **Target Date**: Date picker with current deadline
  - **Description**: Textarea with current description

- **Buttons**: "Cancel" (gray) and "Save Changes" (black)

On submit:
- All form fields (including unchanged ones) are sent
- Amounts are parsed as floats
- API request includes `goalId` from selected goal
- On success: Modal closes, form resets, goals list refreshes
- On error: Alert displays error message

**Use Cases:**
- Increase target amount if goal scope expanded
- Extend deadline if timeline changed
- Update current amount if manual adjustment needed
- Change category if goal was miscategorized
- Update description to add more details

---

## 5. Delete Savings Goal

**Endpoint:** `POST /goals/delete`

**Description:** Deletes a savings goal by ID.

### Request Body
```javascript
{
  goalId: string  // Required: Goal ID to delete
}
```

### Request Example
```javascript
{
  goalId: "507f1f77bcf86cd799439011"
}
```

### Expected Response
```javascript
{
  success: boolean,
  message: string  // e.g., "Goal deleted successfully"
}
```

### Why This Data Is Required

| Field | Purpose |
|-------|---------|
| `goalId` | Identify which specific goal to permanently delete from database |

### How User Triggers This

**Delete Confirmation Modal:**
Triggered when user clicks the Delete icon (trash) on a goal card

1. **Delete Modal Displays:**
   - Title: "Delete Goal"
   - Warning message: "Are you sure you want to delete this goal? This action cannot be undone."
   - Goal summary card showing:
     - Goal name (bold)
     - Current amount / Target amount (e.g., "₹7,500 of ₹10,000")
   - **Buttons**: "Cancel" (gray) and "Delete" (red)

2. **On Confirmation:**
   - User clicks "Delete" button
   - API POST request sent with `goalId` in request body
   - On success: Modal closes, goals list refreshes, goal removed from display
   - On error: Alert displays error message

**Use Cases:**
- User no longer wants to track this goal
- Goal was created by mistake
- Goal is no longer relevant
- User wants to start fresh with new goals

**Important:** This is a destructive action - the goal and all its data (including contribution history) are permanently deleted

---

## 6. Add Contribution

**Endpoint:** `POST /goals/contribution`

**Description:** Adds a contribution to an existing savings goal, increasing the current amount.

### Request Body
```javascript
{
  goalId: string,   // Required: Goal ID to add contribution to
  amount: number,   // Required: Contribution amount (parsed as float)
  note: string      // Optional: Note about the contribution
}
```

### Request Example
```javascript
{
  goalId: "507f1f77bcf86cd799439011",
  amount: 2500,
  note: "Bonus from work"
}
```

### Expected Response
```javascript
{
  success: boolean,
  message: string,
  goal: {
    _id: string,
    name: string,
    description: string,
    targetAmount: number,
    currentAmount: number,      // Updated with new contribution
    deadline: string,
    category: string,
    status: string,
    createdAt: string,
    updatedAt: string
  }
}
```

### Why This Data Is Required

| Field | Purpose |
|-------|---------|
| `goalId` | Identify which goal to add savings to |
| `amount` | Specify how much money is being added to the goal |
| `note` | Track source or reason for contribution (e.g., "Salary savings", "Bonus", "Gift money") |

### How Data Is Collected

**"Add Contribution" Modal:**
Triggered when user clicks "Add Contribution" button on a goal card

1. **Modal Header:**
   - Title: "Add Contribution"
   - Goal summary showing current progress:
     - Goal name
     - Current: ₹{currentAmount} / ₹{targetAmount}

2. **Form Fields:**
   - **Amount**: Large number input with rupee prefix, placeholder "500"
     - Displayed in extra-large bold font
     - Required field
   - **Note (Optional)**: Textarea with placeholder "Add a note for this contribution..."
     - 2 rows tall
     - For tracking contribution source

3. **Buttons**: "Cancel" (gray) and "Add Contribution" (black)

**On Submit:**
- Amount is parsed as float
- API request sent with goalId, amount, and note
- Backend calculates new currentAmount (old + contribution)
- On success:
  - Modal closes
  - Goals list refreshes
  - Goal card updates to show new current amount
  - Progress bar and percentage recalculate
  - Monthly target recalculates
  - If progress reaches 100%, "Mark Complete" button appears
- On error: Alert displays error message

**Use Cases:**
- User received salary and allocates portion to goal
- User got a bonus and wants to contribute
- User sold something and adds proceeds
- Regular monthly contribution to goal
- One-time windfall added to savings

**Visual Feedback After Contribution:**
- Current amount increases
- Progress bar fills more
- Progress percentage updates
- Monthly target may decrease (less needed per month)
- "On track" status may improve

---

## 7. Complete Goal

**Endpoint:** `POST /goals/complete`

**Description:** Marks a savings goal as completed.

### Request Body
```javascript
{
  goalId: string  // Required: Goal ID to mark as complete
}
```

### Request Example
```javascript
{
  goalId: "507f1f77bcf86cd799439011"
}
```

### Expected Response
```javascript
{
  success: boolean,
  message: string,
  goal: {
    _id: string,
    name: string,
    description: string,
    targetAmount: number,
    currentAmount: number,
    deadline: string,
    category: string,
    status: "completed",        // Status changed to "completed"
    completedDate: string,      // Timestamp when completed
    createdAt: string,
    updatedAt: string
  }
}
```

### Why This Data Is Required

| Field | Purpose |
|-------|---------|
| `goalId` | Identify which goal to mark as achieved |
| `status` (response) | Changed to "completed" to filter goal into completed section |
| `completedDate` (response) | Records when goal was achieved - displayed in completed goals |

### How User Triggers This

**"Mark Complete" Button:**
Only visible when goal progress >= 100%

1. **Button Appearance:**
   - Green button with text "Mark Complete"
   - Appears next to "Add Contribution" button
   - Only shown when `currentAmount >= targetAmount`

2. **Confirmation Dialog:**
   - Browser confirm dialog: "Mark this goal as completed?"
   - User must click OK to proceed

3. **On Confirmation:**
   - API request sent with goalId
   - Backend updates status to "completed"
   - Backend sets completedDate to current timestamp
   - On success:
     - Goal refreshes
     - Goal moves from "Active Goals" section to "Completed Goals" section
     - Goal card changes to completed style (smaller, with checkmark)
   - On error: Alert displays error message

### Visual Changes After Completion

**Goal Removed from Active Goals Section**

**Goal Added to Completed Goals Section:**
- **Smaller Card** (1/3 width in grid)
- **Checkmark Icon**: Green circle with checkmark at top-left
- **"Completed" Badge**: Green badge at top-right
- **Goal Name**: Bold title
- **Target Amount**: Final saved amount (formatted with rupee symbol)
- **Completion Date**: Formatted as "Completed on MMM DD, YYYY"
- **No Action Buttons**: Goal is archived, no more actions available

**Purpose:**
- Celebrate achieving a savings goal
- Archive completed goals for record-keeping
- Remove clutter from active goals view
- Track financial achievement history
- Motivate user by showing completed goals

**Note:** Once a goal is completed, it cannot be unmarked or edited through the UI. It becomes a permanent record of achievement.

---

## API Call Flow in the Page

### On Page Load
1. **GET /goals** - Fetches all savings goals
2. **GET /goals/summary** - Fetches summary statistics

Both calls are made in parallel using `Promise.allSettled()` for better performance.

### User Actions

#### Creating a New Goal
1. User fills out the form in "Create New Goal" modal
2. **POST /goals/create** - Submits new goal data
3. **GET /goals** and **GET /goals/summary** - Refreshes data after successful creation

#### Editing a Goal
1. User clicks edit button on a goal card
2. User modifies fields in "Edit Goal" modal
3. **POST /goals/update** - Submits updated goal data
4. **GET /goals** and **GET /goals/summary** - Refreshes data after successful update

#### Deleting a Goal
1. User clicks delete button and confirms
2. **DELETE /goals/delete/{id}** - Deletes the goal
3. **GET /goals** and **GET /goals/summary** - Refreshes data after successful deletion

#### Adding a Contribution
1. User clicks "Add Contribution" button
2. User enters amount and optional note
3. **POST /goals/contribution** - Adds contribution
4. **GET /goals** and **GET /goals/summary** - Refreshes data after successful contribution

#### Completing a Goal
1. User clicks "Mark Complete" button (visible when progress >= 100%)
2. **POST /goals/complete** - Marks goal as completed
3. **GET /goals** and **GET /goals/summary** - Refreshes data after completion

---

## Error Handling

All API calls include error handling that:
- Catches errors from `error.response?.data` or `error.message`
- Returns `{ success: false, error: errorMessage }` for mutation operations
- Displays error messages to the user via `alert()`
- Falls back to dummy data if GET requests fail (for development purposes)

---

## Authentication

All API calls require authentication. The authentication token is automatically included in request headers via the `api` service instance configured in `/src/services/api.js`.

**Authorization Header:**
```
Authorization: Bearer <access_token>
```

---

## Base URL

**Development:** `http://localhost:2010`
**Production:** Configured via `VITE_API_BASE_URL` environment variable

All endpoints are prefixed with the base URL:
```
${API_BASE_URL}/goals
```
