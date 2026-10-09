// src/pages/store/orders/OrderDetails.jsx

import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Package,
    ShoppingBag,
    Store,
    Truck,
    XCircle,
    RefreshCw,
} from "lucide-react";

import {
    getOrderDetails,
} from "../../../services/orders/orderService";

import toast from "react-hot-toast";


export default function OrderDetails() {

    const { id } = useParams();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);


    /* ==========================================
       LOAD ORDER
    ========================================== */

    useEffect(() => {

        loadOrder();

    }, [id]);


    const loadOrder = async () => {

        try {

            setLoading(true);

            const data = await getOrderDetails(id);

            setOrder(data);

        } catch (error) {

            console.error(
                "Order details error:",
                error
            );

            toast.error(
                "تعذر تحميل تفاصيل الطلب"
            );

            setOrder(null);

        } finally {

            setLoading(false);

        }
    };


    /* ==========================================
       HELPERS
    ========================================== */

    const formatDate = (date) => {

        if (!date) {

            return "غير محدد";

        }


        try {

            const parsedDate = new Date(date);


            if (
                Number.isNaN(
                    parsedDate.getTime()
                )
            ) {

                return date;

            }


            return new Intl.DateTimeFormat(
                "ar-EG",
                {
                    dateStyle: "long",
                    timeStyle: "short",
                }
            ).format(parsedDate);

        } catch {

            return date;

        }

    };


    const getStatus = (status) => {

        const statuses = {

            PENDING: {
                label: "قيد المراجعة",
                icon: Clock3,
                className: "bg-amber-50 text-amber-700",
            },

            PROCESSING: {
                label: "جاري تجهيز الطلب",
                icon: Package,
                className: "bg-purple-50 text-purple-700",
            },

            READY: {
                label: "الطلب جاهز",
                icon: CheckCircle2,
                className: "bg-emerald-50 text-emerald-700",
            },

            SHIPPED: {
                label: "جاري الشحن",
                icon: Truck,
                className: "bg-blue-50 text-blue-700",
            },

            COMPLETED: {
                label: "تم استلام الطلب",
                icon: CheckCircle2,
                className: "bg-green-50 text-green-700",
            },

            CANCELLED: {
                label: "تم إلغاء الطلب",
                icon: XCircle,
                className: "bg-red-50 text-red-700",
            },

        };


        return (
            statuses[status] || {
                label: status || "غير محدد",
                icon: Clock3,
                className: "bg-gray-100 text-gray-700",
            }
        );

    };


    const getDeliveryMethod = (method) => {

        if (
            method === "PICKUP" ||
            method === "pickup" ||
            method === "STORE_PICKUP"
        ) {

            return {
                label: "استلام من الصيدلية",
                icon: Store,
            };

        }


        return {
            label: method || "غير محدد",
            icon: Truck,
        };

    };


    /* ==========================================
       LOADING
    ========================================== */

    if (loading) {

        return (

            <div
                dir="rtl"
                className="min-h-screen bg-[#FAF8FC] py-10 md:py-14"
            >

                <div className="max-w-5xl mx-auto px-4 sm:px-6">

                    <div className="animate-pulse space-y-6">

                        <div className="h-10 w-64 bg-gray-200 rounded-xl" />


                        <div className="bg-white rounded-3xl p-8">

                            <div className="h-7 w-48 bg-gray-200 rounded-lg mb-6" />


                            <div className="space-y-5">

                                <div className="h-16 bg-gray-100 rounded-2xl" />

                                <div className="h-16 bg-gray-100 rounded-2xl" />

                                <div className="h-16 bg-gray-100 rounded-2xl" />

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    /* ==========================================
       ERROR / NOT FOUND
    ========================================== */

    if (!order) {

        return (

            <div
                dir="rtl"
                className="min-h-screen bg-[#FAF8FC] py-20 px-4"
            >

                <div className="max-w-xl mx-auto text-center">

                    <div
                        className="
                            w-20
                            h-20
                            rounded-3xl
                            bg-red-50
                            flex
                            items-center
                            justify-center
                            mx-auto
                        "
                    >

                        <XCircle
                            size={40}
                            className="text-red-500"
                        />

                    </div>


                    <h1 className="text-2xl font-black text-gray-900 mt-6">
                        لم نتمكن من العثور على الطلب
                    </h1>


                    <p className="text-gray-500 mt-2">
                        قد يكون الطلب غير موجود أو حدث خطأ أثناء تحميل البيانات.
                    </p>


                    <Link
                        to="/orders"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            mt-7
                            bg-[#5B2A86]
                            text-white
                            px-6
                            py-3
                            rounded-2xl
                            font-bold
                            hover:bg-[#4b216f]
                            transition
                        "
                    >

                        <ArrowRight size={18} />

                        العودة إلى طلباتي

                    </Link>

                </div>

            </div>

        );

    }


    const status = getStatus(
        order.status
    );

    const StatusIcon = status.icon;


    const delivery = getDeliveryMethod(
        order.delivery_method
    );

    const DeliveryIcon = delivery.icon;


    return (

        <div
            dir="rtl"
            className="min-h-screen bg-[#FAF8FC] py-10 md:py-14"
        >

            <div className="max-w-5xl mx-auto px-4 sm:px-6">


                {/* ==========================================
                    BACK
                ========================================== */}

                <Link
                    to="/orders"
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-gray-500
                        hover:text-[#5B2A86]
                        font-bold
                        text-sm
                        transition
                        mb-6
                    "
                >

                    <ArrowRight size={18} />

                    العودة إلى طلباتي

                </Link>


                {/* ==========================================
                    HEADER
                ========================================== */}

                <div
                    className="
                        bg-gradient-to-br
                        from-[#5B2A86]
                        to-[#7B3FD6]
                        rounded-[2rem]
                        p-7
                        md:p-9
                        text-white
                        shadow-xl
                    "
                >

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                        <div>

                            <p className="text-purple-200 text-sm font-bold mb-2">
                                تفاصيل الطلب
                            </p>


                            <h1 className="text-3xl md:text-4xl font-black">
                                طلب رقم #{order.id}
                            </h1>


                            <div className="flex items-center gap-2 mt-4 text-white/75 text-sm">

                                <CalendarDays size={17} />

                                {formatDate(
                                    order.created_at ||
                                    order.order_date ||
                                    order.created
                                )}

                            </div>

                        </div>


                        {/* STATUS */}

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                self-start
                                md:self-center
                                bg-white
                                text-gray-800
                                px-4
                                py-3
                                rounded-2xl
                                font-bold
                                shadow-sm
                            "
                        >

                            <StatusIcon
                                size={19}
                                className={
                                    status.className
                                        .split(" ")
                                        .find(
                                            (item) =>
                                                item.startsWith(
                                                    "text-"
                                                )
                                        )
                                }
                            />

                            {status.label}

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    ORDER INFO
                ========================================== */}

                <div className="grid md:grid-cols-2 gap-5 mt-6">


                    {/* DATE */}

                    <div
                        className="
                            bg-white
                            border
                            border-gray-100
                            rounded-3xl
                            p-6
                            shadow-sm
                        "
                    >

                        <div className="flex items-center gap-4">

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

                                <CalendarDays
                                    size={22}
                                    className="text-[#5B2A86]"
                                />

                            </div>


                            <div>

                                <p className="text-sm text-gray-500">
                                    تاريخ الطلب
                                </p>

                                <p className="font-bold text-gray-900 mt-1">
                                    {formatDate(
                                        order.created_at ||
                                        order.order_date ||
                                        order.created
                                    )}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* DELIVERY */}

                    <div
                        className="
                            bg-white
                            border
                            border-gray-100
                            rounded-3xl
                            p-6
                            shadow-sm
                        "
                    >

                        <div className="flex items-center gap-4">

                            <div
                                className="
                                    w-12
                                    h-12
                                    rounded-2xl
                                    bg-emerald-50
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                <DeliveryIcon
                                    size={22}
                                    className="text-emerald-600"
                                />

                            </div>


                            <div>

                                <p className="text-sm text-gray-500">
                                    طريقة الاستلام
                                </p>

                                <p className="font-bold text-gray-900 mt-1">
                                    {delivery.label}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    PRODUCTS
                ========================================== */}

                <div
                    className="
                        bg-white
                        border
                        border-gray-100
                        rounded-3xl
                        shadow-sm
                        overflow-hidden
                        mt-6
                    "
                >

                    <div className="p-6 md:p-8 border-b border-gray-100">

                        <div className="flex items-center gap-4">

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

                                <ShoppingBag
                                    size={22}
                                    className="text-[#5B2A86]"
                                />

                            </div>


                            <div>

                                <h2 className="text-xl font-black text-gray-900">
                                    المنتجات
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    تفاصيل المنتجات الموجودة في الطلب
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="divide-y divide-gray-100">

                        {(order.items || []).map(
                            (item) => (

                                <div
                                    key={item.id}
                                    className="
                                        p-5
                                        md:p-6
                                        flex
                                        flex-col
                                        sm:flex-row
                                        sm:items-center
                                        justify-between
                                        gap-4
                                    "
                                >

                                    <div className="flex items-center gap-4">

                                        <div
                                            className="
                                                w-12
                                                h-12
                                                rounded-2xl
                                                bg-gray-50
                                                flex
                                                items-center
                                                justify-center
                                                shrink-0
                                            "
                                        >

                                            <Package
                                                size={22}
                                                className="text-gray-500"
                                            />

                                        </div>


                                        <div>

                                            <h3 className="font-bold text-gray-900">
                                                {
                                                    item.product_name ||
                                                    item.product?.name ||
                                                    "منتج"
                                                }
                                            </h3>


                                            <p className="text-sm text-gray-500 mt-1">
                                                الكمية:{" "}
                                                {
                                                    item.quantity
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    <div className="text-right">

                                        <p className="font-black text-[#5B2A86] text-lg">

                                            {
                                                item.line_total ??
                                                (
                                                    Number(
                                                        item.unit_price || 0
                                                    ) *
                                                    Number(
                                                        item.quantity || 0
                                                    )
                                                )
                                            }

                                            {" "}جنيه

                                        </p>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* ==========================================
                    TOTAL
                ========================================== */}

                <div
                    className="
                        bg-white
                        border
                        border-gray-100
                        rounded-3xl
                        shadow-sm
                        p-6
                        md:p-8
                        mt-6
                    "
                >

                    <div className="flex items-center justify-between gap-4">

                        <div>

                            <p className="text-gray-500">
                                إجمالي الطلب
                            </p>

                            <p className="text-sm text-gray-400 mt-1">
                                شامل المنتجات الموجودة في الطلب
                            </p>

                        </div>


                        <div className="text-left">

                            <p className="text-3xl font-black text-[#5B2A86]">

                                {
                                    order.total_price
                                }

                                <span className="text-base mr-1">
                                    جنيه
                                </span>

                            </p>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    REFRESH
                ========================================== */}

                <div className="flex justify-center mt-7">

                    <button
                        onClick={loadOrder}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-gray-500
                            hover:text-[#5B2A86]
                            font-bold
                            text-sm
                            transition
                        "
                    >

                        <RefreshCw size={17} />

                        تحديث حالة الطلب

                    </button>

                </div>

            </div>

        </div>

    );

}