# Trust Proxy Configuration for Render Deployment

## Problem
When deploying Express applications to platforms like Render, Heroku, or behind any reverse proxy (like Nginx), the application doesn't directly receive client requests. Instead, requests pass through a proxy server first.

Without proper configuration, Express:
- Cannot detect HTTPS connections (always sees HTTP)
- Cannot set secure cookies properly
- Cannot get the real client IP address
- May fail CORS preflight checks

## Solution
Add `app.set("trust proxy", 1)` immediately after creating the Express app.

## What This Does

### 1. HTTPS Detection
```javascript
// Without trust proxy:
req.protocol // 'http' (even on HTTPS)

// With trust proxy:
req.protocol // 'https' (correctly detected from X-Forwarded-Proto header)
```

### 2. Secure Cookie Handling
```javascript
// Cookie settings in production:
{
  httpOnly: true,
  secure: true,      // Only works when req.protocol === 'https'
  sameSite: "none"   // Required for cross-origin cookies
}
```

Without trust proxy, `secure: true` cookies won't be set because Express thinks the connection is HTTP.

### 3. Client IP Detection
```javascript
// Without trust proxy:
req.ip // Proxy server IP

// With trust proxy:
req.ip // Real client IP from X-Forwarded-For header
```

## Implementation

### Location in Code
The trust proxy setting MUST be placed:
1. **After** creating the Express app: `const app = express()`
2. **Before** any middleware that depends on request properties (CORS, rate limiting, etc.)

### Code Added to `backend/index.js`
```javascript
const app = express();
const PORT = process.env.PORT || 8000;

// Trust proxy - Required for Render deployment
app.set("trust proxy", 1);

// CORS Configuration - MUST be first
app.use(cors({ ... }));
```

## Why "1"?
The value `1` means "trust the first proxy in front of the application."

Other valid values:
- `true` - Trust all proxies (less secure)
- `1` - Trust only the first proxy (recommended for Render)
- `2` - Trust the first two proxies
- `"loopback"` - Trust only localhost proxies

For Render, `1` is the correct value because there's exactly one proxy layer between the internet and your app.

## Security Considerations

### Safe on Render
Render's infrastructure ensures that X-Forwarded-* headers are set correctly and cannot be spoofed by clients.

### Unsafe in Development
In local development without a proxy, this setting is harmless but unnecessary. The app works fine either way.

### Critical for Production
Without this setting on Render:
- Authentication cookies won't work (secure cookies fail)
- CORS may fail for HTTPS requests
- Rate limiting may not work correctly
- Security headers may be misconfigured

## Testing

### Before Deployment
```bash
# Local development (works either way)
npm start
```

### After Deployment on Render
1. Check HTTPS detection:
   - Login should work
   - Cookies should be set with `Secure` flag

2. Check CORS:
   - Preflight OPTIONS requests should succeed
   - Cross-origin requests from Vercel should work

3. Check cookies in browser DevTools:
   - Should see `Secure` flag
   - Should see `SameSite=None`
   - Should see `HttpOnly` flag

## Related Files
- `backend/index.js` - Trust proxy configuration
- `backend/utils/generateToken.js` - Cookie settings (secure: true in production)
- `backend/controllers/user.controller.js` - Cookie clearing with same settings
- `CORS-PREFLIGHT-FIX.md` - CORS and OPTIONS handling
- `CORS-AUTH-FIX-SUMMARY.md` - Cookie and CORS configuration

## References
- [Express behind proxies](https://expressjs.com/en/guide/behind-proxies.html)
- [Render deployment guide](https://render.com/docs/deploy-node-express-app)
- [MDN: Set-Cookie Secure attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#secure)
