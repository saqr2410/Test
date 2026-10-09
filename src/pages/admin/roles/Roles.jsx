import { useEffect, useMemo, useState } from "react";

import {
    Shield,
    Plus,
    Search,
    RefreshCw,
    Trash2,
    Edit3,
    X,
    Check,
    Users,
    KeyRound,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    AlertTriangle,
    Loader2,
    CheckCircle2,
} from "lucide-react";

import {
    getRoles,
    deleteRole,
    createRole,
    updateRole,
    getPermissions,
} from "../../../services/roles/roleService";

import PageHeader from "../../../components/ui/layout/PageHeader";
import Loading from "../../../components/ui/feedback/Loading";
import toast from "react-hot-toast";


const EMPTY_FORM = {
    name: "",
    permissions: [],
};


const getErrorMessage = (error, fallback) => {
    return (
        error?.response?.data?.name?.[0] ||
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        fallback
    );
};


export default function Roles() {

    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [search, setSearch] = useState("");

    const [modal, setModal] = useState(null);
    const [editingRole, setEditingRole] = useState(null);

    const [formData, setFormData] = useState(EMPTY_FORM);

    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 8;


    // =========================================================
    // LOAD DATA
    // =========================================================

    const loadData = async (showRefresh = false) => {

        try {

            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const [
                rolesData,
                permissionsData,
            ] = await Promise.all([
                getRoles(),
                getPermissions(),
            ]);

            const normalizedRoles =
                Array.isArray(rolesData)
                    ? rolesData
                    : rolesData?.results || [];

            const normalizedPermissions =
                Array.isArray(permissionsData)
                    ? permissionsData
                    : permissionsData?.results || [];

            setRoles(normalizedRoles);
            setPermissions(normalizedPermissions);

        } catch (error) {

            console.error("ROLES ERROR:", error);

            toast.error(
                getErrorMessage(
                    error,
                    "فشل تحميل الأدوار والصلاحيات"
                )
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    useEffect(() => {
        loadData();
    }, []);


    // =========================================================
    // FILTER
    // =========================================================

    const filteredRoles = useMemo(() => {

        const query = search
            .trim()
            .toLowerCase();

        if (!query) {
            return roles;
        }

        return roles.filter((role) => {

            const roleName =
                role.name?.toLowerCase() || "";

            const roleId =
                role.id?.toString() || "";

            return (
                roleName.includes(query) ||
                roleId.includes(query)
            );

        });

    }, [roles, search]);


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredRoles.length /
            ITEMS_PER_PAGE
        )
    );


    useEffect(() => {

        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }

    }, [currentPage, totalPages]);


    const paginatedRoles = useMemo(() => {

        const start =
            (currentPage - 1) *
            ITEMS_PER_PAGE;

        return filteredRoles.slice(
            start,
            start + ITEMS_PER_PAGE
        );

    }, [
        filteredRoles,
        currentPage,
    ]);


    useEffect(() => {
        setCurrentPage(1);
    }, [search]);


    // =========================================================
    // STATISTICS
    // =========================================================

    const statistics = useMemo(() => {

        const totalUsers = roles.reduce(
            (sum, role) =>
                sum + Number(role.users_count || 0),
            0
        );

        const totalAssignedPermissions =
            roles.reduce(
                (sum, role) =>
                    sum +
                    Number(
                        role.permissions?.length || 0
                    ),
                0
            );

        const protectedRoles =
            roles.filter(
                role =>
                    role.is_system === true ||
                    role.is_default === true
            ).length;

        return {
            roles: roles.length,
            users: totalUsers,
            permissions: totalAssignedPermissions,
            protectedRoles,
        };

    }, [roles]);


    // =========================================================
    // FORM
    // =========================================================

    const resetForm = () => {
        setFormData({
            ...EMPTY_FORM,
            permissions: [],
        });
    };


    const closeModal = () => {

        if (saving) {
            return;
        }

        setModal(null);
        setEditingRole(null);
        resetForm();

    };


    const openCreateModal = () => {

        resetForm();
        setEditingRole(null);
        setModal("create");

    };


    const openEditModal = (role) => {

        setEditingRole(role);

        setFormData({
            name: role.name || "",
            permissions:
                role.permissions?.map(
                    permission =>
                        permission.id
                ) || [],
        });

        setModal("edit");

    };


    const handleInputChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

    };


    // =========================================================
    // PERMISSIONS
    // =========================================================

    const togglePermission = (permissionId) => {

        setFormData(prev => {

            const selected =
                prev.permissions || [];

            const exists =
                selected.includes(permissionId);

            return {
                ...prev,
                permissions: exists
                    ? selected.filter(
                        id =>
                            id !== permissionId
                    )
                    : [
                        ...selected,
                        permissionId,
                    ],
            };

        });

    };


    const selectAllPermissions = () => {

        setFormData(prev => ({
            ...prev,
            permissions:
                permissions.map(
                    permission =>
                        permission.id
                ),
        }));

    };


    const clearAllPermissions = () => {

        setFormData(prev => ({
            ...prev,
            permissions: [],
        }));

    };


    // =========================================================
    // SAVE
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        const name =
            formData.name.trim();

        if (!name) {
            toast.error("اسم الدور مطلوب");
            return;
        }

        if (name.length < 2) {
            toast.error(
                "اسم الدور يجب أن يكون حرفين على الأقل"
            );
            return;
        }

        try {

            setSaving(true);

            const payload = {
                name,
                permissions:
                    formData.permissions,
            };


            if (modal === "create") {

                await createRole(payload);

                toast.success(
                    "تم إنشاء الدور بنجاح"
                );

            } else {

                await updateRole(
                    editingRole.id,
                    payload
                );

                toast.success(
                    "تم تحديث الدور بنجاح"
                );

            }

            closeModal();

            await loadData();

        } catch (error) {

            console.error(
                "ROLE SAVE ERROR:",
                error
            );

            toast.error(
                getErrorMessage(
                    error,
                    modal === "create"
                        ? "فشل إنشاء الدور"
                        : "فشل تحديث الدور"
                )
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (role) => {

        if (
            role.is_system ||
            role.is_default
        ) {

            toast.error(
                "لا يمكن حذف دور أساسي في النظام"
            );

            return;
        }


        const confirmed =
            window.confirm(
                `هل أنت متأكد من حذف الدور "${role.name}"؟`
            );

        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(role.id);

            await deleteRole(role.id);

            toast.success(
                "تم حذف الدور بنجاح"
            );

            await loadData();

        } catch (error) {

            console.error(
                "DELETE ROLE ERROR:",
                error
            );

            toast.error(
                getErrorMessage(
                    error,
                    "فشل حذف الدور"
                )
            );

        } finally {

            setDeletingId(null);

        }

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
                <Loading />
            </div>
        );
    }


    // =========================================================
    // UI
    // =========================================================

    return (

        <div
            dir="rtl"
            className="
                min-h-full
                space-y-6
                pb-10
            "
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <PageHeader
                title="الأدوار والصلاحيات"
                subtitle="إدارة صلاحيات المستخدمين والتحكم في الوصول إلى النظام"
                action={
                    <button
                        onClick={openCreateModal}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-5
                            py-3
                            rounded-xl
                            bg-[#5B2A86]
                            text-white
                            font-bold
                            shadow-sm
                            hover:bg-[#4b226e]
                            hover:shadow-md
                            active:scale-[0.98]
                            transition-all
                        "
                    >
                        <Plus size={19} />
                        إضافة دور
                    </button>
                }
            />


            {/* ================================================= */}
            {/* STATISTICS */}
            {/* ================================================= */}

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
                    title="إجمالي الأدوار"
                    value={statistics.roles}
                    icon={Shield}
                    iconClass="text-purple-600"
                    iconBg="bg-purple-100"
                />

                <StatCard
                    title="المستخدمون"
                    value={statistics.users}
                    icon={Users}
                    iconClass="text-blue-600"
                    iconBg="bg-blue-100"
                />

                <StatCard
                    title="الصلاحيات المخصصة"
                    value={statistics.permissions}
                    icon={KeyRound}
                    iconClass="text-emerald-600"
                    iconBg="bg-emerald-100"
                />

                <StatCard
                    title="الأدوار المحمية"
                    value={statistics.protectedRoles}
                    icon={ShieldCheck}
                    iconClass="text-orange-600"
                    iconBg="bg-orange-100"
                />

            </div>


            {/* ================================================= */}
            {/* SEARCH / TOOLBAR */}
            {/* ================================================= */}

            <div
                className="
                    bg-white
                    border
                    border-gray-100
                    rounded-2xl
                    shadow-sm
                    p-4
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
                            onChange={e =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="ابحث باسم الدور أو رقم الدور..."
                            className="
                                w-full
                                h-12
                                pr-11
                                pl-4
                                rounded-xl
                                border
                                border-gray-200
                                bg-gray-50
                                text-sm
                                outline-none
                                transition
                                focus:bg-white
                                focus:border-[#5B2A86]
                                focus:ring-4
                                focus:ring-purple-100
                            "
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                    hover:text-gray-700
                                "
                            >
                                <X size={17} />
                            </button>
                        )}

                    </div>


                    <button
                        onClick={() =>
                            loadData(true)
                        }
                        disabled={refreshing}
                        className="
                            h-12
                            px-5
                            rounded-xl
                            border
                            border-gray-200
                            bg-gray-50
                            hover:bg-gray-100
                            disabled:opacity-50
                            transition
                            flex
                            items-center
                            justify-center
                            gap-2
                            font-semibold
                            text-gray-700
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


                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-3
                        mt-4
                        pt-4
                        border-t
                        border-gray-100
                    "
                >

                    <p className="text-sm text-gray-500">

                        عرض{" "}
                        <span className="font-bold text-gray-800">
                            {filteredRoles.length}
                        </span>{" "}
                        من{" "}
                        <span className="font-bold text-gray-800">
                            {roles.length}
                        </span>{" "}
                        دور

                    </p>

                    {search && (
                        <span
                            className="
                                text-xs
                                px-3
                                py-1.5
                                rounded-lg
                                bg-purple-50
                                text-purple-700
                                font-semibold
                            "
                        >
                            نتائج البحث
                        </span>
                    )}

                </div>

            </div>


            {/* ================================================= */}
            {/* TABLE */}
            {/* ================================================= */}

            <div
                className="
                    bg-white
                    border
                    border-gray-100
                    rounded-2xl
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
                        gap-3
                    "
                >

                    <div>

                        <h2 className="text-lg font-black text-gray-900">
                            قائمة الأدوار
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            إدارة الأدوار والصلاحيات المرتبطة بها
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
                        <Shield size={17} />
                        {roles.length} دور
                    </div>

                </div>


                {paginatedRoles.length === 0 ? (

                    <EmptyState
                        hasSearch={Boolean(search)}
                        onClear={() => setSearch("")}
                        onCreate={openCreateModal}
                    />

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[850px]">

                            <thead>

                                <tr
                                    className="
                                        bg-gray-50/80
                                        border-b
                                        border-gray-100
                                    "
                                >

                                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase">
                                        الدور
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase">
                                        الصلاحيات
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase">
                                        المستخدمون
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase">
                                        الحالة
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase">
                                        الإجراءات
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {paginatedRoles.map(
                                    (role) => {

                                        const permissionCount =
                                            role.permissions?.length || 0;

                                        const usersCount =
                                            role.users_count || 0;

                                        const isProtected =
                                            role.is_system ||
                                            role.is_default;

                                        const isDeleting =
                                            deletingId === role.id;

                                        return (

                                            <tr
                                                key={role.id}
                                                className="
                                                    border-b
                                                    last:border-0
                                                    border-gray-100
                                                    hover:bg-gray-50/70
                                                    transition
                                                "
                                            >

                                                {/* ROLE */}

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-3">

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
                                                                border
                                                                border-purple-100
                                                            "
                                                        >
                                                            <Shield
                                                                size={20}
                                                            />
                                                        </div>

                                                        <div>

                                                            <div className="flex items-center gap-2">

                                                                <p className="font-bold text-gray-900">
                                                                    {role.name}
                                                                </p>

                                                                {isProtected && (
                                                                    <span
                                                                        className="
                                                                            text-[10px]
                                                                            px-2
                                                                            py-1
                                                                            rounded-full
                                                                            bg-orange-50
                                                                            text-orange-700
                                                                            font-bold
                                                                        "
                                                                    >
                                                                        محمي
                                                                    </span>
                                                                )}

                                                            </div>

                                                            <p className="text-xs text-gray-400 mt-1">
                                                                ID: #{role.id}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* PERMISSIONS */}

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-2">

                                                        <div
                                                            className="
                                                                w-9
                                                                h-9
                                                                rounded-lg
                                                                bg-blue-50
                                                                text-blue-600
                                                                flex
                                                                items-center
                                                                justify-center
                                                            "
                                                        >
                                                            <KeyRound
                                                                size={17}
                                                            />
                                                        </div>

                                                        <div>

                                                            <p className="font-bold text-gray-800">
                                                                {permissionCount}
                                                            </p>

                                                            <p className="text-xs text-gray-400">
                                                                صلاحية
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* USERS */}

                                                <td className="px-6 py-5">

                                                    <div className="flex items-center gap-2">

                                                        <div
                                                            className="
                                                                w-9
                                                                h-9
                                                                rounded-lg
                                                                bg-emerald-50
                                                                text-emerald-600
                                                                flex
                                                                items-center
                                                                justify-center
                                                            "
                                                        >
                                                            <Users
                                                                size={17}
                                                            />
                                                        </div>

                                                        <div>

                                                            <p className="font-bold text-gray-800">
                                                                {usersCount}
                                                            </p>

                                                            <p className="text-xs text-gray-400">
                                                                مستخدم
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* STATUS */}

                                                <td className="px-6 py-5">

                                                    {isProtected ? (

                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                px-3
                                                                py-1.5
                                                                rounded-full
                                                                bg-orange-50
                                                                text-orange-700
                                                                text-xs
                                                                font-bold
                                                            "
                                                        >
                                                            <ShieldCheck
                                                                size={14}
                                                            />
                                                            دور أساسي
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
                                                                bg-green-50
                                                                text-green-700
                                                                text-xs
                                                                font-bold
                                                            "
                                                        >
                                                            <CheckCircle2
                                                                size={14}
                                                            />
                                                            نشط
                                                        </span>

                                                    )}

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="px-6 py-5">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                        "
                                                    >

                                                        <button
                                                            onClick={() =>
                                                                openEditModal(
                                                                    role
                                                                )
                                                            }
                                                            className="
                                                                w-9
                                                                h-9
                                                                rounded-lg
                                                                bg-blue-50
                                                                text-blue-600
                                                                hover:bg-blue-100
                                                                flex
                                                                items-center
                                                                justify-center
                                                                transition
                                                            "
                                                            title="تعديل الدور"
                                                        >
                                                            <Edit3
                                                                size={17}
                                                            />
                                                        </button>


                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    role
                                                                )
                                                            }
                                                            disabled={
                                                                isProtected ||
                                                                isDeleting
                                                            }
                                                            className="
                                                                w-9
                                                                h-9
                                                                rounded-lg
                                                                bg-red-50
                                                                text-red-600
                                                                hover:bg-red-100
                                                                disabled:opacity-30
                                                                disabled:cursor-not-allowed
                                                                flex
                                                                items-center
                                                                justify-center
                                                                transition
                                                            "
                                                            title={
                                                                isProtected
                                                                    ? "لا يمكن حذف الدور الأساسي"
                                                                    : "حذف الدور"
                                                            }
                                                        >

                                                            {isDeleting ? (
                                                                <Loader2
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


                {/* PAGINATION */}

                {filteredRoles.length > ITEMS_PER_PAGE && (

                    <div
                        className="
                            px-6
                            py-4
                            border-t
                            border-gray-100
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >

                        <p className="text-sm text-gray-500">

                            صفحة{" "}
                            <span className="font-bold text-gray-800">
                                {currentPage}
                            </span>{" "}
                            من{" "}
                            <span className="font-bold text-gray-800">
                                {totalPages}
                            </span>

                        </p>


                        <div className="flex items-center gap-2">

                            <button
                                onClick={() =>
                                    setCurrentPage(
                                        prev =>
                                            Math.max(
                                                1,
                                                prev - 1
                                            )
                                    )
                                }
                                disabled={
                                    currentPage === 1
                                }
                                className="
                                    w-9
                                    h-9
                                    rounded-lg
                                    border
                                    border-gray-200
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-gray-50
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                "
                            >
                                <ChevronRight
                                    size={18}
                                />
                            </button>


                            {Array.from(
                                {
                                    length: totalPages,
                                },
                                (_, index) =>
                                    index + 1
                            )
                                .slice(
                                    Math.max(
                                        0,
                                        currentPage - 3
                                    ),
                                    Math.min(
                                        totalPages,
                                        currentPage + 2
                                    )
                                )
                                .map(page => (

                                    <button
                                        key={page}
                                        onClick={() =>
                                            setCurrentPage(
                                                page
                                            )
                                        }
                                        className={`
                                            w-9
                                            h-9
                                            rounded-lg
                                            text-sm
                                            font-bold
                                            transition
                                            ${currentPage === page
                                                ? "bg-[#5B2A86] text-white"
                                                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }
                                        `}
                                    >
                                        {page}
                                    </button>

                                ))}


                            <button
                                onClick={() =>
                                    setCurrentPage(
                                        prev =>
                                            Math.min(
                                                totalPages,
                                                prev + 1
                                            )
                                    )
                                }
                                disabled={
                                    currentPage === totalPages
                                }
                                className="
                                    w-9
                                    h-9
                                    rounded-lg
                                    border
                                    border-gray-200
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-gray-50
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                "
                            >
                                <ChevronLeft
                                    size={18}
                                />
                            </button>

                        </div>

                    </div>

                )}

            </div>


            {/* ================================================= */}
            {/* MODAL */}
            {/* ================================================= */}

            {modal && (

                <RoleModal
                    mode={modal}
                    formData={formData}
                    permissions={permissions}
                    saving={saving}
                    onChange={handleInputChange}
                    onTogglePermission={
                        togglePermission
                    }
                    onSelectAll={
                        selectAllPermissions
                    }
                    onClearAll={
                        clearAllPermissions
                    }
                    onSubmit={
                        handleSubmit
                    }
                    onClose={
                        closeModal
                    }
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
    iconBg,
}) {

    return (

        <div
            className="
                bg-white
                border
                border-gray-100
                rounded-2xl
                shadow-sm
                p-5
                hover:shadow-md
                transition
            "
        >

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-gray-500 font-medium">
                        {title}
                    </p>

                    <p className="text-2xl font-black text-gray-900 mt-2">
                        {Number(value).toLocaleString(
                            "ar-EG"
                        )}
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
                        ${iconBg}
                        ${iconClass}
                    `}
                >

                    <Icon size={22} />

                </div>

            </div>

        </div>

    );

}


// =============================================================
// EMPTY STATE
// =============================================================

function EmptyState({
    hasSearch,
    onClear,
    onCreate,
}) {

    return (

        <div
            className="
                flex
                flex-col
                items-center
                justify-center
                py-20
                px-6
                text-center
            "
        >

            <div
                className="
                    w-20
                    h-20
                    rounded-2xl
                    bg-purple-50
                    text-[#5B2A86]
                    flex
                    items-center
                    justify-center
                    mb-5
                "
            >

                {hasSearch ? (
                    <Search size={34} />
                ) : (
                    <Shield size={34} />
                )}

            </div>


            <h3 className="text-lg font-black text-gray-900">

                {hasSearch
                    ? "لا توجد نتائج"
                    : "لا توجد أدوار"}

            </h3>


            <p className="text-sm text-gray-500 mt-2 max-w-sm">

                {hasSearch
                    ? "لم يتم العثور على دور مطابق لبحثك."
                    : "ابدأ بإنشاء أول دور لإدارة صلاحيات المستخدمين."}

            </p>


            <div className="flex gap-3 mt-6">

                {hasSearch && (
                    <button
                        onClick={onClear}
                        className="
                            px-4
                            py-2.5
                            rounded-xl
                            bg-gray-100
                            hover:bg-gray-200
                            font-semibold
                            text-sm
                        "
                    >
                        مسح البحث
                    </button>
                )}


                {!hasSearch && (
                    <button
                        onClick={onCreate}
                        className="
                            px-4
                            py-2.5
                            rounded-xl
                            bg-[#5B2A86]
                            hover:bg-[#4b226e]
                            text-white
                            font-bold
                            text-sm
                        "
                    >
                        إنشاء دور
                    </button>
                )}

            </div>

        </div>

    );

}


// =============================================================
// ROLE MODAL
// =============================================================

function RoleModal({
    mode,
    formData,
    permissions,
    saving,
    onChange,
    onTogglePermission,
    onSelectAll,
    onClearAll,
    onSubmit,
    onClose,
}) {

    const isEdit =
        mode === "edit";


    return (

        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                p-4
                bg-black/50
                backdrop-blur-sm
            "
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget &&
                    !saving
                ) {
                    onClose();
                }

            }}
        >

            <div
                className="
                    w-full
                    max-w-2xl
                    max-h-[92vh]
                    bg-white
                    rounded-3xl
                    shadow-2xl
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
                        border-gray-100
                        flex
                        items-center
                        justify-between
                        bg-white
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
                            <ShieldCheck
                                size={22}
                            />
                        </div>

                        <div>

                            <h2 className="text-xl font-black text-gray-900">
                                {isEdit
                                    ? "تعديل الدور"
                                    : "إنشاء دور جديد"}
                            </h2>

                            <p className="text-sm text-gray-500 mt-0.5">
                                {isEdit
                                    ? "تعديل بيانات وصلاحيات الدور"
                                    : "إنشاء دور وتحديد الصلاحيات الخاصة به"}
                            </p>

                        </div>

                    </div>


                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="
                            w-9
                            h-9
                            rounded-lg
                            bg-gray-100
                            text-gray-500
                            hover:bg-red-50
                            hover:text-red-600
                            disabled:opacity-50
                            flex
                            items-center
                            justify-center
                            transition
                        "
                    >
                        <X size={19} />
                    </button>

                </div>


                {/* BODY */}

                <form
                    onSubmit={onSubmit}
                    className="
                        flex-1
                        overflow-y-auto
                        p-6
                        space-y-6
                    "
                >

                    {/* NAME */}

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
                            اسم الدور
                            <span className="text-red-500 mr-1">
                                *
                            </span>
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            placeholder="مثال: مدير النظام، صيدلي، كاشير"
                            disabled={saving}
                            autoFocus
                            className="
                                w-full
                                h-12
                                px-4
                                rounded-xl
                                border
                                border-gray-200
                                bg-gray-50
                                outline-none
                                transition
                                focus:bg-white
                                focus:border-[#5B2A86]
                                focus:ring-4
                                focus:ring-purple-100
                                disabled:opacity-50
                            "
                        />

                    </div>


                    {/* PERMISSIONS */}

                    <div>

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-3
                                mb-3
                            "
                        >

                            <div>

                                <label className="block text-sm font-bold text-gray-700">
                                    الصلاحيات
                                </label>

                                <p className="text-xs text-gray-400 mt-1">
                                    حدد الصلاحيات التي سيتمكن الدور من استخدامها
                                </p>

                            </div>


                            <div className="flex gap-2">

                                <button
                                    type="button"
                                    onClick={onSelectAll}
                                    disabled={
                                        saving ||
                                        permissions.length === 0
                                    }
                                    className="
                                        text-xs
                                        font-bold
                                        text-[#5B2A86]
                                        hover:underline
                                        disabled:opacity-40
                                    "
                                >
                                    تحديد الكل
                                </button>

                                <span className="text-gray-300">
                                    |
                                </span>

                                <button
                                    type="button"
                                    onClick={onClearAll}
                                    disabled={
                                        saving ||
                                        formData.permissions.length === 0
                                    }
                                    className="
                                        text-xs
                                        font-bold
                                        text-red-500
                                        hover:underline
                                        disabled:opacity-40
                                    "
                                >
                                    إلغاء الكل
                                </button>

                            </div>

                        </div>


                        <div
                            className="
                                border
                                border-gray-200
                                rounded-2xl
                                overflow-hidden
                            "
                        >

                            <div
                                className="
                                    px-4
                                    py-3
                                    bg-gray-50
                                    border-b
                                    border-gray-200
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <span className="text-xs font-bold text-gray-500">
                                    الصلاحيات المتاحة
                                </span>

                                <span
                                    className="
                                        text-xs
                                        px-2.5
                                        py-1
                                        rounded-full
                                        bg-purple-100
                                        text-purple-700
                                        font-bold
                                    "
                                >
                                    {
                                        formData.permissions.length
                                    }{" "}
                                    محددة
                                </span>

                            </div>


                            <div
                                className="
                                    max-h-72
                                    overflow-y-auto
                                    p-3
                                "
                            >

                                {permissions.length === 0 ? (

                                    <div
                                        className="
                                            py-10
                                            text-center
                                            text-gray-400
                                        "
                                    >

                                        <KeyRound
                                            size={32}
                                            className="mx-auto mb-3 opacity-40"
                                        />

                                        <p className="text-sm">
                                            لا توجد صلاحيات متاحة
                                        </p>

                                    </div>

                                ) : (

                                    <div className="space-y-1">

                                        {permissions.map(
                                            permission => {

                                                const checked =
                                                    formData.permissions.includes(
                                                        permission.id
                                                    );

                                                return (

                                                    <label
                                                        key={
                                                            permission.id
                                                        }
                                                        className={`
                                                            flex
                                                            items-center
                                                            gap-3
                                                            p-3
                                                            rounded-xl
                                                            cursor-pointer
                                                            transition
                                                            ${checked
                                                                ? "bg-purple-50 border border-purple-100"
                                                                : "hover:bg-gray-50 border border-transparent"
                                                            }
                                                        `}
                                                    >

                                                        <div
                                                            className={`
                                                                w-5
                                                                h-5
                                                                rounded-md
                                                                border
                                                                flex
                                                                items-center
                                                                justify-center
                                                                shrink-0
                                                                transition
                                                                ${checked
                                                                    ? "bg-[#5B2A86] border-[#5B2A86] text-white"
                                                                    : "bg-white border-gray-300"
                                                                }
                                                            `}
                                                        >

                                                            {checked && (
                                                                <Check
                                                                    size={14}
                                                                    strokeWidth={3}
                                                                />
                                                            )}

                                                        </div>


                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                checked
                                                            }
                                                            onChange={() =>
                                                                onTogglePermission(
                                                                    permission.id
                                                                )
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                            className="sr-only"
                                                        />


                                                        <div className="min-w-0 flex-1">

                                                            <p className="text-sm font-semibold text-gray-800">
                                                                {
                                                                    permission.name
                                                                }
                                                            </p>

                                                            {permission.codename && (
                                                                <p className="text-xs text-gray-400 mt-0.5">
                                                                    {
                                                                        permission.codename
                                                                    }
                                                                </p>
                                                            )}

                                                        </div>


                                                        <span
                                                            className="
                                                                text-[10px]
                                                                text-gray-400
                                                                shrink-0
                                                            "
                                                        >
                                                            #
                                                            {
                                                                permission.id
                                                            }
                                                        </span>

                                                    </label>

                                                );

                                            }
                                        )}

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* WARNING */}

                    {formData.permissions.length === 0 && (

                        <div
                            className="
                                flex
                                items-start
                                gap-3
                                p-4
                                rounded-xl
                                bg-orange-50
                                border
                                border-orange-100
                                text-orange-700
                            "
                        >

                            <AlertTriangle
                                size={18}
                                className="mt-0.5 shrink-0"
                            />

                            <div>

                                <p className="text-sm font-bold">
                                    لا توجد صلاحيات محددة
                                </p>

                                <p className="text-xs mt-1 text-orange-600">
                                    هذا الدور لن يمتلك أي صلاحيات بعد إنشائه.
                                </p>

                            </div>

                        </div>

                    )}


                    {/* FOOTER */}

                    <div
                        className="
                            pt-4
                            border-t
                            border-gray-100
                            flex
                            items-center
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
                                py-3
                                rounded-xl
                                bg-gray-100
                                text-gray-700
                                font-bold
                                hover:bg-gray-200
                                disabled:opacity-50
                                transition
                            "
                        >
                            إلغاء
                        </button>


                        <button
                            type="submit"
                            disabled={
                                saving ||
                                !formData.name.trim()
                            }
                            className="
                                min-w-[140px]
                                px-5
                                py-3
                                rounded-xl
                                bg-[#5B2A86]
                                text-white
                                font-bold
                                hover:bg-[#4b226e]
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                transition
                                flex
                                items-center
                                justify-center
                                gap-2
                            "
                        >

                            {saving ? (

                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                    جاري الحفظ...
                                </>

                            ) : (

                                <>
                                    <CheckCircle2
                                        size={18}
                                    />

                                    {isEdit
                                        ? "حفظ التعديلات"
                                        : "إنشاء الدور"}
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}