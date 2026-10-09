import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    ShoppingCart,
    ShieldCheck,
    PackageCheck,
    Heart,
    ChevronLeft,
    Pill,
    AlertCircle,
    Truck,
    ArrowRight
} from "lucide-react";

import {
    getProductDetails
} from "../../services/products/productService";

import {
    useCart
} from "../../contexts/CartContext";

import toast from "react-hot-toast";


export default function ProductDetails() {

    const { id } = useParams();

    const {
        addToCart
    } = useCart();


    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [favorite, setFavorite] = useState(false);


    useEffect(() => {

        loadProduct();

    }, [id]);


    const loadProduct = async () => {

        try {

            setLoading(true);

            const data =
                await getProductDetails(id);

            setProduct(data);

        } catch (error) {

            console.error(
                "PRODUCT DETAIL ERROR:",
                error
            );

            toast.error(
                "تعذر تحميل بيانات المنتج"
            );

        } finally {

            setLoading(false);

        }

    };


    const imageUrl = product?.image
        ? (
            product.image.startsWith("http")
                ? product.image
                : `http://127.0.0.1:8000${product.image}`
        )
        : "https://placehold.co/800x700/f8f5fc/5B2A86?text=Medicine";


    const stock =
        Number(product?.stock || 0);


    const isAvailable =
        stock > 0;


    const handleAddToCart = () => {

        if (!isAvailable) {

            toast.error(
                "المنتج غير متوفر حاليًا"
            );

            return;
        }

        addToCart(product);

        toast.success(
            "تمت إضافة المنتج إلى السلة"
        );

    };


    const handleFavorite = () => {

        setFavorite(prev => !prev);

        toast.success(
            favorite
                ? "تمت الإزالة من المفضلة"
                : "تمت الإضافة إلى المفضلة"
        );

    };


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
                        جاري تحميل المنتج...
                    </p>

                </div>

            </div>
        );

    }


    if (!product) {

        return (
            <div
                dir="rtl"
                className="
                    min-h-screen
                    bg-[#FAF8FC]
                    flex
                    items-center
                    justify-center
                    px-6
                "
            >

                <div
                    className="
                        bg-white
                        rounded-[30px]
                        p-10
                        text-center
                        max-w-md
                        w-full
                    "
                >

                    <h1
                        className="
                            text-2xl
                            font-black
                            text-gray-900
                        "
                    >
                        المنتج غير موجود
                    </h1>

                    <Link
                        to="/products"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            mt-6
                            bg-[#5B2A86]
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            font-bold
                        "
                    >
                        <ArrowRight size={18} />
                        العودة للمنتجات
                    </Link>

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
                py-8
                sm:py-12
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

                {/* Breadcrumb */}

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-gray-500
                        mb-8
                    "
                >

                    <Link
                        to="/"
                        className="hover:text-[#5B2A86]"
                    >
                        الرئيسية
                    </Link>

                    <ChevronLeft size={15} />

                    <Link
                        to="/products"
                        className="hover:text-[#5B2A86]"
                    >
                        المنتجات
                    </Link>

                    <ChevronLeft size={15} />

                    <span
                        className="
                            text-gray-800
                            font-bold
                            truncate
                        "
                    >
                        {product.name}
                    </span>

                </div>


                <div
                    className="
                        grid
                        lg:grid-cols-2
                        gap-8
                        lg:gap-12
                    "
                >

                    {/* Image */}

                    <div>

                        <div
                            className="
                                bg-white
                                rounded-[32px]
                                border
                                border-gray-100
                                p-5
                                shadow-sm
                            "
                        >

                            <div
                                className="
                                    relative
                                    bg-[#F8F5FC]
                                    rounded-[26px]
                                    overflow-hidden
                                "
                            >

                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="
                                        w-full
                                        h-[400px]
                                        sm:h-[500px]
                                        object-cover
                                    "
                                />


                                {product.requires_prescription && (

                                    <div
                                        className="
                                            absolute
                                            top-5
                                            right-5
                                            bg-red-500
                                            text-white
                                            rounded-full
                                            px-4
                                            py-2
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            font-black
                                        "
                                    >

                                        <AlertCircle size={16} />

                                        روشتة مطلوبة

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* Trust */}

                        <div
                            className="
                                grid
                                grid-cols-3
                                gap-3
                                mt-4
                            "
                        >

                            <div
                                className="
                                    bg-white
                                    rounded-2xl
                                    p-4
                                    text-center
                                    border
                                    border-gray-100
                                "
                            >

                                <ShieldCheck
                                    className="
                                        mx-auto
                                        text-[#5B2A86]
                                    "
                                />

                                <p
                                    className="
                                        text-xs
                                        font-bold
                                        mt-2
                                    "
                                >
                                    منتج موثوق
                                </p>

                            </div>


                            <div
                                className="
                                    bg-white
                                    rounded-2xl
                                    p-4
                                    text-center
                                    border
                                    border-gray-100
                                "
                            >

                                <PackageCheck
                                    className="
                                        mx-auto
                                        text-[#5B2A86]
                                    "
                                />

                                <p
                                    className="
                                        text-xs
                                        font-bold
                                        mt-2
                                    "
                                >
                                    متوفر
                                </p>

                            </div>


                            <div
                                className="
                                    bg-white
                                    rounded-2xl
                                    p-4
                                    text-center
                                    border
                                    border-gray-100
                                "
                            >

                                <Truck
                                    className="
                                        mx-auto
                                        text-[#5B2A86]
                                    "
                                />

                                <p
                                    className="
                                        text-xs
                                        font-bold
                                        mt-2
                                    "
                                >
                                    توصيل للمنزل
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Info */}

                    <div>

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                            "
                        >

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    bg-[#F0E8FA]
                                    text-[#5B2A86]
                                    px-4
                                    py-2
                                    rounded-full
                                    text-sm
                                    font-black
                                "
                            >

                                <Pill size={16} />

                                {product.product_type || "منتج صيدلي"}

                            </span>


                            <button
                                onClick={handleFavorite}
                                className="
                                    w-11
                                    h-11
                                    rounded-full
                                    bg-white
                                    border
                                    border-gray-100
                                    flex
                                    items-center
                                    justify-center
                                    hover:shadow
                                    transition
                                "
                            >

                                <Heart
                                    size={20}
                                    className={
                                        favorite
                                            ? "fill-red-500 text-red-500"
                                            : "text-gray-500"
                                    }
                                />

                            </button>

                        </div>


                        <h1
                            className="
                                text-3xl
                                sm:text-5xl
                                font-black
                                text-gray-900
                                mt-6
                                leading-tight
                            "
                        >
                            {product.name}
                        </h1>


                        {product.scientific_name && (

                            <p
                                className="
                                    text-gray-500
                                    text-lg
                                    mt-3
                                "
                            >
                                {product.scientific_name}
                            </p>

                        )}


                        {product.manufacturer && (

                            <p
                                className="
                                    text-gray-400
                                    mt-2
                                "
                            >
                                الشركة المصنعة:{" "}
                                <span className="font-bold">
                                    {product.manufacturer}
                                </span>
                            </p>

                        )}


                        {/* Price */}

                        <div
                            className="
                                mt-7
                                bg-white
                                border
                                border-gray-100
                                rounded-3xl
                                p-6
                            "
                        >

                            <span
                                className="
                                    text-sm
                                    text-gray-500
                                "
                            >
                                السعر
                            </span>

                            <div
                                className="
                                    text-4xl
                                    font-black
                                    text-[#5B2A86]
                                    mt-1
                                "
                            >
                                {product.selling_price}

                                <span
                                    className="
                                        text-lg
                                        mr-2
                                    "
                                >
                                    جنيه
                                </span>

                            </div>

                            <div
                                className={`
                                    mt-3
                                    text-sm
                                    font-bold
                                    ${isAvailable
                                        ? "text-green-600"
                                        : "text-red-500"
                                    }
                                `}
                            >
                                {isAvailable
                                    ? `متوفر حاليًا — ${stock} قطعة`
                                    : "غير متوفر حاليًا"}
                            </div>

                        </div>


                        {/* Add */}

                        <button
                            onClick={handleAddToCart}
                            disabled={!isAvailable}
                            className="
                                w-full
                                mt-6
                                bg-[#5B2A86]
                                hover:bg-[#472064]
                                text-white
                                py-4
                                rounded-2xl
                                font-black
                                text-lg
                                flex
                                items-center
                                justify-center
                                gap-3
                                transition
                                disabled:bg-gray-300
                                disabled:cursor-not-allowed
                            "
                        >

                            <ShoppingCart size={22} />

                            {isAvailable
                                ? "إضافة إلى السلة"
                                : "المنتج غير متوفر"}

                        </button>


                        {product.requires_prescription && (

                            <div
                                className="
                                    mt-4
                                    bg-red-50
                                    border
                                    border-red-100
                                    rounded-2xl
                                    p-4
                                    flex
                                    gap-3
                                    text-red-700
                                    text-sm
                                    leading-6
                                "
                            >

                                <AlertCircle
                                    size={20}
                                    className="shrink-0 mt-0.5"
                                />

                                <p>
                                    هذا المنتج يحتاج إلى وصفة طبية.
                                    يمكنك رفع الروشتة من خلال خدمة تحليل الروشتات.
                                </p>

                            </div>

                        )}


                        {/* Description */}

                        {product.description && (

                            <div
                                className="
                                    bg-white
                                    rounded-3xl
                                    border
                                    border-gray-100
                                    p-6
                                    mt-6
                                "
                            >

                                <h2
                                    className="
                                        text-xl
                                        font-black
                                        text-gray-900
                                    "
                                >
                                    وصف المنتج
                                </h2>

                                <p
                                    className="
                                        text-gray-600
                                        leading-8
                                        mt-4
                                    "
                                >
                                    {product.description}
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );
}