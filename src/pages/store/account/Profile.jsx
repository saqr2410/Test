import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Camera,
    Save,
    ShieldCheck,
    Pencil,
    CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

import {
    getCurrentUser,
    updateCurrentUser,
} from "../../../services/users/userService";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        profile: {
            address: "",
        },
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getCurrentUser();

            setForm({
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                email: data.email || "",
                phone: data.phone || "",
                profile: {
                    address: data.profile?.address || "",
                },
            });
        } catch (error) {
            toast.error("فشل تحميل بيانات الحساب");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "address") {
            setForm((prev) => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    address: value,
                },
            }));

            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const saveProfile = async () => {
        if (!form.first_name.trim()) {
            toast.error("من فضلك أدخل الاسم الأول");
            return;
        }

        if (!form.last_name.trim()) {
            toast.error("من فضلك أدخل الاسم الأخير");
            return;
        }

        if (!form.email.trim()) {
            toast.error("من فضلك أدخل البريد الإلكتروني");
            return;
        }

        try {
            setSaving(true);

            await updateCurrentUser(form);

            toast.success("تم تحديث بيانات حسابك بنجاح");
        } catch (error) {
            toast.error(
                error?.response?.data?.detail ||
                "حدث خطأ أثناء حفظ البيانات"
            );
        } finally {
            setSaving(false);
        }
    };

    const fullName =
        `${form.first_name} ${form.last_name}`.trim() || "المستخدم";

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fullName
    )}&background=5B2A86&color=fff&size=200&bold=true`;

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-100 border-t-[#5B2A86] rounded-full animate-spin" />

                    <p className="text-gray-500 font-medium">
                        جاري تحميل بيانات حسابك...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-gradient-to-b from-purple-50/70 via-white to-white"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                {/* ==========================================
                    Page Header
                ========================================== */}

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#5B2A86] text-white flex items-center justify-center shadow-lg shadow-purple-200">
                            <User size={22} />
                        </div>

                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                                الملف الشخصي
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                إدارة وتحديث بيانات حسابك الشخصية
                            </p>
                        </div>
                    </div>
                </div>

                {/* ==========================================
                    Main Layout
                ========================================== */}

                <div className="grid lg:grid-cols-[320px_1fr] gap-6">
                    {/* ==========================================
                        Profile Card
                    ========================================== */}

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-fit">
                        <div className="h-24 bg-gradient-to-l from-[#5B2A86] to-[#7B3FB0]" />

                        <div className="px-6 pb-6 -mt-14">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <img
                                        src={avatarUrl}
                                        alt="Profile"
                                        className="w-28 h-28 rounded-full border-4 border-white shadow-xl bg-white"
                                    />

                                    <button
                                        type="button"
                                        className="
                                            absolute
                                            bottom-1
                                            left-1
                                            w-10
                                            h-10
                                            rounded-full
                                            bg-[#5B2A86]
                                            text-white
                                            flex
                                            items-center
                                            justify-center
                                            border-4
                                            border-white
                                            shadow-md
                                            hover:bg-[#6C2EA8]
                                            transition
                                        "
                                        title="تغيير الصورة"
                                    >
                                        <Camera size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="text-center mt-4">
                                <h2 className="text-xl font-black text-gray-900">
                                    {fullName}
                                </h2>

                                <p className="text-sm text-gray-500 mt-1 break-all">
                                    {form.email || "لا يوجد بريد إلكتروني"}
                                </p>
                            </div>

                            {/* Account Status */}

                            <div className="mt-6 p-4 rounded-2xl bg-green-50 border border-green-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                                        <ShieldCheck size={19} />
                                    </div>

                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">
                                            الحساب نشط
                                        </p>

                                        <p className="text-xs text-gray-500 mt-0.5">
                                            بيانات الحساب محفوظة بأمان
                                        </p>
                                    </div>

                                    <CheckCircle2
                                        size={18}
                                        className="mr-auto text-green-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ==========================================
                        Personal Information
                    ========================================== */}

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Card Header */}

                        <div className="px-6 sm:px-8 py-6 border-b border-gray-100 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-black text-gray-900">
                                    المعلومات الشخصية
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    قم بتعديل بياناتك الشخصية من هنا
                                </p>
                            </div>

                            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-purple-50 text-[#5B2A86] items-center justify-center">
                                <Pencil size={18} />
                            </div>
                        </div>

                        {/* Form */}

                        <div className="p-6 sm:p-8">
                            <div className="grid md:grid-cols-2 gap-5">
                                <Input
                                    icon={<User size={18} />}
                                    label="الاسم الأول"
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    placeholder="أدخل الاسم الأول"
                                />

                                <Input
                                    icon={<User size={18} />}
                                    label="الاسم الأخير"
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    placeholder="أدخل الاسم الأخير"
                                />

                                <Input
                                    icon={<Mail size={18} />}
                                    label="البريد الإلكتروني"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                />

                                <Input
                                    icon={<Phone size={18} />}
                                    label="رقم الهاتف"
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="01xxxxxxxxx"
                                />
                            </div>

                            {/* Address */}

                            <div className="mt-5">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2.5">
                                    <span className="text-[#5B2A86]">
                                        <MapPin size={18} />
                                    </span>

                                    العنوان
                                </label>

                                <div className="relative">
                                    <MapPin
                                        size={18}
                                        className="
                                            absolute
                                            right-4
                                            top-4
                                            text-gray-400
                                        "
                                    />

                                    <textarea
                                        name="address"
                                        value={form.profile.address}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="أدخل عنوانك بالتفصيل"
                                        className="
                                            w-full
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            rounded-2xl
                                            pr-11
                                            pl-4
                                            py-3.5
                                            text-gray-800
                                            placeholder:text-gray-400
                                            outline-none
                                            resize-none
                                            transition
                                            focus:bg-white
                                            focus:border-[#5B2A86]
                                            focus:ring-4
                                            focus:ring-purple-100
                                        "
                                    />
                                </div>
                            </div>

                            {/* Save */}

                            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
                                <p className="text-xs text-gray-400">
                                    تأكد من صحة البيانات قبل حفظ التعديلات
                                </p>

                                <button
                                    type="button"
                                    onClick={saveProfile}
                                    disabled={saving}
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        bg-[#5B2A86]
                                        hover:bg-[#6C2EA8]
                                        disabled:bg-purple-300
                                        text-white
                                        px-7
                                        py-3.5
                                        rounded-2xl
                                        font-bold
                                        shadow-lg
                                        shadow-purple-200
                                        hover:shadow-xl
                                        transition-all
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    {saving ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            جاري الحفظ...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            حفظ التعديلات
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ==========================================
   Input Component
========================================== */

function Input({
    icon,
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
}) {
    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2.5">
                <span className="text-[#5B2A86]">{icon}</span>

                {label}
            </label>

            <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                </span>

                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="
                        w-full
                        border
                        border-gray-200
                        bg-gray-50
                        rounded-2xl
                        pr-11
                        pl-4
                        py-3.5
                        text-gray-800
                        placeholder:text-gray-400
                        outline-none
                        transition
                        focus:bg-white
                        focus:border-[#5B2A86]
                        focus:ring-4
                        focus:ring-purple-100
                    "
                />
            </div>
        </div>
    );
}