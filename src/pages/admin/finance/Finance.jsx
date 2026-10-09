import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    getExpenses,
    createExpense,
    deleteExpense,
    getProfit
} from "../../../services/finance/financeService";

import PageHeader from "../../../components/ui/layout/PageHeader";
import SearchBox from "../../../components/ui/forms/SearchBox";
import Card from "../../../components/ui/cards/Card";
import Loading from "../../../components/ui/feedback/Loading";
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";

import toast from "react-hot-toast";

import {
    RefreshCw,
    Trash2,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Plus,
    X,
    Wallet,
    Receipt,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    AlertCircle,
    CalendarDays,
    BarChart3,
    CircleDollarSign
} from "lucide-react";


// ======================================================
// CONSTANTS
// ======================================================

const CATEGORY_CONFIG = {
    RENT: {
        label: "إيجار",
        className: "bg-blue-50 text-blue-700 border-blue-100"
    },

    SALARY: {
        label: "رواتب",
        className: "bg-purple-50 text-purple-700 border-purple-100"
    },

    UTILITIES: {
        label: "فواتير",
        className: "bg-yellow-50 text-yellow-700 border-yellow-100"
    },

    SUPPLIES: {
        label: "مستلزمات",
        className: "bg-green-50 text-green-700 border-green-100"
    },

    OTHER: {
        label: "أخرى",
        className: "bg-gray-50 text-gray-700 border-gray-100"
    }
};


// ======================================================
// MAIN
// ======================================================

export default function Finance() {

    const [expenses, setExpenses] = useState([]);

    const [profit, setProfit] = useState({
        income: 0,
        expenses: 0,
        profit: 0
    });

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");

    const [categoryFilter, setCategoryFilter] = useState("all");

    const [showAddModal, setShowAddModal] = useState(false);

    const [saving, setSaving] = useState(false);

    const [deletingId, setDeletingId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        category: "OTHER",
        amount: ""
    });


    // ==================================================
    // LOAD DATA
    // ==================================================

    const loadData = async (showLoader = true) => {

        try {

            if (showLoader) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            const [
                expensesData,
                profitData
            ] = await Promise.all([
                getExpenses(),
                getProfit()
            ]);


            setExpenses(
                Array.isArray(expensesData)
                    ? expensesData
                    : expensesData?.results || []
            );


            setProfit({
                income: Number(profitData?.income || 0),
                expenses: Number(profitData?.expenses || 0),
                profit: Number(profitData?.profit || 0)
            });


        } catch (error) {

            console.error(
                "FINANCE ERROR:",
                error
            );

            toast.error(
                "فشل تحميل البيانات المالية"
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    useEffect(() => {

        loadData();

    }, []);


    // ==================================================
    // ESC CLOSE MODAL
    // ==================================================

    useEffect(() => {

        const handleKeyDown = (event) => {

            if (
                event.key === "Escape" &&
                showAddModal &&
                !saving
            ) {
                setShowAddModal(false);
            }

        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [
        showAddModal,
        saving
    ]);


    // ==================================================
    // FILTERED EXPENSES
    // ==================================================

    const filteredExpenses = useMemo(() => {

        let result = [...expenses];

        const query =
            search
                .trim()
                .toLowerCase();


        if (query) {

            result = result.filter(
                (expense) => {

                    const title =
                        String(
                            expense.title || ""
                        ).toLowerCase();

                    const category =
                        String(
                            expense.category || ""
                        ).toLowerCase();

                    const categoryLabel =
                        getCategoryLabel(
                            expense.category
                        ).toLowerCase();

                    const amount =
                        String(
                            expense.amount || ""
                        );


                    return (
                        title.includes(query) ||
                        category.includes(query) ||
                        categoryLabel.includes(query) ||
                        amount.includes(query)
                    );

                }
            );

        }


        if (
            categoryFilter !== "all"
        ) {

            result = result.filter(
                (expense) =>
                    expense.category ===
                    categoryFilter
            );

        }


        return result;

    }, [
        expenses,
        search,
        categoryFilter
    ]);


    // ==================================================
    // FINANCIAL CALCULATIONS
    // ==================================================

    const totalIncome =
        Number(profit.income || 0);


    const totalExpenses =
        Number(profit.expenses || 0);


    const netProfit =
        Number(profit.profit || 0);


    const profitMargin =
        totalIncome > 0
            ? (netProfit / totalIncome) * 100
            : 0;


    const expenseRatio =
        totalIncome > 0
            ? (totalExpenses / totalIncome) * 100
            : 0;


    const expenseCount =
        expenses.length;


    // ==================================================
    // CATEGORY BREAKDOWN
    // ==================================================

    const categoryBreakdown = useMemo(() => {

        const totals = {};

        expenses.forEach(
            (expense) => {

                const category =
                    expense.category ||
                    "OTHER";

                totals[category] =
                    (
                        totals[category] ||
                        0
                    ) +
                    Number(
                        expense.amount || 0
                    );

            }
        );


        return Object.entries(
            totals
        )
            .map(
                ([
                    category,
                    amount
                ]) => {

                    const percentage =
                        totalExpenses > 0
                            ? (
                                amount /
                                totalExpenses
                            ) *
                            100
                            : 0;


                    return {
                        category,
                        amount,
                        percentage
                    };

                }
            )
            .sort(
                (a, b) =>
                    b.amount -
                    a.amount
            );

    }, [
        expenses,
        totalExpenses
    ]);


    // ==================================================
    // BIGGEST EXPENSE
    // ==================================================

    const biggestExpense =
        useMemo(() => {

            if (
                expenses.length === 0
            ) {
                return null;
            }

            return expenses.reduce(
                (max, expense) => {

                    if (!max) {
                        return expense;
                    }

                    return Number(
                        expense.amount || 0
                    ) >
                        Number(
                            max.amount || 0
                        )
                        ? expense
                        : max;

                },
                null
            );

        }, [
            expenses
        ]);


    // ==================================================
    // FORM
    // ==================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData(
            (prev) => ({
                ...prev,
                [name]: value
            })
        );

    };


    // ==================================================
    // ADD EXPENSE
    // ==================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        const title =
            formData.title.trim();


        const amount =
            Number(
                formData.amount
            );


        if (!title) {

            toast.error(
                "عنوان المصروف مطلوب"
            );

            return;

        }


        if (
            !amount ||
            amount <= 0
        ) {

            toast.error(
                "المبلغ يجب أن يكون أكبر من صفر"
            );

            return;

        }


        try {

            setSaving(true);


            await createExpense({

                title,

                category:
                    formData.category,

                amount

            });


            toast.success(
                "تم إضافة المصروف بنجاح"
            );


            setShowAddModal(
                false
            );


            setFormData({
                title: "",
                category: "OTHER",
                amount: ""
            });


            await loadData(false);


        } catch (error) {

            console.error(
                "CREATE EXPENSE ERROR:",
                error
            );


            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.title?.[0] ||
                error?.response?.data?.amount?.[0] ||
                "فشل إضافة المصروف";


            toast.error(message);

        } finally {

            setSaving(false);

        }

    };


    // ==================================================
    // DELETE EXPENSE
    // ==================================================

    const handleDelete = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "هل أنت متأكد من حذف هذا المصروف؟"
            );


        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(id);


            await deleteExpense(id);


            toast.success(
                "تم حذف المصروف بنجاح"
            );


            await loadData(false);


        } catch (error) {

            console.error(
                "DELETE EXPENSE ERROR:",
                error
            );


            toast.error(
                "فشل حذف المصروف"
            );

        } finally {

            setDeletingId(null);

        }

    };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div
                dir="rtl"
                className="
                    min-h-[70vh]
                    flex
                    items-center
                    justify-center
                "
            >

                <Loading />

            </div>

        );

    }


    // ==================================================
    // PAGE
    // ==================================================

    return (

        <div
            dir="rtl"
            className="
                space-y-7
                pb-10
            "
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <PageHeader
                title="الإدارة المالية"
                subtitle="
                    متابعة الإيرادات والمصروفات والأداء المالي للصيدلية
                "
                action={

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                loadData(false)
                            }
                            disabled={refreshing}
                            className="
                                hidden
                                sm:flex
                                items-center
                                gap-2
                                px-4
                                py-2.5
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                text-gray-700
                                font-bold
                                hover:bg-gray-50
                                transition
                                disabled:opacity-50
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

                            تحديث

                        </button>


                        <PrimaryButton
                            onClick={() =>
                                setShowAddModal(true)
                            }
                        >

                            <Plus
                                size={18}
                                className="ml-2 inline"
                            />

                            إضافة مصروف

                        </PrimaryButton>

                    </div>

                }
            />


            {/* ==================================================
                KPI CARDS
            ================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-5
                "
            >

                <FinanceCard
                    title="إجمالي الإيرادات"
                    value={totalIncome}
                    suffix="جنيه"
                    icon={TrendingUp}
                    iconClass="
                        bg-green-50
                        text-green-600
                    "
                    valueClass="text-green-600"
                    trend="الإيرادات المسجلة"
                />


                <FinanceCard
                    title="إجمالي المصروفات"
                    value={totalExpenses}
                    suffix="جنيه"
                    icon={TrendingDown}
                    iconClass="
                        bg-red-50
                        text-red-600
                    "
                    valueClass="text-red-600"
                    trend={`${expenseCount} مصروف مسجل`}
                />


                <FinanceCard
                    title="صافي الأرباح"
                    value={netProfit}
                    suffix="جنيه"
                    icon={Wallet}
                    iconClass="
                        bg-purple-50
                        text-[#5B2A86]
                    "
                    valueClass={
                        netProfit >= 0
                            ? "text-[#5B2A86]"
                            : "text-red-600"
                    }
                    trend={
                        netProfit >= 0
                            ? "أداء ربحي إيجابي"
                            : "يوجد عجز مالي"
                    }
                />


                <FinanceCard
                    title="هامش الربح"
                    value={profitMargin}
                    suffix="%"
                    icon={CircleDollarSign}
                    iconClass="
                        bg-indigo-50
                        text-indigo-600
                    "
                    valueClass="text-indigo-600"
                    trend={
                        totalIncome > 0
                            ? `${expenseRatio.toFixed(1)}% نسبة المصروفات`
                            : "لا توجد إيرادات"
                    }
                    isPercentage
                />

            </div>


            {/* ==================================================
                QUICK FINANCIAL SUMMARY
            ================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    xl:grid-cols-3
                    gap-5
                "
            >

                <Card>

                    <div className="p-6">

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                mb-6
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-sm
                                        text-gray-500
                                        font-semibold
                                    "
                                >
                                    الملخص المالي
                                </p>

                                <h2
                                    className="
                                        text-xl
                                        font-black
                                        text-gray-900
                                        mt-1
                                    "
                                >
                                    الوضع الحالي
                                </h2>

                            </div>


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

                                <BarChart3
                                    size={21}
                                />

                            </div>

                        </div>


                        <FinancialProgress
                            label="المصروفات من الإيرادات"
                            percentage={expenseRatio}
                            value={totalExpenses}
                            suffix="جنيه"
                        />


                        <div
                            className="
                                mt-6
                                pt-5
                                border-t
                                border-gray-100
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <span
                                className="
                                    text-sm
                                    text-gray-500
                                    font-semibold
                                "
                            >
                                صافي الربح

                            </span>


                            <span
                                className={`
                                    font-black
                                    text-lg
                                    ${netProfit >= 0
                                        ? "text-[#5B2A86]"
                                        : "text-red-600"
                                    }
                                `}
                            >

                                {money(
                                    netProfit
                                )}

                                {" "}جنيه

                            </span>

                        </div>

                    </div>

                </Card>


                {/* CATEGORY BREAKDOWN */}

                <Card>

                    <div className="p-6">

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
                                        text-sm
                                        text-gray-500
                                        font-semibold
                                    "
                                >
                                    توزيع المصروفات
                                </p>

                                <h2
                                    className="
                                        text-xl
                                        font-black
                                        mt-1
                                    "
                                >
                                    حسب التصنيف
                                </h2>

                            </div>


                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-orange-50
                                    text-orange-600
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                <PieChart
                                    size={21}
                                />

                            </div>

                        </div>


                        {categoryBreakdown.length === 0 ? (

                            <div
                                className="
                                    py-8
                                    text-center
                                    text-gray-400
                                "
                            >

                                <PieChart
                                    size={34}
                                    className="
                                        mx-auto
                                        mb-2
                                        opacity-40
                                    "
                                />

                                <p>
                                    لا توجد مصروفات
                                </p>

                            </div>

                        ) : (

                            <div
                                className="
                                    space-y-4
                                "
                            >

                                {categoryBreakdown
                                    .slice(0, 5)
                                    .map(
                                        (item) => (

                                            <CategoryRow
                                                key={
                                                    item.category
                                                }
                                                category={
                                                    item.category
                                                }
                                                amount={
                                                    item.amount
                                                }
                                                percentage={
                                                    item.percentage
                                                }
                                            />

                                        )
                                    )}

                            </div>

                        )}

                    </div>

                </Card>


                {/* BIGGEST EXPENSE */}

                <Card>

                    <div className="p-6">

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
                                        text-sm
                                        text-gray-500
                                        font-semibold
                                    "
                                >
                                    أكبر مصروف
                                </p>

                                <h2
                                    className="
                                        text-xl
                                        font-black
                                        mt-1
                                    "
                                >
                                    أعلى عملية
                                </h2>

                            </div>


                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-red-50
                                    text-red-600
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                <Receipt
                                    size={21}
                                />

                            </div>

                        </div>


                        {biggestExpense ? (

                            <>

                                <div
                                    className="
                                        p-5
                                        rounded-2xl
                                        bg-gray-50
                                        border
                                        border-gray-100
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
                                                    font-black
                                                    text-gray-900
                                                    text-lg
                                                "
                                            >

                                                {
                                                    biggestExpense.title
                                                }

                                            </p>


                                            <span
                                                className={`
                                                    inline-flex
                                                    mt-2
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    text-xs
                                                    font-bold
                                                    border
                                                    ${getCategoryConfig(
                                                    biggestExpense.category
                                                ).className
                                                    }
                                                `}
                                            >

                                                {
                                                    getCategoryLabel(
                                                        biggestExpense.category
                                                    )
                                                }

                                            </span>

                                        </div>


                                        <div
                                            className="
                                                text-left
                                            "
                                        >

                                            <p
                                                className="
                                                    text-xl
                                                    font-black
                                                    text-red-600
                                                "
                                            >

                                                {money(
                                                    biggestExpense.amount
                                                )}

                                            </p>

                                            <p
                                                className="
                                                    text-xs
                                                    text-gray-400
                                                    mt-1
                                                "
                                            >
                                                جنيه
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        mt-4
                                        text-sm
                                        text-gray-500
                                    "
                                >

                                    <CalendarDays
                                        size={16}
                                    />

                                    {formatDate(
                                        biggestExpense.created_at
                                    )}

                                </div>

                            </>

                        ) : (

                            <EmptyFinancial />

                        )}

                    </div>

                </Card>

            </div>


            {/* ==================================================
                FILTERS
            ================================================== */}

            <Card>

                <div
                    className="
                        p-5
                        flex
                        flex-col
                        lg:flex-row
                        gap-4
                        lg:items-center
                    "
                >

                    <div
                        className="
                            flex-1
                            min-w-0
                        "
                    >

                        <SearchBox
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="
                                ابحث باسم المصروف أو التصنيف أو المبلغ...
                            "
                        />

                    </div>


                    <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            gap-3
                        "
                    >

                        <select
                            value={
                                categoryFilter
                            }
                            onChange={(e) =>
                                setCategoryFilter(
                                    e.target.value
                                )
                            }
                            className="
                                min-w-[190px]
                                border
                                border-gray-200
                                rounded-xl
                                px-4
                                py-3
                                bg-white
                                outline-none
                                font-semibold
                                focus:ring-2
                                focus:ring-purple-200
                                focus:border-[#5B2A86]
                            "
                        >

                            <option value="all">
                                جميع التصنيفات
                            </option>

                            <option value="RENT">
                                إيجار
                            </option>

                            <option value="SALARY">
                                رواتب
                            </option>

                            <option value="UTILITIES">
                                فواتير
                            </option>

                            <option value="SUPPLIES">
                                مستلزمات
                            </option>

                            <option value="OTHER">
                                أخرى
                            </option>

                        </select>


                        <button
                            type="button"
                            onClick={() =>
                                loadData(false)
                            }
                            disabled={refreshing}
                            className="
                                px-5
                                py-3
                                rounded-xl
                                bg-gray-100
                                hover:bg-gray-200
                                transition
                                flex
                                items-center
                                justify-center
                                gap-2
                                font-bold
                                disabled:opacity-50
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

                            تحديث

                        </button>

                    </div>

                </div>

            </Card>


            {/* ==================================================
                EXPENSES TABLE
            ================================================== */}

            <Card>

                <div
                    className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        justify-between
                        gap-4
                        p-6
                        border-b
                        border-gray-100
                    "
                >

                    <div>

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
                                "
                            >

                                <Receipt
                                    size={19}
                                />

                            </div>


                            <h2
                                className="
                                    text-xl
                                    font-black
                                "
                            >
                                سجل المصروفات
                            </h2>

                        </div>


                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-2
                            "
                        >

                            عرض{" "}
                            <strong>
                                {filteredExpenses.length}
                            </strong>{" "}
                            من أصل{" "}
                            <strong>
                                {expenses.length}
                            </strong>{" "}
                            مصروف

                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            setShowAddModal(true)
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-5
                            py-2.5
                            rounded-xl
                            bg-[#5B2A86]
                            text-white
                            font-bold
                            hover:bg-[#4a216d]
                            transition
                        "
                    >

                        <Plus
                            size={17}
                        />

                        إضافة مصروف

                    </button>

                </div>


                {filteredExpenses.length === 0 ? (

                    <EmptyExpenses
                        hasFilters={
                            Boolean(
                                search ||
                                categoryFilter !==
                                "all"
                            )
                        }
                        onReset={() => {

                            setSearch("");

                            setCategoryFilter(
                                "all"
                            );

                        }}
                    />

                ) : (

                    <div
                        className="
                            overflow-x-auto
                        "
                    >

                        <table
                            className="
                                w-full
                                text-right
                                min-w-[850px]
                            "
                        >

                            <thead>

                                <tr
                                    className="
                                        bg-gray-50
                                        border-b
                                        border-gray-100
                                    "
                                >

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-black
                                            text-gray-500
                                        "
                                    >
                                        المصروف
                                    </th>

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-black
                                            text-gray-500
                                        "
                                    >
                                        التصنيف
                                    </th>

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-black
                                            text-gray-500
                                        "
                                    >
                                        المبلغ
                                    </th>

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-black
                                            text-gray-500
                                        "
                                    >
                                        المستخدم
                                    </th>

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-black
                                            text-gray-500
                                        "
                                    >
                                        التاريخ
                                    </th>

                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-xs
                                            font-black
                                            text-gray-500
                                            text-center
                                        "
                                    >
                                        الإجراء
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredExpenses.map(
                                    (expense) => {

                                        const config =
                                            getCategoryConfig(
                                                expense.category
                                            );


                                        const isDeleting =
                                            deletingId ===
                                            expense.id;


                                        return (

                                            <tr
                                                key={
                                                    expense.id
                                                }
                                                className="
                                                    border-b
                                                    last:border-0
                                                    border-gray-100
                                                    hover:bg-gray-50
                                                    transition
                                                "
                                            >

                                                <td
                                                    className="
                                                        px-6
                                                        py-4
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
                                                                w-10
                                                                h-10
                                                                rounded-xl
                                                                bg-red-50
                                                                text-red-500
                                                                flex
                                                                items-center
                                                                justify-center
                                                                shrink-0
                                                            "
                                                        >

                                                            <Receipt
                                                                size={18}
                                                            />

                                                        </div>


                                                        <div>

                                                            <p
                                                                className="
                                                                    font-black
                                                                    text-gray-900
                                                                "
                                                            >
                                                                {
                                                                    expense.title
                                                                }
                                                            </p>

                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-gray-400
                                                                    mt-1
                                                                "
                                                            >
                                                                #
                                                                {
                                                                    expense.id
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td
                                                    className="
                                                        px-6
                                                        py-4
                                                    "
                                                >

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            px-3
                                                            py-1.5
                                                            rounded-full
                                                            text-xs
                                                            font-black
                                                            border
                                                            ${config.className}
                                                        `}
                                                    >

                                                        {
                                                            config.label
                                                        }

                                                    </span>

                                                </td>


                                                <td
                                                    className="
                                                        px-6
                                                        py-4
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-1
                                                        "
                                                    >

                                                        <ArrowDownRight
                                                            size={15}
                                                            className="
                                                                text-red-500
                                                            "
                                                        />

                                                        <span
                                                            className="
                                                                font-black
                                                                text-red-600
                                                            "
                                                        >
                                                            {
                                                                money(
                                                                    expense.amount
                                                                )
                                                            }
                                                        </span>

                                                        <span
                                                            className="
                                                                text-xs
                                                                text-gray-400
                                                            "
                                                        >
                                                            جنيه
                                                        </span>

                                                    </div>

                                                </td>


                                                <td
                                                    className="
                                                        px-6
                                                        py-4
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-gray-700
                                                        "
                                                    >
                                                        {
                                                            expense.created_by_name ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>


                                                <td
                                                    className="
                                                        px-6
                                                        py-4
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-sm
                                                            text-gray-500
                                                        "
                                                    >

                                                        <CalendarDays
                                                            size={15}
                                                        />

                                                        {
                                                            formatDate(
                                                                expense.created_at
                                                            )
                                                        }

                                                    </div>

                                                </td>


                                                <td
                                                    className="
                                                        px-6
                                                        py-4
                                                        text-center
                                                    "
                                                >

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                expense.id
                                                            )
                                                        }
                                                        disabled={
                                                            isDeleting
                                                        }
                                                        className="
                                                            w-9
                                                            h-9
                                                            rounded-xl
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-red-500
                                                            hover:bg-red-50
                                                            transition
                                                            disabled:opacity-40
                                                        "
                                                        title="حذف المصروف"
                                                    >

                                                        {isDeleting ? (

                                                            <RefreshCw
                                                                size={17}
                                                                className="
                                                                    animate-spin
                                                                "
                                                            />

                                                        ) : (

                                                            <Trash2
                                                                size={17}
                                                            />

                                                        )}

                                                    </button>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </Card>


            {/* ==================================================
                ADD EXPENSE MODAL
            ================================================== */}

            {showAddModal && (

                <AddExpenseModal
                    formData={
                        formData
                    }
                    saving={
                        saving
                    }
                    onChange={
                        handleChange
                    }
                    onClose={() =>
                        !saving &&
                        setShowAddModal(
                            false
                        )
                    }
                    onSubmit={
                        handleSubmit
                    }
                />

            )}

        </div>

    );

}


// ======================================================
// FINANCE CARD
// ======================================================

function FinanceCard({
    title,
    value,
    suffix,
    icon: Icon,
    iconClass,
    valueClass,
    trend,
    isPercentage = false
}) {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                shadow-sm
                hover:shadow-md
                transition
                p-5
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
                            font-semibold
                            text-gray-500
                        "
                    >
                        {title}
                    </p>


                    <div
                        className="
                            flex
                            items-baseline
                            gap-2
                            mt-3
                        "
                    >

                        <span
                            className={`
                                text-2xl
                                sm:text-3xl
                                font-black
                                ${valueClass}
                            `}
                        >

                            {isPercentage
                                ? Number(
                                    value || 0
                                ).toFixed(1)
                                : money(value)
                            }

                        </span>


                        <span
                            className="
                                text-xs
                                text-gray-400
                                font-bold
                            "
                        >
                            {suffix}
                        </span>

                    </div>


                    <p
                        className="
                            text-xs
                            text-gray-400
                            mt-3
                            font-semibold
                        "
                    >
                        {trend}
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
                        shrink-0
                        ${iconClass}
                    `}
                >

                    <Icon
                        size={23}
                    />

                </div>

            </div>

        </div>

    );

}


// ======================================================
// FINANCIAL PROGRESS
// ======================================================

function FinancialProgress({
    label,
    percentage,
    value,
    suffix
}) {

    const safePercentage =
        Math.min(
            Math.max(
                Number(
                    percentage || 0
                ),
                0
            ),
            100
        );


    return (

        <div>

            <div
                className="
                    flex
                    items-center
                    justify-between
                    mb-2
                "
            >

                <span
                    className="
                        text-sm
                        font-bold
                        text-gray-700
                    "
                >
                    {label}
                </span>


                <span
                    className="
                        text-sm
                        font-black
                        text-[#5B2A86]
                    "
                >
                    {safePercentage.toFixed(1)}%
                </span>

            </div>


            <div
                className="
                    h-3
                    rounded-full
                    bg-gray-100
                    overflow-hidden
                "
            >

                <div
                    className="
                        h-full
                        rounded-full
                        bg-[#5B2A86]
                        transition-all
                    "
                    style={{
                        width:
                            `${safePercentage}%`
                    }}
                />

            </div>


            <div
                className="
                    flex
                    justify-between
                    mt-2
                    text-xs
                    text-gray-400
                    font-semibold
                "
            >

                <span>
                    {money(value)} {suffix}
                </span>

                <span>
                    {safePercentage >= 100
                        ? "تنبيه"
                        : "ضمن النطاق"
                    }
                </span>

            </div>

        </div>

    );

}


// ======================================================
// CATEGORY ROW
// ======================================================

function CategoryRow({
    category,
    amount,
    percentage
}) {

    const config =
        getCategoryConfig(
            category
        );


    return (

        <div>

            <div
                className="
                    flex
                    items-center
                    justify-between
                    mb-2
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    <span
                        className="
                            w-2.5
                            h-2.5
                            rounded-full
                            bg-[#5B2A86]
                        "
                    />

                    <span
                        className="
                            text-sm
                            font-bold
                            text-gray-700
                        "
                    >
                        {config.label}
                    </span>

                </div>


                <div
                    className="
                        text-left
                    "
                >

                    <span
                        className="
                            text-sm
                            font-black
                        "
                    >
                        {money(amount)}
                    </span>

                    <span
                        className="
                            text-xs
                            text-gray-400
                            mr-1
                        "
                    >
                        ({percentage.toFixed(1)}%)
                    </span>

                </div>

            </div>


            <div
                className="
                    h-2
                    bg-gray-100
                    rounded-full
                    overflow-hidden
                "
            >

                <div
                    className="
                        h-full
                        bg-[#5B2A86]
                        rounded-full
                    "
                    style={{
                        width:
                            `${Math.min(
                                percentage,
                                100
                            )}%`
                    }}
                />

            </div>

        </div>

    );

}


// ======================================================
// EMPTY EXPENSES
// ======================================================

function EmptyExpenses({
    hasFilters,
    onReset
}) {

    return (

        <div
            className="
                py-20
                px-6
                text-center
            "
        >

            <div
                className="
                    w-16
                    h-16
                    mx-auto
                    rounded-2xl
                    bg-purple-50
                    text-[#5B2A86]
                    flex
                    items-center
                    justify-center
                    mb-5
                "
            >

                {hasFilters
                    ? (
                        <Search
                            size={28}
                        />
                    )
                    : (
                        <Receipt
                            size={28}
                        />
                    )
                }

            </div>


            <h3
                className="
                    text-lg
                    font-black
                    text-gray-800
                "
            >

                {hasFilters
                    ? "لا توجد نتائج"
                    : "لا توجد مصروفات"
                }

            </h3>


            <p
                className="
                    text-sm
                    text-gray-500
                    mt-2
                "
            >

                {hasFilters
                    ? "جرب تغيير البحث أو التصنيف."
                    : "ابدأ بإضافة أول مصروف للصيدلية."
                }

            </p>


            {hasFilters && (

                <button
                    type="button"
                    onClick={
                        onReset
                    }
                    className="
                        mt-5
                        px-5
                        py-2.5
                        rounded-xl
                        bg-gray-100
                        hover:bg-gray-200
                        font-bold
                        transition
                    "
                >
                    مسح الفلاتر
                </button>

            )}

        </div>

    );

}


// ======================================================
// EMPTY FINANCIAL
// ======================================================

function EmptyFinancial() {

    return (

        <div
            className="
                py-8
                text-center
                text-gray-400
            "
        >

            <AlertCircle
                size={34}
                className="
                    mx-auto
                    mb-2
                    opacity-40
                "
            />

            <p>
                لا توجد بيانات مالية كافية
            </p>

        </div>

    );

}


// ======================================================
// ADD EXPENSE MODAL
// ======================================================

function AddExpenseModal({
    formData,
    saving,
    onChange,
    onClose,
    onSubmit
}) {

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                backdrop-blur-sm
                p-4
            "
            onMouseDown={(e) => {

                if (
                    e.target ===
                    e.currentTarget &&
                    !saving
                ) {
                    onClose();
                }

            }}
        >

            <div
                className="
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    w-full
                    max-w-lg
                    overflow-hidden
                "
            >

                {/* HEADER */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        px-6
                        py-5
                        border-b
                        border-gray-100
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

                            <Plus
                                size={21}
                            />

                        </div>


                        <div>

                            <h2
                                className="
                                    text-xl
                                    font-black
                                    text-gray-900
                                "
                            >
                                إضافة مصروف
                            </h2>

                            <p
                                className="
                                    text-xs
                                    text-gray-400
                                    mt-1
                                "
                            >
                                تسجيل مصروف جديد
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        disabled={
                            saving
                        }
                        className="
                            w-9
                            h-9
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            text-gray-400
                            hover:bg-red-50
                            hover:text-red-500
                            transition
                            disabled:opacity-40
                        "
                    >

                        <X
                            size={20}
                        />

                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={
                        onSubmit
                    }
                    className="
                        p-6
                        space-y-5
                    "
                >

                    <div>

                        <label
                            className="
                                block
                                text-sm
                                font-black
                                text-gray-700
                                mb-2
                            "
                        >
                            عنوان المصروف
                        </label>


                        <input
                            type="text"
                            name="title"
                            value={
                                formData.title
                            }
                            onChange={
                                onChange
                            }
                            placeholder="
                                مثال: فاتورة الكهرباء
                            "
                            disabled={
                                saving
                            }
                            className="
                                w-full
                                border
                                border-gray-200
                                rounded-xl
                                px-4
                                py-3
                                outline-none
                                transition
                                focus:border-[#5B2A86]
                                focus:ring-2
                                focus:ring-purple-100
                                disabled:bg-gray-50
                            "
                        />

                    </div>


                    <div>

                        <label
                            className="
                                block
                                text-sm
                                font-black
                                text-gray-700
                                mb-2
                            "
                        >
                            التصنيف
                        </label>


                        <select
                            name="category"
                            value={
                                formData.category
                            }
                            onChange={
                                onChange
                            }
                            disabled={
                                saving
                            }
                            className="
                                w-full
                                border
                                border-gray-200
                                rounded-xl
                                px-4
                                py-3
                                bg-white
                                outline-none
                                transition
                                focus:border-[#5B2A86]
                                focus:ring-2
                                focus:ring-purple-100
                            "
                        >

                            <option value="RENT">
                                إيجار
                            </option>

                            <option value="SALARY">
                                رواتب
                            </option>

                            <option value="UTILITIES">
                                فواتير
                            </option>

                            <option value="SUPPLIES">
                                مستلزمات
                            </option>

                            <option value="OTHER">
                                أخرى
                            </option>

                        </select>

                    </div>


                    <div>

                        <label
                            className="
                                block
                                text-sm
                                font-black
                                text-gray-700
                                mb-2
                            "
                        >
                            المبلغ
                        </label>


                        <div
                            className="
                                relative
                            "
                        >

                            <input
                                type="number"
                                name="amount"
                                value={
                                    formData.amount
                                }
                                onChange={
                                    onChange
                                }
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                disabled={
                                    saving
                                }
                                className="
                                    w-full
                                    border
                                    border-gray-200
                                    rounded-xl
                                    px-4
                                    py-3
                                    pl-16
                                    outline-none
                                    transition
                                    focus:border-[#5B2A86]
                                    focus:ring-2
                                    focus:ring-purple-100
                                    disabled:bg-gray-50
                                "
                            />


                            <span
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-sm
                                    font-bold
                                    text-gray-400
                                "
                            >
                                جنيه
                            </span>

                        </div>

                    </div>


                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                            pt-5
                            border-t
                            border-gray-100
                        "
                    >

                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            disabled={
                                saving
                            }
                            className="
                                px-5
                                py-2.5
                                rounded-xl
                                bg-gray-100
                                hover:bg-gray-200
                                font-bold
                                transition
                                disabled:opacity-50
                            "
                        >
                            إلغاء
                        </button>


                        <PrimaryButton
                            type="submit"
                            disabled={
                                saving
                            }
                        >

                            {saving
                                ? "جاري الحفظ..."
                                : "حفظ المصروف"
                            }

                        </PrimaryButton>

                    </div>

                </form>

            </div>

        </div>

    );

}


// ======================================================
// HELPERS
// ======================================================

function getCategoryConfig(
    category
) {

    return (
        CATEGORY_CONFIG[
        category
        ] ||
        CATEGORY_CONFIG.OTHER
    );

}


function getCategoryLabel(
    category
) {

    return getCategoryConfig(
        category
    ).label;

}


function money(
    value
) {

    return Number(
        value || 0
    ).toLocaleString(
        "ar-EG",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


function formatDate(
    value
) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "-";
    }


    return date.toLocaleDateString(
        "ar-EG",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}