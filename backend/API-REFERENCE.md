# API Reference for Frontend Developers

**Base URL:** `http://localhost:8000` (or production URL)  
**Content-Type:** `application/json` (unless uploading files)  
**Auth Method:** JWT token stored in `httpOnly` cookie named `token`

---

## Authentication APIs

### POST `/api/v1/user/signup`
Create a new user account.

| Property | Value |
|----------|-------|
| Auth Required | ❌ No |

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "student"  // optional, defaults to "student"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "avatar": "default-avatar.png",
    "enrolledCourses": [],
    "createdCourses": [],
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```
*Also sets `token` cookie*

**Error Cases:**
| Status | Condition |
|--------|-----------|
| 400 | User already exists with this email |
| 400 | Validation failed (name 2-50 chars, valid email, password 8+ chars with uppercase, lowercase, number, special char) |

---

### POST `/api/v1/user/signin`
Authenticate and get session cookie.

| Property | Value |
|----------|-------|
| Auth Required | ❌ No |

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Welcome back John Doe",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```
*Also sets `token` cookie (1 day expiry)*

**Error Cases:**
| Status | Condition |
|--------|-----------|
| 401 | Invalid email or password |
| 400 | Validation failed |

---

### POST `/api/v1/user/signout`
Clear authentication cookie.

| Property | Value |
|----------|-------|
| Auth Required | ❌ No |

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

---

### GET `/api/v1/user/profile`
Get current user's profile with enrolled and created courses.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "instructor",
    "avatar": "https://cloudinary.com/avatar.jpg",
    "bio": "Backend developer",
    "enrolledCourses": [
      {
        "course": {
          "_id": "courseId",
          "title": "React Masterclass",
          "description": "Learn React",
          "thumbnail": "https://..."
        },
        "enrolledAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "createdCourses": [
      {
        "_id": "courseId",
        "title": "Node.js Basics",
        "thumbnail": "https://...",
        "enrolledStudents": ["userId1", "userId2"]
      }
    ],
    "totalEnrolledCourses": 1,
    "lastActive": "2024-01-20T10:00:00.000Z"
  }
}
```

**Error Cases:**
| Status | Condition |
|--------|-----------|
| 401 | Not logged in or token expired |
| 404 | User not found |

---

### PATCH `/api/v1/user/profile`
Update user profile (supports avatar upload).

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |
| Content-Type | `multipart/form-data` (if uploading avatar) |

**Request Body (form-data):**
| Field | Type | Required |
|-------|------|----------|
| name | string | ❌ |
| email | string | ❌ |
| bio | string | ❌ |
| avatar | file (image) | ❌ |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john@example.com",
    "avatar": "https://cloudinary.com/new-avatar.jpg",
    "bio": "Updated bio"
  }
}
```

**Error Cases:**
| Status | Condition |
|--------|-----------|
| 401 | Not authenticated |
| 404 | User not found |

---

### PATCH `/api/v1/user/change-password`
Change user password.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |

**Request Body:**
```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Cases:**
| Status | Condition |
|--------|-----------|
| 401 | Current password is incorrect |
| 400 | New password same as current, or doesn't meet requirements |
| 404 | User not found |

---

### DELETE `/api/v1/user/account`
Delete user account permanently.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```
*Also clears `token` cookie*

---

## Course APIs

### GET `/api/v1/course/published`
Get all published courses (paginated).

| Property | Value |
|----------|-------|
| Auth Required | ❌ No |

**Query Parameters:**
| Param | Type | Default |
|-------|------|---------|
| page | number | 1 |
| limit | number | 10 |

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "courseId",
      "title": "React Masterclass",
      "subtitle": "Build modern apps",
      "description": "Full course description",
      "category": "Web Development",
      "level": "intermediate",
      "price": 999,
      "thumbnail": "https://cloudinary.com/thumb.jpg",
      "instructor": {
        "_id": "userId",
        "name": "Jane Instructor",
        "avatar": "https://..."
      },
      "totalLectures": 25,
      "totalDuration": 3600,
      "isPublished": true,
      "createdAt": "2024-01-10T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### GET `/api/v1/course/search`
Search courses with filters.

| Property | Value |
|----------|-------|
| Auth Required | ❌ No |

**Query Parameters:**
| Param | Type | Example |
|-------|------|---------|
| query | string | "react" |
| categories | array | ["Web Development", "Mobile"] |
| level | string | "beginner" \| "intermediate" \| "advanced" |
| priceRange | string | "0-500" or "500-1000" |
| sortBy | string | "newest" \| "oldest" \| "price-low" \| "price-high" |

**Success Response (200):**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "courseId",
      "title": "React Basics",
      "subtitle": "...",
      "category": "Web Development",
      "level": "beginner",
      "price": 499,
      "thumbnail": "https://...",
      "instructor": {
        "_id": "userId",
        "name": "Instructor Name",
        "avatar": "https://..."
      }
    }
  ]
}
```

---

### POST `/api/v1/course`
Create a new course (instructor only).

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |
| Role Required | `instructor` |
| Content-Type | `multipart/form-data` |

**Request Body (form-data):**
| Field | Type | Required |
|-------|------|----------|
| title | string | ✅ |
| subtitle | string | ❌ |
| description | string | ❌ |
| category | string | ✅ |
| level | string | ❌ (default: "beginner") |
| price | number | ✅ |
| thumbnail | file (image) | ✅ |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "_id": "newCourseId",
    "title": "My New Course",
    "subtitle": "Learn something new",
    "category": "Programming",
    "level": "beginner",
    "price": 799,
    "thumbnail": "https://cloudinary.com/thumb.jpg",
    "instructor": "userId",
    "isPublished": false,
    "lectures": [],
    "enrolledStudents": []
  }
}
```

**Error Cases:**
| Status | Condition |
|--------|-----------|
| 400 | Thumbnail not provided |
| 403 | User is not an instructor |

---

### GET `/api/v1/course`
Get courses created by current instructor.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |
| Role Required | `instructor` |

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "courseId",
      "title": "My Course",
      "isPublished": true,
      "price": 999,
      "enrolledStudents": [
        { "_id": "userId", "name": "Student 1", "avatar": "..." }
      ]
    }
  ]
}
```

---

### GET `/api/v1/course/c/:courseId`
Get course details by ID.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |

**URL Parameters:**
| Param | Type |
|-------|------|
| courseId | MongoDB ObjectId |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "courseId",
    "title": "React Masterclass",
    "subtitle": "Build modern apps",
    "description": "Full description here",
    "category": "Web Development",
    "level": "intermediate",
    "price": 999,
    "thumbnail": "https://...",
    "instructor": {
      "_id": "userId",
      "name": "Jane Instructor",
      "avatar": "https://...",
      "bio": "Senior Developer"
    },
    "lectures": [
      {
        "_id": "lectureId",
        "title": "Introduction",
        "videoUrl": "https://cloudinary.com/video.mp4",
        "duration": 600,
        "isPreview": true,
        "order": 1
      }
    ],
    "totalLectures": 25,
    "totalDuration": 36000,
    "averageRating": 0,
    "isPublished": true
  }
}
```

**Error Cases:**
| Status | Condition |
|--------|-----------|
| 404 | Course not found |

---

### PATCH `/api/v1/course/c/:courseId`
Update course details (instructor only, must be owner).

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |
| Role Required | `instructor` (owner) |
| Content-Type | `multipart/form-data` (if updating thumbnail) |

**Request Body (form-data):**
| Field | Type | Required |
|-------|------|----------|
| title | string | ❌ |
| subtitle | string | ❌ |
| description | string | ❌ |
| category | string | ❌ |
| level | string | ❌ |
| price | number | ❌ |
| thumbnail | file | ❌ |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": { /* updated course object */ }
}
```

**Error Cases:**
| Status | Condition |
|--------|-----------|
| 403 | Not authorized (not the course owner) |
| 404 | Course not found |

---

### GET `/api/v1/course/c/:courseId/lectures`
Get lectures for a course.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |

> **Note:** Non-enrolled users only receive lectures where `isPreview: true`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "lectures": [
      {
        "_id": "lectureId",
        "title": "Getting Started",
        "description": "Introduction to the course",
        "videoUrl": "https://cloudinary.com/video.mp4",
        "duration": 300,
        "isPreview": true,
        "order": 1
      }
    ],
    "isEnrolled": false,
    "isInstructor": false
  }
}
```

---

### POST `/api/v1/course/c/:courseId/lectures`
Add a lecture to a course (instructor only).

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |
| Role Required | `instructor` (owner) |
| Content-Type | `multipart/form-data` |

**Request Body (form-data):**
| Field | Type | Required |
|-------|------|----------|
| title | string | ✅ |
| description | string | ❌ |
| isPreview | boolean | ❌ (default: false) |
| video | file (video) | ✅ |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Lecture added successfully",
  "data": {
    "_id": "lectureId",
    "title": "New Lecture",
    "description": "Lecture description",
    "videoUrl": "https://cloudinary.com/video.mp4",
    "publicId": "cloudinary_public_id",
    "duration": 1200,
    "isPreview": false,
    "order": 5
  }
}
```

**Error Cases:**
| Status | Condition |
|--------|-----------|
| 400 | Video file not provided |
| 403 | Not authorized |
| 404 | Course not found |
| 500 | Error uploading video |

---

## Purchase APIs

### POST `/api/v1/purchase/checkout/create-checkout-session`
Create Stripe checkout session.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |

**Request Body:**
```json
{
  "courseId": "507f1f77bcf86cd799439011"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/pay/cs_test_..."
  }
}
```
*Redirect user to `checkoutUrl` to complete payment*

**Error Cases:**
| Status | Condition |
|--------|-----------|
| 400 | Failed to create checkout session |
| 404 | Course not found |

---

### POST `/api/v1/purchase/webhook`
Stripe webhook endpoint (called by Stripe, not frontend).

| Property | Value |
|----------|-------|
| Auth Required | ❌ No (uses Stripe signature) |
| Content-Type | `application/json` (raw) |

> **Note:** This is called by Stripe after payment. Frontend should poll purchase status or use success URL redirect.

---

### GET `/api/v1/purchase/course/:courseId/detail-with-status`
Get course details with purchase status.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "course": {
      "_id": "courseId",
      "title": "React Masterclass",
      "lectures": [...]
    },
    "isPurchased": true
  }
}
```

---

### GET `/api/v1/purchase`
Get all courses purchased by current user.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "courseId",
      "title": "React Masterclass",
      "thumbnail": "https://...",
      "description": "...",
      "category": "Web Development"
    }
  ]
}
```

---

## Razorpay Payment APIs

### POST `/api/v1/razorpay/create-order`
Create Razorpay payment order.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |

**Request Body:**
```json
{
  "courseId": "507f1f77bcf86cd799439011"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "order": {
    "id": "order_ABC123",
    "amount": 99900,
    "currency": "INR",
    "receipt": "course_507f1f77bcf86cd799439011"
  },
  "course": {
    "name": "React Masterclass",
    "description": "Learn React from scratch",
    "image": "https://cloudinary.com/thumb.jpg"
  }
}
```

**Error Cases:**
| Status | Condition |
|--------|-----------|
| 404 | Course not found |
| 500 | Error creating payment order |

---

### POST `/api/v1/razorpay/verify-payment`
Verify Razorpay payment signature.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |

**Request Body:**
```json
{
  "razorpay_order_id": "order_ABC123",
  "razorpay_payment_id": "pay_XYZ789",
  "razorpay_signature": "signature_hash_here"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "courseId": "507f1f77bcf86cd799439011"
}
```

**Error Cases:**
| Status | Condition |
|--------|-----------|
| 400 | Payment verification failed (invalid signature) |
| 404 | Purchase record not found |
| 500 | Error verifying payment |

---

## Progress APIs

### GET `/api/v1/progress/:courseId`
Get user's progress for a specific course.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "courseDetails": {
      "_id": "courseId",
      "title": "React Masterclass",
      "thumbnail": "https://...",
      "lectures": [...]
    },
    "progress": [
      {
        "lecture": "lectureId",
        "isCompleted": true,
        "watchTime": 580,
        "lastWatched": "2024-01-20T10:00:00.000Z"
      }
    ],
    "isCompleted": false,
    "completionPercentage": 40
  }
}
```

---

### PATCH `/api/v1/progress/:courseId/lectures/:lectureId`
Mark a lecture as completed.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |

**Request Body:** None (or empty `{}`)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Lecture progress updated successfully",
  "data": {
    "lectureProgress": [
      { "lecture": "lectureId", "isCompleted": true }
    ],
    "isCompleted": false
  }
}
```

---

### PATCH `/api/v1/progress/:courseId/complete`
Mark entire course as completed.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Course marked as completed",
  "data": {
    "isCompleted": true,
    "completionPercentage": 100,
    "lectureProgress": [...]
  }
}
```

**Error Cases:**
| Status | Condition |
|--------|-----------|
| 404 | Course progress not found (user hasn't started) |

---

### PATCH `/api/v1/progress/:courseId/reset`
Reset all progress for a course.

| Property | Value |
|----------|-------|
| Auth Required | ✅ Yes |

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Course progress reset successfully",
  "data": {
    "isCompleted": false,
    "completionPercentage": 0,
    "lectureProgress": [...]
  }
}
```

---

## Media API

### POST `/api/v1/media/upload-video`
Upload a video file to Cloudinary.

| Property | Value |
|----------|-------|
| Auth Required | ❌ No |
| Content-Type | `multipart/form-data` |

**Request Body (form-data):**
| Field | Type | Required |
|-------|------|----------|
| file | file (video) | ✅ |

**Success Response (200):**
```json
{
  "success": true,
  "message": "File uploaded successfully.",
  "data": {
    "public_id": "video_abc123",
    "secure_url": "https://res.cloudinary.com/xxx/video/upload/v123/video_abc123.mp4",
    "duration": 120.5,
    "format": "mp4",
    "resource_type": "video"
  }
}
```

**Error Cases:**
| Status | Condition |
|--------|-----------|
| 500 | Error uploading file |

---

## Health Check API

### GET `/health`
Get server and database health status.

| Property | Value |
|----------|-------|
| Auth Required | ❌ No |

**Success Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-20T10:00:00.000Z",
  "services": {
    "database": {
      "status": "healthy",
      "details": {
        "isConnected": true,
        "readyState": 1,
        "readyStateText": "connected",
        "host": "cluster0.mongodb.net",
        "name": "lms_database"
      }
    },
    "server": {
      "status": "healthy",
      "uptime": 3600,
      "memoryUsage": {
        "heapTotal": 50000000,
        "heapUsed": 30000000
      }
    }
  }
}
```

**Unhealthy Response (503):**
```json
{
  "status": "OK",
  "services": {
    "database": {
      "status": "unhealthy",
      "details": { "isConnected": false }
    }
  }
}
```

---

## Common Error Responses

All errors follow this structure:

```json
{
  "status": "error",
  "message": "Error description here"
}
```

**Development mode also includes:**
```json
{
  "status": "error",
  "message": "Error description",
  "stack": "Error stack trace..."
}
```

### Global Error Codes
| Status | Meaning |
|--------|---------|
| 400 | Bad Request / Validation failed |
| 401 | Not authenticated / Token expired |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 429 | Too many requests (rate limited) |
| 500 | Internal server error |

---

## Rate Limiting

| Limit | Value |
|-------|-------|
| Window | 15 minutes |
| Max Requests | 100 per IP |

When exceeded:
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```
