import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowRight,
    Receipt,
    User,
    CalendarDays,
    Package,
    Printer,
    Wallet,
    TrendingUp,
    Percent,
    Hash,
    CreditCard,
    Store,
    FileText,
    CheckCircle2,
    Clock3,
    XCircle,
    RotateCcw,
    CircleDollarSign
} from "lucide-react";

import { getSaleDetails } from "../../../services/sales/salesService";

import PageHeader from "../../../components/ui/layout/PageHeader";
import Loading from "../../../components/ui/feedback/Loading";

import toast from "react-hot-toast";


export default function SaleDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [sale, setSale] = useState(null);
    const [loading, setLoading] = useState(true);


    // =========================================================
    // LOAD SALE
    // =========================================================

    useEffect(() => {

        const loadSale = async () => {

            try {

                setLoading(true);

                const data = await getSaleDetails(id);

                setSale(data);

            } catch (error) {

                console.error(
                    "SALE DETAILS ERROR:",
                    error
                );

                toast.error(
                    "فشل تحميل تفاصيل الفاتورة"
                );

            } finally {

                setLoading(false);

            }

        };

        loadSale();

    }, [id]);


    // =========================================================
    // HELPERS
    // =========================================================

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
                    className:
                        "bg-emerald-50 text-emerald-700 border-emerald-200",
                    icon: CheckCircle2
                };


            case "PENDING":

                return {
                    text: "معلقة",
                    className:
                        "bg-amber-50 text-amber-700 border-amber-200",
                    icon: Clock3
                };


            case "CANCELLED":

                return {
                    text: "ملغاة",
                    className:
                        "bg-red-50 text-red-700 border-red-200",
                    icon: XCircle
                };


            case "RETURNED":

                return {
                    text: "مرتجعة",
                    className:
                        "bg-purple-50 text-purple-700 border-purple-200",
                    icon: RotateCcw
                };


            default:

                return {
                    text: status || "-",
                    className:
                        "bg-gray-50 text-gray-700 border-gray-200",
                    icon: Receipt
                };

        }

    };


    // =========================================================
    // CALCULATIONS
    // =========================================================

    const calculations = useMemo(() => {

        if (!sale) {

            return {
                totalCost: 0,
                grossProfit: 0,
                margin: 0,
                itemsCount: 0,
                quantity: 0
            };

        }


        const items = Array.isArray(sale.items)
            ? sale.items
            : [];


        const totalCost = items.reduce(
            (sum, item) => {

                const cost =
                    Number(item.cost_price || 0);

                const quantity =
                    Number(item.quantity || 0);

                return sum + (cost * quantity);

            },
            0
        );


        const finalAmount =
            Number(sale.final_amount || 0);


        const grossProfit =
            finalAmount - totalCost;


        const margin =
            finalAmount > 0
                ? (grossProfit / finalAmount) * 100
                : 0;


        const quantity =
            items.reduce(
                (sum, item) =>
                    sum + Number(item.quantity || 0),
                0
            );


        return {

            totalCost,

            grossProfit,

            margin,

            itemsCount: items.length,

            quantity

        };

    }, [sale]);


    // =========================================================
    // PRINT
    // =========================================================

    const handlePrint = () => {

        window.print();

    };


    // =========================================================
    // LOADING
    // =========================================================

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


    // =========================================================
    // NOT FOUND
    // =========================================================

    if (!sale) {

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
                        border
                        shadow-sm
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
                            mx-auto
                            rounded-2xl
                            bg-red-50
                            text-red-500
                            flex
                            items-center
                            justify-center
                            mb-5
                        "
                    >

                        <Receipt size={30} />

                    </div>


                    <h2
                        className="
                            text-xl
                            font-black
                            text-gray-800
                        "
                    >

                        لم يتم العثور على الفاتورة

                    </h2>


                    <p
                        className="
                            text-gray-500
                            mt-2
                        "
                    >

                        ربما تم حذف الفاتورة أو أن الرقم غير صحيح.

                    </p>


                    <button
                        onClick={() =>
                            navigate("/admin/sales")
                        }
                        className="
                            mt-6
                            px-6
                            py-3
                            rounded-xl
                            bg-[#5B2A86]
                            text-white
                            font-bold
                            hover:bg-[#4a216d]
                            transition
                        "
                    >

                        العودة للمبيعات

                    </button>

                </div>

            </div>

        );

    }


    const status = getStatus(
        sale.status
    );

    const StatusIcon = status.icon;


    return (

        <div
            dir="rtl"
            className="
                space-y-6
                pb-10
            "
        >

            {/* =====================================================
                TOP HEADER
            ===================================================== */}

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

                    <button
                        onClick={() =>
                            navigate("/admin/sales")
                        }
                        className="
                            flex
                            items-center
                            gap-2
                            text-gray-500
                            hover:text-[#5B2A86]
                            transition
                            mb-4
                            font-semibold
                        "
                    >

                        <ArrowRight size={18} />

                        العودة للمبيعات

                    </button>


                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-3
                        "
                    >

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

                            <Receipt size={24} />

                        </div>


                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    flex-wrap
                                "
                            >

                                <h1
                                    className="
                                        text-2xl
                                        md:text-3xl
                                        font-black
                                        text-gray-900
                                    "
                                >

                                    فاتورة #{sale.id}

                                </h1>


                                <span
                                    className={`
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        px-3
                                        py-1.5
                                        rounded-full
                                        border
                                        text-sm
                                        font-bold
                                        ${status.className}
                                    `}
                                >

                                    <StatusIcon size={15} />

                                    {status.text}

                                </span>

                            </div>


                            <p
                                className="
                                    text-gray-500
                                    mt-1
                                "
                            >

                                تفاصيل عملية البيع والفاتورة

                            </p>

                        </div>

                    </div>

                </div>


                {/* ACTIONS */}

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <button
                        onClick={handlePrint}
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
                            font-bold
                            hover:bg-gray-50
                            hover:border-gray-300
                            transition
                            shadow-sm
                        "
                    >

                        <Printer size={18} />

                        طباعة الفاتورة

                    </button>

                </div>

            </div>


            {/* =====================================================
                INVOICE META
            ===================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-4
                "
            >

                <InfoCard
                    icon={Hash}
                    label="رقم الفاتورة"
                    value={`#${sale.id}`}
                    iconClass="bg-purple-50 text-[#5B2A86]"
                />


                <InfoCard
                    icon={User}
                    label="العميل"
                    value={
                        sale.customer_name ||
                        "عميل نقدي"
                    }
                    iconClass="bg-blue-50 text-blue-600"
                />


                <InfoCard
                    icon={User}
                    label="الكاشير"
                    value={
                        sale.cashier?.username ||
                        sale.cashier ||
                        "-"
                    }
                    iconClass="bg-indigo-50 text-indigo-600"
                />


                <InfoCard
                    icon={CalendarDays}
                    label="تاريخ البيع"
                    value={formatDate(sale.created_at)}
                    iconClass="bg-orange-50 text-orange-600"
                />

            </div>


            {/* =====================================================
                QUICK FINANCIAL OVERVIEW
            ===================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-4
                "
            >

                <FinancialCard
                    icon={CircleDollarSign}
                    label="إجمالي الفاتورة"
                    value={`${money(sale.total_amount)} جنيه`}
                    iconClass="bg-blue-50 text-blue-600"
                />


                <FinancialCard
                    icon={Percent}
                    label="الخصم"
                    value={`${money(sale.discount)} جنيه`}
                    iconClass="bg-red-50 text-red-600"
                    valueClass="text-red-600"
                />


                <FinancialCard
                    icon={Wallet}
                    label="صافي البيع"
                    value={`${money(sale.final_amount)} جنيه`}
                    iconClass="bg-purple-50 text-[#5B2A86]"
                    valueClass="text-[#5B2A86]"
                />


                <FinancialCard
                    icon={TrendingUp}
                    label="الربح التقديري"
                    value={`${money(calculations.grossProfit)} جنيه`}
                    iconClass={
                        calculations.grossProfit >= 0
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                    }
                    valueClass={
                        calculations.grossProfit >= 0
                            ? "text-emerald-600"
                            : "text-red-600"
                    }
                />

            </div>


            {/* =====================================================
                CUSTOMER + PAYMENT
            ===================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    xl:grid-cols-3
                    gap-6
                "
            >

                {/* CUSTOMER */}

                <div
                    className="
                        xl:col-span-2
                        bg-white
                        rounded-3xl
                        border
                        border-gray-100
                        shadow-sm
                        overflow-hidden
                    "
                >

                    <div
                        className="
                            px-6
                            py-5
                            border-b
                            border-gray-100
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
                                bg-blue-50
                                text-blue-600
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <User size={20} />

                        </div>


                        <div>

                            <h2
                                className="
                                    font-black
                                    text-lg
                                "
                            >

                                بيانات العميل

                            </h2>

                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >

                                معلومات صاحب الفاتورة

                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            p-6
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-5
                        "
                    >

                        <DetailRow
                            label="اسم العميل"
                            value={
                                sale.customer_name ||
                                "عميل نقدي"
                            }
                        />


                        <DetailRow
                            label="الكاشير"
                            value={
                                sale.cashier?.username ||
                                sale.cashier ||
                                "-"
                            }
                        />


                        <DetailRow
                            label="رقم الفاتورة"
                            value={`#${sale.id}`}
                        />


                        <DetailRow
                            label="تاريخ العملية"
                            value={formatDate(
                                sale.created_at
                            )}
                        />

                    </div>

                </div>


                {/* SALE SUMMARY */}

                <div
                    className="
                        bg-[#5B2A86]
                        rounded-3xl
                        text-white
                        p-6
                        shadow-xl
                        shadow-purple-100
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
                                bg-white/15
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <CreditCard size={22} />

                        </div>


                        <div>

                            <p className="text-white/70 text-sm">

                                ملخص الفاتورة

                            </p>

                            <h3 className="font-black text-xl">

                                الحساب النهائي

                            </h3>

                        </div>

                    </div>


                    <div className="space-y-4">

                        <SummaryRow
                            label="الإجمالي"
                            value={`${money(sale.total_amount)} جنيه`}
                        />


                        <SummaryRow
                            label="الخصم"
                            value={`- ${money(sale.discount)} جنيه`}
                            valueClass="text-red-200"
                        />


                        <div
                            className="
                                border-t
                                border-white/20
                                pt-4
                            "
                        >

                            <SummaryRow
                                label="الصافي"
                                value={`${money(sale.final_amount)} جنيه`}
                                valueClass="text-xl"
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                PRODUCTS
            ===================================================== */}

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

                <div
                    className="
                        px-6
                        py-5
                        border-b
                        border-gray-100
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

                            <Package size={21} />

                        </div>


                        <div>

                            <h2
                                className="
                                    font-black
                                    text-xl
                                "
                            >

                                المنتجات

                            </h2>


                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >

                                {calculations.itemsCount} أصناف
                                {" · "}
                                {calculations.quantity} وحدة

                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                            bg-gray-50
                            px-4
                            py-2
                            rounded-xl
                        "
                    >

                        <Store size={16} />

                        تفاصيل الأصناف المباعة

                    </div>

                </div>


                {!sale.items ||
                    sale.items.length === 0 ? (

                    <div
                        className="
                            py-16
                            text-center
                            text-gray-500
                        "
                    >

                        <Package
                            size={45}
                            className="
                                mx-auto
                                mb-4
                                opacity-30
                            "
                        />

                        <p className="font-bold">

                            لا توجد منتجات في الفاتورة

                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

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
                                            text-right
                                            text-sm
                                            font-black
                                            text-gray-600
                                        "
                                    >

                                        المنتج

                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-center
                                            text-sm
                                            font-black
                                            text-gray-600
                                        "
                                    >

                                        الكمية

                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-right
                                            text-sm
                                            font-black
                                            text-gray-600
                                        "
                                    >

                                        سعر الوحدة

                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-right
                                            text-sm
                                            font-black
                                            text-gray-600
                                        "
                                    >

                                        تكلفة الوحدة

                                    </th>


                                    <th
                                        className="
                                            px-6
                                            py-4
                                            text-right
                                            text-sm
                                            font-black
                                            text-gray-600
                                        "
                                    >

                                        الإجمالي

                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {sale.items.map(
                                    (item, index) => {

                                        const quantity =
                                            Number(
                                                item.quantity || 0
                                            );

                                        const price =
                                            Number(
                                                item.price || 0
                                            );

                                        const cost =
                                            Number(
                                                item.cost_price || 0
                                            );

                                        const itemTotal =
                                            Number(
                                                item.total ??
                                                price * quantity
                                            );

                                        const itemProfit =
                                            itemTotal -
                                            (cost * quantity);


                                        return (

                                            <tr
                                                key={
                                                    item.id ||
                                                    index
                                                }
                                                className="
                                                    border-b
                                                    last:border-0
                                                    hover:bg-gray-50/70
                                                    transition
                                                "
                                            >

                                                {/* PRODUCT */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
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
                                                                shrink-0
                                                            "
                                                        >

                                                            <Package
                                                                size={19}
                                                            />

                                                        </div>


                                                        <div>

                                                            <p
                                                                className="
                                                                    font-black
                                                                    text-gray-800
                                                                "
                                                            >

                                                                {
                                                                    item.product_name ||
                                                                    item.product?.name ||
                                                                    `منتج #${item.product}`
                                                                }

                                                            </p>


                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-gray-400
                                                                    mt-1
                                                                "
                                                            >

                                                                صنف #
                                                                {
                                                                    item.product
                                                                }

                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* QUANTITY */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                        text-center
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            inline-flex
                                                            min-w-[42px]
                                                            justify-center
                                                            px-3
                                                            py-1.5
                                                            rounded-lg
                                                            bg-gray-100
                                                            font-black
                                                        "
                                                    >

                                                        {quantity}

                                                    </span>

                                                </td>


                                                {/* PRICE */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                        font-semibold
                                                    "
                                                >

                                                    {money(price)}

                                                    <span
                                                        className="
                                                            text-xs
                                                            text-gray-400
                                                            mr-1
                                                        "
                                                    >

                                                        جنيه

                                                    </span>

                                                </td>


                                                {/* COST */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                        text-gray-500
                                                    "
                                                >

                                                    {money(cost)}

                                                    <span
                                                        className="
                                                            text-xs
                                                            text-gray-400
                                                            mr-1
                                                        "
                                                    >

                                                        جنيه

                                                    </span>

                                                </td>


                                                {/* TOTAL */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-5
                                                    "
                                                >

                                                    <div>

                                                        <p
                                                            className="
                                                                font-black
                                                                text-[#5B2A86]
                                                            "
                                                        >

                                                            {money(itemTotal)}
                                                            {" "}
                                                            جنيه

                                                        </p>


                                                        <p
                                                            className={`
                                                                text-xs
                                                                mt-1
                                                                font-semibold
                                                                ${itemProfit >= 0
                                                                    ? "text-emerald-600"
                                                                    : "text-red-600"
                                                                }
                                                            `}
                                                        >

                                                            ربح:
                                                            {" "}
                                                            {money(itemProfit)}
                                                            {" "}
                                                            جنيه

                                                        </p>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* =====================================================
                PROFIT + TOTAL
            ===================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-6
                "
            >

                {/* PROFIT CARD */}

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
                                bg-emerald-50
                                text-emerald-600
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <TrendingUp size={21} />

                        </div>


                        <div>

                            <h2
                                className="
                                    font-black
                                    text-lg
                                "
                            >

                                تحليل الربحية

                            </h2>


                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >

                                تحليل أداء هذه العملية

                            </p>

                        </div>

                    </div>


                    <div className="space-y-4">

                        <ProfitRow
                            label="تكلفة المنتجات"
                            value={`${money(calculations.totalCost)} جنيه`}
                        />


                        <ProfitRow
                            label="صافي المبيعات"
                            value={`${money(sale.final_amount)} جنيه`}
                        />


                        <div
                            className="
                                border-t
                                pt-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <span
                                    className="
                                        font-bold
                                        text-gray-700
                                    "
                                >

                                    صافي الربح

                                </span>


                                <span
                                    className={`
                                        text-xl
                                        font-black
                                        ${calculations.grossProfit >= 0
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                        }
                                    `}
                                >

                                    {money(
                                        calculations.grossProfit
                                    )}
                                    {" "}
                                    جنيه

                                </span>

                            </div>

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                bg-gray-50
                                rounded-xl
                                px-4
                                py-3
                            "
                        >

                            <span
                                className="
                                    text-gray-600
                                    font-semibold
                                "
                            >

                                هامش الربح

                            </span>


                            <span
                                className="
                                    font-black
                                    text-[#5B2A86]
                                "
                            >

                                {calculations.margin.toFixed(1)}%

                            </span>

                        </div>

                    </div>

                </div>


                {/* FINAL TOTAL */}

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

                            <Receipt size={21} />

                        </div>


                        <div>

                            <h2
                                className="
                                    font-black
                                    text-lg
                                "
                            >

                                ملخص الدفع

                            </h2>


                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >

                                تفاصيل القيمة المالية

                            </p>

                        </div>

                    </div>


                    <div className="space-y-4">

                        <SummaryLine
                            label="الإجمالي قبل الخصم"
                            value={`${money(sale.total_amount)} جنيه`}
                        />


                        <SummaryLine
                            label="الخصم"
                            value={`- ${money(sale.discount)} جنيه`}
                            valueClass="text-red-600"
                        />


                        <div
                            className="
                                border-t
                                pt-5
                                mt-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-end
                                    justify-between
                                    gap-4
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-sm
                                            text-gray-500
                                            mb-1
                                        "
                                    >

                                        المبلغ المستحق

                                    </p>


                                    <p
                                        className="
                                            text-3xl
                                            font-black
                                            text-[#5B2A86]
                                        "
                                    >

                                        {money(
                                            sale.final_amount
                                        )}

                                        <span
                                            className="
                                                text-sm
                                                mr-1
                                            "
                                        >

                                            جنيه

                                        </span>

                                    </p>

                                </div>


                                <div
                                    className="
                                        w-12
                                        h-12
                                        rounded-xl
                                        bg-purple-50
                                        text-[#5B2A86]
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <Wallet size={23} />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
                NOTES
            ===================================================== */}

            {sale.notes && (

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
                            items-center
                            gap-3
                            mb-4
                        "
                    >

                        <div
                            className="
                                w-10
                                h-10
                                rounded-xl
                                bg-gray-100
                                text-gray-600
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <FileText size={19} />

                        </div>


                        <h2
                            className="
                                font-black
                                text-lg
                            "
                        >

                            ملاحظات

                        </h2>

                    </div>


                    <div
                        className="
                            bg-gray-50
                            rounded-2xl
                            p-4
                            text-gray-600
                            leading-7
                        "
                    >

                        {sale.notes}

                    </div>

                </div>

            )}


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <div
                className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-4
                    text-sm
                    text-gray-400
                    px-2
                "
            >

                <p>

                    رقم الفاتورة: #{sale.id}

                </p>


                <p>

                    تم إنشاء الفاتورة في{" "}
                    {formatDate(sale.created_at)}

                </p>

            </div>

        </div>

    );

}


// =========================================================
// INFO CARD
// =========================================================

function InfoCard({
    icon: Icon,
    label,
    value,
    iconClass
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
                    items-center
                    gap-4
                "
            >

                <div
                    className={`
                        w-11
                        h-11
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        shrink-0
                        ${iconClass}
                    `}
                >

                    <Icon size={20} />

                </div>


                <div className="min-w-0">

                    <p
                        className="
                            text-xs
                            text-gray-500
                            mb-1
                        "
                    >

                        {label}

                    </p>


                    <p
                        className="
                            font-black
                            text-gray-800
                            truncate
                        "
                        title={value}
                    >

                        {value}

                    </p>

                </div>

            </div>

        </div>

    );

}


// =========================================================
// FINANCIAL CARD
// =========================================================

function FinancialCard({
    icon: Icon,
    label,
    value,
    iconClass,
    valueClass = "text-gray-900"
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
                            text-sm
                            text-gray-500
                        "
                    >

                        {label}

                    </p>


                    <p
                        className={`
                            text-xl
                            font-black
                            mt-2
                            ${valueClass}
                        `}
                    >

                        {value}

                    </p>

                </div>


                <div
                    className={`
                        w-12
                        h-12
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        shrink-0
                        ${iconClass}
                    `}
                >

                    <Icon size={22} />

                </div>

            </div>

        </div>

    );

}


// =========================================================
// DETAIL ROW
// =========================================================

function DetailRow({
    label,
    value
}) {

    return (

        <div
            className="
                bg-gray-50
                rounded-xl
                px-4
                py-3
            "
        >

            <p
                className="
                    text-xs
                    text-gray-500
                    mb-1
                "
            >

                {label}

            </p>


            <p
                className="
                    font-bold
                    text-gray-800
                "
            >

                {value}

            </p>

        </div>

    );

}


// =========================================================
// SUMMARY ROW
// =========================================================

function SummaryRow({
    label,
    value,
    valueClass = ""
}) {

    return (

        <div
            className="
                flex
                items-center
                justify-between
                gap-4
            "
        >

            <span className="text-white/75">

                {label}

            </span>


            <span
                className={`
                    font-black
                    ${valueClass}
                `}
            >

                {value}

            </span>

        </div>

    );

}


// =========================================================
// PROFIT ROW
// =========================================================

function ProfitRow({
    label,
    value
}) {

    return (

        <div
            className="
                flex
                items-center
                justify-between
                gap-4
            "
        >

            <span
                className="
                    text-gray-500
                    font-semibold
                "
            >

                {label}

            </span>


            <span
                className="
                    font-bold
                    text-gray-800
                "
            >

                {value}

            </span>

        </div>

    );

}


// =========================================================
// SUMMARY LINE
// =========================================================

function SummaryLine({
    label,
    value,
    valueClass = "text-gray-800"
}) {

    return (

        <div
            className="
                flex
                items-center
                justify-between
                gap-4
            "
        >

            <span
                className="
                    text-gray-500
                    font-semibold
                "
            >

                {label}

            </span>


            <span
                className={`
                    font-black
                    ${valueClass}
                `}
            >

                {value}

            </span>

        </div>

    );

}