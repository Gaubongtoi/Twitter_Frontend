import axios from 'axios';
import toast from 'react-hot-toast';
import useLoginState, { login, logout } from '../hooks/state/useLoginState';
import { useSWRConfig } from 'swr';
class Http {
    constructor() {
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_URL_SERVER,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Các route yêu cầu kiểm tra accessToken
        this.protectedRoutes = [
            // User API
            '/api/user/logout',
            '/api/user/resend-verify-email',
            '/api/user/me',
            '/api/user/profile',
            '/api/user/follow',
            '/api/user/follow/:user_id',
            '/api/user/change_password',
            '/api/user/recommendations',

            //
            '/api/orders',
            '/api/cart',
        ];
        this.instance.interceptors.request.use(
            (config) => {
                console.log('Request config:', config);
                const isProtectedRoute = this.protectedRoutes.some((route) => config.url.includes(route));
                if (isProtectedRoute) {
                    const accessToken = localStorage.getItem('accessToken');
                    if (accessToken) {
                        config.headers['Authorization'] = `Bearer ${accessToken}`;
                    } else {
                        console.log('No access token found');
                    }
                }

                return config;
            },
            (error) => {
                console.error('Request error:', error);
                return Promise.reject(error);
            },
        );

        this.instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                console.log('Response error:', error);
                const originalRequest = error.config;
                if (error.code === 'ECONNABORTED') {
                    // Xử lý lỗi timeout ở đây
                    toast.error('Request timed out. Please try again later.');
                }
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    // Check xem có nằm trong route xài accessToken để gửi lên server -> refreshToken không
                    const isProtectedRoute = this.protectedRoutes.some((route) => originalRequest.url.includes(route));
                    if (!isProtectedRoute) {
                        // Không thì chỉ trả về error
                        return Promise.reject(error);
                    }
                    // Chỉ ra 1 request đã được thử lại sau khi ban đầu bị thất bại do lỗi token hoặc xác thực
                    // Tránh việc thử lại cùng 1 request nhiều lần (sử dụng token cũ để gửi lại request) -> xử lý lấy token mới
                    // và gửi lại tại đây
                    originalRequest._retry = true;
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!refreshToken) {
                        console.error('No refresh token found');
                        return Promise.reject(error);
                    }
                    try {
                        console.log('Sending refresh token request');
                        const res = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/user/refresh-token`, {
                            refresh_token: refreshToken,
                        });
                        localStorage.setItem('accessToken', res.data.result.access_token);
                        localStorage.setItem('refreshToken', res.data.result.refresh_token);
                        login();
                        originalRequest.headers['Authorization'] = `Bearer ${res.data.result.access_token}`;
                        console.log('Retrying original request with new access token');
                        return this.instance(originalRequest);
                    } catch (err) {
                        return Promise.reject(err);
                    }
                }

                return Promise.reject(error);
            },
        );
    }
}

const http = new Http().instance;

export default http;
