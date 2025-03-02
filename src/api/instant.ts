// api-client.js (or utils/api-client.js)
import { ACCESS_TOKEN } from '@/constants/auth';
import axios from 'axios';

// Create an Axios instance with default configurations
const axiosInstant = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:10000') + (process.env.NEXT_PUBLIC_API_BASE_VERSION || '/api/v1'), // Set your base URL from environment variables
    timeout: 10000, // Optional: Set a default timeout for requests
    // You can add other default configurations here, like content type
});

// --- Global Request Headers ---
axiosInstant.interceptors.request.use(
    (config) => {
        const token = JSON.parse(localStorage.getItem(ACCESS_TOKEN) || '{}');
        if (token && token.state && token.state.accessToken) {
            config.headers['Authorization'] = `Bearer ${token.state.accessToken}`;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => {
        // Handle request error here (e.g., log it)
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// --- Global Response Interceptor for Error Handling ---
axiosInstant.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem(ACCESS_TOKEN);
            window.location.href = '/login';
        } else if (error.response?.status === 403) {
            return error.response;
        } else if (error.response?.status === 400) {
            return error.response;
        }
        return Promise.reject(error);
    }
);


export default axiosInstant;