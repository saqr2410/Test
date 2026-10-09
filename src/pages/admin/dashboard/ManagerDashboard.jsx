import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    RefreshCw,
    TrendingUp,
    ShoppingBag,
    Package,
    AlertTriangle,
    ArrowUpRight
} from "lucide-react";

import {
    getDashboardStats,
    getRecentOrders,
    getLowStockProducts
} from "../../../services/dashboard/dashboardService";

import StatCard from "../../../components/admin/dashboard/StatCard";
import RecentOrders from "../../../components/admin/dashboard/RecentOrders";
import LowStock from "../../../components/admin/dashboard/LowStock";
import SalesChart from "../../../components/admin/dashboard/SalesChart";


export default function ManagerDashboard() {

    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);
    const [lowStock, setLowStock] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");


    const loadDashboard = useCallback(async (isRefresh = false) => {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const [
                statsData,
                ordersData,
                stockData
            ] = await Promise.all([
                getDashboardStats(),
                getRecentOrders(),
                getLowStockProducts()
            ]);

            setStats(statsData || {});
            setOrders(Array.isArray(ordersData) ? ordersData : []);
            setLowStock(Array.isArray(stockData) ? stockData : []);

        } catch (error) {

            console.error(
                "Manager Dashboard Error:",
                error
            );

            setError(
                "حدث خطأ أثناء تحميل بيانات لوحة التحكم."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    }, []);


    useEffect(() => {

        loadDashboard();

    }, [loadDashboard]);


    if (loading) {

        return (
            <DashboardSkeleton />
        );

    }


    return (

        <div
            dir="rtl"
            className="
                min-h-full
                bg-gray-50/60
                p-4
                md:p-6
                lg:p-8
            "
        >

            <div
                className="
                    max-w-[1600px]
                    mx-auto
                    space-y-7
                "
            >

                {/* ================= HEADER ================= */}

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
                                    shadow-purple-200
                                "
                            >
                                <TrendingUp size={24} />
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
                                    لوحة تحكم المدير
                                </h1>

                                <p
                                    className="
                                        text-sm
                                        text-gray-500
                                        mt-1
                                    "
                                >
                                    نظرة شاملة على أداء الصيدلية اليوم
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        onClick={() => loadDashboard(true)}
                        disabled={refreshing}
                        className="
                            self-start
                            lg:self-auto
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
                            font-bold
                            text-sm
                            shadow-sm
                            hover:border-[#5B2A86]
                            hover:text-[#5B2A86]
                            hover:shadow-md
                            transition-all
                            disabled:opacity-60
                            disabled:cursor-not-allowed
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
                            ? "جاري التحديث..."
                            : "تحديث البيانات"
                        }

                    </button>

                </div>


                {/* ================= ERROR ================= */}

                {error && (

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-red-100
                            bg-red-50
                            px-5
                            py-4
                            text-red-700
                        "
                    >

                        <AlertTriangle size={20} />

                        <span className="font-semibold">
                            {error}
                        </span>

                    </div>

                )}


                {/* ================= STATS ================= */}

                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        xl:grid-cols-4
                        gap-5
                    "
                >

                    <StatCard
                        title="إجمالي المبيعات"
                        value={stats.total_sales || 0}
                        type="sales"
                        suffix="جنيه"
                    />

                    <StatCard
                        title="إجمالي الطلبات"
                        value={stats.orders_count || 0}
                        type="orders"
                        suffix="طلب"
                    />

                    <StatCard
                        title="إجمالي المنتجات"
                        value={stats.products || 0}
                        type="products"
                        suffix="منتج"
                    />

                    <StatCard
                        title="مخزون منخفض"
                        value={lowStock.length}
                        type="products"
                        suffix="منتج يحتاج متابعة"
                    />

                </div>


                {/* ================= QUICK SUMMARY ================= */}

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
                            rounded-3xl
                            bg-gradient-to-br
                            from-[#5B2A86]
                            to-[#7B3FB0]
                            p-6
                            md:p-7
                            text-white
                            shadow-xl
                            shadow-purple-100
                            relative
                            overflow-hidden
                        "
                    >

                        <div
                            className="
                                absolute
                                -top-20
                                -left-20
                                w-56
                                h-56
                                rounded-full
                                bg-white/10
                            "
                        />

                        <div
                            className="
                                absolute
                                -bottom-24
                                right-10
                                w-64
                                h-64
                                rounded-full
                                bg-white/5
                            "
                        />

                        <div
                            className="
                                relative
                                z-10
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-white/70
                                            text-sm
                                            font-semibold
                                        "
                                    >
                                        أداء اليوم
                                    </p>

                                    <h2
                                        className="
                                            text-2xl
                                            md:text-3xl
                                            font-black
                                            mt-2
                                        "
                                    >
                                        {stats.total_sales || 0} جنيه
                                    </h2>

                                </div>

                                <div
                                    className="
                                        w-12
                                        h-12
                                        rounded-2xl
                                        bg-white/15
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <TrendingUp size={24} />
                                </div>

                            </div>


                            <div
                                className="
                                    mt-6
                                    flex
                                    flex-wrap
                                    gap-3
                                "
                            >

                                <div
                                    className="
                                        px-4
                                        py-2
                                        rounded-xl
                                        bg-white/10
                                        text-sm
                                    "
                                >
                                    {stats.orders_count || 0} طلب اليوم
                                </div>

                                <div
                                    className="
                                        px-4
                                        py-2
                                        rounded-xl
                                        bg-white/10
                                        text-sm
                                    "
                                >
                                    {stats.products || 0} منتج
                                </div>

                            </div>

                        </div>

                    </div>


                    <div
                        className="
                            bg-white
                            rounded-3xl
                            border
                            border-gray-100
                            p-6
                            shadow-sm
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
                                        text-gray-400
                                        font-semibold
                                    "
                                >
                                    حالة المخزون
                                </p>

                                <h3
                                    className="
                                        text-2xl
                                        font-black
                                        text-gray-900
                                        mt-2
                                    "
                                >
                                    {lowStock.length === 0
                                        ? "ممتاز"
                                        : "تحتاج متابعة"
                                    }
                                </h3>

                            </div>

                            <div
                                className={`
                                    w-12
                                    h-12
                                    rounded-2xl
                                    flex
                                    items-center
                                    justify-center
                                    ${lowStock.length === 0
                                        ? "bg-green-50 text-green-600"
                                        : "bg-red-50 text-red-500"
                                    }
                                `}
                            >

                                <Package size={23} />

                            </div>

                        </div>


                        <div className="mt-6">

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    text-sm
                                "
                            >

                                <span className="text-gray-500">
                                    منتجات منخفضة
                                </span>

                                <span className="font-black">
                                    {lowStock.length}
                                </span>

                            </div>

                            <div
                                className="
                                    mt-3
                                    h-2
                                    bg-gray-100
                                    rounded-full
                                    overflow-hidden
                                "
                            >

                                <div
                                    className="
                                        h-full
                                        rounded-full
                                        bg-red-500
                                    "
                                    style={{
                                        width: `${Math.min(
                                            lowStock.length * 10,
                                            100
                                        )}%`
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= SALES ================= */}

                <SalesChart
                    data={stats.sales_chart || []}
                />


                {/* ================= ORDERS + STOCK ================= */}

                <div
                    className="
                        grid
                        grid-cols-1
                        xl:grid-cols-2
                        gap-6
                    "
                >

                    <RecentOrders
                        orders={orders}
                    />

                    <LowStock
                        products={lowStock}
                    />

                </div>


                {/* ================= FOOTER SUMMARY ================= */}

                <div
                    className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-3
                        px-2
                        pb-4
                        text-sm
                        text-gray-400
                    "
                >

                    <div className="flex items-center gap-2">

                        <ArrowUpRight size={16} />

                        <span>
                            لوحة التحكم محدثة بأحدث البيانات
                        </span>

                    </div>

                    <span>
                        Pharmacy Management System
                    </span>

                </div>

            </div>

        </div>

    );
}


/* =========================================================
   LOADING SKELETON
========================================================= */

function DashboardSkeleton() {

    return (

        <div
            dir="rtl"
            className="
                min-h-full
                bg-gray-50/60
                p-4
                md:p-6
                lg:p-8
            "
        >

            <div
                className="
                    max-w-[1600px]
                    mx-auto
                    space-y-7
                "
            >

                <div className="flex items-center gap-4">

                    <div
                        className="
                            w-12
                            h-12
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
                        grid-cols-1
                        sm:grid-cols-2
                        xl:grid-cols-4
                        gap-5
                    "
                >

                    {[1, 2, 3, 4].map((item) => (

                        <div
                            key={item}
                            className="
                                h-36
                                rounded-3xl
                                bg-white
                                border
                                border-gray-100
                                animate-pulse
                            "
                        />

                    ))}

                </div>


                <div
                    className="
                        h-52
                        rounded-3xl
                        bg-gray-200
                        animate-pulse
                    "
                />


                <div
                    className="
                        h-80
                        rounded-3xl
                        bg-white
                        border
                        border-gray-100
                        animate-pulse
                    "
                />


                <div
                    className="
                        grid
                        grid-cols-1
                        xl:grid-cols-2
                        gap-6
                    "
                >

                    <div
                        className="
                            h-96
                            rounded-3xl
                            bg-white
                            border
                            border-gray-100
                            animate-pulse
                        "
                    />

                    <div
                        className="
                            h-96
                            rounded-3xl
                            bg-white
                            border
                            border-gray-100
                            animate-pulse
                        "
                    />

                </div>

            </div>

        </div>

    );
}