
import { useEffect, useState } from "react";

import {
    UserRound,
    Mail,
    Phone,
    MapPin,
    ShieldCheck,
    RefreshCw,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getCurrentUser,
} from "../../../services/users/userService";

import { useAuth } from "../../../contexts/AuthContext";

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
        return "تعذر الاتصال بالخادم. حاول مرة أخرى.";
    }

    return "حدث خطأ أثناء تحميل بيانات الحساب.";
};

const getAvatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name || "Smart Pharmacy"
    )}&background=5B2A86&color=fff&size=240&bold=true`;

export default function Profile() {
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            try {
                const data = await getCurrentUser();

                if (active) {
                    setProfile(data);
                }
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

    if (loading) {
        return (
            <div
                dir="rtl"
                className="grid min-h-[65vh] place-items-center bg-[#FAF8FC] px-4"
            >
                <div className="text-center">
                    <RefreshCw
                        size={36}
                        className="mx-auto mb-4 animate-spin text-[#5B2A86]"
                    />

                    <p className="font-medium text-gray-500">
                        جاري تحميل بيانات حسابك...
                    </p>
                </div>
            </div>
        );
    }

    const firstName = profile?.first_name || "";
    const lastName = profile?.last_name || "";

    const fullName =
        `${firstName} ${lastName}`.trim() ||
        profile?.username ||
        user?.username ||
        "المستخدم";

    const email = profile?.email || user?.email || "";
    const phone = profile?.phone || "";
    const address = profile?.profile?.address || "";

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#FAF8FC] pb-16"
        >
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
                <header className="mb-8">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#5B2A86] text-white shadow-lg shadow-purple-200">
                            <UserRound size={23} />
                        </div>

                        <span className="text-sm font-bold text-[#5B2A86]">
                            حسابي
                        </span>
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                        الملف الشخصي
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
                        اعرض بيانات حسابك المسجلة في الصيدلية.
                        لتعديل بياناتك، انتقل إلى صفحة الإعدادات.
                    </p>
                </header>

                <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                    <aside className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                        <div className="h-28 bg-gradient-to-l from-[#432064] via-[#5B2A86] to-[#8A55B5]" />

                        <div className="-mt-14 px-6 pb-6">
                            <img
                                src={getAvatarUrl(fullName)}
                                alt="الصورة الرمزية للحساب"
                                className="mx-auto h-28 w-28 rounded-full border-4 border-white bg-white shadow-md"
                            />

                            <div className="mt-4 text-center">
                                <h2 className="break-words text-xl font-black text-gray-900">
                                    {fullName}
                                </h2>

                                <p className="mt-2 break-all text-sm text-gray-500">
                                    {email || "لم يُضف بريد إلكتروني"}
                                </p>
                            </div>

                            <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-100 text-green-700">
                                        <ShieldCheck size={21} />
                                    </div>

                                    <div>
                                        <p className="font-bold text-gray-800">
                                            بيانات حسابك
                                        </p>

                                        <p className="mt-1 text-xs leading-6 text-gray-600">
                                            حافظ على سرية كلمة المرور
                                            ولا تشارك بيانات تسجيل الدخول.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 px-5 py-5 sm:px-8">
                            <h2 className="font-black text-gray-900 sm:text-lg">
                                بياناتك الشخصية
                            </h2>

                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                البيانات المسجلة لحسابك
                            </p>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-8">
                            <InfoField
                                label="الاسم الأول"
                                icon={<UserRound size={18} />}
                                value={firstName}
                            />

                            <InfoField
                                label="الاسم الأخير"
                                icon={<UserRound size={18} />}
                                value={lastName}
                            />

                            <InfoField
                                label="البريد الإلكتروني"
                                icon={<Mail size={18} />}
                                value={email}
                                dir="ltr"
                            />

                            <InfoField
                                label="رقم الهاتف"
                                icon={<Phone size={18} />}
                                value={phone}
                                dir="ltr"
                            />

                            <div className="sm:col-span-2">
                                <InfoField
                                    label="العنوان"
                                    icon={<MapPin size={18} />}
                                    value={address}
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-8">
                            <p className="text-sm leading-7 text-gray-500">
                                لتعديل الاسم أو الهاتف أو العنوان،
                                افتح صفحة الإعدادات من حسابك.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

function InfoField({
    label,
    icon,
    value,
    dir = "rtl",
}) {
    return (
        <div>
            <p className="mb-2 text-sm font-bold text-gray-700">
                {label}
            </p>

            <div className="flex min-h-12 items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3.5">
                <span className="mt-0.5 shrink-0 text-[#5B2A86]">
                    {icon}
                </span>

                <p
                    dir={dir}
                    className="min-w-0 flex-1 break-words text-sm leading-6 text-gray-700"
                >
                    {value || "لم تتم إضافة هذه البيانات بعد"}
                </p>
            </div>
        </div>
    );
}
