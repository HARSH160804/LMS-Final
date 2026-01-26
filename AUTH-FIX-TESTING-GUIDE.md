# Authentication Fix - Testing Guide

## 🧪 How to Test the Fix

### Prerequisites
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:5173`
- Test accounts:
  - **Instructor**: Create one with role="instructor"
  - **Student**: Create one with role="student" (default)

---

## Test Case 1: Instructor Login (Primary Bug Fix)

### Steps:
1. **Clear browser data** (cookies, localStorage)
2. Navigate to `http://localhost:5173/login`
3. Login with **instructor credentials**
4. **Observe immediately after login**

### Expected Result: ✅
- ✅ Instructor dashboard renders **immediately**
- ✅ **No flash** of student view
- ✅ URL is `/instructor`
- ✅ Instructor navigation menu visible
- ✅ "Create Course" button visible

### Before Fix (Bug): ❌
- ❌ Student view flashed first
- ❌ Instructor view only after refresh
- ❌ URL might redirect incorrectly

---

## Test Case 2: Student Login

### Steps:
1. **Clear browser data**
2. Navigate to `http://localhost:5173/login`
3. Login with **student credentials**
4. **Observe immediately after login**

### Expected Result: ✅
- ✅ Student view renders immediately
- ✅ URL is `/` or `/my-courses`
- ✅ Student navigation menu visible
- ✅ No instructor options visible

---

## Test Case 3: Page Refresh (Instructor)

### Steps:
1. Login as **instructor**
2. Navigate to `/instructor`
3. **Hard refresh** the page (Cmd+Shift+R / Ctrl+Shift+R)
4. **Observe**

### Expected Result: ✅
- ✅ Loading spinner shows briefly
- ✅ Instructor dashboard renders
- ✅ No redirect to home
- ✅ Role persists correctly

---

## Test Case 4: Page Refresh (Student)

### Steps:
1. Login as **student**
2. Navigate to `/my-courses`
3. **Hard refresh** the page
4. **Observe**

### Expected Result: ✅
- ✅ Loading spinner shows briefly
- ✅ Student view renders
- ✅ No redirect
- ✅ Role persists correctly

---

## Test Case 5: Protected Route Access

### Steps:
1. Login as **student**
2. Manually navigate to `/instructor` in URL bar
3. **Observe**

### Expected Result: ✅
- ✅ Redirected to home page (`/`)
- ✅ No instructor view shown
- ✅ Access denied (correct behavior)

---

## Test Case 6: Logout and Re-login

### Steps:
1. Login as **instructor**
2. Verify instructor dashboard shows
3. Click **Logout**
4. Login again as **instructor**
5. **Observe**

### Expected Result: ✅
- ✅ Instructor dashboard shows immediately (no flash)
- ✅ Consistent behavior on re-login
- ✅ No cached incorrect state

---

## Test Case 7: Signup with Role

### Steps:
1. Navigate to `/signup`
2. Create account with:
   - Name: "Test Instructor"
   - Email: "test@instructor.com"
   - Password: "Test@1234"
   - **Role**: "instructor" (if form allows)
3. Submit form
4. **Observe**

### Expected Result: ✅
- ✅ Account created
- ✅ Automatically logged in
- ✅ Instructor dashboard shows immediately
- ✅ Role is set correctly

---

## Test Case 8: Loading State

### Steps:
1. **Clear browser data**
2. Navigate to `http://localhost:5173/instructor`
3. **Observe loading state**

### Expected Result: ✅
- ✅ Loading spinner shows
- ✅ "Loading..." text visible
- ✅ Clean, centered layout
- ✅ No content flash before redirect

---

## 🔍 What to Look For

### ✅ Success Indicators
- **No UI flash** - Correct view renders immediately
- **Spinner shows** - During auth check
- **Role-based navigation** - Correct menu items
- **URL correct** - No unexpected redirects
- **Consistent behavior** - Same on login and refresh

### ❌ Failure Indicators
- **UI flash** - Wrong view shows briefly
- **Blank screen** - No loading state
- **Wrong redirect** - Instructor → home
- **Missing role** - Navigation incorrect
- **Inconsistent** - Different on refresh

---

## 🐛 Debugging

### Check Browser Console
```javascript
// Should see user object with role
console.log('User:', user);
// Output: { _id: "...", name: "...", role: "instructor", ... }
```

### Check Network Tab
1. Open DevTools → Network
2. Login
3. Find `/api/v1/user/signin` request
4. Check **Response**:
   ```json
   {
     "success": true,
     "message": "Welcome back ...",
     "user": {
       "_id": "...",
       "name": "...",
       "email": "...",
       "role": "instructor",  ← Should be present
       "avatar": "...",
       ...
     }
   }
   ```

### Check Cookies
1. Open DevTools → Application → Cookies
2. Find `token` cookie
3. Should be `httpOnly`, `sameSite: strict`

---

## 📊 Test Results Template

```
Test Case 1: Instructor Login
Status: [ ] Pass [ ] Fail
Notes: _______________________

Test Case 2: Student Login
Status: [ ] Pass [ ] Fail
Notes: _______________________

Test Case 3: Page Refresh (Instructor)
Status: [ ] Pass [ ] Fail
Notes: _______________________

Test Case 4: Page Refresh (Student)
Status: [ ] Pass [ ] Fail
Notes: _______________________

Test Case 5: Protected Route Access
Status: [ ] Pass [ ] Fail
Notes: _______________________

Test Case 6: Logout and Re-login
Status: [ ] Pass [ ] Fail
Notes: _______________________

Test Case 7: Signup with Role
Status: [ ] Pass [ ] Fail
Notes: _______________________

Test Case 8: Loading State
Status: [ ] Pass [ ] Fail
Notes: _______________________
```

---

## 🚀 Quick Test Script

### Create Test Accounts (Backend)

```javascript
// Run in MongoDB or create via API
// Instructor account
{
  name: "Test Instructor",
  email: "instructor@test.com",
  password: "Test@1234",
  role: "instructor"
}

// Student account
{
  name: "Test Student",
  email: "student@test.com",
  password: "Test@1234",
  role: "student"
}
```

### Test Sequence
1. Clear browser data
2. Login as instructor
3. Verify dashboard shows immediately
4. Refresh page
5. Verify dashboard persists
6. Logout
7. Login as student
8. Verify student view
9. Try to access `/instructor`
10. Verify redirect to home

---

## ✅ Success Criteria

All test cases should **PASS** with:
- ✅ No UI flash on login
- ✅ Correct role-based view immediately
- ✅ Loading spinner during auth check
- ✅ Consistent behavior on refresh
- ✅ Protected routes work correctly
- ✅ Logout/re-login works

---

## 📝 Notes

- **Clear browser data** between tests for accurate results
- **Check network tab** to verify API responses
- **Use incognito mode** for clean testing
- **Test on different browsers** (Chrome, Firefox, Safari)
- **Test on mobile** if applicable

---

**The fix is complete and ready for testing!** 🎉

Run through these test cases to verify the authentication role hydration bug is fixed.
