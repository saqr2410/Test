import axios from "axios";


const API_URL =
    "http://127.0.0.1:8000/api";


const api = axios.create({

    baseURL: API_URL,

    headers: {
        "Content-Type": "application/json",
    },

});


// ========================================
// Redirect Helper
// ========================================

const redirectToLogin = () => {

    const base =
        import.meta.env.PROD
            ? "/Smart-Pharmacy"
            : "";


    window.location.href =
        `${base}/login`;

};


// ========================================
// Request Interceptor
// ========================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem(
                "access_token"
            );


        if (token) {

            config.headers =
                config.headers || {};


            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    (error) => {

        return Promise.reject(
            error
        );

    }

);


// ========================================
// Response Interceptor
// ========================================

api.interceptors.response.use(

    (response) => {

        return response;

    },

    async (error) => {

        const originalRequest =
            error.config;


        // ========================================
        // Not Unauthorized
        // ========================================

        if (
            error.response?.status !== 401
        ) {

            return Promise.reject(
                error
            );

        }


        // ========================================
        // Authentication Requests
        // Don't Refresh Token
        // ========================================

        const requestUrl =
            originalRequest?.url || "";


        const isAuthRequest =
            requestUrl.includes(
                "/users/login/"
            ) ||
            requestUrl.includes(
                "/users/register/"
            );


        if (isAuthRequest) {

            return Promise.reject(
                error
            );

        }


        // ========================================
        // Prevent Infinite Refresh Loop
        // ========================================

        if (
            originalRequest?._retry
        ) {

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "refresh_token"
            );

            localStorage.removeItem(
                "user"
            );


            redirectToLogin();


            return Promise.reject(
                error
            );

        }


        originalRequest._retry =
            true;


        // ========================================
        // Refresh Token
        // ========================================

        const refreshToken =
            localStorage.getItem(
                "refresh_token"
            );


        if (!refreshToken) {

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "user"
            );


            redirectToLogin();


            return Promise.reject(
                error
            );

        }


        try {

            const response =
                await axios.post(

                    `${API_URL}/users/token/refresh/`,

                    {
                        refresh:
                            refreshToken,
                    }

                );


            const newAccessToken =
                response.data.access;


            localStorage.setItem(
                "access_token",
                newAccessToken
            );


            originalRequest.headers =
                originalRequest.headers || {};


            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;


            return api(
                originalRequest
            );

        } catch (
        refreshError
        ) {

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "refresh_token"
            );

            localStorage.removeItem(
                "user"
            );


            redirectToLogin();


            return Promise.reject(
                refreshError
            );

        }

    }

);


export default api;
