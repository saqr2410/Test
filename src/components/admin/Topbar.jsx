import {
    Menu,
    Bell,
    LogOut,
    ChevronDown
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";


const ROLE_LABELS = {
    OWNER: "المالك",
    MANAGER: "المدير",
    PHARMACIST: "الصيدلي",
    CASHIER: "الكاشير",
    ACCOUNTANT: "المحاسب",
    DELIVERY: "مندوب التوصيل",
    CUSTOMER: "العميل"
};


export default function Topbar({
    setOpen,
    collapsed,
    setCollapsed
}) {

    const {
        user,
        logout
    } = useAuth();


    const handleSidebarToggle = () => {

        if (window.innerWidth >= 1024) {
            setCollapsed(!collapsed);
            return;
        }

        setOpen(true);
    };


    const userName = user?.username || "المستخدم";

    const roleLabel =
        ROLE_LABELS[user?.role] || "مستخدم";


    return (

        <header
            dir="rtl"
            className="
                h-[76px]
                bg-white
                border-b
                border-gray-100
                sticky
                top-0
                z-40
                flex
                items-center
                justify-between
                px-4
                md:px-7
            "
        >

            {/* ================= RIGHT ================= */}

            <div
                className="
                    flex
                    items-center
                    gap-4
                "
            >

                {/* Menu */}

                <button
                    type="button"
                    onClick={handleSidebarToggle}
                    title={
                        collapsed
                            ? "إظهار القائمة"
                            : "إخفاء القائمة"
                    }
                    className="
                        group
                        w-11
                        h-11
                        rounded-xl
                        bg-gray-50
                        border
                        border-gray-100
                        flex
                        items-center
                        justify-center
                        text-gray-600
                        hover:bg-purple-50
                        hover:text-[#5B2A86]
                        hover:border-purple-100
                        transition-all
                        duration-200
                    "
                >

                    <Menu
                        size={22}
                        className="
                            transition-transform
                            duration-200
                            group-hover:scale-105
                        "
                    />

                </button>


                {/* Page Info */}

                <div className="leading-none">

                    <h1
                        className="
                            text-lg
                            md:text-xl
                            font-black
                            text-gray-900
                            tracking-tight
                        "
                    >
                        لوحة التحكم
                    </h1>

                    <p
                        className="
                            hidden
                            md:block
                            text-xs
                            text-gray-400
                            mt-2
                            font-medium
                        "
                    >
                        إدارة ومتابعة عمليات الصيدلية
                    </p>

                </div>

            </div>


            {/* ================= LEFT ================= */}

            <div
                className="
                    flex
                    items-center
                    gap-2
                    md:gap-4
                "
            >

                {/* Notification */}

                <button
                    type="button"
                    title="الإشعارات"
                    className="
                        relative
                        w-11
                        h-11
                        rounded-xl
                        bg-gray-50
                        border
                        border-gray-100
                        flex
                        items-center
                        justify-center
                        text-gray-600
                        hover:bg-purple-50
                        hover:text-[#5B2A86]
                        hover:border-purple-100
                        transition-all
                        duration-200
                    "
                >

                    <Bell size={20} />

                    {/* Notification Badge */}

                    <span
                        className="
                            absolute
                            top-[9px]
                            right-[9px]
                            w-[7px]
                            h-[7px]
                            rounded-full
                            bg-red-500
                            ring-2
                            ring-white
                        "
                    />

                </button>


                {/* Divider */}

                <div
                    className="
                        hidden
                        md:block
                        h-9
                        w-px
                        bg-gray-100
                    "
                />


                {/* User */}

                <div
                    className="
                        hidden
                        sm:flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            text-right
                            leading-none
                        "
                    >

                        <p
                            className="
                                text-sm
                                md:text-[15px]
                                font-black
                                text-gray-900
                            "
                        >
                            {userName}
                        </p>

                        <div
                            className="
                                flex
                                items-center
                                justify-end
                                gap-1.5
                                mt-2
                            "
                        >

                            <span
                                className="
                                    w-1.5
                                    h-1.5
                                    rounded-full
                                    bg-green-500
                                "
                            />

                            <span
                                className="
                                    text-[11px]
                                    md:text-xs
                                    font-semibold
                                    text-gray-400
                                "
                            >
                                {roleLabel}
                            </span>

                        </div>

                    </div>


                    <ChevronDown
                        size={16}
                        className="
                            text-gray-300
                        "
                    />

                </div>


                {/* Logout */}

                <button
                    type="button"
                    onClick={logout}
                    title="تسجيل الخروج"
                    className="
                        group
                        h-11
                        w-11
                        md:w-auto
                        md:px-4
                        rounded-xl
                        bg-red-50
                        border
                        border-red-100
                        text-red-600
                        flex
                        items-center
                        justify-center
                        gap-2
                        font-bold
                        text-sm
                        hover:bg-red-500
                        hover:text-white
                        hover:border-red-500
                        transition-all
                        duration-200
                    "
                >

                    <LogOut
                        size={18}
                        className="
                            transition-transform
                            duration-200
                            group-hover:-translate-x-0.5
                        "
                    />

                    <span className="hidden md:block">
                        تسجيل الخروج
                    </span>

                </button>

            </div>

        </header>

    );
}