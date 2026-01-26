# Frontend Debug Fetch Utility

## ⚠️ TEMPORARY DIAGNOSTIC TOOL - DELETE AFTER DEBUGGING

## Purpose

This utility isolates frontend fetch issues by bypassing all existing API wrappers, interceptors, and services to test raw browser fetch capabilities against the backend.

## Problem Being Diagnosed

Backend is verified working:
- ✅ CORS configured correctly
- ✅ OPTIONS preflight returns 200
- ✅ API endpoints reachable via curl

But browser requests fail with:
- ❌ Chrome: "Failed to fetch"
- ❌ Safari: "Load failed"

This indicates a **frontend runtime issue**, not a backend problem.

## What This Tool Does

Tests raw `fetch()` calls that:
- Do NOT use axios
- Do NOT use existing API services
- Do NOT use interceptors
- Do NOT include credentials (initially)
- Do NOT include custom headers (initially)

This isolates whether the issue is in:
1. Browser networking
2. API wrapper/interceptor logic
3. Credentials handling
4. CORS configuration

## Files Created

### 1. `frontend/src/debug-fetch-test.js`
Core utility with 5 test functions:
- `testHealthCheck()` - GET /health (no auth, no credentials)
- `testApiHealthCheck()` - GET /api/health (no auth, no credentials)
- `testRawSignin()` - POST /api/v1/user/signin (no credentials)
- `testSigninWithCredentials()` - POST /api/v1/user/signin (with credentials)
- `testOptionsPreflight()` - OPTIONS /api/v1/user/signin
- `runAllTests()` - Runs all tests sequentially

### 2. `frontend/src/pages/DebugFetch.jsx`
UI page for running tests with visual results display.

### 3. Modified Files
- `frontend/src/App.jsx` - Added `/debug-fetch` route
- `frontend/src/main.jsx` - Imported debug utility for console access

## How to Use

### Method 1: UI Page (Recommended)

1. Start the frontend dev server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/debug-fetch`

3. Click "Run All Tests" or individual test buttons

4. View results on page and in browser console

### Method 2: Browser Console

1. Open browser console (F12)

2. Run tests directly:
   ```javascript
   // Run all tests
   window.debugFetch.runAllTests()
   
   // Or individual tests
   window.debugFetch.testHealthCheck()
   window.debugFetch.testApiHealthCheck()
   window.debugFetch.testRawSignin("test@test.com", "password")
   window.debugFetch.testSigninWithCredentials("test@test.com", "password")
   window.debugFetch.testOptionsPreflight()
   ```

3. Check console output for detailed logs

## Test Descriptions

### Test 1: Health Check (No Auth)
```javascript
fetch("https://lms-final-5lj2.onrender.com/health", {
  method: "GET"
})
```
**Tests:** Basic connectivity to backend
**Expected:** 200 OK with `{"status":"ok"}`

### Test 2: API Health Check (No Auth)
```javascript
fetch("https://lms-final-5lj2.onrender.com/api/health", {
  method: "GET"
})
```
**Tests:** API endpoint connectivity
**Expected:** 200 OK with `{"status":"ok"}`

### Test 3: Raw Signin (No Credentials)
```javascript
fetch("https://lms-final-5lj2.onrender.com/api/v1/user/signin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
})
```
**Tests:** POST request without credentials
**Expected:** 200 OK or 401 (depending on credentials)

### Test 4: Signin with Credentials
```javascript
fetch("https://lms-final-5lj2.onrender.com/api/v1/user/signin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ email, password })
})
```
**Tests:** POST request with credentials for cookie handling
**Expected:** 200 OK with Set-Cookie header

### Test 5: OPTIONS Preflight
```javascript
fetch("https://lms-final-5lj2.onrender.com/api/v1/user/signin", {
  method: "OPTIONS",
  headers: {
    "Origin": window.location.origin,
    "Access-Control-Request-Method": "POST"
  }
})
```
**Tests:** CORS preflight request
**Expected:** 200 OK with CORS headers

## Interpreting Results

### Scenario 1: All Tests Pass ✅
**Diagnosis:** API wrappers/interceptors are broken
**Solution:** Check `frontend/src/services/api.js` and axios configuration

### Scenario 2: Health Passes, Signin Fails
**Diagnosis:** Signin controller logic issue or validation error
**Solution:** Check backend signin endpoint and validation

### Scenario 3: All Tests Fail ❌
**Diagnosis:** Frontend build or browser networking issue
**Solution:** 
- Check if backend URL is correct
- Check browser network tab for errors
- Check if backend is actually running
- Check for browser extensions blocking requests

### Scenario 4: OPTIONS Fails
**Diagnosis:** CORS preflight issue
**Solution:** Check backend CORS configuration and OPTIONS handler

### Scenario 5: No Credentials Works, With Credentials Fails
**Diagnosis:** Cookie/credentials handling issue
**Solution:** Check CORS credentials configuration and cookie settings

## Console Output

Each test logs detailed information:
```
🔍 TEST 1: Raw Health Check (No Auth)
URL: https://lms-final-5lj2.onrender.com/health
✅ Response Status: 200
✅ Response OK: true
✅ Response Headers: {...}
✅ HEALTH CHECK SUCCESS: {"status":"ok"}
```

Or on failure:
```
❌ HEALTH CHECK FAILED: TypeError: Failed to fetch
❌ Error Name: TypeError
❌ Error Message: Failed to fetch
❌ Error Stack: ...
```

## What This Bypasses

This utility completely bypasses:
- ❌ `frontend/src/services/api.js` - Axios instance
- ❌ `frontend/src/services/auth.service.js` - Auth service
- ❌ `frontend/src/services/course.service.js` - Course service
- ❌ All axios interceptors
- ❌ All custom headers (except Content-Type)
- ❌ All authentication logic
- ❌ All error handling wrappers

Uses only:
- ✅ Native browser `fetch()` API
- ✅ Minimal headers
- ✅ Direct URL (hardcoded backend URL)

## Cleanup After Debugging

Once the issue is identified and fixed, DELETE these files:

```bash
# Delete debug files
rm frontend/src/debug-fetch-test.js
rm frontend/src/pages/DebugFetch.jsx
rm FRONTEND-DEBUG-FETCH.md

# Remove debug route from App.jsx
# Remove debug import from main.jsx
```

Search for comments:
```
⚠️ TEMPORARY DEBUG
```

## Security Note

This utility:
- Hardcodes the backend URL (not using environment variables)
- Logs sensitive information to console
- Exposes test functions globally on window object
- Should NEVER be deployed to production

## Related Documentation

- `OPTIONS-PREFLIGHT-SHORT-CIRCUIT.md` - Backend OPTIONS handling
- `CORS-AUTH-FIX-SUMMARY.md` - CORS and cookie configuration
- `FRONTEND-API-VERIFICATION.md` - Frontend API setup
- `TRUST-PROXY-FIX.md` - Backend proxy configuration

---

**Status**: ⚠️ Temporary diagnostic tool
**Purpose**: Isolate frontend fetch issues
**Action Required**: DELETE after debugging complete
