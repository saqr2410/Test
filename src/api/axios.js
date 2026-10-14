import axios from "axios";

// ========================================
// API Configuration
// ========================================

const API_URL = (
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

const api = axios.create({
    baseURL: API_URL,

    headers: {
        "Content-Type": "application/json",
    },
});

// ========================================
// Authentication Helpers
// ========================================

const clearAuthData = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
};

const redirectToLogin = () => {
    const base = import.meta.env.PROD
        ? "/Smart-Pharmacy"
        : "";

    if (!window.location.pathname.endsWith("/login")) {
        window.location.href = `${base}/login`;
    }
};

// ========================================
// Request Interceptor
// ========================================

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers = config.headers || {};

            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);

// ========================================
// Refresh Token Queue
// ========================================

let isRefreshing = false;

let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((request) => {
        if (error) {
            request.reject(error);
        } else {
            request.resolve(token);
        }
    });

    failedQueue = [];
};

// ========================================
// Response Interceptor
// ========================================

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            !originalRequest
        ) {
            return Promise.reject(error);
        }

        const requestUrl = originalRequest.url || "";

        // Don't refresh authentication requests.
        const isAuthRequest = [
            "/users/login/",
            "/users/register/",
            "/users/token/refresh/",
        ].some((path) => requestUrl.includes(path));

        if (isAuthRequest) {
            return Promise.reject(error);
        }

        // Prevent infinite retry loops.
        if (originalRequest._retry) {
            clearAuthData();
            redirectToLogin();

            return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem(
            "refresh_token"
        );

        if (!refreshToken) {
            clearAuthData();
            redirectToLogin();

            return Promise.reject(error);
        }

        // Wait for an ongoing refresh request.
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve,
                    reject,
                });
            }).then((newToken) => {
                originalRequest.headers =
                    originalRequest.headers || {};

                originalRequest.headers.Authorization =
                    `Bearer ${newToken}`;

                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const response = await axios.post(
                `${API_URL}/users/token/refresh/`,
                {
                    refresh: refreshToken,
                }
            );

            const newAccessToken = response.data.access;

            if (!newAccessToken) {
                throw new Error(
                    "Refresh response has no access token."
                );
            }

            localStorage.setItem(
                "access_token",
                newAccessToken
            );

            processQueue(null, newAccessToken);

            originalRequest.headers =
                originalRequest.headers || {};

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);

            clearAuthData();
            redirectToLogin();

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
