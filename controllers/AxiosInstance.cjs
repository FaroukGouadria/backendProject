import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://your-api-base-url',
});

// Request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = 'Bearer ${token}';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If token is expired
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      try {
        const response = await axios.post('https://your-api-base-url/refresh', {
          token: refreshToken,
        });

        if (response.status === 200) {
          const { accessToken } = response.data;
          await AsyncStorage.setItem('accessToken', accessToken);

          // Update the Authorization header and retry the original request
          originalRequest.headers.Authorization = 'Bearer ${accessToken}';
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        // Handle refresh token failure (e.g., logout the user)
        console.error('Refresh token failed', err);
        // Clear tokens and redirect to login
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        // Redirect to login (depends on your navigation setup)
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;