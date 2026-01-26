# Course Landing Page Components

Premium, high-conversion course landing page components built with React, Tailwind CSS, and Framer Motion.

## Components

### 1. **PricingCard**
Sticky pricing card with course thumbnail, price display, CTA button, and trust signals.

**Props:**
- `course` - Course object with price, thumbnail, etc.
- `status` - Enrollment status ('enrolled' or null)
- `onEnroll` - Function to handle enrollment
- `purchasing` - Boolean for loading state
- `courseId` - Course ID for navigation

**Features:**
- Gradient CTA button with hover effects
- Trust signals (lifetime access, money-back guarantee, etc.)
- Responsive design with mobile fixed bottom bar
- Smooth animations with Framer Motion

---

### 2. **CurriculumAccordion**
Interactive accordion for displaying course lectures with expand/collapse functionality.

**Props:**
- `lectures` - Array of lecture objects

**Features:**
- Expandable lecture items with descriptions
- Preview badges for free lectures
- Duration display
- "Show more" functionality for long lists
- Smooth expand/collapse animations

---

### 3. **InstructorCard**
Beautiful instructor profile card with avatar, bio, and trust indicators.

**Props:**
- `instructor` - Instructor object with name, avatar, bio

**Features:**
- Gradient avatar fallback
- Verified badge
- Stats display (students taught, courses created)
- Gradient background

---

### 4. **CourseHighlights**
Grid of course metadata highlights (level, duration, lectures, certificate).

**Props:**
- `level` - Course difficulty level
- `totalLectures` - Number of lectures
- `totalDuration` - Total course duration in seconds
- `enrolledStudents` - Number of enrolled students

**Features:**
- Icon-based display
- Responsive grid layout
- Hover effects
- Auto-formatting of duration

---

### 5. **WhatYouLearn**
Attractive section showcasing learning outcomes with checkmark icons.

**Props:**
- `description` - Course description (used to generate points)

**Features:**
- Two-column grid layout
- Gradient background
- Animated list items
- Checkmark icons

---

### 6. **CourseRequirements**
Displays course requirements and target audience in clean sections.

**Features:**
- Two separate sections (Requirements & Who this course is for)
- Icon-based lists
- Staggered animations

---

## Design System

### Colors
- Primary: Indigo (600-700)
- Secondary: Purple (600)
- Success: Green (500-600)
- Accent: Pink (50)

### Typography
- Font: Inter
- Headings: Bold (700)
- Body: Regular (400) / Medium (500)

### Spacing
- Consistent use of Tailwind spacing scale
- Generous padding (p-6, p-8)
- Gap utilities for flex/grid

### Animations
- Framer Motion for smooth transitions
- Hover effects on buttons and cards
- Staggered list animations
- Smooth accordion expand/collapse

### Shadows
- Soft shadows for depth
- Elevated cards with shadow-xl
- Hover shadow increases

## Usage Example

```jsx
import CourseDetail from './pages/CourseDetail';

// The CourseDetail page automatically uses all components
// Just navigate to /course/:id
```

## Mobile Responsiveness

- Desktop: Two-column layout with sticky pricing card
- Mobile: Single column with fixed bottom pricing bar
- Breakpoint: lg (1024px)

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
- Color contrast compliance

## Performance

- Lazy loading with React.lazy (if needed)
- Optimized animations with Framer Motion
- Image optimization with object-fit
- Minimal re-renders with proper state management
