# Deployment Guide (Vercel)

This frontend is configured for seamless deployment on [Vercel](https://vercel.com).

## Prerequisites

1.  **Backend Deployed**: Ensure your backend is running and accessible via HTTPS.
2.  **CORS Configured**: Your backend must allow requests from your Vercel domain.

## Steps

1.  **Push to GitHub**: Commit your code to a repository.
2.  **Import to Vercel**:
    *   Go to Vercel Dashboard → Add New Project.
    *   Select your repository.
    *   Set **Root Directory** to `frontend`.
    *   **Framework Preset**: Vite (should auto-detect).
    *   **Build Command**: `npm run build` (default).
    *   **Output Directory**: `dist` (default).

3.  **Environment Variables**:
    Add the following environment variable in Vercel project settings:

    | Name | Value | Description |
    |------|-------|-------------|
    | `VITE_BACKEND_URL` | `https://your-backend-url.com` | Base URL of your backend. |

4.  **Deploy**: Click Deploy.

## Verification

*   Visit your Vercel URL.
*   Check the Network tab to ensure API calls are going to `your-backend-url.com/api/v1/...`.
*   Ensure reloading a page (e.g., `/login`) works (handled by `vercel.json`).
