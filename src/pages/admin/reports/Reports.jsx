import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
    TrendingUp,
    ShoppingCart,
    Package,
    DollarSign,
    AlertTriangle,
    RefreshCw,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    Boxes,
    Wallet,
    BarChart3,
    CalendarDays,
    ChevronLeft,
    Activity,
} from "lucide-react";

import {
    getDashboardReport,
    getDailyReports,
    getMonthlyReports,
} from "../../../services/reports/reportService";

const PURPLE = "#5B2A86";

export default function Reports() {
    const [dashboard, setDashboard] = useState(null);
    const [dailyReports, setDailyReports] = useState([]);
    const [monthlyReports, setMonthlyReports] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // =========================================================
    // LOAD REPORTS
    // =========================================================

    const loadReports = async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true);
            }

            const [
                dashboardData,
                dailyData,
                monthlyData,
            ] = await Promise.all([
                getDashboardReport(),
                getDailyReports(),
                getMonthlyReports(),
            ]);

            setDashboard(dashboardData);

            setDailyReports(
                dailyData?.results ||
                dailyData ||
                []
            );

            setMonthlyReports(
                monthlyData?.results ||
                monthlyData ||
                []
            );
        } catch (error) {
            console.error("REPORTS ERROR:", error);

            toast.error(
                error?.response?.data?.detail ||
                "فشل تحميل التقارير"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = async () => {
        try {
            setRefreshing(true);

            await loadReports(false);

            toast.success("تم تحديث التقارير بنجاح");
        } finally {
            setRefreshing(false);
        }
    };

    // =========================================================
    // DATA
    // =========================================================

    const kpis = dashboard?.daily_kpis || {};

    const topProducts =
        dashboard?.top_products || [];

    const lowStock =
        dashboard?.low_stock || [];

    // =========================================================
    // HELPERS
    // =========================================================

    const formatMoney = (value) => {
        return Number(value || 0).toLocaleString(
            "ar-EG",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }
        );
    };

    const formatNumber = (value) => {
        return Number(value || 0).toLocaleString(
            "ar-EG"
        );
    };

    const formatDate = (date) => {
        if (!date) return "-";

        try {
            return new Date(date).toLocaleDateString(
                "ar-EG",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }
            );
        } catch {
            return date;
        }
    };

    const profitMargin = useMemo(() => {
        const revenue = Number(kpis.revenue || 0);
        const profit = Number(kpis.profit || 0);

        if (!revenue) return 0;

        return ((profit / revenue) * 100).toFixed(1);
    }, [kpis]);

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div
                dir="rtl"
                className="min-h-[70vh] flex items-center justify-center"
            >
                <div className="text-center">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{
                            backgroundColor: "#F3E8FF",
                            color: PURPLE,
                        }}
                    >
                        <RefreshCw
                            size={26}
                            className="animate-spin"
                        />
                    </div>

                    <h3 className="font-bold text-gray-800">
                        جاري تحميل التقارير
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        برجاء الانتظار...
                    </p>
                </div>
            </div>
        );
    }

    // =========================================================
    // KPI CARD
    // =========================================================

    const KpiCard = ({
        title,
        value,
        suffix,
        icon: Icon,
        iconBg,
        iconColor,
        trend,
        subtitle,
    }) => (
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm text-gray-500 mb-2">
                        {title}
                    </p>

                    <div className="flex items-end gap-2">
                        <h3 className="text-2xl font-black text-gray-900 truncate">
                            {value}
                        </h3>

                        {suffix && (
                            <span className="text-xs font-semibold text-gray-500 mb-1">
                                {suffix}
                            </span>
                        )}
                    </div>

                    {trend !== undefined && (
                        <div className="flex items-center gap-1 mt-3">
                            {Number(trend) >= 0 ? (
                                <ArrowUpRight
                                    size={15}
                                    className="text-green-600"
                                />
                            ) : (
                                <ArrowDownRight
                                    size={15}
                                    className="text-red-600"
                                />
                            )}

                            <span
                                className={`text-xs font-bold ${Number(trend) >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >
                                {Math.abs(Number(trend))}%
                            </span>

                            <span className="text-xs text-gray-400">
                                مقارنة
                            </span>
                        </div>
                    )}

                    {subtitle && (
                        <p className="text-xs text-gray-400 mt-2">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor} group-hover:scale-105 transition-transform`}
                >
                    <Icon size={23} />
                </div>
            </div>
        </div>
    );

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-gray-50/70 p-4 md:p-6 lg:p-8 space-y-6"
        >
            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, ${PURPLE}, #7C3AED)`,
                            }}
                        >
                            <BarChart3 size={27} />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl md:text-3xl font-black text-gray-900">
                                    التقارير والتحليلات
                                </h1>

                                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                                    مباشر
                                </span>
                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                                نظرة شاملة على أداء الصيدلية والمبيعات والمخزون
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-600">
                            <CalendarDays size={17} />
                            <span>
                                {new Date().toLocaleDateString(
                                    "ar-EG",
                                    {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}
                            </span>
                        </div>

                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold shadow-sm hover:shadow-md disabled:opacity-60 transition-all"
                            style={{
                                backgroundColor: PURPLE,
                            }}
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
                                : "تحديث البيانات"}
                        </button>
                    </div>
                </div>
            </div>

            {/* ================================================= */}
            {/* KPI */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <KpiCard
                    title="مبيعات اليوم"
                    value={formatMoney(kpis.revenue)}
                    suffix="ج.م"
                    icon={DollarSign}
                    iconBg="bg-green-50"
                    iconColor="text-green-600"
                    subtitle="إجمالي إيرادات اليوم"
                />

                <KpiCard
                    title="تكلفة البضاعة"
                    value={formatMoney(kpis.cogs)}
                    suffix="ج.م"
                    icon={Package}
                    iconBg="bg-orange-50"
                    iconColor="text-orange-600"
                    subtitle="تكلفة المنتجات المباعة"
                />

                <KpiCard
                    title="صافي الربح"
                    value={formatMoney(kpis.profit)}
                    suffix="ج.م"
                    icon={TrendingUp}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                    subtitle={`هامش الربح ${profitMargin}%`}
                />

                <KpiCard
                    title="القطع المباعة"
                    value={formatNumber(kpis.items_sold)}
                    icon={ShoppingCart}
                    iconBg="bg-purple-50"
                    iconColor="text-purple-600"
                    subtitle="إجمالي المنتجات المباعة"
                />
            </div>

            {/* ================================================= */}
            {/* PROFIT OVERVIEW */}
            {/* ================================================= */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="font-black text-lg text-gray-900">
                            ملخص الأداء المالي
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            نظرة سريعة على إيرادات وربحية اليوم
                        </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50">
                        <Activity
                            size={20}
                            className="text-gray-600"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-green-50 border border-green-100 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green-600">
                                <Wallet size={20} />
                            </div>

                            <div>
                                <p className="text-xs text-green-700">
                                    الإيرادات
                                </p>

                                <p className="font-black text-xl text-gray-900 mt-1">
                                    {formatMoney(kpis.revenue)}
                                    <span className="text-xs mr-1">
                                        ج.م
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-600">
                                <Boxes size={20} />
                            </div>

                            <div>
                                <p className="text-xs text-orange-700">
                                    تكلفة البضاعة
                                </p>

                                <p className="font-black text-xl text-gray-900 mt-1">
                                    {formatMoney(kpis.cogs)}
                                    <span className="text-xs mr-1">
                                        ج.م
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl p-5 border bg-purple-50 border-purple-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-purple-600">
                                <TrendingUp size={20} />
                            </div>

                            <div>
                                <p className="text-xs text-purple-700">
                                    صافي الربح
                                </p>

                                <p className="font-black text-xl text-gray-900 mt-1">
                                    {formatMoney(kpis.profit)}
                                    <span className="text-xs mr-1">
                                        ج.م
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-gray-600">
                            هامش الربح
                        </span>

                        <span
                            className="font-black"
                            style={{
                                color: PURPLE,
                            }}
                        >
                            {profitMargin}%
                        </span>
                    </div>

                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${Math.min(
                                    Math.max(
                                        Number(profitMargin),
                                        0
                                    ),
                                    100
                                )}%`,
                                backgroundColor: PURPLE,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ================================================= */}
            {/* TOP PRODUCTS / LOW STOCK */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* TOP PRODUCTS */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                <TrendingUp size={20} />
                            </div>

                            <div>
                                <h2 className="font-black text-gray-900">
                                    الأكثر مبيعًا
                                </h2>

                                <p className="text-xs text-gray-500 mt-1">
                                    أفضل المنتجات أداءً
                                </p>
                            </div>
                        </div>

                        <span className="text-xs font-bold text-gray-400">
                            TOP 5
                        </span>
                    </div>

                    {topProducts.length === 0 ? (
                        <EmptyState message="لا توجد بيانات مبيعات" />
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {topProducts
                                .slice(0, 5)
                                .map((product, index) => (
                                    <div
                                        key={
                                            product.product_id ||
                                            index
                                        }
                                        className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${index === 0
                                                ? "bg-yellow-100 text-yellow-700"
                                                : index === 1
                                                    ? "bg-gray-100 text-gray-700"
                                                    : index === 2
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-purple-50 text-purple-700"
                                                }`}
                                        >
                                            {index + 1}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-800 truncate">
                                                {product.product ||
                                                    "منتج"}
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatNumber(
                                                    product.quantity
                                                )}{" "}
                                                قطعة مباعة
                                            </p>
                                        </div>

                                        <div className="text-left">
                                            <p className="font-black text-gray-900">
                                                {formatMoney(
                                                    product.revenue
                                                )}
                                            </p>

                                            <p className="text-[11px] text-gray-400">
                                                ج.م
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* LOW STOCK */}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                                <AlertTriangle size={20} />
                            </div>

                            <div>
                                <h2 className="font-black text-gray-900">
                                    تنبيه المخزون
                                </h2>

                                <p className="text-xs text-gray-500 mt-1">
                                    المنتجات التي تحتاج لإعادة طلب
                                </p>
                            </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold">
                            {formatNumber(lowStock.length)}
                        </span>
                    </div>

                    {lowStock.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="w-12 h-12 mx-auto rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-3">
                                <Package size={22} />
                            </div>

                            <p className="font-bold text-gray-700">
                                المخزون بحالة جيدة
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                لا توجد منتجات منخفضة المخزون
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {lowStock
                                .slice(0, 5)
                                .map((item, index) => (
                                    <div
                                        key={
                                            item.product_id ||
                                            index
                                        }
                                        className="flex items-center gap-4 px-5 py-4 hover:bg-red-50/40 transition"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                                            <Package size={18} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-800 truncate">
                                                {item.product ||
                                                    "منتج"}
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">
                                                الكمية المتاحة
                                            </p>
                                        </div>

                                        <div className="text-center">
                                            <p className="font-black text-red-600">
                                                {formatNumber(
                                                    item.available
                                                )}
                                            </p>

                                            <span className="text-[11px] text-gray-400">
                                                قطعة
                                            </span>
                                        </div>

                                        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold">
                                            منخفض
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ================================================= */}
            {/* DAILY REPORTS */}
            {/* ================================================= */}

            <ReportTable
                title="التقارير اليومية"
                subtitle="ملخص الأداء اليومي"
                icon={CalendarDays}
                iconClass="text-blue-600 bg-blue-50"
                headers={[
                    "التاريخ",
                    "المبيعات",
                    "المشتريات",
                    "المصروفات",
                    "القطع",
                    "صافي الربح",
                ]}
                empty="لا توجد تقارير يومية"
                data={dailyReports}
                renderRow={(report, index) => (
                    <tr
                        key={report.id || index}
                        className="hover:bg-gray-50 transition border-t border-gray-100"
                    >
                        <td className="px-5 py-4 font-bold text-gray-800">
                            {formatDate(report.date)}
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-green-600">
                            {formatMoney(
                                report.total_sales
                            )}{" "}
                            <small>ج.م</small>
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-orange-600">
                            {formatMoney(
                                report.total_purchases
                            )}{" "}
                            <small>ج.م</small>
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-red-500">
                            {formatMoney(
                                report.total_expenses
                            )}{" "}
                            <small>ج.م</small>
                        </td>

                        <td className="px-5 py-4 text-center font-bold">
                            {formatNumber(
                                report.items_sold
                            )}
                        </td>

                        <td className="px-5 py-4 text-center">
                            <span className="inline-flex px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 font-black">
                                {formatMoney(
                                    report.net_profit
                                )}{" "}
                                <small className="mr-1">
                                    ج.م
                                </small>
                            </span>
                        </td>
                    </tr>
                )}
            />

            {/* ================================================= */}
            {/* MONTHLY REPORTS */}
            {/* ================================================= */}

            <ReportTable
                title="التقارير الشهرية"
                subtitle="ملخص الأداء المالي الشهري"
                icon={BarChart3}
                iconClass="text-purple-600 bg-purple-50"
                headers={[
                    "الشهر",
                    "السنة",
                    "المبيعات",
                    "المشتريات",
                    "المصروفات",
                    "صافي الربح",
                ]}
                empty="لا توجد تقارير شهرية"
                data={monthlyReports}
                renderRow={(report, index) => (
                    <tr
                        key={report.id || index}
                        className="hover:bg-gray-50 transition border-t border-gray-100"
                    >
                        <td className="px-5 py-4 font-bold text-gray-800">
                            {report.month}
                        </td>

                        <td className="px-5 py-4 text-center text-gray-500">
                            {report.year}
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-green-600">
                            {formatMoney(
                                report.total_sales
                            )}{" "}
                            <small>ج.م</small>
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-orange-600">
                            {formatMoney(
                                report.total_purchases
                            )}{" "}
                            <small>ج.م</small>
                        </td>

                        <td className="px-5 py-4 text-center font-semibold text-red-500">
                            {formatMoney(
                                report.total_expenses
                            )}{" "}
                            <small>ج.م</small>
                        </td>

                        <td className="px-5 py-4 text-center">
                            <span className="inline-flex px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 font-black">
                                {formatMoney(
                                    report.net_profit
                                )}{" "}
                                <small className="mr-1">
                                    ج.م
                                </small>
                            </span>
                        </td>
                    </tr>
                )}
            />

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-2 pb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <FileText size={14} />
                    آخر تحديث:{" "}
                    {new Date().toLocaleTimeString(
                        "ar-EG",
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                        }
                    )}
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span>نظام إدارة الصيدلية</span>
                    <ChevronLeft size={13} />
                    <span>التقارير</span>
                </div>
            </div>
        </div>
    );
}

// =============================================================
// REPORT TABLE
// =============================================================

function ReportTable({
    title,
    subtitle,
    icon: Icon,
    iconClass,
    headers,
    data,
    empty,
    renderRow,
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`}
                    >
                        <Icon size={21} />
                    </div>

                    <div>
                        <h2 className="font-black text-lg text-gray-900">
                            {title}
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            {subtitle}
                        </p>
                    </div>
                </div>

                <span className="text-xs text-gray-400">
                    {data.length} سجل
                </span>
            </div>

            {data.length === 0 ? (
                <EmptyState message={empty} />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px]">
                        <thead>
                            <tr className="bg-gray-50/80">
                                {headers.map(
                                    (header, index) => (
                                        <th
                                            key={index}
                                            className={`px-5 py-3.5 text-xs font-bold text-gray-500 ${index === 0
                                                ? "text-right"
                                                : "text-center"
                                                }`}
                                        >
                                            {header}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {data.map(renderRow)}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// =============================================================
// EMPTY STATE
// =============================================================

function EmptyState({ message }) {
    return (
        <div className="py-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <FileText size={23} />
            </div>

            <p className="font-bold text-gray-600">
                {message}
            </p>

            <p className="text-xs text-gray-400 mt-1">
                لا توجد بيانات لعرضها حاليًا
            </p>
        </div>
    );
}