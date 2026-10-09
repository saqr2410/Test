import {
    useEffect,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    Package,
    CalendarDays,
    ArrowLeft,
    ShoppingBag,
    Truck,
    Store,
    ChevronLeft,
    RefreshCw,
} from "lucide-react";

import {
    getMyOrders,
} from "../../../services/orders/orderService";


export default function MyOrders() {

    const [
        orders,
        setOrders,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");


    useEffect(() => {

        loadOrders();

    }, []);


    const loadOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getMyOrders();


            /*
             * Supports both:
             *
             * [
             *     ...
             * ]
             *
             * and DRF pagination:
             *
             * {
             *     results: [...]
             * }
             */

            const ordersData = Array.isArray(data)
                ? data
                : data?.results || [];


            setOrders(ordersData);

        } catch (error) {

            console.error(
                "خطأ في تحميل الطلبات:",
                error
            );

            setError(
                "حدث خطأ أثناء تحميل الطلبات."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // DELIVERY METHOD
    // ==========================================

    const getDeliveryMethod = (
        method
    ) => {

        if (method === "DELIVERY") {

            return {
                label: "توصيل",
                icon: Truck,
                className:
                    "bg-blue-50 text-blue-700",
            };

        }


        if (method === "PICKUP") {

            return {
                label: "استلام من الصيدلية",
                icon: Store,
                className:
                    "bg-purple-50 text-[#5B2A86]",
            };

        }


        return {
            label: "غير محدد",
            icon: Store,
            className:
                "bg-gray-50 text-gray-600",
        };
    };


    // ==========================================
    // STATUS
    // ==========================================

    const getStatus = (
        order
    ) => {

        switch (order.status) {

            case "COMPLETED":

            case "DELIVERED":

                return {
                    text: "تم الاستلام",
                    className:
                        "bg-emerald-50 text-emerald-700 border-emerald-100",
                };


            case "CANCELLED":

                return {
                    text: "تم الإلغاء",
                    className:
                        "bg-red-50 text-red-700 border-red-100",
                };


            case "SHIPPED":

                return {
                    text: "في الطريق",
                    className:
                        "bg-indigo-50 text-indigo-700 border-indigo-100",
                };


            case "READY":

                return {
                    text: "جاهز للاستلام",
                    className:
                        "bg-green-50 text-green-700 border-green-100",
                };


            case "PROCESSING":

                return {
                    text: "جاري التجهيز",
                    className:
                        "bg-purple-50 text-[#5B2A86] border-purple-100",
                };


            case "PENDING":

                return {
                    text: "قيد المراجعة",
                    className:
                        "bg-amber-50 text-amber-700 border-amber-100",
                };


            default:

                return {
                    text:
                        order.status_display ||
                        order.status ||
                        "غير محدد",

                    className:
                        "bg-gray-50 text-gray-700 border-gray-100",
                };
        }
    };


    // ==========================================
    // DATE
    // ==========================================

    const formatDate = (
        date
    ) => {

        if (!date) {

            return "غير محدد";

        }


        try {

            const parsedDate = new Date(
                date
            );


            if (
                Number.isNaN(
                    parsedDate.getTime()
                )
            ) {

                return "غير محدد";

            }


            return parsedDate.toLocaleDateString(
                "ar-EG",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }
            );

        } catch {

            return "غير محدد";

        }
    };


    // ==========================================
    // ITEMS COUNT
    // ==========================================

    const getItemsCount = (
        order
    ) => {

        if (
            order.items_count !== undefined &&
            order.items_count !== null
        ) {

            return Number(
                order.items_count
            );

        }


        if (
            Array.isArray(
                order.items
            )
        ) {

            return order.items.length;

        }


        return 0;
    };


    const getItemsLabel = (
        count
    ) => {

        if (count === 1) {

            return "منتج واحد";

        }


        if (count === 2) {

            return "منتجان";

        }


        if (
            count >= 3 &&
            count <= 10
        ) {

            return `${count} منتجات`;

        }


        return `${count} منتج`;
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div
                dir="rtl"
                className="min-h-screen bg-[#FAF8FC] flex items-center justify-center px-6"
            >

                <div className="text-center">

                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-purple-100 flex items-center justify-center">

                        <RefreshCw
                            size={30}
                            className="text-[#5B2A86] animate-spin"
                        />

                    </div>


                    <h2 className="text-lg font-black text-gray-800">

                        جاري تحميل طلباتك

                    </h2>


                    <p className="text-sm text-gray-500 mt-2">

                        لحظات ونجيبلك كل طلباتك

                    </p>

                </div>

            </div>

        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div
                dir="rtl"
                className="min-h-screen bg-[#FAF8FC] flex items-center justify-center px-6"
            >

                <div className="bg-white border border-red-100 rounded-3xl shadow-sm p-8 text-center max-w-md w-full">

                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-50 flex items-center justify-center">

                        <Package
                            size={30}
                            className="text-red-600"
                        />

                    </div>


                    <h2 className="text-lg font-black text-gray-900">

                        تعذر تحميل الطلبات

                    </h2>


                    <p className="text-sm text-gray-500 mt-2 mb-6">

                        {error}

                    </p>


                    <button
                        type="button"
                        onClick={loadOrders}
                        className="inline-flex items-center justify-center gap-2 bg-[#5B2A86] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#4b216f] transition"
                    >

                        <RefreshCw size={17} />

                        المحاولة مرة أخرى

                    </button>

                </div>

            </div>

        );
    }


    return (

        <div
            dir="rtl"
            className="min-h-screen bg-[#FAF8FC] py-10 md:py-14"
        >

            <div className="max-w-6xl mx-auto px-4 sm:px-6">


                {/* ==========================================
                    PAGE HEADER
                ========================================== */}

                <div className="mb-8 md:mb-10">

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

                        <div>

                            <div className="flex items-center gap-3 mb-3">

                                <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center">

                                    <Package
                                        size={23}
                                        className="text-[#5B2A86]"
                                    />

                                </div>


                                <span className="text-sm font-bold text-[#5B2A86]">

                                    حسابي

                                </span>

                            </div>


                            <h1 className="text-3xl md:text-4xl font-black text-gray-900">

                                طلباتي

                            </h1>


                            <p className="text-gray-500 mt-2">

                                تابع حالة طلباتك وتفاصيل مشترياتك بسهولة

                            </p>

                        </div>


                        {orders.length > 0 && (

                            <div className="self-start sm:self-auto bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">

                                <div className="flex items-center gap-2">

                                    <ShoppingBag
                                        size={18}
                                        className="text-[#5B2A86]"
                                    />

                                    <span className="text-sm text-gray-500">

                                        إجمالي الطلبات

                                    </span>


                                    <span className="font-black text-gray-900">

                                        {orders.length}

                                    </span>

                                </div>

                            </div>

                        )}

                    </div>

                </div>


                {/* ==========================================
                    EMPTY STATE
                ========================================== */}

                {orders.length === 0 ? (

                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 md:p-14 text-center">

                        <div className="w-24 h-24 mx-auto rounded-3xl bg-purple-50 flex items-center justify-center mb-6">

                            <ShoppingBag
                                size={42}
                                strokeWidth={1.7}
                                className="text-[#5B2A86]"
                            />

                        </div>


                        <h2 className="text-2xl font-black text-gray-900 mb-3">

                            لا توجد طلبات حتى الآن

                        </h2>


                        <p className="text-gray-500 max-w-md mx-auto leading-7 mb-7">

                            لم تقم بإجراء أي طلب حتى الآن.
                            تصفح منتجاتنا واختر ما تحتاجه من الأدوية والمنتجات الصحية.

                        </p>


                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center gap-2 bg-[#5B2A86] text-white px-7 py-3.5 rounded-2xl font-bold hover:bg-[#4b216f] transition shadow-lg shadow-purple-200"
                        >

                            تصفح المنتجات

                            <ArrowLeft size={18} />

                        </Link>

                    </div>

                ) : (

                    /* ==========================================
                       ORDERS LIST
                    ========================================== */

                    <div className="space-y-5">

                        {orders.map(
                            (
                                order
                            ) => {

                                const delivery =
                                    getDeliveryMethod(
                                        order.delivery_method
                                    );


                                const status =
                                    getStatus(
                                        order
                                    );


                                const DeliveryIcon =
                                    delivery.icon;


                                const itemsCount =
                                    getItemsCount(
                                        order
                                    );


                                return (

                                    <div
                                        key={order.id}
                                        className="group bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-lg hover:border-purple-100 transition-all duration-300 overflow-hidden"
                                    >

                                        <div className="p-5 md:p-7">


                                            {/* ==================================
                                                TOP
                                            ================================== */}

                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">


                                                {/* ORDER INFO */}

                                                <div className="flex items-start gap-4">

                                                    <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-purple-50 items-center justify-center shrink-0">

                                                        <Package
                                                            size={23}
                                                            className="text-[#5B2A86]"
                                                        />

                                                    </div>


                                                    <div>

                                                        <div className="flex items-center gap-2 flex-wrap">

                                                            <h2 className="text-lg md:text-xl font-black text-gray-900">

                                                                طلب #{order.id}

                                                            </h2>


                                                            <span className="text-xs font-bold text-gray-400">

                                                                •

                                                            </span>


                                                            <span className="text-xs md:text-sm text-gray-500">

                                                                {formatDate(
                                                                    order.created_at
                                                                )}

                                                            </span>

                                                        </div>


                                                        <div className="flex flex-wrap items-center gap-2 mt-3">


                                                            {/* DELIVERY */}

                                                            <div
                                                                className={`
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1.5
                                                                    px-3
                                                                    py-1.5
                                                                    rounded-xl
                                                                    text-xs
                                                                    font-bold
                                                                    ${delivery.className}
                                                                `}
                                                            >

                                                                <DeliveryIcon
                                                                    size={14}
                                                                />

                                                                {delivery.label}

                                                            </div>


                                                            {/* ITEMS */}

                                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 text-gray-600 text-xs font-bold">

                                                                <ShoppingBag
                                                                    size={14}
                                                                />

                                                                {getItemsLabel(
                                                                    itemsCount
                                                                )}

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* STATUS */}

                                                <span
                                                    className={`
                                                        self-start
                                                        inline-flex
                                                        items-center
                                                        justify-center
                                                        px-4
                                                        py-2
                                                        rounded-xl
                                                        border
                                                        text-xs
                                                        md:text-sm
                                                        font-black
                                                        whitespace-nowrap
                                                        ${status.className}
                                                    `}
                                                >

                                                    {status.text}

                                                </span>

                                            </div>


                                            {/* ==================================
                                                DIVIDER
                                            ================================== */}

                                            <div className="border-t border-gray-100 my-6" />


                                            {/* ==================================
                                                BOTTOM
                                            ================================== */}

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">


                                                {/* TOTAL */}

                                                <div>

                                                    <p className="text-xs text-gray-400 font-bold mb-1">

                                                        إجمالي الطلب

                                                    </p>


                                                    <div className="flex items-baseline gap-1">

                                                        <span className="text-2xl font-black text-[#5B2A86]">

                                                            {Number(
                                                                order.total_price ?? 0
                                                            ).toLocaleString(
                                                                "ar-EG"
                                                            )}

                                                        </span>


                                                        <span className="text-sm font-bold text-gray-500">

                                                            جنيه

                                                        </span>

                                                    </div>

                                                </div>


                                                {/* DETAILS */}

                                                <Link
                                                    to={`/orders/${order.id}`}
                                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gray-50 text-[#5B2A86] font-black text-sm hover:bg-purple-50 transition group/link"
                                                >

                                                    عرض تفاصيل الطلب

                                                    <ChevronLeft
                                                        size={18}
                                                        className="transition-transform group-hover/link:-translate-x-1"
                                                    />

                                                </Link>

                                            </div>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>

        </div>

    );
}