import { useEffect, useMemo, useState } from "react";

import {
    getNotifications,
    markNotificationRead,
    deleteNotification,
} from "../../../services/notifications/notificationService";

import PageHeader from "../../../components/ui/layout/PageHeader";
import SearchBox from "../../../components/ui/forms/SearchBox";
import Loading from "../../../components/ui/feedback/Loading";

import toast from "react-hot-toast";

import {
    RefreshCw,
    Trash2,
    Bell,
    CheckCircle2,
    AlertTriangle,
    Info,
    Check,
    AlertCircle,
    Search,
    BellRing,
    MailOpen,
    Clock3,
    Inbox,
} from "lucide-react";


export default function Notifications() {

    // =========================================================
    // STATE
    // =========================================================

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [readFilter, setReadFilter] = useState("all");


    // =========================================================
    // LOAD NOTIFICATIONS
    // =========================================================

    const loadNotifications = async (showLoader = true) => {

        try {

            if (showLoader) {
                setLoading(true);
            }

            const data = await getNotifications();

            const normalizedData =
                Array.isArray(data)
                    ? data
                    : data?.results || [];

            setNotifications(normalizedData);

        } catch (error) {

            console.error(
                "NOTIFICATIONS ERROR:",
                error
            );

            toast.error(
                "فشل تحميل الإشعارات"
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadNotifications();

    }, []);


    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = async () => {

        try {

            setRefreshing(true);

            await loadNotifications(false);

            toast.success(
                "تم تحديث الإشعارات"
            );

        } finally {

            setRefreshing(false);

        }
    };


    // =========================================================
    // FILTERED NOTIFICATIONS
    // =========================================================

    const filteredNotifications = useMemo(() => {

        let result = [...notifications];

        const searchValue =
            search.trim().toLowerCase();


        // Search
        if (searchValue) {

            result = result.filter(
                (notification) => {

                    const title =
                        notification.title
                            ?.toLowerCase() || "";

                    const message =
                        notification.message
                            ?.toLowerCase() || "";

                    const source =
                        notification.source
                            ?.toLowerCase() || "";

                    const user =
                        notification.user_name
                            ?.toLowerCase() || "";

                    return (
                        title.includes(searchValue) ||
                        message.includes(searchValue) ||
                        source.includes(searchValue) ||
                        user.includes(searchValue)
                    );

                }
            );

        }


        // Type
        if (typeFilter !== "all") {

            result = result.filter(
                (notification) =>
                    notification.type === typeFilter
            );

        }


        // Read status
        if (readFilter === "unread") {

            result = result.filter(
                (notification) =>
                    !notification.is_read
            );

        }

        if (readFilter === "read") {

            result = result.filter(
                (notification) =>
                    notification.is_read
            );

        }


        return result;

    }, [
        notifications,
        search,
        typeFilter,
        readFilter,
    ]);


    // =========================================================
    // STATISTICS
    // =========================================================

    const statistics = useMemo(() => {

        const total =
            notifications.length;

        const unread =
            notifications.filter(
                (item) => !item.is_read
            ).length;

        const read =
            notifications.filter(
                (item) => item.is_read
            ).length;

        const alerts =
            notifications.filter(
                (item) =>
                    item.type === "ALERT" ||
                    item.type === "WARNING"
            ).length;

        return {
            total,
            unread,
            read,
            alerts,
        };

    }, [notifications]);


    // =========================================================
    // MARK SINGLE AS READ
    // =========================================================

    const handleMarkRead = async (id) => {

        try {

            setUpdating(true);

            await markNotificationRead(id);

            setNotifications((previous) =>
                previous.map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            is_read: true,
                        }
                        : item
                )
            );

            toast.success(
                "تم تحديد الإشعار كمقروء"
            );

        } catch (error) {

            console.error(
                "MARK READ ERROR:",
                error
            );

            toast.error(
                "فشل تحديد الإشعار كمقروء"
            );

        } finally {

            setUpdating(false);

        }
    };


    // =========================================================
    // MARK ALL AS READ
    // =========================================================

    const handleMarkAllRead = async () => {

        const unreadNotifications =
            notifications.filter(
                (item) => !item.is_read
            );

        if (!unreadNotifications.length) {

            toast.success(
                "جميع الإشعارات مقروءة بالفعل"
            );

            return;
        }


        try {

            setUpdating(true);

            await Promise.all(
                unreadNotifications.map(
                    (notification) =>
                        markNotificationRead(
                            notification.id
                        )
                )
            );

            setNotifications((previous) =>
                previous.map((item) => ({
                    ...item,
                    is_read: true,
                }))
            );

            toast.success(
                "تم تحديد جميع الإشعارات كمقروءة"
            );

        } catch (error) {

            console.error(
                "MARK ALL READ ERROR:",
                error
            );

            toast.error(
                "فشل تحديث الإشعارات"
            );

        } finally {

            setUpdating(false);

        }
    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "هل أنت متأكد من حذف هذا الإشعار؟"
            );

        if (!confirmed) return;


        try {

            await deleteNotification(id);

            setNotifications((previous) =>
                previous.filter(
                    (item) => item.id !== id
                )
            );

            toast.success(
                "تم حذف الإشعار بنجاح"
            );

        } catch (error) {

            console.error(
                "DELETE NOTIFICATION ERROR:",
                error
            );

            toast.error(
                "فشل حذف الإشعار"
            );

        }
    };


    // =========================================================
    // TYPE CONFIG
    // =========================================================

    const getTypeConfig = (type) => {

        const configs = {

            INFO: {
                label: "معلومات",
                icon: Info,
                iconColor: "text-blue-600",
                iconBg: "bg-blue-100",
                badge:
                    "bg-blue-50 text-blue-700 border-blue-100",
            },

            WARNING: {
                label: "تحذير",
                icon: AlertTriangle,
                iconColor: "text-amber-600",
                iconBg: "bg-amber-100",
                badge:
                    "bg-amber-50 text-amber-700 border-amber-100",
            },

            ALERT: {
                label: "تنبيه",
                icon: AlertCircle,
                iconColor: "text-red-600",
                iconBg: "bg-red-100",
                badge:
                    "bg-red-50 text-red-700 border-red-100",
            },

            SUCCESS: {
                label: "نجاح",
                icon: CheckCircle2,
                iconColor: "text-emerald-600",
                iconBg: "bg-emerald-100",
                badge:
                    "bg-emerald-50 text-emerald-700 border-emerald-100",
            },

        };


        return (
            configs[type] || {
                label: type || "عام",
                icon: Bell,
                iconColor: "text-gray-600",
                iconBg: "bg-gray-100",
                badge:
                    "bg-gray-50 text-gray-700 border-gray-100",
            }
        );

    };


    // =========================================================
    // SOURCE LABEL
    // =========================================================

    const getSourceLabel = (source) => {

        const sources = {

            SYSTEM: "النظام",
            INVENTORY: "المخزون",
            SALES: "المبيعات",
            PURCHASES: "المشتريات",
            PRESCRIPTION: "الروشتات",
            FINANCE: "المالية",
            DELIVERY: "التوصيل",
            USERS: "المستخدمين",
            PRODUCTS: "المنتجات",
            ORDERS: "الطلبات",

        };

        return (
            sources[source] ||
            source ||
            "النظام"
        );

    };


    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        try {

            return new Date(date).toLocaleString(
                "ar-EG",
                {
                    dateStyle: "medium",
                    timeStyle: "short",
                }
            );

        } catch {

            return "-";

        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div
                dir="rtl"
                className="min-h-[500px] flex items-center justify-center"
            >

                <Loading />

            </div>

        );

    }


    // =========================================================
    // UI
    // =========================================================

    return (

        <div
            dir="rtl"
            className="space-y-7 pb-10"
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    bg-gradient-to-l
                    from-[#5B2A86]
                    via-[#6D3A9C]
                    to-[#7B4BB1]
                    rounded-3xl
                    p-6 md:p-8
                    text-white
                    shadow-lg
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                        gap-6
                    "
                >

                    <div>

                        <div
                            className="
                                flex
                                items-center
                                gap-4
                            "
                        >

                            <div
                                className="
                                    w-14
                                    h-14
                                    rounded-2xl
                                    bg-white/15
                                    border
                                    border-white/20
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                <BellRing
                                    size={28}
                                />

                            </div>


                            <div>

                                <h1
                                    className="
                                        text-2xl
                                        md:text-3xl
                                        font-black
                                    "
                                >
                                    الإشعارات
                                </h1>

                                <p
                                    className="
                                        text-white/70
                                        mt-1
                                        text-sm
                                    "
                                >
                                    مركز إدارة ومتابعة
                                    إشعارات النظام
                                </p>

                            </div>

                        </div>

                    </div>


                    <div
                        className="
                            flex
                            flex-wrap
                            gap-3
                        "
                    >

                        {statistics.unread > 0 && (

                            <button
                                onClick={handleMarkAllRead}
                                disabled={updating}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-white
                                    text-[#5B2A86]
                                    font-bold
                                    hover:bg-gray-100
                                    transition
                                    disabled:opacity-50
                                "
                            >

                                <Check
                                    size={18}
                                />

                                قراءة الكل

                            </button>

                        )}


                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2.5
                                rounded-xl
                                bg-white/10
                                border
                                border-white/20
                                hover:bg-white/20
                                transition
                                font-semibold
                                disabled:opacity-50
                            "
                        >

                            <RefreshCw
                                size={18}
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            تحديث

                        </button>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* STATISTICS */}
            {/* ================================================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-5
                "
            >

                {/* TOTAL */}

                <div
                    className="
                        bg-white
                        rounded-2xl
                        border
                        border-gray-100
                        shadow-sm
                        p-5
                        hover:shadow-md
                        transition
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    font-medium
                                "
                            >
                                إجمالي الإشعارات
                            </p>

                            <h2
                                className="
                                    text-3xl
                                    font-black
                                    text-gray-900
                                    mt-2
                                "
                            >
                                {statistics.total}
                            </h2>

                        </div>


                        <div
                            className="
                                w-12
                                h-12
                                rounded-xl
                                bg-purple-100
                                text-[#5B2A86]
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <Inbox size={23} />

                        </div>

                    </div>

                </div>


                {/* UNREAD */}

                <div
                    className="
                        bg-white
                        rounded-2xl
                        border
                        border-gray-100
                        shadow-sm
                        p-5
                        hover:shadow-md
                        transition
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    font-medium
                                "
                            >
                                غير مقروءة
                            </p>

                            <h2
                                className="
                                    text-3xl
                                    font-black
                                    text-gray-900
                                    mt-2
                                "
                            >
                                {statistics.unread}
                            </h2>

                        </div>


                        <div
                            className="
                                w-12
                                h-12
                                rounded-xl
                                bg-red-100
                                text-red-600
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <BellRing size={23} />

                        </div>

                    </div>

                </div>


                {/* READ */}

                <div
                    className="
                        bg-white
                        rounded-2xl
                        border
                        border-gray-100
                        shadow-sm
                        p-5
                        hover:shadow-md
                        transition
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    font-medium
                                "
                            >
                                المقروءة
                            </p>

                            <h2
                                className="
                                    text-3xl
                                    font-black
                                    text-gray-900
                                    mt-2
                                "
                            >
                                {statistics.read}
                            </h2>

                        </div>


                        <div
                            className="
                                w-12
                                h-12
                                rounded-xl
                                bg-emerald-100
                                text-emerald-600
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <MailOpen size={23} />

                        </div>

                    </div>

                </div>


                {/* ALERTS */}

                <div
                    className="
                        bg-white
                        rounded-2xl
                        border
                        border-gray-100
                        shadow-sm
                        p-5
                        hover:shadow-md
                        transition
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    font-medium
                                "
                            >
                                التنبيهات
                            </p>

                            <h2
                                className="
                                    text-3xl
                                    font-black
                                    text-gray-900
                                    mt-2
                                "
                            >
                                {statistics.alerts}
                            </h2>

                        </div>


                        <div
                            className="
                                w-12
                                h-12
                                rounded-xl
                                bg-amber-100
                                text-amber-600
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <AlertTriangle
                                size={23}
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* FILTERS */}
            {/* ================================================= */}

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

                <div
                    className="
                        flex
                        flex-col
                        xl:flex-row
                        gap-4
                    "
                >

                    {/* SEARCH */}

                    <div className="flex-1">

                        <div className="relative">

                            <Search
                                size={18}
                                className="
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />

                            <SearchBox
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="ابحث بعنوان الإشعار أو محتواه..."
                            />

                        </div>

                    </div>


                    {/* TYPE */}

                    <div className="w-full xl:w-52">

                        <select
                            value={typeFilter}
                            onChange={(e) =>
                                setTypeFilter(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                h-12
                                border
                                border-gray-200
                                rounded-xl
                                px-4
                                bg-white
                                text-gray-700
                                outline-none
                                focus:ring-2
                                focus:ring-[#5B2A86]/20
                                focus:border-[#5B2A86]
                                transition
                            "
                        >

                            <option value="all">
                                جميع الأنواع
                            </option>

                            <option value="INFO">
                                معلومات
                            </option>

                            <option value="WARNING">
                                تحذيرات
                            </option>

                            <option value="ALERT">
                                تنبيهات
                            </option>

                            <option value="SUCCESS">
                                نجاح
                            </option>

                        </select>

                    </div>


                    {/* READ STATUS */}

                    <div className="w-full xl:w-52">

                        <select
                            value={readFilter}
                            onChange={(e) =>
                                setReadFilter(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                h-12
                                border
                                border-gray-200
                                rounded-xl
                                px-4
                                bg-white
                                text-gray-700
                                outline-none
                                focus:ring-2
                                focus:ring-[#5B2A86]/20
                                focus:border-[#5B2A86]
                                transition
                            "
                        >

                            <option value="all">
                                كل الإشعارات
                            </option>

                            <option value="unread">
                                غير المقروءة
                            </option>

                            <option value="read">
                                المقروءة
                            </option>

                        </select>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* NOTIFICATIONS */}
            {/* ================================================= */}

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

                {/* SECTION HEADER */}

                <div
                    className="
                        px-6
                        py-5
                        border-b
                        border-gray-100
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-3
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-black
                                text-gray-900
                            "
                        >
                            مركز الإشعارات
                        </h2>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            {filteredNotifications.length}
                            {" "}
                            إشعار ظاهر
                        </p>

                    </div>


                    {statistics.unread > 0 && (

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-3
                                py-2
                                rounded-xl
                                bg-purple-50
                                text-[#5B2A86]
                                text-sm
                                font-bold
                            "
                        >

                            <BellRing size={16} />

                            {statistics.unread}
                            غير مقروءة

                        </div>

                    )}

                </div>


                {/* EMPTY */}

                {filteredNotifications.length === 0 ? (

                    <div
                        className="
                            py-20
                            text-center
                            px-6
                        "
                    >

                        <div
                            className="
                                w-20
                                h-20
                                rounded-3xl
                                bg-gray-100
                                mx-auto
                                flex
                                items-center
                                justify-center
                                text-gray-400
                                mb-5
                            "
                        >

                            <Bell size={34} />

                        </div>

                        <h3
                            className="
                                text-lg
                                font-black
                                text-gray-800
                            "
                        >
                            لا توجد إشعارات
                        </h3>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-2
                            "
                        >
                            لا توجد إشعارات تطابق
                            معايير البحث الحالية.
                        </p>

                    </div>

                ) : (

                    <div>

                        {filteredNotifications.map(
                            (notification) => {

                                const typeInfo =
                                    getTypeConfig(
                                        notification.type
                                    );

                                const TypeIcon =
                                    typeInfo.icon;

                                const unread =
                                    !notification.is_read;


                                return (

                                    <div
                                        key={
                                            notification.id
                                        }
                                        className={`
                                            relative
                                            px-5
                                            md:px-6
                                            py-5
                                            border-b
                                            last:border-b-0
                                            transition-all
                                            ${unread
                                                ? "bg-purple-50/60"
                                                : "bg-white hover:bg-gray-50"
                                            }
                                        `}
                                    >

                                        {/* UNREAD LINE */}

                                        {unread && (

                                            <div
                                                className="
                                                    absolute
                                                    right-0
                                                    top-0
                                                    bottom-0
                                                    w-1
                                                    bg-[#5B2A86]
                                                "
                                            />

                                        )}


                                        <div
                                            className="
                                                flex
                                                items-start
                                                gap-4
                                            "
                                        >

                                            {/* ICON */}

                                            <div
                                                className={`
                                                    w-12
                                                    h-12
                                                    rounded-2xl
                                                    flex
                                                    items-center
                                                    justify-center
                                                    shrink-0
                                                    ${typeInfo.iconBg}
                                                    ${typeInfo.iconColor}
                                                `}
                                            >

                                                <TypeIcon
                                                    size={22}
                                                />

                                            </div>


                                            {/* CONTENT */}

                                            <div
                                                className="
                                                    flex-1
                                                    min-w-0
                                                "
                                            >

                                                {/* TITLE */}

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        flex-wrap
                                                        gap-2
                                                    "
                                                >

                                                    <h3
                                                        className={`
                                                            text-base
                                                            md:text-lg
                                                            ${unread
                                                                ? "font-black text-gray-900"
                                                                : "font-bold text-gray-700"
                                                            }
                                                        `}
                                                    >
                                                        {
                                                            notification.title ||
                                                            "إشعار"
                                                        }
                                                    </h3>


                                                    {unread && (

                                                        <span
                                                            className="
                                                                px-2.5
                                                                py-1
                                                                rounded-full
                                                                bg-[#5B2A86]
                                                                text-white
                                                                text-[11px]
                                                                font-bold
                                                            "
                                                        >
                                                            جديد
                                                        </span>

                                                    )}

                                                </div>


                                                {/* MESSAGE */}

                                                <p
                                                    className="
                                                        text-sm
                                                        text-gray-600
                                                        leading-7
                                                        mt-2
                                                        max-w-4xl
                                                    "
                                                >
                                                    {
                                                        notification.message ||
                                                        "لا يوجد محتوى"
                                                    }
                                                </p>


                                                {/* META */}

                                                <div
                                                    className="
                                                        flex
                                                        flex-wrap
                                                        items-center
                                                        gap-2
                                                        md:gap-3
                                                        mt-3
                                                    "
                                                >

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            px-2.5
                                                            py-1
                                                            rounded-lg
                                                            border
                                                            text-xs
                                                            font-bold
                                                            ${typeInfo.badge}
                                                        `}
                                                    >

                                                        <TypeIcon
                                                            size={13}
                                                        />

                                                        {
                                                            typeInfo.label
                                                        }

                                                    </span>


                                                    <span
                                                        className="
                                                            px-2.5
                                                            py-1
                                                            rounded-lg
                                                            bg-gray-100
                                                            text-gray-600
                                                            text-xs
                                                            font-semibold
                                                        "
                                                    >
                                                        {
                                                            getSourceLabel(
                                                                notification.source
                                                            )
                                                        }
                                                    </span>


                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-1
                                                            text-xs
                                                            text-gray-400
                                                        "
                                                    >

                                                        <Clock3
                                                            size={13}
                                                        />

                                                        {
                                                            formatDate(
                                                                notification.created_at
                                                            )
                                                        }

                                                    </span>


                                                    {notification.user_name && (

                                                        <span
                                                            className="
                                                                text-xs
                                                                text-gray-400
                                                            "
                                                        >
                                                            المستخدم:
                                                            {" "}
                                                            {
                                                                notification.user_name
                                                            }
                                                        </span>

                                                    )}

                                                </div>

                                            </div>


                                            {/* ACTIONS */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1
                                                    shrink-0
                                                "
                                            >

                                                {unread && (

                                                    <button
                                                        onClick={() =>
                                                            handleMarkRead(
                                                                notification.id
                                                            )
                                                        }
                                                        disabled={
                                                            updating
                                                        }
                                                        className="
                                                            w-10
                                                            h-10
                                                            rounded-xl
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-[#5B2A86]
                                                            hover:bg-purple-100
                                                            transition
                                                            disabled:opacity-40
                                                        "
                                                        title="تحديد كمقروء"
                                                    >

                                                        <CheckCircle2
                                                            size={19}
                                                        />

                                                    </button>

                                                )}


                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            notification.id
                                                        )
                                                    }
                                                    className="
                                                        w-10
                                                        h-10
                                                        rounded-xl
                                                        flex
                                                        items-center
                                                        justify-center
                                                        text-red-500
                                                        hover:bg-red-50
                                                        transition
                                                    "
                                                    title="حذف الإشعار"
                                                >

                                                    <Trash2
                                                        size={18}
                                                    />

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>


            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            {notifications.length > 0 && (

                <div
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        text-xs
                        text-gray-400
                        py-2
                    "
                >

                    <CheckCircle2
                        size={14}
                    />

                    نظام الإشعارات يعمل بشكل طبيعي

                </div>

            )}

        </div>

    );

}