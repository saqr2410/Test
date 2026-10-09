import {
    ShoppingCart,
    Pill,
    ShieldCheck,
    Heart,
    Eye,
    AlertCircle
} from "lucide-react";

import {
    Link
} from "react-router-dom";

import {
    useCart
} from "../../../contexts/CartContext";

import toast from "react-hot-toast";


export default function ProductCard({
    product,
    isFavorite = false,
    onFavoriteChange,
    favoriteLoading = false
}) {

    const {
        addToCart
    } = useCart();


    const imageUrl = product.image
        ? (
            product.image.startsWith("http")
                ? product.image
                : `http://127.0.0.1:8000${product.image}`
        )
        : "https://placehold.co/600x500/f8f5fc/5B2A86?text=Medicine";


    const stock = Number(product.stock || 0);

    const isAvailable = stock > 0;


    const handleFavorite = async () => {

        if (
            favoriteLoading ||
            !onFavoriteChange
        ) {
            return;
        }


        await onFavoriteChange(
            product.id,
            !isFavorite
        );

    };


    const handleAddToCart = () => {

        if (!isAvailable) {
            toast.error("المنتج غير متوفر حاليًا");
            return;
        }

        addToCart(product);

    };


    return (

        <article
            className="
                group
                bg-white
                rounded-[26px]
                overflow-hidden
                border
                border-gray-100
                hover:border-[#E6D8F3]
                shadow-sm
                hover:shadow-xl
                transition-all
                duration-300
            "
        >

            {/* Image */}

            <div
                className="
                    relative
                    bg-[#F8F5FC]
                    p-4
                    overflow-hidden
                "
            >

                <Link to={`/products/${product.id}`}>

                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="
                            w-full
                            h-56
                            object-cover
                            rounded-[20px]
                            group-hover:scale-[1.03]
                            transition-transform
                            duration-500
                        "
                    />

                </Link>


                {/* Prescription */}

                {product.requires_prescription && (

                    <span
                        className="
                            absolute
                            top-6
                            right-6
                            flex
                            items-center
                            gap-1
                            bg-red-500
                            text-white
                            px-3
                            py-1.5
                            rounded-full
                            text-[11px]
                            font-black
                            shadow
                        "
                    >

                        <AlertCircle size={13} />

                        روشتة مطلوبة

                    </span>

                )}


                {/* Favorite */}

                <button
                    type="button"
                    onClick={handleFavorite}
                    disabled={favoriteLoading}
                    aria-label={
                        isFavorite
                            ? "إزالة من المفضلة"
                            : "إضافة للمفضلة"
                    }
                    className="
                        absolute
                        top-6
                        left-6
                        w-10
                        h-10
                        rounded-full
                        bg-white/95
                        backdrop-blur
                        flex
                        items-center
                        justify-center
                        shadow-sm
                        hover:scale-105
                        transition
                        disabled:opacity-60
                        disabled:cursor-wait
                    "
                >

                    <Heart
                        size={19}
                        className={
                            isFavorite
                                ? "fill-red-500 text-red-500"
                                : "text-gray-500"
                        }
                    />

                </button>


                {/* Availability */}

                <div
                    className="
                        absolute
                        bottom-6
                        right-6
                    "
                >

                    <span
                        className={`
                            inline-flex
                            items-center
                            gap-1.5
                            px-3
                            py-1.5
                            rounded-full
                            text-xs
                            font-bold
                            ${isAvailable
                                ? "bg-white text-green-600"
                                : "bg-red-50 text-red-500"
                            }
                        `}
                    >

                        <span
                            className={`
                                w-1.5
                                h-1.5
                                rounded-full
                                ${isAvailable
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }
                            `}
                        />

                        {isAvailable
                            ? "متوفر"
                            : "غير متوفر"}

                    </span>

                </div>

            </div>


            {/* Content */}

            <div className="p-5">

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-[#5B2A86]
                        text-xs
                        font-bold
                    "
                >

                    <Pill size={15} />

                    {product.product_type || "منتج صيدلي"}

                </div>


                <Link
                    to={`/products/${product.id}`}
                    className="
                        block
                        mt-3
                    "
                >

                    <h2
                        className="
                            font-black
                            text-gray-900
                            text-lg
                            leading-7
                            line-clamp-2
                            hover:text-[#5B2A86]
                            transition
                        "
                    >
                        {product.name}
                    </h2>

                </Link>


                {product.scientific_name && (

                    <p
                        className="
                            text-gray-500
                            text-sm
                            mt-1.5
                            line-clamp-1
                        "
                    >
                        {product.scientific_name}
                    </p>

                )}


                {product.manufacturer && (

                    <p
                        className="
                            text-gray-400
                            text-xs
                            mt-2
                            line-clamp-1
                        "
                    >
                        {product.manufacturer}
                    </p>

                )}


                <div
                    className="
                        flex
                        items-end
                        justify-between
                        gap-3
                        mt-5
                    "
                >

                    <div>

                        <span
                            className="
                                block
                                text-2xl
                                font-black
                                text-[#5B2A86]
                            "
                        >
                            {product.selling_price}

                            <span className="text-sm mr-1">
                                جنيه
                            </span>

                        </span>

                    </div>


                    {isAvailable && (

                        <div
                            className="
                                flex
                                items-center
                                gap-1
                                text-green-600
                                text-xs
                                font-bold
                            "
                        >

                            <ShieldCheck size={15} />

                            متاح للطلب

                        </div>

                    )}

                </div>


                <div
                    className="
                        grid
                        grid-cols-[1fr_auto]
                        gap-2
                        mt-5
                    "
                >

                    <button
                        onClick={handleAddToCart}
                        disabled={!isAvailable}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            bg-[#5B2A86]
                            hover:bg-[#472064]
                            text-white
                            py-3
                            rounded-xl
                            font-bold
                            transition
                            disabled:bg-gray-300
                            disabled:cursor-not-allowed
                        "
                    >

                        <ShoppingCart size={18} />

                        {isAvailable
                            ? "إضافة للسلة"
                            : "غير متوفر"}

                    </button>


                    <Link
                        to={`/products/${product.id}`}
                        className="
                            w-12
                            rounded-xl
                            bg-gray-100
                            hover:bg-[#F0E8FA]
                            text-gray-600
                            hover:text-[#5B2A86]
                            flex
                            items-center
                            justify-center
                            transition
                        "
                        aria-label="عرض التفاصيل"
                    >

                        <Eye size={19} />

                    </Link>

                </div>

            </div>

        </article>

    );

}