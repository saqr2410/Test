import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    User,
    Store,
    Lock,
    Save,
    Eye,
    EyeOff,
    ShieldCheck,
    Building2,
    Phone,
    MapPin,
    Mail,
    KeyRound,
    CheckCircle2,
    Settings as SettingsIcon,
    RefreshCw,
    Loader2,
} from "lucide-react";

import {
    getProfile,
    updateProfile,
    changePassword,
    getPharmacySettings,
    updatePharmacySettings,
} from "../../../services/settings/settingsService";


export default function Settings() {

    const [activeTab, setActiveTab] = useState("profile");

    const [profile, setProfile] = useState({
        username: "",
        phone: "",
        email: "",
    });

    const [pharmacy, setPharmacy] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
    });

    const [password, setPassword] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(true);
    const [profileSaving, setProfileSaving] = useState(false);
    const [pharmacySaving, setPharmacySaving] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [refreshing, setRefreshing] = useState(false);


    // =========================================================
    // LOAD SETTINGS
    // =========================================================

    const loadSettings = async (showToast = false) => {

        try {

            if (showToast) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const [
                profileData,
                pharmacyData,
            ] = await Promise.all([
                getProfile(),
                getPharmacySettings(),
            ]);

            setProfile({
                username: profileData?.username || "",
                phone: profileData?.phone || "",
                email: profileData?.email || "",
            });

            setPharmacy({
                name: pharmacyData?.name || "",
                address: pharmacyData?.address || "",
                phone: pharmacyData?.phone || "",
                email: pharmacyData?.email || "",
            });

            if (showToast) {
                toast.success("تم تحديث الإعدادات");
            }

        } catch (error) {

            console.error(
                "SETTINGS ERROR:",
                error
            );

            toast.error(
                "فشل تحميل الإعدادات"
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    useEffect(() => {
        loadSettings();
    }, []);


    // =========================================================
    // PROFILE
    // =========================================================

    const saveProfile = async () => {

        if (!profile.username?.trim()) {
            toast.error("اسم المستخدم مطلوب");
            return;
        }

        try {

            setProfileSaving(true);

            const updated = await updateProfile(profile);

            if (updated) {
                setProfile(prev => ({
                    ...prev,
                    ...updated,
                }));
            }

            toast.success(
                "تم تحديث الملف الشخصي بنجاح"
            );

        } catch (error) {

            console.error(
                "PROFILE UPDATE ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.detail ||
                "فشل تحديث الملف الشخصي"
            );

        } finally {

            setProfileSaving(false);

        }
    };


    // =========================================================
    // PHARMACY
    // =========================================================

    const savePharmacy = async () => {

        if (!pharmacy.name?.trim()) {
            toast.error("اسم الصيدلية مطلوب");
            return;
        }

        try {

            setPharmacySaving(true);

            const updated =
                await updatePharmacySettings(
                    pharmacy
                );

            if (updated) {
                setPharmacy(prev => ({
                    ...prev,
                    ...updated,
                }));
            }

            toast.success(
                "تم تحديث بيانات الصيدلية بنجاح"
            );

        } catch (error) {

            console.error(
                "PHARMACY UPDATE ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.detail ||
                "فشل تحديث بيانات الصيدلية"
            );

        } finally {

            setPharmacySaving(false);

        }
    };


    // =========================================================
    // PASSWORD
    // =========================================================

    const savePassword = async () => {

        if (!password.old_password) {
            toast.error(
                "أدخل كلمة المرور القديمة"
            );
            return;
        }

        if (!password.new_password) {
            toast.error(
                "أدخل كلمة المرور الجديدة"
            );
            return;
        }

        if (password.new_password.length < 8) {
            toast.error(
                "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"
            );
            return;
        }

        if (
            password.new_password !==
            password.confirm_password
        ) {
            toast.error(
                "تأكيد كلمة المرور غير مطابق"
            );
            return;
        }

        try {

            setPasswordSaving(true);

            await changePassword({
                old_password:
                    password.old_password,

                new_password:
                    password.new_password,
            });

            setPassword({
                old_password: "",
                new_password: "",
                confirm_password: "",
            });

            toast.success(
                "تم تغيير كلمة المرور بنجاح"
            );

        } catch (error) {

            console.error(
                "PASSWORD ERROR:",
                error
            );

            toast.error(
                error?.response?.data?.detail ||
                "فشل تغيير كلمة المرور"
            );

        } finally {

            setPasswordSaving(false);

        }
    };


    // =========================================================
    // PASSWORD STRENGTH
    // =========================================================

    const getPasswordStrength = () => {

        const value = password.new_password;

        if (!value) {
            return {
                label: "",
                width: "0%",
                className: "",
            };
        }

        let score = 0;

        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[a-z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        if (score <= 2) {
            return {
                label: "ضعيفة",
                width: "35%",
                className: "bg-red-500",
            };
        }

        if (score <= 3) {
            return {
                label: "متوسطة",
                width: "65%",
                className: "bg-yellow-500",
            };
        }

        return {
            label: "قوية",
            width: "100%",
            className: "bg-green-500",
        };
    };


    const passwordStrength =
        getPasswordStrength();


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div
                dir="rtl"
                className="
                    min-h-[500px]
                    flex
                    items-center
                    justify-center
                "
            >

                <div className="text-center">

                    <div
                        className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-[#5B2A86]/10
                            flex
                            items-center
                            justify-center
                            mx-auto
                            mb-4
                        "
                    >
                        <Loader2
                            size={28}
                            className="
                                text-[#5B2A86]
                                animate-spin
                            "
                        />
                    </div>

                    <p className="font-bold text-gray-700">
                        جاري تحميل الإعدادات...
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                        يرجى الانتظار قليلاً
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div
            dir="rtl"
            className="
                min-h-full
                space-y-6
                pb-10
            "
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-4
                "
            >

                <div>

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                w-12
                                h-12
                                rounded-2xl
                                bg-[#5B2A86]
                                text-white
                                flex
                                items-center
                                justify-center
                                shadow-lg
                                shadow-[#5B2A86]/20
                            "
                        >
                            <SettingsIcon size={24} />
                        </div>

                        <div>

                            <h1
                                className="
                                    text-2xl
                                    md:text-3xl
                                    font-black
                                    text-gray-900
                                "
                            >
                                الإعدادات
                            </h1>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >
                                إدارة حسابك وبيانات الصيدلية
                            </p>

                        </div>

                    </div>

                </div>


                <button
                    onClick={() => loadSettings(true)}
                    disabled={refreshing}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        px-4
                        py-2.5
                        rounded-xl
                        bg-white
                        border
                        border-gray-200
                        text-gray-700
                        font-bold
                        hover:bg-gray-50
                        transition
                        disabled:opacity-50
                    "
                >

                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? "animate-spin"
                                : ""
                        }
                    />

                    تحديث

                </button>

            </div>


            {/* ================================================= */}
            {/* OVERVIEW CARDS */}
            {/* ================================================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-4
                "
            >

                <InfoCard
                    icon={<User size={20} />}
                    title="الحساب"
                    value={
                        profile.username ||
                        "غير محدد"
                    }
                    subtitle={
                        profile.email ||
                        "لا يوجد بريد إلكتروني"
                    }
                    iconClass="bg-purple-50 text-[#5B2A86]"
                />

                <InfoCard
                    icon={<Store size={20} />}
                    title="الصيدلية"
                    value={
                        pharmacy.name ||
                        "غير محدد"
                    }
                    subtitle={
                        pharmacy.address ||
                        "لا يوجد عنوان"
                    }
                    iconClass="bg-blue-50 text-blue-600"
                />

                <InfoCard
                    icon={<ShieldCheck size={20} />}
                    title="حالة الحساب"
                    value="الحساب نشط"
                    subtitle="بيانات الحساب مؤمنة"
                    iconClass="bg-green-50 text-green-600"
                />

            </div>


            {/* ================================================= */}
            {/* MAIN SETTINGS */}
            {/* ================================================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    lg:grid-cols-[250px_1fr]
                    gap-6
                    items-start
                "
            >

                {/* ================================================= */}
                {/* SIDEBAR */}
                {/* ================================================= */}

                <div
                    className="
                        bg-white
                        rounded-2xl
                        border
                        border-gray-100
                        shadow-sm
                        p-3
                    "
                >

                    <div
                        className="
                            px-4
                            py-3
                            mb-2
                        "
                    >

                        <p
                            className="
                                text-xs
                                font-bold
                                text-gray-400
                                uppercase
                            "
                        >
                            إعدادات الحساب
                        </p>

                    </div>


                    <TabButton
                        active={activeTab === "profile"}
                        icon={<User size={19} />}
                        title="الملف الشخصي"
                        subtitle="بيانات الحساب"
                        onClick={() =>
                            setActiveTab("profile")
                        }
                    />

                    <TabButton
                        active={activeTab === "pharmacy"}
                        icon={<Store size={19} />}
                        title="بيانات الصيدلية"
                        subtitle="المعلومات الأساسية"
                        onClick={() =>
                            setActiveTab("pharmacy")
                        }
                    />

                    <TabButton
                        active={activeTab === "password"}
                        icon={<Lock size={19} />}
                        title="الأمان"
                        subtitle="تغيير كلمة المرور"
                        onClick={() =>
                            setActiveTab("password")
                        }
                    />

                </div>


                {/* ================================================= */}
                {/* CONTENT */}
                {/* ================================================= */}

                <div>

                    {/* ================================================= */}
                    {/* PROFILE */}
                    {/* ================================================= */}

                    {activeTab === "profile" && (

                        <SettingsCard
                            icon={<User size={21} />}
                            title="الملف الشخصي"
                            subtitle="قم بتحديث بيانات حسابك الشخصية"
                        >

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    gap-5
                                "
                            >

                                <Input
                                    label="اسم المستخدم"
                                    value={
                                        profile.username
                                    }
                                    onChange={e =>
                                        setProfile({
                                            ...profile,
                                            username:
                                                e.target.value,
                                        })
                                    }
                                    icon={<User size={17} />}
                                    required
                                />

                                <Input
                                    label="رقم الهاتف"
                                    value={
                                        profile.phone
                                    }
                                    onChange={e =>
                                        setProfile({
                                            ...profile,
                                            phone:
                                                e.target.value,
                                        })
                                    }
                                    icon={<Phone size={17} />}
                                />

                                <Input
                                    label="البريد الإلكتروني"
                                    value={
                                        profile.email
                                    }
                                    onChange={e =>
                                        setProfile({
                                            ...profile,
                                            email:
                                                e.target.value,
                                        })
                                    }
                                    icon={<Mail size={17} />}
                                    type="email"
                                />

                            </div>


                            <FormFooter
                                text="حفظ التغييرات"
                                loading={profileSaving}
                                onClick={saveProfile}
                            />

                        </SettingsCard>

                    )}


                    {/* ================================================= */}
                    {/* PHARMACY */}
                    {/* ================================================= */}

                    {activeTab === "pharmacy" && (

                        <SettingsCard
                            icon={<Store size={21} />}
                            title="بيانات الصيدلية"
                            subtitle="إدارة المعلومات الأساسية الخاصة بالصيدلية"
                        >

                            <div
                                className="
                                    p-4
                                    rounded-2xl
                                    bg-purple-50
                                    border
                                    border-purple-100
                                    mb-6
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            w-10
                                            h-10
                                            rounded-xl
                                            bg-white
                                            text-[#5B2A86]
                                            flex
                                            items-center
                                            justify-center
                                            shrink-0
                                        "
                                    >
                                        <Building2
                                            size={20}
                                        />
                                    </div>

                                    <div>

                                        <p
                                            className="
                                                font-bold
                                                text-gray-800
                                            "
                                        >
                                            معلومات المنشأة
                                        </p>

                                        <p
                                            className="
                                                text-sm
                                                text-gray-500
                                                mt-1
                                            "
                                        >
                                            تأكد من إدخال بيانات
                                            الصيدلية بشكل صحيح.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    gap-5
                                "
                            >

                                <Input
                                    label="اسم الصيدلية"
                                    value={
                                        pharmacy.name
                                    }
                                    onChange={e =>
                                        setPharmacy({
                                            ...pharmacy,
                                            name:
                                                e.target.value,
                                        })
                                    }
                                    icon={
                                        <Store size={17} />
                                    }
                                    required
                                />

                                <Input
                                    label="رقم الهاتف"
                                    value={
                                        pharmacy.phone
                                    }
                                    onChange={e =>
                                        setPharmacy({
                                            ...pharmacy,
                                            phone:
                                                e.target.value,
                                        })
                                    }
                                    icon={
                                        <Phone size={17} />
                                    }
                                />

                                <Input
                                    label="البريد الإلكتروني"
                                    value={
                                        pharmacy.email
                                    }
                                    onChange={e =>
                                        setPharmacy({
                                            ...pharmacy,
                                            email:
                                                e.target.value,
                                        })
                                    }
                                    icon={
                                        <Mail size={17} />
                                    }
                                    type="email"
                                />

                                <Input
                                    label="العنوان"
                                    value={
                                        pharmacy.address
                                    }
                                    onChange={e =>
                                        setPharmacy({
                                            ...pharmacy,
                                            address:
                                                e.target.value,
                                        })
                                    }
                                    icon={
                                        <MapPin size={17} />
                                    }
                                />

                            </div>


                            <FormFooter
                                text="حفظ بيانات الصيدلية"
                                loading={pharmacySaving}
                                onClick={savePharmacy}
                            />

                        </SettingsCard>

                    )}


                    {/* ================================================= */}
                    {/* PASSWORD */}
                    {/* ================================================= */}

                    {activeTab === "password" && (

                        <SettingsCard
                            icon={<Lock size={21} />}
                            title="الأمان وكلمة المرور"
                            subtitle="حافظ على أمان حسابك باستخدام كلمة مرور قوية"
                        >

                            <div
                                className="
                                    p-4
                                    rounded-2xl
                                    bg-blue-50
                                    border
                                    border-blue-100
                                    mb-6
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            w-10
                                            h-10
                                            rounded-xl
                                            bg-white
                                            text-blue-600
                                            flex
                                            items-center
                                            justify-center
                                            shrink-0
                                        "
                                    >
                                        <ShieldCheck
                                            size={21}
                                        />
                                    </div>

                                    <div>

                                        <p className="font-bold">
                                            حماية الحساب
                                        </p>

                                        <p
                                            className="
                                                text-sm
                                                text-gray-500
                                                mt-1
                                            "
                                        >
                                            استخدم كلمة مرور قوية
                                            تحتوي على أحرف وأرقام
                                            ورموز.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="space-y-5">

                                <PasswordInput
                                    label="كلمة المرور الحالية"
                                    value={
                                        password.old_password
                                    }
                                    visible={
                                        showOldPassword
                                    }
                                    onToggle={() =>
                                        setShowOldPassword(
                                            !showOldPassword
                                        )
                                    }
                                    onChange={e =>
                                        setPassword({
                                            ...password,
                                            old_password:
                                                e.target.value,
                                        })
                                    }
                                />


                                <PasswordInput
                                    label="كلمة المرور الجديدة"
                                    value={
                                        password.new_password
                                    }
                                    visible={
                                        showNewPassword
                                    }
                                    onToggle={() =>
                                        setShowNewPassword(
                                            !showNewPassword
                                        )
                                    }
                                    onChange={e =>
                                        setPassword({
                                            ...password,
                                            new_password:
                                                e.target.value,
                                        })
                                    }
                                />


                                {password.new_password && (

                                    <div className="-mt-2">

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                text-xs
                                                mb-2
                                            "
                                        >

                                            <span className="text-gray-500">
                                                قوة كلمة المرور
                                            </span>

                                            <span
                                                className="
                                                    font-bold
                                                "
                                            >
                                                {
                                                    passwordStrength.label
                                                }
                                            </span>

                                        </div>

                                        <div
                                            className="
                                                h-1.5
                                                rounded-full
                                                bg-gray-100
                                                overflow-hidden
                                            "
                                        >

                                            <div
                                                className={`
                                                    h-full
                                                    rounded-full
                                                    transition-all
                                                    ${passwordStrength.className}
                                                `}
                                                style={{
                                                    width:
                                                        passwordStrength.width,
                                                }}
                                            />

                                        </div>

                                    </div>

                                )}


                                <PasswordInput
                                    label="تأكيد كلمة المرور الجديدة"
                                    value={
                                        password.confirm_password
                                    }
                                    visible={
                                        showConfirmPassword
                                    }
                                    onToggle={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    onChange={e =>
                                        setPassword({
                                            ...password,
                                            confirm_password:
                                                e.target.value,
                                        })
                                    }
                                />

                            </div>


                            <FormFooter
                                text="تغيير كلمة المرور"
                                loading={passwordSaving}
                                onClick={savePassword}
                            />

                        </SettingsCard>

                    )}

                </div>

            </div>

        </div>
    );
}


// =============================================================
// INFO CARD
// =============================================================

function InfoCard({
    icon,
    title,
    value,
    subtitle,
    iconClass,
}) {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                shadow-sm
                p-5
            "
        >

            <div className="flex items-center gap-4">

                <div
                    className={`
                        w-11
                        h-11
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        ${iconClass}
                    `}
                >
                    {icon}
                </div>

                <div className="min-w-0">

                    <p className="text-xs text-gray-400 font-bold">
                        {title}
                    </p>

                    <p
                        className="
                            font-black
                            text-gray-800
                            truncate
                            mt-1
                        "
                    >
                        {value}
                    </p>

                    <p
                        className="
                            text-xs
                            text-gray-400
                            truncate
                            mt-1
                        "
                    >
                        {subtitle}
                    </p>

                </div>

            </div>

        </div>
    );
}


// =============================================================
// TAB BUTTON
// =============================================================

function TabButton({
    active,
    icon,
    title,
    subtitle,
    onClick,
}) {

    return (

        <button
            onClick={onClick}
            className={`
                w-full
                flex
                items-center
                gap-3
                text-right
                p-3
                rounded-xl
                transition
                mb-1
                ${active
                    ? "bg-[#5B2A86] text-white shadow-md shadow-[#5B2A86]/20"
                    : "text-gray-600 hover:bg-gray-50"
                }
            `}
        >

            <div
                className={`
                    w-9
                    h-9
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    shrink-0
                    ${active
                        ? "bg-white/15"
                        : "bg-gray-100"
                    }
                `}
            >
                {icon}
            </div>

            <div className="min-w-0">

                <p className="font-bold text-sm">
                    {title}
                </p>

                <p
                    className={`
                        text-[11px]
                        mt-0.5
                        ${active
                            ? "text-white/70"
                            : "text-gray-400"
                        }
                    `}
                >
                    {subtitle}
                </p>

            </div>

        </button>
    );
}


// =============================================================
// SETTINGS CARD
// =============================================================

function SettingsCard({
    icon,
    title,
    subtitle,
    children,
}) {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                shadow-sm
                overflow-hidden
            "
        >

            <div
                className="
                    px-6
                    py-5
                    border-b
                    border-gray-100
                "
            >

                <div className="flex items-center gap-3">

                    <div
                        className="
                            w-10
                            h-10
                            rounded-xl
                            bg-[#5B2A86]/10
                            text-[#5B2A86]
                            flex
                            items-center
                            justify-center
                        "
                    >
                        {icon}
                    </div>

                    <div>

                        <h2
                            className="
                                font-black
                                text-lg
                                text-gray-900
                            "
                        >
                            {title}
                        </h2>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-0.5
                            "
                        >
                            {subtitle}
                        </p>

                    </div>

                </div>

            </div>


            <div className="p-6">

                {children}

            </div>

        </div>
    );
}


// =============================================================
// INPUT
// =============================================================

function Input({
    label,
    value,
    onChange,
    type = "text",
    icon,
    required = false,
}) {

    return (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-bold
                    text-gray-700
                    mb-2
                "
            >

                {label}

                {required && (
                    <span className="text-red-500 mr-1">
                        *
                    </span>
                )}

            </label>


            <div className="relative">

                {icon && (

                    <div
                        className="
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                            pointer-events-none
                        "
                    >
                        {icon}
                    </div>

                )}


                <input
                    type={type}
                    value={value || ""}
                    onChange={onChange}
                    className="
                        w-full
                        h-12
                        border
                        border-gray-200
                        rounded-xl
                        bg-gray-50
                        px-4
                        pr-11
                        outline-none
                        text-gray-800
                        transition
                        focus:bg-white
                        focus:border-[#5B2A86]
                        focus:ring-4
                        focus:ring-[#5B2A86]/10
                    "
                />

            </div>

        </div>
    );
}


// =============================================================
// PASSWORD INPUT
// =============================================================

function PasswordInput({
    label,
    value,
    onChange,
    visible,
    onToggle,
}) {

    return (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-bold
                    text-gray-700
                    mb-2
                "
            >
                {label}
            </label>


            <div className="relative">

                <KeyRound
                    size={17}
                    className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                    "
                />


                <input
                    type={
                        visible
                            ? "text"
                            : "password"
                    }
                    value={value}
                    onChange={onChange}
                    className="
                        w-full
                        h-12
                        border
                        border-gray-200
                        rounded-xl
                        bg-gray-50
                        px-12
                        outline-none
                        transition
                        focus:bg-white
                        focus:border-[#5B2A86]
                        focus:ring-4
                        focus:ring-[#5B2A86]/10
                    "
                />


                <button
                    type="button"
                    onClick={onToggle}
                    className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        hover:text-gray-700
                    "
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


// =============================================================
// FORM FOOTER
// =============================================================

function FormFooter({
    text,
    loading,
    onClick,
}) {

    return (

        <div
            className="
                mt-8
                pt-5
                border-t
                border-gray-100
                flex
                items-center
                justify-end
            "
        >

            <button
                onClick={onClick}
                disabled={loading}
                className="
                    min-w-[170px]
                    h-12
                    px-6
                    rounded-xl
                    bg-[#5B2A86]
                    text-white
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-lg
                    shadow-[#5B2A86]/20
                    hover:bg-[#4b226e]
                    active:scale-[0.98]
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                "
            >

                {loading ? (

                    <>
                        <Loader2
                            size={18}
                            className="animate-spin"
                        />

                        جاري الحفظ...

                    </>

                ) : (

                    <>
                        <Save size={18} />

                        {text}

                    </>

                )}

            </button>

        </div>
    );
}