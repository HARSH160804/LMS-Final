# Course Landing Page Demo Guide

## Quick Start

### 1. Start the Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 2. Navigate to a Course

Visit any course detail page:
```
http://localhost:5173/course/{courseId}
```

Replace `{courseId}` with an actual course ID from your database.

## Features to Test

### Desktop Experience (≥1024px)

#### Hero Section
- [ ] Category badge displays with gradient
- [ ] Course title is large and prominent
- [ ] Description is readable and well-spaced
- [ ] Course highlights show in 4-column grid
- [ ] Star rating and enrollment count visible

#### Sticky Pricing Card
- [ ] Card stays visible when scrolling
- [ ] Thumbnail image displays correctly
- [ ] Price is large and clear
- [ ] CTA button has gradient and hover effect
- [ ] Trust signals (checkmarks) are visible
- [ ] Share button is present

#### Content Sections
- [ ] "What You'll Learn" has gradient background
- [ ] Instructor card shows avatar and bio
- [ ] Curriculum accordion expands/collapses smoothly
- [ ] Lecture items show duration and preview badges
- [ ] "Show more" button appears if >5 lectures
- [ ] Requirements section displays clearly
- [ ] "Who this course is for" section visible

### Mobile Experience (<1024px)

- [ ] Single column layout
- [ ] Hero section stacks vertically
- [ ] Course highlights adapt to 2-column grid
- [ ] Fixed bottom bar appears with price and CTA
- [ ] Bottom bar stays visible when scrolling
- [ ] All sections are touch-friendly

### Interactions

#### Hover Effects
- [ ] CTA button scales and glows on hover
- [ ] Course thumbnail zooms slightly on hover
- [ ] Lecture items highlight on hover
- [ ] Share button changes color on hover

#### Click Actions
- [ ] CTA button shows loading state when clicked
- [ ] Accordion items expand/collapse smoothly
- [ ] "Show more" reveals additional lectures
- [ ] Share button is clickable (placeholder)

#### Animations
- [ ] Hero section fades in on load
- [ ] Sections animate in sequence (staggered)
- [ ] Accordion has smooth height transition
- [ ] Button press has scale effect

### Enrollment Flow

#### Not Logged In
1. Click "Start Learning Now"
2. Should redirect to login page
3. After login, should return to course page

#### Logged In - Free Course
1. Click "Start Learning Now"
2. Should show loading state
3. Should enroll and redirect to learning page
4. Button should change to "Continue Learning"

#### Logged In - Paid Course
1. Click "Start Learning Now"
2. Should show loading state
3. Should redirect to Stripe checkout
4. After payment, should enroll user

#### Already Enrolled
1. Button should show "Continue Learning"
2. Should have green gradient
3. Should navigate to learning page on click

## Visual Checklist

### Colors
- [ ] Indigo/purple gradients on CTAs
- [ ] Soft background gradients in hero
- [ ] Green checkmarks for trust signals
- [ ] Yellow stars for ratings
- [ ] Gray text hierarchy (900, 700, 600, 500)

### Typography
- [ ] Inter font loads correctly
- [ ] Headings are bold (700)
- [ ] Body text is readable (400/500)
- [ ] Font sizes are appropriate for hierarchy

### Spacing
- [ ] Generous padding in sections
- [ ] Consistent gaps between elements
- [ ] No cramped or cluttered areas
- [ ] Proper alignment throughout

### Shadows
- [ ] Cards have subtle shadows
- [ ] Hover increases shadow depth
- [ ] No harsh or excessive shadows

### Borders
- [ ] Rounded corners (16px) on cards
- [ ] Subtle borders on containers
- [ ] No sharp edges

## Browser Testing

Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Performance Testing

### Load Time
- [ ] Page loads in <2 seconds
- [ ] Images load progressively
- [ ] No layout shift during load

### Animations
- [ ] Smooth 60fps animations
- [ ] No janky scrolling
- [ ] Hover effects are instant

### Responsiveness
- [ ] Resize window smoothly
- [ ] No horizontal scroll
- [ ] Touch targets are adequate (44px min)

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus states are visible
- [ ] Enter/Space activates buttons
- [ ] Escape closes expanded items

### Screen Reader
- [ ] Headings are properly structured
- [ ] Images have alt text
- [ ] Buttons have descriptive labels
- [ ] ARIA labels where needed

### Color Contrast
- [ ] Text meets WCAG AA standards
- [ ] Links are distinguishable
- [ ] Disabled states are clear

## Common Issues & Solutions

### Issue: Tailwind classes not working
**Solution**: Ensure `tailwind.config.js` and `postcss.config.js` are in the frontend root, and Tailwind directives are in `index.css`.

### Issue: Framer Motion animations not working
**Solution**: Check that `framer-motion` is installed (`npm install framer-motion`).

### Issue: Sticky card not sticking
**Solution**: Ensure parent container has enough height and `position: relative`.

### Issue: Mobile bottom bar not showing
**Solution**: Check that viewport width is <1024px and `lg:hidden` class is applied.

### Issue: Images not loading
**Solution**: Verify image URLs are correct and accessible. Check CORS if loading from external sources.

### Issue: Accordion not expanding
**Solution**: Check that `AnimatePresence` is imported from Framer Motion and wrapping the expandable content.

## Customization Tips

### Change Colors
Edit `frontend/tailwind.config.js`:
```js
colors: {
  primary: {
    600: '#your-color',
    700: '#your-darker-color',
  }
}
```

### Adjust Animations
Edit component files and modify Framer Motion props:
```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

### Modify Trust Signals
Edit `PricingCard.jsx` and update the trust signals array.

### Change Learning Points
Edit `WhatYouLearn.jsx` and update the `learningPoints` array.

### Customize Requirements
Edit `CourseRequirements.jsx` and update the `requirements` and `targetAudience` arrays.

## Production Checklist

Before deploying:
- [ ] Test all enrollment flows
- [ ] Verify payment integration
- [ ] Check mobile responsiveness
- [ ] Test on slow connections
- [ ] Validate accessibility
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Enable caching
- [ ] Set up error tracking
- [ ] Configure analytics

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Ensure backend API is running
4. Check network requests in DevTools
5. Review component documentation in `frontend/src/components/course/README.md`

## Feedback

Track these metrics to improve:
- Enrollment conversion rate
- Time on page
- Scroll depth
- CTA click rate
- Mobile vs desktop performance
- User feedback/surveys

Happy testing! 🚀
