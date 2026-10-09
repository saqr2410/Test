import { useEffect, useMemo, useState } from "react";

import toast from "react-hot-toast";

import {
    Eye,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    RefreshCw,
    Image as ImageIcon,
    Trash,
    Search,
    FileText,
    ChevronLeft,
    ChevronRight,
    X,
    User,
    CalendarDays,
    Hash,
    ShieldCheck,
    AlertCircle,
} from "lucide-react";

import {
    getPrescriptions,
    approvePrescription,
    rejectPrescription,
    deletePrescription,
} from "../../../services/prescriptions/prescriptionService";

import PageHeader from "../../../components/ui/layout/PageHeader";
import SearchBox from "../../../components/ui/forms/SearchBox";
import Card from "../../../components/ui/cards/Card";


// ======================================================
// CONSTANTS
// ======================================================

const ITEMS_PER_PAGE = 10;


// ======================================================
// STATUS CONFIG
// ======================================================

const STATUS_CONFIG = {
    PENDING: {
        label: "قيد الانتظار",
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
    },

    PROCESSING: {
        label: "قيد المعالجة",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Clock,
    },

    APPROVED: {
        label: "مقبولة",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
    },

    REJECTED: {
        label: "مرفوضة",
        color: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
    },
};


// ======================================================
// HELPERS
// ======================================================

function getStatusInfo(status) {
    return (
        STATUS_CONFIG[status] || {
            label: status || "غير معروف",
            color: "bg-gray-50 text-gray-700 border-gray-200",
            icon: AlertCircle,
        }
    );
}


function formatDate(date) {
    if (!date) {
        return "-";
    }

    try {
        return new Date(date).toLocaleString("ar-EG", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    } catch {
        return "-";
    }
}


// ======================================================
// STAT CARD
// ======================================================

function StatCard({
    title,
    value,
    icon: Icon,
    iconClass,
    iconBg,
}) {
    return (
        <div
            className="
                bg-white
                border border-gray-100
                rounded-2xl
                p-5
                shadow-sm
                hover:shadow-md
                transition
            "
        >
            <div className="flex items-center justify-between gap-4">

                <div>
                    <p className="text-sm text-gray-500 font-medium">
                        {title}
                    </p>

                    <p className="text-2xl font-extrabold text-gray-900 mt-2">
                        {value}
                    </p>
                </div>

                <div
                    className={`
                        w-12 h-12
                        rounded-xl
                        flex items-center justify-center
                        ${iconBg}
                        ${iconClass}
                    `}
                >
                    <Icon size={23} />
                </div>

            </div>
        </div>
    );
}


// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({ status }) {
    const statusInfo = getStatusInfo(status);
    const Icon = statusInfo.icon;

    return (
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
                font-bold
                whitespace-nowrap
                ${statusInfo.color}
            `}
        >
            <Icon size={14} />

            {statusInfo.label}
        </span>
    );
}


// ======================================================
// IMAGE MODAL
// ======================================================

function ImageModal({ image, onClose }) {
    if (!image) {
        return null;
    }

    return (
        <div
            className="
                fixed
                inset-0
                z-[100]
                bg-black/70
                backdrop-blur-sm
                flex
                items-center
                justify-center
                p-4
            "
            onClick={onClose}
        >

            <div
                className="
                    relative
                    max-w-4xl
                    max-h-[90vh]
                    bg-white
                    rounded-2xl
                    overflow-hidden
                    shadow-2xl
                "
                onClick={(event) => event.stopPropagation()}
            >

                <button
                    type="button"
                    onClick={onClose}
                    className="
                        absolute
                        top-3
                        right-3
                        z-10
                        w-10
                        h-10
                        rounded-full
                        bg-black/60
                        text-white
                        flex
                        items-center
                        justify-center
                        hover:bg-black/80
                        transition
                    "
                >
                    <X size={20} />
                </button>

                <img
                    src={image}
                    alt="صورة الروشتة"
                    className="
                        max-w-full
                        max-h-[90vh]
                        object-contain
                    "
                />

            </div>

        </div>
    );
}


// ======================================================
// DETAILS MODAL
// ======================================================

function PrescriptionDetailsModal({
    prescription,
    onClose,
    onApprove,
    onReject,
    onDelete,
    updating,
}) {
    if (!prescription) {
        return null;
    }

    return (
        <div
            className="
                fixed
                inset-0
                z-[90]
                bg-black/50
                backdrop-blur-sm
                flex
                items-center
                justify-center
                p-4
            "
            onClick={onClose}
        >

            <div
                className="
                    bg-white
                    w-full
                    max-w-2xl
                    max-h-[90vh]
                    overflow-y-auto
                    rounded-3xl
                    shadow-2xl
                "
                onClick={(event) => event.stopPropagation()}
            >

                {/* HEADER */}

                <div
                    className="
                        sticky
                        top-0
                        z-10
                        bg-white
                        border-b
                        px-6
                        py-5
                        flex
                        items-center
                        justify-between
                    "
                >

                    <div>

                        <div className="flex items-center gap-3">

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
                                <FileText size={21} />
                            </div>

                            <div>

                                <h2 className="font-extrabold text-lg text-gray-900">
                                    تفاصيل الروشتة
                                </h2>

                                <p className="text-sm text-gray-500">
                                    #{prescription.id}
                                </p>

                            </div>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            w-9
                            h-9
                            rounded-xl
                            bg-gray-100
                            text-gray-600
                            flex
                            items-center
                            justify-center
                            hover:bg-gray-200
                            transition
                        "
                    >
                        <X size={19} />
                    </button>

                </div>


                {/* BODY */}

                <div className="p-6 space-y-6">

                    {/* STATUS */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            p-4
                            rounded-2xl
                            bg-gray-50
                            border
                            border-gray-100
                        "
                    >

                        <div>

                            <p className="text-xs text-gray-500 mb-1">
                                حالة الروشتة
                            </p>

                            <StatusBadge status={prescription.status} />

                        </div>

                        <div className="text-left">

                            <p className="text-xs text-gray-500 mb-1">
                                تاريخ الإنشاء
                            </p>

                            <p className="text-sm font-semibold text-gray-700">
                                {formatDate(prescription.created_at)}
                            </p>

                        </div>

                    </div>


                    {/* CUSTOMER INFO */}

                    <div>

                        <h3 className="font-bold text-gray-900 mb-3">
                            بيانات العميل
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            <div
                                className="
                                    p-4
                                    rounded-xl
                                    border
                                    border-gray-100
                                    bg-white
                                "
                            >

                                <div className="flex items-center gap-2 mb-1">

                                    <User
                                        size={16}
                                        className="text-gray-400"
                                    />

                                    <span className="text-xs text-gray-500">
                                        العميل
                                    </span>

                                </div>

                                <p className="font-semibold text-gray-800">
                                    {prescription.customer_name || "-"}
                                </p>

                            </div>


                            <div
                                className="
                                    p-4
                                    rounded-xl
                                    border
                                    border-gray-100
                                    bg-white
                                "
                            >

                                <div className="flex items-center gap-2 mb-1">

                                    <Hash
                                        size={16}
                                        className="text-gray-400"
                                    />

                                    <span className="text-xs text-gray-500">
                                        رقم الروشتة
                                    </span>

                                </div>

                                <p className="font-semibold text-gray-800">
                                    #{prescription.id}
                                </p>

                            </div>


                            <div
                                className="
                                    p-4
                                    rounded-xl
                                    border
                                    border-gray-100
                                    bg-white
                                "
                            >

                                <div className="flex items-center gap-2 mb-1">

                                    <CalendarDays
                                        size={16}
                                        className="text-gray-400"
                                    />

                                    <span className="text-xs text-gray-500">
                                        تاريخ الإنشاء
                                    </span>

                                </div>

                                <p className="font-semibold text-gray-800">
                                    {formatDate(
                                        prescription.created_at
                                    )}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* IMAGE */}

                    <div>

                        <div className="flex items-center justify-between mb-3">

                            <h3 className="font-bold text-gray-900">
                                صورة الروشتة
                            </h3>

                            {prescription.image && (
                                <span className="text-xs text-gray-500">
                                    اضغط على الصورة للتكبير
                                </span>
                            )}

                        </div>

                        {prescription.image ? (

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    p-3
                                    cursor-pointer
                                "
                                onClick={() => {
                                    // image handled from parent if needed
                                }}
                            >

                                <img
                                    src={prescription.image}
                                    alt="الروشتة"
                                    className="
                                        w-full
                                        max-h-[420px]
                                        object-contain
                                        rounded-xl
                                    "
                                />

                            </div>

                        ) : (

                            <div
                                className="
                                    h-48
                                    rounded-2xl
                                    bg-gray-50
                                    border
                                    border-dashed
                                    border-gray-200
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    text-gray-400
                                "
                            >

                                <ImageIcon size={42} />

                                <p className="mt-2 text-sm">
                                    لا توجد صورة
                                </p>

                            </div>

                        )}

                    </div>

                </div>


                {/* FOOTER */}

                <div
                    className="
                        border-t
                        bg-gray-50
                        px-6
                        py-4
                        flex
                        flex-wrap
                        justify-end
                        gap-2
                    "
                >

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            px-4
                            py-2.5
                            rounded-xl
                            bg-white
                            border
                            border-gray-200
                            text-gray-700
                            font-semibold
                            hover:bg-gray-100
                            transition
                        "
                    >
                        إغلاق
                    </button>


                    {prescription.status === "PENDING" && (
                        <>
                            <button
                                type="button"
                                onClick={() => onReject(prescription.id)}
                                disabled={updating}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-red-600
                                    text-white
                                    font-semibold
                                    hover:bg-red-700
                                    disabled:opacity-50
                                    transition
                                "
                            >
                                <XCircle size={17} />
                                رفض
                            </button>

                            <button
                                type="button"
                                onClick={() => onApprove(prescription.id)}
                                disabled={updating}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-emerald-600
                                    text-white
                                    font-semibold
                                    hover:bg-emerald-700
                                    disabled:opacity-50
                                    transition
                                "
                            >
                                <CheckCircle size={17} />
                                قبول
                            </button>
                        </>
                    )}


                    <button
                        type="button"
                        onClick={() => onDelete(prescription.id)}
                        disabled={updating}
                        className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2.5
                            rounded-xl
                            bg-gray-900
                            text-white
                            font-semibold
                            hover:bg-black
                            disabled:opacity-50
                            transition
                        "
                    >
                        <Trash2 size={17} />
                        حذف
                    </button>

                </div>

            </div>

        </div>
    );
}


// ======================================================
// MAIN COMPONENT
// ======================================================

export default function Prescriptions() {

    // ==================================================
    // STATE
    // ==================================================

    const [prescriptions, setPrescriptions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [updating, setUpdating] = useState(false);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");

    const [selectedIds, setSelectedIds] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedPrescription, setSelectedPrescription] =
        useState(null);

    const [previewImage, setPreviewImage] = useState(null);


    // ==================================================
    // LOAD DATA
    // ==================================================

    const loadPrescriptions = async () => {

        try {

            setLoading(true);

            const data = await getPrescriptions();

            const normalizedData =
                Array.isArray(data)
                    ? data
                    : data?.results || [];

            setPrescriptions(normalizedData);

            setSelectedIds([]);

        } catch (error) {

            console.error(
                "Prescriptions Error:",
                error
            );

            toast.error(
                "فشل تحميل الروشتات"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==================================================
    // INITIAL LOAD
    // ==================================================

    useEffect(() => {

        loadPrescriptions();

    }, []);


    // ==================================================
    // FILTER
    // ==================================================

    const filteredPrescriptions = useMemo(() => {

        let result = [...prescriptions];


        // SEARCH

        if (search.trim()) {

            const searchValue =
                search.trim().toLowerCase();

            result = result.filter((item) => {

                const customerName =
                    String(
                        item.customer_name || ""
                    ).toLowerCase();

                const id =
                    String(
                        item.id || ""
                    );

                return (
                    customerName.includes(searchValue) ||
                    id.includes(searchValue)
                );

            });

        }


        // STATUS

        if (statusFilter !== "all") {

            result = result.filter(
                (item) =>
                    item.status === statusFilter
            );

        }


        return result;

    }, [
        prescriptions,
        search,
        statusFilter,
    ]);


    // ==================================================
    // PAGINATION
    // ==================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredPrescriptions.length /
            ITEMS_PER_PAGE
        )
    );


    const paginatedPrescriptions =
        useMemo(() => {

            const start =
                (currentPage - 1) *
                ITEMS_PER_PAGE;

            const end =
                start + ITEMS_PER_PAGE;

            return filteredPrescriptions.slice(
                start,
                end
            );

        }, [
            filteredPrescriptions,
            currentPage,
        ]);


    // ==================================================
    // RESET PAGE WHEN FILTER CHANGES
    // ==================================================

    useEffect(() => {

        setCurrentPage(1);

        setSelectedIds([]);

    }, [
        search,
        statusFilter,
    ]);


    // ==================================================
    // SELECT ALL
    // ==================================================

    const allVisibleSelected =
        paginatedPrescriptions.length > 0 &&
        paginatedPrescriptions.every(
            (item) =>
                selectedIds.includes(item.id)
        );


    const handleSelectAll = () => {

        if (allVisibleSelected) {

            setSelectedIds((prev) =>
                prev.filter(
                    (id) =>
                        !paginatedPrescriptions.some(
                            (item) =>
                                item.id === id
                        )
                )
            );

            return;
        }


        const visibleIds =
            paginatedPrescriptions.map(
                (item) => item.id
            );


        setSelectedIds((prev) => {

            const merged = new Set([
                ...prev,
                ...visibleIds,
            ]);

            return [...merged];

        });

    };


    // ==================================================
    // SELECT ONE
    // ==================================================

    const handleSelectOne = (id) => {

        setSelectedIds((prev) => {

            if (prev.includes(id)) {

                return prev.filter(
                    (itemId) =>
                        itemId !== id
                );

            }

            return [
                ...prev,
                id,
            ];

        });

    };


    // ==================================================
    // DELETE SELECTED
    // ==================================================

    const handleDeleteSelected = async () => {

        if (selectedIds.length === 0) {

            toast.error(
                "اختر روشتات أولاً"
            );

            return;
        }


        const confirmed =
            window.confirm(
                `هل أنت متأكد من حذف ${selectedIds.length} روشتة؟`
            );


        if (!confirmed) {
            return;
        }


        try {

            setUpdating(true);


            await Promise.all(
                selectedIds.map(
                    (id) =>
                        deletePrescription(id)
                )
            );


            toast.success(
                `تم حذف ${selectedIds.length} روشتة بنجاح`
            );


            setSelectedIds([]);


            await loadPrescriptions();


        } catch (error) {

            console.error(
                "Bulk Delete Error:",
                error
            );

            toast.error(
                "فشل حذف الروشتات"
            );

        } finally {

            setUpdating(false);

        }

    };


    // ==================================================
    // APPROVE
    // ==================================================

    const handleApprove = async (id) => {

        try {

            setUpdating(true);


            await approvePrescription(id);


            toast.success(
                "تم قبول الروشتة بنجاح"
            );


            setSelectedPrescription(null);


            await loadPrescriptions();


        } catch (error) {

            console.error(
                "Approve Error:",
                error
            );

            toast.error(
                "فشل قبول الروشتة"
            );

        } finally {

            setUpdating(false);

        }

    };


    // ==================================================
    // REJECT
    // ==================================================

    const handleReject = async (id) => {

        try {

            setUpdating(true);


            await rejectPrescription(id);


            toast.success(
                "تم رفض الروشتة"
            );


            setSelectedPrescription(null);


            await loadPrescriptions();


        } catch (error) {

            console.error(
                "Reject Error:",
                error
            );

            toast.error(
                "فشل رفض الروشتة"
            );

        } finally {

            setUpdating(false);

        }

    };


    // ==================================================
    // DELETE
    // ==================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "هل أنت متأكد من حذف هذه الروشتة؟"
            );


        if (!confirmed) {
            return;
        }


        try {

            setUpdating(true);


            await deletePrescription(id);


            toast.success(
                "تم حذف الروشتة بنجاح"
            );


            setSelectedPrescription(null);


            await loadPrescriptions();


        } catch (error) {

            console.error(
                "Delete Error:",
                error
            );

            toast.error(
                "فشل حذف الروشتة"
            );

        } finally {

            setUpdating(false);

        }

    };


    // ==================================================
    // REFRESH
    // ==================================================

    const handleRefresh = async () => {

        try {

            setRefreshing(true);

            await loadPrescriptions();

            toast.success(
                "تم تحديث الروشتات"
            );

        } finally {

            setRefreshing(false);

        }

    };


    // ==================================================
    // STATISTICS
    // ==================================================

    const statistics = useMemo(() => {

        const total =
            prescriptions.length;

        const pending =
            prescriptions.filter(
                (item) =>
                    item.status === "PENDING"
            ).length;

        const approved =
            prescriptions.filter(
                (item) =>
                    item.status === "APPROVED"
            ).length;

        const rejected =
            prescriptions.filter(
                (item) =>
                    item.status === "REJECTED"
            ).length;

        const processing =
            prescriptions.filter(
                (item) =>
                    item.status === "PROCESSING"
            ).length;


        return {
            total,
            pending,
            approved,
            rejected,
            processing,
        };

    }, [prescriptions]);


    // ==================================================
    // LOADING
    // ==================================================

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
                            w-14
                            h-14
                            border-4
                            border-gray-200
                            border-t-[#5B2A86]
                            rounded-full
                            animate-spin
                            mx-auto
                            mb-4
                        "
                    />

                    <p className="font-semibold text-gray-700">
                        جاري تحميل الروشتات...
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                        يرجى الانتظار
                    </p>

                </div>

            </div>

        );

    }


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div
            dir="rtl"
            className="
                space-y-6
                pb-10
            "
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <PageHeader
                title="إدارة الروشتات"
                subtitle="مراجعة وإدارة روشتات العملاء"
                action={
                    <div className="flex items-center gap-2">

                        {selectedIds.length > 0 && (

                            <button
                                type="button"
                                onClick={handleDeleteSelected}
                                disabled={updating}
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-red-600
                                    text-white
                                    font-bold
                                    hover:bg-red-700
                                    disabled:opacity-50
                                    transition
                                "
                            >

                                <Trash size={17} />

                                حذف المحدد

                                <span
                                    className="
                                        bg-white/20
                                        px-2
                                        py-0.5
                                        rounded-lg
                                    "
                                >
                                    {selectedIds.length}
                                </span>

                            </button>

                        )}

                    </div>
                }
            />


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-4
                "
            >

                <StatCard
                    title="إجمالي الروشتات"
                    value={statistics.total}
                    icon={FileText}
                    iconBg="bg-purple-50"
                    iconClass="text-[#5B2A86]"
                />

                <StatCard
                    title="قيد الانتظار"
                    value={statistics.pending}
                    icon={Clock}
                    iconBg="bg-amber-50"
                    iconClass="text-amber-600"
                />

                <StatCard
                    title="تمت الموافقة"
                    value={statistics.approved}
                    icon={ShieldCheck}
                    iconBg="bg-emerald-50"
                    iconClass="text-emerald-600"
                />

                <StatCard
                    title="مرفوضة"
                    value={statistics.rejected}
                    icon={XCircle}
                    iconBg="bg-red-50"
                    iconClass="text-red-600"
                />

            </div>


            {/* ==================================================
                FILTERS
            ================================================== */}

            <Card>

                <div
                    className="
                        flex
                        flex-col
                        xl:flex-row
                        gap-3
                    "
                >

                    <div className="flex-1">

                        <SearchBox
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="ابحث برقم الروشتة أو اسم العميل..."
                        />

                    </div>


                    <div className="w-full xl:w-52">

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            className="
                                w-full
                                h-full
                                min-h-[46px]
                                border
                                border-gray-200
                                rounded-xl
                                px-4
                                bg-white
                                text-gray-700
                                outline-none
                                focus:ring-2
                                focus:ring-[#5B2A86]/20
                                focus:border-[#5B2A86]
                                transition
                            "
                        >

                            <option value="all">
                                جميع الحالات
                            </option>

                            <option value="PENDING">
                                قيد الانتظار
                            </option>

                            <option value="PROCESSING">
                                قيد المعالجة
                            </option>

                            <option value="APPROVED">
                                مقبولة
                            </option>

                            <option value="REJECTED">
                                مرفوضة
                            </option>

                        </select>

                    </div>


                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="
                            min-h-[46px]
                            px-5
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            text-gray-700
                            font-bold
                            flex
                            items-center
                            justify-center
                            gap-2
                            hover:bg-gray-50
                            disabled:opacity-50
                            transition
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

                </div>

            </Card>


            {/* ==================================================
                RESULT INFO
            ================================================== */}

            <div
                className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-2
                "
            >

                <div className="text-sm text-gray-500">

                    عرض

                    <span className="font-bold text-gray-800 mx-1">
                        {filteredPrescriptions.length}
                    </span>

                    روشتة

                </div>


                {selectedIds.length > 0 && (

                    <div
                        className="
                            text-sm
                            font-semibold
                            text-[#5B2A86]
                        "
                    >
                        تم تحديد {selectedIds.length} روشتة
                    </div>

                )}

            </div>


            {/* ==================================================
                TABLE
            ================================================== */}

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

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[950px]">

                        <thead>

                            <tr
                                className="
                                    bg-gray-50
                                    border-b
                                    border-gray-100
                                "
                            >

                                <th className="px-5 py-4 text-right w-12">

                                    <input
                                        type="checkbox"
                                        checked={
                                            allVisibleSelected
                                        }
                                        onChange={
                                            handleSelectAll
                                        }
                                        disabled={
                                            paginatedPrescriptions.length === 0
                                        }
                                        className="
                                            w-4
                                            h-4
                                            rounded
                                            accent-[#5B2A86]
                                            cursor-pointer
                                        "
                                    />

                                </th>

                                <th className="px-5 py-4 text-right text-xs font-bold text-gray-500">
                                    رقم الروشتة
                                </th>

                                <th className="px-5 py-4 text-right text-xs font-bold text-gray-500">
                                    العميل
                                </th>

                                <th className="px-5 py-4 text-center text-xs font-bold text-gray-500">
                                    الصورة
                                </th>

                                <th className="px-5 py-4 text-center text-xs font-bold text-gray-500">
                                    الحالة
                                </th>

                                <th className="px-5 py-4 text-right text-xs font-bold text-gray-500">
                                    تاريخ الإنشاء
                                </th>

                                <th className="px-5 py-4 text-center text-xs font-bold text-gray-500">
                                    الإجراءات
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {paginatedPrescriptions.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="py-20"
                                    >

                                        <div className="text-center">

                                            <div
                                                className="
                                                    w-16
                                                    h-16
                                                    rounded-2xl
                                                    bg-gray-100
                                                    flex
                                                    items-center
                                                    justify-center
                                                    mx-auto
                                                    mb-4
                                                    text-gray-400
                                                "
                                            >

                                                <Search size={28} />

                                            </div>

                                            <h3
                                                className="
                                                    font-bold
                                                    text-gray-800
                                                    text-lg
                                                "
                                            >
                                                لا توجد نتائج
                                            </h3>

                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-500
                                                    mt-1
                                                "
                                            >
                                                لم يتم العثور على
                                                روشتات مطابقة للبحث
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                paginatedPrescriptions.map(
                                    (item) => {

                                        const isSelected =
                                            selectedIds.includes(
                                                item.id
                                            );

                                        return (

                                            <tr
                                                key={item.id}
                                                className={`
                                                    border-b
                                                    border-gray-100
                                                    last:border-b-0
                                                    transition
                                                    ${isSelected
                                                        ? "bg-purple-50/40"
                                                        : "hover:bg-gray-50"
                                                    }
                                                `}
                                            >

                                                {/* CHECKBOX */}

                                                <td className="px-5 py-4">

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            isSelected
                                                        }
                                                        onChange={() =>
                                                            handleSelectOne(
                                                                item.id
                                                            )
                                                        }
                                                        className="
                                                            w-4
                                                            h-4
                                                            rounded
                                                            accent-[#5B2A86]
                                                            cursor-pointer
                                                        "
                                                    />

                                                </td>


                                                {/* ID */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            px-3
                                                            py-1.5
                                                            rounded-lg
                                                            bg-gray-100
                                                            text-gray-700
                                                            font-bold
                                                            text-sm
                                                        "
                                                    >
                                                        #{item.id}
                                                    </span>

                                                </td>


                                                {/* CUSTOMER */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

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
                                                                flex-shrink-0
                                                            "
                                                        >
                                                            <User
                                                                size={18}
                                                            />
                                                        </div>

                                                        <div>

                                                            <p
                                                                className="
                                                                    font-bold
                                                                    text-gray-800
                                                                "
                                                            >
                                                                {
                                                                    item.customer_name ||
                                                                    "غير محدد"
                                                                }
                                                            </p>

                                                            <p className="text-xs text-gray-400 mt-0.5">
                                                                عميل
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* IMAGE */}

                                                <td className="px-5 py-4">

                                                    <div className="flex justify-center">

                                                        {item.image ? (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setPreviewImage(
                                                                        item.image
                                                                    )
                                                                }
                                                                className="
                                                                    relative
                                                                    group
                                                                    w-16
                                                                    h-16
                                                                    rounded-xl
                                                                    overflow-hidden
                                                                    border
                                                                    border-gray-200
                                                                    bg-gray-50
                                                                "
                                                            >

                                                                <img
                                                                    src={
                                                                        item.image
                                                                    }
                                                                    alt="روشتة"
                                                                    className="
                                                                        w-full
                                                                        h-full
                                                                        object-cover
                                                                        group-hover:scale-110
                                                                        transition
                                                                    "
                                                                />

                                                                <div
                                                                    className="
                                                                        absolute
                                                                        inset-0
                                                                        bg-black/0
                                                                        group-hover:bg-black/30
                                                                        flex
                                                                        items-center
                                                                        justify-center
                                                                        transition
                                                                    "
                                                                >

                                                                    <Eye
                                                                        size={19}
                                                                        className="
                                                                            text-white
                                                                            opacity-0
                                                                            group-hover:opacity-100
                                                                            transition
                                                                        "
                                                                    />

                                                                </div>

                                                            </button>

                                                        ) : (

                                                            <div
                                                                className="
                                                                    w-16
                                                                    h-16
                                                                    rounded-xl
                                                                    bg-gray-100
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    text-gray-400
                                                                "
                                                            >
                                                                <ImageIcon
                                                                    size={21}
                                                                />
                                                            </div>

                                                        )}

                                                    </div>

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-5 py-4 text-center">

                                                    <StatusBadge
                                                        status={
                                                            item.status
                                                        }
                                                    />

                                                </td>


                                                {/* DATE */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-2">

                                                        <CalendarDays
                                                            size={16}
                                                            className="text-gray-400"
                                                        />

                                                        <span className="text-sm text-gray-600">
                                                            {formatDate(
                                                                item.created_at
                                                            )}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="px-5 py-4">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            justify-center
                                                            gap-1.5
                                                        "
                                                    >

                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedPrescription(
                                                                    item
                                                                )
                                                            }
                                                            title="عرض التفاصيل"
                                                            className="
                                                                w-9
                                                                h-9
                                                                rounded-lg
                                                                bg-blue-50
                                                                text-blue-600
                                                                flex
                                                                items-center
                                                                justify-center
                                                                hover:bg-blue-100
                                                                transition
                                                            "
                                                        >

                                                            <Eye
                                                                size={17}
                                                            />

                                                        </button>


                                                        {/* APPROVE */}

                                                        {item.status ===
                                                            "PENDING" && (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleApprove(
                                                                            item.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        updating
                                                                    }
                                                                    title="قبول"
                                                                    className="
                                                                    w-9
                                                                    h-9
                                                                    rounded-lg
                                                                    bg-emerald-50
                                                                    text-emerald-600
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    hover:bg-emerald-100
                                                                    disabled:opacity-50
                                                                    transition
                                                                "
                                                                >

                                                                    <CheckCircle
                                                                        size={17}
                                                                    />

                                                                </button>

                                                            )}


                                                        {/* REJECT */}

                                                        {item.status ===
                                                            "PENDING" && (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleReject(
                                                                            item.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        updating
                                                                    }
                                                                    title="رفض"
                                                                    className="
                                                                    w-9
                                                                    h-9
                                                                    rounded-lg
                                                                    bg-red-50
                                                                    text-red-600
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    hover:bg-red-100
                                                                    disabled:opacity-50
                                                                    transition
                                                                "
                                                                >

                                                                    <XCircle
                                                                        size={17}
                                                                    />

                                                                </button>

                                                            )}


                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id
                                                                )
                                                            }
                                                            disabled={
                                                                updating
                                                            }
                                                            title="حذف"
                                                            className="
                                                                w-9
                                                                h-9
                                                                rounded-lg
                                                                bg-gray-100
                                                                text-gray-500
                                                                flex
                                                                items-center
                                                                justify-center
                                                                hover:bg-red-50
                                                                hover:text-red-600
                                                                disabled:opacity-50
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


                {/* ==================================================
                    PAGINATION
                ================================================== */}

                {filteredPrescriptions.length > 0 && (

                    <div
                        className="
                            px-5
                            py-4
                            border-t
                            border-gray-100
                            flex
                            flex-col
                            sm:flex-row
                            items-center
                            justify-between
                            gap-4
                        "
                    >

                        <p className="text-sm text-gray-500">

                            صفحة

                            <span className="font-bold text-gray-800 mx-1">
                                {currentPage}
                            </span>

                            من

                            <span className="font-bold text-gray-800 mx-1">
                                {totalPages}
                            </span>

                        </p>


                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage(
                                        (prev) =>
                                            Math.max(
                                                prev - 1,
                                                1
                                            )
                                    )
                                }
                                disabled={
                                    currentPage === 1
                                }
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    px-3
                                    py-2
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-white
                                    text-gray-700
                                    font-semibold
                                    hover:bg-gray-50
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                    transition
                                "
                            >

                                <ChevronRight
                                    size={17}
                                />

                                السابق

                            </button>


                            <div
                                className="
                                    min-w-10
                                    h-10
                                    px-3
                                    rounded-xl
                                    bg-[#5B2A86]
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    font-bold
                                "
                            >
                                {currentPage}
                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage(
                                        (prev) =>
                                            Math.min(
                                                prev + 1,
                                                totalPages
                                            )
                                    )
                                }
                                disabled={
                                    currentPage >=
                                    totalPages
                                }
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    px-3
                                    py-2
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-white
                                    text-gray-700
                                    font-semibold
                                    hover:bg-gray-50
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                    transition
                                "
                            >

                                التالي

                                <ChevronLeft
                                    size={17}
                                />

                            </button>

                        </div>

                    </div>

                )}

            </div>


            {/* ==================================================
                DETAILS MODAL
            ================================================== */}

            <PrescriptionDetailsModal
                prescription={
                    selectedPrescription
                }
                onClose={() =>
                    setSelectedPrescription(null)
                }
                onApprove={
                    handleApprove
                }
                onReject={
                    handleReject
                }
                onDelete={
                    handleDelete
                }
                updating={
                    updating
                }
            />


            {/* ==================================================
                IMAGE PREVIEW
            ================================================== */}

            <ImageModal
                image={previewImage}
                onClose={() =>
                    setPreviewImage(null)
                }
            />

        </div>

    );

}