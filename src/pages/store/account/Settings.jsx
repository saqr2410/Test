import { useEffect, useState } from "react";
import {
    User,
    Lock,
    Save,
    LogOut,
    Mail,
    Phone,
    ShieldCheck,
    Eye,
    EyeOff,
    CheckCircle2,
} from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext";

import {
    getCurrentUser,
    updateCurrentUser,
    changePassword,
} from "../../../services/users/userService";

import toast from "react-hot-toast";


export default function Settings() {

    const { logout } = useAuth();

    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
    });

    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });


    useEffect(() => {
        loadProfile();
    }, []);


    /* ==========================================
       LOAD PROFILE
    ========================================== */

    const loadProfile = async () => {

        try {

            const data = await getCurrentUser();

            setProfile({
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                email: data.email || "",
                phone: data.phone || "",
            });

        } catch {

            toast.error("تعذر تحميل بيانات الحساب");

        } finally {

            setLoading(false);

        }
    };


    /* ==========================================
       PROFILE HANDLERS
    ========================================== */

    const handleProfileChange = (field, value) => {

        setProfile((prev) => ({
            ...prev,
            [field]: value,
        }));

    };


    const handleSave = async () => {

        if (!profile.first_name.trim()) {
            toast.error("من فضلك أدخل الاسم الأول");
            return;
        }

        if (!profile.email.trim()) {
            toast.error("من فضلك أدخل البريد الإلكتروني");
            return;
        }

        setSavingProfile(true);

        try {

            await updateCurrentUser(profile);

            toast.success("تم تحديث بيانات الحساب بنجاح");

        } catch {

            toast.error("فشل تحديث بيانات الحساب");

        } finally {

            setSavingProfile(false);

        }
    };


    /* ==========================================
       PASSWORD HANDLER
    ========================================== */

    const handlePassword = async () => {

        if (!passwordData.old_password) {
            toast.error("أدخل كلمة المرور الحالية");
            return;
        }

        if (!passwordData.new_password) {
            toast.error("أدخل كلمة المرور الجديدة");
            return;
        }

        if (passwordData.new_password.length < 8) {
            toast.error("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل");
            return;
        }

        if (
            passwordData.new_password !==
            passwordData.confirm_password
        ) {
            toast.error("كلمتا المرور غير متطابقتين");
            return;
        }

        if (
            passwordData.old_password ===
            passwordData.new_password
        ) {
            toast.error(
                "كلمة المرور الجديدة يجب أن تختلف عن الحالية"
            );
            return;
        }

        setChangingPassword(true);

        try {

            await changePassword(passwordData);

            toast.success("تم تغيير كلمة المرور بنجاح");

            setPasswordData({
                old_password: "",
                new_password: "",
                confirm_password: "",
            });

        } catch {

            toast.error("فشل تغيير كلمة المرور");

        } finally {

            setChangingPassword(false);

        }
    };


    /* ==========================================
       PASSWORD FIELD
    ========================================== */

    const PasswordInput = ({
        placeholder,
        value,
        field,
        visible,
        setVisible,
    }) => {

        return (

            <div className="relative">

                <Lock
                    size={18}
                    className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                    "
                />

                <input
                    type={visible ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) =>
                        setPasswordData((prev) => ({
                            ...prev,
                            [field]: e.target.value,
                        }))
                    }
                    className="
                        w-full
                        border
                        border-gray-200
                        bg-gray-50
                        rounded-2xl
                        py-3.5
                        pr-11
                        pl-12
                        outline-none
                        transition
                        focus:border-[#5B2A86]
                        focus:ring-4
                        focus:ring-purple-100
                        focus:bg-white
                    "
                />

                <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        hover:text-[#5B2A86]
                        transition
                    "
                >

                    {visible ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}

                </button>

            </div>
        );
    };


    /* ==========================================
       LOADING
    ========================================== */

    if (loading) {

        return (

            <div
                dir="rtl"
                className="min-h-screen bg-[#FAF8FC] py-16 px-4"
            >

                <div className="max-w-4xl mx-auto">

                    <div className="animate-pulse space-y-6">

                        <div className="h-10 bg-gray-200 rounded-xl w-56" />

                        <div className="bg-white rounded-3xl p-8 space-y-5">

                            <div className="h-6 bg-gray-200 rounded-lg w-40" />

                            <div className="grid md:grid-cols-2 gap-5">

                                <div className="h-14 bg-gray-100 rounded-2xl" />
                                <div className="h-14 bg-gray-100 rounded-2xl" />
                                <div className="h-14 bg-gray-100 rounded-2xl" />
                                <div className="h-14 bg-gray-100 rounded-2xl" />

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    return (

        <div
            dir="rtl"
            className="min-h-screen bg-[#FAF8FC] py-10 md:py-14"
        >

            <div className="max-w-4xl mx-auto px-4 sm:px-6">


                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="mb-8">

                    <div className="flex items-center gap-3 mb-3">

                        <div
                            className="
                                w-11
                                h-11
                                rounded-2xl
                                bg-purple-100
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <ShieldCheck
                                size={23}
                                className="text-[#5B2A86]"
                            />

                        </div>

                        <span className="text-sm font-bold text-[#5B2A86]">
                            حسابي
                        </span>

                    </div>


                    <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                        إعدادات الحساب
                    </h1>

                    <p className="text-gray-500 mt-2">
                        إدارة بياناتك الشخصية وأمان حسابك
                    </p>

                </div>


                {/* ==========================================
                    PERSONAL INFORMATION
                ========================================== */}

                <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

                    <div className="p-6 md:p-8">


                        <div className="flex items-center gap-4 mb-7">

                            <div
                                className="
                                    w-12
                                    h-12
                                    rounded-2xl
                                    bg-purple-50
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                <User
                                    size={22}
                                    className="text-[#5B2A86]"
                                />

                            </div>


                            <div>

                                <h2 className="text-xl font-black text-gray-900">
                                    البيانات الشخصية
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    حدّث بياناتك الأساسية في أي وقت
                                </p>

                            </div>

                        </div>


                        <div className="grid md:grid-cols-2 gap-5">


                            {/* FIRST NAME */}

                            <div>

                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    الاسم الأول
                                </label>

                                <div className="relative">

                                    <User
                                        size={18}
                                        className="
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                        "
                                    />

                                    <input
                                        type="text"
                                        value={profile.first_name}
                                        onChange={(e) =>
                                            handleProfileChange(
                                                "first_name",
                                                e.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            rounded-2xl
                                            py-3.5
                                            pr-11
                                            pl-4
                                            outline-none
                                            transition
                                            focus:border-[#5B2A86]
                                            focus:ring-4
                                            focus:ring-purple-100
                                            focus:bg-white
                                        "
                                    />

                                </div>

                            </div>


                            {/* LAST NAME */}

                            <div>

                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    الاسم الأخير
                                </label>

                                <div className="relative">

                                    <User
                                        size={18}
                                        className="
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                        "
                                    />

                                    <input
                                        type="text"
                                        value={profile.last_name}
                                        onChange={(e) =>
                                            handleProfileChange(
                                                "last_name",
                                                e.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            rounded-2xl
                                            py-3.5
                                            pr-11
                                            pl-4
                                            outline-none
                                            transition
                                            focus:border-[#5B2A86]
                                            focus:ring-4
                                            focus:ring-purple-100
                                            focus:bg-white
                                        "
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div>

                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    البريد الإلكتروني
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                        "
                                    />

                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) =>
                                            handleProfileChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            rounded-2xl
                                            py-3.5
                                            pr-11
                                            pl-4
                                            outline-none
                                            transition
                                            focus:border-[#5B2A86]
                                            focus:ring-4
                                            focus:ring-purple-100
                                            focus:bg-white
                                        "
                                    />

                                </div>

                            </div>


                            {/* PHONE */}

                            <div>

                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    رقم الهاتف
                                </label>

                                <div className="relative">

                                    <Phone
                                        size={18}
                                        className="
                                            absolute
                                            right-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                        "
                                    />

                                    <input
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) =>
                                            handleProfileChange(
                                                "phone",
                                                e.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            rounded-2xl
                                            py-3.5
                                            pr-11
                                            pl-4
                                            outline-none
                                            transition
                                            focus:border-[#5B2A86]
                                            focus:ring-4
                                            focus:ring-purple-100
                                            focus:bg-white
                                        "
                                    />

                                </div>

                            </div>

                        </div>


                        {/* SAVE */}

                        <div className="flex justify-end mt-7">

                            <button
                                onClick={handleSave}
                                disabled={savingProfile}
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    bg-[#5B2A86]
                                    hover:bg-[#4b216f]
                                    disabled:opacity-60
                                    disabled:cursor-not-allowed
                                    text-white
                                    px-7
                                    py-3.5
                                    rounded-2xl
                                    font-bold
                                    shadow-lg
                                    shadow-purple-200
                                    transition
                                "
                            >

                                {savingProfile ? (

                                    <>
                                        <span
                                            className="
                                                w-5
                                                h-5
                                                border-2
                                                border-white/30
                                                border-t-white
                                                rounded-full
                                                animate-spin
                                            "
                                        />

                                        جاري الحفظ...

                                    </>

                                ) : (

                                    <>
                                        <Save size={19} />
                                        حفظ البيانات
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    PASSWORD
                ========================================== */}

                <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden mt-6">

                    <div className="p-6 md:p-8">


                        <div className="flex items-center gap-4 mb-7">

                            <div
                                className="
                                    w-12
                                    h-12
                                    rounded-2xl
                                    bg-amber-50
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                <Lock
                                    size={22}
                                    className="text-amber-600"
                                />

                            </div>


                            <div>

                                <h2 className="text-xl font-black text-gray-900">
                                    تغيير كلمة المرور
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    استخدم كلمة مرور قوية لحماية حسابك
                                </p>

                            </div>

                        </div>


                        <div className="space-y-5">


                            <PasswordInput
                                placeholder="كلمة المرور الحالية"
                                value={passwordData.old_password}
                                field="old_password"
                                visible={showOldPassword}
                                setVisible={setShowOldPassword}
                            />


                            <PasswordInput
                                placeholder="كلمة المرور الجديدة"
                                value={passwordData.new_password}
                                field="new_password"
                                visible={showNewPassword}
                                setVisible={setShowNewPassword}
                            />


                            <PasswordInput
                                placeholder="تأكيد كلمة المرور الجديدة"
                                value={passwordData.confirm_password}
                                field="confirm_password"
                                visible={showConfirmPassword}
                                setVisible={setShowConfirmPassword}
                            />

                        </div>


                        {/* PASSWORD REQUIREMENTS */}

                        <div
                            className="
                                mt-5
                                rounded-2xl
                                bg-gray-50
                                border
                                border-gray-100
                                p-4
                            "
                        >

                            <p className="text-sm font-bold text-gray-700 mb-3">
                                نصائح لكلمة مرور قوية
                            </p>

                            <div className="grid sm:grid-cols-2 gap-2">

                                <div className="flex items-center gap-2 text-sm text-gray-500">

                                    <CheckCircle2
                                        size={16}
                                        className="text-green-500"
                                    />

                                    8 أحرف على الأقل

                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-500">

                                    <CheckCircle2
                                        size={16}
                                        className="text-green-500"
                                    />

                                    استخدم أرقامًا وحروفًا

                                </div>

                            </div>

                        </div>


                        {/* CHANGE PASSWORD */}

                        <div className="flex justify-end mt-7">

                            <button
                                onClick={handlePassword}
                                disabled={changingPassword}
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    bg-gray-900
                                    hover:bg-gray-800
                                    disabled:opacity-60
                                    disabled:cursor-not-allowed
                                    text-white
                                    px-7
                                    py-3.5
                                    rounded-2xl
                                    font-bold
                                    transition
                                "
                            >

                                {changingPassword ? (

                                    <>
                                        <span
                                            className="
                                                w-5
                                                h-5
                                                border-2
                                                border-white/30
                                                border-t-white
                                                rounded-full
                                                animate-spin
                                            "
                                        />

                                        جاري التغيير...

                                    </>

                                ) : (

                                    <>
                                        <Lock size={18} />
                                        تغيير كلمة المرور
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    LOGOUT
                ========================================== */}

                <div className="mt-6">

                    <button
                        onClick={logout}
                        className="
                            w-full
                            bg-white
                            border
                            border-red-100
                            text-red-600
                            hover:bg-red-50
                            py-4
                            rounded-2xl
                            flex
                            items-center
                            justify-center
                            gap-3
                            font-bold
                            transition
                        "
                    >

                        <LogOut size={20} />

                        تسجيل الخروج من الحساب

                    </button>

                </div>


            </div>

        </div>
    );
}