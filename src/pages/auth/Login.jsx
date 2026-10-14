
import { useState } from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import { useAuth } from "../../contexts/AuthContext";

import { syncCart } from "../../services/cart/cartService";


const getErrorMessage = (error) => {
    if (typeof error === "string") {
        return error;
    }

    if (Array.isArray(error)) {
        return error.map(getErrorMessage).join(" ");
    }

    return "حدث خطأ، حاول مرة أخرى.";
};


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const { login, loading } = useAuth();

    const navigate = useNavigate();


    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrors({});

        const cleanUsername = username.trim();

        if (!cleanUsername || !password) {
            setErrors({
                general: "من فضلك أدخل اسم المستخدم وكلمة المرور.",
            });
            return;
        }

        try {
            const result = await login(
                cleanUsername,
                password
            );

            if (!result?.user) {
                const responseErrors = result?.errors || {};

                setErrors({
                    username: responseErrors.username
                        ? getErrorMessage(responseErrors.username)
                        : "",
                    password: responseErrors.password
                        ? getErrorMessage(responseErrors.password)
                        : "",
                    general: getErrorMessage(
                        responseErrors.general ||
                        responseErrors.detail ||
                        responseErrors.non_field_errors ||
                        "اسم المستخدم أو كلمة المرور غير صحيحة."
                    ),
                });

                return;
            }

            const user = result.user;

            let localCart = [];

            try {
                localCart = JSON.parse(
                    localStorage.getItem("cart") || "[]"
                );

                if (!Array.isArray(localCart)) {
                    localCart = [];
                }
            } catch {
                localCart = [];
            }

            if (
                user.role === "CUSTOMER" &&
                localCart.length > 0
            ) {
                try {
                    await syncCart(
                        localCart
                            .filter((item) => item?.id != null)
                            .map((item) => ({
                                id: item.id,
                                quantity: Math.max(
                                    1,
                                    Number(item.quantity) || 1
                                ),
                            }))
                    );

                    localStorage.removeItem("cart");
                } catch (error) {
                    console.error("Cart sync error:", error);

                    toast.error(
                        error?.response?.data?.error ||
                        "تم تسجيل الدخول، لكن تعذرت مزامنة السلة."
                    );
                }
            }

            if (user.role === "CUSTOMER") {
                navigate("/");
            } else {
                navigate("/admin/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);

            const status = error?.response?.status;
            const data = error?.response?.data;

            if (status === 403) {
                setErrors({
                    general:
                        data?.detail ||
                        "يجب تأكيد البريد الإلكتروني قبل تسجيل الدخول.",
                });
            } else if (status === 429) {
                setErrors({
                    general:
                        "محاولات تسجيل الدخول كثيرة. انتظر قليلًا ثم حاول مجددًا.",
                });
            } else if (!error?.response) {
                setErrors({
                    general:
                        "تعذر الاتصال بالخادم. تأكد أن الـ Backend يعمل.",
                });
            } else {
                setErrors({
                    general:
                        data?.detail ||
                        data?.message ||
                        "اسم المستخدم أو كلمة المرور غير صحيحة.",
                });
            }
        }
    };


    return (
        <div
            dir="rtl"
            className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gray-100
                px-4
                py-8
            "
        >
            <div
                className="
                    w-full
                    max-w-md
                    rounded-xl
                    bg-white
                    p-8
                    shadow-lg
                "
            >
                <h1
                    className="
                        mb-2
                        text-center
                        text-3xl
                        font-bold
                        text-gray-800
                    "
                >
                    تسجيل الدخول
                </h1>

                <p className="mb-8 text-center text-sm text-gray-500">
                    أهلًا بيك في صيدليتنا
                </p>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="mb-5">
                        <label
                            htmlFor="username"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            اسم المستخدم
                        </label>

                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            placeholder="أدخل اسم المستخدم"
                            value={username}
                            onChange={(event) => {
                                setUsername(event.target.value);

                                setErrors((previous) => ({
                                    ...previous,
                                    username: "",
                                    general: "",
                                }));
                            }}
                            disabled={loading}
                            required
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                p-3
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                                disabled:bg-gray-100
                            "
                        />

                        {errors.username && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.username}
                            </p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="password"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            كلمة المرور
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="أدخل كلمة المرور"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);

                                setErrors((previous) => ({
                                    ...previous,
                                    password: "",
                                    general: "",
                                }));
                            }}
                            disabled={loading}
                            required
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                p-3
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                                disabled:bg-gray-100
                            "
                        />

                        {errors.password && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {errors.general && (
                        <div
                            role="alert"
                            className="
                                mb-5
                                rounded-lg
                                border
                                border-red-200
                                bg-red-50
                                p-3
                                text-sm
                                text-red-700
                            "
                        >
                            {errors.general}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            rounded-lg
                            bg-blue-600
                            p-3
                            font-semibold
                            text-white
                            transition
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {loading
                            ? "جاري تسجيل الدخول..."
                            : "تسجيل الدخول"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    ليس لديك حساب؟{" "}
                    <Link
                        to="/register"
                        className="font-bold text-blue-600 hover:text-blue-700"
                    >
                        سجل الآن
                    </Link>
                </p>
            </div>
        </div>
    );
};


export default Login;
