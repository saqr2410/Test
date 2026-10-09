import { useEffect, useMemo, useState } from "react";
import {
    getEmployees,
    deleteEmployee,
    createEmployee,
    updateEmployee
} from "../../../services/employees/employeeService";

import PageHeader from "../../../components/ui/layout/PageHeader";
import SearchBox from "../../../components/ui/forms/SearchBox";
import Card from "../../../components/ui/cards/Card";
import Loading from "../../../components/ui/feedback/Loading";
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";

import toast from "react-hot-toast";

import {
    RefreshCw,
    Trash2,
    User,
    Plus,
    Edit,
    CheckCircle,
    XCircle,
    X,
    Users,
    ShieldCheck,
    UserRound,
    Mail,
    Phone,
    CalendarDays,
    BriefcaseBusiness,
    Search,
    KeyRound
} from "lucide-react";


const INITIAL_FORM = {
    username: "",
    email: "",
    phone: "",
    first_name: "",
    last_name: "",
    role: "CASHIER",
    password: "",
    password2: ""
};


const ROLES = [
    {
        value: "OWNER",
        label: "مالك",
        className: "bg-purple-100 text-purple-700"
    },
    {
        value: "MANAGER",
        label: "مدير",
        className: "bg-blue-100 text-blue-700"
    },
    {
        value: "PHARMACIST",
        label: "صيدلي",
        className: "bg-cyan-100 text-cyan-700"
    },
    {
        value: "CASHIER",
        label: "كاشير",
        className: "bg-green-100 text-green-700"
    },
    {
        value: "ACCOUNTANT",
        label: "محاسب",
        className: "bg-orange-100 text-orange-700"
    },
    {
        value: "DELIVERY",
        label: "توصيل",
        className: "bg-yellow-100 text-yellow-700"
    }
];


export default function Employees() {

    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const [modalMode, setModalMode] = useState(null);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [formData, setFormData] = useState(INITIAL_FORM);


    /* =========================================================
       LOAD EMPLOYEES
    ========================================================= */

    const loadEmployees = async (showPageLoader = false) => {
        try {

            if (showPageLoader) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            const data = await getEmployees();

            setEmployees(Array.isArray(data) ? data : []);

        } catch (error) {

            console.error("EMPLOYEES LOAD ERROR:", error);

            toast.error(
                error?.response?.data?.detail ||
                "فشل تحميل الموظفين"
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    useEffect(() => {
        loadEmployees(true);
    }, []);


    /* =========================================================
       FILTERING
    ========================================================= */

    const filteredEmployees = useMemo(() => {

        const searchValue = search.trim().toLowerCase();

        return employees.filter((employee) => {

            // Don't show customers
            if (employee.role === "CUSTOMER") {
                return false;
            }

            const matchesSearch =
                !searchValue ||
                employee.username
                    ?.toLowerCase()
                    .includes(searchValue) ||
                employee.email
                    ?.toLowerCase()
                    .includes(searchValue) ||
                employee.first_name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                employee.last_name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                employee.phone
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesRole =
                roleFilter === "all" ||
                employee.role === roleFilter;

            return matchesSearch && matchesRole;
        });

    }, [employees, search, roleFilter]);


    /* =========================================================
       FORM
    ========================================================= */

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    const resetForm = () => {
        setFormData(INITIAL_FORM);
    };


    const closeModal = () => {

        if (saving) return;

        setModalMode(null);
        setEditingEmployee(null);

        resetForm();
    };


    const openAddModal = () => {

        resetForm();

        setEditingEmployee(null);
        setModalMode("add");

    };


    const openEditModal = (employee) => {

        setEditingEmployee(employee);

        setFormData({
            username: employee.username || "",
            email: employee.email || "",
            phone: employee.phone || "",
            first_name: employee.first_name || "",
            last_name: employee.last_name || "",
            role: employee.role || "CASHIER",
            password: "",
            password2: ""
        });

        setModalMode("edit");

    };


    /* =========================================================
       VALIDATION
    ========================================================= */

    const validateForm = (isEdit = false) => {

        if (!formData.username.trim()) {
            toast.error("اسم المستخدم مطلوب");
            return false;
        }

        if (!formData.role) {
            toast.error("الدور الوظيفي مطلوب");
            return false;
        }

        if (!isEdit && !formData.password) {
            toast.error("كلمة المرور مطلوبة");
            return false;
        }

        if (formData.password) {

            if (formData.password.length < 6) {
                toast.error(
                    "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
                );

                return false;
            }

            if (formData.password !== formData.password2) {
                toast.error("كلمة المرور غير متطابقة");
                return false;
            }
        }

        return true;
    };


    /* =========================================================
       API ERROR
    ========================================================= */

    const getApiError = (error, fallback) => {

        const data = error?.response?.data;

        if (!data) {
            return fallback;
        }

        if (data.username?.[0]) {
            return data.username[0];
        }

        if (data.email?.[0]) {
            return data.email[0];
        }

        if (data.phone?.[0]) {
            return data.phone[0];
        }

        if (data.role?.[0]) {
            return data.role[0];
        }

        if (data.password?.[0]) {
            return data.password[0];
        }

        if (data.detail) {
            return data.detail;
        }

        return fallback;
    };


    /* =========================================================
       CREATE
    ========================================================= */

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!validateForm(false)) {
            return;
        }

        try {

            setSaving(true);

            const payload = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                role: formData.role,
                password: formData.password
            };

            await createEmployee(payload);

            toast.success("تم إضافة الموظف بنجاح");

            closeModal();

            await loadEmployees();

        } catch (error) {

            console.error("CREATE EMPLOYEE ERROR:", error);

            toast.error(
                getApiError(
                    error,
                    "فشل إضافة الموظف"
                )
            );

        } finally {

            setSaving(false);

        }
    };


    /* =========================================================
       UPDATE
    ========================================================= */

    const handleEdit = async (event) => {

        event.preventDefault();

        if (!editingEmployee) {
            return;
        }

        if (!validateForm(true)) {
            return;
        }

        try {

            setSaving(true);

            const payload = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                role: formData.role
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            await updateEmployee(
                editingEmployee.id,
                payload
            );

            toast.success("تم تحديث الموظف بنجاح");

            closeModal();

            await loadEmployees();

        } catch (error) {

            console.error("UPDATE EMPLOYEE ERROR:", error);

            toast.error(
                getApiError(
                    error,
                    "فشل تحديث الموظف"
                )
            );

        } finally {

            setSaving(false);

        }
    };


    /* =========================================================
       DELETE
    ========================================================= */

    const handleDelete = async (employee) => {

        const confirmed = window.confirm(
            `هل أنت متأكد من حذف الموظف "${employee.username}"؟\n\nلا يمكن التراجع عن هذا الإجراء.`
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(employee.id);

            await deleteEmployee(employee.id);

            toast.success("تم حذف الموظف بنجاح");

            await loadEmployees();

        } catch (error) {

            console.error("DELETE EMPLOYEE ERROR:", error);

            toast.error(
                getApiError(
                    error,
                    "فشل حذف الموظف"
                )
            );

        } finally {

            setDeletingId(null);

        }
    };


    /* =========================================================
       HELPERS
    ========================================================= */

    const getRoleInfo = (role) => {

        return (
            ROLES.find((item) => item.value === role) || {
                label: role || "-",
                className: "bg-gray-100 text-gray-700"
            }
        );

    };


    const getFullName = (employee) => {

        const fullName = [
            employee.first_name,
            employee.last_name
        ]
            .filter(Boolean)
            .join(" ")
            .trim();

        return fullName || employee.username || "-";

    };


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        try {

            return new Date(date).toLocaleDateString(
                "ar-EG",
                {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                }
            );

        } catch {
            return "-";
        }

    };


    /* =========================================================
       STATS
    ========================================================= */

    const stats = useMemo(() => {

        const staff = employees.filter(
            (employee) => employee.role !== "CUSTOMER"
        );

        const active = staff.filter(
            (employee) => employee.is_active !== false
        );

        const pharmacists = staff.filter(
            (employee) => employee.role === "PHARMACIST"
        );

        const managers = staff.filter(
            (employee) =>
                employee.role === "MANAGER" ||
                employee.role === "OWNER"
        );

        return {
            total: staff.length,
            active: active.length,
            pharmacists: pharmacists.length,
            managers: managers.length
        };

    }, [employees]);


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {

        return (
            <div
                dir="rtl"
                className="min-h-[500px] flex items-center justify-center"
            >
                <Loading />
            </div>
        );

    }


    /* =========================================================
       UI
    ========================================================= */

    return (

        <div
            dir="rtl"
            className="space-y-6 pb-10"
        >

            {/* HEADER */}

            <PageHeader
                title="الموظفين"
                subtitle="إدارة موظفي الصيدلية والصلاحيات الوظيفية"
                action={
                    <PrimaryButton
                        onClick={openAddModal}
                    >
                        <Plus
                            size={18}
                            className="ml-2"
                        />

                        إضافة موظف
                    </PrimaryButton>
                }
            />


            {/* STATS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                <StatCard
                    icon={<Users size={21} />}
                    title="إجمالي الموظفين"
                    value={stats.total}
                    iconClass="bg-purple-100 text-[#5B2A86]"
                />

                <StatCard
                    icon={<CheckCircle size={21} />}
                    title="الموظفين النشطين"
                    value={stats.active}
                    iconClass="bg-green-100 text-green-600"
                />

                <StatCard
                    icon={<ShieldCheck size={21} />}
                    title="الصيادلة"
                    value={stats.pharmacists}
                    iconClass="bg-cyan-100 text-cyan-600"
                />

                <StatCard
                    icon={<BriefcaseBusiness size={21} />}
                    title="الإدارة"
                    value={stats.managers}
                    iconClass="bg-blue-100 text-blue-600"
                />

            </div>


            {/* FILTERS */}

            <Card>

                <div className="flex flex-col lg:flex-row gap-4">

                    <div className="flex-1">

                        <SearchBox
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="ابحث باسم المستخدم أو الاسم أو البريد أو الهاتف..."
                        />

                    </div>


                    <div className="w-full lg:w-56">

                        <select
                            value={roleFilter}
                            onChange={(event) =>
                                setRoleFilter(event.target.value)
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
                                focus:ring-2
                                focus:ring-[#5B2A86]
                            "
                        >

                            <option value="all">
                                جميع الأدوار
                            </option>

                            {ROLES.map((role) => (

                                <option
                                    key={role.value}
                                    value={role.value}
                                >
                                    {role.label}
                                </option>

                            ))}

                        </select>

                    </div>


                    <button
                        type="button"
                        onClick={() => loadEmployees()}
                        disabled={refreshing}
                        className="
                            px-5
                            py-3
                            rounded-xl
                            bg-gray-100
                            hover:bg-gray-200
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            transition
                            flex
                            items-center
                            justify-center
                            gap-2
                            font-semibold
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


            {/* TABLE */}

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-sm
                    border
                    border-gray-100
                    overflow-hidden
                "
            >

                {/* TABLE HEADER */}

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
                        gap-3
                    "
                >

                    <div>

                        <h2 className="text-xl font-black text-gray-800">
                            قائمة الموظفين
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            {filteredEmployees.length} موظف
                        </p>

                    </div>


                    {(search || roleFilter !== "all") && (

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setRoleFilter("all");
                            }}
                            className="
                                text-sm
                                text-[#5B2A86]
                                hover:underline
                                font-semibold
                            "
                        >
                            مسح الفلاتر
                        </button>

                    )}

                </div>


                {/* EMPTY */}

                {filteredEmployees.length === 0 ? (

                    <div className="py-20 text-center">

                        <div
                            className="
                                w-16
                                h-16
                                mx-auto
                                mb-5
                                rounded-2xl
                                bg-gray-100
                                text-gray-400
                                flex
                                items-center
                                justify-center
                            "
                        >

                            {search || roleFilter !== "all" ? (
                                <Search size={28} />
                            ) : (
                                <Users size={28} />
                            )}

                        </div>

                        <h3 className="font-bold text-lg text-gray-700">
                            {search || roleFilter !== "all"
                                ? "لا توجد نتائج"
                                : "لا يوجد موظفين"
                            }
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                            {search || roleFilter !== "all"
                                ? "جرب تغيير كلمات البحث أو الفلاتر"
                                : "ابدأ بإضافة أول موظف إلى النظام"
                            }
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-right">

                            <thead className="bg-gray-50 border-b">

                                <tr>

                                    <th className="px-6 py-4 font-bold">
                                        الموظف
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        التواصل
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        الدور
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        الحالة
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        تاريخ التسجيل
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        الإجراءات
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredEmployees.map((employee) => {

                                    const roleInfo =
                                        getRoleInfo(employee.role);

                                    const fullName =
                                        getFullName(employee);

                                    const isDeleting =
                                        deletingId === employee.id;

                                    return (

                                        <tr
                                            key={employee.id}
                                            className="
                                                border-b
                                                last:border-0
                                                hover:bg-gray-50
                                                transition
                                            "
                                        >

                                            {/* EMPLOYEE */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-3">

                                                    <div
                                                        className="
                                                            w-11
                                                            h-11
                                                            rounded-xl
                                                            bg-[#5B2A86]
                                                            text-white
                                                            flex
                                                            items-center
                                                            justify-center
                                                            font-black
                                                            text-lg
                                                            shrink-0
                                                        "
                                                    >
                                                        {employee.username
                                                            ?.charAt(0)
                                                            ?.toUpperCase() || "U"}
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="font-bold text-gray-800 truncate">
                                                            {fullName}
                                                        </p>

                                                        <p className="text-sm text-gray-500 truncate">
                                                            @{employee.username}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CONTACT */}

                                            <td className="px-6 py-5">

                                                <div className="space-y-1">

                                                    <div className="flex items-center gap-2 text-sm text-gray-600">

                                                        <Mail size={14} />

                                                        <span>
                                                            {employee.email || "-"}
                                                        </span>

                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-gray-500">

                                                        <Phone size={14} />

                                                        <span dir="ltr">
                                                            {employee.phone || "-"}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* ROLE */}

                                            <td className="px-6 py-5">

                                                <span
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        px-3
                                                        py-1.5
                                                        rounded-full
                                                        text-sm
                                                        font-bold
                                                        ${roleInfo.className}
                                                    `}
                                                >

                                                    <ShieldCheck size={15} />

                                                    {roleInfo.label}

                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td className="px-6 py-5">

                                                {employee.is_active !== false ? (

                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            px-3
                                                            py-1.5
                                                            rounded-full
                                                            bg-green-50
                                                            text-green-700
                                                            text-sm
                                                            font-bold
                                                        "
                                                    >

                                                        <CheckCircle size={15} />

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
                                                            bg-red-50
                                                            text-red-700
                                                            text-sm
                                                            font-bold
                                                        "
                                                    >

                                                        <XCircle size={15} />

                                                        غير نشط

                                                    </span>

                                                )}

                                            </td>


                                            {/* DATE */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-2 text-sm text-gray-500">

                                                    <CalendarDays size={15} />

                                                    {formatDate(
                                                        employee.date_joined
                                                    )}

                                                </div>

                                            </td>


                                            {/* ACTIONS */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(employee)
                                                        }
                                                        disabled={isDeleting}
                                                        className="
                                                            w-9
                                                            h-9
                                                            rounded-lg
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-blue-600
                                                            hover:bg-blue-50
                                                            disabled:opacity-40
                                                            transition
                                                        "
                                                        title="تعديل الموظف"
                                                    >

                                                        <Edit size={17} />

                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(employee)
                                                        }
                                                        disabled={isDeleting}
                                                        className="
                                                            w-9
                                                            h-9
                                                            rounded-lg
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-red-600
                                                            hover:bg-red-50
                                                            disabled:opacity-40
                                                            transition
                                                        "
                                                        title="حذف الموظف"
                                                    >

                                                        {isDeleting ? (

                                                            <RefreshCw
                                                                size={17}
                                                                className="animate-spin"
                                                            />

                                                        ) : (

                                                            <Trash2 size={17} />

                                                        )}

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* MODAL */}

            {modalMode && (

                <EmployeeModal
                    mode={modalMode}
                    formData={formData}
                    saving={saving}
                    onChange={handleChange}
                    onSubmit={
                        modalMode === "add"
                            ? handleSubmit
                            : handleEdit
                    }
                    onClose={closeModal}
                />

            )}

        </div>

    );
}


/* =============================================================
   STAT CARD
============================================================= */

function StatCard({
    icon,
    title,
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
            "
        >

            <div className="flex items-center gap-4">

                <div
                    className={`
                        w-12
                        h-12
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        ${iconClass}
                    `}
                >
                    {icon}
                </div>

                <div>

                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <p className="text-2xl font-black text-gray-800 mt-1">
                        {value}
                    </p>

                </div>

            </div>

        </div>

    );
}


/* =============================================================
   EMPLOYEE MODAL
============================================================= */

function EmployeeModal({
    mode,
    formData,
    saving,
    onChange,
    onSubmit,
    onClose
}) {

    const isEdit = mode === "edit";

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
            onMouseDown={(event) => {

                if (event.target === event.currentTarget) {
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
                    max-w-2xl
                    max-h-[92vh]
                    overflow-hidden
                    flex
                    flex-col
                "
            >

                {/* HEADER */}

                <div
                    className="
                        px-6
                        py-5
                        border-b
                        bg-white
                        flex
                        items-center
                        justify-between
                        shrink-0
                    "
                >

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

                            {isEdit ? (
                                <Edit size={21} />
                            ) : (
                                <UserRound size={21} />
                            )}

                        </div>

                        <div>

                            <h2 className="text-xl font-black text-gray-800">
                                {isEdit
                                    ? "تعديل بيانات الموظف"
                                    : "إضافة موظف جديد"
                                }
                            </h2>

                            <p className="text-sm text-gray-500 mt-0.5">
                                {isEdit
                                    ? "تحديث بيانات الموظف والصلاحيات"
                                    : "إضافة موظف جديد إلى النظام"
                                }
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="
                            w-9
                            h-9
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            text-gray-500
                            hover:bg-red-50
                            hover:text-red-500
                            disabled:opacity-40
                            transition
                        "
                    >

                        <X size={21} />

                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={onSubmit}
                    className="overflow-y-auto"
                >

                    <div className="p-6 space-y-6">

                        {/* BASIC INFO */}

                        <FormSection
                            icon={<UserRound size={18} />}
                            title="البيانات الشخصية"
                        >

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <InputField
                                    label="الاسم الأول"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={onChange}
                                    placeholder="أحمد"
                                />

                                <InputField
                                    label="الاسم الأخير"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={onChange}
                                    placeholder="محمد"
                                />

                            </div>

                        </FormSection>


                        {/* ACCOUNT */}

                        <FormSection
                            icon={<ShieldCheck size={18} />}
                            title="بيانات الحساب"
                        >

                            <div className="space-y-4">

                                <InputField
                                    label="اسم المستخدم"
                                    name="username"
                                    value={formData.username}
                                    onChange={onChange}
                                    placeholder="username"
                                    required
                                />


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <InputField
                                        label="البريد الإلكتروني"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={onChange}
                                        placeholder="example@email.com"
                                    />

                                    <InputField
                                        label="رقم الهاتف"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={onChange}
                                        placeholder="01012345678"
                                    />

                                </div>


                                <div>

                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        الدور الوظيفي *
                                    </label>

                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={onChange}
                                        required
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
                                            focus:ring-2
                                            focus:ring-[#5B2A86]
                                        "
                                    >

                                        {ROLES
                                            .filter(
                                                (role) =>
                                                    role.value !== "OWNER"
                                            )
                                            .map((role) => (

                                                <option
                                                    key={role.value}
                                                    value={role.value}
                                                >
                                                    {role.label}
                                                </option>

                                            ))}

                                    </select>

                                </div>

                            </div>

                        </FormSection>


                        {/* PASSWORD */}

                        <FormSection
                            icon={<KeyRound size={18} />}
                            title={
                                isEdit
                                    ? "تغيير كلمة المرور"
                                    : "أمان الحساب"
                            }
                        >

                            {isEdit && (

                                <div
                                    className="
                                        mb-4
                                        rounded-xl
                                        bg-blue-50
                                        border
                                        border-blue-100
                                        px-4
                                        py-3
                                        text-sm
                                        text-blue-700
                                    "
                                >
                                    اترك حقول كلمة المرور فارغة إذا كنت لا تريد تغييرها.
                                </div>

                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <InputField
                                    label={
                                        isEdit
                                            ? "كلمة المرور الجديدة"
                                            : "كلمة المرور"
                                    }
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={onChange}
                                    placeholder="••••••••"
                                    required={!isEdit}
                                    minLength={6}
                                />

                                <InputField
                                    label={
                                        isEdit
                                            ? "تأكيد كلمة المرور الجديدة"
                                            : "تأكيد كلمة المرور"
                                    }
                                    name="password2"
                                    type="password"
                                    value={formData.password2}
                                    onChange={onChange}
                                    placeholder="••••••••"
                                    required={!isEdit && true}
                                />

                            </div>

                            <p className="text-xs text-gray-500 mt-3">
                                يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.
                            </p>

                        </FormSection>

                    </div>


                    {/* FOOTER */}

                    <div
                        className="
                            sticky
                            bottom-0
                            bg-white
                            border-t
                            px-6
                            py-4
                            flex
                            justify-end
                            gap-3
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
                                bg-gray-100
                                hover:bg-gray-200
                                disabled:opacity-50
                                transition
                                font-semibold
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
                                    : "إضافة الموظف"
                            }

                        </PrimaryButton>

                    </div>

                </form>

            </div>

        </div>

    );
}


/* =============================================================
   FORM SECTION
============================================================= */

function FormSection({
    icon,
    title,
    children
}) {

    return (

        <section>

            <div className="flex items-center gap-2 mb-4">

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
                    {icon}
                </div>

                <h3 className="font-black text-gray-800">
                    {title}
                </h3>

            </div>

            {children}

        </section>

    );
}


/* =============================================================
   INPUT
============================================================= */

function InputField({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder,
    required = false,
    minLength
}) {

    return (

        <div>

            <label className="block text-sm font-bold text-gray-700 mb-2">

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
                autoComplete={
                    type === "password"
                        ? "new-password"
                        : "off"
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
                    placeholder:text-gray-400
                    focus:border-[#5B2A86]
                    focus:ring-2
                    focus:ring-[#5B2A86]/10
                "
            />

        </div>

    );
}