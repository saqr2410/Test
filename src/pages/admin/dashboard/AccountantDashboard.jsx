import {
    useEffect,
    useState
} from "react";

import {
    getDashboardStats,
    getRecentOrders
} from "../../../services/dashboard/dashboardService";

import RecentOrders from "../../../components/admin/dashboard/RecentOrders";

import {
    TrendingUp,
    TrendingDown,
    Wallet,
    Receipt,
    ShoppingBag,
    RefreshCw,
    ArrowUpLeft,
    FileText,
    Calculator,
    Landmark
} from "lucide-react";


function FinancialCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconClass
}) {
    return (
        <div
            className="
                group
                relative
                overflow-hidden
                bg-white
                rounded-[28px]
                border
                border-gray-100
                p-6
                shadow-[0_4px_20px_rgba(0,0,0,0.03)]
                hover:shadow-[0_14px_35px_rgba(0,0,0,0.07)]
                hover:-translate-y-1
                transition-all
                duration-300
            "
        >

            <div
                className="
                    absolute
                    -top-12
                    -left-12
                    w-32
                    h-32
                    rounded-full
                    bg-gray-50
                    opacity-60
                    group-hover:scale-150
                    transition-transform
                    duration-500
                "
            />

            <div
                className="
                    relative
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
                            font-bold
                            text-gray-400
                        "
                    >
                        {title}
                    </p>

                    <h2
                        className="
                            mt-3
                            text-2xl
                            md:text-3xl
                            font-black
                            tracking-tight
                            text-gray-900
                        "
                    >
                        {value ?? 0}
                    </h2>

                    {subtitle && (
                        <p
                            className="
                                mt-2
                                text-xs
                                font-medium
                                text-gray-400
                            "
                        >
                            {subtitle}
                        </p>
                    )}

                </div>

                <div
                    className={`
                        w-14
                        h-14
                        shrink-0
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        ${iconClass}
                        group-hover:scale-110
                        transition-transform
                        duration-300
                    `}
                >
                    <Icon size={25} />
                </div>

            </div>

        </div>
    );
}


function QuickAction({
    icon: Icon,
    title,
    description,
    iconClass
}) {
    return (
        <button
            type="button"
            className="
                group
                w-full
                bg-white
                border
                border-gray-100
                rounded-[26px]
                p-5
                text-right
                shadow-[0_4px_20px_rgba(0,0,0,0.03)]
                hover:-translate-y-1
                hover:shadow-[0_12px_30px_rgba(0,0,0,0.07)]
                transition-all
                duration-300
            "
        >

            <div className="flex items-center gap-4">

                <div
                    className={`
                        w-12
                        h-12
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        shrink-0
                        ${iconClass}
                    `}
                >
                    <Icon size={22} />
                </div>

                <div className="flex-1">

                    <h3
                        className="
                            font-black
                            text-gray-900
                        "
                    >
                        {title}
                    </h3>

                    <p
                        className="
                            text-xs
                            text-gray-400
                            mt-1
                        "
                    >
                        {description}
                    </p>

                </div>

                <ArrowUpLeft
                    size={19}
                    className="
                        text-gray-300
                        group-hover:text-[#5B2A86]
                        group-hover:-translate-x-1
                        transition-all
                    "
                />

            </div>

        </button>
    );
}


export default function AccountantDashboard() {

    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);


    const load = async (refresh = false) => {

        try {

            if (refresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const [
                statsData,
                ordersData
            ] = await Promise.all([
                getDashboardStats(),
                getRecentOrders()
            ]);

            setStats(statsData || {});
            setOrders(ordersData || []);

        } catch (error) {

            console.error(
                "Accountant Dashboard Error:",
                error
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    useEffect(() => {
        load();
    }, []);


    if (loading) {

        return (
            <div
                className="
                    min-h-[600px]
                    flex
                    items-center
                    justify-center
                    bg-gray-50/60
                "
            >

                <div className="text-center">

                    <div
                        className="
                            w-12
                            h-12
                            rounded-full
                            border-4
                            border-purple-100
                            border-t-[#5B2A86]
                            animate-spin
                            mx-auto
                        "
                    />

                    <p
                        className="
                            mt-4
                            text-sm
                            font-bold
                            text-gray-400
                        "
                    >
                        جاري تحميل البيانات المالية...
                    </p>

                </div>

            </div>
        );

    }


    return (

        <div
            dir="rtl"
            className="
                min-h-screen
                bg-[#f8f9fb]
                pb-10
            "
        >

            {/* ================= HEADER ================= */}

            <div
                className="
                    relative
                    overflow-hidden
                    bg-[#5B2A86]
                    rounded-[30px]
                    p-7
                    md:p-9
                    mb-7
                    shadow-[0_15px_40px_rgba(91,42,134,0.15)]
                "
            >

                <div
                    className="
                        absolute
                        -top-24
                        -left-24
                        w-72
                        h-72
                        rounded-full
                        bg-white/5
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-28
                        right-20
                        w-80
                        h-80
                        rounded-full
                        bg-white/5
                    "
                />

                <div
                    className="
                        relative
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-6
                    "
                >

                    <div>

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    w-12
                                    h-12
                                    rounded-2xl
                                    bg-white/10
                                    border
                                    border-white/10
                                    flex
                                    items-center
                                    justify-center
                                    text-white
                                "
                            >
                                <Calculator size={24} />
                            </div>

                            <div>

                                <p
                                    className="
                                        text-purple-200
                                        text-xs
                                        font-bold
                                        mb-1
                                    "
                                >
                                    الإدارة المالية
                                </p>

                                <h1
                                    className="
                                        text-2xl
                                        md:text-3xl
                                        font-black
                                        text-white
                                    "
                                >
                                    لوحة تحكم المحاسب
                                </h1>

                            </div>

                        </div>

                        <p
                            className="
                                text-purple-100/80
                                text-sm
                                mt-4
                                max-w-xl
                            "
                        >
                            متابعة الإيرادات والمصروفات والمشتريات
                            والتدفقات المالية من مكان واحد.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() => load(true)}
                        disabled={refreshing}
                        className="
                            relative
                            flex
                            items-center
                            justify-center
                            gap-2
                            px-5
                            py-3
                            rounded-2xl
                            bg-white
                            text-[#5B2A86]
                            font-black
                            text-sm
                            hover:bg-gray-50
                            disabled:opacity-70
                            transition
                            shadow-lg
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

                        تحديث البيانات

                    </button>

                </div>

            </div>


            {/* ================= FINANCIAL STATS ================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-5
                    mb-7
                "
            >

                <FinancialCard
                    title="مبيعات اليوم"
                    value={`${stats.today_sales ?? 0} جنيه`}
                    subtitle="إجمالي الإيرادات اليوم"
                    icon={TrendingUp}
                    iconClass="
                        bg-emerald-50
                        text-emerald-600
                    "
                />


                <FinancialCard
                    title="المصروفات"
                    value={`${stats.expenses ?? 0} جنيه`}
                    subtitle="إجمالي المصروفات"
                    icon={TrendingDown}
                    iconClass="
                        bg-red-50
                        text-red-600
                    "
                />


                <FinancialCard
                    title="صافي الربح"
                    value={`${stats.net_profit ?? 0} جنيه`}
                    subtitle="الإيرادات بعد المصروفات"
                    icon={Wallet}
                    iconClass="
                        bg-purple-50
                        text-[#5B2A86]
                    "
                />


                <FinancialCard
                    title="المشتريات"
                    value={`${stats.purchases ?? 0} جنيه`}
                    subtitle="إجمالي المشتريات"
                    icon={ShoppingBag}
                    iconClass="
                        bg-blue-50
                        text-blue-600
                    "
                />

            </div>


            {/* ================= QUICK ACTIONS ================= */}

            <div className="mb-7">

                <div className="mb-5">

                    <h2
                        className="
                            text-xl
                            font-black
                            text-gray-900
                        "
                    >
                        العمليات المالية
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-400
                            mt-1
                        "
                    >
                        الوصول السريع للعمليات المحاسبية
                    </p>

                </div>


                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-5
                    "
                >

                    <QuickAction
                        icon={Receipt}
                        title="المصروفات"
                        description="تسجيل ومراجعة المصروفات"
                        iconClass="
                            bg-red-50
                            text-red-600
                        "
                    />


                    <QuickAction
                        icon={ShoppingBag}
                        title="المشتريات"
                        description="متابعة فواتير المشتريات"
                        iconClass="
                            bg-blue-50
                            text-blue-600
                        "
                    />


                    <QuickAction
                        icon={FileText}
                        title="التقارير المالية"
                        description="عرض التقارير والتحليلات"
                        iconClass="
                            bg-purple-50
                            text-[#5B2A86]
                        "
                    />

                </div>

            </div>


            {/* ================= FINANCIAL OVERVIEW ================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    xl:grid-cols-3
                    gap-5
                    mb-7
                "
            >

                <div
                    className="
                        xl:col-span-2
                        bg-white
                        rounded-[30px]
                        border
                        border-gray-100
                        p-6
                        shadow-[0_4px_20px_rgba(0,0,0,0.03)]
                    "
                >

                    <div className="flex items-center gap-3 mb-6">

                        <div
                            className="
                                w-11
                                h-11
                                rounded-2xl
                                bg-purple-50
                                text-[#5B2A86]
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <Landmark size={21} />
                        </div>

                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-black
                                    text-gray-900
                                "
                            >
                                الملخص المالي
                            </h2>

                            <p
                                className="
                                    text-xs
                                    text-gray-400
                                    mt-1
                                "
                            >
                                نظرة سريعة على الوضع المالي
                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-4
                        "
                    >

                        <div
                            className="
                                rounded-2xl
                                bg-gray-50
                                p-5
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-gray-400
                                    font-bold
                                "
                            >
                                إجمالي المبيعات
                            </p>

                            <p
                                className="
                                    text-xl
                                    font-black
                                    text-gray-900
                                    mt-2
                                "
                            >
                                {stats.total_sales ?? 0} جنيه
                            </p>

                        </div>


                        <div
                            className="
                                rounded-2xl
                                bg-gray-50
                                p-5
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-gray-400
                                    font-bold
                                "
                            >
                                عدد العمليات
                            </p>

                            <p
                                className="
                                    text-xl
                                    font-black
                                    text-gray-900
                                    mt-2
                                "
                            >
                                {stats.orders ?? 0}
                            </p>

                        </div>


                        <div
                            className="
                                rounded-2xl
                                bg-gray-50
                                p-5
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-gray-400
                                    font-bold
                                "
                            >
                                الخزينة
                            </p>

                            <p
                                className="
                                    text-xl
                                    font-black
                                    text-gray-900
                                    mt-2
                                "
                            >
                                {stats.cash_balance ?? 0} جنيه
                            </p>

                        </div>


                        <div
                            className="
                                rounded-2xl
                                bg-gray-50
                                p-5
                            "
                        >

                            <p
                                className="
                                    text-xs
                                    text-gray-400
                                    font-bold
                                "
                            >
                                صافي التدفق
                            </p>

                            <p
                                className="
                                    text-xl
                                    font-black
                                    text-gray-900
                                    mt-2
                                "
                            >
                                {stats.net_cash_flow ?? 0} جنيه
                            </p>

                        </div>

                    </div>

                </div>


                <div
                    className="
                        bg-white
                        rounded-[30px]
                        border
                        border-gray-100
                        p-6
                        shadow-[0_4px_20px_rgba(0,0,0,0.03)]
                    "
                >

                    <div className="flex items-center gap-3 mb-6">

                        <div
                            className="
                                w-11
                                h-11
                                rounded-2xl
                                bg-emerald-50
                                text-emerald-600
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <Wallet size={21} />
                        </div>

                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-black
                                    text-gray-900
                                "
                            >
                                حالة الخزينة
                            </h2>

                            <p
                                className="
                                    text-xs
                                    text-gray-400
                                    mt-1
                                "
                            >
                                الوضع الحالي للخزينة
                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            rounded-2xl
                            bg-emerald-50
                            p-5
                        "
                    >

                        <p
                            className="
                                text-xs
                                text-emerald-600
                                font-bold
                            "
                        >
                            الرصيد الحالي
                        </p>

                        <p
                            className="
                                text-3xl
                                font-black
                                text-emerald-700
                                mt-2
                            "
                        >
                            {stats.cash_balance ?? 0}
                        </p>

                        <p
                            className="
                                text-xs
                                text-emerald-600
                                mt-1
                            "
                        >
                            جنيه مصري
                        </p>

                    </div>

                </div>

            </div>


            {/* ================= RECENT TRANSACTIONS ================= */}

            <div
                className="
                    bg-white
                    rounded-[30px]
                    border
                    border-gray-100
                    p-5
                    md:p-6
                    shadow-[0_4px_20px_rgba(0,0,0,0.03)]
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
                            rounded-2xl
                            bg-blue-50
                            text-blue-600
                            flex
                            items-center
                            justify-center
                        "
                    >
                        <Receipt size={21} />
                    </div>

                    <div>

                        <h2
                            className="
                                text-lg
                                font-black
                                text-gray-900
                            "
                        >
                            أحدث العمليات
                        </h2>

                        <p
                            className="
                                text-xs
                                text-gray-400
                                mt-1
                            "
                        >
                            آخر العمليات المسجلة في النظام
                        </p>

                    </div>

                </div>


                <RecentOrders
                    orders={orders}
                />

            </div>

        </div>
    );
}