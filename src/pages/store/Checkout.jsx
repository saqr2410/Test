import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    Truck,
    Store,
    ShieldCheck,
    ArrowRight,
    ShoppingBag,
    MapPin,
    Phone,
    User,
    CheckCircle2
} from "lucide-react";

import {
    useCart
} from "../../contexts/CartContext";

import {
    createOrder
} from "../../services/orders/orderService";

import toast from "react-hot-toast";


function Checkout() {

    const navigate = useNavigate();

    const {
        cartItems,
        total,
        clearCart
    } = useCart();


    const [loading, setLoading] = useState(false);


    const [form, setForm] = useState({
        customer_name: "",
        phone: "",
        address: "",
        delivery_method: "PICKUP"
    });


    const handleChange = e => {

        const {
            name,
            value
        } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

    };


    const handleDeliveryMethodChange = method => {

        setForm(prev => ({
            ...prev,
            delivery_method: method,
            address:
                method === "PICKUP"
                    ? ""
                    : prev.address
        }));

    };


    const submitOrder = async () => {

        const token =
            localStorage.getItem("access_token");


        if (!token) {

            toast.error(
                "يجب تسجيل الدخول أولاً"
            );

            navigate(
                "/login?next=/checkout"
            );

            return;
        }


        if (cartItems.length === 0) {

            toast.error(
                "السلة فارغة"
            );

            navigate("/products");

            return;
        }


        if (form.delivery_method === "DELIVERY") {

            toast.error(
                "التوصيل للمنزل غير متاح حاليًا، قريبًا"
            );

            return;
        }


        if (!form.customer_name.trim()) {

            toast.error(
                "من فضلك أدخل اسم العميل"
            );

            return;
        }


        if (!form.phone.trim()) {

            toast.error(
                "من فضلك أدخل رقم الهاتف"
            );

            return;
        }


        try {

            setLoading(true);


            const payload = {
                customer_name:
                    form.customer_name.trim(),

                phone:
                    form.phone.trim(),

                address: "",

                delivery_method:
                    "PICKUP"
            };


            const order =
                await createOrder(payload);


            toast.success(
                "تم إنشاء الطلب بنجاح"
            );


            clearCart();


            navigate(
                `/orders/${order.id}`
            );


        } catch (error) {

            console.error(
                "CHECKOUT ERROR:",
                error.response?.data || error
            );


            toast.error(
                error.response?.data?.error ||
                error.response?.data?.detail ||
                "حدث خطأ أثناء إنشاء الطلب"
            );

        } finally {

            setLoading(false);

        }

    };


    if (cartItems.length === 0) {

        return (

            <div
                dir="rtl"
                className="
                    min-h-screen
                    bg-[#FAF8FC]
                    flex
                    items-center
                    justify-center
                    px-5
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

                    <ShoppingBag
                        size={45}
                        className="
                            mx-auto
                            text-[#5B2A86]
                        "
                    />

                    <h1
                        className="
                            text-2xl
                            font-black
                            mt-5
                        "
                    >
                        السلة فارغة
                    </h1>

                    <button
                        onClick={() =>
                            navigate("/products")
                        }
                        className="
                            mt-6
                            bg-[#5B2A86]
                            text-white
                            px-7
                            py-3
                            rounded-xl
                            font-bold
                        "
                    >
                        العودة للمنتجات
                    </button>

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
                    max-w-6xl
                    mx-auto
                    px-4
                    sm:px-6
                "
            >

                {/* Header */}

                <div className="mb-8">

                    <button
                        onClick={() =>
                            navigate("/cart")
                        }
                        className="
                            flex
                            items-center
                            gap-2
                            text-gray-500
                            hover:text-[#5B2A86]
                            text-sm
                            font-bold
                        "
                    >

                        <ArrowRight size={17} />

                        العودة للسلة

                    </button>


                    <h1
                        className="
                            text-3xl
                            sm:text-4xl
                            font-black
                            text-gray-900
                            mt-5
                        "
                    >
                        إتمام الطلب
                    </h1>

                    <p
                        className="
                            text-gray-500
                            mt-2
                        "
                    >
                        أدخل بياناتك واختر طريقة استلام الطلب.
                    </p>

                </div>


                <div
                    className="
                        grid
                        lg:grid-cols-[1fr_380px]
                        gap-7
                    "
                >

                    {/* Form */}

                    <div className="space-y-6">

                        {/* Customer */}

                        <div
                            className="
                                bg-white
                                rounded-[30px]
                                border
                                border-gray-100
                                shadow-sm
                                p-6
                                sm:p-8
                            "
                        >

                            <h2
                                className="
                                    text-xl
                                    font-black
                                    text-gray-900
                                "
                            >
                                بيانات العميل
                            </h2>


                            <div className="mt-6 space-y-4">

                                <div className="relative">

                                    <User
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
                                        name="customer_name"
                                        value={
                                            form.customer_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="الاسم بالكامل"
                                        className="
                                            w-full
                                            bg-gray-50
                                            border
                                            border-gray-100
                                            focus:border-[#5B2A86]
                                            rounded-xl
                                            py-4
                                            pr-12
                                            pl-4
                                            outline-none
                                        "
                                    />

                                </div>


                                <div className="relative">

                                    <Phone
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
                                        name="phone"
                                        value={
                                            form.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="رقم الهاتف"
                                        type="tel"
                                        className="
                                            w-full
                                            bg-gray-50
                                            border
                                            border-gray-100
                                            focus:border-[#5B2A86]
                                            rounded-xl
                                            py-4
                                            pr-12
                                            pl-4
                                            outline-none
                                        "
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Delivery */}

                        <div
                            className="
                                bg-white
                                rounded-[30px]
                                border
                                border-gray-100
                                shadow-sm
                                p-6
                                sm:p-8
                            "
                        >

                            <h2
                                className="
                                    text-xl
                                    font-black
                                    text-gray-900
                                "
                            >
                                طريقة الاستلام
                            </h2>


                            <div
                                className="
                                    grid
                                    sm:grid-cols-2
                                    gap-4
                                    mt-6
                                "
                            >

                                {/* DELIVERY */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDeliveryMethodChange(
                                            "DELIVERY"
                                        )
                                    }
                                    className={`
                                        p-5
                                        rounded-2xl
                                        border-2
                                        text-right
                                        transition
                                        ${form.delivery_method === "DELIVERY"
                                            ? "border-[#5B2A86] bg-[#F8F5FC]"
                                            : "border-gray-100 hover:border-gray-200"
                                        }
                                    `}
                                >

                                    <Truck
                                        size={24}
                                        className="text-[#5B2A86]"
                                    />

                                    <div className="flex items-center gap-2 mt-3">

                                        <h3
                                            className="
                                                font-black
                                            "
                                        >
                                            توصيل للمنزل
                                        </h3>

                                        <span
                                            className="
                                                text-[10px]
                                                font-black
                                                bg-amber-100
                                                text-amber-700
                                                px-2
                                                py-1
                                                rounded-full
                                            "
                                        >
                                            قريبًا
                                        </span>

                                    </div>

                                    <p
                                        className="
                                            text-sm
                                            text-gray-500
                                            mt-1
                                        "
                                    >
                                        استلم طلبك عند باب المنزل
                                    </p>

                                </button>


                                {/* PICKUP */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDeliveryMethodChange(
                                            "PICKUP"
                                        )
                                    }
                                    className={`
                                        p-5
                                        rounded-2xl
                                        border-2
                                        text-right
                                        transition
                                        ${form.delivery_method === "PICKUP"
                                            ? "border-[#5B2A86] bg-[#F8F5FC]"
                                            : "border-gray-100 hover:border-gray-200"
                                        }
                                    `}
                                >

                                    <Store
                                        size={24}
                                        className="text-[#5B2A86]"
                                    />

                                    <h3
                                        className="
                                            font-black
                                            mt-3
                                        "
                                    >
                                        استلام من الصيدلية
                                    </h3>

                                    <p
                                        className="
                                            text-sm
                                            text-gray-500
                                            mt-1
                                        "
                                    >
                                        استلم الطلب من الصيدلية
                                    </p>

                                </button>

                            </div>


                            {/* Delivery unavailable message */}

                            {form.delivery_method === "DELIVERY" && (

                                <div
                                    className="
                                        mt-5
                                        bg-amber-50
                                        border
                                        border-amber-100
                                        rounded-2xl
                                        p-4
                                        flex
                                        gap-3
                                        text-amber-700
                                    "
                                >

                                    <Truck
                                        size={20}
                                        className="shrink-0"
                                    />

                                    <p className="text-sm leading-6">
                                        التوصيل للمنزل غير متاح حاليًا.
                                        الخدمة هتكون متاحة قريبًا.
                                    </p>

                                </div>

                            )}


                            {form.delivery_method === "PICKUP" && (

                                <div
                                    className="
                                        mt-5
                                        bg-green-50
                                        border
                                        border-green-100
                                        rounded-2xl
                                        p-4
                                        flex
                                        gap-3
                                        text-green-700
                                    "
                                >

                                    <CheckCircle2
                                        size={20}
                                        className="shrink-0"
                                    />

                                    <p className="text-sm leading-6">
                                        سيتم إشعارك عند تجهيز الطلب
                                        ليكون جاهزًا للاستلام من الصيدلية.
                                    </p>

                                </div>

                            )}

                        </div>

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
                                p-6
                                lg:sticky
                                lg:top-24
                            "
                        >

                            <h2
                                className="
                                    text-xl
                                    font-black
                                "
                            >
                                ملخص الطلب
                            </h2>


                            <div
                                className="
                                    mt-5
                                    max-h-72
                                    overflow-y-auto
                                    space-y-4
                                    pr-1
                                "
                            >

                                {cartItems.map(item => (

                                    <div
                                        key={item.id}
                                        className="
                                            flex
                                            justify-between
                                            gap-4
                                            text-sm
                                        "
                                    >

                                        <div className="min-w-0">

                                            <p
                                                className="
                                                    font-bold
                                                    truncate
                                                "
                                            >
                                                {item.name}
                                            </p>

                                            <p
                                                className="
                                                    text-gray-400
                                                    mt-1
                                                "
                                            >
                                                الكمية: {item.quantity}
                                            </p>

                                        </div>


                                        <span
                                            className="
                                                font-black
                                                whitespace-nowrap
                                            "
                                        >
                                            {
                                                Number(
                                                    item.selling_price
                                                ) *
                                                Number(
                                                    item.quantity
                                                )
                                            }{" "}
                                            جنيه
                                        </span>

                                    </div>

                                ))}

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
                                        text-gray-500
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


                            <button
                                onClick={submitOrder}
                                disabled={
                                    loading ||
                                    form.delivery_method === "DELIVERY"
                                }
                                className="
                                    w-full
                                    mt-7
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
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >

                                {loading ? (
                                    "جاري إنشاء الطلب..."
                                ) : form.delivery_method === "DELIVERY" ? (
                                    <>
                                        التوصيل قريبًا
                                        <Truck size={19} />
                                    </>
                                ) : (
                                    <>
                                        تأكيد الطلب
                                        <CheckCircle2 size={19} />
                                    </>
                                )}

                            </button>


                            <div
                                className="
                                    mt-5
                                    bg-[#F8F5FC]
                                    rounded-2xl
                                    p-4
                                    flex
                                    gap-3
                                "
                            >

                                <ShieldCheck
                                    size={21}
                                    className="
                                        text-[#5B2A86]
                                        shrink-0
                                    "
                                />

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                        leading-6
                                    "
                                >
                                    بيانات طلبك محمية، وسيتم التواصل
                                    معك لتأكيد تفاصيل الطلب والتوصيل.
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        </div>
    );
}

export default Checkout;