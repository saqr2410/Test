import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Search,
    SlidersHorizontal,
    X,
    RotateCcw,
    ChevronDown,
    Package,
    Pill,
    Sparkles
} from "lucide-react";

import ProductCard from "../../components/store/products/ProductCard";

import {
    getStoreProducts,
    getStoreCategories
} from "../../services/products/productService";

import {
    getFavorites,
    addFavorite,
    removeFavorite
} from "../../services/favorites/favoriteService";

import {
    useAuth
} from "../../contexts/AuthContext";

import toast from "react-hot-toast";


/* =========================================================
   Product Types
========================================================= */

const PRODUCT_TYPES = [
    {
        value: "ALL",
        label: "كل المنتجات"
    },

    {
        value: "RX",
        label: "أدوية بروشتة"
    },

    {
        value: "OTC",
        label: "أدوية بدون روشتة"
    },

    {
        value: "SUPPLEMENT",
        label: "مكملات غذائية"
    },

    {
        value: "COSMETIC",
        label: "مستحضرات تجميل"
    }
];


/* =========================================================
   Sorting
========================================================= */

const SORT_OPTIONS = [
    {
        value: "default",
        label: "الترتيب الافتراضي"
    },

    {
        value: "price_low",
        label: "السعر: من الأقل للأعلى"
    },

    {
        value: "price_high",
        label: "السعر: من الأعلى للأقل"
    },

    {
        value: "name",
        label: "الاسم: أ - ي"
    }
];


export default function Products() {

    const {
        user,
        loading: authLoading,
        isAuthenticated
    } = useAuth();


    const [products, setProducts] = useState([]);

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);


    /* =====================================================
       Favorites
    ===================================================== */

    const [favoriteIds, setFavoriteIds] = useState(
        new Set()
    );

    const [favoriteLoadingIds, setFavoriteLoadingIds] = useState(
        new Set()
    );


    /* =====================================================
       Sidebar Dropdowns
    ===================================================== */

    const [categoriesOpen, setCategoriesOpen] = useState(false);

    const [productTypesOpen, setProductTypesOpen] = useState(false);


    /* =====================================================
       Read Category From URL
    ===================================================== */

    const urlCategory =
        new URLSearchParams(
            window.location.search
        ).get("category") || "";


    /* =====================================================
       Filters
    ===================================================== */

    const [filters, setFilters] = useState({

        search: "",

        type: "ALL",

        category: urlCategory,

        minPrice: "",

        maxPrice: "",

        availableOnly: false,

        sort: "default"

    });


    /* =====================================================
       Load Products + Categories + Favorites
    ===================================================== */

    useEffect(() => {

        if (authLoading) {
            return;
        }

        loadStoreData();

    }, [
        authLoading,
        isAuthenticated,
        user
    ]);


    /* =====================================================
       Sync URL Category
    ===================================================== */

    useEffect(() => {

        const category =
            new URLSearchParams(
                window.location.search
            ).get("category") || "";

        setFilters(prev => ({
            ...prev,
            category
        }));

        if (category) {

            setCategoriesOpen(true);

        }

    }, []);


    /* =====================================================
       Load Store Data
    ===================================================== */

    const loadStoreData = async () => {

        try {

            setLoading(true);


            const productsPromise =
                getStoreProducts();

            const categoriesPromise =
                getStoreCategories();


            const favoritesPromise =
                isAuthenticated
                    ? getFavorites()
                    : Promise.resolve([]);


            const [
                productsData,
                categoriesData,
                favoritesData
            ] = await Promise.all([

                productsPromise,

                categoriesPromise,

                favoritesPromise

            ]);


            const productsItems =
                Array.isArray(productsData)
                    ? productsData
                    : productsData?.results || [];


            const categoriesItems =
                Array.isArray(categoriesData)
                    ? categoriesData
                    : categoriesData?.results || [];


            const favoriteItems =
                Array.isArray(favoritesData)
                    ? favoritesData
                    : favoritesData?.results || [];


            setProducts(
                productsItems
            );


            setCategories(
                categoriesItems
            );


            setFavoriteIds(
                new Set(
                    favoriteItems
                        .map(
                            favorite =>
                                favorite?.product?.id
                        )
                        .filter(Boolean)
                )
            );

        } catch (error) {

            console.error(
                "STORE DATA ERROR:",
                error
            );

            toast.error(
                "تعذر تحميل بيانات المتجر، حاول مرة أخرى"
            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       Favorite Change
    ===================================================== */

    const handleFavoriteChange = async (
        productId,
        nextFavorite
    ) => {

        if (!isAuthenticated) {

            toast.error(
                "يجب تسجيل الدخول أولًا لإضافة المنتجات للمفضلة"
            );

            return;

        }


        setFavoriteLoadingIds(prev => {

            const next = new Set(prev);

            next.add(productId);

            return next;

        });


        try {

            if (nextFavorite) {

                await addFavorite(
                    productId
                );

                setFavoriteIds(prev => {

                    const next = new Set(prev);

                    next.add(productId);

                    return next;

                });

                toast.success(
                    "تمت الإضافة إلى المفضلة"
                );

            } else {

                await removeFavorite(
                    productId
                );

                setFavoriteIds(prev => {

                    const next = new Set(prev);

                    next.delete(productId);

                    return next;

                });

                toast.success(
                    "تمت الإزالة من المفضلة"
                );

            }

        } catch (error) {

            console.error(
                "FAVORITE ERROR:",
                error
            );

            toast.error(
                "حدث خطأ أثناء تحديث المفضلة"
            );

        } finally {

            setFavoriteLoadingIds(prev => {

                const next = new Set(prev);

                next.delete(productId);

                return next;

            });

        }

    };


    /* =====================================================
       Update Filter
    ===================================================== */

    const updateFilter = (
        name,
        value
    ) => {

        setFilters(prev => ({
            ...prev,
            [name]: value
        }));

    };


    /* =====================================================
       Category Filter
    ===================================================== */

    const selectCategory = (
        category
    ) => {

        updateFilter(
            "category",
            category
        );

        const url =
            new URLSearchParams(
                window.location.search
            );


        if (category) {

            url.set(
                "category",
                category
            );

        } else {

            url.delete(
                "category"
            );

        }


        const query =
            url.toString();


        window.history.replaceState(
            {},
            "",
            query
                ? `${window.location.pathname}?${query}`
                : window.location.pathname
        );

    };


    /* =====================================================
       Product Type Filter
    ===================================================== */

    const selectProductType = (
        type
    ) => {

        updateFilter(
            "type",
            type
        );

    };


    /* =====================================================
       Reset Filters
    ===================================================== */

    const resetFilters = () => {

        setFilters({

            search: "",

            type: "ALL",

            category: "",

            minPrice: "",

            maxPrice: "",

            availableOnly: false,

            sort: "default"

        });


        setCategoriesOpen(false);

        setProductTypesOpen(false);


        window.history.replaceState(
            {},
            "",
            window.location.pathname
        );

    };


    /* =====================================================
       Filter Products
    ===================================================== */

    const filteredProducts = useMemo(() => {

        let result = [
            ...products
        ];


        /* =========================
           Search
        ========================= */

        const search =
            filters.search
                .trim()
                .toLowerCase();


        if (search) {

            result =
                result.filter(
                    product => {

                        const name =
                            String(
                                product.name || ""
                            ).toLowerCase();


                        const scientificName =
                            String(
                                product.scientific_name || ""
                            ).toLowerCase();


                        const manufacturer =
                            String(
                                product.manufacturer || ""
                            ).toLowerCase();


                        return (

                            name.includes(search) ||

                            scientificName.includes(search) ||

                            manufacturer.includes(search)

                        );

                    }
                );

        }


        /* =========================
           Category
        ========================= */

        if (filters.category) {

            result =
                result.filter(
                    product =>

                        String(
                            product.category_id
                        ) ===
                        String(
                            filters.category
                        )
                );

        }


        /* =========================
           Product Type
        ========================= */

        if (
            filters.type !== "ALL"
        ) {

            result =
                result.filter(
                    product =>
                        product.product_type ===
                        filters.type
                );

        }


        /* =========================
           Price
        ========================= */

        if (
            filters.minPrice !== ""
        ) {

            const min =
                Number(
                    filters.minPrice
                );


            result =
                result.filter(
                    product =>
                        Number(
                            product.selling_price || 0
                        ) >= min
                );

        }


        if (
            filters.maxPrice !== ""
        ) {

            const max =
                Number(
                    filters.maxPrice
                );


            result =
                result.filter(
                    product =>
                        Number(
                            product.selling_price || 0
                        ) <= max
                );

        }


        /* =========================
           Availability
        ========================= */

        if (
            filters.availableOnly
        ) {

            result =
                result.filter(
                    product =>
                        Number(
                            product.stock || 0
                        ) > 0
                );

        }


        /* =========================
           Sorting
        ========================= */

        if (
            filters.sort === "price_low"
        ) {

            result.sort(
                (a, b) =>

                    Number(
                        a.selling_price || 0
                    ) -

                    Number(
                        b.selling_price || 0
                    )
            );

        }


        if (
            filters.sort === "price_high"
        ) {

            result.sort(
                (a, b) =>

                    Number(
                        b.selling_price || 0
                    ) -

                    Number(
                        a.selling_price || 0
                    )
            );

        }


        if (
            filters.sort === "name"
        ) {

            result.sort(
                (a, b) =>

                    String(
                        a.name || ""
                    ).localeCompare(
                        String(
                            b.name || ""
                        ),
                        "ar"
                    )
            );

        }


        return result;

    }, [
        products,
        filters
    ]);


    /* =====================================================
       Active Filters Count
    ===================================================== */

    const activeFiltersCount = [

        filters.type !== "ALL",

        filters.category !== "",

        filters.minPrice !== "",

        filters.maxPrice !== "",

        filters.availableOnly

    ].filter(Boolean).length;


    /* =====================================================
       Selected Category Name
    ===================================================== */

    const selectedCategory =
        categories.find(
            category =>
                String(category.id) ===
                String(filters.category)
        )?.name || "";


    /* =====================================================
       Loading
    ===================================================== */

    if (
        loading ||
        authLoading
    ) {

        return (

            <div
                dir="rtl"
                className="
                    min-h-screen
                    bg-[#FAF8FC]
                    flex
                    items-center
                    justify-center
                "
            >

                <div className="text-center">

                    <div
                        className="
                            w-16
                            h-16
                            mx-auto
                            rounded-2xl
                            bg-[#F0E8FA]
                            flex
                            items-center
                            justify-center
                            animate-pulse
                        "
                    >

                        <Pill
                            size={30}
                            className="text-[#5B2A86]"
                        />

                    </div>


                    <p
                        className="
                            mt-5
                            text-gray-600
                            font-bold
                        "
                    >
                        جاري تحميل المنتجات...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div
            dir="rtl"
            className="
                min-h-screen
                bg-[#FAF8FC]
                py-10
            "
        >

            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-4
                    sm:px-6
                "
            >

                {/* =================================================
                    Search Bar
                ================================================= */}

                <div
                    className="
                        bg-white
                        border
                        border-gray-100
                        rounded-[28px]
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
                                relative
                                flex-1
                            "
                        >

                            <Search
                                size={21}
                                className="
                                    absolute
                                    right-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />


                            <input
                                value={
                                    filters.search
                                }
                                onChange={e =>
                                    updateFilter(
                                        "search",
                                        e.target.value
                                    )
                                }
                                placeholder="
                                    ابحث باسم الدواء أو المادة الفعالة أو الشركة...
                                "
                                className="
                                    w-full
                                    bg-[#F8F7FA]
                                    border
                                    border-transparent
                                    focus:border-[#5B2A86]
                                    rounded-2xl
                                    py-4
                                    pr-12
                                    pl-5
                                    outline-none
                                    transition
                                "
                            />


                            {filters.search && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        updateFilter(
                                            "search",
                                            ""
                                        )
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

                                    <X
                                        size={18}
                                    />

                                </button>

                            )}

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                setMobileFiltersOpen(
                                    !mobileFiltersOpen
                                )
                            }
                            className="
                                lg:hidden
                                flex
                                items-center
                                justify-center
                                gap-2
                                bg-[#5B2A86]
                                text-white
                                rounded-2xl
                                px-5
                                py-4
                                font-bold
                            "
                        >

                            <SlidersHorizontal
                                size={19}
                            />

                            الفلاتر

                            {activeFiltersCount > 0 && (

                                <span
                                    className="
                                        bg-white
                                        text-[#5B2A86]
                                        w-6
                                        h-6
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        text-xs
                                    "
                                >
                                    {
                                        activeFiltersCount
                                    }
                                </span>

                            )}

                        </button>

                    </div>

                </div>


                {/* =================================================
                    Main Content
                ================================================= */}

                <div
                    className="
                        grid
                        lg:grid-cols-[280px_1fr]
                        gap-8
                        mt-8
                    "
                >

                    {/* =================================================
                        Filters Sidebar
                    ================================================= */}

                    <aside
                        className={`
                            ${mobileFiltersOpen
                                ? "block"
                                : "hidden"
                            }
                            lg:block
                        `}
                    >

                        <div
                            className="
                                bg-white
                                rounded-[28px]
                                border
                                border-gray-100
                                shadow-sm
                                p-6
                                sticky
                                top-24
                            "
                        >

                            {/* Sidebar Header */}

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    mb-7
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <SlidersHorizontal
                                        size={20}
                                        className="text-[#5B2A86]"
                                    />

                                    <h2
                                        className="
                                            font-black
                                            text-lg
                                        "
                                    >
                                        تصفية المنتجات
                                    </h2>

                                </div>


                                {activeFiltersCount > 0 && (

                                    <span
                                        className="
                                            bg-[#F0E8FA]
                                            text-[#5B2A86]
                                            rounded-full
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-bold
                                        "
                                    >
                                        {
                                            activeFiltersCount
                                        }
                                    </span>

                                )}

                            </div>


                            {/* =================================================
                                Categories Dropdown
                            ================================================= */}

                            <div className="mb-5">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCategoriesOpen(
                                            !categoriesOpen
                                        )
                                    }
                                    className="
                                        w-full
                                        flex
                                        items-center
                                        justify-between
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-gray-50
                                        hover:bg-[#F0E8FA]
                                        transition
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
                                                w-9
                                                h-9
                                                rounded-xl
                                                bg-[#F0E8FA]
                                                text-[#5B2A86]
                                                flex
                                                items-center
                                                justify-center
                                            "
                                        >

                                            <Package
                                                size={18}
                                            />

                                        </div>


                                        <div className="text-right">

                                            <h3
                                                className="
                                                    font-black
                                                    text-sm
                                                "
                                            >
                                                الأقسام
                                            </h3>


                                            {selectedCategory && (

                                                <p
                                                    className="
                                                        text-xs
                                                        text-[#5B2A86]
                                                        mt-0.5
                                                    "
                                                >
                                                    {
                                                        selectedCategory
                                                    }
                                                </p>

                                            )}

                                        </div>

                                    </div>


                                    <ChevronDown
                                        size={18}
                                        className={`
                                            text-gray-500
                                            transition-transform
                                            duration-300
                                            ${categoriesOpen
                                                ? "rotate-180"
                                                : ""
                                            }
                                        `}
                                    />

                                </button>


                                {categoriesOpen && (

                                    <div
                                        className="
                                            mt-2
                                            space-y-1
                                            pr-1
                                        "
                                    >

                                        <button
                                            type="button"
                                            onClick={() =>
                                                selectCategory("")
                                            }
                                            className={`
                                                w-full
                                                flex
                                                items-center
                                                gap-3
                                                text-right
                                                px-4
                                                py-3
                                                rounded-xl
                                                text-sm
                                                transition
                                                ${filters.category === ""
                                                    ? "bg-[#F0E8FA] text-[#5B2A86] font-black"
                                                    : "text-gray-600 hover:bg-gray-50"
                                                }
                                            `}
                                        >

                                            <div
                                                className={`
                                                    w-8
                                                    h-8
                                                    rounded-lg
                                                    flex
                                                    items-center
                                                    justify-center
                                                    shrink-0
                                                    ${filters.category === ""
                                                        ? "bg-[#5B2A86] text-white"
                                                        : "bg-gray-100 text-gray-500"
                                                    }
                                                `}
                                            >

                                                <Package
                                                    size={16}
                                                />

                                            </div>


                                            <span>
                                                كل الأقسام
                                            </span>

                                        </button>


                                        {categories.map(
                                            category => {

                                                const active =
                                                    String(
                                                        filters.category
                                                    ) ===
                                                    String(
                                                        category.id
                                                    );


                                                return (

                                                    <button
                                                        key={
                                                            category.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            selectCategory(
                                                                active
                                                                    ? ""
                                                                    : category.id
                                                            )
                                                        }
                                                        className={`
                                                            w-full
                                                            flex
                                                            items-center
                                                            gap-3
                                                            text-right
                                                            px-4
                                                            py-3
                                                            rounded-xl
                                                            text-sm
                                                            transition
                                                            ${active
                                                                ? "bg-[#F0E8FA] text-[#5B2A86] font-black"
                                                                : "text-gray-600 hover:bg-gray-50"
                                                            }
                                                        `}
                                                    >

                                                        <div
                                                            className={`
                                                                w-8
                                                                h-8
                                                                rounded-lg
                                                                flex
                                                                items-center
                                                                justify-center
                                                                shrink-0
                                                                ${active
                                                                    ? "bg-[#5B2A86] text-white"
                                                                    : "bg-gray-100 text-gray-500"
                                                                }
                                                            `}
                                                        >

                                                            <Package
                                                                size={16}
                                                            />

                                                        </div>


                                                        <span>
                                                            {
                                                                category.name
                                                            }
                                                        </span>

                                                    </button>

                                                );

                                            }
                                        )}

                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                Product Type Dropdown
                            ================================================= */}

                            <div
                                className="
                                    border-t
                                    border-gray-100
                                    pt-5
                                    mb-7
                                "
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        setProductTypesOpen(
                                            !productTypesOpen
                                        )
                                    }
                                    className="
                                        w-full
                                        flex
                                        items-center
                                        justify-between
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-gray-50
                                        hover:bg-[#F0E8FA]
                                        transition
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
                                                w-9
                                                h-9
                                                rounded-xl
                                                bg-[#F0E8FA]
                                                text-[#5B2A86]
                                                flex
                                                items-center
                                                justify-center
                                            "
                                        >

                                            <Pill
                                                size={18}
                                            />

                                        </div>


                                        <div className="text-right">

                                            <h3
                                                className="
                                                    font-black
                                                    text-sm
                                                "
                                            >
                                                نوع المنتج
                                            </h3>


                                            {filters.type !== "ALL" && (

                                                <p
                                                    className="
                                                        text-xs
                                                        text-[#5B2A86]
                                                        mt-0.5
                                                    "
                                                >
                                                    {
                                                        PRODUCT_TYPES.find(
                                                            item =>
                                                                item.value ===
                                                                filters.type
                                                        )?.label
                                                    }
                                                </p>

                                            )}

                                        </div>

                                    </div>


                                    <ChevronDown
                                        size={18}
                                        className={`
                                            text-gray-500
                                            transition-transform
                                            duration-300
                                            ${productTypesOpen
                                                ? "rotate-180"
                                                : ""
                                            }
                                        `}
                                    />

                                </button>


                                {productTypesOpen && (

                                    <div
                                        className="
                                            mt-2
                                            space-y-1
                                            pr-1
                                        "
                                    >

                                        {PRODUCT_TYPES.map(
                                            item => (

                                                <button
                                                    key={
                                                        item.value
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        selectProductType(
                                                            item.value
                                                        )
                                                    }
                                                    className={`
                                                        w-full
                                                        text-right
                                                        px-4
                                                        py-3
                                                        rounded-xl
                                                        text-sm
                                                        transition
                                                        ${filters.type ===
                                                            item.value
                                                            ? "bg-[#F0E8FA] text-[#5B2A86] font-black"
                                                            : "text-gray-600 hover:bg-gray-50"
                                                        }
                                                    `}
                                                >

                                                    {
                                                        item.label
                                                    }

                                                </button>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>


                            {/* =================================================
                                Price
                            ================================================= */}

                            <div
                                className="
                                    border-t
                                    border-gray-100
                                    pt-6
                                    mb-7
                                "
                            >

                                <h3
                                    className="
                                        font-black
                                        text-sm
                                        mb-4
                                    "
                                >
                                    نطاق السعر
                                </h3>


                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-3
                                    "
                                >

                                    <input
                                        type="number"
                                        min="0"
                                        value={
                                            filters.minPrice
                                        }
                                        onChange={e =>
                                            updateFilter(
                                                "minPrice",
                                                e.target.value
                                            )
                                        }
                                        placeholder="من"
                                        className="
                                            w-full
                                            bg-gray-50
                                            rounded-xl
                                            p-3
                                            text-sm
                                            outline-none
                                            focus:ring-2
                                            focus:ring-[#5B2A86]/20
                                        "
                                    />


                                    <input
                                        type="number"
                                        min="0"
                                        value={
                                            filters.maxPrice
                                        }
                                        onChange={e =>
                                            updateFilter(
                                                "maxPrice",
                                                e.target.value
                                            )
                                        }
                                        placeholder="إلى"
                                        className="
                                            w-full
                                            bg-gray-50
                                            rounded-xl
                                            p-3
                                            text-sm
                                            outline-none
                                            focus:ring-2
                                            focus:ring-[#5B2A86]/20
                                        "
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                Availability
                            ================================================= */}

                            <div
                                className="
                                    border-t
                                    border-gray-100
                                    pt-6
                                "
                            >

                                <label
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        cursor-pointer
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >

                                        <Package
                                            size={18}
                                            className="text-gray-500"
                                        />


                                        <span
                                            className="
                                                text-sm
                                                font-bold
                                            "
                                        >
                                            المتوفر فقط
                                        </span>

                                    </div>


                                    <input
                                        type="checkbox"
                                        checked={
                                            filters.availableOnly
                                        }
                                        onChange={e =>
                                            updateFilter(
                                                "availableOnly",
                                                e.target.checked
                                            )
                                        }
                                        className="
                                            w-5
                                            h-5
                                            accent-[#5B2A86]
                                        "
                                    />

                                </label>

                            </div>


                            {/* =================================================
                                Reset
                            ================================================= */}

                            {activeFiltersCount > 0 && (

                                <button
                                    type="button"
                                    onClick={
                                        resetFilters
                                    }
                                    className="
                                        w-full
                                        mt-7
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        py-3
                                        rounded-xl
                                        border
                                        border-red-100
                                        text-red-500
                                        hover:bg-red-50
                                        font-bold
                                        text-sm
                                        transition
                                    "
                                >

                                    <RotateCcw
                                        size={16}
                                    />

                                    مسح الفلاتر

                                </button>

                            )}

                        </div>

                    </aside>


                    {/* =================================================
                        Products
                    ================================================= */}

                    <section>


                        {/* =================================================
                            Results Count
                        ================================================= */}

                        {activeFiltersCount > 0 && (

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                    mb-5
                                    bg-white
                                    border
                                    border-gray-100
                                    rounded-2xl
                                    px-5
                                    py-3
                                    shadow-sm
                                "
                            >

                                <p
                                    className="
                                        text-gray-500
                                        text-sm
                                    "
                                >

                                    عرض{" "}

                                    <strong
                                        className="
                                            text-[#5B2A86]
                                            font-black
                                        "
                                    >
                                        {
                                            filteredProducts.length
                                        }
                                    </strong>{" "}

                                    منتج

                                </p>


                                <div
                                    className="
                                        relative
                                        w-full
                                        sm:w-64
                                    "
                                >

                                    <select
                                        value={
                                            filters.sort
                                        }
                                        onChange={e =>
                                            updateFilter(
                                                "sort",
                                                e.target.value
                                            )
                                        }
                                        className="
                                            appearance-none
                                            w-full
                                            bg-white
                                            border
                                            border-gray-100
                                            rounded-xl
                                            py-3
                                            px-4
                                            pl-10
                                            outline-none
                                            text-sm
                                            font-bold
                                        "
                                    >

                                        {SORT_OPTIONS.map(
                                            option => (

                                                <option
                                                    key={
                                                        option.value
                                                    }
                                                    value={
                                                        option.value
                                                    }
                                                >
                                                    {
                                                        option.label
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>


                                    <ChevronDown
                                        size={17}
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            pointer-events-none
                                            text-gray-400
                                        "
                                    />

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            Sort Only - No Active Filters
                        ================================================= */}

                        {activeFiltersCount === 0 && (

                            <div
                                className="
                                    flex
                                    justify-end
                                    mb-5
                                "
                            >

                                <div
                                    className="
                                        relative
                                        w-full
                                        sm:w-64
                                    "
                                >

                                    <select
                                        value={
                                            filters.sort
                                        }
                                        onChange={e =>
                                            updateFilter(
                                                "sort",
                                                e.target.value
                                            )
                                        }
                                        className="
                                            appearance-none
                                            w-full
                                            bg-white
                                            border
                                            border-gray-100
                                            rounded-xl
                                            py-3
                                            px-4
                                            pl-10
                                            outline-none
                                            text-sm
                                            font-bold
                                            shadow-sm
                                        "
                                    >

                                        {SORT_OPTIONS.map(
                                            option => (

                                                <option
                                                    key={
                                                        option.value
                                                    }
                                                    value={
                                                        option.value
                                                    }
                                                >
                                                    {
                                                        option.label
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>


                                    <ChevronDown
                                        size={17}
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            pointer-events-none
                                            text-gray-400
                                        "
                                    />

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            Empty State
                        ================================================= */}

                        {filteredProducts.length === 0 ? (

                            <div
                                className="
                                    bg-white
                                    rounded-[30px]
                                    border
                                    border-gray-100
                                    p-14
                                    text-center
                                "
                            >

                                <div
                                    className="
                                        w-20
                                        h-20
                                        mx-auto
                                        bg-[#F8F5FC]
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <Search
                                        size={32}
                                        className="text-[#5B2A86]"
                                    />

                                </div>


                                <h2
                                    className="
                                        text-xl
                                        font-black
                                        mt-5
                                    "
                                >
                                    لم نجد ما تبحث عنه
                                </h2>


                                <p
                                    className="
                                        text-gray-500
                                        mt-2
                                    "
                                >
                                    جرّب تغيير كلمات البحث أو إزالة بعض الفلاتر.
                                </p>


                                <button
                                    type="button"
                                    onClick={
                                        resetFilters
                                    }
                                    className="
                                        mt-6
                                        bg-[#5B2A86]
                                        text-white
                                        px-6
                                        py-3
                                        rounded-xl
                                        font-bold
                                    "
                                >
                                    عرض كل المنتجات
                                </button>

                            </div>

                        ) : (

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-2
                                    xl:grid-cols-3
                                    gap-5
                                "
                            >

                                {filteredProducts.map(
                                    product => (

                                        <ProductCard
                                            key={
                                                product.id
                                            }
                                            product={
                                                product
                                            }
                                            isFavorite={
                                                favoriteIds.has(
                                                    product.id
                                                )
                                            }
                                            onFavoriteChange={
                                                handleFavoriteChange
                                            }
                                            favoriteLoading={
                                                favoriteLoadingIds.has(
                                                    product.id
                                                )
                                            }
                                        />

                                    )
                                )}

                            </div>

                        )}

                    </section>

                </div>

            </div>

        </div>

    );

}