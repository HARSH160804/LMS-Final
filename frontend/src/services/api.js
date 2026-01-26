/**
 * API Service - Centralized API communication
 * 
 * Configuration:
 * - Uses VITE_API_URL environment variable for backend URL
 * - Fallback to http://localhost:8000 for local development
 * - All requests include credentials (cookies) for authentication
 * 
 * Production Setup:
 * - Set VITE_API_URL in Vercel environment variables
 * - Example: VITE_API_URL=https://your-backend.onrender.com
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const BASE_URL = `${API_URL}/api/v1`;

const api = {
    /**
     * Generic request handler
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
            const response = await fetch(`${BASE_URL}${endpoint}`, config);

            // Handle 401 Unauthorized globally (e.g., redirect to login)
            if (response.status === 401) {
                // You might want to trigger a global event or callback here
                // For now, we propagate the error so the caller handles it
            }

            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Something went wrong',
                    data: data
                };
            }

            return data;
        } catch (error) {
            // Re-throw formatted error
            throw error.message ? error : { message: 'Network error', status: 500 };
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
