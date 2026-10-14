import { useState } from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";


const Register = () => {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        password2: "",
    });

    const [errors, setErrors] = useState({});
    const [registered, setRegistered] = useState(false);

    const { register, loading } = useAuth();
    const navigate = useNavigate();


    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
            general: "",
        }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        setErrors({});
        setRegistered(false);

        const payload = {
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            username: form.username.trim(),
            email: form.email.trim(),
            password: form.password,
            password2: form.password2,
        };

        if (
            !payload.first_name ||
            !payload.last_name ||
            !payload.username ||
            !payload.email ||
            !payload.password ||
            !payload.password2
        ) {
            setErrors({
                general: "من فضلك املا جميع الحقول المطلوبة.",
            });
            return;
        }

        if (payload.password !== payload.password2) {
            setErrors({
                password2: "كلمتا المرور غير متطابقتين.",
            });
            return;
        }

        const result = await register(payload);

        if (result?.registered) {
            setRegistered(true);
            return;
        }

        if (result?.user) {
            const user = result.user;

            navigate(
                user.role === "CUSTOMER"
                    ? "/"
                    : "/admin/dashboard"
            );

            return;
        }

        setErrors(
            result?.errors || {
                general: "تعذر إنشاء الحساب. حاول مرة أخرى.",
            }
        );
    };


    if (registered) {
        return (
            <div
                dir="rtl"
                className="
                    flex min-h-screen items-center justify-center
                    bg-gray-100 px-4 py-8
                "
            >
                <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
                    <div className="mb-4 text-5xl">✉️</div>

                    <h1 className="mb-3 text-2xl font-bold text-gray-800">
                        تم إنشاء حسابك بنجاح
                    </h1>

                    <p className="mb-6 leading-7 text-gray-600">
                        لو مطلوب تأكيد البريد الإلكتروني، افتح رسالة التأكيد
                        واتبع التعليمات الموجودة فيها. راجع مجلد الرسائل غير
                        المرغوب فيها لو مش لاقي الرسالة.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="
                            w-full rounded-lg bg-[#5B2A86] p-3
                            font-semibold text-white transition
                            hover:bg-[#4A216D]
                        "
                    >
                        الانتقال إلى تسجيل الدخول
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div
            dir="rtl"
            className="
                flex min-h-screen items-center justify-center
                bg-gray-100 px-4 py-8
            "
        >
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
                    إنشاء حساب
                </h1>

                <p className="mb-6 text-center text-sm text-gray-500">
                    أنشئ حسابك في صيدليتنا
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    noValidate
                >
                    <div>
                        <label
                            htmlFor="first_name"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            الاسم الأول
                        </label>

                        <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            autoComplete="given-name"
                            placeholder="أدخل الاسم الأول"
                            value={form.first_name}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            className={`
                                w-full rounded-lg border p-3 outline-none
                                focus:ring-2 focus:ring-[#5B2A86]
                                ${errors.first_name
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }
                            `}
                        />

                        {errors.first_name && (
                            <p className="mt-2 text-sm text-red-600">
                                {Array.isArray(errors.first_name)
                                    ? errors.first_name.join(" ")
                                    : errors.first_name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="last_name"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            الاسم الأخير
                        </label>

                        <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            autoComplete="family-name"
                            placeholder="أدخل الاسم الأخير"
                            value={form.last_name}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            className={`
                                w-full rounded-lg border p-3 outline-none
                                focus:ring-2 focus:ring-[#5B2A86]
                                ${errors.last_name
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }
                            `}
                        />

                        {errors.last_name && (
                            <p className="mt-2 text-sm text-red-600">
                                {Array.isArray(errors.last_name)
                                    ? errors.last_name.join(" ")
                                    : errors.last_name}
                            </p>
                        )}
                    </div>

                    <div>
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
                            value={form.username}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            className={`
                                w-full rounded-lg border p-3 outline-none
                                focus:ring-2 focus:ring-[#5B2A86]
                                ${errors.username
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }
                            `}
                        />

                        {errors.username && (
                            <p className="mt-2 text-sm text-red-600">
                                {Array.isArray(errors.username)
                                    ? errors.username.join(" ")
                                    : errors.username}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            البريد الإلكتروني
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="example@email.com"
                            value={form.email}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            className={`
                                w-full rounded-lg border p-3 outline-none
                                focus:ring-2 focus:ring-[#5B2A86]
                                ${errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }
                            `}
                        />

                        {errors.email && (
                            <p className="mt-2 text-sm text-red-600">
                                {Array.isArray(errors.email)
                                    ? errors.email.join(" ")
                                    : errors.email}
                            </p>
                        )}
                    </div>

                    <div>
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
                            autoComplete="new-password"
                            placeholder="أدخل كلمة المرور"
                            value={form.password}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            className={`
                                w-full rounded-lg border p-3 outline-none
                                focus:ring-2 focus:ring-[#5B2A86]
                                ${errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }
                            `}
                        />

                        {errors.password && (
                            <p className="mt-2 text-sm text-red-600">
                                {Array.isArray(errors.password)
                                    ? errors.password.join(" ")
                                    : errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password2"
                            className="mb-2 block font-medium text-gray-700"
                        >
                            تأكيد كلمة المرور
                        </label>

                        <input
                            id="password2"
                            name="password2"
                            type="password"
                            autoComplete="new-password"
                            placeholder="أعد كتابة كلمة المرور"
                            value={form.password2}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            className={`
                                w-full rounded-lg border p-3 outline-none
                                focus:ring-2 focus:ring-[#5B2A86]
                                ${errors.password2
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }
                            `}
                        />

                        {errors.password2 && (
                            <p className="mt-2 text-sm text-red-600">
                                {Array.isArray(errors.password2)
                                    ? errors.password2.join(" ")
                                    : errors.password2}
                            </p>
                        )}
                    </div>

                    {errors.general && (
                        <div
                            role="alert"
                            className="
                                rounded-lg border border-red-200
                                bg-red-50 p-3 text-center text-sm
                                text-red-700
                            "
                        >
                            {Array.isArray(errors.general)
                                ? errors.general.join(" ")
                                : errors.general}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full rounded-lg bg-[#5B2A86] p-3
                            font-semibold text-white transition
                            hover:bg-[#4A216D]
                            disabled:cursor-not-allowed
                            disabled:bg-gray-400
                        "
                    >
                        {loading
                            ? "جاري إنشاء الحساب..."
                            : "إنشاء الحساب"
                        }
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    لديك حساب بالفعل؟{" "}

                    <Link
                        to="/login"
                        className="font-bold text-[#5B2A86]"
                    >
                        تسجيل الدخول
                    </Link>
                </p>
            </div>
        </div>
    );
};


export default Register;
