import { useEffect, useMemo, useState } from "react";

import PageHeader from "../../../components/ui/layout/PageHeader";
import Card from "../../../components/ui/cards/Card";
import SearchBox from "../../../components/ui/forms/SearchBox";
import Loading from "../../../components/ui/feedback/Loading";
import EmptyState from "../../../components/ui/feedback/EmptyState";

import AddPurchaseModal from "../../../components/admin/purchases/AddPurchaseModal";

import {
    getPurchases,
    receivePurchase,
    cancelPurchase
} from "../../../services/purchases/purchaseService";

import toast from "react-hot-toast";


const statusLabels = {
    DRAFT: "مسودة",
    ORDERED: "تم الطلب",
    RECEIVED: "تم الاستلام",
    CANCELLED: "ملغاة",
};


export default function Purchases() {

    const [purchases, setPurchases] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [openAddModal, setOpenAddModal] = useState(false);

    const [actionLoading, setActionLoading] = useState(null);


    // =========================
    // LOAD PURCHASES
    // =========================

    const loadPurchases = async () => {

        try {

            setLoading(true);

            const data = await getPurchases();

            setPurchases(
                Array.isArray(data)
                    ? data
                    : data?.results || []
            );

        } catch (error) {

            console.error(
                "PURCHASES ERROR:",
                error
            );

            setPurchases([]);

            toast.error(
                "فشل تحميل المشتريات"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadPurchases();

    }, []);


    // =========================
    // SEARCH + FILTER
    // =========================

    const filteredPurchases = useMemo(() => {

        const query =
            search.trim().toLowerCase();


        return purchases.filter((purchase) => {

            const id =
                String(
                    purchase.id || ""
                ).toLowerCase();


            const supplier =
                String(
                    purchase.supplier_name ||
                    purchase.supplier?.name ||
                    ""
                ).toLowerCase();


            const matchesSearch =
                !query ||
                id.includes(query) ||
                supplier.includes(query);


            const matchesStatus =
                !statusFilter ||
                purchase.status === statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        purchases,
        search,
        statusFilter
    ]);


    // =========================
    // STATISTICS
    // =========================

    const totalPurchases =
        purchases.length;


    const draftPurchases =
        purchases.filter(
            (purchase) =>
                purchase.status === "DRAFT"
        ).length;


    const orderedPurchases =
        purchases.filter(
            (purchase) =>
                purchase.status === "ORDERED"
        ).length;


    const receivedPurchases =
        purchases.filter(
            (purchase) =>
                purchase.status === "RECEIVED"
        ).length;


    const cancelledPurchases =
        purchases.filter(
            (purchase) =>
                purchase.status === "CANCELLED"
        ).length;


    // =========================
    // RECEIVE PURCHASE
    // =========================

    const handleReceive = async (purchase) => {

        const confirmed =
            window.confirm(
                `هل تريد استلام فاتورة الشراء رقم PO-${purchase.id}؟`
            );


        if (!confirmed) {

            return;

        }


        try {

            setActionLoading(
                `receive-${purchase.id}`
            );


            await receivePurchase(
                purchase.id
            );


            toast.success(
                "تم استلام المشتريات وتحديث المخزون"
            );


            await loadPurchases();

        } catch (error) {

            console.error(
                "RECEIVE PURCHASE ERROR:",
                error
            );


            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                "فشل استلام المشتريات";


            toast.error(message);

        } finally {

            setActionLoading(null);

        }

    };


    // =========================
    // CANCEL PURCHASE
    // =========================

    const handleCancel = async (purchase) => {

        const confirmed =
            window.confirm(
                `هل تريد إلغاء فاتورة الشراء رقم PO-${purchase.id}؟`
            );


        if (!confirmed) {

            return;

        }


        try {

            setActionLoading(
                `cancel-${purchase.id}`
            );


            await cancelPurchase(
                purchase.id
            );


            toast.success(
                "تم إلغاء فاتورة الشراء"
            );


            await loadPurchases();

        } catch (error) {

            console.error(
                "CANCEL PURCHASE ERROR:",
                error
            );


            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                "فشل إلغاء فاتورة الشراء";


            toast.error(message);

        } finally {

            setActionLoading(null);

        }

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return <Loading />;

    }


    // =========================
    // PAGE
    // =========================

    return (

        <div
            className="space-y-6"
            dir="rtl"
        >


            {/* =========================
                HEADER
            ========================= */}

            <PageHeader
                title="المشتريات"
                subtitle="إدارة فواتير المشتريات والموردين"
                action={

                    <button
                        type="button"
                        onClick={() =>
                            setOpenAddModal(true)
                        }
                        className="
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

                        + إضافة فاتورة شراء

                    </button>

                }
            />


            {/* =========================
                STATISTICS
            ========================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-5
                    gap-4
                "
            >

                <StatCard
                    title="إجمالي الفواتير"
                    value={totalPurchases}
                />


                <StatCard
                    title="مسودات"
                    value={draftPurchases}
                    valueClass="text-gray-600"
                />


                <StatCard
                    title="تم الطلب"
                    value={orderedPurchases}
                    valueClass="text-blue-600"
                />


                <StatCard
                    title="تم الاستلام"
                    value={receivedPurchases}
                    valueClass="text-green-600"
                />


                <StatCard
                    title="ملغاة"
                    value={cancelledPurchases}
                    valueClass="text-red-600"
                />

            </div>


            {/* =========================
                SEARCH + FILTER
            ========================= */}

            <Card>

                <div
                    className="
                        p-4
                        flex
                        gap-4
                        flex-wrap
                        items-center
                    "
                >

                    <div
                        className="
                            flex-1
                            min-w-[250px]
                        "
                    >

                        <SearchBox
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="بحث برقم الفاتورة أو المورد..."
                        />

                    </div>


                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                        className="
                            border
                            rounded-xl
                            px-4
                            py-3
                            bg-white
                            outline-none
                            min-w-[180px]
                        "
                    >

                        <option value="">
                            كل الحالات
                        </option>

                        <option value="DRAFT">
                            مسودة
                        </option>

                        <option value="ORDERED">
                            تم الطلب
                        </option>

                        <option value="RECEIVED">
                            تم الاستلام
                        </option>

                        <option value="CANCELLED">
                            ملغاة
                        </option>

                    </select>

                </div>

            </Card>


            {/* =========================
                PURCHASES TABLE
            ========================= */}

            <Card>

                {
                    filteredPurchases.length === 0 ? (

                        <div className="p-8">

                            <EmptyState
                                title="لا توجد مشتريات"
                                description="لم يتم العثور على فواتير شراء."
                            />

                        </div>

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
                                "
                            >

                                <thead>

                                    <tr
                                        className="
                                            border-b
                                            bg-gray-50
                                        "
                                    >

                                        <th className="p-4">
                                            رقم الفاتورة
                                        </th>

                                        <th className="p-4">
                                            المورد
                                        </th>

                                        <th className="p-4">
                                            الأصناف
                                        </th>

                                        <th className="p-4">
                                            الإجمالي
                                        </th>

                                        <th className="p-4">
                                            الحالة
                                        </th>

                                        <th className="p-4">
                                            التاريخ
                                        </th>

                                        <th className="p-4">
                                            الإجراءات
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {
                                        filteredPurchases.map(
                                            (purchase) => {

                                                const itemsCount =
                                                    purchase.items?.length ??
                                                    purchase.items_count ??
                                                    0;


                                                const supplierName =
                                                    purchase.supplier_name ||
                                                    purchase.supplier?.name ||
                                                    `مورد #${purchase.supplier}`;


                                                const isReceiving =
                                                    actionLoading ===
                                                    `receive-${purchase.id}`;


                                                const isCancelling =
                                                    actionLoading ===
                                                    `cancel-${purchase.id}`;


                                                const canReceive =
                                                    purchase.status ===
                                                    "DRAFT" ||
                                                    purchase.status ===
                                                    "ORDERED";


                                                const canCancel =
                                                    purchase.status ===
                                                    "DRAFT" ||
                                                    purchase.status ===
                                                    "ORDERED";


                                                return (

                                                    <tr
                                                        key={purchase.id}
                                                        className="
                                                            border-b
                                                            hover:bg-gray-50
                                                            transition
                                                        "
                                                    >

                                                        {/* INVOICE NUMBER */}

                                                        <td
                                                            className="
                                                                p-4
                                                                font-bold
                                                            "
                                                        >

                                                            PO-
                                                            {purchase.id}

                                                        </td>


                                                        {/* SUPPLIER */}

                                                        <td className="p-4">

                                                            {
                                                                supplierName
                                                            }

                                                        </td>


                                                        {/* ITEMS */}

                                                        <td className="p-4">

                                                            {
                                                                itemsCount
                                                            }

                                                        </td>


                                                        {/* TOTAL */}

                                                        <td
                                                            className="
                                                                p-4
                                                                font-bold
                                                            "
                                                        >

                                                            {
                                                                Number(
                                                                    purchase.total_amount ||
                                                                    0
                                                                ).toLocaleString(
                                                                    "ar-EG",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2
                                                                    }
                                                                )
                                                            }

                                                        </td>


                                                        {/* STATUS */}

                                                        <td className="p-4">

                                                            <StatusBadge
                                                                status={
                                                                    purchase.status
                                                                }
                                                            />

                                                        </td>


                                                        {/* DATE */}

                                                        <td className="p-4">

                                                            {
                                                                purchase.created_at
                                                                    ? new Date(
                                                                        purchase.created_at
                                                                    ).toLocaleDateString(
                                                                        "ar-EG"
                                                                    )
                                                                    : "-"
                                                            }

                                                        </td>


                                                        {/* ACTIONS */}

                                                        <td className="p-4">

                                                            <div
                                                                className="
                                                                    flex
                                                                    gap-2
                                                                    flex-wrap
                                                                "
                                                            >

                                                                {
                                                                    canReceive && (

                                                                        <button
                                                                            type="button"
                                                                            disabled={
                                                                                isReceiving ||
                                                                                isCancelling
                                                                            }
                                                                            onClick={() =>
                                                                                handleReceive(
                                                                                    purchase
                                                                                )
                                                                            }
                                                                            className="
                                                                                px-3
                                                                                py-1.5
                                                                                rounded-lg
                                                                                bg-green-100
                                                                                text-green-700
                                                                                font-bold
                                                                                text-sm
                                                                                hover:bg-green-200
                                                                                transition
                                                                                disabled:opacity-50
                                                                                disabled:cursor-not-allowed
                                                                            "
                                                                        >

                                                                            {
                                                                                isReceiving
                                                                                    ? "جاري..."
                                                                                    : "استلام"
                                                                            }

                                                                        </button>

                                                                    )
                                                                }


                                                                {
                                                                    canCancel && (

                                                                        <button
                                                                            type="button"
                                                                            disabled={
                                                                                isCancelling ||
                                                                                isReceiving
                                                                            }
                                                                            onClick={() =>
                                                                                handleCancel(
                                                                                    purchase
                                                                                )
                                                                            }
                                                                            className="
                                                                                px-3
                                                                                py-1.5
                                                                                rounded-lg
                                                                                bg-red-100
                                                                                text-red-700
                                                                                font-bold
                                                                                text-sm
                                                                                hover:bg-red-200
                                                                                transition
                                                                                disabled:opacity-50
                                                                                disabled:cursor-not-allowed
                                                                            "
                                                                        >

                                                                            {
                                                                                isCancelling
                                                                                    ? "جاري..."
                                                                                    : "إلغاء"
                                                                            }

                                                                        </button>

                                                                    )
                                                                }


                                                                {
                                                                    !canReceive &&
                                                                    !canCancel && (

                                                                        <span
                                                                            className="
                                                                                text-sm
                                                                                text-gray-400
                                                                            "
                                                                        >

                                                                            لا توجد إجراءات

                                                                        </span>

                                                                    )
                                                                }

                                                            </div>

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )
                                    }

                                </tbody>

                            </table>

                        </div>

                    )
                }

            </Card>


            {/* =========================
                ADD PURCHASE MODAL
            ========================= */}

            <AddPurchaseModal
                open={openAddModal}
                onClose={() =>
                    setOpenAddModal(false)
                }
                onSuccess={loadPurchases}
            />

        </div>

    );

}


// =========================
// STAT CARD
// =========================

function StatCard({
    title,
    value,
    valueClass = ""
}) {

    return (

        <Card>

            <div className="p-5">

                <p
                    className="
                        text-sm
                        text-gray-500
                    "
                >

                    {title}

                </p>


                <p
                    className={`
                        text-3xl
                        font-black
                        mt-2
                        ${valueClass}
                    `}
                >

                    {value}

                </p>

            </div>

        </Card>

    );

}


// =========================
// STATUS BADGE
// =========================

function StatusBadge({
    status
}) {

    const config = {

        DRAFT: {
            label: "مسودة",
            className:
                "bg-gray-100 text-gray-700"
        },

        ORDERED: {
            label: "تم الطلب",
            className:
                "bg-blue-100 text-blue-700"
        },

        RECEIVED: {
            label: "تم الاستلام",
            className:
                "bg-green-100 text-green-700"
        },

        CANCELLED: {
            label: "ملغاة",
            className:
                "bg-red-100 text-red-700"
        },

    };


    const item =
        config[status] || {
            label:
                statusLabels[status] ||
                status ||
                "-",

            className:
                "bg-gray-100 text-gray-700"
        };


    return (

        <span
            className={`
                inline-flex
                px-3
                py-1
                rounded-full
                text-sm
                font-bold
                ${item.className}
            `}
        >

            {item.label}

        </span>

    );

}