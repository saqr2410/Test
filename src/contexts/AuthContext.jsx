
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../api/axios";
import toast from "react-hot-toast";


const AuthContext = createContext(null);


const normalizeUser = (userData) => {
    if (!userData || typeof userData !== "object") {
        return null;
    }

    return {
        ...userData,
        role: String(userData.role || "")
            .trim()
            .toUpperCase(),
    };
};


const getMessage = (value) => {
    if (Array.isArray(value)) {
        return value.map(getMessage).join(" ");
    }

    if (typeof value === "string") {
        return value;
    }

    if (value && typeof value === "object") {
        return Object.values(value)
            .map(getMessage)
            .filter(Boolean)
            .join(" ");
    }

    return "";
};


const getApiErrors = (error) => {
    const data = error?.response?.data;
    const status = error?.response?.status;

    if (!error?.response) {
        return {
            general:
                "تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل.",
        };
    }

    if (status === 429) {
        return {
            general:
                "محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى.",
        };
    }

    if (status === 403) {
        return {
            general:
                getMessage(data?.detail) ||
                "ليس لديك صلاحية لتنفيذ هذا الإجراء.",
        };
    }

    if (status === 401) {
        return {
            general:
                getMessage(data?.detail) ||
                "اسم المستخدم أو كلمة المرور غير صحيحة.",
        };
    }

    if (status >= 500) {
        return {
            general:
                "حدث خطأ في الخادم. حاول مرة أخرى لاحقًا.",
        };
    }

    if (!data || typeof data !== "object") {
        return {
            general: "حدث خطأ، حاول مرة أخرى.",
        };
    }

    const errors = {};
    const knownFields = [
        "username",
        "email",
        "phone",
        "password",
        "password2",
        "confirm_password",
        "old_password",
        "new_password",
        "first_name",
        "last_name",
        "non_field_errors",
        "detail",
        "message",
    ];

    knownFields.forEach((field) => {
        if (data[field] !== undefined) {
            const message = getMessage(data[field]);

            if (field === "detail" || field === "message") {
                errors.general = message;
            } else if (field === "non_field_errors") {
                errors.general = message;
            } else {
                errors[field] = message;
            }
        }
    });

    if (Object.keys(errors).length === 0) {
        errors.general =
            "تعذر تنفيذ الطلب. راجع البيانات وحاول مرة أخرى.";
    }

    return errors;
};


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);


    const saveAuthData = (access, refresh, userData) => {
        if (!access || !refresh || !userData) {
            throw new Error("Invalid authentication response.");
        }

        const normalizedUser = normalizeUser(userData);

        if (!normalizedUser) {
            throw new Error("Invalid user data.");
        }

        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user", JSON.stringify(normalizedUser));

        setUser(normalizedUser);

        return normalizedUser;
    };


    const clearAuthData = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        setUser(null);
    };


    useEffect(() => {
        let cancelled = false;

        const loadUser = async () => {
            const accessToken = localStorage.getItem("access_token");
            const savedUser = localStorage.getItem("user");

            let cachedUser = null;

            try {
                cachedUser = normalizeUser(
                    savedUser ? JSON.parse(savedUser) : null
                );
            } catch {
                localStorage.removeItem("user");
            }

            if (!accessToken) {
                if (!cancelled) {
                    setUser(null);
                    setInitializing(false);
                }

                return;
            }

            try {
                const response = await api.get("/users/me/");

                if (cancelled) {
                    return;
                }

                const currentUser = normalizeUser(response.data);

                if (!currentUser) {
                    clearAuthData();
                    return;
                }

                setUser(currentUser);

                localStorage.setItem(
                    "user",
                    JSON.stringify(currentUser)
                );
            } catch (error) {
                if (cancelled) {
                    return;
                }

                console.error(
                    "LOAD USER ERROR:",
                    error?.response?.data || error
                );

                if (error?.response?.status === 401) {
                    clearAuthData();
                } else if (cachedUser) {
                    // Keep the cached session during temporary server errors.
                    setUser(cachedUser);
                } else {
                    setUser(null);
                }
            } finally {
                if (!cancelled) {
                    setInitializing(false);
                }
            }
        };

        loadUser();

        return () => {
            cancelled = true;
        };
    }, []);


    const login = async (username, password) => {
        setLoading(true);

        try {
            const response = await api.post("/users/login/", {
                username: username.trim(),
                password,
            });

            const {
                access,
                refresh,
                user: userData,
            } = response.data;

            const normalizedUser = saveAuthData(
                access,
                refresh,
                userData
            );

            toast.success("تم تسجيل الدخول بنجاح");

            return {
                user: normalizedUser,
                errors: null,
            };
        } catch (error) {
            console.error(
                "LOGIN ERROR:",
                error?.response?.data || error
            );

            return {
                user: null,
                errors: getApiErrors(error),
            };
        } finally {
            setLoading(false);
        }
    };


    const register = async (data) => {
        setLoading(true);

        try {
            const response = await api.post(
                "/users/register/",
                data
            );

            const message =
                response.data?.message ||
                "تم إنشاء الحساب. راجع بريدك الإلكتروني لتأكيد الحساب قبل تسجيل الدخول.";

            toast.success(message);

            return {
                user: null,
                errors: null,
                registered: true,
                message,
            };
        } catch (error) {
            console.error(
                "REGISTER ERROR:",
                error?.response?.data || error
            );

            return {
                user: null,
                errors: getApiErrors(error),
                registered: false,
            };
        } finally {
            setLoading(false);
        }
    };


    const logout = async () => {
        const refreshToken = localStorage.getItem("refresh_token");

        try {
            if (refreshToken) {
                await api.post("/users/logout/", {
                    refresh: refreshToken,
                });
            }
        } catch (error) {
            // Local logout must still work if the API is unavailable.
            console.error(
                "LOGOUT API ERROR:",
                error?.response?.data || error
            );
        } finally {
            clearAuthData();
            toast.success("تم تسجيل الخروج");
        }
    };


    const value = {
        user,
        setUser,
        loading,
        initializing,
        login,
        register,
        logout,

        role: user?.role,
        isAuthenticated: Boolean(user),

        isOwner: user?.role === "OWNER",
        isManager: user?.role === "MANAGER",
        isPharmacist: user?.role === "PHARMACIST",
        isCashier: user?.role === "CASHIER",
        isAccountant: user?.role === "ACCOUNTANT",
        isDelivery: user?.role === "DELIVERY",
        isCustomer: user?.role === "CUSTOMER",
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
