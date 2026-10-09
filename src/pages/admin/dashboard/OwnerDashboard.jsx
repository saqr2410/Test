import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    RefreshCw,
    TrendingUp,
    LayoutDashboard,
    ClipboardList,
    ArrowLeft,
} from "lucide-react";

import {
    getDashboardStats,
    getRecentOrders,
    getLowStockProducts,
} from "../../../services/dashboard/dashboardService";

import StatCard from "../../../components/admin/dashboard/StatCard";
import RecentOrders from "../../../components/admin/dashboard/RecentOrders";
import LowStock from "../../../components/admin/dashboard/LowStock";
import SalesChart from "../../../components/admin/dashboard/SalesChart";


export default function OwnerDashboard() {

    const [stats, setStats] = useState({
        products: 0,
        customers: 0,
        orders_count: 0,
        total_sales: 0,
        profit: 0,
        sales_chart: [],
    });

    const [orders, setOrders] = useState([]);

    const [lowStock, setLowStock] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState(false);

    const [lastUpdated, setLastUpdated] =
        useState(null);


    // ==========================================
    // LOAD DASHBOARD
    // ==========================================

    const loadDashboard = useCallback(
        async (isRefresh = false) => {

            try {

                if (isRefresh) {

                    setRefreshing(true);

                } else {

                    setLoading(true);

                }

                setError(false);


                const [
                    statsData,
                    ordersData,
                    stockData,
                ] = await Promise.all([

                    getDashboardStats(),

                    getRecentOrders(),

                    getLowStockProducts(),

                ]);


                // ==================================
                // STATS
                // ==================================

                setStats({

                    products:
                        statsData?.products ?? 0,

                    customers:
                        statsData?.customers ?? 0,

                    orders_count:
                        statsData?.orders_count ?? 0,

                    total_sales:
                        statsData?.total_sales ?? 0,

                    profit:
                        statsData?.profit ?? 0,

                    sales_chart:
                        Array.isArray(
                            statsData?.sales_chart
                        )
                            ? statsData.sales_chart
                            : [],

                });


                // ==================================
                // ORDERS
                // ==================================

                const allOrders =
                    Array.isArray(ordersData)
                        ? ordersData
                        : ordersData?.results || [];


                /*
                 * Active orders only.
                 *
                 * COMPLETED
                 * CANCELLED
                 *
                 * are excluded.
                 */

                const activeOrders =
                    allOrders.filter(
                        (order) =>
                            ![
                                "COMPLETED",
                                "CANCELLED",
                            ].includes(
                                String(
                                    order?.status
                                ).toUpperCase()
                            )
                    );


                setOrders(
                    activeOrders
                );


                // ==================================
                // LOW STOCK
                // ==================================

                setLowStock(

                    Array.isArray(stockData)
                        ? stockData
                        : stockData?.results || []

                );


                setLastUpdated(
                    new Date()
                );


            } catch (error) {

                console.error(
                    "Dashboard Error:",
                    error
                );

                setError(true);

            } finally {

                setLoading(false);

                setRefreshing(false);

            }

        },
        []
    );


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        loadDashboard();

    }, [loadDashboard]);


    // ==========================================
    // ACTIVE ORDERS COUNT
    // ==========================================

    const activeOrdersCount =
        useMemo(
            () => orders.length,
            [orders]
        );


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div
                dir="rtl"
                className="
                    min-h-[70vh]
                    flex
                    items-center
                    justify-center
                    bg-gray-50/50
                "
            >

                <div
                    className="
                        text-center
                        bg-white
                        rounded-3xl
                        p-10
                        shadow-sm
                        border
                        border-gray-100
                    "
                >

                    <div
                        className="
                            w-14
                            h-14
                            border-4
                            border-purple-100
                            border-t-[#5B2A86]
                            rounded-full
                            animate-spin
                            mx-auto
                        "
                    />

                    <p
                        className="
                            mt-5
                            text-gray-600
                            font-bold
                        "
                    >
                        جاري تحميل لوحة التحكم...
                    </p>

                    <p
                        className="
                            text-sm
                            text-gray-400
                            mt-2
                        "
                    >
                        يتم تجهيز بيانات الصيدلية
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
                className="
                    min-h-[60vh]
                    flex
                    items-center
                    justify-center
                    p-6
                "
            >

                <div
                    className="
                        bg-white
                        rounded-3xl
                        shadow-sm
                        border
                        border-red-100
                        p-10
                        text-center
                        max-w-md
                        w-full
                    "
                >

                    <div
                        className="
                            w-16
                            h-16
                            rounded-2xl
                            bg-red-50
                            text-red-500
                            flex
                            items-center
                            justify-center
                            mx-auto
                            text-2xl
                            font-black
                        "
                    >
                        !
                    </div>


                    <h2
                        className="
                            text-xl
                            font-black
                            text-gray-800
                            mt-5
                        "
                    >
                        تعذر تحميل لوحة التحكم
                    </h2>


                    <p
                        className="
                            text-gray-500
                            mt-2
                        "
                    >
                        حدث خطأ أثناء جلب بيانات الصيدلية.
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            loadDashboard()
                        }
                        className="
                            mt-6
                            px-6
                            py-3
                            rounded-xl
                            bg-[#5B2A86]
                            hover:bg-[#4a216d]
                            text-white
                            font-bold
                            transition
                        "
                    >
                        إعادة المحاولة
                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // LAST UPDATED
    // ==========================================

    const formattedLastUpdated =
        lastUpdated
            ? lastUpdated.toLocaleTimeString(
                "ar-EG",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                }
            )
            : "-";


    // ==========================================
    // DASHBOARD
    // ==========================================

    return (

        <div
            dir="rtl"
            className="
                min-h-screen
                space-y-7
                pb-8
            "
        >

            {/* =================================
                HEADER
            ================================= */}

            <div
                className="
                    bg-white
                    rounded-3xl
                    border
                    border-gray-100
                    shadow-sm
                    p-6
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

                    {/* TITLE */}

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
                                bg-purple-50
                                text-[#5B2A86]
                                flex
                                items-center
                                justify-center
                                shrink-0
                            "
                        >

                            <LayoutDashboard
                                size={27}
                            />

                        </div>


                        <div>

                            <h1
                                className="
                                    text-2xl
                                    sm:text-3xl
                                    font-black
                                    text-gray-800
                                "
                            >
                                لوحة تحكم المالك
                            </h1>


                            <p
                                className="
                                    text-gray-500
                                    mt-1
                                "
                            >
                                نظرة شاملة على أداء الصيدلية
                            </p>

                        </div>

                    </div>


                    {/* RIGHT SIDE */}

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            flex-wrap
                        "
                    >

                        <div
                            className="
                                px-4
                                py-2.5
                                rounded-xl
                                bg-gray-50
                                border
                                border-gray-100
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-gray-400
                                "
                            >
                                آخر تحديث
                            </p>


                            <p
                                className="
                                    text-sm
                                    font-bold
                                    text-gray-700
                                    mt-0.5
                                "
                            >
                                {formattedLastUpdated}
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                loadDashboard(true)
                            }
                            disabled={refreshing}
                            className="
                                flex
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
                                disabled:opacity-60
                                disabled:cursor-not-allowed
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

                            {refreshing
                                ? "جاري التحديث..."
                                : "تحديث البيانات"
                            }

                        </button>

                    </div>

                </div>

            </div>


            {/* =================================
                QUICK OVERVIEW
            ================================= */}

            <div>

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        mb-4
                    "
                >

                    <TrendingUp
                        size={20}
                        className="text-[#5B2A86]"
                    />

                    <h2
                        className="
                            text-lg
                            font-black
                            text-gray-800
                        "
                    >
                        ملخص الأداء
                    </h2>

                </div>


                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        xl:grid-cols-5
                        gap-5
                    "
                >

                    <StatCard
                        title="إجمالي المبيعات"
                        value={stats.total_sales}
                        type="sales"
                        suffix="جنيه"
                    />


                    <StatCard
                        title="الأرباح"
                        value={stats.profit}
                        type="profit"
                        suffix="جنيه"
                    />


                    <StatCard
                        title="إجمالي الطلبات"
                        value={stats.orders_count}
                        type="orders"
                    />


                    <StatCard
                        title="العملاء"
                        value={stats.customers}
                        type="customers"
                    />


                    <StatCard
                        title="المنتجات"
                        value={stats.products}
                        type="products"
                    />

                </div>

            </div>


            {/* =================================
                SALES CHART
            ================================= */}

            <div
                className="
                    bg-white
                    rounded-3xl
                    border
                    border-gray-100
                    shadow-sm
                    overflow-hidden
                "
            >

                <SalesChart
                    data={stats.sales_chart}
                />

            </div>


            {/* =================================
                ACTIVE ORDERS HEADER
            ================================= */}

            <div
                className="
                    bg-white
                    rounded-3xl
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
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-4
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
                                w-12
                                h-12
                                rounded-2xl
                                bg-purple-50
                                text-[#5B2A86]
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <ClipboardList
                                size={23}
                            />

                        </div>


                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <h2
                                    className="
                                        text-lg
                                        font-black
                                        text-gray-800
                                    "
                                >
                                    الطلبات النشطة
                                </h2>


                                <span
                                    className="
                                        min-w-7
                                        h-7
                                        px-2
                                        rounded-full
                                        bg-purple-100
                                        text-[#5B2A86]
                                        flex
                                        items-center
                                        justify-center
                                        text-sm
                                        font-black
                                    "
                                >
                                    {activeOrdersCount}
                                </span>

                            </div>


                            <p
                                className="
                                    text-sm
                                    text-gray-400
                                    mt-1
                                "
                            >
                                الطلبات التي لم تكتمل أو تُلغَ بعد
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            window.location.href =
                            "/admin/orders"
                        }
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            px-4
                            py-2.5
                            rounded-xl
                            border
                            border-gray-200
                            text-gray-700
                            font-bold
                            hover:border-[#5B2A86]
                            hover:text-[#5B2A86]
                            transition
                        "
                    >

                        عرض كل الطلبات

                        <ArrowLeft
                            size={17}
                        />

                    </button>

                </div>

            </div>


            {/* =================================
                ORDERS + LOW STOCK
            ================================= */}

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
                        bg-white
                        rounded-3xl
                        border
                        border-gray-100
                        shadow-sm
                        overflow-hidden
                    "
                >

                    <RecentOrders
                        orders={orders}
                    />

                </div>


                <div
                    className="
                        bg-white
                        rounded-3xl
                        border
                        border-gray-100
                        shadow-sm
                        overflow-hidden
                    "
                >

                    <LowStock
                        products={lowStock}
                    />

                </div>

            </div>

        </div>

    );

}