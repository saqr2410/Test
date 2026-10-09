import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    RefreshCw,
    Pill,
    ClipboardList,
    ShoppingCart,
    Package,
    AlertTriangle,
    Clock,
    CheckCircle,
    ArrowLeft,
    Activity,
    TrendingUp
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getDashboardStats,
    getLowStockProducts
} from "../../../services/dashboard/dashboardService";

import StatCard from "../../../components/admin/dashboard/StatCard";
import LowStock from "../../../components/admin/dashboard/LowStock";


export default function PharmacistDashboard() {

    const [stats, setStats] = useState({});
    const [stock, setStock] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);


    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    const loadDashboard = async (showLoading = true) => {

        try {

            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            const [
                statsData,
                stockData
            ] = await Promise.all([
                getDashboardStats(),
                getLowStockProducts()
            ]);


            setStats(
                statsData || {}
            );


            setStock(
                Array.isArray(stockData)
                    ? stockData
                    : stockData?.results || []
            );

        }

        catch (error) {

            console.error(
                "PHARMACIST DASHBOARD ERROR:",
                error
            );

            toast.error(
                "فشل تحميل بيانات لوحة الصيدلي"
            );

        }

        finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    useEffect(() => {

        loadDashboard();

    }, []);


    // =====================================================
    // DERIVED DATA
    // =====================================================

    const lowStockCount = useMemo(
        () => stock.length,
        [stock]
    );


    const prescriptionsCount =
        Number(
            stats.prescriptions_count || 0
        );


    const pendingPrescriptions =
        Number(
            stats.pending_prescriptions ||
            stats.pending_prescriptions_count ||
            0
        );


    const approvedPrescriptions =
        Number(
            stats.approved_prescriptions ||
            stats.approved_prescriptions_count ||
            0
        );


    const todaySales =
        Number(
            stats.today_sales ||
            stats.daily_sales ||
            stats.sales_today ||
            0
        );


    const todayOrders =
        Number(
            stats.today_orders ||
            stats.orders_today ||
            0
        );


    const productsCount =
        Number(
            stats.products ||
            stats.products_count ||
            0
        );


    // =====================================================
    // QUICK ACTIONS
    // =====================================================

    const quickActions = [

        {
            title: "مراجعة الروشتات",
            description: "مراجعة وقبول الروشتات الجديدة",
            icon: ClipboardList,
            href: "/admin/prescriptions",
            color: "blue"
        },

        {
            title: "نقطة البيع",
            description: "تنفيذ عملية بيع جديدة",
            icon: ShoppingCart,
            href: "/admin/pos",
            color: "green"
        },

        {
            title: "المخزون",
            description: "متابعة الأدوية والكميات",
            icon: Package,
            href: "/admin/inventory",
            color: "purple"
        }

    ];


    // =====================================================
    // LOADING
    // =====================================================

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
                            w-12
                            h-12
                            border-4
                            border-gray-200
                            border-t-[#5B2A86]
                            rounded-full
                            animate-spin
                            mx-auto
                            mb-4
                        "
                    />

                    <p className="text-gray-500 font-medium">
                        جاري تحميل لوحة الصيدلي...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div
            dir="rtl"
            className="
                space-y-7
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

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            mb-2
                        "
                    >

                        <div
                            className="
                                w-12
                                h-12
                                rounded-2xl
                                bg-purple-100
                                text-[#5B2A86]
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <Pill size={25} />

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
                                لوحة تحكم الصيدلي
                            </h1>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >
                                متابعة الروشتات والمبيعات والمخزون
                            </p>

                        </div>

                    </div>

                </div>


                <button
                    onClick={() => loadDashboard(false)}
                    disabled={refreshing}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        px-5
                        py-3
                        rounded-xl
                        bg-white
                        border
                        border-gray-200
                        text-gray-700
                        font-semibold
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

                    تحديث البيانات

                </button>

            </div>


            {/* ================================================= */}
            {/* MAIN KPIs */}
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

                <ProfessionalStatCard
                    title="روشتات اليوم"
                    value={prescriptionsCount}
                    subtitle="إجمالي الروشتات"
                    icon={ClipboardList}
                    iconClass="bg-blue-100 text-blue-600"
                />


                <ProfessionalStatCard
                    title="روشتات معلقة"
                    value={pendingPrescriptions}
                    subtitle="تحتاج إلى مراجعة"
                    icon={Clock}
                    iconClass="bg-yellow-100 text-yellow-600"
                    danger={pendingPrescriptions > 0}
                />


                <ProfessionalStatCard
                    title="مبيعات اليوم"
                    value={`${todaySales.toLocaleString("ar-EG")} ج.م`}
                    subtitle="إجمالي مبيعات اليوم"
                    icon={TrendingUp}
                    iconClass="bg-green-100 text-green-600"
                />


                <ProfessionalStatCard
                    title="مخزون منخفض"
                    value={lowStockCount}
                    subtitle="منتجات تحتاج متابعة"
                    icon={AlertTriangle}
                    iconClass="bg-red-100 text-red-600"
                    danger={lowStockCount > 0}
                />

            </div>


            {/* ================================================= */}
            {/* PHARMACIST OVERVIEW */}
            {/* ================================================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    lg:grid-cols-3
                    gap-5
                "
            >

                <div
                    className="
                        lg:col-span-2
                        bg-white
                        rounded-2xl
                        border
                        border-gray-100
                        shadow-sm
                        p-6
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            mb-6
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
                                ملخص العمل
                            </h2>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >
                                أهم الأرقام التي يحتاجها الصيدلي
                            </p>

                        </div>


                        <Activity
                            size={22}
                            className="text-[#5B2A86]"
                        />

                    </div>


                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-3
                            gap-4
                        "
                    >

                        <MiniStat
                            label="روشتات مقبولة"
                            value={approvedPrescriptions}
                            icon={CheckCircle}
                            className="text-green-600 bg-green-50"
                        />


                        <MiniStat
                            label="الطلبات اليوم"
                            value={todayOrders}
                            icon={ShoppingCart}
                            className="text-blue-600 bg-blue-50"
                        />


                        <MiniStat
                            label="إجمالي المنتجات"
                            value={productsCount}
                            icon={Package}
                            className="text-purple-600 bg-purple-50"
                        />

                    </div>

                </div>


                {/* STATUS CARD */}

                <div
                    className="
                        bg-gradient-to-br
                        from-[#5B2A86]
                        to-[#7B3FB0]
                        rounded-2xl
                        shadow-sm
                        p-6
                        text-white
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            mb-5
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-white/70
                                    text-sm
                                "
                            >
                                حالة العمل
                            </p>

                            <h2
                                className="
                                    text-2xl
                                    font-black
                                    mt-1
                                "
                            >
                                اليوم
                            </h2>

                        </div>


                        <div
                            className="
                                w-11
                                h-11
                                rounded-xl
                                bg-white/15
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <Pill size={22} />

                        </div>

                    </div>


                    <div className="space-y-4">

                        <StatusRow
                            label="روشتات معلقة"
                            value={pendingPrescriptions}
                        />

                        <StatusRow
                            label="مبيعات اليوم"
                            value={`${todaySales.toLocaleString("ar-EG")} ج.م`}
                        />

                        <StatusRow
                            label="مخزون منخفض"
                            value={lowStockCount}
                        />

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* QUICK ACTIONS */}
            {/* ================================================= */}

            <div>

                <div className="mb-4">

                    <h2
                        className="
                            text-xl
                            font-black
                            text-gray-900
                        "
                    >
                        الإجراءات السريعة
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >
                        الوصول السريع للمهام اليومية
                    </p>

                </div>


                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-4
                    "
                >

                    {quickActions.map((action) => (

                        <a
                            key={action.title}
                            href={action.href}
                            className="
                                group
                                bg-white
                                border
                                border-gray-100
                                rounded-2xl
                                p-5
                                shadow-sm
                                hover:shadow-md
                                hover:-translate-y-0.5
                                transition-all
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div
                                    className="
                                        w-11
                                        h-11
                                        rounded-xl
                                        bg-gray-100
                                        flex
                                        items-center
                                        justify-center
                                        text-[#5B2A86]
                                    "
                                >

                                    <action.icon size={21} />

                                </div>


                                <ArrowLeft
                                    size={18}
                                    className="
                                        text-gray-300
                                        group-hover:text-[#5B2A86]
                                        transition
                                    "
                                />

                            </div>


                            <h3
                                className="
                                    font-bold
                                    text-gray-900
                                    mt-4
                                "
                            >
                                {action.title}
                            </h3>


                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >
                                {action.description}
                            </p>

                        </a>

                    ))}

                </div>

            </div>


            {/* ================================================= */}
            {/* LOW STOCK */}
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

                <div
                    className="
                        p-6
                        border-b
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <AlertTriangle
                                size={20}
                                className="text-red-500"
                            />

                            <h2
                                className="
                                    text-lg
                                    font-black
                                "
                            >
                                تنبيهات المخزون
                            </h2>

                        </div>


                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            المنتجات التي تحتاج إلى متابعة
                        </p>

                    </div>


                    <span
                        className="
                            px-3
                            py-1.5
                            rounded-full
                            text-xs
                            font-bold
                            bg-red-50
                            text-red-600
                        "
                    >
                        {lowStockCount} منتج
                    </span>

                </div>


                <div className="p-1">

                    <LowStock
                        products={stock}
                    />

                </div>

            </div>

        </div>

    );

}


// =============================================================
// PROFESSIONAL STAT CARD
// =============================================================

function ProfessionalStatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconClass,
    danger = false
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
                hover:shadow-md
                transition
            "
        >

            <div
                className="
                    flex
                    items-start
                    justify-between
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            font-medium
                            text-gray-500
                        "
                    >
                        {title}
                    </p>


                    <h2
                        className="
                            text-2xl
                            font-black
                            text-gray-900
                            mt-2
                        "
                    >
                        {value}
                    </h2>


                    <p
                        className={`
                            text-xs
                            mt-2
                            ${danger
                                ? "text-red-500"
                                : "text-gray-400"
                            }
                        `}
                    >
                        {subtitle}
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

                    <Icon size={21} />

                </div>

            </div>

        </div>

    );

}


// =============================================================
// MINI STAT
// =============================================================

function MiniStat({
    label,
    value,
    icon: Icon,
    className
}) {

    return (

        <div
            className="
                rounded-xl
                border
                border-gray-100
                p-4
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
                        w-10
                        h-10
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        ${className}
                    `}
                >

                    <Icon size={18} />

                </div>


                <div>

                    <p
                        className="
                            text-xs
                            text-gray-500
                        "
                    >
                        {label}
                    </p>

                    <p
                        className="
                            text-lg
                            font-black
                            mt-0.5
                        "
                    >
                        {value}

                    </p>

                </div>

            </div>

        </div>

    );

}


// =============================================================
// STATUS ROW
// =============================================================

function StatusRow({
    label,
    value
}) {

    return (

        <div
            className="
                flex
                items-center
                justify-between
                border-b
                border-white/10
                pb-3
                last:border-0
            "
        >

            <span
                className="
                    text-sm
                    text-white/70
                "
            >
                {label}
            </span>


            <span
                className="
                    font-black
                "
            >
                {value}
            </span>

        </div>

    );

}