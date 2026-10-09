import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../api/axios";

import toast from "react-hot-toast";


const AuthContext =
    createContext(null);


/* ==========================================
   Normalize User
========================================== */

const normalizeUser = (userData) => {

    if (!userData) {
        return null;
    }

    return {
        ...userData,

        role: String(
            userData.role || ""
        )
            .trim()
            .toUpperCase(),
    };
};


/* ==========================================
   Extract API Errors
========================================== */

const getApiErrors = (error) => {

    const data =
        error?.response?.data;


    if (!data) {

        return {
            general:
                "حدث خطأ في الاتصال بالخادم."
        };

    }


    const errors = {};


    if (data.username) {

        errors.username =
            Array.isArray(data.username)
                ? data.username[0]
                : data.username;

    }


    if (data.email) {

        errors.email =
            Array.isArray(data.email)
                ? data.email[0]
                : data.email;

    }


    if (data.phone) {

        errors.phone =
            Array.isArray(data.phone)
                ? data.phone[0]
                : data.phone;

    }


    if (data.password) {

        errors.password =
            Array.isArray(data.password)
                ? data.password[0]
                : data.password;

    }


    if (data.password2) {

        errors.password2 =
            Array.isArray(data.password2)
                ? data.password2[0]
                : data.password2;

    }


    if (data.confirm_password) {

        errors.confirm_password =
            Array.isArray(
                data.confirm_password
            )
                ? data.confirm_password[0]
                : data.confirm_password;

    }


    if (data.old_password) {

        errors.old_password =
            Array.isArray(
                data.old_password
            )
                ? data.old_password[0]
                : data.old_password;

    }


    if (data.detail) {

        errors.general =
            Array.isArray(data.detail)
                ? data.detail[0]
                : data.detail;

    }


    if (data.non_field_errors) {

        errors.general =
            Array.isArray(
                data.non_field_errors
            )
                ? data.non_field_errors[0]
                : data.non_field_errors;

    }


    if (
        Object.keys(errors).length === 0
    ) {

        errors.general =
            "حدث خطأ، حاول مرة أخرى.";

    }


    return errors;
};


/* ==========================================
   Auth Provider
========================================== */

export const AuthProvider = ({
    children,
}) => {

    const [user, setUser] =
        useState(null);


    /*
     * Loading for login/register
     */
    const [loading, setLoading] =
        useState(false);


    /*
     * Loading only while checking
     * the existing access token.
     */
    const [initializing, setInitializing] =
        useState(true);


    /* ==========================================
       Save Auth Data
    ========================================== */

    const saveAuthData = (
        access,
        refresh,
        userData
    ) => {

        localStorage.setItem(
            "access_token",
            access
        );


        localStorage.setItem(
            "refresh_token",
            refresh
        );


        const normalizedUser =
            normalizeUser(
                userData
            );


        localStorage.setItem(
            "user",
            JSON.stringify(
                normalizedUser
            )
        );


        setUser(
            normalizedUser
        );


        return normalizedUser;
    };


    /* ==========================================
       Clear Auth Data
    ========================================== */

    const clearAuthData = () => {

        localStorage.removeItem(
            "access_token"
        );


        localStorage.removeItem(
            "refresh_token"
        );


        localStorage.removeItem(
            "user"
        );


        setUser(null);

    };


    /* ==========================================
       Load Current User
    ========================================== */

    useEffect(() => {

        const loadUser = async () => {

            const accessToken =
                localStorage.getItem(
                    "access_token"
                );


            if (!accessToken) {

                setInitializing(false);

                return;

            }


            try {

                const response =
                    await api.get(
                        "/users/me/"
                    );


                const normalizedUser =
                    normalizeUser(
                        response.data
                    );


                setUser(
                    normalizedUser
                );


                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        normalizedUser
                    )
                );


            } catch (error) {

                console.error(
                    "LOAD USER ERROR:",
                    error?.response?.data ||
                    error
                );


                clearAuthData();

            } finally {

                setInitializing(false);

            }

        };


        loadUser();

    }, []);


    /* ==========================================
       Login
    ========================================== */

    const login = async (
        username,
        password
    ) => {

        setLoading(true);


        try {

            const response =
                await api.post(
                    "/users/login/",
                    {
                        username,
                        password,
                    }
                );


            const {
                access,
                refresh,
                user: userData,
            } = response.data;


            if (
                !access ||
                !refresh ||
                !userData
            ) {

                throw new Error(
                    "Invalid login response."
                );

            }


            const normalizedUser =
                saveAuthData(
                    access,
                    refresh,
                    userData
                );


            toast.success(
                "تم تسجيل الدخول بنجاح"
            );


            return {
                user: normalizedUser,
                errors: null,
            };


        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error?.response?.data ||
                error
            );


            console.log(
                "LOGIN API ERROR:",
                JSON.stringify(
                    error?.response?.data,
                    null,
                    2
                )
            );


            const errors =
                getApiErrors(error);


            return {
                user: null,
                errors,
            };


        } finally {

            setLoading(false);

        }

    };


    /* ==========================================
       Register
    ========================================== */

    const register = async (
        data
    ) => {

        setLoading(true);


        try {

            await api.post(
                "/users/register/",
                data
            );


            toast.success(
                "تم إنشاء الحساب بنجاح"
            );


            const result =
                await login(
                    data.username,
                    data.password
                );


            return result;


        } catch (error) {

            console.error(
                "REGISTER ERROR:",
                error?.response?.data ||
                error
            );


            const errors =
                getApiErrors(error);


            return {
                user: null,
                errors,
            };


        } finally {

            setLoading(false);

        }

    };


    /* ==========================================
       Logout
    ========================================== */

    const logout = () => {

        clearAuthData();


        toast.success(
            "تم تسجيل الخروج"
        );

    };


    /* ==========================================
       Context
    ========================================== */

    const value = {

        user,

        loading,

        initializing,

        login,

        register,

        logout,


        role:
            user?.role,


        isAuthenticated:
            Boolean(user),


        isOwner:
            user?.role === "OWNER",


        isManager:
            user?.role === "MANAGER",


        isPharmacist:
            user?.role === "PHARMACIST",


        isCashier:
            user?.role === "CASHIER",


        isAccountant:
            user?.role === "ACCOUNTANT",


        isDelivery:
            user?.role === "DELIVERY",


        isCustomer:
            user?.role === "CUSTOMER",

    };


    return (

        <AuthContext.Provider
            value={value}
        >

            {children}

        </AuthContext.Provider>

    );

};


/* ==========================================
   Hook
========================================== */

export const useAuth = () =>
    useContext(
        AuthContext
    );
