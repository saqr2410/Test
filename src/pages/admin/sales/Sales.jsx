import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Eye,
    RefreshCw,
    Receipt,
    Trash2,
    Search,
    Download,
    TrendingUp,
    ShoppingCart,
    BadgeDollarSign,
    Percent,
    X,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    RotateCcw,
    XCircle,
    ChevronDown
} from "lucide-react";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
    getSales,
    deleteSale
} from "../../../services/sales/salesService";

import PageHeader from "../../../components/ui/layout/PageHeader";
import Loading from "../../../components/ui/feedback/Loading";


export default function Sales() {

    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [sales, setSales] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");

    const [dateFilter, setDateFilter] = useState("all");

    const [sortBy, setSortBy] = useState("newest");

    const [selectedSales, setSelectedSales] = useState([]);

    const [deleteTarget, setDeleteTarget] = useState(null);

    const [deleting, setDeleting] = useState(false);

    const [showFilters, setShowFilters] = useState(false);


    // =====================================================
    // LOAD SALES
    // =====================================================

    const loadSales = async (isRefresh = false) => {

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await getSales();

            const list = Array.isArray(data)
                ? data
                : data?.results || [];

            setSales(list);

            setSelectedSales([]);

        } catch (error) {

            console.error(
                "SALES LIST ERROR:",
                error
            );

            toast.error(
                "فشل تحميل بيانات المبيعات"
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    useEffect(() => {

        loadSales();

    }, []);


    // =====================================================
    // HELPERS
    // =====================================================

    const money = (value) => {

        return Number(value || 0).toLocaleString(
            "ar-EG",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString(
            "ar-EG",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    };


    const getStatus = (status) => {

        switch (status) {

            case "COMPLETED":

                return {
                    text: "مكتملة",
                    icon: CheckCircle2,
                    className:
                        "bg-emerald-50 text-emerald-700 border-emerald-200"
                };


            case "PENDING":

                return {
                    text: "معلقة",
                    icon: Clock3,
                    className:
                        "bg-amber-50 text-amber-700 border-amber-200"
                };


            case "CANCELLED":

                return {
                    text: "ملغاة",
                    icon: XCircle,
                    className:
                        "bg-red-50 text-red-700 border-red-200"
                };


            case "RETURNED":

                return {
                    text: "مرتجعة",
                    icon: RotateCcw,
                    className:
                        "bg-purple-50 text-purple-700 border-purple-200"
                };


            default:

                return {
                    text: status || "غير محددة",
                    icon: AlertTriangle,
                    className:
                        "bg-gray-50 text-gray-600 border-gray-200"
                };

        }

    };


    // =====================================================
    // FILTER
    // =====================================================

    const filteredSales = useMemo(() => {

        let result = [...sales];

        const query = search
            .trim()
            .toLowerCase();


        // SEARCH

        if (query) {

            result = result.filter((sale) => {

                const id =
                    sale.id
                        ?.toString()
                        .toLowerCase() || "";

                const customer =
                    sale.customer_name
                        ?.toLowerCase() || "";

                const cashier =
                    typeof sale.cashier === "string"
                        ? sale.cashier.toLowerCase()
                        : sale.cashier?.username
                            ?.toLowerCase() || "";

                return (
                    id.includes(query) ||
                    customer.includes(query) ||
                    cashier.includes(query)
                );

            });

        }


        // STATUS

        if (statusFilter !== "all") {

            result = result.filter(
                (sale) =>
                    sale.status === statusFilter
            );

        }


        // DATE

        if (dateFilter !== "all") {

            const now = new Date();

            result = result.filter((sale) => {

                if (!sale.created_at) {
                    return false;
                }

                const date =
                    new Date(sale.created_at);

                if (dateFilter === "today") {

                    return (
                        date.toDateString() ===
                        now.toDateString()
                    );

                }

                if (dateFilter === "week") {

                    const weekAgo =
                        new Date();

                    weekAgo.setDate(
                        now.getDate() - 7
                    );

                    return date >= weekAgo;

                }

                if (dateFilter === "month") {

                    return (
                        date.getMonth() ===
                        now.getMonth() &&
                        date.getFullYear() ===
                        now.getFullYear()
                    );

                }

                return true;

            });

        }


        // SORT

        result.sort((a, b) => {

            if (sortBy === "newest") {

                return (
                    new Date(b.created_at || 0) -
                    new Date(a.created_at || 0)
                );

            }

            if (sortBy === "oldest") {

                return (
                    new Date(a.created_at || 0) -
                    new Date(b.created_at || 0)
                );

            }

            if (sortBy === "highest") {

                return (
                    Number(b.final_amount || 0) -
                    Number(a.final_amount || 0)
                );

            }

            if (sortBy === "lowest") {

                return (
                    Number(a.final_amount || 0) -
                    Number(b.final_amount || 0)
                );

            }

            return 0;

        });


        return result;

    }, [
        sales,
        search,
        statusFilter,
        dateFilter,
        sortBy
    ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const stats = useMemo(() => {

        const completed =
            filteredSales.filter(
                sale =>
                    sale.status === "COMPLETED"
            );

        const revenue =
            completed.reduce(
                (sum, sale) =>
                    sum +
                    Number(
                        sale.final_amount || 0
                    ),
                0
            );

        const gross =
            completed.reduce(
                (sum, sale) =>
                    sum +
                    Number(
                        sale.total_amount || 0
                    ),
                0
            );

        const discounts =
            completed.reduce(
                (sum, sale) =>
                    sum +
                    Number(
                        sale.discount || 0
                    ),
                0
            );

        const average =
            completed.length > 0
                ? revenue / completed.length
                : 0;

        return {
            count: completed.length,
            revenue,
            gross,
            discounts,
            average
        };

    }, [filteredSales]);


    // =====================================================
    // SELECT
    // =====================================================

    const toggleSelect = (id) => {

        setSelectedSales(prev => {

            if (prev.includes(id)) {

                return prev.filter(
                    item => item !== id
                );

            }

            return [
                ...prev,
                id
            ];

        });

    };


    const toggleSelectAll = () => {

        if (
            selectedSales.length ===
            filteredSales.length
        ) {

            setSelectedSales([]);

            return;

        }

        setSelectedSales(
            filteredSales.map(
                sale => sale.id
            )
        );

    };


    // =====================================================
    // DELETE
    // =====================================================

    const confirmDelete = async () => {

        if (!deleteTarget) {
            return;
        }

        try {

            setDeleting(true);

            await deleteSale(
                deleteTarget.id
            );

            toast.success(
                `تم حذف الفاتورة #${deleteTarget.id}`
            );

            setDeleteTarget(null);

            await loadSales(true);

        } catch (error) {

            console.error(
                "DELETE SALE ERROR:",
                error
            );

            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                "فشل حذف الفاتورة";

            toast.error(message);

        } finally {

            setDeleting(false);

        }

    };


    // =====================================================
    // EXPORT CSV
    // =====================================================

    const exportCSV = () => {

        if (!filteredSales.length) {

            toast.error(
                "لا توجد بيانات للتصدير"
            );

            return;

        }

        const headers = [
            "Invoice",
            "Customer",
            "Cashier",
            "Total",
            "Discount",
            "Final Amount",
            "Status",
            "Date"
        ];

        const rows =
            filteredSales.map(
                sale => [
                    sale.id,
                    sale.customer_name ||
                    "عميل نقدي",
                    sale.cashier?.username ||
                    sale.cashier ||
                    "-",
                    sale.total_amount || 0,
                    sale.discount || 0,
                    sale.final_amount || 0,
                    sale.status || "-",
                    sale.created_at || "-"
                ]
            );

        const csv = [
            headers,
            ...rows
        ]
            .map(row =>
                row
                    .map(value =>
                        `"${String(value).replace(
                            /"/g,
                            '""'
                        )}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            ["\uFEFF" + csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            `sales-${Date.now()}.csv`;

        link.click();

        URL.revokeObjectURL(url);

        toast.success(
            "تم تصدير المبيعات بنجاح"
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div
                dir="rtl"
                className="
                    min-h-[60vh]
                    flex
                    items-center
                    justify-center
                "
            >

                <Loading />

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            dir="rtl"
            className="
                min-h-screen
                space-y-7
                pb-10
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <PageHeader
                title="إدارة المبيعات"
                subtitle="متابعة وتحليل جميع عمليات البيع والفواتير"
            />


            {/* =================================================
                KPI
            ================================================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-5
                "
            >

                <Stat
                    title="إجمالي المبيعات"
                    value={`${money(stats.revenue)} جنيه`}
                    subtitle={`${stats.count} فاتورة مكتملة`}
                    icon={TrendingUp}
                    iconClass="text-emerald-600"
                    bgClass="bg-emerald-50"
                />


                <Stat
                    title="إجمالي الفواتير"
                    value={filteredSales.length}
                    subtitle="حسب الفلاتر الحالية"
                    icon={Receipt}
                    iconClass="text-[#5B2A86]"
                    bgClass="bg-purple-50"
                />


                <Stat
                    title="إجمالي الخصومات"
                    value={`${money(stats.discounts)} جنيه`}
                    subtitle="قيمة الخصومات"
                    icon={Percent}
                    iconClass="text-amber-600"
                    bgClass="bg-amber-50"
                />


                <Stat
                    title="متوسط الفاتورة"
                    value={`${money(stats.average)} جنيه`}
                    subtitle="متوسط المبيعات المكتملة"
                    icon={BadgeDollarSign}
                    iconClass="text-blue-600"
                    bgClass="bg-blue-50"
                />

            </div>


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div
                className="
                    bg-white
                    border
                    border-gray-100
                    rounded-3xl
                    shadow-sm
                    p-5
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

                    {/* SEARCH */}

                    <div className="relative flex-1">

                        <Search
                            size={19}
                            className="
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                            "
                        />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="
                                ابحث برقم الفاتورة أو العميل أو الكاشير...
                            "
                            className="
                                w-full
                                pr-11
                                pl-4
                                py-3.5
                                rounded-2xl
                                border
                                border-gray-200
                                bg-gray-50
                                outline-none
                                transition
                                focus:bg-white
                                focus:border-[#5B2A86]
                                focus:ring-4
                                focus:ring-purple-100
                            "
                        />

                    </div>


                    {/* FILTER BUTTON */}

                    <button
                        type="button"
                        onClick={() =>
                            setShowFilters(
                                !showFilters
                            )
                        }
                        className="
                            px-5
                            py-3.5
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            hover:bg-gray-50
                            font-bold
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >

                        <ChevronDown
                            size={18}
                        />

                        الفلاتر

                    </button>


                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={() =>
                            loadSales(true)
                        }
                        disabled={refreshing}
                        className="
                            px-5
                            py-3.5
                            rounded-2xl
                            bg-gray-100
                            hover:bg-gray-200
                            font-bold
                            flex
                            items-center
                            justify-center
                            gap-2
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


                    {/* EXPORT */}

                    <button
                        type="button"
                        onClick={exportCSV}
                        className="
                            px-5
                            py-3.5
                            rounded-2xl
                            bg-[#5B2A86]
                            text-white
                            hover:bg-[#4a216d]
                            font-bold
                            flex
                            items-center
                            justify-center
                            gap-2
                            shadow-sm
                        "
                    >

                        <Download
                            size={18}
                        />

                        تصدير

                    </button>

                </div>


                {/* FILTERS */}

                {showFilters && (

                    <div
                        className="
                            mt-5
                            pt-5
                            border-t
                            grid
                            grid-cols-1
                            md:grid-cols-3
                            gap-4
                        "
                    >

                        <FilterSelect
                            label="حالة الفاتورة"
                            value={statusFilter}
                            onChange={setStatusFilter}
                        >

                            <option value="all">
                                جميع الحالات
                            </option>

                            <option value="COMPLETED">
                                مكتملة
                            </option>

                            <option value="PENDING">
                                معلقة
                            </option>

                            <option value="CANCELLED">
                                ملغاة
                            </option>

                            <option value="RETURNED">
                                مرتجعة
                            </option>

                        </FilterSelect>


                        <FilterSelect
                            label="الفترة"
                            value={dateFilter}
                            onChange={setDateFilter}
                        >

                            <option value="all">
                                كل الفترات
                            </option>

                            <option value="today">
                                اليوم
                            </option>

                            <option value="week">
                                آخر 7 أيام
                            </option>

                            <option value="month">
                                هذا الشهر
                            </option>

                        </FilterSelect>


                        <FilterSelect
                            label="ترتيب"
                            value={sortBy}
                            onChange={setSortBy}
                        >

                            <option value="newest">
                                الأحدث أولاً
                            </option>

                            <option value="oldest">
                                الأقدم أولاً
                            </option>

                            <option value="highest">
                                الأعلى قيمة
                            </option>

                            <option value="lowest">
                                الأقل قيمة
                            </option>

                        </FilterSelect>

                    </div>

                )}

            </div>


            {/* =================================================
                RESULT INFO
            ================================================= */}

            <div
                className="
                    flex
                    flex-col
                    sm:flex-row
                    justify-between
                    items-start
                    sm:items-center
                    gap-3
                "
            >

                <div>

                    <h2
                        className="
                            text-xl
                            font-black
                            text-gray-800
                        "
                    >
                        سجل المبيعات
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >
                        عرض {filteredSales.length} من أصل{" "}
                        {sales.length} فاتورة
                    </p>

                </div>


                {selectedSales.length > 0 && (

                    <div
                        className="
                            bg-purple-50
                            text-[#5B2A86]
                            px-4
                            py-2
                            rounded-xl
                            font-bold
                        "
                    >
                        تم تحديد{" "}
                        {selectedSales.length} فاتورة
                    </div>

                )}

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div
                className="
                    bg-white
                    border
                    border-gray-100
                    rounded-3xl
                    shadow-sm
                    overflow-hidden
                "
            >

                <div
                    className="
                        overflow-x-auto
                    "
                >

                    <table
                        className="
                            w-full
                            text-right
                            min-w-[1100px]
                        "
                    >

                        <thead>

                            <tr
                                className="
                                    bg-gray-50/80
                                    border-b
                                    border-gray-100
                                "
                            >

                                <th className="px-5 py-4">

                                    <input
                                        type="checkbox"
                                        checked={
                                            filteredSales.length > 0 &&
                                            selectedSales.length ===
                                            filteredSales.length
                                        }
                                        onChange={
                                            toggleSelectAll
                                        }
                                        className="
                                            w-4
                                            h-4
                                            accent-[#5B2A86]
                                        "
                                    />

                                </th>

                                <th className="px-5 py-4 text-xs font-black text-gray-500">
                                    الفاتورة
                                </th>

                                <th className="px-5 py-4 text-xs font-black text-gray-500">
                                    العميل
                                </th>

                                <th className="px-5 py-4 text-xs font-black text-gray-500">
                                    الكاشير
                                </th>

                                <th className="px-5 py-4 text-xs font-black text-gray-500">
                                    الإجمالي
                                </th>

                                <th className="px-5 py-4 text-xs font-black text-gray-500">
                                    الخصم
                                </th>

                                <th className="px-5 py-4 text-xs font-black text-gray-500">
                                    الصافي
                                </th>

                                <th className="px-5 py-4 text-xs font-black text-gray-500">
                                    الحالة
                                </th>

                                <th className="px-5 py-4 text-xs font-black text-gray-500">
                                    التاريخ
                                </th>

                                <th className="px-5 py-4 text-xs font-black text-gray-500">
                                    الإجراءات
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredSales.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="10"
                                        className="
                                            py-20
                                            text-center
                                        "
                                    >

                                        <div
                                            className="
                                                w-16
                                                h-16
                                                mx-auto
                                                rounded-2xl
                                                bg-gray-100
                                                flex
                                                items-center
                                                justify-center
                                                mb-4
                                            "
                                        >

                                            <Receipt
                                                size={30}
                                                className="text-gray-400"
                                            />

                                        </div>

                                        <h3
                                            className="
                                                font-black
                                                text-lg
                                                text-gray-700
                                            "
                                        >
                                            لا توجد مبيعات
                                        </h3>

                                        <p
                                            className="
                                                text-gray-400
                                                mt-2
                                            "
                                        >
                                            لم يتم العثور على
                                            فواتير مطابقة للفلاتر
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                filteredSales.map(
                                    (sale) => {

                                        const status =
                                            getStatus(
                                                sale.status
                                            );

                                        const StatusIcon =
                                            status.icon;

                                        return (

                                            <tr
                                                key={sale.id}
                                                className="
                                                    border-b
                                                    last:border-0
                                                    border-gray-100
                                                    hover:bg-purple-50/30
                                                    transition
                                                "
                                            >

                                                {/* CHECK */}

                                                <td className="px-5 py-4">

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            selectedSales.includes(
                                                                sale.id
                                                            )
                                                        }
                                                        onChange={() =>
                                                            toggleSelect(
                                                                sale.id
                                                            )
                                                        }
                                                        className="
                                                            w-4
                                                            h-4
                                                            accent-[#5B2A86]
                                                        "
                                                    />

                                                </td>


                                                {/* ID */}

                                                <td className="px-5 py-4">

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/sales/${sale.id}`
                                                            )
                                                        }
                                                        className="
                                                            font-black
                                                            text-[#5B2A86]
                                                            hover:underline
                                                        "
                                                    >
                                                        #{sale.id}
                                                    </button>

                                                </td>


                                                {/* CUSTOMER */}

                                                <td className="px-5 py-4">

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
                                                                rounded-xl
                                                                bg-purple-100
                                                                text-[#5B2A86]
                                                                flex
                                                                items-center
                                                                justify-center
                                                                font-black
                                                            "
                                                        >
                                                            {(
                                                                sale.customer_name ||
                                                                "ع"
                                                            ).charAt(0)}
                                                        </div>

                                                        <span
                                                            className="
                                                                font-bold
                                                                text-gray-700
                                                            "
                                                        >
                                                            {
                                                                sale.customer_name ||
                                                                "عميل نقدي"
                                                            }
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* CASHIER */}

                                                <td className="px-5 py-4 text-gray-600">

                                                    {
                                                        sale.cashier?.username ||
                                                        sale.cashier ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* TOTAL */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className="
                                                            font-bold
                                                            text-gray-700
                                                        "
                                                    >
                                                        {money(
                                                            sale.total_amount
                                                        )}{" "}
                                                        جنيه
                                                    </span>

                                                </td>


                                                {/* DISCOUNT */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className="
                                                            text-red-500
                                                            font-bold
                                                        "
                                                    >
                                                        {money(
                                                            sale.discount
                                                        )}{" "}
                                                        جنيه
                                                    </span>

                                                </td>


                                                {/* FINAL */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className="
                                                            font-black
                                                            text-[#5B2A86]
                                                        "
                                                    >
                                                        {money(
                                                            sale.final_amount
                                                        )}{" "}
                                                        جنيه
                                                    </span>

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-5 py-4">

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
                                                            ${status.className}
                                                        `}
                                                    >

                                                        <StatusIcon
                                                            size={14}
                                                        />

                                                        {
                                                            status.text
                                                        }

                                                    </span>

                                                </td>


                                                {/* DATE */}

                                                <td
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-sm
                                                        text-gray-500
                                                        whitespace-nowrap
                                                    "
                                                >
                                                    {formatDate(
                                                        sale.created_at
                                                    )}
                                                </td>


                                                {/* ACTIONS */}

                                                <td className="px-5 py-4">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                        "
                                                    >

                                                        <button
                                                            type="button"
                                                            title="عرض التفاصيل"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/sales/${sale.id}`
                                                                )
                                                            }
                                                            className="
                                                                w-9
                                                                h-9
                                                                rounded-xl
                                                                bg-purple-50
                                                                text-[#5B2A86]
                                                                flex
                                                                items-center
                                                                justify-center
                                                                hover:bg-purple-100
                                                                transition
                                                            "
                                                        >

                                                            <Eye
                                                                size={17}
                                                            />

                                                        </button>


                                                        <button
                                                            type="button"
                                                            title="حذف الفاتورة"
                                                            onClick={() =>
                                                                setDeleteTarget(
                                                                    sale
                                                                )
                                                            }
                                                            className="
                                                                w-9
                                                                h-9
                                                                rounded-xl
                                                                bg-red-50
                                                                text-red-600
                                                                flex
                                                                items-center
                                                                justify-center
                                                                hover:bg-red-100
                                                                transition
                                                            "
                                                        >

                                                            <Trash2
                                                                size={17}
                                                            />

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
                DELETE MODAL
            ================================================= */}

            {deleteTarget && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        bg-black/40
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        p-4
                    "
                >

                    <div
                        className="
                            bg-white
                            w-full
                            max-w-md
                            rounded-3xl
                            shadow-2xl
                            p-7
                        "
                    >

                        <div
                            className="
                                flex
                                justify-between
                                items-start
                                mb-6
                            "
                        >

                            <div>

                                <div
                                    className="
                                        w-12
                                        h-12
                                        rounded-2xl
                                        bg-red-50
                                        text-red-600
                                        flex
                                        items-center
                                        justify-center
                                        mb-4
                                    "
                                >

                                    <Trash2
                                        size={23}
                                    />

                                </div>

                                <h2
                                    className="
                                        text-xl
                                        font-black
                                        text-gray-800
                                    "
                                >
                                    حذف الفاتورة
                                </h2>

                            </div>


                            <button
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                className="
                                    w-9
                                    h-9
                                    rounded-xl
                                    bg-gray-100
                                    flex
                                    items-center
                                    justify-center
                                    text-gray-500
                                    hover:bg-gray-200
                                "
                            >

                                <X size={18} />

                            </button>

                        </div>


                        <p
                            className="
                                text-gray-600
                                leading-7
                            "
                        >
                            هل أنت متأكد من حذف الفاتورة{" "}
                            <strong className="text-gray-900">
                                #{deleteTarget.id}
                            </strong>
                            ؟
                            <br />
                            لا يمكن التراجع عن هذا الإجراء.
                        </p>


                        <div
                            className="
                                flex
                                gap-3
                                mt-7
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                disabled={deleting}
                                className="
                                    flex-1
                                    py-3
                                    rounded-xl
                                    bg-gray-100
                                    text-gray-700
                                    font-bold
                                    hover:bg-gray-200
                                "
                            >
                                إلغاء
                            </button>


                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="
                                    flex-1
                                    py-3
                                    rounded-xl
                                    bg-red-600
                                    text-white
                                    font-bold
                                    hover:bg-red-700
                                    disabled:opacity-50
                                "
                            >

                                {deleting
                                    ? "جاري الحذف..."
                                    : "تأكيد الحذف"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


// =========================================================
// STAT COMPONENT
// =========================================================

function Stat({
    title,
    value,
    subtitle,
    icon: Icon,
    iconClass,
    bgClass
}) {

    return (

        <div
            className="
                bg-white
                rounded-3xl
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
                    gap-4
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            font-bold
                            text-gray-500
                        "
                    >
                        {title}
                    </p>

                    <p
                        className="
                            text-2xl
                            font-black
                            text-gray-800
                            mt-2
                        "
                    >
                        {value}
                    </p>

                    <p
                        className="
                            text-xs
                            text-gray-400
                            mt-2
                        "
                    >
                        {subtitle}
                    </p>

                </div>


                <div
                    className={`
                        w-12
                        h-12
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        ${bgClass}
                    `}
                >

                    <Icon
                        size={23}
                        className={iconClass}
                    />

                </div>

            </div>

        </div>

    );

}


// =========================================================
// FILTER SELECT
// =========================================================

function FilterSelect({
    label,
    value,
    onChange,
    children
}) {

    return (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-bold
                    text-gray-600
                    mb-2
                "
            >
                {label}
            </label>

            <select
                value={value}
                onChange={(e) =>
                    onChange(
                        e.target.value
                    )
                }
                className="
                    w-full
                    border
                    border-gray-200
                    bg-gray-50
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:bg-white
                    focus:border-[#5B2A86]
                    focus:ring-4
                    focus:ring-purple-100
                "
            >

                {children}

            </select>

        </div>

    );

}