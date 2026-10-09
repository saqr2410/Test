import { useEffect, useMemo, useState } from "react";

import {
    Plus,
    Search,
    RefreshCw,
    Trash2,
    User,
    Mail,
    Phone,
    Edit,
    CheckCircle,
    XCircle,
    X,
    Users,
    UserPlus,
    UserCheck,
    UserX,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getCustomers,
    deleteCustomer,
    createCustomer,
    updateCustomer,
} from "../../../services/customers/customerService";

import PageHeader from "../../../components/ui/layout/PageHeader";
import SearchBox from "../../../components/ui/forms/SearchBox";
import Card from "../../../components/ui/cards/Card";
import Loading from "../../../components/ui/feedback/Loading";
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";


const INITIAL_FORM = {
    username: "",
    email: "",
    phone: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
};


export default function Customers() {

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [editingCustomer, setEditingCustomer] = useState(null);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const [sortBy, setSortBy] = useState("newest");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [formData, setFormData] = useState(INITIAL_FORM);


    // =========================================================
    // LOAD CUSTOMERS
    // =========================================================

    const loadCustomers = async (showRefresh = false) => {

        try {

            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await getCustomers();

            const list = Array.isArray(data)
                ? data
                : data?.results || [];

            setCustomers(list);

        } catch (error) {

            console.error("CUSTOMERS ERROR:", error);

            toast.error(
                error?.response?.data?.detail ||
                "خطأ في تحميل العملاء"
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    useEffect(() => {

        loadCustomers();

    }, []);


    // =========================================================
    // SEARCH + FILTER + SORT
    // =========================================================

    const filteredCustomers = useMemo(() => {

        let result = [...customers];

        const query = search.trim().toLowerCase();


        // SEARCH
        if (query) {

            result = result.filter((customer) => {

                const username =
                    customer.username?.toLowerCase() || "";

                const email =
                    customer.email?.toLowerCase() || "";

                const phone =
                    customer.phone?.toLowerCase() || "";

                const firstName =
                    customer.first_name?.toLowerCase() || "";

                const lastName =
                    customer.last_name?.toLowerCase() || "";

                const fullName =
                    `${firstName} ${lastName}`.trim();

                return (
                    username.includes(query) ||
                    email.includes(query) ||
                    phone.includes(query) ||
                    firstName.includes(query) ||
                    lastName.includes(query) ||
                    fullName.includes(query)
                );

            });

        }


        // STATUS
        if (statusFilter === "active") {

            result = result.filter(
                (customer) =>
                    customer.is_active !== false
            );

        }

        if (statusFilter === "inactive") {

            result = result.filter(
                (customer) =>
                    customer.is_active === false
            );

        }


        // SORT
        result.sort((a, b) => {

            if (sortBy === "name") {

                return getFullName(a)
                    .localeCompare(
                        getFullName(b),
                        "ar"
                    );

            }

            if (sortBy === "oldest") {

                return (
                    new Date(a.date_joined || 0) -
                    new Date(b.date_joined || 0)
                );

            }

            if (sortBy === "newest") {

                return (
                    new Date(b.date_joined || 0) -
                    new Date(a.date_joined || 0)
                );

            }

            return 0;

        });

        return result;

    }, [
        customers,
        search,
        statusFilter,
        sortBy,
    ]);


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredCustomers.length / pageSize
        )
    );


    useEffect(() => {

        setCurrentPage(1);

    }, [
        search,
        statusFilter,
        sortBy,
        pageSize,
    ]);


    const paginatedCustomers = useMemo(() => {

        const start =
            (currentPage - 1) * pageSize;

        return filteredCustomers.slice(
            start,
            start + pageSize
        );

    }, [
        filteredCustomers,
        currentPage,
        pageSize,
    ]);


    // =========================================================
    // STATISTICS
    // =========================================================

    const totalCustomers = customers.length;

    const activeCustomers = customers.filter(
        (customer) =>
            customer.is_active !== false
    ).length;

    const inactiveCustomers = customers.filter(
        (customer) =>
            customer.is_active === false
    ).length;


    const joinedThisMonth = customers.filter(
        (customer) => {

            if (!customer.date_joined) {
                return false;
            }

            const date =
                new Date(customer.date_joined);

            const now = new Date();

            return (
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            );

        }
    ).length;


    // =========================================================
    // FORM
    // =========================================================

    const resetForm = () => {

        setFormData(INITIAL_FORM);

    };


    const closeAddModal = () => {

        if (saving) return;

        setShowAddModal(false);

        resetForm();

    };


    const closeEditModal = () => {

        if (saving) return;

        setShowEditModal(false);

        setEditingCustomer(null);

        resetForm();

    };


    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // =========================================================
    // ADD CUSTOMER
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!formData.username.trim()) {

            toast.error(
                "اسم المستخدم مطلوب"
            );

            return;

        }


        if (!formData.password) {

            toast.error(
                "كلمة المرور مطلوبة"
            );

            return;

        }


        if (
            formData.password !==
            formData.password2
        ) {

            toast.error(
                "كلمة المرور غير متطابقة"
            );

            return;

        }


        if (formData.password.length < 6) {

            toast.error(
                "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
            );

            return;

        }


        try {

            setSaving(true);


            const payload = {

                username:
                    formData.username.trim(),

                email:
                    formData.email.trim(),

                phone:
                    formData.phone.trim(),

                first_name:
                    formData.first_name.trim(),

                last_name:
                    formData.last_name.trim(),

                password:
                    formData.password,

            };


            await createCustomer(payload);


            toast.success(
                "تم إضافة العميل بنجاح"
            );


            closeAddModal();

            await loadCustomers();

        } catch (error) {

            console.error(
                "CREATE CUSTOMER ERROR:",
                error
            );

            toast.error(
                getErrorMessage(
                    error,
                    "فشل إضافة العميل"
                )
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================================================
    // EDIT
    // =========================================================

    const openEditModal = (customer) => {

        setEditingCustomer(customer);

        setFormData({

            username:
                customer.username || "",

            email:
                customer.email || "",

            phone:
                customer.phone || "",

            first_name:
                customer.first_name || "",

            last_name:
                customer.last_name || "",

            password: "",

            password2: "",

        });

        setShowEditModal(true);

    };


    const handleEdit = async (e) => {

        e.preventDefault();


        if (!formData.username.trim()) {

            toast.error(
                "اسم المستخدم مطلوب"
            );

            return;

        }


        if (
            formData.password &&
            formData.password !==
            formData.password2
        ) {

            toast.error(
                "كلمة المرور غير متطابقة"
            );

            return;

        }


        if (
            formData.password &&
            formData.password.length < 6
        ) {

            toast.error(
                "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
            );

            return;

        }


        try {

            setSaving(true);


            const payload = {

                username:
                    formData.username.trim(),

                email:
                    formData.email.trim(),

                phone:
                    formData.phone.trim(),

                first_name:
                    formData.first_name.trim(),

                last_name:
                    formData.last_name.trim(),

            };


            if (formData.password) {

                payload.password =
                    formData.password;

            }


            await updateCustomer(
                editingCustomer.id,
                payload
            );


            toast.success(
                "تم تحديث العميل بنجاح"
            );


            closeEditModal();

            await loadCustomers();

        } catch (error) {

            console.error(
                "UPDATE CUSTOMER ERROR:",
                error
            );

            toast.error(
                getErrorMessage(
                    error,
                    "فشل تحديث العميل"
                )
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (id) => {

        if (deleting) return;


        const confirmed =
            window.confirm(
                "هل أنت متأكد من حذف هذا العميل؟\nلا يمكن التراجع عن هذه العملية."
            );


        if (!confirmed) return;


        try {

            setDeleting(id);


            await deleteCustomer(id);


            toast.success(
                "تم حذف العميل بنجاح"
            );


            await loadCustomers();

        } catch (error) {

            console.error(
                "DELETE CUSTOMER ERROR:",
                error
            );

            toast.error(
                getErrorMessage(
                    error,
                    "فشل حذف العميل"
                )
            );

        } finally {

            setDeleting(null);

        }

    };


    // =========================================================
    // HELPERS
    // =========================================================

    function getFullName(customer) {

        if (
            customer.first_name ||
            customer.last_name
        ) {

            return (
                `${customer.first_name || ""} ${customer.last_name || ""}`
                    .trim()
            );

        }

        return customer.username || "عميل";

    }


    function getInitial(customer) {

        const name =
            getFullName(customer);

        return (
            name.charAt(0) || "ع"
        ).toUpperCase();

    }


    function formatDate(date) {

        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "ar-EG",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );

    }


    function getErrorMessage(
        error,
        fallback
    ) {

        const data =
            error?.response?.data;

        return (
            data?.username?.[0] ||
            data?.email?.[0] ||
            data?.phone?.[0] ||
            data?.detail ||
            data?.message ||
            fallback
        );

    }


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div
                dir="rtl"
                className="min-h-[70vh] flex items-center justify-center"
            >

                <Loading />

            </div>

        );

    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div
            dir="rtl"
            className="space-y-6 pb-8"
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <PageHeader
                title="العملاء"
                subtitle="إدارة بيانات العملاء ومتابعة نشاطهم"
                action={

                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                loadCustomers(true)
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
                                bg-white
                                border
                                border-gray-200
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
                            onClick={() => {

                                resetForm();

                                setShowAddModal(true);

                            }}
                        >

                            <Plus
                                size={18}
                                className="inline ml-2"
                            />

                            إضافة عميل

                        </PrimaryButton>

                    </div>
                }
            />


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-4
                    gap-4
                "
            >

                <StatCard
                    title="إجمالي العملاء"
                    value={totalCustomers}
                    icon={Users}
                    iconClass="bg-purple-100 text-[#5B2A86]"
                />

                <StatCard
                    title="العملاء النشطون"
                    value={activeCustomers}
                    icon={UserCheck}
                    iconClass="bg-green-100 text-green-600"
                />

                <StatCard
                    title="غير النشطين"
                    value={inactiveCustomers}
                    icon={UserX}
                    iconClass="bg-red-100 text-red-600"
                />

                <StatCard
                    title="عملاء هذا الشهر"
                    value={joinedThisMonth}
                    icon={UserPlus}
                    iconClass="bg-blue-100 text-blue-600"
                />

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <Card>

                <div className="space-y-4">

                    <div
                        className="
                            flex
                            flex-col
                            lg:flex-row
                            gap-3
                        "
                    >

                        <div className="flex-1">

                            <SearchBox
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="
                                    بحث بالاسم أو المستخدم أو الهاتف أو البريد...
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

                            <div
                                className="
                                    relative
                                    min-w-[180px]
                                "
                            >

                                <SlidersHorizontal
                                    size={17}
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                        pointer-events-none
                                    "
                                />

                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        w-full
                                        appearance-none
                                        border
                                        border-gray-200
                                        rounded-xl
                                        px-10
                                        py-3
                                        bg-white
                                        outline-none
                                        focus:ring-2
                                        focus:ring-purple-200
                                    "
                                >

                                    <option value="all">
                                        كل الحالات
                                    </option>

                                    <option value="active">
                                        النشطون فقط
                                    </option>

                                    <option value="inactive">
                                        غير النشطين
                                    </option>

                                </select>

                            </div>


                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(
                                        e.target.value
                                    )
                                }
                                className="
                                    min-w-[180px]
                                    border
                                    border-gray-200
                                    rounded-xl
                                    px-4
                                    py-3
                                    bg-white
                                    outline-none
                                    focus:ring-2
                                    focus:ring-purple-200
                                "
                            >

                                <option value="newest">
                                    الأحدث تسجيلًا
                                </option>

                                <option value="oldest">
                                    الأقدم تسجيلًا
                                </option>

                                <option value="name">
                                    ترتيب بالاسم
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* RESULT INFO */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            justify-between
                            gap-3
                            pt-3
                            border-t
                            text-sm
                            text-gray-500
                        "
                    >

                        <span>

                            عرض{" "}

                            <strong className="text-gray-800">
                                {filteredCustomers.length}
                            </strong>{" "}

                            عميل

                        </span>


                        {(search ||
                            statusFilter !== "all") && (

                                <button
                                    type="button"
                                    onClick={() => {

                                        setSearch("");

                                        setStatusFilter(
                                            "all"
                                        );

                                    }}
                                    className="
                                    text-[#5B2A86]
                                    font-bold
                                    hover:underline
                                "
                                >

                                    مسح الفلاتر

                                </button>

                            )}

                    </div>

                </div>

            </Card>


            {/* =================================================
                TABLE
            ================================================= */}

            <Card className="overflow-hidden">

                <div
                    className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        justify-between
                        gap-3
                        p-5
                        border-b
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
                            قائمة العملاء
                        </h2>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            بيانات العملاء المسجلين في النظام
                        </p>

                    </div>


                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-500
                        "
                    >

                        <span>
                            لكل صفحة
                        </span>

                        <select
                            value={pageSize}
                            onChange={(e) =>
                                setPageSize(
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                            className="
                                border
                                rounded-lg
                                px-2
                                py-1.5
                                outline-none
                            "
                        >

                            <option value={5}>
                                5
                            </option>

                            <option value={10}>
                                10
                            </option>

                            <option value={20}>
                                20
                            </option>

                            <option value={50}>
                                50
                            </option>

                        </select>

                    </div>

                </div>


                {paginatedCustomers.length === 0 ? (

                    <EmptyCustomers
                        search={search}
                        onAdd={() => {

                            resetForm();

                            setShowAddModal(true);

                        }}
                    />

                ) : (

                    <div className="overflow-x-auto">

                        <table
                            className="
                                w-full
                                text-right
                                min-w-[900px]
                            "
                        >

                            <thead>

                                <tr
                                    className="
                                        bg-gray-50
                                        border-b
                                        text-gray-500
                                        text-sm
                                    "
                                >

                                    <th className="px-6 py-4 font-bold">
                                        العميل
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        الهاتف
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        البريد الإلكتروني
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        تاريخ التسجيل
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        الحالة
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        الإجراءات
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {paginatedCustomers.map(
                                    (customer) => {

                                        const fullName =
                                            getFullName(
                                                customer
                                            );

                                        const active =
                                            customer.is_active !==
                                            false;

                                        return (

                                            <tr
                                                key={
                                                    customer.id
                                                }
                                                className="
                                                    border-b
                                                    last:border-0
                                                    hover:bg-gray-50
                                                    transition
                                                "
                                            >

                                                {/* CUSTOMER */}

                                                <td className="px-6 py-4">

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
                                                                rounded-2xl
                                                                bg-purple-100
                                                                text-[#5B2A86]
                                                                flex
                                                                items-center
                                                                justify-center
                                                                font-black
                                                                shrink-0
                                                            "
                                                        >

                                                            {getInitial(
                                                                customer
                                                            )}

                                                        </div>


                                                        <div
                                                            className="
                                                                min-w-0
                                                            "
                                                        >

                                                            <p
                                                                className="
                                                                    font-black
                                                                    text-gray-800
                                                                    truncate
                                                                "
                                                            >
                                                                {fullName}
                                                            </p>

                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-gray-500
                                                                    mt-1
                                                                "
                                                            >
                                                                @{customer.username}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* PHONE */}

                                                <td className="px-6 py-4">

                                                    {customer.phone ? (

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                                text-gray-700
                                                            "
                                                        >

                                                            <Phone
                                                                size={15}
                                                                className="text-gray-400"
                                                            />

                                                            {customer.phone}

                                                        </div>

                                                    ) : (

                                                        <span className="text-gray-400">
                                                            -
                                                        </span>

                                                    )}

                                                </td>


                                                {/* EMAIL */}

                                                <td className="px-6 py-4">

                                                    {customer.email ? (

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                                max-w-[230px]
                                                            "
                                                        >

                                                            <Mail
                                                                size={15}
                                                                className="
                                                                    text-gray-400
                                                                    shrink-0
                                                                "
                                                            />

                                                            <span
                                                                className="
                                                                    truncate
                                                                    text-gray-700
                                                                "
                                                            >
                                                                {customer.email}
                                                            </span>

                                                        </div>

                                                    ) : (

                                                        <span className="text-gray-400">
                                                            -
                                                        </span>

                                                    )}

                                                </td>


                                                {/* DATE */}

                                                <td
                                                    className="
                                                        px-6
                                                        py-4
                                                        text-sm
                                                        text-gray-500
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                        "
                                                    >

                                                        <CalendarDays
                                                            size={15}
                                                            className="text-gray-400"
                                                        />

                                                        {formatDate(
                                                            customer.date_joined
                                                        )}

                                                    </div>

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-6 py-4">

                                                    {active ? (

                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                px-3
                                                                py-1.5
                                                                rounded-full
                                                                bg-green-100
                                                                text-green-700
                                                                text-xs
                                                                font-black
                                                            "
                                                        >

                                                            <CheckCircle
                                                                size={14}
                                                            />

                                                            نشط

                                                        </span>

                                                    ) : (

                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                px-3
                                                                py-1.5
                                                                rounded-full
                                                                bg-red-100
                                                                text-red-600
                                                                text-xs
                                                                font-black
                                                            "
                                                        >

                                                            <XCircle
                                                                size={14}
                                                            />

                                                            غير نشط

                                                        </span>

                                                    )}

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="px-6 py-4">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                        "
                                                    >

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    customer
                                                                )
                                                            }
                                                            className="
                                                                w-9
                                                                h-9
                                                                rounded-xl
                                                                bg-blue-50
                                                                text-blue-600
                                                                flex
                                                                items-center
                                                                justify-center
                                                                hover:bg-blue-100
                                                                transition
                                                            "
                                                            title="تعديل العميل"
                                                        >

                                                            <Edit
                                                                size={17}
                                                            />

                                                        </button>


                                                        <button
                                                            type="button"
                                                            disabled={
                                                                deleting ===
                                                                customer.id
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    customer.id
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
                                                                disabled:opacity-50
                                                            "
                                                            title="حذف العميل"
                                                        >

                                                            {deleting ===
                                                                customer.id ? (

                                                                <RefreshCw
                                                                    size={17}
                                                                    className="animate-spin"
                                                                />

                                                            ) : (

                                                                <Trash2
                                                                    size={17}
                                                                />

                                                            )}

                                                        </button>

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


                {/* =================================================
                    PAGINATION
                ================================================= */}

                {filteredCustomers.length > 0 && (

                    <div
                        className="
                            flex
                            flex-col
                            sm:flex-row
                            items-center
                            justify-between
                            gap-4
                            px-5
                            py-4
                            border-t
                            bg-gray-50
                        "
                    >

                        <p
                            className="
                                text-sm
                                text-gray-500
                            "
                        >

                            صفحة{" "}

                            <strong className="text-gray-800">
                                {currentPage}
                            </strong>{" "}

                            من{" "}

                            <strong className="text-gray-800">
                                {totalPages}
                            </strong>

                        </p>


                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                disabled={
                                    currentPage === 1
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        (page) =>
                                            Math.max(
                                                1,
                                                page - 1
                                            )
                                    )
                                }
                                className="
                                    w-9
                                    h-9
                                    rounded-xl
                                    bg-white
                                    border
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-gray-100
                                    disabled:opacity-40
                                "
                            >

                                <ChevronRight
                                    size={18}
                                />

                            </button>


                            <div
                                className="
                                    px-4
                                    py-2
                                    rounded-xl
                                    bg-[#5B2A86]
                                    text-white
                                    font-bold
                                    text-sm
                                "
                            >
                                {currentPage}
                            </div>


                            <button
                                type="button"
                                disabled={
                                    currentPage >=
                                    totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        (page) =>
                                            Math.min(
                                                totalPages,
                                                page + 1
                                            )
                                    )
                                }
                                className="
                                    w-9
                                    h-9
                                    rounded-xl
                                    bg-white
                                    border
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-gray-100
                                    disabled:opacity-40
                                "
                            >

                                <ChevronLeft
                                    size={18}
                                />

                            </button>

                        </div>

                    </div>

                )}

            </Card>


            {/* =================================================
                ADD MODAL
            ================================================= */}

            {showAddModal && (

                <CustomerModal
                    title="إضافة عميل جديد"
                    subtitle="أدخل بيانات العميل لإنشاء حساب جديد"
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={closeAddModal}
                    saving={saving}
                    isEdit={false}
                />

            )}


            {/* =================================================
                EDIT MODAL
            ================================================= */}

            {showEditModal && editingCustomer && (

                <CustomerModal
                    title="تعديل بيانات العميل"
                    subtitle="قم بتحديث بيانات العميل"
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleEdit}
                    onClose={closeEditModal}
                    saving={saving}
                    isEdit={true}
                />

            )}

        </div>

    );

}


// =============================================================
// STAT CARD
// =============================================================

function StatCard({
    title,
    value,
    icon: Icon,
    iconClass,
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
                    justify-between
                    gap-4
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            font-medium
                        "
                    >
                        {title}
                    </p>

                    <p
                        className="
                            text-3xl
                            font-black
                            text-gray-800
                            mt-2
                        "
                    >
                        {value.toLocaleString("ar-EG")}
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


// =============================================================
// EMPTY STATE
// =============================================================

function EmptyCustomers({
    search,
    onAdd,
}) {

    return (

        <div
            className="
                py-20
                text-center
                px-6
            "
        >

            <div
                className="
                    w-20
                    h-20
                    rounded-3xl
                    bg-purple-50
                    text-[#5B2A86]
                    flex
                    items-center
                    justify-center
                    mx-auto
                    mb-5
                "
            >

                <Users size={36} />

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
                    : "لا يوجد عملاء"
                }

            </h3>


            <p
                className="
                    text-gray-500
                    mt-2
                    max-w-md
                    mx-auto
                "
            >

                {search
                    ? "جرب البحث باستخدام اسم مختلف أو رقم الهاتف أو البريد الإلكتروني."
                    : "لم تتم إضافة أي عملاء حتى الآن."
                }

            </p>


            {!search && (

                <button
                    type="button"
                    onClick={onAdd}
                    className="
                        mt-6
                        inline-flex
                        items-center
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

                    <Plus size={18} />

                    إضافة أول عميل

                </button>

            )}

        </div>

    );

}


// =============================================================
// CUSTOMER MODAL
// =============================================================

function CustomerModal({
    title,
    subtitle,
    formData,
    onChange,
    onSubmit,
    onClose,
    saving,
    isEdit,
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
        >

            <div
                className="
                    bg-white
                    rounded-3xl
                    shadow-2xl
                    w-full
                    max-w-2xl
                    max-h-[92vh]
                    overflow-hidden
                "
            >

                {/* HEADER */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        p-6
                        border-b
                        bg-white
                    "
                >

                    <div>

                        <h2
                            className="
                                text-2xl
                                font-black
                                text-gray-800
                            "
                        >
                            {title}
                        </h2>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            {subtitle}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
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
                            disabled:opacity-50
                        "
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* BODY */}

                <form
                    onSubmit={onSubmit}
                    className="
                        overflow-y-auto
                        max-h-[calc(92vh-150px)]
                    "
                >

                    <div className="p-6 space-y-5">

                        {/* ACCOUNT */}

                        <div>

                            <SectionTitle
                                icon={User}
                                title="بيانات الحساب"
                            />

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    gap-4
                                    mt-4
                                "
                            >

                                <FormInput
                                    label="اسم المستخدم"
                                    name="username"
                                    value={
                                        formData.username
                                    }
                                    onChange={onChange}
                                    placeholder="أدخل اسم المستخدم"
                                    required
                                />


                                <FormInput
                                    label="البريد الإلكتروني"
                                    name="email"
                                    type="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={onChange}
                                    placeholder="example@email.com"
                                />

                            </div>

                        </div>


                        {/* PERSONAL */}

                        <div>

                            <SectionTitle
                                icon={User}
                                title="البيانات الشخصية"
                            />

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    gap-4
                                    mt-4
                                "
                            >

                                <FormInput
                                    label="الاسم الأول"
                                    name="first_name"
                                    value={
                                        formData.first_name
                                    }
                                    onChange={onChange}
                                    placeholder="أحمد"
                                />


                                <FormInput
                                    label="الاسم الأخير"
                                    name="last_name"
                                    value={
                                        formData.last_name
                                    }
                                    onChange={onChange}
                                    placeholder="محمد"
                                />


                                <FormInput
                                    label="رقم الهاتف"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={onChange}
                                    placeholder="01012345678"
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div>

                            <SectionTitle
                                icon={User}
                                title={
                                    isEdit
                                        ? "تغيير كلمة المرور"
                                        : "كلمة المرور"
                                }
                            />

                            {isEdit && (

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                        mt-2
                                    "
                                >
                                    اترك الحقول فارغة إذا كنت لا تريد تغيير كلمة المرور.
                                </p>

                            )}


                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    md:grid-cols-2
                                    gap-4
                                    mt-4
                                "
                            >

                                <FormInput
                                    label={
                                        isEdit
                                            ? "كلمة المرور الجديدة"
                                            : "كلمة المرور"
                                    }
                                    name="password"
                                    type="password"
                                    value={
                                        formData.password
                                    }
                                    onChange={onChange}
                                    placeholder={
                                        isEdit
                                            ? "اختياري"
                                            : "6 أحرف على الأقل"
                                    }
                                    required={!isEdit}
                                    minLength={6}
                                />


                                <FormInput
                                    label="تأكيد كلمة المرور"
                                    name="password2"
                                    type="password"
                                    value={
                                        formData.password2
                                    }
                                    onChange={onChange}
                                    placeholder="أعد إدخال كلمة المرور"
                                    required={!isEdit}
                                />

                            </div>

                        </div>

                    </div>


                    {/* FOOTER */}

                    <div
                        className="
                            sticky
                            bottom-0
                            flex
                            justify-end
                            gap-3
                            p-5
                            border-t
                            bg-gray-50
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="
                                px-5
                                py-2.5
                                rounded-xl
                                bg-white
                                border
                                border-gray-200
                                text-gray-700
                                font-bold
                                hover:bg-gray-100
                                transition
                                disabled:opacity-50
                            "
                        >
                            إلغاء
                        </button>


                        <PrimaryButton
                            type="submit"
                            disabled={saving}
                        >

                            {saving
                                ? "جاري الحفظ..."
                                : isEdit
                                    ? "حفظ التعديلات"
                                    : "إضافة العميل"
                            }

                        </PrimaryButton>

                    </div>

                </form>

            </div>

        </div>

    );

}


// =============================================================
// SECTION TITLE
// =============================================================

function SectionTitle({
    icon: Icon,
    title,
}) {

    return (

        <div
            className="
                flex
                items-center
                gap-2
                text-gray-800
            "
        >

            <div
                className="
                    w-8
                    h-8
                    rounded-lg
                    bg-purple-100
                    text-[#5B2A86]
                    flex
                    items-center
                    justify-center
                "
            >

                <Icon size={16} />

            </div>


            <h3 className="font-black">
                {title}
            </h3>

        </div>

    );

}


// =============================================================
// FORM INPUT
// =============================================================

function FormInput({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
    minLength,
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
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                minLength={minLength}
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
                    placeholder:text-gray-400
                    focus:border-[#5B2A86]
                    focus:ring-4
                    focus:ring-purple-100
                "
            />

        </div>

    );

}