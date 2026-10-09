import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Search,
    Package,
    PackageCheck,
    PackageX,
    AlertTriangle,
    RefreshCw,
    Plus,
    Boxes,
    TrendingUp,
    Clock3
} from "lucide-react";

import PageHeader from "../../../components/ui/layout/PageHeader";
import Card from "../../../components/ui/cards/Card";
import Loading from "../../../components/ui/feedback/Loading";
import EmptyState from "../../../components/ui/feedback/EmptyState";

import StockMovements from "../../../components/admin/inventory/StockMovements";
import AddStockModal from "../../../components/admin/inventory/AddStockModal";

import {
    getInventory
} from "../../../services/inventory/inventoryService";

import {
    getProducts
} from "../../../services/products/adminProductService";


// =====================================================
// INVENTORY PAGE
// =====================================================

export default function Inventory() {

    const [products, setProducts] = useState([]);

    const [allProducts, setAllProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [sortBy, setSortBy] = useState("name");

    const [openAddStock, setOpenAddStock] = useState(false);


    // =====================================================
    // LOAD INVENTORY
    // =====================================================

    const loadInventory = async (
        showRefresh = false
    ) => {

        try {

            if (showRefresh) {

                setRefreshing(true);

            } else {

                setLoading(true);

            }


            const [
                inventoryData,
                productsData
            ] = await Promise.all([

                getInventory(),

                getProducts()

            ]);


            const inventoryArray =
                Array.isArray(inventoryData)
                    ? inventoryData
                    : inventoryData?.results || [];


            const productsArray =
                Array.isArray(productsData)
                    ? productsData
                    : productsData?.results || [];


            // =================================================
            // FORMAT INVENTORY
            // =================================================

            const formatted =
                inventoryArray.map((item) => {

                    const product =
                        productsArray.find(
                            (p) => p.id === item.product
                        );


                    const quantity =
                        Number(
                            item.available_quantity || 0
                        );


                    const reorderLevel =
                        Number(
                            product?.reorder_level ||
                            product?.minimum_stock ||
                            10
                        );


                    return {

                        id: item.product,

                        name:
                            item.product_name ||
                            product?.name ||
                            "منتج",

                        quantity,

                        reorder_level:
                            reorderLevel,

                        barcode:
                            item.barcode ||
                            product?.barcode ||
                            "",

                        category:
                            product?.category_name ||
                            item.category_name ||
                            "",

                        price:
                            product?.selling_price ||
                            product?.price ||
                            0,

                        last_updated:
                            item.last_updated

                    };

                });


            // =================================================
            // ADD PRODUCTS THAT DON'T HAVE INVENTORY SNAPSHOT
            // =================================================

            const existingIds =
                new Set(
                    formatted.map(
                        (item) => item.id
                    )
                );


            const missingProducts =
                productsArray
                    .filter(
                        (product) =>
                            !existingIds.has(product.id)
                    )
                    .map((product) => ({

                        id: product.id,

                        name:
                            product.name ||
                            "منتج",

                        quantity: 0,

                        reorder_level:
                            Number(
                                product.reorder_level ||
                                product.minimum_stock ||
                                10
                            ),

                        barcode:
                            product.barcode || "",

                        category:
                            product.category_name ||
                            "",

                        price:
                            product.selling_price ||
                            product.price ||
                            0,

                        last_updated:
                            null

                    }));


            setProducts([
                ...formatted,
                ...missingProducts
            ]);


            // =================================================
            // ALL PRODUCTS
            // =================================================

            setAllProducts(

                productsArray.map(
                    (item) => ({

                        id: item.id,

                        name:
                            item.name

                    })
                )

            );

        } catch (error) {

            console.error(
                "INVENTORY ERROR:",
                error
            );

            setProducts([]);

            setAllProducts([]);

        } finally {

            setLoading(false);

            setRefreshing(false);

        }

    };


    useEffect(() => {

        loadInventory();

    }, []);


    // =====================================================
    // INVENTORY STATUS
    // =====================================================

    const getProductStatus = (
        product
    ) => {

        const quantity =
            Number(product.quantity || 0);

        const reorderLevel =
            Number(
                product.reorder_level || 0
            );


        if (quantity <= 0) {

            return "OUT";

        }


        if (
            quantity <= reorderLevel
        ) {

            return "LOW";

        }


        return "GOOD";

    };


    // =====================================================
    // FILTER + SORT
    // =====================================================

    const filteredProducts =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();


            let result =
                products.filter(
                    (product) => {

                        const name =
                            String(
                                product.name || ""
                            ).toLowerCase();


                        const barcode =
                            String(
                                product.barcode || ""
                            ).toLowerCase();


                        const category =
                            String(
                                product.category || ""
                            ).toLowerCase();


                        const matchesSearch =
                            !query ||
                            name.includes(query) ||
                            barcode.includes(query) ||
                            category.includes(query);


                        const status =
                            getProductStatus(
                                product
                            );


                        const matchesStatus =
                            statusFilter === "ALL" ||
                            status === statusFilter;


                        return (
                            matchesSearch &&
                            matchesStatus
                        );

                    }
                );


            result.sort(
                (a, b) => {

                    if (
                        sortBy === "quantity-asc"
                    ) {

                        return (
                            a.quantity -
                            b.quantity
                        );

                    }


                    if (
                        sortBy === "quantity-desc"
                    ) {

                        return (
                            b.quantity -
                            a.quantity
                        );

                    }


                    if (
                        sortBy === "status"
                    ) {

                        const order = {
                            OUT: 0,
                            LOW: 1,
                            GOOD: 2
                        };


                        return (
                            order[
                            getProductStatus(a)
                            ] -
                            order[
                            getProductStatus(b)
                            ]
                        );

                    }


                    return String(
                        a.name || ""
                    ).localeCompare(
                        String(
                            b.name || ""
                        ),
                        "ar"
                    );

                }
            );


            return result;

        }, [
            products,
            search,
            statusFilter,
            sortBy
        ]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalProducts =
        products.length;


    const totalUnits =
        products.reduce(
            (
                total,
                product
            ) =>
                total +
                Number(
                    product.quantity || 0
                ),
            0
        );


    const outOfStock =
        products.filter(
            (product) =>
                getProductStatus(product) ===
                "OUT"
        ).length;


    const lowStock =
        products.filter(
            (product) =>
                getProductStatus(product) ===
                "LOW"
        ).length;


    const goodStock =
        products.filter(
            (product) =>
                getProductStatus(product) ===
                "GOOD"
        ).length;


    const healthyPercentage =
        totalProducts > 0
            ? Math.round(
                (
                    goodStock /
                    totalProducts
                ) *
                100
            )
            : 0;


    // =====================================================
    // LAST UPDATED
    // =====================================================

    const lastUpdated =
        products
            .filter(
                (item) =>
                    item.last_updated
            )
            .sort(
                (a, b) =>
                    new Date(
                        b.last_updated
                    ) -
                    new Date(
                        a.last_updated
                    )
            )[0];


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return <Loading />;

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            dir="rtl"
            className="
                space-y-6
                pb-10
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <PageHeader

                title="إدارة المخزون"

                subtitle="
                    متابعة مستويات المخزون والكميات والتنبيهات
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
                                loadInventory(true)
                            }

                            disabled={refreshing}

                            className="
                                inline-flex
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

                            onClick={() =>
                                setOpenAddStock(true)
                            }

                            className="
                                inline-flex
                                items-center
                                gap-2
                                px-5
                                py-2.5
                                rounded-xl
                                bg-[#5B2A86]
                                text-white
                                font-bold
                                shadow-sm
                                hover:bg-[#4a216d]
                                transition
                            "
                        >

                            <Plus size={19} />

                            إضافة مخزون

                        </button>

                    </div>

                }

            />


            {/* =================================================
                OVERVIEW CARDS
            ================================================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    xl:grid-cols-5
                    gap-4
                "
            >

                <InventoryStat

                    title="إجمالي المنتجات"

                    value={totalProducts}

                    subtitle="منتج في النظام"

                    icon={Package}

                    iconClass="
                        bg-purple-100
                        text-[#5B2A86]
                    "
                />


                <InventoryStat

                    title="إجمالي الوحدات"

                    value={totalUnits.toLocaleString(
                        "ar-EG"
                    )}

                    subtitle="وحدة متاحة"

                    icon={Boxes}

                    iconClass="
                        bg-blue-100
                        text-blue-600
                    "
                />


                <InventoryStat

                    title="مخزون جيد"

                    value={goodStock}

                    subtitle={`${healthyPercentage}% من المنتجات`}

                    icon={PackageCheck}

                    iconClass="
                        bg-green-100
                        text-green-600
                    "
                />


                <InventoryStat

                    title="مخزون منخفض"

                    value={lowStock}

                    subtitle="يحتاج إعادة طلب"

                    icon={AlertTriangle}

                    iconClass="
                        bg-yellow-100
                        text-yellow-600
                    "
                />


                <InventoryStat

                    title="نفد المخزون"

                    value={outOfStock}

                    subtitle="يحتاج تدخل فوري"

                    icon={PackageX}

                    iconClass="
                        bg-red-100
                        text-red-600
                    "
                />

            </div>


            {/* =================================================
                HEALTH OVERVIEW
            ================================================= */}

            <Card>

                <div
                    className="
                        p-6
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            md:flex-row
                            md:items-center
                            md:justify-between
                            gap-4
                        "
                    >

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <TrendingUp
                                    size={20}
                                    className="text-[#5B2A86]"
                                />

                                <h2
                                    className="
                                        text-lg
                                        font-black
                                        text-gray-800
                                    "
                                >
                                    حالة المخزون العامة
                                </h2>

                            </div>


                            <p
                                className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                            >
                                نسبة المنتجات التي لديها مستوى مخزون آمن
                            </p>

                        </div>


                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <span
                                className="
                                    text-3xl
                                    font-black
                                    text-[#5B2A86]
                                "
                            >
                                {healthyPercentage}%
                            </span>

                            <span
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >
                                مخزون صحي
                            </span>

                        </div>

                    </div>


                    <div
                        className="
                            mt-5
                            h-3
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
                                transition-all
                                duration-700
                            "
                            style={{
                                width:
                                    `${healthyPercentage}%`
                            }}
                        />

                    </div>


                    <div
                        className="
                            flex
                            flex-wrap
                            gap-5
                            mt-4
                            text-sm
                        "
                    >

                        <Legend
                            label="مخزون جيد"
                            value={goodStock}
                            className="bg-green-500"
                        />

                        <Legend
                            label="منخفض"
                            value={lowStock}
                            className="bg-yellow-500"
                        />

                        <Legend
                            label="نفد"
                            value={outOfStock}
                            className="bg-red-500"
                        />

                    </div>

                </div>

            </Card>


            {/* =================================================
                FILTERS
            ================================================= */}

            <Card>

                <div
                    className="
                        p-5
                        grid
                        grid-cols-1
                        lg:grid-cols-[1fr_auto_auto]
                        gap-4
                        items-center
                    "
                >

                    {/* SEARCH */}

                    <div
                        className="
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
                                pointer-events-none
                            "
                        />

                        <input

                            type="text"

                            value={search}

                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }

                            placeholder="
                                ابحث باسم المنتج أو الباركود أو التصنيف...
                            "

                            className="
                                w-full
                                border
                                border-gray-200
                                rounded-xl
                                py-3
                                pr-11
                                pl-4
                                outline-none
                                focus:ring-2
                                focus:ring-purple-200
                                focus:border-[#5B2A86]
                                transition
                            "

                        />

                    </div>


                    {/* STATUS */}

                    <select

                        value={statusFilter}

                        onChange={(e) =>
                            setStatusFilter(
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

                        <option value="ALL">
                            كل الحالات
                        </option>

                        <option value="GOOD">
                            مخزون جيد
                        </option>

                        <option value="LOW">
                            مخزون منخفض
                        </option>

                        <option value="OUT">
                            نفد المخزون
                        </option>

                    </select>


                    {/* SORT */}

                    <select

                        value={sortBy}

                        onChange={(e) =>
                            setSortBy(
                                e.target.value
                            )
                        }

                        className="
                            min-w-[200px]
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

                        <option value="name">
                            ترتيب حسب الاسم
                        </option>

                        <option value="quantity-asc">
                            الأقل كمية أولاً
                        </option>

                        <option value="quantity-desc">
                            الأعلى كمية أولاً
                        </option>

                        <option value="status">
                            الأخطر أولاً
                        </option>

                    </select>

                </div>

            </Card>


            {/* =================================================
                INVENTORY TABLE
            ================================================= */}

            <Card>

                <div
                    className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-3
                        p-6
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
                            قائمة المخزون
                        </h2>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            عرض {filteredProducts.length} من {products.length} منتج
                        </p>

                    </div>


                    {lastUpdated && (

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                text-xs
                                text-gray-500
                            "
                        >

                            <Clock3 size={15} />

                            آخر تحديث:

                            {new Date(
                                lastUpdated.last_updated
                            ).toLocaleString(
                                "ar-EG"
                            )}

                        </div>

                    )}

                </div>


                {filteredProducts.length === 0 ? (

                    <div className="p-10">

                        <EmptyState

                            title="لا توجد منتجات"

                            description="
                                لم يتم العثور على منتجات مطابقة للفلاتر الحالية.
                            "

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
                                        bg-gray-50/80
                                        text-gray-500
                                        text-sm
                                    "
                                >

                                    <th className="px-6 py-4 font-bold">
                                        المنتج
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        الباركود
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        الكمية
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        مستوى إعادة الطلب
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        مستوى المخزون
                                    </th>

                                    <th className="px-6 py-4 font-bold">
                                        الحالة
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredProducts.map(
                                    (product) => (

                                        <InventoryRow

                                            key={
                                                product.id
                                            }

                                            product={
                                                product
                                            }

                                        />

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </Card>


            {/* =================================================
                STOCK MOVEMENTS
            ================================================= */}

            <StockMovements />


            {/* =================================================
                ADD STOCK
            ================================================= */}

            <AddStockModal

                open={
                    openAddStock
                }

                onClose={() =>
                    setOpenAddStock(
                        false
                    )
                }

                products={
                    allProducts
                }

                onSuccess={() =>
                    loadInventory(
                        true
                    )
                }

            />

        </div>

    );

}


// =====================================================
// STAT CARD
// =====================================================

function InventoryStat({
    title,
    value,
    subtitle,
    icon: Icon,
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


                    <p
                        className="
                            text-3xl
                            font-black
                            text-gray-900
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
                        ${iconClass}
                    `}
                >

                    <Icon size={23} />

                </div>

            </div>

        </div>

    );

}


// =====================================================
// LEGEND
// =====================================================

function Legend({
    label,
    value,
    className
}) {

    return (

        <div
            className="
                flex
                items-center
                gap-2
            "
        >

            <span
                className={`
                    w-2.5
                    h-2.5
                    rounded-full
                    ${className}
                `}
            />


            <span className="text-gray-500">
                {label}
            </span>


            <strong className="text-gray-800">
                {value}
            </strong>

        </div>

    );

}


// =====================================================
// INVENTORY ROW
// =====================================================

function InventoryRow({
    product
}) {

    const quantity =
        Number(
            product.quantity || 0
        );


    const reorderLevel =
        Number(
            product.reorder_level || 0
        );


    const status =
        quantity <= 0
            ? "OUT"
            : quantity <= reorderLevel
                ? "LOW"
                : "GOOD";


    // =================================================
    // PROGRESS
    // =================================================

    const percentage =
        reorderLevel > 0
            ? Math.min(
                (
                    quantity /
                    (reorderLevel * 2)
                ) *
                100,
                100
            )
            : quantity > 0
                ? 100
                : 0;


    const statusConfig = {

        OUT: {

            label:
                "نفد المخزون",

            className:
                "bg-red-100 text-red-700",

            progress:
                "bg-red-500"

        },

        LOW: {

            label:
                "مخزون منخفض",

            className:
                "bg-yellow-100 text-yellow-700",

            progress:
                "bg-yellow-500"

        },

        GOOD: {

            label:
                "مخزون جيد",

            className:
                "bg-green-100 text-green-700",

            progress:
                "bg-green-500"

        }

    };


    const config =
        statusConfig[
        status
        ];


    return (

        <tr
            className="
                border-b
                last:border-b-0
                hover:bg-gray-50
                transition
            "
        >

            {/* PRODUCT */}

            <td className="px-6 py-5">

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

                        <Package size={20} />

                    </div>


                    <div>

                        <p
                            className="
                                font-black
                                text-gray-800
                            "
                        >
                            {product.name}
                        </p>


                        {product.category && (

                            <p
                                className="
                                    text-xs
                                    text-gray-400
                                    mt-1
                                "
                            >
                                {product.category}
                            </p>

                        )}

                    </div>

                </div>

            </td>


            {/* BARCODE */}

            <td
                className="
                    px-6
                    py-5
                    text-gray-500
                "
            >

                {product.barcode || "-"}

            </td>


            {/* QUANTITY */}

            <td className="px-6 py-5">

                <span
                    className="
                        text-lg
                        font-black
                        text-gray-800
                    "
                >
                    {quantity.toLocaleString(
                        "ar-EG"
                    )}
                </span>

            </td>


            {/* REORDER LEVEL */}

            <td className="px-6 py-5">

                <span
                    className="
                        inline-flex
                        px-3
                        py-1
                        rounded-lg
                        bg-gray-100
                        text-gray-700
                        text-sm
                        font-bold
                    "
                >

                    {reorderLevel}

                </span>

            </td>


            {/* PROGRESS */}

            <td className="px-6 py-5 min-w-[180px]">

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex-1
                            h-2
                            bg-gray-100
                            rounded-full
                            overflow-hidden
                        "
                    >

                        <div
                            className={`
                                h-full
                                rounded-full
                                transition-all
                                ${config.progress}
                            `}
                            style={{
                                width:
                                    `${percentage}%`
                            }}
                        />

                    </div>


                    <span
                        className="
                            text-xs
                            font-bold
                            text-gray-500
                            w-10
                        "
                    >

                        {Math.round(
                            percentage
                        )}%

                    </span>

                </div>

            </td>


            {/* STATUS */}

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
                        ${config.className}
                    `}
                >

                    <span
                        className="
                            w-1.5
                            h-1.5
                            rounded-full
                            bg-current
                        "
                    />

                    {config.label}

                </span>

            </td>

        </tr>

    );

}