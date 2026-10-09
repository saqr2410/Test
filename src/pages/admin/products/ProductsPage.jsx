import { useMemo, useState } from "react";
import {
    Package,
    Plus,
    Layers3,
    Ruler,
    Search,
    SlidersHorizontal,
    RotateCcw,
    CheckCircle2,
    XCircle,
    Boxes,
} from "lucide-react";

import PageHeader from "../../../components/ui/layout/PageHeader";
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";
import Card from "../../../components/ui/cards/Card";
import SearchBox from "../../../components/ui/forms/SearchBox";

import ProductTable from "../../../components/admin/products/ProductTable";
import AddProductModal from "../../../components/admin/products/AddProductModal";
import AddCategoryModal from "../../../components/admin/products/AddCategoryModal";
import AddUnitModal from "../../../components/admin/products/AddUnitModal";

import useAdminProducts from "../../../hooks/useAdminProducts";
import useProductMeta from "../../../hooks/useProductMeta";

export default function ProductsPage() {
    const [search, setSearch] = useState("");

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [openUnitModal, setOpenUnitModal] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [typeFilter, setTypeFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const { products, loading, reload } = useAdminProducts();
    const { categories, reload: reloadMeta } = useProductMeta();

    /* =========================================================
       FILTER PRODUCTS
    ========================================================= */

    const filteredProducts = useMemo(() => {
        let result = [...products];

        const normalizedSearch = search.trim().toLowerCase();

        if (normalizedSearch) {
            result = result.filter((product) => {
                return (
                    product.name?.toLowerCase().includes(normalizedSearch) ||
                    product.barcode?.toLowerCase().includes(normalizedSearch) ||
                    product.scientific_name
                        ?.toLowerCase()
                        .includes(normalizedSearch)
                );
            });
        }

        if (typeFilter !== "all") {
            result = result.filter(
                (product) => product.product_type === typeFilter
            );
        }

        if (categoryFilter !== "all") {
            result = result.filter(
                (product) => product.category === Number(categoryFilter)
            );
        }

        if (statusFilter !== "all") {
            const active = statusFilter === "active";

            result = result.filter(
                (product) => product.is_active === active
            );
        }

        return result;
    }, [
        products,
        search,
        typeFilter,
        categoryFilter,
        statusFilter,
    ]);

    /* =========================================================
       STATS
    ========================================================= */

    const stats = useMemo(() => {
        const active = products.filter(
            (product) => product.is_active
        ).length;

        const inactive = products.filter(
            (product) => !product.is_active
        ).length;

        const types = new Set(
            products
                .map((product) => product.product_type)
                .filter(Boolean)
        ).size;

        return {
            total: products.length,
            active,
            inactive,
            types,
        };
    }, [products]);

    /* =========================================================
       MODALS
    ========================================================= */

    const handleAdd = () => {
        setSelectedProduct(null);
        setOpenAddModal(true);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setOpenAddModal(true);
    };

    const handleCloseModal = () => {
        setOpenAddModal(false);
        setSelectedProduct(null);
    };

    const handleCategoryCreated = async () => {
        await reloadMeta();
    };

    const handleUnitCreated = async () => {
        await reloadMeta();
    };

    /* =========================================================
       RESET FILTERS
    ========================================================= */

    const resetFilters = () => {
        setSearch("");
        setTypeFilter("all");
        setCategoryFilter("all");
        setStatusFilter("all");
    };

    const hasFilters =
        search.trim() ||
        typeFilter !== "all" ||
        categoryFilter !== "all" ||
        statusFilter !== "all";

    /* =========================================================
       UI
    ========================================================= */

    return (
        <div
            dir="rtl"
            className="space-y-6 pb-8"
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <PageHeader
                title="إدارة المنتجات"
                subtitle="إدارة المنتجات والأصناف والوحدات ومتابعة حالة المنتجات"
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setOpenCategoryModal(true)
                            }
                            className="
                                inline-flex items-center gap-2
                                px-4 py-2.5
                                rounded-xl
                                border border-gray-200
                                bg-white
                                text-gray-700
                                font-semibold
                                text-sm
                                hover:bg-gray-50
                                hover:border-gray-300
                                transition
                            "
                        >
                            <Layers3 size={17} />
                            إضافة تصنيف
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setOpenUnitModal(true)
                            }
                            className="
                                inline-flex items-center gap-2
                                px-4 py-2.5
                                rounded-xl
                                border border-gray-200
                                bg-white
                                text-gray-700
                                font-semibold
                                text-sm
                                hover:bg-gray-50
                                hover:border-gray-300
                                transition
                            "
                        >
                            <Ruler size={17} />
                            إضافة وحدة
                        </button>

                        <PrimaryButton onClick={handleAdd}>
                            <span className="flex items-center gap-2">
                                <Plus size={18} />
                                إضافة منتج
                            </span>
                        </PrimaryButton>
                    </div>
                }
            />

            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* TOTAL */}
                <div className="
                    bg-white
                    border border-gray-100
                    rounded-2xl
                    shadow-sm
                    p-5
                    hover:shadow-md
                    transition
                ">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                إجمالي المنتجات
                            </p>

                            <p className="text-2xl font-black text-gray-900">
                                {stats.total.toLocaleString("ar-EG")}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                جميع المنتجات المسجلة
                            </p>
                        </div>

                        <div className="
                            w-12 h-12
                            rounded-2xl
                            bg-purple-100
                            text-[#5B2A86]
                            flex items-center justify-center
                        ">
                            <Package size={23} />
                        </div>
                    </div>
                </div>

                {/* ACTIVE */}
                <div className="
                    bg-white
                    border border-gray-100
                    rounded-2xl
                    shadow-sm
                    p-5
                    hover:shadow-md
                    transition
                ">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                المنتجات النشطة
                            </p>

                            <p className="text-2xl font-black text-gray-900">
                                {stats.active.toLocaleString("ar-EG")}
                            </p>

                            <p className="text-xs text-green-600 mt-1">
                                متاحة للبيع
                            </p>
                        </div>

                        <div className="
                            w-12 h-12
                            rounded-2xl
                            bg-green-100
                            text-green-600
                            flex items-center justify-center
                        ">
                            <CheckCircle2 size={23} />
                        </div>
                    </div>
                </div>

                {/* INACTIVE */}
                <div className="
                    bg-white
                    border border-gray-100
                    rounded-2xl
                    shadow-sm
                    p-5
                    hover:shadow-md
                    transition
                ">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                غير النشطة
                            </p>

                            <p className="text-2xl font-black text-gray-900">
                                {stats.inactive.toLocaleString("ar-EG")}
                            </p>

                            <p className="text-xs text-red-500 mt-1">
                                غير متاحة للبيع
                            </p>
                        </div>

                        <div className="
                            w-12 h-12
                            rounded-2xl
                            bg-red-100
                            text-red-500
                            flex items-center justify-center
                        ">
                            <XCircle size={23} />
                        </div>
                    </div>
                </div>

                {/* TYPES */}
                <div className="
                    bg-white
                    border border-gray-100
                    rounded-2xl
                    shadow-sm
                    p-5
                    hover:shadow-md
                    transition
                ">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                أنواع المنتجات
                            </p>

                            <p className="text-2xl font-black text-gray-900">
                                {stats.types.toLocaleString("ar-EG")}
                            </p>

                            <p className="text-xs text-blue-500 mt-1">
                                تصنيفات المنتجات
                            </p>
                        </div>

                        <div className="
                            w-12 h-12
                            rounded-2xl
                            bg-blue-100
                            text-blue-600
                            flex items-center justify-center
                        ">
                            <Boxes size={23} />
                        </div>
                    </div>
                </div>
            </div>

            {/* =================================================
                FILTERS
            ================================================= */}

            <Card>

                <div className="
                    flex items-center justify-between
                    mb-4
                    pb-4
                    border-b
                ">
                    <div className="flex items-center gap-2">
                        <div className="
                            w-9 h-9
                            rounded-xl
                            bg-purple-100
                            text-[#5B2A86]
                            flex items-center justify-center
                        ">
                            <SlidersHorizontal size={18} />
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900">
                                البحث والتصفية
                            </h3>

                            <p className="text-xs text-gray-500">
                                فلترة المنتجات للوصول للمنتج المطلوب
                            </p>
                        </div>
                    </div>

                    {hasFilters && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="
                                flex items-center gap-2
                                text-sm
                                text-gray-500
                                hover:text-[#5B2A86]
                                transition
                            "
                        >
                            <RotateCcw size={15} />
                            إعادة ضبط
                        </button>
                    )}
                </div>

                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-4
                    gap-4
                ">

                    {/* SEARCH */}
                    <div className="xl:col-span-1">
                        <SearchBox
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="ابحث بالاسم أو الباركود..."
                        />
                    </div>

                    {/* TYPE */}
                    <div>
                        <label className="
                            block
                            text-xs
                            font-semibold
                            text-gray-500
                            mb-2
                        ">
                            نوع المنتج
                        </label>

                        <select
                            value={typeFilter}
                            onChange={(e) =>
                                setTypeFilter(e.target.value)
                            }
                            className="
                                w-full
                                border border-gray-200
                                rounded-xl
                                px-4 py-3
                                bg-white
                                text-sm
                                outline-none
                                transition
                                focus:border-[#5B2A86]
                                focus:ring-2
                                focus:ring-[#5B2A86]/10
                            "
                        >
                            <option value="all">
                                جميع الأنواع
                            </option>

                            <option value="RX">
                                وصفة طبية
                            </option>

                            <option value="OTC">
                                بدون وصفة
                            </option>

                            <option value="SUPPLEMENT">
                                مكمل غذائي
                            </option>

                            <option value="COSMETIC">
                                مستحضر تجميل
                            </option>

                            <option value="PERSONAL">
                                عناية شخصية
                            </option>
                        </select>
                    </div>

                    {/* CATEGORY */}
                    <div>
                        <label className="
                            block
                            text-xs
                            font-semibold
                            text-gray-500
                            mb-2
                        ">
                            التصنيف
                        </label>

                        <select
                            value={categoryFilter}
                            onChange={(e) =>
                                setCategoryFilter(e.target.value)
                            }
                            className="
                                w-full
                                border border-gray-200
                                rounded-xl
                                px-4 py-3
                                bg-white
                                text-sm
                                outline-none
                                transition
                                focus:border-[#5B2A86]
                                focus:ring-2
                                focus:ring-[#5B2A86]/10
                            "
                        >
                            <option value="all">
                                جميع التصنيفات
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* STATUS */}
                    <div>
                        <label className="
                            block
                            text-xs
                            font-semibold
                            text-gray-500
                            mb-2
                        ">
                            حالة المنتج
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="
                                w-full
                                border border-gray-200
                                rounded-xl
                                px-4 py-3
                                bg-white
                                text-sm
                                outline-none
                                transition
                                focus:border-[#5B2A86]
                                focus:ring-2
                                focus:ring-[#5B2A86]/10
                            "
                        >
                            <option value="all">
                                جميع الحالات
                            </option>

                            <option value="active">
                                نشط
                            </option>

                            <option value="inactive">
                                غير نشط
                            </option>
                        </select>
                    </div>
                </div>

                {/* FILTER RESULT */}
                <div className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                    mt-5
                    pt-4
                    border-t
                ">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="
                            w-8 h-8
                            rounded-lg
                            bg-gray-100
                            flex items-center justify-center
                        ">
                            <Search size={15} className="text-gray-500" />
                        </div>

                        <span className="text-gray-500">
                            النتائج:
                        </span>

                        <strong className="text-gray-900">
                            {filteredProducts.length.toLocaleString(
                                "ar-EG"
                            )}
                        </strong>

                        <span className="text-gray-500">
                            منتج
                        </span>
                    </div>

                    {hasFilters && (
                        <div className="
                            inline-flex
                            items-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-full
                            bg-purple-50
                            text-[#5B2A86]
                            text-xs
                            font-semibold
                        ">
                            <SlidersHorizontal size={13} />
                            تم تطبيق الفلاتر
                        </div>
                    )}
                </div>
            </Card>

            {/* =================================================
                PRODUCTS
            ================================================= */}

            <div className="
                bg-white
                rounded-2xl
                border border-gray-100
                shadow-sm
                overflow-hidden
            ">

                {/* TABLE HEADER */}
                <div className="
                    px-6
                    py-4
                    border-b
                    bg-gradient-to-l
                    from-gray-50
                    to-white
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                ">
                    <div className="flex items-center gap-3">

                        <div className="
                            w-10 h-10
                            rounded-xl
                            bg-purple-100
                            text-[#5B2A86]
                            flex items-center justify-center
                        ">
                            <Package size={20} />
                        </div>

                        <div>
                            <h2 className="font-black text-lg text-gray-900">
                                قائمة المنتجات
                            </h2>

                            <p className="text-xs text-gray-500">
                                إدارة وتعديل المنتجات
                            </p>
                        </div>
                    </div>

                    <div className="
                        px-3
                        py-1.5
                        rounded-lg
                        bg-gray-100
                        text-gray-600
                        text-sm
                        font-semibold
                    ">
                        {filteredProducts.length} من {products.length}
                    </div>
                </div>

                {/* TABLE */}
                {loading ? (
                    <div className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        py-20
                        gap-3
                    ">
                        <div className="
                            w-12 h-12
                            rounded-2xl
                            bg-purple-50
                            flex items-center justify-center
                        ">
                            <Package
                                size={24}
                                className="text-[#5B2A86] animate-pulse"
                            />
                        </div>

                        <p className="text-gray-500 text-sm">
                            جاري تحميل المنتجات...
                        </p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        py-20
                        px-6
                        text-center
                    ">
                        <div className="
                            w-16 h-16
                            rounded-2xl
                            bg-gray-100
                            flex items-center justify-center
                            mb-4
                        ">
                            <Package
                                size={30}
                                className="text-gray-400"
                            />
                        </div>

                        <h3 className="
                            font-bold
                            text-gray-800
                            mb-1
                        ">
                            لا توجد منتجات
                        </h3>

                        <p className="
                            text-sm
                            text-gray-500
                            max-w-sm
                            mb-5
                        ">
                            لم نجد أي منتجات تطابق معايير البحث
                            والفلاتر الحالية.
                        </p>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2
                                    rounded-xl
                                    bg-[#5B2A86]
                                    text-white
                                    text-sm
                                    font-semibold
                                    hover:bg-[#4a216d]
                                    transition
                                "
                            >
                                <RotateCcw size={16} />
                                إعادة ضبط الفلاتر
                            </button>
                        )}
                    </div>
                ) : (
                    <ProductTable
                        products={filteredProducts}
                        onEdit={handleEdit}
                        onSuccess={reload}
                    />
                )}
            </div>

            {/* =================================================
                MODALS
            ================================================= */}

            <AddProductModal
                open={openAddModal}
                product={selectedProduct}
                onClose={handleCloseModal}
                onSuccess={reload}
            />

            <AddCategoryModal
                open={openCategoryModal}
                onClose={() =>
                    setOpenCategoryModal(false)
                }
                onCreated={handleCategoryCreated}
            />

            <AddUnitModal
                open={openUnitModal}
                onClose={() =>
                    setOpenUnitModal(false)
                }
                onCreated={handleUnitCreated}
            />
        </div>
    );
}