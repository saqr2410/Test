import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getOrderDetails
} from "../../../services/orders/orderService";

import Loading from "../../../components/ui/feedback/Loading";

import toast from "react-hot-toast";

import {
    ArrowRight,
    Package,
    User,
    Phone,
    MapPin,
    Truck,
    Store,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    UserCircle,
    Hash,
    ShoppingBag,
    CreditCard,
    ClipboardList,
    CircleDot
} from "lucide-react";


export default function OrderDetails() {

    const {
        id
    } = useParams();

    const navigate = useNavigate();


    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        loadOrder();

    }, [id]);


    const loadOrder = async () => {

        try {

            setLoading(true);

            const data =
                await getOrderDetails(id);

            setOrder(data);

        } catch (error) {

            console.error(
                "Order Details Error:",
                error
            );

            toast.error(
                "فشل تحميل تفاصيل الطلب"
            );

        } finally {

            setLoading(false);

        }
    };


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(
            date
        ).toLocaleString(
            "ar-EG",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };


    const money = (value) => {

        return Number(
            value || 0
        ).toLocaleString(
            "ar-EG",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };


    const getStatusInfo = (status) => {

        const statuses = {

            PENDING: {
                label: "قيد الانتظار",
                color:
                    "bg-amber-50 text-amber-700 border-amber-200",
                icon: Clock,
                dot: "bg-amber-500"
            },

            PROCESSING: {
                label: "قيد التجهيز",
                color:
                    "bg-purple-50 text-purple-700 border-purple-200",
                icon: Package,
                dot: "bg-purple-500"
            },

            READY: {
                label: "جاهز للاستلام",
                color:
                    "bg-emerald-50 text-emerald-700 border-emerald-200",
                icon: CheckCircle,
                dot: "bg-emerald-500"
            },

            SHIPPED: {
                label: "جاري التوصيل",
                color:
                    "bg-indigo-50 text-indigo-700 border-indigo-200",
                icon: Truck,
                dot: "bg-indigo-500"
            },

            COMPLETED: {
                label: "مكتمل",
                color:
                    "bg-teal-50 text-teal-700 border-teal-200",
                icon: CheckCircle,
                dot: "bg-teal-500"
            },

            CANCELLED: {
                label: "ملغي",
                color:
                    "bg-red-50 text-red-700 border-red-200",
                icon: XCircle,
                dot: "bg-red-500"
            }
        };


        return (
            statuses[status] || {
                label: status || "-",
                color:
                    "bg-gray-50 text-gray-700 border-gray-200",
                icon: CircleDot,
                dot: "bg-gray-500"
            }
        );
    };


    const getDeliveryInfo = (method) => {

        if (method === "DELIVERY") {

            return {
                label: "توصيل",
                description:
                    "سيتم توصيل الطلب إلى عنوان العميل",
                icon: Truck,
                color: "text-indigo-600",
                bg: "bg-indigo-50"
            };

        }


        if (method === "PICKUP") {

            return {
                label: "استلام من الصيدلية",
                description:
                    "العميل سيستلم الطلب من الصيدلية",
                icon: Store,
                color: "text-emerald-600",
                bg: "bg-emerald-50"
            };

        }


        return {
            label: method || "-",
            description: "",
            icon: Package,
            color: "text-gray-600",
            bg: "bg-gray-50"
        };
    };


    const statusInfo = useMemo(() => {

        if (!order) {
            return null;
        }

        return getStatusInfo(
            order.status
        );

    }, [order]);


    const deliveryInfo = useMemo(() => {

        if (!order) {
            return null;
        }

        return getDeliveryInfo(
            order.delivery_method
        );

    }, [order]);


    const subtotal = useMemo(() => {

        if (!order?.items) {
            return 0;
        }

        return order.items.reduce(
            (
                sum,
                item
            ) => {

                const lineTotal =
                    Number(
                        item.line_total ||
                        (
                            Number(
                                item.unit_price || 0
                            ) *
                            Number(
                                item.quantity || 0
                            )
                        )
                    );

                return sum + lineTotal;

            },
            0
        );

    }, [order]);


    const totalItems = useMemo(() => {

        if (!order?.items) {
            return 0;
        }

        return order.items.reduce(
            (
                sum,
                item
            ) => {

                return (
                    sum +
                    Number(
                        item.quantity || 0
                    )
                );

            },
            0
        );

    }, [order]);


    const timeline = useMemo(() => {

        if (!order) {
            return [];
        }


        const steps = [

            {
                key: "PENDING",
                label: "تم إنشاء الطلب",
                icon: ClipboardList
            },

            {
                key: "PROCESSING",
                label: "جاري تجهيز الطلب",
                icon: Package
            },

            {
                key:
                    order.delivery_method ===
                        "DELIVERY"
                        ? "SHIPPED"
                        : "READY",

                label:
                    order.delivery_method ===
                        "DELIVERY"
                        ? "خرج للتوصيل"
                        : "جاهز للاستلام",

                icon:
                    order.delivery_method ===
                        "DELIVERY"
                        ? Truck
                        : Store
            },

            {
                key: "COMPLETED",
                label: "تم إتمام الطلب",
                icon: CheckCircle
            }

        ];


        return steps;

    }, [order]);


    const getTimelineState = (key) => {

        if (!order) {
            return "pending";
        }


        if (order.status === "CANCELLED") {
            return "cancelled";
        }


        const statusOrder = {

            PENDING: 1,

            PROCESSING: 2,

            READY: 3,

            SHIPPED: 3,

            COMPLETED: 4

        };


        const current =
            statusOrder[
            order.status
            ] || 0;


        const item =
            statusOrder[key] || 0;


        if (current >= item) {
            return "completed";
        }


        return "pending";
    };


    if (loading) {

        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <Loading />
            </div>
        );

    }


    if (!order) {

        return (
            <div
                dir="rtl"
                className="
                    min-h-[500px]
                    flex
                    items-center
                    justify-center
                    p-6
                "
            >

                <div className="text-center max-w-md">

                    <div
                        className="
                            w-20
                            h-20
                            rounded-3xl
                            bg-red-50
                            text-red-500
                            flex
                            items-center
                            justify-center
                            mx-auto
                            mb-5
                        "
                    >
                        <Package size={38} />
                    </div>


                    <h2
                        className="
                            text-2xl
                            font-black
                            text-gray-800
                            mb-2
                        "
                    >
                        الطلب غير موجود
                    </h2>


                    <p className="text-gray-500 mb-6">
                        لم نتمكن من العثور على الطلب المطلوب.
                    </p>


                    <button
                        onClick={() =>
                            navigate(
                                "/admin/orders"
                            )
                        }
                        className="
                            inline-flex
                            items-center
                            gap-2
                            px-5
                            py-3
                            rounded-xl
                            bg-[#5B2A86]
                            text-white
                            font-bold
                            hover:bg-[#4a216d]
                            transition
                        "
                    >
                        <ArrowRight size={18} />

                        العودة للطلبات
                    </button>

                </div>

            </div>
        );

    }


    const StatusIcon =
        statusInfo.icon;

    const DeliveryIcon =
        deliveryInfo.icon;


    return (
        <div
            dir="rtl"
            className="
                space-y-6
                pb-10
            "
        >

            {/* HEADER */}

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

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            mb-2
                        "
                    >

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/orders"
                                )
                            }
                            className="
                                w-10
                                h-10
                                rounded-xl
                                border
                                bg-white
                                flex
                                items-center
                                justify-center
                                text-gray-500
                                hover:text-[#5B2A86]
                                hover:border-[#5B2A86]
                                transition
                            "
                            title="العودة للطلبات"
                        >
                            <ArrowRight size={19} />
                        </button>


                        <div>

                            <p className="text-sm text-gray-500 mb-1">
                                إدارة الطلبات
                            </p>

                            <h1
                                className="
                                    text-2xl
                                    md:text-3xl
                                    font-black
                                    text-gray-900
                                "
                            >
                                طلب #{order.id}
                            </h1>

                        </div>

                    </div>


                    <p
                        className="
                            text-gray-500
                            text-sm
                            mr-13
                        "
                    >
                        تفاصيل الطلب ومعلومات العميل والمنتجات
                    </p>

                </div>


                <div
                    className={`
                        inline-flex
                        self-start
                        lg:self-center
                        items-center
                        gap-2
                        px-4
                        py-2.5
                        rounded-xl
                        border
                        font-bold
                        ${statusInfo.color}
                    `}
                >

                    <StatusIcon size={18} />

                    {statusInfo.label}

                </div>

            </div>


            {/* SUMMARY */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-4
                "
            >

                <SummaryCard
                    title="رقم الطلب"
                    value={`#${order.id}`}
                    icon={Hash}
                    iconClass="
                        bg-purple-50
                        text-[#5B2A86]
                    "
                />


                <SummaryCard
                    title="إجمالي الطلب"
                    value={`${money(order.total_price)} جنيه`}
                    icon={CreditCard}
                    iconClass="
                        bg-purple-50
                        text-[#5B2A86]
                    "
                />


                <SummaryCard
                    title="المنتجات"
                    value={totalItems}
                    subtitle={`${order.items?.length || 0} أصناف`}
                    icon={ShoppingBag}
                    iconClass="
                        bg-blue-50
                        text-blue-600
                    "
                />


                <SummaryCard
                    title="تاريخ الطلب"
                    value={formatDate(order.created_at)}
                    icon={Calendar}
                    iconClass="
                        bg-emerald-50
                        text-emerald-600
                    "
                />

            </div>


            {/* STATUS TIMELINE */}

            <div
                className="
                    bg-white
                    rounded-2xl
                    border
                    shadow-sm
                    p-6
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        mb-7
                    "
                >

                    <div>

                        <h2
                            className="
                                text-lg
                                font-black
                                text-gray-900
                            "
                        >
                            حالة الطلب
                        </h2>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            متابعة مراحل تنفيذ الطلب
                        </p>

                    </div>


                    <div
                        className={`
                            hidden
                            sm:flex
                            items-center
                            gap-2
                            px-3
                            py-2
                            rounded-xl
                            text-sm
                            font-bold
                            ${statusInfo.color}
                        `}
                    >

                        <StatusIcon size={16} />

                        {statusInfo.label}

                    </div>

                </div>


                {order.status === "CANCELLED" ? (

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                            p-4
                            rounded-2xl
                            bg-red-50
                            border
                            border-red-100
                        "
                    >

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
                            <XCircle size={25} />
                        </div>


                        <div>

                            <p className="font-black text-red-700">
                                تم إلغاء الطلب
                            </p>

                            {order.cancellation_reason && (
                                <p
                                    className="
                                        text-sm
                                        text-red-600
                                        mt-1
                                    "
                                >
                                    السبب:{" "}
                                    {order.cancellation_reason}
                                </p>
                            )}

                        </div>

                    </div>

                ) : (

                    <div className="relative">

                        <div
                            className="
                                hidden
                                md:block
                                absolute
                                top-6
                                right-[10%]
                                left-[10%]
                                h-0.5
                                bg-gray-200
                            "
                        />


                        <div
                            className="
                                grid
                                grid-cols-2
                                md:grid-cols-4
                                gap-6
                                relative
                            "
                        >

                            {timeline.map(
                                (step) => {

                                    const state =
                                        getTimelineState(
                                            step.key
                                        );

                                    const StepIcon =
                                        step.icon;


                                    return (
                                        <div
                                            key={
                                                step.key
                                            }
                                            className="
                                                flex
                                                flex-col
                                                items-center
                                                text-center
                                            "
                                        >

                                            <div
                                                className={`
                                                    relative
                                                    z-10
                                                    w-12
                                                    h-12
                                                    rounded-full
                                                    flex
                                                    items-center
                                                    justify-center
                                                    border-4
                                                    border-white
                                                    shadow-sm
                                                    transition
                                                    ${state ===
                                                        "completed"
                                                        ? "bg-[#5B2A86] text-white"
                                                        : "bg-gray-100 text-gray-400"
                                                    }
                                                `}
                                            >
                                                <StepIcon size={20} />
                                            </div>


                                            <p
                                                className={`
                                                    mt-3
                                                    text-sm
                                                    font-bold
                                                    ${state ===
                                                        "completed"
                                                        ? "text-gray-900"
                                                        : "text-gray-400"
                                                    }
                                                `}
                                            >
                                                {step.label}
                                            </p>

                                        </div>
                                    );

                                }
                            )}

                        </div>

                    </div>

                )}

            </div>


            {/* CUSTOMER + DELIVERY */}

            <div
                className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-6
                "
            >

                {/* CUSTOMER */}

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
                            p-6
                            border-b
                            bg-gradient-to-l
                            from-purple-50/70
                            to-white
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-purple-100
                                    text-[#5B2A86]
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <UserCircle size={23} />
                            </div>


                            <div>

                                <h2
                                    className="
                                        font-black
                                        text-lg
                                        text-gray-900
                                    "
                                >
                                    بيانات العميل
                                </h2>

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                        mt-0.5
                                    "
                                >
                                    معلومات صاحب الطلب
                                </p>

                            </div>

                        </div>

                    </div>


                    <div
                        className="
                            p-6
                            space-y-5
                        "
                    >

                        <InfoRow
                            icon={User}
                            label="الاسم"
                            value={
                                order.customer_name ||
                                "-"
                            }
                        />


                        <InfoRow
                            icon={Phone}
                            label="رقم الهاتف"
                            value={
                                order.phone ||
                                "-"
                            }
                        />


                        {order.user && (

                            <div
                                className="
                                    border-t
                                    pt-5
                                    space-y-4
                                "
                            >

                                <InfoRow
                                    icon={Mail}
                                    label="البريد الإلكتروني"
                                    value={
                                        order.user.email ||
                                        "-"
                                    }
                                    blue
                                />


                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        sm:grid-cols-2
                                        gap-4
                                    "
                                >

                                    <SmallInfo
                                        label="اسم المستخدم"
                                        value={
                                            order.user.username ||
                                            "-"
                                        }
                                    />

                                    <SmallInfo
                                        label="الدور"
                                        value={
                                            order.user.role ||
                                            "-"
                                        }
                                    />

                                    <SmallInfo
                                        label="الاسم الأول"
                                        value={
                                            order.user.first_name ||
                                            "-"
                                        }
                                    />

                                    <SmallInfo
                                        label="الاسم الأخير"
                                        value={
                                            order.user.last_name ||
                                            "-"
                                        }
                                    />

                                </div>

                            </div>

                        )}


                        {order.user_name &&
                            !order.user && (

                                <div
                                    className="
                                        border-t
                                        pt-4
                                    "
                                >

                                    <p
                                        className="
                                            text-xs
                                            text-gray-400
                                        "
                                    >
                                        المستخدم
                                    </p>

                                    <p className="font-bold mt-1">
                                        {order.user_name}
                                    </p>

                                </div>

                            )}

                    </div>

                </div>


                {/* DELIVERY */}

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
                            p-6
                            border-b
                            bg-gradient-to-l
                            from-blue-50/70
                            to-white
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className={`
                                    w-11
                                    h-11
                                    rounded-xl
                                    ${deliveryInfo.bg}
                                    ${deliveryInfo.color}
                                    flex
                                    items-center
                                    justify-center
                                `}
                            >
                                <DeliveryIcon size={23} />
                            </div>


                            <div>

                                <h2
                                    className="
                                        font-black
                                        text-lg
                                        text-gray-900
                                    "
                                >
                                    معلومات الاستلام
                                </h2>

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                        mt-0.5
                                    "
                                >
                                    طريقة استلام الطلب
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="p-6">

                        <div
                            className={`
                                flex
                                items-center
                                gap-4
                                p-4
                                rounded-2xl
                                ${deliveryInfo.bg}
                            `}
                        >

                            <div
                                className={`
                                    w-12
                                    h-12
                                    rounded-xl
                                    bg-white
                                    ${deliveryInfo.color}
                                    flex
                                    items-center
                                    justify-center
                                    shadow-sm
                                `}
                            >
                                <DeliveryIcon size={24} />
                            </div>


                            <div>

                                <p className="font-black text-gray-900">
                                    {deliveryInfo.label}
                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    {deliveryInfo.description}
                                </p>

                            </div>

                        </div>


                        {order.delivery_method ===
                            "DELIVERY" && (

                                <div className="mt-5">

                                    <div
                                        className="
                                            flex
                                            items-start
                                            gap-3
                                            p-4
                                            rounded-2xl
                                            border
                                            bg-gray-50
                                        "
                                    >

                                        <div
                                            className="
                                                w-10
                                                h-10
                                                rounded-xl
                                                bg-white
                                                text-red-500
                                                flex
                                                items-center
                                                justify-center
                                                shadow-sm
                                                shrink-0
                                            "
                                        >
                                            <MapPin size={20} />
                                        </div>


                                        <div>

                                            <p
                                                className="
                                                    text-xs
                                                    text-gray-400
                                                    mb-1
                                                "
                                            >
                                                عنوان التوصيل
                                            </p>

                                            <p
                                                className="
                                                    font-bold
                                                    text-gray-800
                                                    leading-7
                                                "
                                            >
                                                {order.address ||
                                                    "لم يتم تحديد عنوان"}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )}


                        {order.delivery_method ===
                            "PICKUP" && (

                                <div
                                    className="
                                        mt-5
                                        flex
                                        items-center
                                        gap-3
                                        p-4
                                        rounded-2xl
                                        bg-emerald-50
                                        border
                                        border-emerald-100
                                    "
                                >

                                    <Store
                                        size={22}
                                        className="
                                            text-emerald-600
                                            shrink-0
                                        "
                                    />

                                    <div>

                                        <p className="font-bold text-emerald-700">
                                            الاستلام من الصيدلية
                                        </p>

                                        <p className="text-sm text-emerald-600 mt-1">
                                            سيتم استلام الطلب من مقر الصيدلية.
                                        </p>

                                    </div>

                                </div>

                            )}


                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-4
                                mt-5
                            "
                        >

                            <SmallInfo
                                label="طريقة الاستلام"
                                value={
                                    deliveryInfo.label
                                }
                            />

                            <SmallInfo
                                label="تاريخ الإنشاء"
                                value={
                                    order.created_at
                                        ? new Date(
                                            order.created_at
                                        ).toLocaleDateString(
                                            "ar-EG"
                                        )
                                        : "-"
                                }
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* PRODUCTS */}

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
                        p-6
                        border-b
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-purple-50
                                text-[#5B2A86]
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <Package size={23} />
                        </div>


                        <div>

                            <h2 className="text-lg font-black text-gray-900">
                                منتجات الطلب
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                تفاصيل المنتجات والكميات والأسعار
                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            px-3
                            py-2
                            rounded-xl
                            bg-gray-50
                            text-sm
                            font-bold
                            text-gray-600
                        "
                    >
                        {totalItems} قطعة
                    </div>

                </div>


                {!order.items ||
                    order.items.length === 0 ? (

                    <div className="py-16 text-center">

                        <div
                            className="
                                w-16
                                h-16
                                rounded-2xl
                                bg-gray-100
                                text-gray-400
                                flex
                                items-center
                                justify-center
                                mx-auto
                                mb-4
                            "
                        >
                            <Package size={30} />
                        </div>

                        <p className="font-bold text-gray-700">
                            لا توجد منتجات
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                            لم يتم العثور على منتجات داخل هذا الطلب.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-right">

                            <thead>

                                <tr className="bg-gray-50 border-b">

                                    <th className="px-6 py-4 text-xs font-black text-gray-500">
                                        #
                                    </th>

                                    <th className="px-6 py-4 text-xs font-black text-gray-500">
                                        المنتج
                                    </th>

                                    <th className="px-6 py-4 text-xs font-black text-gray-500">
                                        الكمية
                                    </th>

                                    <th className="px-6 py-4 text-xs font-black text-gray-500">
                                        سعر الوحدة
                                    </th>

                                    <th className="px-6 py-4 text-xs font-black text-gray-500">
                                        الإجمالي
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {order.items.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                item.id
                                            }
                                            className="
                                                border-b
                                                last:border-0
                                                hover:bg-gray-50
                                                transition
                                            "
                                        >

                                            <td
                                                className="
                                                    px-6
                                                    py-5
                                                    text-sm
                                                    text-gray-400
                                                    font-bold
                                                "
                                            >
                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </td>


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
                                                            shrink-0
                                                        "
                                                    >
                                                        <Package size={18} />
                                                    </div>


                                                    <div>

                                                        <p className="font-bold text-gray-900">
                                                            {
                                                                item.product_name ||
                                                                "-"
                                                            }
                                                        </p>


                                                        {item.product_code && (

                                                            <p className="text-xs text-gray-400 mt-1">
                                                                كود:{" "}
                                                                {
                                                                    item.product_code
                                                                }
                                                            </p>

                                                        )}

                                                    </div>

                                                </div>

                                            </td>


                                            <td className="px-6 py-5">

                                                <span
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        justify-center
                                                        min-w-10
                                                        px-3
                                                        py-1.5
                                                        rounded-lg
                                                        bg-gray-100
                                                        font-black
                                                        text-sm
                                                    "
                                                >
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                            </td>


                                            <td
                                                className="
                                                    px-6
                                                    py-5
                                                    text-sm
                                                    font-medium
                                                    text-gray-600
                                                "
                                            >
                                                {money(
                                                    item.unit_price
                                                )}{" "}
                                                جنيه
                                            </td>


                                            <td className="px-6 py-5">

                                                <span
                                                    className="
                                                        font-black
                                                        text-[#5B2A86]
                                                    "
                                                >
                                                    {money(
                                                        item.line_total
                                                    )}
                                                </span>

                                                <span className="text-xs text-gray-400 mr-1">
                                                    جنيه
                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* SUMMARY */}

            <div
                className="
                    grid
                    grid-cols-1
                    lg:grid-cols-3
                    gap-6
                "
            >

                <div
                    className="
                        lg:col-span-2
                        bg-white
                        rounded-2xl
                        border
                        shadow-sm
                        p-6
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            mb-6
                        "
                    >

                        <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-purple-50
                                text-[#5B2A86]
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <CreditCard size={22} />
                        </div>


                        <div>

                            <h2 className="text-lg font-black">
                                ملخص الطلب
                            </h2>

                            <p className="text-xs text-gray-500 mt-1">
                                ملخص القيمة الإجمالية للطلب
                            </p>

                        </div>

                    </div>


                    <div className="space-y-4">

                        <div className="flex items-center justify-between">

                            <span className="text-gray-500">
                                عدد الأصناف
                            </span>

                            <span className="font-bold">
                                {order.items?.length || 0}
                            </span>

                        </div>


                        <div className="flex items-center justify-between">

                            <span className="text-gray-500">
                                إجمالي الكمية
                            </span>

                            <span className="font-bold">
                                {totalItems}
                            </span>

                        </div>


                        <div className="flex items-center justify-between">

                            <span className="text-gray-500">
                                قيمة المنتجات
                            </span>

                            <span className="font-bold">
                                {money(subtotal)} جنيه
                            </span>

                        </div>


                        <div
                            className="
                                border-t
                                pt-4
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <div>

                                <p className="text-sm text-gray-500">
                                    الإجمالي النهائي
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    شامل جميع عناصر الطلب
                                </p>

                            </div>


                            <p
                                className="
                                    text-2xl
                                    font-black
                                    text-[#5B2A86]
                                "
                            >
                                {money(
                                    order.total_price
                                )}{" "}

                                <span className="text-sm">
                                    جنيه
                                </span>

                            </p>

                        </div>

                    </div>

                </div>


                <div
                    className="
                        bg-[#5B2A86]
                        rounded-2xl
                        shadow-sm
                        p-6
                        text-white
                    "
                >

                    <div
                        className="
                            w-12
                            h-12
                            rounded-xl
                            bg-white/10
                            flex
                            items-center
                            justify-center
                            mb-5
                        "
                    >
                        <ClipboardList size={24} />
                    </div>


                    <p className="text-white/70 text-sm mb-2">
                        حالة الطلب الحالية
                    </p>


                    <h3 className="text-2xl font-black mb-5">
                        {statusInfo.label}
                    </h3>


                    <div className="space-y-3 text-sm">

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                py-2
                                border-b
                                border-white/10
                            "
                        >

                            <span className="text-white/60">
                                رقم الطلب
                            </span>

                            <span className="font-bold">
                                #{order.id}
                            </span>

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                py-2
                                border-b
                                border-white/10
                            "
                        >

                            <span className="text-white/60">
                                العميل
                            </span>

                            <span className="font-bold truncate max-w-[150px]">
                                {order.customer_name || "-"}
                            </span>

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                py-2
                            "
                        >

                            <span className="text-white/60">
                                الاستلام
                            </span>

                            <span className="font-bold">
                                {deliveryInfo.label}
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* FOOTER */}

            <div className="flex justify-end">

                <button
                    onClick={() =>
                        navigate(
                            "/admin/orders"
                        )
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        px-5
                        py-3
                        rounded-xl
                        bg-white
                        border
                        text-gray-700
                        font-bold
                        hover:border-[#5B2A86]
                        hover:text-[#5B2A86]
                        transition
                        shadow-sm
                    "
                >
                    <ArrowRight size={18} />

                    العودة إلى قائمة الطلبات

                </button>

            </div>

        </div>
    );
}


/* ==========================================
   Summary Card
========================================== */

function SummaryCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconClass
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
                    items-center
                    justify-between
                "
            >

                <div>

                    <p className="text-sm text-gray-500 mb-1">
                        {title}
                    </p>

                    <p className="text-xl font-black text-gray-900">
                        {value}
                    </p>

                    {subtitle && (

                        <p className="text-xs text-gray-400 mt-1">
                            {subtitle}
                        </p>

                    )}

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
                    <Icon size={21} />
                </div>

            </div>

        </div>
    );
}


/* ==========================================
   Info Row
========================================== */

function InfoRow({
    icon: Icon,
    label,
    value,
    blue = false
}) {

    return (
        <div
            className="
                flex
                items-center
                gap-3
            "
        >

            <div
                className={`
                    w-9
                    h-9
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    ${blue
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }
                `}
            >
                <Icon size={17} />
            </div>


            <div>

                <p className="text-xs text-gray-400">
                    {label}
                </p>

                <p className="font-bold text-gray-800 break-all">
                    {value}
                </p>

            </div>

        </div>
    );
}


/* ==========================================
   Small Info
========================================== */

function SmallInfo({
    label,
    value
}) {

    return (
        <div
            className="
                bg-gray-50
                rounded-xl
                p-3
            "
        >

            <p className="text-xs text-gray-400 mb-1">
                {label}
            </p>

            <p className="font-bold text-sm">
                {value}
            </p>

        </div>
    );
}