import {
    useEffect,
    useState
} from "react";

import {
    Heart,
    ShoppingBag,
    ArrowLeft,
    Sparkles,
    Pill
} from "lucide-react";

import {
    Link
} from "react-router-dom";

import toast from "react-hot-toast";

import ProductCard from "../../../components/store/products/ProductCard";

import {
    getFavorites,
    removeFavorite
} from "../../../services/favorites/favoriteService";

import {
    getStoreProducts
} from "../../../services/products/productService";

import {
    useAuth
} from "../../../contexts/AuthContext";


export default function Favorites() {

    const {
        loading: authLoading,
        isAuthenticated
    } = useAuth();


    const [favorites, setFavorites] = useState([]);

    const [loading, setLoading] = useState(true);

    const [removingId, setRemovingId] = useState(null);


    /* =====================================================
       Load Favorites
    ===================================================== */

    useEffect(() => {

        if (authLoading) {
            return;
        }

        if (!isAuthenticated) {

            setFavorites([]);

            setLoading(false);

            return;

        }

        loadFavorites();

    }, [
        authLoading,
        isAuthenticated
    ]);


    /* =====================================================
       Load Favorites
    ===================================================== */

    const loadFavorites = async () => {

        try {

            setLoading(true);


            const [
                favoritesData,
                productsData
            ] = await Promise.all([

                getFavorites(),

                getStoreProducts()

            ]);


            const favoriteItems =
                Array.isArray(favoritesData)
                    ? favoritesData
                    : favoritesData?.results || [];


            const productsItems =
                Array.isArray(productsData)
                    ? productsData
                    : productsData?.results || [];


            const productsMap =
                new Map(
                    productsItems.map(
                        product => [
                            product.id,
                            product
                        ]
                    )
                );


            const normalizedFavorites =
                favoriteItems
                    .map(
                        favorite => {

                            const favoriteProduct =
                                favorite?.product;

                            if (!favoriteProduct) {
                                return null;
                            }


                            const fullProduct =
                                productsMap.get(
                                    favoriteProduct.id
                                );


                            return {

                                ...favoriteProduct,

                                ...(fullProduct || {}),

                                id:
                                    favoriteProduct.id

                            };

                        }
                    )
                    .filter(Boolean);


            setFavorites(
                normalizedFavorites
            );

        } catch (error) {

            console.error(
                "FAVORITES ERROR:",
                error
            );

            toast.error(
                "تعذر تحميل المنتجات المفضلة"
            );

            setFavorites([]);

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       Remove Favorite
    ===================================================== */

    const handleFavoriteChange = async (
        productId,
        nextFavorite
    ) => {

        if (nextFavorite) {
            return;
        }


        if (
            removingId === productId
        ) {
            return;
        }


        try {

            setRemovingId(
                productId
            );


            await removeFavorite(
                productId
            );


            setFavorites(prev =>
                prev.filter(
                    product =>
                        product.id !== productId
                )
            );


            toast.success(
                "تمت الإزالة من المفضلة"
            );

        } catch (error) {

            console.error(
                "REMOVE FAVORITE ERROR:",
                error
            );

            toast.error(
                "حدث خطأ أثناء إزالة المنتج"
            );

        } finally {

            setRemovingId(null);

        }

    };


    /* =====================================================
       Auth Loading
    ===================================================== */

    if (authLoading) {

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

                        <Heart
                            size={30}
                            className="text-red-500"
                            fill="currentColor"
                        />

                    </div>


                    <p
                        className="
                            mt-5
                            text-gray-600
                            font-bold
                        "
                    >
                        جاري تحميل المفضلة...
                    </p>

                </div>

            </div>

        );

    }


    /* =====================================================
       Not Authenticated
    ===================================================== */

    if (!isAuthenticated) {

        return (

            <div
                dir="rtl"
                className="
                    min-h-screen
                    bg-[#FAF8FC]
                    py-10
                    md:py-14
                "
            >

                <div className="max-w-6xl mx-auto px-4 sm:px-6">

                    <div className="mb-8 md:mb-10">

                        <div className="flex items-center gap-3 mb-3">

                            <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center">

                                <Heart
                                    size={23}
                                    className="text-red-500"
                                    fill="currentColor"
                                />

                            </div>

                            <span className="text-sm font-bold text-[#5B2A86]">
                                حسابي
                            </span>

                        </div>


                        <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                            المنتجات المفضلة
                        </h1>


                        <p className="text-gray-500 mt-2">
                            المنتجات التي حفظتها للوصول إليها بسرعة
                        </p>

                    </div>


                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

                        <div className="px-6 py-14 md:px-10 md:py-20 text-center">

                            <div className="relative w-28 h-28 mx-auto mb-7">

                                <div className="absolute inset-0 bg-red-50 rounded-[2rem] rotate-6" />

                                <div className="relative w-28 h-28 bg-white border border-red-100 rounded-[2rem] flex items-center justify-center shadow-sm">

                                    <Heart
                                        size={46}
                                        strokeWidth={1.6}
                                        className="text-red-500"
                                        fill="currentColor"
                                    />

                                </div>

                            </div>


                            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                                سجل الدخول أولًا
                            </h2>


                            <p className="text-gray-500 mt-3 max-w-md mx-auto leading-7">
                                سجل الدخول علشان تقدر تحفظ منتجاتك المفضلة وتوصل لها في أي وقت.
                            </p>


                            <Link
                                to="/login"
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    mt-8
                                    bg-[#5B2A86]
                                    text-white
                                    px-7
                                    py-3.5
                                    rounded-2xl
                                    font-bold
                                    shadow-lg
                                    shadow-purple-200
                                    hover:bg-[#4b216f]
                                    transition-all
                                "
                            >

                                تسجيل الدخول

                                <ArrowLeft size={18} />

                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       Loading Favorites
    ===================================================== */

    if (loading) {

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
                        جاري تحميل المفضلة...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div
            dir="rtl"
            className="min-h-screen bg-[#FAF8FC] py-10 md:py-14"
        >

            <div className="max-w-6xl mx-auto px-4 sm:px-6">


                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="mb-8 md:mb-10">

                    <div className="flex items-center gap-3 mb-3">

                        <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center">

                            <Heart
                                size={23}
                                className="text-red-500"
                                fill="currentColor"
                            />

                        </div>

                        <span className="text-sm font-bold text-[#5B2A86]">
                            حسابي
                        </span>

                    </div>


                    <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                        المنتجات المفضلة
                    </h1>


                    <p className="text-gray-500 mt-2">
                        المنتجات التي حفظتها للوصول إليها بسرعة
                    </p>

                </div>


                {/* ==========================================
                    EMPTY STATE
                ========================================== */}

                {favorites.length === 0 ? (

                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

                        <div className="px-6 py-14 md:px-10 md:py-20 text-center">


                            {/* ICON */}

                            <div className="relative w-28 h-28 mx-auto mb-7">

                                <div className="absolute inset-0 bg-red-50 rounded-[2rem] rotate-6" />

                                <div className="relative w-28 h-28 bg-white border border-red-100 rounded-[2rem] flex items-center justify-center shadow-sm">

                                    <Heart
                                        size={46}
                                        strokeWidth={1.6}
                                        className="text-red-500"
                                        fill="currentColor"
                                    />

                                </div>

                            </div>


                            {/* TITLE */}

                            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                                قائمة المفضلة فارغة
                            </h2>


                            {/* DESCRIPTION */}

                            <p className="text-gray-500 mt-3 max-w-md mx-auto leading-7">
                                لسه مفيش منتجات في المفضلة.
                                احفظ المنتجات اللي بتستخدمها باستمرار علشان تلاقيها بسهولة بعد كده.
                            </p>


                            {/* BUTTON */}

                            <Link
                                to="/products"
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    mt-8
                                    bg-[#5B2A86]
                                    text-white
                                    px-7
                                    py-3.5
                                    rounded-2xl
                                    font-bold
                                    shadow-lg
                                    shadow-purple-200
                                    hover:bg-[#4b216f]
                                    transition-all
                                "
                            >

                                <ShoppingBag size={19} />

                                تصفح المنتجات

                                <ArrowLeft size={18} />

                            </Link>

                        </div>


                        {/* ==========================================
                            INFO
                        ========================================== */}

                        <div className="border-t border-gray-100 bg-[#FCFAFD] px-6 py-5">

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">

                                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">

                                    <Sparkles
                                        size={17}
                                        className="text-[#5B2A86]"
                                    />

                                </div>

                                <p className="text-sm text-gray-500">
                                    اضغط على علامة القلب بجانب أي منتج لإضافته إلى المفضلة.
                                </p>

                            </div>

                        </div>

                    </div>

                ) : (

                    /* ==========================================
                       FAVORITES GRID
                    ========================================== */

                    <div
                        className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-3
                            gap-5
                        "
                    >

                        {favorites.map(
                            product => (

                                <ProductCard
                                    key={
                                        product.id
                                    }
                                    product={
                                        product
                                    }
                                    isFavorite={
                                        true
                                    }
                                    onFavoriteChange={
                                        handleFavoriteChange
                                    }
                                    favoriteLoading={
                                        removingId ===
                                        product.id
                                    }
                                />

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}