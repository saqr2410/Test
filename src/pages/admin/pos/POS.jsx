import { useEffect, useMemo, useRef, useState } from "react";

import {
    getPOSProducts,
    getPOSCategories,
    createPOSSale
} from "../../../services/pos/posService";

import PageHeader from "../../../components/ui/layout/PageHeader";
import Card from "../../../components/ui/cards/Card";
import Loading from "../../../components/ui/feedback/Loading";

import toast from "react-hot-toast";

import {
    Plus,
    Minus,
    Trash2,
    ShoppingCart,
    Package,
    X,
    Receipt,
    Search,
    User,
    CreditCard,
    Banknote,
    Landmark,
    Printer,
    QrCode,
    Clock,
    CheckCircle,
    Filter,
    RotateCcw,
    ScanLine,
    ChevronDown
} from "lucide-react";

export default function POS() {
    const barcodeRef = useRef(null);
    const searchRef = useRef(null);

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [search, setSearch] = useState("");
    const [barcodeInput, setBarcodeInput] = useState("");

    const [cart, setCart] = useState([]);

    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const [discount, setDiscount] = useState("");
    const [discountType, setDiscountType] = useState("amount");

    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [paidAmount, setPaidAmount] = useState("");

    const [showReceipt, setShowReceipt] = useState(false);
    const [lastSale, setLastSale] = useState(null);

    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {
        loadPOSData();
    }, []);

    const loadPOSData = async () => {
        try {
            setLoading(true);

            const [productsData, categoriesData] = await Promise.all([
                getPOSProducts(),
                getPOSCategories()
            ]);

            setProducts(Array.isArray(productsData) ? productsData : []);
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (error) {
            console.error("POS LOAD ERROR:", error);
            toast.error("فشل تحميل بيانات نقطة البيع");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // AUTO FOCUS
    // =========================

    useEffect(() => {
        barcodeRef.current?.focus();
    }, []);

    // =========================
    // KEYBOARD SHORTCUTS
    // =========================

    useEffect(() => {
        const handleKeyDown = (event) => {
            // F2 = barcode
            if (event.key === "F2") {
                event.preventDefault();
                barcodeRef.current?.focus();
            }

            // F3 = search
            if (event.key === "F3") {
                event.preventDefault();
                searchRef.current?.focus();
            }

            // Escape = clear search
            if (event.key === "Escape") {
                setSearch("");
                setBarcodeInput("");
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // =========================
    // BARCODE SCANNER
    // =========================

    useEffect(() => {
        if (!barcodeInput.trim()) return;

        const barcode = barcodeInput.trim();

        const foundProduct = products.find(
            (product) =>
                String(product.barcode || "").trim() === barcode
        );

        if (foundProduct) {
            addToCart(foundProduct);

            setBarcodeInput("");

            requestAnimationFrame(() => {
                barcodeRef.current?.focus();
            });
        }
    }, [barcodeInput, products]);

    // =========================
    // FILTER PRODUCTS
    // =========================

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (selectedCategory) {
            const categoryId = Number(selectedCategory);

            result = result.filter((product) => {
                return (
                    Number(product.category_id) === categoryId ||
                    Number(product.category) === categoryId ||
                    Number(product.category?.id) === categoryId
                );
            });
        }

        if (search.trim()) {
            const query = search.toLowerCase().trim();

            result = result.filter((product) => {
                return (
                    product.name?.toLowerCase().includes(query) ||
                    product.barcode?.toLowerCase().includes(query) ||
                    product.scientific_name
                        ?.toLowerCase()
                        .includes(query)
                );
            });
        }

        return result;
    }, [products, selectedCategory, search]);

    // =========================
    // CART
    // =========================

    const addToCart = (product) => {
        const stock = Number(product.stock ?? 0);

        if (product.stock !== undefined && stock <= 0) {
            toast.error(`المنتج "${product.name}" غير متوفر`);
            return;
        }

        setCart((currentCart) => {
            const existingItem = currentCart.find(
                (item) => item.id === product.id
            );

            if (existingItem) {
                if (
                    product.stock !== undefined &&
                    existingItem.quantity >= stock
                ) {
                    toast.error(`المخزون غير كافٍ`);
                    return currentCart;
                }

                return currentCart.map((item) =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                );
            }

            return [
                ...currentCart,
                {
                    id: product.id,
                    name: product.name,
                    barcode: product.barcode,
                    price: Number(product.selling_price || 0),
                    quantity: 1,
                    stock
                }
            ];
        });
    };

    const increaseQuantity = (id) => {
        setCart((currentCart) =>
            currentCart.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                if (
                    item.stock !== undefined &&
                    item.stock > 0 &&
                    item.quantity >= item.stock
                ) {
                    toast.error("لا يوجد مخزون كافٍ");
                    return item;
                }

                return {
                    ...item,
                    quantity: item.quantity + 1
                };
            })
        );
    };

    const decreaseQuantity = (id) => {
        setCart((currentCart) =>
            currentCart
                .map((item) => {
                    if (item.id !== id) {
                        return item;
                    }

                    if (item.quantity <= 1) {
                        return null;
                    }

                    return {
                        ...item,
                        quantity: item.quantity - 1
                    };
                })
                .filter(Boolean)
        );
    };

    const removeFromCart = (id) => {
        setCart((currentCart) =>
            currentCart.filter((item) => item.id !== id)
        );
    };

    // =========================
    // TOTALS
    // =========================

    const totalItems = useMemo(() => {
        return cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );
    }, [cart]);

    const subtotal = useMemo(() => {
        return cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );
    }, [cart]);

    const discountValue = useMemo(() => {
        const value = Number(discount) || 0;

        if (value <= 0) {
            return 0;
        }

        if (discountType === "percentage") {
            return Math.min(
                subtotal,
                (subtotal * value) / 100
            );
        }

        return Math.min(subtotal, value);
    }, [discount, discountType, subtotal]);

    const finalTotal = useMemo(() => {
        return Math.max(
            0,
            subtotal - discountValue
        );
    }, [subtotal, discountValue]);

    const paid = Number(paidAmount) || 0;

    const change = useMemo(() => {
        return Math.max(
            0,
            paid - finalTotal
        );
    }, [paid, finalTotal]);

    const remaining = useMemo(() => {
        return Math.max(
            0,
            finalTotal - paid
        );
    }, [finalTotal, paid]);

    // =========================
    // FORMAT
    // =========================

    const formatMoney = (value) => {
        return Number(value || 0).toLocaleString(
            "ar-EG",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };

    const getPaymentMethodLabel = (method) => {
        const map = {
            cash: "نقدي",
            card: "بطاقة",
            transfer: "تحويل بنكي"
        };

        return map[method] || method;
    };

    const getPaymentIcon = (method) => {
        if (method === "cash") {
            return <Banknote size={20} />;
        }

        if (method === "card") {
            return <CreditCard size={20} />;
        }

        return <Landmark size={20} />;
    };

    // =========================
    // CLEAR CART
    // =========================

    const resetSale = () => {
        setCart([]);
        setDiscount("");
        setDiscountType("amount");
        setCustomerName("");
        setCustomerPhone("");
        setPaidAmount("");
        setPaymentMethod("cash");
        setSearch("");
        setSelectedCategory("");

        requestAnimationFrame(() => {
            barcodeRef.current?.focus();
        });
    };

    const clearCart = () => {
        if (!cart.length) {
            return;
        }

        const confirmed = window.confirm(
            "هل أنت متأكد من تفريغ الفاتورة؟"
        );

        if (!confirmed) {
            return;
        }

        resetSale();

        toast.success("تم تفريغ الفاتورة");
    };

    // =========================
    // CHECKOUT
    // =========================

    const checkout = async () => {
        if (!cart.length) {
            toast.error("الفاتورة فارغة");
            return;
        }

        if (discountValue > subtotal) {
            toast.error(
                "الخصم لا يمكن أن يكون أكبر من الإجمالي"
            );
            return;
        }

        if (paid < finalTotal) {
            toast.error(
                `المبلغ المدفوع غير كافٍ. المتبقي ${formatMoney(
                    remaining
                )} جنيه`
            );
            return;
        }

        try {
            setCheckoutLoading(true);

            const payload = {
                customer_name:
                    customerName.trim() || undefined,

                customer_phone:
                    customerPhone.trim() || undefined,

                discount: discountValue,

                payment_method: paymentMethod,

                items: cart.map((item) => ({
                    product: item.id,
                    quantity: item.quantity
                }))
            };

            const sale = await createPOSSale(payload);

            setLastSale({
                ...sale,
                change
            });

            setShowReceipt(true);

            toast.success("تم تسجيل البيع بنجاح");

            // تحديث المنتجات للحصول على المخزون الجديد
            try {
                const updatedProducts =
                    await getPOSProducts();

                setProducts(
                    Array.isArray(updatedProducts)
                        ? updatedProducts
                        : []
                );
            } catch (refreshError) {
                console.error(
                    "PRODUCT REFRESH ERROR:",
                    refreshError
                );
            }

            resetSale();
        } catch (error) {
            console.error(
                "POS CHECKOUT ERROR:",
                error
            );

            const data = error?.response?.data;

            let message =
                data?.detail ||
                data?.message ||
                data?.non_field_errors?.[0];

            if (!message && typeof data === "object") {
                message = Object.values(data)
                    .flat()
                    .join(", ");
            }

            toast.error(
                message || "فشل تسجيل عملية البيع"
            );
        } finally {
            setCheckoutLoading(false);
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    // =========================
    // UI
    // =========================

    return (
        <div
            dir="rtl"
            className="space-y-6 pb-8"
        >
            {/* ================= HEADER ================= */}

            <PageHeader
                title="نقطة البيع"
                subtitle="إدارة وتسجيل المبيعات"
            />

            {/* ================= POS TOOLBAR ================= */}

            <Card>
                <div className="flex flex-col xl:flex-row gap-4">

                    {/* Barcode */}

                    <div className="relative flex-1">
                        <QrCode
                            size={21}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B2A86]"
                        />

                        <input
                            ref={barcodeRef}
                            type="text"
                            value={barcodeInput}
                            onChange={(e) =>
                                setBarcodeInput(
                                    e.target.value
                                )
                            }
                            placeholder="امسح الباركود أو اكتب الرقم..."
                            className="
                                w-full
                                border border-gray-200
                                rounded-2xl
                                pr-12
                                pl-20
                                py-3.5
                                bg-gray-50
                                focus:bg-white
                                focus:ring-2
                                focus:ring-[#5B2A86]/20
                                focus:border-[#5B2A86]
                                outline-none
                                transition
                            "
                            dir="ltr"
                            autoComplete="off"
                        />

                        <span
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-[10px]
                                text-gray-400
                                bg-white
                                border
                                px-2
                                py-1
                                rounded-lg
                            "
                        >
                            F2
                        </span>
                    </div>

                    {/* Category */}

                    <div className="w-full xl:w-64 relative">

                        <Filter
                            size={18}
                            className="
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                                pointer-events-none
                            "
                        />

                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                appearance-none
                                border border-gray-200
                                rounded-2xl
                                pr-11
                                pl-10
                                py-3.5
                                bg-white
                                outline-none
                                focus:ring-2
                                focus:ring-[#5B2A86]/20
                                focus:border-[#5B2A86]
                                transition
                            "
                        >
                            <option value="">
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

                        <ChevronDown
                            size={16}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                                pointer-events-none
                            "
                        />
                    </div>

                    {/* Reset */}

                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            setBarcodeInput("");
                            setSelectedCategory("");

                            barcodeRef.current?.focus();
                        }}
                        className="
                            px-5
                            py-3
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            hover:bg-gray-50
                            transition
                            flex
                            items-center
                            justify-center
                            gap-2
                            font-bold
                            text-gray-600
                        "
                    >
                        <RotateCcw size={18} />
                        إعادة ضبط
                    </button>
                </div>
            </Card>

            {/* ================= MAIN ================= */}

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">

                {/* ================= PRODUCTS ================= */}

                <section
                    className="
                        bg-white
                        rounded-3xl
                        border
                        shadow-sm
                        overflow-hidden
                    "
                >
                    {/* Products Header */}

                    <div className="p-5 border-b bg-gradient-to-l from-purple-50/70 to-white">

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                            <div>
                                <h2 className="text-xl font-black text-gray-900">
                                    المنتجات
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    اختر المنتج لإضافته إلى الفاتورة
                                </p>
                            </div>

                            <div className="flex items-center gap-3">

                                {/* Search */}

                                <div className="relative">

                                    <Search
                                        size={18}
                                        className="
                                            absolute
                                            right-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                        "
                                    />

                                    <input
                                        ref={searchRef}
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(
                                                e.target.value
                                            )
                                        }
                                        placeholder="بحث عن منتج..."
                                        className="
                                            w-full
                                            md:w-56
                                            border
                                            border-gray-200
                                            rounded-xl
                                            pr-10
                                            pl-12
                                            py-2.5
                                            outline-none
                                            focus:ring-2
                                            focus:ring-[#5B2A86]/20
                                            focus:border-[#5B2A86]
                                        "
                                    />

                                    <span
                                        className="
                                            absolute
                                            left-2
                                            top-1/2
                                            -translate-y-1/2
                                            text-[9px]
                                            text-gray-400
                                        "
                                    >
                                        F3
                                    </span>

                                </div>

                                <div
                                    className="
                                        hidden sm:flex
                                        items-center
                                        gap-1
                                        bg-gray-100
                                        px-3
                                        py-2
                                        rounded-xl
                                        text-sm
                                        font-bold
                                        text-gray-600
                                    "
                                >
                                    <Package size={16} />
                                    {filteredProducts.length}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products */}

                    <div className="p-5">

                        {filteredProducts.length === 0 ? (
                            <div
                                className="
                                    min-h-[420px]
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    text-gray-400
                                "
                            >
                                <div
                                    className="
                                        w-20
                                        h-20
                                        rounded-3xl
                                        bg-gray-100
                                        flex
                                        items-center
                                        justify-center
                                        mb-4
                                    "
                                >
                                    <Package size={38} />
                                </div>

                                <p className="font-bold text-lg">
                                    لا توجد منتجات
                                </p>

                                <p className="text-sm mt-1">
                                    جرّب تغيير البحث أو التصنيف
                                </p>
                            </div>
                        ) : (
                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    sm:grid-cols-3
                                    lg:grid-cols-4
                                    gap-4
                                    max-h-[650px]
                                    overflow-y-auto
                                    pr-1
                                "
                            >
                                {filteredProducts.map(
                                    (product) => {
                                        const stock =
                                            Number(
                                                product.stock ?? 0
                                            );

                                        const outOfStock =
                                            product.stock !==
                                            undefined &&
                                            stock <= 0;

                                        const lowStock =
                                            stock > 0 &&
                                            stock <= 5;

                                        return (
                                            <button
                                                key={product.id}
                                                type="button"
                                                disabled={
                                                    outOfStock
                                                }
                                                onClick={() =>
                                                    addToCart(
                                                        product
                                                    )
                                                }
                                                className={`
                                                    group
                                                    text-right
                                                    border
                                                    rounded-2xl
                                                    p-4
                                                    transition-all
                                                    duration-200
                                                    ${outOfStock
                                                        ? "opacity-50 bg-gray-50 cursor-not-allowed"
                                                        : "bg-white hover:-translate-y-0.5 hover:shadow-lg hover:border-[#5B2A86]/40 hover:bg-purple-50/30"
                                                    }
                                                `}
                                            >

                                                {/* Product Icon */}

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-between
                                                        mb-4
                                                    "
                                                >
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
                                                            group-hover:bg-[#5B2A86]
                                                            group-hover:text-white
                                                            transition
                                                        "
                                                    >
                                                        <Package
                                                            size={21}
                                                        />
                                                    </div>

                                                    {!outOfStock && (
                                                        <div
                                                            className="
                                                                w-7
                                                                h-7
                                                                rounded-full
                                                                bg-purple-50
                                                                text-[#5B2A86]
                                                                flex
                                                                items-center
                                                                justify-center
                                                            "
                                                        >
                                                            <Plus
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Name */}

                                                <h3
                                                    className="
                                                        font-bold
                                                        text-sm
                                                        text-gray-800
                                                        line-clamp-2
                                                        min-h-[40px]
                                                    "
                                                >
                                                    {
                                                        product.name
                                                    }
                                                </h3>

                                                {/* Scientific */}

                                                {product.scientific_name && (
                                                    <p
                                                        className="
                                                            text-[11px]
                                                            text-gray-400
                                                            mt-1
                                                            truncate
                                                        "
                                                    >
                                                        {
                                                            product.scientific_name
                                                        }
                                                    </p>
                                                )}

                                                {/* Price */}

                                                <div className="mt-4">

                                                    <p
                                                        className="
                                                            text-lg
                                                            font-black
                                                            text-[#5B2A86]
                                                        "
                                                    >
                                                        {formatMoney(
                                                            product.selling_price
                                                        )}{" "}
                                                        <span className="text-xs font-bold">
                                                            جنيه
                                                        </span>
                                                    </p>

                                                </div>

                                                {/* Stock */}

                                                <div className="mt-2">

                                                    {outOfStock ? (
                                                        <span
                                                            className="
                                                                inline-flex
                                                                text-xs
                                                                font-bold
                                                                text-red-600
                                                                bg-red-50
                                                                px-2
                                                                py-1
                                                                rounded-lg
                                                            "
                                                        >
                                                            نفد المخزون
                                                        </span>
                                                    ) : product.stock !==
                                                        undefined ? (
                                                        <span
                                                            className={`
                                                                text-xs
                                                                font-bold
                                                                ${lowStock
                                                                    ? "text-orange-600 bg-orange-50"
                                                                    : "text-gray-500 bg-gray-50"
                                                                }
                                                                px-2
                                                                py-1
                                                                rounded-lg
                                                                inline-block
                                                            `}
                                                        >
                                                            المخزون:{" "}
                                                            {stock}
                                                        </span>
                                                    ) : null}

                                                </div>

                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* ================= CART ================= */}

                <section
                    className="
                        bg-white
                        rounded-3xl
                        border
                        shadow-sm
                        overflow-hidden
                        flex
                        flex-col
                        min-h-[650px]
                        xl:h-[calc(100vh-190px)]
                        xl:min-h-[650px]
                        xl:sticky
                        xl:top-4
                    "
                >

                    {/* Cart Header */}

                    <div
                        className="
                            p-5
                            border-b
                            bg-gradient-to-l
                            from-[#5B2A86]
                            to-[#6f3c99]
                            text-white
                        "
                    >
                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        w-11
                                        h-11
                                        rounded-xl
                                        bg-white/15
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <Receipt size={22} />
                                </div>

                                <div>
                                    <h2 className="font-black text-lg">
                                        الفاتورة الحالية
                                    </h2>

                                    <p className="text-xs text-white/70">
                                        {totalItems} وحدة •{" "}
                                        {cart.length} منتج
                                    </p>
                                </div>

                            </div>

                            {cart.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearCart}
                                    className="
                                        px-3
                                        py-2
                                        rounded-xl
                                        bg-white/10
                                        hover:bg-white/20
                                        transition
                                        text-xs
                                        font-bold
                                    "
                                >
                                    تفريغ
                                </button>
                            )}

                        </div>
                    </div>

                    {/* Cart Items */}

                    <div
                        className="
                            flex-1
                            overflow-y-auto
                            p-4
                            space-y-3
                            min-h-0
                        "
                    >
                        {cart.length === 0 ? (
                            <div
                                className="
                                    h-full
                                    min-h-[300px]
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    text-center
                                    text-gray-400
                                "
                            >
                                <div
                                    className="
                                        w-20
                                        h-20
                                        rounded-3xl
                                        bg-gray-100
                                        flex
                                        items-center
                                        justify-center
                                        mb-4
                                    "
                                >
                                    <ShoppingCart
                                        size={38}
                                    />
                                </div>

                                <p className="font-bold text-lg">
                                    الفاتورة فارغة
                                </p>

                                <p className="text-sm mt-1">
                                    امسح الباركود أو اختر منتجًا
                                </p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="
                                        p-3
                                        rounded-2xl
                                        border
                                        border-gray-100
                                        bg-gray-50/70
                                    "
                                >

                                    <div className="flex gap-3">

                                        <div
                                            className="
                                                w-10
                                                h-10
                                                rounded-xl
                                                bg-purple-100
                                                text-[#5B2A86]
                                                flex
                                                items-center
                                                justify-center
                                                shrink-0
                                            "
                                        >
                                            <Package
                                                size={18}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">

                                            <div className="flex justify-between gap-2">

                                                <div className="min-w-0">
                                                    <p
                                                        className="
                                                            font-bold
                                                            text-sm
                                                            truncate
                                                        "
                                                    >
                                                        {
                                                            item.name
                                                        }
                                                    </p>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatMoney(
                                                            item.price
                                                        )}{" "}
                                                        جنيه
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item.id
                                                        )
                                                    }
                                                    className="
                                                        w-7
                                                        h-7
                                                        rounded-lg
                                                        text-red-500
                                                        hover:bg-red-100
                                                        flex
                                                        items-center
                                                        justify-center
                                                        shrink-0
                                                    "
                                                >
                                                    <Trash2
                                                        size={15}
                                                    />
                                                </button>

                                            </div>

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    mt-3
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        border
                                                        bg-white
                                                        rounded-xl
                                                        p-1
                                                    "
                                                >

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            decreaseQuantity(
                                                                item.id
                                                            )
                                                        }
                                                        className="
                                                            w-7
                                                            h-7
                                                            rounded-lg
                                                            flex
                                                            items-center
                                                            justify-center
                                                            hover:bg-gray-100
                                                        "
                                                    >
                                                        <Minus
                                                            size={
                                                                14
                                                            }
                                                        />
                                                    </button>

                                                    <span
                                                        className="
                                                            w-8
                                                            text-center
                                                            text-sm
                                                            font-black
                                                        "
                                                    >
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            increaseQuantity(
                                                                item.id
                                                            )
                                                        }
                                                        className="
                                                            w-7
                                                            h-7
                                                            rounded-lg
                                                            flex
                                                            items-center
                                                            justify-center
                                                            hover:bg-purple-50
                                                            text-[#5B2A86]
                                                        "
                                                    >
                                                        <Plus
                                                            size={
                                                                14
                                                            }
                                                        />
                                                    </button>

                                                </div>

                                                <strong className="text-[#5B2A86]">
                                                    {formatMoney(
                                                        item.price *
                                                        item.quantity
                                                    )}{" "}
                                                    جنيه
                                                </strong>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            ))
                        )}
                    </div>

                    {/* Checkout Area */}

                    <div
                        className="
                            border-t
                            bg-white
                            p-4
                            space-y-3
                        "
                    >

                        {/* Customer */}

                        <div className="flex gap-2">

                            <div className="relative flex-1">

                                <User
                                    size={16}
                                    className="
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                    "
                                />

                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) =>
                                        setCustomerName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="اسم العميل"
                                    className="
                                        w-full
                                        border
                                        rounded-xl
                                        pr-9
                                        px-3
                                        py-2.5
                                        text-sm
                                        outline-none
                                        focus:ring-2
                                        focus:ring-[#5B2A86]/20
                                        focus:border-[#5B2A86]
                                    "
                                />

                            </div>

                            <input
                                type="text"
                                value={customerPhone}
                                onChange={(e) =>
                                    setCustomerPhone(
                                        e.target.value
                                    )
                                }
                                placeholder="رقم الهاتف"
                                className="
                                    flex-1
                                    border
                                    rounded-xl
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    focus:ring-2
                                    focus:ring-[#5B2A86]/20
                                    focus:border-[#5B2A86]
                                "
                            />

                        </div>

                        {/* Payment */}

                        <div className="grid grid-cols-3 gap-2">

                            {[
                                {
                                    id: "cash",
                                    label: "نقدي",
                                    icon: <Banknote size={17} />
                                },
                                {
                                    id: "card",
                                    label: "بطاقة",
                                    icon: <CreditCard size={17} />
                                },
                                {
                                    id: "transfer",
                                    label: "تحويل",
                                    icon: <Landmark size={17} />
                                }
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() =>
                                        setPaymentMethod(
                                            method.id
                                        )
                                    }
                                    className={`
                                        py-2.5
                                        rounded-xl
                                        border
                                        flex
                                        items-center
                                        justify-center
                                        gap-1.5
                                        text-xs
                                        font-bold
                                        transition
                                        ${paymentMethod ===
                                            method.id
                                            ? "bg-purple-50 border-[#5B2A86] text-[#5B2A86]"
                                            : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                                        }
                                    `}
                                >
                                    {method.icon}
                                    {method.label}
                                </button>
                            ))}

                        </div>

                        {/* Paid */}

                        <div className="relative">

                            <Banknote
                                size={17}
                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />

                            <input
                                type="number"
                                min="0"
                                value={paidAmount}
                                onChange={(e) =>
                                    setPaidAmount(
                                        e.target.value
                                    )
                                }
                                placeholder="المبلغ المدفوع"
                                className="
                                    w-full
                                    border
                                    rounded-xl
                                    pr-9
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    focus:ring-2
                                    focus:ring-[#5B2A86]/20
                                    focus:border-[#5B2A86]
                                "
                            />

                        </div>

                        {/* Discount */}

                        <div className="flex gap-2">

                            <select
                                value={discountType}
                                onChange={(e) =>
                                    setDiscountType(
                                        e.target.value
                                    )
                                }
                                className="
                                    border
                                    rounded-xl
                                    px-3
                                    text-sm
                                    outline-none
                                    bg-white
                                "
                            >
                                <option value="amount">
                                    جنيه
                                </option>

                                <option value="percentage">
                                    %
                                </option>
                            </select>

                            <input
                                type="number"
                                min="0"
                                value={discount}
                                onChange={(e) =>
                                    setDiscount(
                                        e.target.value
                                    )
                                }
                                placeholder="الخصم"
                                className="
                                    flex-1
                                    border
                                    rounded-xl
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    focus:ring-2
                                    focus:ring-[#5B2A86]/20
                                    focus:border-[#5B2A86]
                                "
                            />

                        </div>

                        {/* Summary */}

                        <div
                            className="
                                bg-gray-50
                                rounded-2xl
                                p-4
                                space-y-2
                            "
                        >

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    الإجمالي
                                </span>

                                <strong>
                                    {formatMoney(
                                        subtotal
                                    )}{" "}
                                    جنيه
                                </strong>
                            </div>

                            {discountValue > 0 && (
                                <div
                                    className="
                                        flex
                                        justify-between
                                        text-sm
                                        text-red-500
                                    "
                                >
                                    <span>
                                        الخصم
                                    </span>

                                    <strong>
                                        -{" "}
                                        {formatMoney(
                                            discountValue
                                        )}{" "}
                                        جنيه
                                    </strong>
                                </div>
                            )}

                            <div
                                className="
                                    border-t
                                    pt-2
                                    flex
                                    justify-between
                                    items-center
                                "
                            >
                                <span className="font-bold">
                                    الإجمالي النهائي
                                </span>

                                <span
                                    className="
                                        text-2xl
                                        font-black
                                        text-[#5B2A86]
                                    "
                                >
                                    {formatMoney(
                                        finalTotal
                                    )}{" "}
                                    <span className="text-xs">
                                        جنيه
                                    </span>
                                </span>
                            </div>

                            {paid > 0 && (
                                <div
                                    className={`
                                        flex
                                        justify-between
                                        text-sm
                                        font-bold
                                        ${remaining > 0
                                            ? "text-orange-600"
                                            : "text-green-600"
                                        }
                                    `}
                                >
                                    <span>
                                        {remaining > 0
                                            ? "المتبقي"
                                            : "الباقي"}
                                    </span>

                                    <span>
                                        {formatMoney(
                                            remaining > 0
                                                ? remaining
                                                : change
                                        )}{" "}
                                        جنيه
                                    </span>
                                </div>
                            )}

                        </div>

                        {/* Checkout */}

                        <button
                            type="button"
                            onClick={checkout}
                            disabled={
                                !cart.length ||
                                checkoutLoading
                            }
                            className="
                                w-full
                                bg-[#5B2A86]
                                hover:bg-[#4a216d]
                                text-white
                                py-3.5
                                rounded-2xl
                                font-black
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                flex
                                items-center
                                justify-center
                                gap-2
                                shadow-lg
                                shadow-purple-900/10
                            "
                        >
                            {checkoutLoading ? (
                                <>
                                    <Clock
                                        size={20}
                                        className="animate-spin"
                                    />
                                    جاري تسجيل البيع...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    تسجيل البيع
                                </>
                            )}
                        </button>

                    </div>
                </section>
            </div>

            {/* ================= RECEIPT ================= */}

            {showReceipt && lastSale && (
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
                >

                    <div
                        className="
                            bg-white
                            rounded-3xl
                            shadow-2xl
                            w-full
                            max-w-md
                            overflow-hidden
                        "
                    >

                        {/* Success */}

                        <div
                            className="
                                text-center
                                p-7
                                bg-gradient-to-b
                                from-green-50
                                to-white
                            "
                        >

                            <div
                                className="
                                    w-20
                                    h-20
                                    rounded-full
                                    bg-green-100
                                    text-green-600
                                    flex
                                    items-center
                                    justify-center
                                    mx-auto
                                    mb-4
                                "
                            >
                                <CheckCircle
                                    size={40}
                                />
                            </div>

                            <h2 className="text-2xl font-black text-gray-900">
                                تمت العملية بنجاح
                            </h2>

                            <p className="text-gray-500 mt-1">
                                تم تسجيل عملية البيع
                            </p>

                            <div
                                className="
                                    inline-flex
                                    mt-4
                                    px-4
                                    py-2
                                    rounded-xl
                                    bg-white
                                    border
                                    text-sm
                                    font-bold
                                    text-gray-600
                                "
                            >
                                فاتورة #
                                {lastSale.id}
                            </div>

                        </div>

                        {/* Receipt */}

                        <div className="p-6 space-y-4">

                            <div className="space-y-3">

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        العميل
                                    </span>

                                    <strong>
                                        {
                                            lastSale.customer_name ||
                                            "عميل نقدي"
                                        }
                                    </strong>
                                </div>

                                {lastSale.customer_phone && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">
                                            الهاتف
                                        </span>

                                        <strong dir="ltr">
                                            {
                                                lastSale.customer_phone
                                            }
                                        </strong>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        طريقة الدفع
                                    </span>

                                    <span className="flex items-center gap-2 font-bold">
                                        {getPaymentIcon(
                                            lastSale.payment_method
                                        )}

                                        {getPaymentMethodLabel(
                                            lastSale.payment_method
                                        )}
                                    </span>
                                </div>

                            </div>

                            <div className="border-t border-dashed pt-4 space-y-3">

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        الإجمالي
                                    </span>

                                    <span>
                                        {formatMoney(
                                            lastSale.total_amount
                                        )}{" "}
                                        جنيه
                                    </span>
                                </div>

                                {Number(lastSale.discount) >
                                    0 && (
                                        <div
                                            className="
                                            flex
                                            justify-between
                                            text-red-500
                                        "
                                        >
                                            <span>
                                                الخصم
                                            </span>

                                            <span>
                                                -{" "}
                                                {formatMoney(
                                                    lastSale.discount
                                                )}{" "}
                                                جنيه
                                            </span>
                                        </div>
                                    )}

                                <div
                                    className="
                                        flex
                                        justify-between
                                        items-center
                                        border-t
                                        pt-3
                                    "
                                >
                                    <span className="font-black">
                                        النهائي
                                    </span>

                                    <strong
                                        className="
                                            text-2xl
                                            font-black
                                            text-[#5B2A86]
                                        "
                                    >
                                        {formatMoney(
                                            lastSale.final_amount
                                        )}{" "}
                                        جنيه
                                    </strong>
                                </div>

                                {Number(lastSale.change) >
                                    0 && (
                                        <div
                                            className="
                                            flex
                                            justify-between
                                            text-green-600
                                            font-bold
                                        "
                                        >
                                            <span>
                                                الباقي
                                            </span>

                                            <span>
                                                {formatMoney(
                                                    lastSale.change
                                                )}{" "}
                                                جنيه
                                            </span>
                                        </div>
                                    )}

                            </div>

                            {/* Actions */}

                            <div className="grid grid-cols-2 gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowReceipt(false);
                                        setLastSale(null);

                                        requestAnimationFrame(
                                            () => {
                                                barcodeRef.current?.focus();
                                            }
                                        );
                                    }}
                                    className="
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-gray-100
                                        hover:bg-gray-200
                                        font-bold
                                        transition
                                    "
                                >
                                    إغلاق
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        window.print();
                                    }}
                                    className="
                                        px-4
                                        py-3
                                        rounded-xl
                                        bg-[#5B2A86]
                                        hover:bg-[#4a216d]
                                        text-white
                                        font-bold
                                        transition
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                    "
                                >
                                    <Printer size={18} />
                                    طباعة
                                </button>

                            </div>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}