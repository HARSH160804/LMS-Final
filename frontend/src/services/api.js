/**
 * API Service - Centralized API communication
 * 
 * Configuration:
 * - Uses VITE_BACKEND_URL environment variable for backend URL
 * - Fallback to http://localhost:8000 for local development
 * - All requests include credentials (cookies) for authentication
 * 
 * Production Setup:
 * - Set VITE_BACKEND_URL in Vercel environment variables
 * - Example: VITE_BACKEND_URL=https://your-backend.onrender.com
 */

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const BASE_URL = `${API_URL}/api/v1`;

// Debug: Log the configuration (only in development)
if (import.meta.env.DEV) {
    console.log('🔧 API Configuration:', {
        VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
        API_URL,
        BASE_URL
    });
}

// Validate that API_URL is properly set
if (!API_URL || API_URL === 'undefined' || API_URL === 'null') {
    console.error('❌ VITE_BACKEND_URL is not set! API calls will fail.');
    console.error('Please set VITE_BACKEND_URL in your environment variables.');
}

const api = {
    /**
     * Generic request handler - Browser-safe, non-throwing
     * Always returns: { ok: boolean, status: number, data: any }
     */
    request: async (endpoint, options = {}) => {
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        const config = {
            ...options,
            headers: { ...defaultHeaders, ...options.headers },
            credentials: 'include', // Important: Send cookies with request
        };

        // Handle multipart/form-data: remove Content-Type to let browser set boundary
        if (options.body instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        try {
            const fullURL = `${BASE_URL}${endpoint}`;
            
            // Debug: Log request in development
            if (import.meta.env.DEV) {
                console.log('🌐 API Request:', {
                    method: config.method || 'GET',
                    url: fullURL,
                    hasCredentials: config.credentials === 'include'
                });
            }
            
            const response = await fetch(fullURL, config);
            
            // Parse JSON response
            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                // If JSON parsing fails, return text or empty object
                data = {
                    message: 'Invalid JSON response from server',
                    status: response.status
                };
            }

            // Debug: Log response in development
            if (import.meta.env.DEV) {
                console.log('📥 API Response:', {
                    status: response.status,
                    ok: response.ok,
                    data
                });
            }

            // Always return structured response (never throw)
            return {
                ok: response.ok,
                status: response.status,
                data
            };

        } catch (error) {
            // CRITICAL: Always log error but NEVER return console.error()
            // console.error() returns undefined which breaks calling code
            console.error('❌ API Request Failed:', {
                endpoint,
                baseURL: BASE_URL,
                error: error.message || error,
                fullError: error
            });
            
            // CRITICAL: Always return structured response object
            // This ensures res.ok checks work correctly in calling code
            return {
                ok: false,
                status: 0,
                data: {
                    message: error.message || 'Network error or request blocked by browser',
                    error: error.name || 'NetworkError'
                }
            };
        }
    },

    get: (endpoint) => api.request(endpoint, { method: 'GET' }),

    post: (endpoint, body) => api.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
    }),

    patch: (endpoint, body) => api.request(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(body)
    }),

    delete: (endpoint) => api.request(endpoint, { method: 'DELETE' }),

    postForm: (endpoint, formData) => api.request(endpoint, {
        method: 'POST',
        body: formData
    }),

    patchForm: (endpoint, formData) => api.request(endpoint, {
        method: 'PATCH',
        body: formData
    })
};

export default api;
