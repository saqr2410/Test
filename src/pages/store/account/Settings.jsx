
import { useEffect, useState } from "react";

import {
    UserRound,
    LockKeyhole,
    Save,
    LogOut,
    Mail,
    Phone,
    ShieldCheck,
    Eye,
    EyeOff,
    CheckCircle2,
    RefreshCw,
    KeyRound,
    AlertCircle,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "../../../contexts/AuthContext";

import {
    getCurrentUser,
    updateCurrentUser,
    changePassword,
} from "../../../services/users/userService";

const initialProfile = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
};

const initialPassword = {
    old_password: "",
    new_password: "",
    confirm_password: "",
};

const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (typeof data?.detail === "string") {
        return data.detail;
    }

    if (typeof data?.message === "string") {
        return data.message;
    }

    if (data && typeof data === "object") {
        const messages = Object.values(data)
            .flatMap((value) =>
                Array.isArray(value) ? value : [value]
            )
            .filter((value) => typeof value === "string");

        if (messages.length) {
            return messages.join(" ");
        }
    }

    if (!error?.response) {
        return "تعذر الاتصال بالخادم. تأكد من تشغيله ثم حاول مرة أخرى.";
    }

    if (error.response.status === 401) {
        return "انتهت صلاحية الجلسة أو أن كلمة المرور الحالية غير صحيحة.";
    }

    return "حدث خطأ أثناء تنفيذ الطلب. حاول مرة أخرى.";
};

export default function Settings() {
    const { logout, user, setUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const [profile, setProfile] = useState(initialProfile);
    const [passwordData, setPasswordData] = useState(initialPassword);

    const [visibility, setVisibility] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            try {
                const data = await getCurrentUser();

                if (!active) return;

                setProfile({
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                });
            } catch (error) {
                if (active) {
                    toast.error(getErrorMessage(error));
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            active = false;
        };
    }, []);

    const handleProfileChange = (event) => {
        const { name, value } = event.target;

        setProfile((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSaveProfile = async (event) => {
        event.preventDefault();

        if (!profile.first_name.trim()) {
            toast.error("اكتب الاسم الأول.");
            return;
        }

        if (!profile.last_name.trim()) {
            toast.error("اكتب الاسم الأخير.");
            return;
        }

        setSavingProfile(true);

        try {
            // البريد الإلكتروني لا يُرسل ضمن بيانات التعديل.
            const payload = {
                first_name: profile.first_name.trim(),
                last_name: profile.last_name.trim(),
                phone: profile.phone.trim(),
            };

            const updatedUser = await updateCurrentUser(payload);

            const nextProfile = {
                ...profile,
                first_name:
                    updatedUser.first_name ?? payload.first_name,
                last_name:
                    updatedUser.last_name ?? payload.last_name,
                email: updatedUser.email ?? profile.email,
                phone: updatedUser.phone ?? payload.phone,
            };

            setProfile(nextProfile);

            if (typeof setUser === "function") {
                const mergedUser = {
                    ...(user || {}),
                    ...updatedUser,
                };

                setUser(mergedUser);

                localStorage.setItem(
                    "user",
                    JSON.stringify(mergedUser)
                );
            }

            toast.success("تم تحديث بيانات الحساب بنجاح.");
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;

        setPasswordData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const toggleVisibility = (field) => {
        setVisibility((current) => ({
            ...current,
            [field]: !current[field],
        }));
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();

        const {
            old_password,
            new_password,
            confirm_password,
        } = passwordData;

        if (!old_password || !new_password || !confirm_password) {
            toast.error("املأ جميع حقول كلمة المرور.");
            return;
        }

        if (new_password.length < 8) {
            toast.error(
                "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل."
            );
            return;
        }

        if (new_password !== confirm_password) {
            toast.error("تأكيد كلمة المرور غير مطابق.");
            return;
        }

        if (old_password === new_password) {
            toast.error("اختر كلمة مرور مختلفة عن الحالية.");
            return;
        }

        setChangingPassword(true);

        try {
            await changePassword(
                old_password,
                new_password,
                confirm_password
            );

            setPasswordData(initialPassword);

            setVisibility({
                old: false,
                new: false,
                confirm: false,
            });

            toast.success("تم تغيير كلمة المرور بنجاح.");
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setChangingPassword(false);
        }
    };

    const handleLogout = async () => {
        if (loggingOut) return;

        setLoggingOut(true);

        try {
            await logout();
        } catch {
            toast.error("تعذر تسجيل الخروج. حاول مرة أخرى.");
            setLoggingOut(false);
        }
    };

    if (loading) {
        return (
            <main
                dir="rtl"
                className="min-h-[65vh] bg-[#FAF8FC] px-4 py-16"
            >
                <div className="mx-auto max-w-4xl animate-pulse space-y-6">
                    <div className="h-9 w-56 rounded-xl bg-gray-200" />

                    <div className="space-y-5 rounded-3xl border border-gray-100 bg-white p-6 sm:p-8">
                        <div className="h-6 w-40 rounded-lg bg-gray-200" />

                        <div className="grid gap-5 sm:grid-cols-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-14 rounded-2xl bg-gray-100"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#FAF8FC] pb-16"
        >
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
                <header className="mb-8">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#5B2A86] text-white shadow-lg shadow-purple-100">
                            <ShieldCheck size={23} />
                        </div>

                        <span className="text-sm font-bold text-[#5B2A86]">
                            حسابي
                        </span>
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                        إعدادات الحساب
                    </h1>

                    <p className="mt-2 text-sm leading-7 text-gray-500 sm:text-base">
                        عدّل بياناتك الشخصية وحافظ على أمان حسابك.
                    </p>
                </header>

                {/* البيانات الشخصية */}
                <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-8">
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple-50 text-[#5B2A86]">
                            <UserRound size={21} />
                        </div>

                        <div>
                            <h2 className="font-black text-gray-900 sm:text-lg">
                                البيانات الشخصية
                            </h2>

                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                البريد الإلكتروني غير قابل للتعديل من هنا.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSaveProfile}
                        className="space-y-5 p-5 sm:p-8"
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <TextField
                                label="الاسم الأول"
                                name="first_name"
                                value={profile.first_name}
                                onChange={handleProfileChange}
                                icon={<UserRound size={18} />}
                                placeholder="الاسم الأول"
                                required
                            />

                            <TextField
                                label="الاسم الأخير"
                                name="last_name"
                                value={profile.last_name}
                                onChange={handleProfileChange}
                                icon={<UserRound size={18} />}
                                placeholder="الاسم الأخير"
                                required
                            />

                            <TextField
                                label="البريد الإلكتروني"
                                name="email"
                                type="email"
                                value={profile.email}
                                icon={<Mail size={18} />}
                                readOnly
                            />

                            <TextField
                                label="رقم الهاتف"
                                name="phone"
                                type="tel"
                                value={profile.phone}
                                onChange={handleProfileChange}
                                icon={<Phone size={18} />}
                                placeholder="رقم الهاتف"
                            />
                        </div>

                        <div className="flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="flex items-center gap-2 text-xs leading-6 text-gray-500">
                                <CheckCircle2
                                    size={17}
                                    className="shrink-0 text-green-600"
                                />
                                التغييرات تُحفظ عند الضغط على الزر.
                            </p>

                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#5B2A86] px-6 py-3 font-bold text-white transition hover:bg-[#49206E] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {savingProfile ? (
                                    <RefreshCw
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Save size={18} />
                                )}

                                {savingProfile
                                    ? "جاري الحفظ..."
                                    : "حفظ البيانات"}
                            </button>
                        </div>
                    </form>
                </section>

                {/* تغيير كلمة المرور */}
                <section className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-8">
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-600">
                            <KeyRound size={21} />
                        </div>

                        <div>
                            <h2 className="font-black text-gray-900 sm:text-lg">
                                تغيير كلمة المرور
                            </h2>

                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                اختر كلمة مرور قوية يصعب تخمينها.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleChangePassword}
                        className="space-y-5 p-5 sm:p-8"
                    >
                        <PasswordField
                            label="كلمة المرور الحالية"
                            name="old_password"
                            value={passwordData.old_password}
                            visible={visibility.old}
                            onChange={handlePasswordChange}
                            onToggle={() => toggleVisibility("old")}
                            autoComplete="current-password"
                        />

                        <PasswordField
                            label="كلمة المرور الجديدة"
                            name="new_password"
                            value={passwordData.new_password}
                            visible={visibility.new}
                            onChange={handlePasswordChange}
                            onToggle={() => toggleVisibility("new")}
                            autoComplete="new-password"
                        />

                        <PasswordField
                            label="تأكيد كلمة المرور الجديدة"
                            name="confirm_password"
                            value={passwordData.confirm_password}
                            visible={visibility.confirm}
                            onChange={handlePasswordChange}
                            onToggle={() => toggleVisibility("confirm")}
                            autoComplete="new-password"
                        />

                        <div className="rounded-2xl border border-purple-100 bg-purple-50/70 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle
                                    size={19}
                                    className="mt-0.5 shrink-0 text-[#5B2A86]"
                                />

                                <div>
                                    <p className="text-sm font-bold text-gray-800">
                                        نصائح لحماية حسابك
                                    </p>

                                    <ul className="mt-2 space-y-1 text-xs leading-6 text-gray-600">
                                        <li>
                                            استخدم 8 أحرف على الأقل.
                                        </li>
                                        <li>
                                            لا تشارك كلمة المرور مع أي شخص.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-gray-100 pt-5">
                            <button
                                type="submit"
                                disabled={changingPassword}
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-3 font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {changingPassword ? (
                                    <RefreshCw
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <LockKeyhole size={18} />
                                )}

                                {changingPassword
                                    ? "جاري تغيير كلمة المرور..."
                                    : "تغيير كلمة المرور"}
                            </button>
                        </div>
                    </form>
                </section>

                {/* تسجيل الخروج */}
                <section className="mt-6 rounded-3xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600">
                                <LogOut size={20} />
                            </div>

                            <div>
                                <h2 className="font-black text-gray-900">
                                    تسجيل الخروج
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                    إنهاء جلستك الحالية على هذا الجهاز.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loggingOut ? (
                                <RefreshCw
                                    size={18}
                                    className="animate-spin"
                                />
                            ) : (
                                <LogOut size={18} />
                            )}

                            {loggingOut
                                ? "جاري تسجيل الخروج..."
                                : "تسجيل الخروج"}
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}

function TextField({
    label,
    name,
    type = "text",
    value,
    onChange,
    icon,
    placeholder = "",
    required = false,
    readOnly = false,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-bold text-gray-700"
            >
                {label}

                {required && (
                    <span className="mr-1 text-red-500">*</span>
                )}
            </label>

            <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                </span>

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    readOnly={readOnly}
                    autoComplete={
                        name === "email"
                            ? "email"
                            : name === "phone"
                                ? "tel"
                                : "given-name"
                    }
                    className={`w-full rounded-2xl border border-gray-200 py-3.5 pr-11 pl-4 text-sm outline-none transition placeholder:text-gray-400 ${readOnly
                        ? "cursor-not-allowed bg-gray-100 text-gray-500"
                        : "bg-gray-50 focus:border-[#5B2A86] focus:bg-white focus:ring-4 focus:ring-purple-100"
                        }`}
                />
            </div>
        </div>
    );
}

function PasswordField({
    label,
    name,
    value,
    visible,
    onChange,
    onToggle,
    autoComplete,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-bold text-gray-700"
            >
                {label}
            </label>

            <div className="relative">
                <LockKeyhole
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    id={name}
                    name={name}
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                    required
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pr-11 pl-12 text-sm outline-none transition focus:border-[#5B2A86] focus:bg-white focus:ring-4 focus:ring-purple-100"
                />

                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={
                        visible
                            ? "إخفاء كلمة المرور"
                            : "إظهار كلمة المرور"
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#5B2A86]"
                >
                    {visible ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                </button>
            </div>
        </div>
    );
}
