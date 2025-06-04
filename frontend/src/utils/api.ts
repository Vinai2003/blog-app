import axios, { AxiosInstance } from 'axios';

// API base URL
const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not already retrying
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get refresh token
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Attempt to get a new token
                const response = await axios.post(`${API_URL}/users/login/refresh/`, {
                    refresh: refreshToken
                });

                // If successful, save the new token
                const { access } = response.data;
                localStorage.setItem('token', access);

                // Update authorization header
                originalRequest.headers['Authorization'] = `Bearer ${access}`;

                // Retry the original request
                return axios(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout user
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth endpoints
export const authAPI = {
    register: (userData: any) => {
        console.log('Sending registration data:', userData); // Add this for debugging
        return api.post('/users/register/', userData);
    },
    login: (credentials: any) => api.post('/users/login/', credentials),
    getProfile: () => api.get('/users/profile/'),
    updateProfile: (profileData: any) => api.put('/users/profile/', profileData),
};

// Blog endpoints
export const blogAPI = {
    getBlogs: (page = 1) => api.get(`/blogs/?page=${page}`),
    getBlog: (id: number) => api.get(`/blogs/${id}/`),
    createBlog: async (blogData: any) => {
        try {
            const response = await api.post('/blogs/create/', blogData);
            console.log('Blog creation API response:', response);
            return response;
        } catch (error) {
            console.error('Error creating blog:', error);
            throw error;
        }
    },
    updateBlog: (id: number, blogData: any) => api.put(`/blogs/${id}/update/`, blogData),
    deleteBlog: (id: number) => api.delete(`/blogs/${id}/update/`),
    getUserBlogs: async () => {
        try {
            const response = await api.get('/blogs/my-blogs/');
            console.log('User blogs response:', response.data);
            return response;
        } catch (error) {
            console.error('Error fetching user blogs:', error);
            throw error;
        }
    },
};

export default api;
