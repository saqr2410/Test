import { useEffect, useMemo, useState } from "react";

import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Truck,
    Mail,
    Phone,
    MapPin,
    Receipt,
    RefreshCw,
    X,
    Building2,
    Wallet,
    Users,
    AlertCircle,
    CheckCircle2
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
} from "../../../services/suppliers/supplierService";


export default function Suppliers() {

    const [suppliers, setSuppliers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");

    const [balanceFilter, setBalanceFilter] = useState("all");

    const [showForm, setShowForm] = useState(false);

    const [editing, setEditing] = useState(null);

    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState(null);


    const emptyForm = {
        name: "",
        phone: "",
        email: "",
        address: "",
        tax_number: ""
    };


    const [form, setForm] = useState(emptyForm);


    // =========================================================
    // LOAD
    // =========================================================

    const loadSuppliers = async (silent = false) => {

        try {

            if (silent) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await getSuppliers();

            const list = Array.isArray(data)
                ? data
                : data?.results || [];

            setSuppliers(list);

        } catch (error) {

            console.error(
                "SUPPLIERS ERROR:",
                error
            );

            setSuppliers([]);

            toast.error(
                "فشل تحميل بيانات الموردين"
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    useEffect(() => {

        loadSuppliers();

    }, []);


    // =========================================================
    // FILTERED SUPPLIERS
    // =========================================================

    const filteredSuppliers = useMemo(() => {

        const query = search
            .trim()
            .toLowerCase();

        return suppliers.filter((supplier) => {

            const name =
                supplier.name?.toLowerCase() || "";

            const phone =
                supplier.phone?.toLowerCase() || "";

            const email =
                supplier.email?.toLowerCase() || "";

            const taxNumber =
                supplier.tax_number?.toLowerCase() || "";

            const matchesSearch =
                !query ||
                name.includes(query) ||
                phone.includes(query) ||
                email.includes(query) ||
                taxNumber.includes(query);


            const balance =
                Number(supplier.balance || 0);


            let matchesBalance = true;

            if (balanceFilter === "positive") {
                matchesBalance = balance > 0;
            }

            if (balanceFilter === "zero") {
                matchesBalance = balance === 0;
            }

            if (balanceFilter === "negative") {
                matchesBalance = balance < 0;
            }


            return (
                matchesSearch &&
                matchesBalance
            );

        });

    }, [
        suppliers,
        search,
        balanceFilter
    ]);


    // =========================================================
    // STATISTICS
    // =========================================================

    const statistics = useMemo(() => {

        const total = suppliers.length;

        const withBalance = suppliers.filter(
            supplier =>
                Number(supplier.balance || 0) > 0
        ).length;

        const zeroBalance = suppliers.filter(
            supplier =>
                Number(supplier.balance || 0) === 0
        ).length;

        const totalBalance = suppliers.reduce(
            (sum, supplier) =>
                sum + Number(supplier.balance || 0),
            0
        );

        return {
            total,
            withBalance,
            zeroBalance,
            totalBalance
        };

    }, [suppliers]);


    // =========================================================
    // FORM
    // =========================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

    };


    const resetForm = () => {

        setForm(emptyForm);

        setEditing(null);

    };


    const openCreate = () => {

        resetForm();

        setShowForm(true);

    };


    const openEdit = (supplier) => {

        setEditing(supplier.id);

        setForm({
            name: supplier.name || "",
            phone: supplier.phone || "",
            email: supplier.email || "",
            address: supplier.address || "",
            tax_number: supplier.tax_number || ""
        });

        setShowForm(true);

    };


    const closeForm = () => {

        if (saving) return;

        setShowForm(false);

        resetForm();

    };


    // =========================================================
    // SAVE
    // =========================================================

    const saveSupplier = async (e) => {

        e.preventDefault();


        if (!form.name.trim()) {

            toast.error(
                "اسم المورد مطلوب"
            );

            return;

        }


        try {

            setSaving(true);


            if (editing) {

                await updateSupplier(
                    editing,
                    form
                );

                toast.success(
                    "تم تحديث بيانات المورد"
                );

            } else {

                await createSupplier(
                    form
                );

                toast.success(
                    "تم إضافة المورد بنجاح"
                );

            }


            setShowForm(false);

            resetForm();

            await loadSuppliers(true);

        } catch (error) {

            console.error(
                "SAVE SUPPLIER ERROR:",
                error
            );


            const data =
                error?.response?.data;


            const message =
                data?.detail ||
                data?.message ||
                data?.name?.[0] ||
                data?.phone?.[0] ||
                "حدث خطأ أثناء حفظ المورد";


            toast.error(message);

        } finally {

            setSaving(false);

        }

    };


    // =========================================================
    // DELETE
    // =========================================================

    const removeSupplier = async (supplier) => {

        const confirmed =
            window.confirm(
                `هل أنت متأكد من حذف المورد "${supplier.name}"؟`
            );


        if (!confirmed) return;


        try {

            setDeleting(supplier.id);

            await deleteSupplier(
                supplier.id
            );

            toast.success(
                "تم حذف المورد بنجاح"
            );

            await loadSuppliers(true);

        } catch (error) {

            console.error(
                "DELETE SUPPLIER ERROR:",
                error
            );


            const message =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                "لا يمكن حذف هذا المورد";


            toast.error(message);

        } finally {

            setDeleting(null);

        }

    };


    // =========================================================
    // MONEY
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

                <div className="text-center">

                    <div
                        className="
                            w-12
                            h-12
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
                            mt-4
                            text-gray-500
                            font-bold
                        "
                    >
                        جاري تحميل الموردين...
                    </p>

                </div>

            </div>

        );

    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div
            dir="rtl"
            className="
                min-h-full
                space-y-7
                pb-10
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

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

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                w-12
                                h-12
                                rounded-2xl
                                bg-purple-100
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <Truck
                                size={25}
                                className="text-[#5B2A86]"
                            />

                        </div>


                        <div>

                            <h1
                                className="
                                    text-3xl
                                    font-black
                                    text-gray-900
                                "
                            >
                                الموردين
                            </h1>

                            <p
                                className="
                                    text-gray-500
                                    mt-1
                                    text-sm
                                "
                            >
                                إدارة الموردين والبيانات المالية
                            </p>

                        </div>

                    </div>

                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <button
                        type="button"
                        onClick={() => loadSuppliers(true)}
                        disabled={refreshing}
                        className="
                            h-12
                            px-4
                            rounded-2xl
                            bg-white
                            border
                            border-gray-200
                            text-gray-600
                            font-bold
                            flex
                            items-center
                            gap-2
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

                        تحديث

                    </button>


                    <button
                        type="button"
                        onClick={openCreate}
                        className="
                            h-12
                            px-5
                            rounded-2xl
                            bg-[#5B2A86]
                            text-white
                            font-bold
                            flex
                            items-center
                            gap-2
                            shadow-lg
                            shadow-purple-200
                            hover:bg-[#4a216d]
                            hover:-translate-y-0.5
                            transition
                        "
                    >

                        <Plus size={19} />

                        إضافة مورد

                    </button>

                </div>

            </div>


            {/* =================================================
                STATS
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

                <StatCard
                    title="إجمالي الموردين"
                    value={statistics.total}
                    icon={Users}
                    iconClass="bg-purple-100 text-[#5B2A86]"
                />

                <StatCard
                    title="موردون لديهم رصيد"
                    value={statistics.withBalance}
                    icon={Wallet}
                    iconClass="bg-orange-100 text-orange-600"
                />

                <StatCard
                    title="بدون رصيد"
                    value={statistics.zeroBalance}
                    icon={CheckCircle2}
                    iconClass="bg-green-100 text-green-600"
                />

                <StatCard
                    title="إجمالي أرصدة الموردين"
                    value={`${money(statistics.totalBalance)} جنيه`}
                    icon={Receipt}
                    iconClass="bg-blue-100 text-blue-600"
                />

            </div>


            {/* =================================================
                FILTER BAR
            ================================================= */}

            <div
                className="
                    bg-white
                    border
                    border-gray-100
                    rounded-3xl
                    p-4
                    shadow-sm
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        lg:flex-row
                        gap-3
                    "
                >

                    <div
                        className="
                            flex-1
                            relative
                        "
                    >

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
                                ابحث باسم المورد أو الهاتف أو البريد أو الرقم الضريبي...
                            "
                            className="
                                w-full
                                h-12
                                pr-12
                                pl-4
                                rounded-2xl
                                bg-gray-50
                                border
                                border-transparent
                                outline-none
                                focus:bg-white
                                focus:border-purple-200
                                focus:ring-4
                                focus:ring-purple-50
                                transition
                            "
                        />

                    </div>


                    <select
                        value={balanceFilter}
                        onChange={(e) =>
                            setBalanceFilter(
                                e.target.value
                            )
                        }
                        className="
                            h-12
                            lg:w-52
                            px-4
                            rounded-2xl
                            bg-gray-50
                            border
                            border-transparent
                            outline-none
                            font-semibold
                            focus:bg-white
                            focus:border-purple-200
                        "
                    >

                        <option value="all">
                            كل الموردين
                        </option>

                        <option value="positive">
                            لديهم رصيد
                        </option>

                        <option value="zero">
                            بدون رصيد
                        </option>

                        <option value="negative">
                            رصيد دائن
                        </option>

                    </select>

                </div>

            </div>


            {/* =================================================
                RESULTS INFO
            ================================================= */}

            <div
                className="
                    flex
                    items-center
                    justify-between
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
                        قائمة الموردين
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >
                        عرض {filteredSuppliers.length} من أصل {suppliers.length} مورد
                    </p>

                </div>

            </div>


            {/* =================================================
                EMPTY
            ================================================= */}

            {filteredSuppliers.length === 0 ? (

                <div
                    className="
                        bg-white
                        border
                        border-gray-100
                        rounded-3xl
                        p-14
                        text-center
                        shadow-sm
                    "
                >

                    <div
                        className="
                            w-20
                            h-20
                            rounded-3xl
                            bg-purple-50
                            flex
                            items-center
                            justify-center
                            mx-auto
                            mb-5
                        "
                    >

                        {search ? (

                            <Search
                                size={34}
                                className="text-[#5B2A86]"
                            />

                        ) : (

                            <Truck
                                size={34}
                                className="text-[#5B2A86]"
                            />

                        )}

                    </div>


                    <h3
                        className="
                            text-xl
                            font-black
                            text-gray-800
                        "
                    >
                        {search
                            ? "لا توجد نتائج"
                            : "لا يوجد موردون حتى الآن"
                        }
                    </h3>


                    <p
                        className="
                            text-gray-500
                            mt-2
                        "
                    >
                        {search
                            ? "جرب تغيير كلمات البحث أو الفلاتر."
                            : "ابدأ بإضافة أول مورد إلى النظام."
                        }
                    </p>


                    {!search && (

                        <button
                            type="button"
                            onClick={openCreate}
                            className="
                                mt-6
                                px-6
                                py-3
                                rounded-2xl
                                bg-[#5B2A86]
                                text-white
                                font-bold
                            "
                        >
                            <Plus
                                size={18}
                                className="inline ml-2"
                            />
                            إضافة أول مورد
                        </button>

                    )}

                </div>

            ) : (

                /* =================================================
                    SUPPLIERS GRID
                ================================================= */

                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        xl:grid-cols-3
                        gap-5
                    "
                >

                    {filteredSuppliers.map(
                        (supplier) => {

                            const balance =
                                Number(
                                    supplier.balance || 0
                                );

                            const hasBalance =
                                balance > 0;

                            const hasCredit =
                                balance < 0;


                            return (

                                <div
                                    key={supplier.id}
                                    className="
                                        group
                                        bg-white
                                        rounded-3xl
                                        border
                                        border-gray-100
                                        shadow-sm
                                        hover:shadow-xl
                                        hover:-translate-y-1
                                        transition-all
                                        duration-300
                                        overflow-hidden
                                    "
                                >

                                    {/* CARD TOP */}

                                    <div
                                        className="
                                            p-6
                                            pb-5
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

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-4
                                                    min-w-0
                                                "
                                            >

                                                <div
                                                    className="
                                                        w-14
                                                        h-14
                                                        rounded-2xl
                                                        bg-purple-100
                                                        flex
                                                        items-center
                                                        justify-center
                                                        shrink-0
                                                    "
                                                >

                                                    <Building2
                                                        size={25}
                                                        className="text-[#5B2A86]"
                                                    />

                                                </div>


                                                <div
                                                    className="
                                                        min-w-0
                                                    "
                                                >

                                                    <h3
                                                        className="
                                                            font-black
                                                            text-lg
                                                            text-gray-900
                                                            truncate
                                                        "
                                                    >
                                                        {supplier.name}
                                                    </h3>

                                                    <p
                                                        className="
                                                            text-sm
                                                            text-gray-500
                                                            mt-1
                                                        "
                                                    >
                                                        مورد #{supplier.id}
                                                    </p>

                                                </div>

                                            </div>


                                            <div
                                                className={`
                                                    shrink-0
                                                    px-2.5
                                                    py-1
                                                    rounded-full
                                                    text-xs
                                                    font-bold
                                                    ${hasBalance
                                                        ? "bg-orange-50 text-orange-600"
                                                        : hasCredit
                                                            ? "bg-blue-50 text-blue-600"
                                                            : "bg-green-50 text-green-600"
                                                    }
                                                `}
                                            >

                                                {hasBalance
                                                    ? "له رصيد"
                                                    : hasCredit
                                                        ? "دائن"
                                                        : "متوازن"
                                                }

                                            </div>

                                        </div>


                                        {/* CONTACT */}

                                        <div
                                            className="
                                                mt-6
                                                space-y-3
                                            "
                                        >

                                            <ContactRow
                                                icon={Phone}
                                                value={
                                                    supplier.phone ||
                                                    "لا يوجد رقم هاتف"
                                                }
                                            />

                                            <ContactRow
                                                icon={Mail}
                                                value={
                                                    supplier.email ||
                                                    "لا يوجد بريد إلكتروني"
                                                }
                                            />

                                            <ContactRow
                                                icon={MapPin}
                                                value={
                                                    supplier.address ||
                                                    "لا يوجد عنوان"
                                                }
                                            />

                                            {supplier.tax_number && (

                                                <ContactRow
                                                    icon={Receipt}
                                                    value={`الرقم الضريبي: ${supplier.tax_number}`}
                                                />

                                            )}

                                        </div>

                                    </div>


                                    {/* BALANCE */}

                                    <div
                                        className="
                                            mx-6
                                            mb-5
                                            p-4
                                            rounded-2xl
                                            bg-gray-50
                                            border
                                            border-gray-100
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
                                                        text-xs
                                                        text-gray-500
                                                        font-semibold
                                                    "
                                                >
                                                    الرصيد الحالي
                                                </p>

                                                <p
                                                    className={`
                                                        text-xl
                                                        font-black
                                                        mt-1
                                                        ${hasBalance
                                                            ? "text-orange-600"
                                                            : hasCredit
                                                                ? "text-blue-600"
                                                                : "text-green-600"
                                                        }
                                                    `}
                                                >
                                                    {money(balance)}
                                                    <span
                                                        className="
                                                            text-xs
                                                            mr-1
                                                            font-bold
                                                        "
                                                    >
                                                        جنيه
                                                    </span>
                                                </p>

                                            </div>


                                            <Wallet
                                                size={22}
                                                className="
                                                    text-gray-400
                                                "
                                            />

                                        </div>

                                    </div>


                                    {/* ACTIONS */}

                                    <div
                                        className="
                                            px-6
                                            pb-6
                                            flex
                                            gap-3
                                        "
                                    >

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEdit(
                                                    supplier
                                                )
                                            }
                                            className="
                                                flex-1
                                                h-11
                                                rounded-xl
                                                bg-purple-50
                                                text-[#5B2A86]
                                                font-bold
                                                flex
                                                items-center
                                                justify-center
                                                gap-2
                                                hover:bg-purple-100
                                                transition
                                            "
                                        >

                                            <Edit3
                                                size={17}
                                            />

                                            تعديل

                                        </button>


                                        <button
                                            type="button"
                                            disabled={
                                                deleting ===
                                                supplier.id
                                            }
                                            onClick={() =>
                                                removeSupplier(
                                                    supplier
                                                )
                                            }
                                            className="
                                                h-11
                                                w-11
                                                rounded-xl
                                                bg-red-50
                                                text-red-500
                                                flex
                                                items-center
                                                justify-center
                                                hover:bg-red-100
                                                transition
                                                disabled:opacity-50
                                            "
                                            title="حذف المورد"
                                        >

                                            {deleting ===
                                                supplier.id ? (

                                                <div
                                                    className="
                                                        w-4
                                                        h-4
                                                        border-2
                                                        border-red-200
                                                        border-t-red-500
                                                        rounded-full
                                                        animate-spin
                                                    "
                                                />

                                            ) : (

                                                <Trash2
                                                    size={17}
                                                />

                                            )}

                                        </button>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            )}


            {/* =================================================
                MODAL
            ================================================= */}

            {showForm && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        bg-black/50
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        p-4
                    "
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeForm();
                        }

                    }}
                >

                    <div
                        className="
                            bg-white
                            w-full
                            max-w-2xl
                            rounded-3xl
                            shadow-2xl
                            overflow-hidden
                            max-h-[92vh]
                            overflow-y-auto
                        "
                    >

                        {/* MODAL HEADER */}

                        <div
                            className="
                                p-6
                                border-b
                                flex
                                items-center
                                justify-between
                                sticky
                                top-0
                                bg-white
                                z-10
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
                                        bg-purple-100
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    {editing ? (

                                        <Edit3
                                            size={21}
                                            className="text-[#5B2A86]"
                                        />

                                    ) : (

                                        <Plus
                                            size={22}
                                            className="text-[#5B2A86]"
                                        />

                                    )}

                                </div>


                                <div>

                                    <h2
                                        className="
                                            text-xl
                                            font-black
                                            text-gray-900
                                        "
                                    >
                                        {editing
                                            ? "تعديل بيانات المورد"
                                            : "إضافة مورد جديد"
                                        }
                                    </h2>

                                    <p
                                        className="
                                            text-sm
                                            text-gray-500
                                            mt-1
                                        "
                                    >
                                        أدخل بيانات المورد الأساسية
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={saving}
                                className="
                                    w-10
                                    h-10
                                    rounded-xl
                                    bg-gray-100
                                    text-gray-500
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-red-50
                                    hover:text-red-500
                                    transition
                                "
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={saveSupplier}
                            className="p-6 space-y-6"
                        >

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    gap-5
                                "
                            >

                                <FormField
                                    label="اسم المورد"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="مثال: شركة النور للأدوية"
                                    required
                                />

                                <FormField
                                    label="رقم الهاتف"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="01xxxxxxxxx"
                                />

                                <FormField
                                    label="البريد الإلكتروني"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="supplier@example.com"
                                />

                                <FormField
                                    label="الرقم الضريبي"
                                    name="tax_number"
                                    value={form.tax_number}
                                    onChange={handleChange}
                                    placeholder="الرقم الضريبي"
                                />

                            </div>


                            <div>

                                <label
                                    className="
                                        block
                                        text-sm
                                        font-bold
                                        text-gray-700
                                        mb-2
                                    "
                                >
                                    العنوان
                                </label>

                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="عنوان المورد بالتفصيل..."
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        px-4
                                        py-3
                                        outline-none
                                        resize-none
                                        focus:bg-white
                                        focus:border-purple-300
                                        focus:ring-4
                                        focus:ring-purple-50
                                        transition
                                    "
                                />

                            </div>


                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                    p-4
                                    rounded-2xl
                                    bg-purple-50
                                    border
                                    border-purple-100
                                "
                            >

                                <AlertCircle
                                    size={19}
                                    className="
                                        text-[#5B2A86]
                                        mt-0.5
                                        shrink-0
                                    "
                                />

                                <p
                                    className="
                                        text-sm
                                        text-purple-900
                                        leading-6
                                    "
                                >
                                    تأكد من صحة بيانات المورد، خصوصًا
                                    رقم الهاتف والرقم الضريبي، قبل الحفظ.
                                </p>

                            </div>


                            {/* BUTTONS */}

                            <div
                                className="
                                    flex
                                    gap-3
                                    pt-2
                                "
                            >

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    className="
                                        flex-1
                                        h-12
                                        rounded-2xl
                                        bg-gray-100
                                        text-gray-700
                                        font-bold
                                        hover:bg-gray-200
                                        transition
                                        disabled:opacity-50
                                    "
                                >
                                    إلغاء
                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="
                                        flex-1
                                        h-12
                                        rounded-2xl
                                        bg-[#5B2A86]
                                        text-white
                                        font-bold
                                        hover:bg-[#4a216d]
                                        transition
                                        disabled:opacity-50
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                    "
                                >

                                    {saving ? (

                                        <>
                                            <div
                                                className="
                                                    w-4
                                                    h-4
                                                    border-2
                                                    border-white/30
                                                    border-t-white
                                                    rounded-full
                                                    animate-spin
                                                "
                                            />

                                            جاري الحفظ...

                                        </>

                                    ) : (

                                        editing
                                            ? "حفظ التعديلات"
                                            : "إضافة المورد"

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}


// =========================================================
// STAT CARD
// =========================================================

function StatCard({
    title,
    value,
    icon: Icon,
    iconClass
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
                            font-semibold
                        "
                    >
                        {title}
                    </p>

                    <p
                        className="
                            text-2xl
                            font-black
                            text-gray-900
                            mt-2
                        "
                    >
                        {value}
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
                        ${iconClass}
                    `}
                >

                    <Icon size={23} />

                </div>

            </div>

        </div>

    );

}


// =========================================================
// CONTACT ROW
// =========================================================

function ContactRow({
    icon: Icon,
    value
}) {

    return (

        <div
            className="
                flex
                items-center
                gap-3
                text-sm
                min-w-0
            "
        >

            <Icon
                size={16}
                className="
                    text-gray-400
                    shrink-0
                "
            />

            <span
                className="
                    text-gray-600
                    truncate
                "
                title={value}
            >
                {value}
            </span>

        </div>

    );

}


// =========================================================
// FORM FIELD
// =========================================================

function FormField({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false
}) {

    return (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-bold
                    text-gray-700
                    mb-2
                "
            >

                {label}

                {required && (
                    <span className="text-red-500 mr-1">
                        *
                    </span>
                )}

            </label>


            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="
                    w-full
                    h-12
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    outline-none
                    focus:bg-white
                    focus:border-purple-300
                    focus:ring-4
                    focus:ring-purple-50
                    transition
                "
            />

        </div>

    );

}