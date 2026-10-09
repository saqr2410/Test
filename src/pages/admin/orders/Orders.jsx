import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    getOrders,
    updateOrderStatus,
    cancelOrder,
} from "../../../services/orders/orderService";

import PageHeader from "../../../components/ui/layout/PageHeader";

import SearchBox from "../../../components/ui/forms/SearchBox";

import Loading from "../../../components/ui/feedback/Loading";

import toast from "react-hot-toast";

import {
    Eye,
    CheckCircle2,
    XCircle,
    Clock3,
    Truck,
    PackageCheck,
    RefreshCw,
    Store,
    Search,
    MoreVertical,
    ShoppingBag,
    ArrowUpRight,
    Ban,
    ChevronDown,
} from "lucide-react";


const PAGE_SIZE = 20;


const TABS = [
    {
        key: "active",
        label: "الطلبات النشطة",
    },
    {
        key: "completed",
        label: "المكتملة",
    },
    {
        key: "cancelled",
        label: "الملغية",
    },
];


export default function Orders() {

    const navigate = useNavigate();


    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);


    const [activeTab, setActiveTab] = useState(
        "active"
    );


    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState(
        "all"
    );

    const [deliveryFilter, setDeliveryFilter] =
        useState("all");


    const [page, setPage] = useState(1);

    const [totalOrders, setTotalOrders] =
        useState(0);

    const [totalPages, setTotalPages] =
        useState(1);


    const [updatingId, setUpdatingId] =
        useState(null);

    const [openMenu, setOpenMenu] =
        useState(null);


    /* ==========================================
       LOAD ORDERS
    ========================================== */

    const loadOrders = async (
        showLoader = true
    ) => {

        try {

            if (showLoader) {

                setLoading(true);

            } else {

                setRefreshing(true);

            }


            const params = {
                tab: activeTab,
                page,
                page_size: PAGE_SIZE,
            };


            if (search.trim()) {

                params.search =
                    search.trim();

            }


            if (
                statusFilter !==
                "all"
            ) {

                params.status =
                    statusFilter;

            }


            if (
                deliveryFilter !==
                "all"
            ) {

                params.delivery_method =
                    deliveryFilter;

            }


            const data = await getOrders(
                params
            );


            if (
                Array.isArray(data)
            ) {

                setOrders(data);

                setTotalOrders(
                    data.length
                );

                setTotalPages(1);

            } else {

                setOrders(
                    data?.results || []
                );

                setTotalOrders(
                    data?.count || 0
                );

                setTotalPages(
                    Math.max(
                        1,
                        Math.ceil(
                            (
                                data?.count ||
                                0
                            ) /
                            PAGE_SIZE
                        )
                    )
                );

            }

        } catch (error) {

            console.error(
                "Orders Error:",
                error
            );


            toast.error(
                "فشل تحميل الطلبات"
            );

        } finally {

            setLoading(false);

            setRefreshing(false);

        }

    };


    /* ==========================================
       LOAD ON FILTER / TAB / PAGE
    ========================================== */

    useEffect(() => {

        loadOrders();

    }, [
        activeTab,
        page,
        statusFilter,
        deliveryFilter,
    ]);


    /* ==========================================
       SEARCH DEBOUNCE
    ========================================== */

    useEffect(() => {

        const timer = setTimeout(
            () => {

                if (page !== 1) {

                    setPage(1);

                    return;

                }


                loadOrders();

            },
            450
        );


        return () => {

            clearTimeout(timer);

        };

    }, [search]);


    /* ==========================================
       CLOSE MENU
    ========================================== */

    useEffect(() => {

        const handleClickOutside = () => {

            setOpenMenu(null);

        };


        document.addEventListener(
            "click",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "click",
                handleClickOutside
            );

        };

    }, []);


    /* ==========================================
       STATISTICS
    ========================================== */

    const statistics = useMemo(() => {

        const pending =
            orders.filter(
                (order) =>
                    order.status ===
                    "PENDING"
            ).length;


        const processing =
            orders.filter(
                (order) =>
                    order.status ===
                    "PROCESSING"
            ).length;


        const ready =
            orders.filter(
                (order) =>
                    order.status ===
                    "READY"
            ).length;


        const shipped =
            orders.filter(
                (order) =>
                    order.status ===
                    "SHIPPED"
            ).length;


        const revenue =
            orders
                .filter(
                    (order) =>
                        order.status !==
                        "CANCELLED"
                )
                .reduce(
                    (
                        sum,
                        order
                    ) =>
                        sum +
                        Number(
                            order.total_price ||
                            0
                        ),
                    0
                );


        return {
            pending,
            processing,
            ready,
            shipped,
            revenue,
        };

    }, [orders]);


    /* ==========================================
       STATUS INFO
    ========================================== */

    const getStatusInfo = (
        status
    ) => {

        const statusMap = {

            PENDING: {
                label: "قيد الانتظار",
                icon: Clock3,
                classes:
                    "bg-amber-50 text-amber-700 border-amber-200",
                dot:
                    "bg-amber-500",
            },

            PROCESSING: {
                label: "قيد التجهيز",
                icon: PackageCheck,
                classes:
                    "bg-purple-50 text-purple-700 border-purple-200",
                dot:
                    "bg-purple-500",
            },

            READY: {
                label: "جاهز للاستلام",
                icon: CheckCircle2,
                classes:
                    "bg-emerald-50 text-emerald-700 border-emerald-200",
                dot:
                    "bg-emerald-500",
            },

            SHIPPED: {
                label: "جاري التوصيل",
                icon: Truck,
                classes:
                    "bg-blue-50 text-blue-700 border-blue-200",
                dot:
                    "bg-blue-500",
            },

            COMPLETED: {
                label: "مكتمل",
                icon: CheckCircle2,
                classes:
                    "bg-teal-50 text-teal-700 border-teal-200",
                dot:
                    "bg-teal-500",
            },

            CANCELLED: {
                label: "ملغي",
                icon: XCircle,
                classes:
                    "bg-red-50 text-red-700 border-red-200",
                dot:
                    "bg-red-500",
            },

        };


        return (
            statusMap[status] || {
                label:
                    status ||
                    "غير معروف",

                icon: Clock3,

                classes:
                    "bg-gray-50 text-gray-700 border-gray-200",

                dot:
                    "bg-gray-400",
            }
        );

    };


    /* ==========================================
       DELIVERY INFO
    ========================================== */

    const getDeliveryInfo = (
        method
    ) => {

        if (
            method ===
            "DELIVERY"
        ) {

            return {

                label: "توصيل",

                icon: Truck,

                classes:
                    "text-blue-600 bg-blue-50",

            };

        }


        return {

            label:
                "استلام من الصيدلية",

            icon: Store,

            classes:
                "text-purple-600 bg-purple-50",

        };

    };


    /* ==========================================
       NEXT STATUS
    ========================================== */

    const getNextStatus = (
        status,
        deliveryMethod
    ) => {

        if (
            deliveryMethod ===
            "DELIVERY"
        ) {

            const statuses = {

                PENDING:
                    "PROCESSING",

                PROCESSING:
                    "SHIPPED",

                SHIPPED:
                    "COMPLETED",

            };


            return (
                statuses[status] ||
                null
            );

        }


        const statuses = {

            PENDING:
                "PROCESSING",

            PROCESSING:
                "READY",

            READY:
                "COMPLETED",

        };


        return (
            statuses[status] ||
            null
        );

    };


    /* ==========================================
       NEXT STATUS LABEL
    ========================================== */

    const getNextStatusLabel = (
        status,
        deliveryMethod
    ) => {

        if (
            deliveryMethod ===
            "DELIVERY"
        ) {

            const labels = {

                PENDING:
                    "بدء التجهيز",

                PROCESSING:
                    "بدء التوصيل",

                SHIPPED:
                    "تأكيد الاستلام",

            };


            return labels[status];

        }


        const labels = {

            PENDING:
                "بدء التجهيز",

            PROCESSING:
                "تأكيد الجاهزية",

            READY:
                "تأكيد الاستلام",

        };


        return labels[status];

    };


    /* ==========================================
       NEXT ICON
    ========================================== */

    const getNextStatusIcon = (
        status,
        deliveryMethod
    ) => {

        const nextStatus =
            getNextStatus(
                status,
                deliveryMethod
            );


        const icons = {

            PROCESSING:
                PackageCheck,

            READY:
                CheckCircle2,

            SHIPPED:
                Truck,

            COMPLETED:
                CheckCircle2,

        };


        return (
            icons[nextStatus] ||
            ArrowUpRight
        );

    };


    /* ==========================================
       CHANGE STATUS
    ========================================== */

    const changeStatus = async (
        id,
        newStatus
    ) => {

        try {

            setUpdatingId(id);

            setOpenMenu(null);


            await updateOrderStatus(
                id,
                newStatus
            );


            toast.success(
                `تم تحديث حالة الطلب #${id}`
            );


            await loadOrders(
                false
            );

        } catch (error) {

            console.error(
                "Update Status Error:",
                error
            );


            toast.error(
                error?.response?.data?.detail ||
                error?.response?.data?.error ||
                "فشل تحديث حالة الطلب"
            );

        } finally {

            setUpdatingId(null);

        }

    };


    /* ==========================================
       NEXT STATUS
    ========================================== */

    const handleNextStatus = async (
        order
    ) => {

        const nextStatus =
            getNextStatus(
                order.status,
                order.delivery_method
            );


        if (!nextStatus) {

            return;

        }


        await changeStatus(
            order.id,
            nextStatus
        );

    };


    /* ==========================================
       CANCEL
    ========================================== */

    const handleCancel = async (
        id
    ) => {

        setOpenMenu(null);


        const confirmed =
            window.confirm(
                `هل أنت متأكد من إلغاء الطلب #${id}؟`
            );


        if (!confirmed) {

            return;

        }


        try {

            setUpdatingId(id);


            await cancelOrder(
                id,
                "تم إلغاء الطلب بواسطة الإدارة"
            );


            toast.success(
                `تم إلغاء الطلب #${id}`
            );


            await loadOrders(
                false
            );

        } catch (error) {

            console.error(
                "Cancel Error:",
                error
            );


            toast.error(
                error?.response?.data?.detail ||
                error?.response?.data?.error ||
                "فشل إلغاء الطلب"
            );

        } finally {

            setUpdatingId(null);

        }

    };


    /* ==========================================
       FORMAT MONEY
    ========================================== */

    const formatMoney = (
        value
    ) => {

        return Number(
            value || 0
        ).toLocaleString(
            "ar-EG",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );

    };


    /* ==========================================
       FORMAT DATE
    ========================================== */

    const formatDate = (
        date
    ) => {

        if (!date) {

            return "-";

        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "-";

        }


        return parsedDate.toLocaleDateString(
            "ar-EG",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );

    };


    const formatTime = (
        date
    ) => {

        if (!date) {

            return "";

        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "";

        }


        return parsedDate.toLocaleTimeString(
            "ar-EG",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    /* ==========================================
       PAGE CHANGE
    ========================================== */

    const changePage = (
        newPage
    ) => {

        if (
            newPage < 1 ||
            newPage > totalPages
        ) {

            return;

        }


        setPage(
            newPage
        );

    };


    /* ==========================================
       RESET FILTERS
    ========================================== */

    const resetFilters = () => {

        setSearch("");

        setStatusFilter(
            "all"
        );

        setDeliveryFilter(
            "all"
        );

        setPage(1);

    };


    /* ==========================================
       TAB CHANGE
    ========================================== */

    const handleTabChange = (
        tab
    ) => {

        setActiveTab(
            tab
        );

        setPage(1);

        setSearch("");

        setStatusFilter(
            "all"
        );

        setDeliveryFilter(
            "all"
        );

    };


    /* ==========================================
       LOADING
    ========================================== */

    if (loading) {

        return (

            <div
                className="
                    min-h-[500px]
                    flex
                    items-center
                    justify-center
                "
            >

                <Loading />

            </div>

        );

    }


    return (

        <div
            dir="rtl"
            className="
                space-y-6
                pb-10
            "
        >

            {/* HEADER */}

            <PageHeader
                title="إدارة الطلبات"
                subtitle="
                    متابعة وتنفيذ طلبات العملاء
                "
                action={

                    <button
                        onClick={() =>
                            loadOrders(
                                false
                            )
                        }
                        disabled={
                            refreshing
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            px-4
                            py-2.5
                            rounded-xl
                            bg-white
                            border
                            border-gray-200
                            text-gray-700
                            font-bold
                            shadow-sm
                            hover:bg-gray-50
                            transition
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

                }
            />


            {/* STATS */}

            <div
                className="
                    grid
                    grid-cols-2
                    lg:grid-cols-4
                    gap-4
                "
            >

                <StatCard
                    title="طلبات الصفحة"
                    value={
                        totalOrders
                    }
                    icon={
                        ShoppingBag
                    }
                    iconClass="
                        bg-purple-100
                        text-[#5B2A86]
                    "
                />


                <StatCard
                    title="قيد الانتظار"
                    value={
                        statistics.pending
                    }
                    icon={
                        Clock3
                    }
                    iconClass="
                        bg-amber-100
                        text-amber-600
                    "
                />


                <StatCard
                    title="قيد التنفيذ"
                    value={
                        statistics.processing +
                        statistics.ready +
                        statistics.shipped
                    }
                    icon={
                        PackageCheck
                    }
                    iconClass="
                        bg-blue-100
                        text-blue-600
                    "
                />


                <StatCard
                    title="إجمالي الصفحة"
                    value={`
                        ${formatMoney(
                        statistics.revenue
                    )} ج
                    `}
                    icon={
                        ArrowUpRight
                    }
                    iconClass="
                        bg-emerald-100
                        text-emerald-600
                    "
                />

            </div>


            {/* TABS */}

            <div
                className="
                    bg-white
                    rounded-2xl
                    border
                    shadow-sm
                    p-2
                "
            >

                <div
                    className="
                        grid
                        grid-cols-3
                        gap-2
                    "
                >

                    {TABS.map(
                        (tab) => {

                            const active =
                                activeTab ===
                                tab.key;


                            return (

                                <button
                                    key={
                                        tab.key
                                    }
                                    onClick={() =>
                                        handleTabChange(
                                            tab.key
                                        )
                                    }
                                    className={`
                                        py-3
                                        px-4
                                        rounded-xl
                                        text-sm
                                        font-black
                                        transition
                                        ${active
                                            ? "bg-[#5B2A86] text-white shadow-md"
                                            : "text-gray-500 hover:bg-gray-50"
                                        }
                                    `}
                                >

                                    {
                                        tab.label
                                    }

                                </button>

                            );

                        }
                    )}

                </div>

            </div>


            {/* FILTERS */}

            <div
                className="
                    bg-white
                    rounded-2xl
                    border
                    shadow-sm
                    p-4
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

                    <div className="flex-1">

                        <SearchBox
                            value={
                                search
                            }
                            onChange={(
                                e
                            ) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="
                                ابحث برقم الطلب، اسم العميل أو الهاتف...
                            "
                        />

                    </div>


                    <FilterSelect
                        value={
                            statusFilter
                        }
                        onChange={
                            setStatusFilter
                        }
                        options={[
                            {
                                value:
                                    "all",
                                label:
                                    "كل الحالات",
                            },
                            {
                                value:
                                    "PENDING",
                                label:
                                    "قيد الانتظار",
                            },
                            {
                                value:
                                    "PROCESSING",
                                label:
                                    "قيد التجهيز",
                            },
                            {
                                value:
                                    "READY",
                                label:
                                    "جاهز للاستلام",
                            },
                            {
                                value:
                                    "SHIPPED",
                                label:
                                    "جاري التوصيل",
                            },
                            {
                                value:
                                    "COMPLETED",
                                label:
                                    "مكتمل",
                            },
                            {
                                value:
                                    "CANCELLED",
                                label:
                                    "ملغي",
                            },
                        ]}
                    />


                    <FilterSelect
                        value={
                            deliveryFilter
                        }
                        onChange={
                            setDeliveryFilter
                        }
                        options={[
                            {
                                value:
                                    "all",
                                label:
                                    "كل طرق الاستلام",
                            },
                            {
                                value:
                                    "DELIVERY",
                                label:
                                    "توصيل",
                            },
                            {
                                value:
                                    "PICKUP",
                                label:
                                    "استلام من الصيدلية",
                            },
                        ]}
                    />

                </div>


                {(search ||
                    statusFilter !==
                    "all" ||
                    deliveryFilter !==
                    "all") && (

                        <div
                            className="
                            flex
                            justify-end
                            mt-3
                        "
                        >

                            <button
                                onClick={
                                    resetFilters
                                }
                                className="
                                text-sm
                                font-bold
                                text-[#5B2A86]
                                hover:underline
                            "
                            >

                                مسح الفلاتر

                            </button>

                        </div>

                    )}

            </div>


            {/* TABLE */}

            <div
                className="
                    bg-white
                    rounded-2xl
                    border
                    shadow-sm
                    overflow-hidden
                "
            >

                <div
                    className="
                        px-6
                        py-5
                        border-b
                        flex
                        items-center
                        justify-between
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
                            {
                                activeTab ===
                                    "active"
                                    ? "الطلبات النشطة"
                                    : activeTab ===
                                        "completed"
                                        ? "الطلبات المكتملة"
                                        : "الطلبات الملغية"
                            }
                        </h2>


                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >

                            {
                                totalOrders
                            }{" "}
                            طلب

                        </p>

                    </div>

                </div>


                {orders.length ===
                    0 ? (

                    <EmptyState
                        tab={
                            activeTab
                        }
                    />

                ) : (

                    <div
                        className="
                            overflow-x-auto
                        "
                    >

                        <table
                            className="
                                w-full
                                min-w-[1180px]
                            "
                        >

                            <thead>

                                <tr
                                    className="
                                        bg-gray-50
                                        border-b
                                    "
                                >

                                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500">
                                        الطلب
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500">
                                        العميل
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500">
                                        الاستلام
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500">
                                        الإجمالي
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500">
                                        الحالة
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500">
                                        التاريخ
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-black text-gray-500">
                                        الإجراء
                                    </th>

                                </tr>

                            </thead>


                            <tbody
                                className="
                                    divide-y
                                "
                            >

                                {orders.map(
                                    (
                                        order
                                    ) => {

                                        const statusInfo =
                                            getStatusInfo(
                                                order.status
                                            );


                                        const StatusIcon =
                                            statusInfo.icon;


                                        const deliveryInfo =
                                            getDeliveryInfo(
                                                order.delivery_method
                                            );


                                        const DeliveryIcon =
                                            deliveryInfo.icon;


                                        const nextStatus =
                                            getNextStatus(
                                                order.status,
                                                order.delivery_method
                                            );


                                        const NextIcon =
                                            getNextStatusIcon(
                                                order.status,
                                                order.delivery_method
                                            );


                                        const isUpdating =
                                            updatingId ===
                                            order.id;


                                        return (

                                            <tr
                                                key={
                                                    order.id
                                                }
                                                className="
                                                    hover:bg-gray-50
                                                    transition
                                                "
                                            >

                                                {/* ORDER */}

                                                <td className="px-6 py-5">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                w-10
                                                                h-10
                                                                rounded-xl
                                                                bg-purple-50
                                                                text-[#5B2A86]
                                                                flex
                                                                items-center
                                                                justify-center
                                                            "
                                                        >

                                                            <ShoppingBag
                                                                size={
                                                                    18
                                                                }
                                                            />

                                                        </div>


                                                        <div>

                                                            <div
                                                                className="
                                                                    font-black
                                                                    text-gray-900
                                                                "
                                                            >

                                                                #
                                                                {
                                                                    order.id
                                                                }

                                                            </div>


                                                            <div
                                                                className="
                                                                    text-xs
                                                                    text-gray-400
                                                                "
                                                            >
                                                                طلب
                                                            </div>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* CUSTOMER */}

                                                <td className="px-6 py-5">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                w-9
                                                                h-9
                                                                rounded-full
                                                                bg-gray-100
                                                                flex
                                                                items-center
                                                                justify-center
                                                                font-black
                                                                text-gray-500
                                                            "
                                                        >

                                                            {(
                                                                order.customer_name ||
                                                                order.user_name ||
                                                                "ع"
                                                            )
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}

                                                        </div>


                                                        <div>

                                                            <div
                                                                className="
                                                                    font-bold
                                                                    text-gray-800
                                                                "
                                                            >

                                                                {
                                                                    order.customer_name ||
                                                                    order.user_name ||
                                                                    "عميل غير محدد"
                                                                }

                                                            </div>


                                                            <div
                                                                className="
                                                                    text-xs
                                                                    text-gray-400
                                                                    mt-0.5
                                                                "
                                                            >

                                                                {
                                                                    order.phone ||
                                                                    order.user_phone ||
                                                                    "لا يوجد هاتف"
                                                                }

                                                            </div>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* DELIVERY */}

                                                <td className="px-6 py-5">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                        "
                                                    >

                                                        <span
                                                            className={`
                                                                w-8
                                                                h-8
                                                                rounded-lg
                                                                flex
                                                                items-center
                                                                justify-center
                                                                ${deliveryInfo.classes}
                                                            `}
                                                        >

                                                            <DeliveryIcon
                                                                size={
                                                                    16
                                                                }
                                                            />

                                                        </span>


                                                        <span
                                                            className="
                                                                font-semibold
                                                                text-gray-700
                                                            "
                                                        >

                                                            {
                                                                deliveryInfo.label
                                                            }

                                                        </span>

                                                    </div>

                                                </td>


                                                {/* TOTAL */}

                                                <td className="px-6 py-5">

                                                    <div
                                                        className="
                                                            font-black
                                                            text-[#5B2A86]
                                                        "
                                                    >

                                                        {
                                                            formatMoney(
                                                                order.total_price
                                                            )
                                                        }

                                                    </div>


                                                    <div
                                                        className="
                                                            text-xs
                                                            text-gray-400
                                                        "
                                                    >
                                                        جنيه
                                                    </div>

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-6 py-5">

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            px-3
                                                            py-1.5
                                                            rounded-full
                                                            border
                                                            text-xs
                                                            font-black
                                                            ${statusInfo.classes}
                                                        `}
                                                    >

                                                        <StatusIcon
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        {
                                                            statusInfo.label
                                                        }

                                                    </span>

                                                </td>


                                                {/* DATE */}

                                                <td className="px-6 py-5">

                                                    <div
                                                        className="
                                                            font-semibold
                                                            text-gray-700
                                                            text-sm
                                                        "
                                                    >

                                                        {
                                                            formatDate(
                                                                order.created_at
                                                            )
                                                        }

                                                    </div>


                                                    <div
                                                        className="
                                                            text-xs
                                                            text-gray-400
                                                            mt-1
                                                        "
                                                    >

                                                        {
                                                            formatTime(
                                                                order.created_at
                                                            )
                                                        }

                                                    </div>

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="px-6 py-5">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                        "
                                                    >

                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/orders/${order.id}`
                                                                )
                                                            }
                                                            className="
                                                                w-10
                                                                h-10
                                                                rounded-xl
                                                                border
                                                                border-gray-200
                                                                text-blue-600
                                                                hover:bg-blue-50
                                                                hover:border-blue-200
                                                                flex
                                                                items-center
                                                                justify-center
                                                                transition
                                                            "
                                                            title="
                                                                عرض التفاصيل
                                                            "
                                                        >

                                                            <Eye
                                                                size={
                                                                    17
                                                                }
                                                            />

                                                        </button>


                                                        {nextStatus && (

                                                            <button
                                                                onClick={() =>
                                                                    handleNextStatus(
                                                                        order
                                                                    )
                                                                }
                                                                disabled={
                                                                    isUpdating
                                                                }
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    gap-2
                                                                    px-4
                                                                    h-10
                                                                    rounded-xl
                                                                    bg-[#5B2A86]
                                                                    text-white
                                                                    font-bold
                                                                    text-xs
                                                                    hover:bg-[#4b216f]
                                                                    shadow-sm
                                                                    transition
                                                                    disabled:opacity-50
                                                                "
                                                            >

                                                                {isUpdating ? (

                                                                    <RefreshCw
                                                                        size={
                                                                            15
                                                                        }
                                                                        className="
                                                                            animate-spin
                                                                        "
                                                                    />

                                                                ) : (

                                                                    <NextIcon
                                                                        size={
                                                                            15
                                                                        }
                                                                    />

                                                                )}


                                                                {
                                                                    getNextStatusLabel(
                                                                        order.status,
                                                                        order.delivery_method
                                                                    )
                                                                }

                                                            </button>

                                                        )}


                                                        <div
                                                            className="
                                                                relative
                                                            "
                                                            onClick={(
                                                                event
                                                            ) =>
                                                                event.stopPropagation()
                                                            }
                                                        >

                                                            <button
                                                                onClick={() =>
                                                                    setOpenMenu(
                                                                        openMenu ===
                                                                            order.id
                                                                            ? null
                                                                            : order.id
                                                                    )
                                                                }
                                                                className="
                                                                    w-10
                                                                    h-10
                                                                    rounded-xl
                                                                    border
                                                                    border-gray-200
                                                                    text-gray-600
                                                                    hover:bg-gray-50
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    transition
                                                                "
                                                            >

                                                                <MoreVertical
                                                                    size={
                                                                        17
                                                                    }
                                                                />

                                                            </button>


                                                            {openMenu ===
                                                                order.id && (

                                                                    <div
                                                                        className="
                                                                        absolute
                                                                        left-0
                                                                        top-11
                                                                        z-50
                                                                        w-52
                                                                        bg-white
                                                                        border
                                                                        border-gray-200
                                                                        rounded-2xl
                                                                        shadow-xl
                                                                        overflow-hidden
                                                                    "
                                                                    >

                                                                        <button
                                                                            onClick={() => {

                                                                                setOpenMenu(
                                                                                    null
                                                                                );

                                                                                navigate(
                                                                                    `/admin/orders/${order.id}`
                                                                                );

                                                                            }}
                                                                            className="
                                                                            w-full
                                                                            px-4
                                                                            py-3
                                                                            flex
                                                                            items-center
                                                                            gap-3
                                                                            text-right
                                                                            hover:bg-gray-50
                                                                        "
                                                                        >

                                                                            <Eye
                                                                                size={
                                                                                    17
                                                                                }
                                                                                className="
                                                                                text-blue-500
                                                                            "
                                                                            />

                                                                            <span
                                                                                className="
                                                                                font-semibold
                                                                                text-gray-700
                                                                            "
                                                                            >
                                                                                عرض التفاصيل
                                                                            </span>

                                                                        </button>


                                                                        {activeTab ===
                                                                            "active" && (

                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleCancel(
                                                                                            order.id
                                                                                        )
                                                                                    }
                                                                                    className="
                                                                                w-full
                                                                                px-4
                                                                                py-3
                                                                                flex
                                                                                items-center
                                                                                gap-3
                                                                                text-right
                                                                                hover:bg-red-50
                                                                            "
                                                                                >

                                                                                    <Ban
                                                                                        size={
                                                                                            17
                                                                                        }
                                                                                        className="
                                                                                    text-red-500
                                                                                "
                                                                                    />

                                                                                    <span
                                                                                        className="
                                                                                    text-red-600
                                                                                    font-bold
                                                                                "
                                                                                    >
                                                                                        إلغاء الطلب
                                                                                    </span>

                                                                                </button>

                                                                            )}

                                                                    </div>

                                                                )}

                                                        </div>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}


                {/* PAGINATION */}

                {totalPages > 1 && (

                    <div
                        className="
                            px-6
                            py-4
                            border-t
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >

                        <div
                            className="
                                text-sm
                                text-gray-500
                                font-semibold
                            "
                        >

                            صفحة{" "}
                            <span
                                className="
                                    text-gray-900
                                    font-black
                                "
                            >
                                {page}
                            </span>{" "}
                            من{" "}
                            <span
                                className="
                                    text-gray-900
                                    font-black
                                "
                            >
                                {totalPages}
                            </span>

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <button
                                onClick={() =>
                                    changePage(
                                        page - 1
                                    )
                                }
                                disabled={
                                    page ===
                                    1
                                }
                                className="
                                    px-4
                                    py-2
                                    rounded-xl
                                    border
                                    text-sm
                                    font-bold
                                    disabled:opacity-40
                                    hover:bg-gray-50
                                "
                            >

                                السابق

                            </button>


                            <div
                                className="
                                    hidden
                                    sm:flex
                                    items-center
                                    gap-1
                                "
                            >

                                {getPageNumbers(
                                    page,
                                    totalPages
                                ).map(
                                    (
                                        pageNumber
                                    ) => (

                                        <button
                                            key={
                                                pageNumber
                                            }
                                            onClick={() =>
                                                changePage(
                                                    pageNumber
                                                )
                                            }
                                            className={`
                                                w-9
                                                h-9
                                                rounded-lg
                                                text-sm
                                                font-bold
                                                ${pageNumber ===
                                                    page
                                                    ? "bg-[#5B2A86] text-white"
                                                    : "hover:bg-gray-100 text-gray-600"
                                                }
                                            `}
                                        >

                                            {
                                                pageNumber
                                            }

                                        </button>

                                    )
                                )}

                            </div>


                            <button
                                onClick={() =>
                                    changePage(
                                        page + 1
                                    )
                                }
                                disabled={
                                    page ===
                                    totalPages
                                }
                                className="
                                    px-4
                                    py-2
                                    rounded-xl
                                    border
                                    text-sm
                                    font-bold
                                    disabled:opacity-40
                                    hover:bg-gray-50
                                "
                            >

                                التالي

                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}


/* ==========================================
   STAT CARD
========================================== */

function StatCard({
    title,
    value,
    icon: Icon,
    iconClass,
}) {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                border
                shadow-sm
                p-5
            "
        >

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            font-semibold
                            text-gray-500
                        "
                    >
                        {title}
                    </p>


                    <p
                        className="
                            text-2xl
                            font-black
                            text-gray-900
                            mt-2
                        "
                    >
                        {value}
                    </p>

                </div>


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

                    <Icon
                        size={
                            21
                        }
                    />

                </div>

            </div>

        </div>

    );

}


/* ==========================================
   FILTER SELECT
========================================== */

function FilterSelect({
    value,
    onChange,
    options,
}) {

    return (

        <div
            className="
                relative
                min-w-[190px]
            "
        >

            <select
                value={
                    value
                }
                onChange={(
                    event
                ) =>
                    onChange(
                        event.target.value
                    )
                }
                className="
                    appearance-none
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    pl-10
                    bg-white
                    outline-none
                    focus:ring-2
                    focus:ring-[#5B2A86]/20
                    focus:border-[#5B2A86]
                    font-medium
                "
            >

                {options.map(
                    (
                        option
                    ) => (

                        <option
                            key={
                                option.value
                            }
                            value={
                                option.value
                            }
                        >

                            {
                                option.label
                            }

                        </option>

                    )
                )}

            </select>


            <ChevronDown
                size={
                    17
                }
                className="
                    absolute
                    left-3
                    top-3.5
                    text-gray-400
                    pointer-events-none
                "
            />

        </div>

    );

}


/* ==========================================
   EMPTY STATE
========================================== */

function EmptyState({
    tab,
}) {

    const title =
        tab === "completed"
            ? "لا توجد طلبات مكتملة"
            : tab === "cancelled"
                ? "لا توجد طلبات ملغية"
                : "لا توجد طلبات نشطة";


    return (

        <div
            className="
                py-20
                text-center
            "
        >

            <div
                className="
                    w-20
                    h-20
                    rounded-3xl
                    bg-gray-100
                    text-gray-400
                    flex
                    items-center
                    justify-center
                    mx-auto
                    mb-5
                "
            >

                <Search
                    size={
                        34
                    }
                />

            </div>


            <h3
                className="
                    text-lg
                    font-black
                    text-gray-800
                "
            >

                {
                    title
                }

            </h3>


            <p
                className="
                    text-gray-500
                    mt-2
                "
            >

                لم يتم العثور على طلبات مطابقة

            </p>

        </div>

    );

}


/* ==========================================
   PAGE NUMBERS
========================================== */

function getPageNumbers(
    currentPage,
    totalPages
) {

    const pages = [];


    if (
        totalPages <= 7
    ) {

        for (
            let index = 1;
            index <= totalPages;
            index++
        ) {

            pages.push(
                index
            );

        }

        return pages;

    }


    pages.push(
        1
    );


    if (
        currentPage > 4
    ) {

        pages.push(
            "..."
        );

    }


    const start = Math.max(
        2,
        currentPage - 1
    );


    const end = Math.min(
        totalPages - 1,
        currentPage + 1
    );


    for (
        let index = start;
        index <= end;
        index++
    ) {

        pages.push(
            index
        );

    }


    if (
        currentPage <
        totalPages - 3
    ) {

        pages.push(
            "..."
        );

    }


    pages.push(
        totalPages
    );


    return pages.filter(
        (
            value,
            index,
            array
        ) =>
            value === "..." ||
            array.indexOf(
                value
            ) === index
    );

}