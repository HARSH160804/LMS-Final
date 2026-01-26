# Frontend Integration Guide

Essential information for integrating with this backend API.

---

## Base Configuration

```javascript
const API_BASE = 'http://localhost:8000/api/v1';

// Required for all requests to handle cookies
const fetchConfig = {
  credentials: 'include',  // Required for cookie auth
  headers: {
    'Content-Type': 'application/json'
  }
};
```

---

## Required Headers

| Scenario | Headers Required |
|----------|------------------|
| JSON requests | `Content-Type: application/json` |
| File uploads | `Content-Type: multipart/form-data` (set automatically by FormData) |
| All requests | `credentials: 'include'` in fetch options |

> **Critical:** Without `credentials: 'include'`, cookies won't be sent/received and auth will fail.

---

## Authentication Lifecycle

### 1. Signup / Signin

```javascript
// Login - cookie is automatically set by response
const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/user/signin`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};
```

### 2. Check Auth Status

No dedicated endpoint. Use profile endpoint:

```javascript
const checkAuth = async () => {
  const res = await fetch(`${API_BASE}/user/profile`, {
    credentials: 'include'
  });
  if (res.status === 401) return null;  // Not logged in
  return res.json();
};
```

### 3. Logout

```javascript
const logout = async () => {
  await fetch(`${API_BASE}/user/signout`, {
    method: 'POST',
    credentials: 'include'
  });
  // Clear any local state
};
```

### 4. Session Duration

| Property | Value |
|----------|-------|
| Token expiry | **24 hours** |
| Refresh token | ❌ Not implemented |
| Action on expiry | Re-login required |

---

## Pagination Pattern

Used only on `GET /api/v1/course/published`

**Request:**
```javascript
const getCourses = async (page = 1, limit = 10) => {
  const res = await fetch(
    `${API_BASE}/course/published?page=${page}&limit=${limit}`,
    { credentials: 'include' }
  );
  return res.json();
};
```

**Response structure:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## Filtering Pattern

Used on `GET /api/v1/course/search`

| Param | Type | Example |
|-------|------|---------|
| `query` | string | `"react"` |
| `categories` | array | `["Web Development"]` |
| `level` | enum | `"beginner"` \| `"intermediate"` \| `"advanced"` |
| `priceRange` | string | `"0-500"` |
| `sortBy` | enum | `"newest"` \| `"oldest"` \| `"price-low"` \| `"price-high"` |

**Request:**
```javascript
const searchCourses = async (filters) => {
  const params = new URLSearchParams();
  if (filters.query) params.set('query', filters.query);
  if (filters.level) params.set('level', filters.level);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  // For arrays, append each value
  filters.categories?.forEach(c => params.append('categories', c));
  
  const res = await fetch(`${API_BASE}/course/search?${params}`);
  return res.json();
};
```

---

## Rate Limiting

| Property | Value |
|----------|-------|
| Window | 15 minutes |
| Max requests | 100 per IP |
| Applies to | All `/api/*` routes |

**When exceeded:**
```json
{ "message": "Too many requests from this IP, please try again later." }
```

**Handle with:**
```javascript
if (res.status === 429) {
  // Show rate limit message, disable submit button temporarily
}
```

---

## Error Handling Conventions

### Response Structure

**Success:**
```json
{
  "success": true,
  "message": "Optional success message",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Human-readable error message"
}
```

### Status Code Reference

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| 200 | Success | Process data |
| 201 | Created | Process data, maybe redirect |
| 400 | Bad request / validation | Show error message to user |
| 401 | Not authenticated | Redirect to login |
| 403 | Forbidden (wrong role) | Show "access denied" |
| 404 | Not found | Show "not found" message |
| 429 | Rate limited | Show retry message |
| 500 | Server error | Show generic error |

### Recommended Error Handler

```javascript
const handleResponse = async (res) => {
  const data = await res.json();
  
  if (res.ok) return data;
  
  switch (res.status) {
    case 401:
      // Clear auth state, redirect to login
      window.location.href = '/login';
      break;
    case 403:
      throw new Error('You do not have permission');
    case 429:
      throw new Error('Too many requests. Please wait.');
    default:
      throw new Error(data.message || 'Something went wrong');
  }
};
```

---

## File Uploads

### Avatar / Thumbnail / Video

Use `FormData`, **not** JSON:

```javascript
const uploadCourse = async (courseData, thumbnailFile) => {
  const formData = new FormData();
  formData.append('title', courseData.title);
  formData.append('category', courseData.category);
  formData.append('price', courseData.price);
  formData.append('thumbnail', thumbnailFile);  // File object
  
  const res = await fetch(`${API_BASE}/course`, {
    method: 'POST',
    credentials: 'include',
    // Do NOT set Content-Type header - browser sets it with boundary
    body: formData
  });
  return res.json();
};
```

### File Size Limits

| Type | Limit |
|------|-------|
| JSON body | 10 KB |
| File upload | Handled by Cloudinary (check env) |

---

## CORS Configuration

Backend allows:
- **Origin:** `http://localhost:5173` (or `CLIENT_URL` env)
- **Methods:** GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- **Credentials:** Yes

If on different port, update backend's `CLIENT_URL` or you'll get CORS errors.

---

## Common Pitfalls

| Issue | Cause | Fix |
|-------|-------|-----|
| 401 on every request | Missing `credentials: 'include'` | Add to all fetch calls |
| CORS error | Frontend on wrong port | Match `CLIENT_URL` in backend env |
| Cookie not set | `sameSite: strict` + different origin | Use same origin or proxy |
| File upload fails | Setting `Content-Type: application/json` | Don't set header for FormData |
| Search returns empty | Categories sent as string | Send as array (multiple params) |

---

## Quick Reference: API Fetch Templates

```javascript
// GET (public)
fetch(`${API_BASE}/course/published`)

// GET (protected)
fetch(`${API_BASE}/user/profile`, { credentials: 'include' })

// POST (JSON)
fetch(`${API_BASE}/user/signin`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})

// POST (file upload)
fetch(`${API_BASE}/course`, {
  method: 'POST',
  credentials: 'include',
  body: formData  // FormData object
})

// PATCH
fetch(`${API_BASE}/progress/${courseId}/lectures/${lectureId}`, {
  method: 'PATCH',
  credentials: 'include'
})

// DELETE
fetch(`${API_BASE}/user/account`, {
  method: 'DELETE',
  credentials: 'include'
})
```
