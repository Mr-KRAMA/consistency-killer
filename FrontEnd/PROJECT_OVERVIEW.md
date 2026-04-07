# Consistency Killer - Enhanced Productivity Tracker

## Project Overview

**Consistency Killer** is a modern, minimal, and slightly aggressive productivity web application designed to track planned vs actual work and expose user behavior patterns. The UI feels analytical, honest, and slightly strict—not soft or playful—while being more attractive and user-friendly.

---

## Enhanced Features

### Core Functionality
- **Task Management**: Track planned vs actual work with harsh accountability
- **Analytics Dashboard**: Deep insights into behavior patterns
- **Weekly Reports**: Brutally honest report cards with failure analysis
- **Optional Fitness Tracker**: Log workouts, track calories burned, monitor activity
- **Optional Diet Tracker**: Log meals, track nutrition, monitor calorie intake
- **Settings Module**: Enable/disable fitness and diet tracking as needed

---

## Design System

### Theme
- **Primary Mode**: Dark mode
- **Colors**: 
  - Base: Black (#0a0a0a), Deep Gray (#1a1a1a, #2a2a2a), White (#ffffff)
  - Accent: Red (#ef4444) for failures, Green (#22c55e) for success, Yellow (#eab308) for warnings
  - Additional: Blue (#3b82f6) for diet metrics, Purple for fitness streaks
- **Typography**: Clean, modern, minimal clutter
- **Style**: Professional dashboard inspired by Notion, Linear, and Stripe

### Visual Enhancements
- **Gradient Accents**: Subtle gradients on cards and backgrounds
- **Hover Effects**: Smooth transitions and shadow elevations
- **Icon Integration**: Lucide React icons for visual clarity
- **Progress Bars**: Visual macro tracking and goal progress
- **Rounded Corners**: Modern 8-12px border radius
- **Shadow Depth**: Layered shadows for card hierarchy

---

## Pages

### 1. Login / Signup Page
- Split-screen design with form on left, feature showcase on right
- Gradient branding elements
- Minimal distraction, centered form
- Smooth tab switching between login/signup

### 2. Dashboard Page
**Top Section:**
- Today's Consistency Score (large, bold percentage with gradient background)
- Harsh performance message based on score

**Stats Cards (4 columns):**
- Tasks Planned vs Completed (with destructive color for failures)
- Time Spent vs Planned (warning indicators)
- Calories Burned (fitness module, if enabled)
- Calories Consumed (diet module, if enabled)

**Quick Stats Row (3 columns):**
- Consecutive Failures (critical status)
- Exercise Streak (success status)
- Weekly Average (performance indicator)

**Charts:**
- Weekly consistency line chart (red accent)
- Category breakdown pie chart (multi-color)

### 3. Task Management Page
- Add new task form (title, category, planned time)
- Task list with checkboxes
- Visual indicators: Green for complete, Red/Yellow for incomplete
- Planned vs actual time tracking
- Delete functionality with smooth animations

### 4. Fitness Tracker Page (Optional)
**Stats Cards:**
- Calories Burned with gradient background
- Active Time tracking
- Completion Rate percentage
- Weekly Streak counter

**Workout Logging:**
- Exercise name, category, duration, calories
- Add/delete workouts with confirmation
- Visual status indicators

**Charts:**
- Weekly calorie burn bar chart
- Activity progress line chart

### 5. Diet Tracker Page (Optional)
**Calorie Overview:**
- Large calorie counter with progress bar
- Daily target comparison
- Color-coded status (red for over, green for on-track, yellow for under)

**Macro Stats (3 cards):**
- Protein tracking with progress bar
- Carbs tracking with progress bar
- Fats tracking with progress bar

**Meal Logging:**
- Meal name, type, macros, calories
- Time-stamped entries
- Meal-specific icons (coffee, utensils, apple, salad)

**Charts:**
- Weekly calorie intake bar chart
- Macro distribution pie chart

### 6. Analytics Page
**Trend Cards:**
- Average score with trend indicator
- Tasks completed with monthly comparison
- Hours logged with trend

**Charts:**
- Weekly/Monthly trends toggle
- Performance by time of day bar chart
- Activity heatmap (GitHub-style contribution grid)

**Key Insights:**
- Declining performance warnings
- Evening productivity issues
- Peak performance windows

### 7. Reports Page (MOST IMPORTANT)
**Overall Grade:**
- Large letter grade with gradient background (F for failure)
- Harsh feedback message

**"Where You Failed" Section:**
- List of incomplete tasks with planned vs actual time
- Critical issue callouts

**"Your Weak Patterns" Section:**
- Pattern identification (severity-coded)
- Reality check messages

**"What to Improve" Section:**
- Current vs target progress bars
- Priority labels (CRITICAL, URGENT, HIGH)
- Actionable items for next week

**Final Message:**
- Motivational (but harsh) closing statement

### 8. Settings Page
**Module Toggles:**
- Enable/disable Fitness Tracker
- Enable/disable Diet Tracker
- Visual toggle switches with smooth animations

**Account Settings:**
- Name and email display
- Password change option

**Notifications:**
- Daily reminder preferences

---

## Components

### Core Components
- **Button**: Primary, Secondary, Danger, Success, Ghost variants
- **Input**: With label and error state support
- **Card**: Container with border, padding, hover effects
- **Sidebar**: Collapsible navigation with active state indicators
- **Navbar**: Top bar with user profile and notifications

### Navigation
- Sidebar links: Dashboard, Tasks, Fitness, Diet, Analytics, Reports, Settings
- Smooth hover animations (slight translate-x on hover)
- Active state with background color and shadow
- Gradient logo icon

---

## User Experience Enhancements

### Attractiveness
✓ Gradient backgrounds on key elements
✓ Smooth hover transitions and shadow effects
✓ Color-coded status indicators (red/yellow/green)
✓ Visual progress bars for goals
✓ Icon-rich interface with Lucide React
✓ Rounded corners and modern spacing
✓ Backdrop blur effects on overlays

### User-Friendliness
✓ Clear visual hierarchy with card layouts
✓ Intuitive form inputs with labels
✓ Instant visual feedback on interactions
✓ Toggle switches for easy preference changes
✓ Color-coded severity levels (critical, high, medium)
✓ Chart tooltips for data clarity
✓ Responsive grid layouts

### Analytical Tone (Maintained)
✓ Harsh messaging for failures ("Failure. You need to do better.")
✓ Direct language ("Stop wasting your peak hours.")
✓ Accountability-focused ("The data doesn't lie.")
✓ No soft/playful language
✓ Strict grading system (F for failure)

---

## Technical Stack

- **Framework**: React 18.3.1 with TypeScript
- **Routing**: React Router 7 (Data Mode)
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **State**: React Hooks (useState for local state)

---

## Color Palette

```css
Background: #0a0a0a (pure black)
Card: #1a1a1a (dark gray)
Secondary: #2a2a2a (medium gray)
Foreground: #ffffff (white)
Border: #2a2a2a

Success: #22c55e (green)
Warning: #eab308 (yellow)
Destructive: #ef4444 (red)
Info: #3b82f6 (blue)
Purple: #8b5cf6 (streaks/special)
```

---

## Optional Modules

**Fitness and Diet trackers are optional features that:**
- Can be enabled/disabled in Settings
- Are hidden from navigation when disabled
- Do not affect core task tracking functionality
- Add comprehensive health tracking when enabled

---

## Key Design Principles

1. **Minimal but Powerful**: Clean interface with data-focused layouts
2. **Analytical & Honest**: Direct feedback with harsh accountability
3. **User Control**: Optional modules for personalized experience
4. **Visual Clarity**: Color-coded status, progress indicators, clear typography
5. **Professional**: Inspired by Notion, Linear, and Stripe dashboards
6. **Consistent Spacing**: 8px grid system with 4px, 8px, 16px, 24px increments

---

## Future Enhancements (Recommendations)

- Data persistence with backend integration
- Social accountability features
- Goal templates and presets
- Export/share report cards
- Mobile responsive optimization
- Dark/light mode toggle
- Notification system for reminders

---

## Version

**v2.0.0** - Enhanced Edition with Fitness & Diet Tracking

---

*"No excuses. No mercy. Just results."*
