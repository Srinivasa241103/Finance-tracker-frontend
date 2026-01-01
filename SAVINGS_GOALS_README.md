# Savings Goals - User Guide

## Overview

The **Savings Goals** feature helps you track your progress towards various financial milestones. Whether you're saving for a vacation, building an emergency fund, or working towards a major purchase, this tool provides visual tracking, automatic calculations, and actionable insights to keep you on track.

---

## Accessing the Savings Goals Page

### Navigation
1. Log into your FinanceFlow account
2. Click on **"Savings Goals"** in the left sidebar navigation
3. You'll be redirected to `/goals` where you can view all your savings goals

The page is **protected**, meaning you must be logged in to access it.

---

## Features & How to Use Them

### 1. **Dashboard Overview**

When you first access the page, you'll see three key statistics at the top:

- **Active Goals**: Number of goals you're currently working on
- **Total Saved**: Combined amount saved across all active goals
- **Average Progress**: Average completion percentage across all goals

These metrics update automatically as you add contributions or create new goals.

---

### 2. **Creating a New Savings Goal**

#### Steps:
1. Click the **"New Goal"** button in the top right corner
2. Fill out the goal creation form:
   - **Goal Name**: Give your goal a descriptive name (e.g., "Summer Vacation")
   - **Category**: Choose from 6 categories:
     - 🛫 Travel (vacation)
     - ❤️ Emergency (emergency fund)
     - 💻 Tech (gadgets, electronics)
     - 🏠 Home (house, furniture)
     - 💼 Career (courses, certifications)
     - 🎵 Fun (entertainment)
   - **Target Amount**: The total amount you want to save (in ₹)
   - **Current Amount**: How much you've already saved (optional, defaults to 0)
   - **Target Date**: When you want to reach this goal
   - **Description**: Optional notes about the goal

3. Click **"Create Goal"** to save

#### What Happens:
- The system automatically calculates:
  - **Progress percentage**: (Current Amount / Target Amount) × 100
  - **Monthly target**: How much you need to save per month to reach your goal
  - **On-track status**: Whether your progress is aligned with the timeline

---

### 3. **Viewing Active Goals**

Active goals are displayed as cards with:

#### Visual Elements:
- **Color-coded header**: Each category has a unique color theme
- **Category icon**: Visual representation of the goal type
- **Progress bar**: Shows completion percentage
- **Current vs Target**: Displays how much you've saved vs your goal
- **Deadline**: When the goal should be completed
- **Status indicator**:
  - ✅ **On track** (green): You're progressing well
  - ⚠️ **Needs attention** (amber): You're falling behind

#### Monthly Target Recommendation:
Each goal card shows a **recommended monthly save amount** calculated based on:
- Remaining amount to save
- Time left until the deadline

---

### 4. **Adding Contributions**

#### How to Add Money to a Goal:
1. Find the goal card you want to contribute to
2. Click the **"Add Contribution"** button
3. In the modal:
   - Enter the **contribution amount** (in ₹)
   - Optionally add a **note** to track what this contribution is from
4. Click **"Add Contribution"** to save

#### What Happens:
- The current amount increases by your contribution
- Progress percentage updates automatically
- The "on-track" status recalculates
- Monthly target recommendation adjusts

---

### 5. **Editing a Goal**

#### When to Edit:
- Change the target amount
- Adjust the deadline
- Update the description
- Modify the current saved amount

#### Steps:
1. Click the **pencil icon (Edit)** on the goal card
2. Modify any fields in the edit form
3. Click **"Save Changes"**

**Note**: You can edit all fields including the category and amounts.

---

### 6. **Deleting a Goal**

#### Steps:
1. Click the **trash icon (Delete)** on the goal card
2. Confirm deletion in the popup modal
3. Click **"Delete"** to permanently remove the goal

⚠️ **Warning**: This action cannot be undone. All progress data will be lost.

---

### 7. **Completing a Goal**

#### When You Reach 100%:
1. Once your progress reaches 100% or higher, a **"Mark Complete"** button appears
2. Click the button to move the goal to the "Completed Goals" section
3. Confirm the completion

#### What Happens:
- The goal moves from "Active Goals" to "Completed Goals"
- The completion date is recorded
- It no longer counts toward your active goals statistics

---

### 8. **Viewing Completed Goals**

Completed goals are displayed in a separate section at the bottom of the page showing:
- Goal name
- Final saved amount
- Completion date
- ✅ Completed badge

This serves as a motivational record of your achievements!

---

## Understanding the Calculations

### Progress Percentage
```
Progress = (Current Amount / Target Amount) × 100
```
Capped at 100% maximum

### Monthly Target Recommendation
```
Remaining = Target Amount - Current Amount
Months Left = (Deadline - Today) / 30 days
Monthly Target = Remaining / Months Left
```
Rounded up to the nearest whole number

### On-Track Status
The system compares:
- **Expected progress**: Based on time elapsed
- **Actual progress**: Current amount vs target

If actual progress is within 10% of expected progress, the goal is marked "On track"

---

## API Integration & Fallback Data

### How It Works:
The page attempts to fetch data from the backend API endpoints:
- `GET /goals` - Fetch all goals
- `GET /goals/summary` - Fetch statistics
- `POST /goals/create` - Create new goal
- `POST /goals/update` - Update existing goal
- `DELETE /goals/delete/:id` - Delete a goal
- `POST /goals/contribution` - Add contribution
- `POST /goals/complete` - Mark as completed

### Fallback Behavior:
If the API is unavailable or returns errors:
- **Fallback data** (demo goals) will be displayed
- You can still interact with the UI
- Once the API is connected, real data will automatically replace fallback data
- A console warning will indicate when fallback data is being used

---

## Color Schemes by Category

| Category | Header Color | Progress Bar |
|----------|-------------|--------------|
| Travel | Amber (Orange) | Amber |
| Emergency | Rose (Red) | Rose |
| Tech | Blue | Blue |
| Home | Emerald (Green) | Emerald |
| Career | Purple | Purple |
| Fun | Pink | Pink |

---

## Best Practices

### 1. **Set Realistic Deadlines**
- Give yourself enough time to save comfortably
- Check the "recommended monthly save" amount
- Adjust the deadline if the monthly target is too high

### 2. **Regular Contributions**
- Add contributions regularly (weekly/monthly)
- Even small amounts add up over time
- Use the notes field to track contribution sources

### 3. **Monitor On-Track Status**
- If a goal shows "Needs attention", consider:
  - Increasing contribution amounts
  - Extending the deadline
  - Reducing the target amount

### 4. **Use Categories Wisely**
- Categories help you visualize different types of goals
- Emergency funds should be top priority
- Balance between short-term and long-term goals

### 5. **Celebrate Completions**
- Review completed goals for motivation
- Set new goals to maintain momentum
- Use past successes to plan future goals

---

## Troubleshooting

### Goals Not Loading
- Check your internet connection
- Ensure you're logged in
- Refresh the page
- If the issue persists, fallback data will display

### Cannot Add Contribution
- Verify the amount is a valid number
- Ensure you're connected to the internet
- Check if the goal still exists

### Progress Not Updating
- Wait a few seconds for the page to refresh
- Manually refresh the browser
- Check if the API call succeeded (look for error messages)

---

## Mobile Responsiveness

The Savings Goals page is fully responsive:
- **Desktop**: 2-column grid for active goals
- **Tablet**: 1-2 column layout depending on screen size
- **Mobile**: Single column, scrollable layout

---

## Future Enhancements (Planned)

- 📊 Goal contribution history chart
- 🔔 Notifications when you're falling behind
- 📅 Calendar view of goal deadlines
- 💡 AI-powered savings recommendations
- 📈 Historical trends and analytics
- 🎯 Milestone celebrations at 25%, 50%, 75%

---

## Support

If you encounter any issues or have questions:
1. Check the fallback data is displaying correctly
2. Verify your authentication status
3. Review browser console for error messages
4. Contact support with specific error details

---

**Happy Saving! 🎯💰**
