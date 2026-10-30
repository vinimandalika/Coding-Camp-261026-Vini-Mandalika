# Pinky Budget ♡ — Project Documentation

## Project Overview

**Pinky Budget ♡** is a cute, pink-themed expense tracking and budget visualization website built for the RevoU Software Engineering Fundamentals Mini Project.

**Tagline:** "little savings, lovely beginnings."

## Technical Stack

- **HTML5** — Page structure
- **CSS3** — Styling and responsive design
- **Vanilla JavaScript** — All functionality
- **Chart.js** — Pie chart visualization
- **localStorage** — Data persistence

## Design Principles

- Soft pastel pink color palette
- Coquette and stationery-inspired aesthetics
- Rounded corners and soft shadows
- Elegant and minimalist UI
- Mobile-first responsive design

## Core Features (MVP)

### 1. Expense Input Form
- Item name, amount, and category fields
- Validation for all inputs
- User-friendly error messages
- Categories: Food, Transport, Fun

### 2. Transaction List
- Display all recorded transactions
- Individual delete buttons
- Scrollable history
- Real-time updates

### 3. Total Expenses
- Automatic calculation
- Indonesian Rupiah formatting
- Updates on add/delete

### 4. Spending Distribution Chart
- Interactive pie chart
- Category-based visualization
- Auto-updates with transactions
- Built with Chart.js

## Optional Features Implemented

### 1. Monthly Summary
- Current month total
- Category breakdown
- Dedicated summary page

### 2. Transaction Sorting
- Sort by newest/oldest
- Sort by highest/lowest amount
- Instant list updates

### 3. Dark/Light Mode
- Theme toggle switch
- Persists via localStorage
- Soft dark rose palette for dark mode
- Smooth transitions

## File Structure

```
project/
├── index.html           # Main HTML page
├── css/
│   └── style.css        # All styles
├── js/
│   └── script.js        # All JavaScript
├── .kiro/
│   └── steering/
│       └── project.md   # This file
└── README.md            # Project README
```

## localStorage Schema

### Transactions
```json
[
  {
    "id": 1698765432000,
    "name": "Coffee",
    "amount": 25000,
    "category": "Food",
    "date": "2024-10-30T12:30:00.000Z"
  }
]
```

### Theme
```
"pinkyBudgetTheme": "light" | "dark"
```

## Color Palette

### Light Mode
- Background: `#FFF8FB`
- Soft pink: `#FCE4EC`
- Pastel pink: `#F8BBD0`
- Rose pink: `#F4A6C1`
- Dark text: `#59434D`
- Muted text: `#A58D98`

### Dark Mode
- Background: `#2A1F26`
- Secondary: `#3D2F38`
- Accent light: `#5A3F52`
- Accent medium: `#7A5269`
- Accent strong: `#A67389`
- Text: `#F8E8EE`

## Navigation Pages

1. **Dashboard** — Overview with total, monthly, chart, form, and recent transactions
2. **Transactions** — Full transaction list with sorting
3. **Monthly Summary** — Current month breakdown by category
4. **Settings** — Theme toggle and about info

## Responsive Breakpoints

- Desktop: > 768px (sidebar visible)
- Tablet: 481px - 768px (collapsible sidebar)
- Mobile: ≤ 480px (hamburger menu)

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Edge, Safari)
- ES6+ JavaScript features
- CSS Grid and Flexbox
- localStorage API

## Future Enhancements

- Budget limits and warnings
- Export transactions to CSV
- Category customization
- Date range filtering
- Income tracking
- Multi-currency support

## Development Notes

- No frameworks or backend required
- All data stored client-side
- Chart.js loaded via CDN
- Fully functional offline after initial load
- XSS protection via HTML escaping
