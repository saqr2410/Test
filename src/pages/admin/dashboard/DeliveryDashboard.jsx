import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Truck,
    Package,
    Clock3,
    CheckCircle2,
    MapPin,
    RefreshCw,
    ArrowLeft,
    AlertCircle,
    Navigation,
    Phone,
    ChevronLeft
} from "lucide-react";

import {
    getRecentOrders
} from "../../../services/dashboard/dashboardService";


export default function DeliveryDashboard() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);


    const loadOrders = async (refresh = false) => {

        try {

            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await getRecentOrders();

            setOrders(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Delivery Dashboard Error:",
                error
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    useEffect(() => {
        loadOrders();
    }, []);


    const statistics = useMemo(() => {

        return {
            pending: orders.filter(
                order =>
                    order.status === "PENDING" ||
                    order.status === "CONFIRMED"
            ).length,

            ready: orders.filter(
                order =>
                    order.status === "PROCESSING" ||
                    order.status === "READY"
            ).length,

            shipping: orders.filter(
                order =>
                    order.status === "SHIPPED"
            ).length,

            delivered: orders.filter(
                order =>
                    order.status === "DELIVERED"
            ).length
        };

    }, [orders]);


    const activeOrders = useMemo(() => {

        return orders.filter(order =>
            [
                "PENDING",
                "CONFIRMED",
                "PROCESSING",
                "READY",
                "SHIPPED"
            ].includes(order.status)
        );

    }, [orders]);


    if (loading) {
        return <DashboardSkeleton />;
    }


    return (

        <div
            dir="rtl"
            className="
                min-h-full
                bg-[#F8F8FA]
                p-4
                md:p-6
                lg:p-8
            "
        >

            <div
                className="
                    max-w-[1500px]
                    mx-auto
                    space-y-6
                "
            >

                {/* ================= HEADER ================= */}

                <header
                    className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-5
                    "
                >

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                w-14
                                h-14
                                rounded-2xl
                                bg-[#5B2A86]
                                text-white
                                flex
                                items-center
                                justify-center
                                shadow-lg
                                shadow-purple-200
                            "
                        >
                            <Truck size={26} />
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
                                لوحة التوصيل
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-gray-500
                                "
                            >
                                تابع الطلبات وحالة عمليات التوصيل
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={() => loadOrders(true)}
                        disabled={refreshing}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-5
                            py-3
                            rounded-2xl
                            bg-white
                            border
                            border-gray-200
                            text-gray-700
                            text-sm
                            font-bold
                            shadow-sm
                            hover:border-[#5B2A86]
                            hover:text-[#5B2A86]
                            transition
                            disabled:opacity-60
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

                        {refreshing
                            ? "جاري التحديث"
                            : "تحديث"
                        }

                    </button>

                </header>


                {/* ================= STATS ================= */}

                <div
                    className="
                        grid
                        grid-cols-2
                        xl:grid-cols-4
                        gap-4
                    "
                >

                    <DeliveryStat
                        title="طلبات جديدة"
                        value={statistics.pending}
                        icon={Clock3}
                        type="warning"
                        description="تحتاج إلى متابعة"
                    />

                    <DeliveryStat
                        title="جاهزة للتوصيل"
                        value={statistics.ready}
                        icon={Package}
                        type="info"
                        description="بانتظار المندوب"
                    />

                    <DeliveryStat
                        title="جاري التوصيل"
                        value={statistics.shipping}
                        icon={Truck}
                        type="primary"
                        description="طلبات نشطة"
                    />

                    <DeliveryStat
                        title="تم التسليم"
                        value={statistics.delivered}
                        icon={CheckCircle2}
                        type="success"
                        description="طلبات مكتملة"
                    />

                </div>


                {/* ================= ACTIVE DELIVERY ================= */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-[28px]
                        bg-gradient-to-br
                        from-[#5B2A86]
                        via-[#673596]
                        to-[#7B3FB0]
                        p-6
                        md:p-8
                        text-white
                        shadow-xl
                        shadow-purple-100
                    "
                >

                    <div
                        className="
                            absolute
                            -top-20
                            -left-20
                            w-64
                            h-64
                            rounded-full
                            bg-white/5
                        "
                    />

                    <div
                        className="
                            absolute
                            -bottom-32
                            right-1/3
                            w-80
                            h-80
                            rounded-full
                            bg-white/5
                        "
                    />


                    <div
                        className="
                            relative
                            z-10
                            flex
                            flex-col
                            md:flex-row
                            md:items-center
                            md:justify-between
                            gap-6
                        "
                    >

                        <div>

                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-3
                                    py-1.5
                                    rounded-full
                                    bg-white/10
                                    border
                                    border-white/10
                                    text-xs
                                    font-bold
                                    text-white/80
                                    mb-4
                                "
                            >
                                <Navigation size={13} />

                                حالة التوصيل
                            </div>


                            <h2
                                className="
                                    text-2xl
                                    md:text-3xl
                                    font-black
                                "
                            >
                                {statistics.shipping > 0
                                    ? "لديك طلبات قيد التوصيل"
                                    : "لا توجد طلبات قيد التوصيل"
                                }
                            </h2>


                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-white/65
                                "
                            >
                                {statistics.shipping > 0
                                    ? `${statistics.shipping} طلب يحتاج إلى متابعة`
                                    : "جميع الطلبات الحالية تحت السيطرة"
                                }
                            </p>

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                gap-4
                            "
                        >

                            <div
                                className="
                                    text-center
                                    min-w-[100px]
                                "
                            >

                                <p
                                    className="
                                        text-4xl
                                        font-black
                                    "
                                >
                                    {statistics.shipping}
                                </p>

                                <p
                                    className="
                                        text-xs
                                        text-white/60
                                        mt-1
                                    "
                                >
                                    قيد التوصيل
                                </p>

                            </div>


                            <div
                                className="
                                    w-16
                                    h-16
                                    rounded-2xl
                                    bg-white/10
                                    border
                                    border-white/10
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                <Truck size={30} />

                            </div>

                        </div>

                    </div>

                </section>


                {/* ================= ACTIVE ORDERS ================= */}

                <section
                    className="
                        bg-white
                        rounded-[28px]
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
                                الطلبات الحالية
                            </h2>

                            <p
                                className="
                                    text-sm
                                    text-gray-400
                                    mt-1
                                "
                            >
                                الطلبات التي تحتاج إلى متابعة
                            </p>

                        </div>


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
                                text-xs
                                font-black
                            "
                        >

                            <Package size={15} />

                            {activeOrders.length} طلب نشط

                        </div>

                    </div>


                    {activeOrders.length === 0 ? (

                        <EmptyOrders />

                    ) : (

                        <div>

                            {activeOrders
                                .slice(0, 8)
                                .map(order => (

                                    <DeliveryOrder
                                        key={order.id}
                                        order={order}
                                    />

                                ))
                            }

                        </div>

                    )}

                </section>


                {/* ================= FOOTER ================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-2
                        pb-3
                        text-xs
                        text-gray-400
                    "
                >

                    <span>
                        {orders.length} طلب إجمالي
                    </span>

                    <span>
                        Delivery Management
                    </span>

                </div>

            </div>

        </div>

    );
}


/* =========================================================
   STAT CARD
========================================================= */

function DeliveryStat({
    title,
    value,
    icon: Icon,
    description,
    type
}) {

    const styles = {

        warning: {
            bg: "bg-amber-50",
            text: "text-amber-600"
        },

        info: {
            bg: "bg-blue-50",
            text: "text-blue-600"
        },

        primary: {
            bg: "bg-purple-50",
            text: "text-[#5B2A86]"
        },

        success: {
            bg: "bg-emerald-50",
            text: "text-emerald-600"
        }

    };


    const style = styles[type];


    return (

        <div
            className="
                group
                bg-white
                rounded-[24px]
                border
                border-gray-100
                p-5
                md:p-6
                shadow-sm
                hover:shadow-md
                hover:-translate-y-0.5
                transition-all
            "
        >

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-3
                "
            >

                <div>

                    <p
                        className="
                            text-xs
                            md:text-sm
                            font-bold
                            text-gray-500
                        "
                    >
                        {title}
                    </p>

                    <h3
                        className="
                            text-3xl
                            md:text-4xl
                            font-black
                            text-gray-900
                            mt-3
                        "
                    >
                        {value}
                    </h3>

                    <p
                        className="
                            text-[11px]
                            md:text-xs
                            text-gray-400
                            mt-2
                        "
                    >
                        {description}
                    </p>

                </div>


                <div
                    className={`
                        w-11
                        h-11
                        md:w-12
                        md:h-12
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        ${style.bg}
                        ${style.text}
                        group-hover:scale-105
                        transition
                    `}
                >

                    <Icon size={21} />

                </div>

            </div>

        </div>

    );
}


/* =========================================================
   ORDER
========================================================= */

function DeliveryOrder({
    order
}) {

    const status = getStatus(order.status);


    return (

        <div
            className="
                group
                px-5
                md:px-6
                py-5
                border-b
                border-gray-100
                last:border-b-0
                hover:bg-gray-50/70
                transition
            "
        >

            <div
                className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-5
                "
            >

                {/* ORDER INFO */}

                <div
                    className="
                        flex
                        items-center
                        gap-4
                        min-w-0
                    "
                >

                    <div
                        className="
                            w-12
                            h-12
                            shrink-0
                            rounded-2xl
                            bg-gray-100
                            text-gray-500
                            flex
                            items-center
                            justify-center
                            group-hover:bg-purple-50
                            group-hover:text-[#5B2A86]
                            transition
                        "
                    >

                        <Package size={21} />

                    </div>


                    <div className="min-w-0">

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <p
                                className="
                                    font-black
                                    text-gray-900
                                "
                            >
                                طلب #{order.id}
                            </p>

                            <span
                                className={`
                                    hidden
                                    sm:inline-flex
                                    items-center
                                    gap-1
                                    px-2.5
                                    py-1
                                    rounded-lg
                                    text-[10px]
                                    font-black
                                    ${status.className}
                                `}
                            >

                                {status.icon}

                                {status.text}

                            </span>

                        </div>


                        <p
                            className="
                                text-sm
                                text-gray-400
                                mt-1
                            "
                        >
                            {order.customer_name || "مستخدم"}
                        </p>

                    </div>

                </div>


                {/* ORDER DETAILS */}

                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                        lg:gap-3
                    "
                >

                    <OrderInfo
                        icon={MapPin}
                        text={
                            order.delivery_method === "PICKUP"
                                ? "استلام من الفرع"
                                : "توصيل"
                        }
                    />


                    <span
                        className={`
                            sm:hidden
                            inline-flex
                            items-center
                            gap-1.5
                            px-3
                            py-2
                            rounded-xl
                            text-xs
                            font-bold
                            ${status.className}
                        `}
                    >

                        {status.icon}

                        {status.text}

                    </span>


                    <span
                        className="
                            font-black
                            text-[#5B2A86]
                            px-2
                            min-w-[100px]
                        "
                    >
                        {order.total_price ?? 0} جنيه
                    </span>


                    <button
                        type="button"
                        className="
                            w-9
                            h-9
                            rounded-xl
                            border
                            border-gray-200
                            text-gray-400
                            flex
                            items-center
                            justify-center
                            hover:border-[#5B2A86]
                            hover:text-[#5B2A86]
                            transition
                        "
                    >

                        <ChevronLeft size={17} />

                    </button>

                </div>

            </div>

        </div>

    );
}


/* =========================================================
   ORDER INFO
========================================================= */

function OrderInfo({
    icon: Icon,
    text
}) {

    return (

        <span
            className="
                inline-flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                bg-gray-50
                text-gray-600
                text-xs
                font-semibold
            "
        >

            <Icon
                size={14}
                className="text-gray-400"
            />

            {text}

        </span>

    );
}


/* =========================================================
   EMPTY
========================================================= */

function EmptyOrders() {

    return (

        <div
            className="
                py-16
                px-6
                text-center
            "
        >

            <div
                className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-gray-50
                    text-gray-300
                    flex
                    items-center
                    justify-center
                    mx-auto
                    mb-4
                "
            >

                <Package size={30} />

            </div>


            <h3
                className="
                    font-black
                    text-gray-700
                "
            >
                لا توجد طلبات نشطة
            </h3>


            <p
                className="
                    text-sm
                    text-gray-400
                    mt-1
                "
            >
                لا توجد طلبات تحتاج إلى متابعة حاليًا
            </p>

        </div>

    );
}


/* =========================================================
   STATUS
========================================================= */

function getStatus(status) {

    const statuses = {

        PENDING: {
            text: "قيد الانتظار",
            className: "bg-amber-100 text-amber-700",
            icon: <Clock3 size={13} />
        },

        CONFIRMED: {
            text: "تم التأكيد",
            className: "bg-blue-100 text-blue-700",
            icon: <CheckCircle2 size={13} />
        },

        PROCESSING: {
            text: "قيد التجهيز",
            className: "bg-purple-100 text-purple-700",
            icon: <Package size={13} />
        },

        READY: {
            text: "جاهز للتوصيل",
            className: "bg-emerald-100 text-emerald-700",
            icon: <Package size={13} />
        },

        SHIPPED: {
            text: "جاري التوصيل",
            className: "bg-indigo-100 text-indigo-700",
            icon: <Truck size={13} />
        },

        DELIVERED: {
            text: "تم التسليم",
            className: "bg-teal-100 text-teal-700",
            icon: <CheckCircle2 size={13} />
        },

        CANCELLED: {
            text: "ملغي",
            className: "bg-red-100 text-red-700",
            icon: <AlertCircle size={13} />
        }

    };


    return (
        statuses[status] || {
            text: status || "غير محدد",
            className: "bg-gray-100 text-gray-600",
            icon: <Clock3 size={13} />
        }
    );
}


/* =========================================================
   SKELETON
========================================================= */

function DashboardSkeleton() {

    return (

        <div
            dir="rtl"
            className="
                min-h-full
                bg-[#F8F8FA]
                p-4
                md:p-8
            "
        >

            <div
                className="
                    max-w-[1500px]
                    mx-auto
                    space-y-6
                "
            >

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
                            bg-gray-200
                            animate-pulse
                        "
                    />

                    <div className="space-y-2">

                        <div
                            className="
                                h-7
                                w-56
                                bg-gray-200
                                rounded-lg
                                animate-pulse
                            "
                        />

                        <div
                            className="
                                h-4
                                w-72
                                bg-gray-200
                                rounded-lg
                                animate-pulse
                            "
                        />

                    </div>

                </div>


                <div
                    className="
                        grid
                        grid-cols-2
                        xl:grid-cols-4
                        gap-4
                    "
                >

                    {[1, 2, 3, 4].map(item => (

                        <div
                            key={item}
                            className="
                                h-36
                                rounded-[24px]
                                bg-white
                                animate-pulse
                            "
                        />

                    ))}

                </div>


                <div
                    className="
                        h-52
                        rounded-[28px]
                        bg-gray-200
                        animate-pulse
                    "
                />


                <div
                    className="
                        h-[500px]
                        rounded-[28px]
                        bg-white
                        animate-pulse
                    "
                />

            </div>

        </div>

    );
}