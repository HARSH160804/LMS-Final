# Debug Fetch Utility - Quick Start Guide

## ⚠️ TEMPORARY DIAGNOSTIC TOOL

This utility helps diagnose "Failed to fetch" errors by testing raw fetch calls that bypass all API wrappers.

## Quick Start

### Option 1: Use the UI (Easiest)

1. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open the debug page:**
   ```
   http://localhost:5173/debug-fetch
   ```

3. **Click "Run All Tests"**

4. **Check results** on the page and in browser console (F12)

### Option 2: Use Browser Console

1. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open any page** (e.g., `http://localhost:5173`)

3. **Open browser console** (F12)

4. **Run tests:**
   ```javascript
   // Run all tests
   window.debugFetch.runAllTests()
   
   // Or individual tests
   window.debugFetch.testHealthCheck()
   window.debugFetch.testApiHealthCheck()
   window.debugFetch.testRawSignin("your@email.com", "yourpassword")
   window.debugFetch.testSigninWithCredentials("your@email.com", "yourpassword")
   window.debugFetch.testOptionsPreflight()
   ```

## What Each Test Does

| Test | What It Tests | Expected Result |
|------|---------------|-----------------|
| **Health Check** | Basic connectivity | 200 OK |
| **API Health** | /api/health endpoint | 200 OK |
| **OPTIONS Preflight** | CORS preflight | 200 OK |
| **Signin (No Credentials)** | POST without cookies | 200 or 401 |
| **Signin (With Credentials)** | POST with cookies | 200 with Set-Cookie |

## Interpreting Results

### ✅ All Tests Pass
**Problem:** Your API wrappers/interceptors are broken
**Next Step:** Check `frontend/src/services/api.js`

### ✅ Health passes, ❌ Signin fails
**Problem:** Backend signin logic or validation issue
**Next Step:** Check backend signin endpoint

### ❌ All Tests Fail
**Problem:** Network connectivity or backend not running
**Next Steps:**
1. Verify backend is running: `curl https://lms-final-5lj2.onrender.com/health`
2. Check browser network tab for errors
3. Check for browser extensions blocking requests

### ✅ No credentials works, ❌ With credentials fails
**Problem:** Cookie/credentials handling issue
**Next Step:** Check CORS credentials configuration

## Console Output Example

**Success:**
```
🔍 TEST 1: Raw Health Check (No Auth)
URL: https://lms-final-5lj2.onrender.com/health
✅ Response Status: 200
✅ Response OK: true
✅ HEALTH CHECK SUCCESS: {"status":"ok"}
```

**Failure:**
```
❌ HEALTH CHECK FAILED: TypeError: Failed to fetch
❌ Error Name: TypeError
❌ Error Message: Failed to fetch
```

## What This Bypasses

This utility completely bypasses:
- ❌ Axios
- ❌ API services
- ❌ Interceptors
- ❌ Custom headers
- ❌ Auth logic

Uses only:
- ✅ Native browser `fetch()`
- ✅ Minimal configuration
- ✅ Direct backend URL

## Testing on Production

To test against deployed frontend:

1. **Deploy frontend to Vercel** (with debug code)

2. **Open deployed URL** (e.g., `https://your-app.vercel.app`)

3. **Navigate to:** `https://your-app.vercel.app/debug-fetch`

4. **Run tests** and check results

5. **Or use console:** `window.debugFetch.runAllTests()`

## Cleanup

After debugging is complete, DELETE:
```bash
rm frontend/src/debug-fetch-test.js
rm frontend/src/pages/DebugFetch.jsx
rm FRONTEND-DEBUG-FETCH.md
rm DEBUG-FETCH-USAGE.md
```

And remove from:
- `frontend/src/App.jsx` - Remove debug route
- `frontend/src/main.jsx` - Remove debug import

Search for: `⚠️ TEMPORARY DEBUG`

## Common Issues

### "window.debugFetch is undefined"
**Solution:** Refresh the page after starting dev server

### Tests timeout
**Solution:** Check if backend is running and accessible

### CORS errors in console
**Solution:** Backend CORS may not be configured for your origin

### All tests return 500
**Solution:** Backend may have errors, check backend logs

## Need Help?

1. Check browser console for detailed error logs
2. Check browser Network tab for request details
3. Check backend logs on Render
4. Review `FRONTEND-DEBUG-FETCH.md` for detailed documentation

---

**Remember:** This is a temporary diagnostic tool. Delete after debugging!
