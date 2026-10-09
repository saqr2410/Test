import {
    Trash2,
    Plus,
    Minus,
    ShoppingBag,
    ArrowLeft,
    ShieldCheck,
    Truck
} from "lucide-react";

import {
    Link
} from "react-router-dom";

import {
    useCart
} from "../../contexts/CartContext";


export default function Cart() {

    const {
        cartItems,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        total
    } = useCart();


    const itemsCount = cartItems.reduce(
        (sum, item) =>
            sum + Number(item.quantity || 0),
        0
    );


    if (cartItems.length === 0) {

        return (

            <div
                dir="rtl"
                className="
                    min-h-screen
                    bg-[#FAF8FC]
                    py-20
                    px-5
                    flex
                    items-center
                    justify-center
                "
            >

                <div
                    className="
                        bg-white
                        border
                        border-gray-100
                        rounded-[35px]
                        shadow-sm
                        p-10
                        sm:p-14
                        text-center
                        max-w-lg
                        w-full
                    "
                >

                    <div
                        className="
                            w-24
                            h-24
                            mx-auto
                            rounded-full
                            bg-[#F0E8FA]
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <ShoppingBag
                            size={42}
                            className="text-[#5B2A86]"
                        />

                    </div>


                    <h1
                        className="
                            text-3xl
                            font-black
                            text-gray-900
                            mt-7
                        "
                    >
                        سلة المشتريات فارغة
                    </h1>


                    <p
                        className="
                            text-gray-500
                            mt-3
                        "
                    >
                        لم تقم بإضافة أي منتجات إلى السلة بعد.
                    </p>


                    <Link
                        to="/products"
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            mt-8
                            bg-[#5B2A86]
                            hover:bg-[#472064]
                            text-white
                            px-8
                            py-4
                            rounded-2xl
                            font-black
                        "
                    >
                        تصفح المنتجات
                        <ArrowLeft size={18} />
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

                {/* Header */}

                <div
                    className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-end
                        justify-between
                        gap-4
                        mb-8
                    "
                >

                    <div>

                        <span
                            className="
                                text-[#5B2A86]
                                text-sm
                                font-black
                            "
                        >
                            Rashed Smart Pharmacy
                        </span>

                        <h1
                            className="
                                text-3xl
                                sm:text-4xl
                                font-black
                                text-gray-900
                                mt-2
                            "
                        >
                            سلة المشتريات
                        </h1>

                        <p
                            className="
                                text-gray-500
                                mt-2
                            "
                        >
                            راجع منتجاتك قبل إتمام الطلب.
                        </p>

                    </div>


                    <span
                        className="
                            bg-white
                            border
                            border-gray-100
                            rounded-2xl
                            px-5
                            py-3
                            text-sm
                            font-bold
                            shadow-sm
                        "
                    >
                        {itemsCount} منتج
                    </span>

                </div>


                <div
                    className="
                        grid
                        lg:grid-cols-[1fr_380px]
                        gap-7
                    "
                >

                    {/* Items */}

                    <div className="space-y-4">

                        {cartItems.map(item => {

                            const itemTotal =
                                Number(item.selling_price || 0) *
                                Number(item.quantity || 0);


                            const imageUrl = item.image
                                ? (
                                    item.image.startsWith("http")
                                        ? item.image
                                        : `http://127.0.0.1:8000${item.image}`
                                )
                                : null;


                            return (

                                <div
                                    key={item.id}
                                    className="
                                        bg-white
                                        rounded-[28px]
                                        border
                                        border-gray-100
                                        p-4
                                        sm:p-5
                                        shadow-sm
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            flex-col
                                            sm:flex-row
                                            gap-5
                                            sm:items-center
                                        "
                                    >

                                        {/* Product */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-4
                                                flex-1
                                                min-w-0
                                            "
                                        >

                                            <div
                                                className="
                                                    w-24
                                                    h-24
                                                    shrink-0
                                                    bg-[#F8F5FC]
                                                    rounded-2xl
                                                    overflow-hidden
                                                    flex
                                                    items-center
                                                    justify-center
                                                "
                                            >

                                                {imageUrl ? (

                                                    <img
                                                        src={imageUrl}
                                                        alt={item.name}
                                                        className="
                                                            w-full
                                                            h-full
                                                            object-cover
                                                        "
                                                    />

                                                ) : (

                                                    <ShoppingBag
                                                        className="text-[#5B2A86]"
                                                    />

                                                )}

                                            </div>


                                            <div
                                                className="
                                                    min-w-0
                                                "
                                            >

                                                <Link
                                                    to={`/products/${item.id}`}
                                                    className="
                                                        font-black
                                                        text-gray-900
                                                        text-lg
                                                        hover:text-[#5B2A86]
                                                        line-clamp-2
                                                    "
                                                >
                                                    {item.name}
                                                </Link>


                                                {item.scientific_name && (

                                                    <p
                                                        className="
                                                            text-sm
                                                            text-gray-500
                                                            mt-1
                                                            truncate
                                                        "
                                                    >
                                                        {item.scientific_name}
                                                    </p>

                                                )}


                                                <p
                                                    className="
                                                        text-[#5B2A86]
                                                        font-black
                                                        mt-2
                                                    "
                                                >
                                                    {item.selling_price} جنيه
                                                </p>

                                            </div>

                                        </div>


                                        {/* Quantity */}

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                sm:justify-center
                                                gap-3
                                            "
                                        >

                                            <button
                                                onClick={() =>
                                                    decreaseQuantity(item.id)
                                                }
                                                className="
                                                    w-9
                                                    h-9
                                                    rounded-full
                                                    bg-gray-100
                                                    hover:bg-[#F0E8FA]
                                                    flex
                                                    items-center
                                                    justify-center
                                                    transition
                                                "
                                            >
                                                <Minus size={17} />
                                            </button>


                                            <span
                                                className="
                                                    min-w-8
                                                    text-center
                                                    font-black
                                                "
                                            >
                                                {item.quantity}
                                            </span>


                                            <button
                                                onClick={() =>
                                                    increaseQuantity(item.id)
                                                }
                                                className="
                                                    w-9
                                                    h-9
                                                    rounded-full
                                                    bg-[#5B2A86]
                                                    hover:bg-[#472064]
                                                    text-white
                                                    flex
                                                    items-center
                                                    justify-center
                                                    transition
                                                "
                                            >
                                                <Plus size={17} />
                                            </button>

                                        </div>


                                        {/* Total */}

                                        <div
                                            className="
                                                sm:w-28
                                                text-left
                                                sm:text-right
                                            "
                                        >

                                            <span
                                                className="
                                                    block
                                                    text-xs
                                                    text-gray-400
                                                "
                                            >
                                                الإجمالي
                                            </span>

                                            <strong
                                                className="
                                                    block
                                                    text-lg
                                                    font-black
                                                    text-gray-900
                                                    mt-1
                                                "
                                            >
                                                {itemTotal} جنيه
                                            </strong>

                                        </div>


                                        {/* Remove */}

                                        <button
                                            onClick={() =>
                                                removeFromCart(item.id)
                                            }
                                            className="
                                                self-end
                                                sm:self-center
                                                w-10
                                                h-10
                                                rounded-xl
                                                text-red-500
                                                hover:bg-red-50
                                                flex
                                                items-center
                                                justify-center
                                            "
                                            aria-label="حذف المنتج"
                                        >
                                            <Trash2 size={19} />
                                        </button>

                                    </div>

                                </div>

                            );

                        })}

                    </div>


                    {/* Summary */}

                    <aside>

                        <div
                            className="
                                bg-white
                                rounded-[30px]
                                border
                                border-gray-100
                                shadow-sm
                                p-7
                                lg:sticky
                                lg:top-24
                            "
                        >

                            <h2
                                className="
                                    text-2xl
                                    font-black
                                    text-gray-900
                                "
                            >
                                ملخص الطلب
                            </h2>


                            <div
                                className="
                                    mt-7
                                    space-y-4
                                "
                            >

                                <div
                                    className="
                                        flex
                                        justify-between
                                        text-gray-500
                                    "
                                >

                                    <span>
                                        المنتجات
                                    </span>

                                    <span className="font-bold text-gray-800">
                                        {itemsCount}
                                    </span>

                                </div>


                                <div
                                    className="
                                        flex
                                        justify-between
                                        text-gray-500
                                    "
                                >

                                    <span>
                                        الشحن
                                    </span>

                                    <span
                                        className="
                                            text-green-600
                                            font-bold
                                        "
                                    >
                                        يتم تحديده عند الطلب
                                    </span>

                                </div>

                            </div>


                            <div
                                className="
                                    border-t
                                    border-gray-100
                                    my-6
                                "
                            />


                            <div
                                className="
                                    flex
                                    justify-between
                                    items-center
                                "
                            >

                                <span
                                    className="
                                        text-gray-600
                                        font-bold
                                    "
                                >
                                    الإجمالي
                                </span>

                                <span
                                    className="
                                        text-3xl
                                        font-black
                                        text-[#5B2A86]
                                    "
                                >
                                    {total}
                                    <span className="text-sm mr-1">
                                        جنيه
                                    </span>
                                </span>

                            </div>


                            <Link
                                to="/checkout"
                                className="
                                    mt-7
                                    w-full
                                    bg-[#5B2A86]
                                    hover:bg-[#472064]
                                    text-white
                                    py-4
                                    rounded-2xl
                                    font-black
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    transition
                                "
                            >
                                إتمام الطلب
                                <ArrowLeft size={18} />
                            </Link>


                            <div
                                className="
                                    mt-6
                                    space-y-3
                                    text-sm
                                    text-gray-500
                                "
                            >

                                <div className="flex items-center gap-2">
                                    <ShieldCheck
                                        size={17}
                                        className="text-green-600"
                                    />
                                    شراء آمن ومنتجات موثوقة
                                </div>

                                <div className="flex items-center gap-2">
                                    <Truck
                                        size={17}
                                        className="text-[#5B2A86]"
                                    />
                                    خيارات توصيل مرنة
                                </div>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        </div>
    );
}