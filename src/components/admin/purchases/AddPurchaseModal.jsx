import { useEffect, useState } from "react";

import { X, Plus, Trash2 } from "lucide-react";

import toast from "react-hot-toast";

import {
    getSuppliers,
    getProducts,
    createPurchase
} from "../../../services/purchases/purchaseService";


export default function AddPurchaseModal({
    open,
    onClose,
    onSuccess
}) {

    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);

    const [supplier, setSupplier] = useState("");

    const [items, setItems] = useState([
        {
            product: "",
            quantity: "",
            purchase_price: "",
            expiry_date: ""
        }
    ]);

    const [loadingData, setLoadingData] = useState(false);
    const [saving, setSaving] = useState(false);


    // =========================
    // LOAD SUPPLIERS + PRODUCTS
    // =========================

    useEffect(() => {

        if (!open) {
            return;
        }

        const loadData = async () => {

            try {

                setLoadingData(true);

                const [
                    suppliersData,
                    productsData
                ] = await Promise.all([
                    getSuppliers(),
                    getProducts()
                ]);

                setSuppliers(
                    Array.isArray(suppliersData)
                        ? suppliersData
                        : []
                );

                setProducts(
                    Array.isArray(productsData)
                        ? productsData
                        : []
                );

            } catch (error) {

                console.error(
                    "ADD PURCHASE DATA ERROR:",
                    error
                );

                toast.error(
                    "فشل تحميل الموردين والمنتجات"
                );

            } finally {

                setLoadingData(false);

            }

        };

        loadData();

    }, [open]);


    // =========================
    // RESET
    // =========================

    useEffect(() => {

        if (!open) {

            setSupplier("");

            setItems([
                {
                    product: "",
                    quantity: "",
                    purchase_price: "",
                    expiry_date: ""
                }
            ]);

        }

    }, [open]);


    // =========================
    // ADD ITEM
    // =========================

    const addItem = () => {

        setItems((current) => [

            ...current,

            {
                product: "",
                quantity: "",
                purchase_price: "",
                expiry_date: ""
            }

        ]);

    };


    // =========================
    // REMOVE ITEM
    // =========================

    const removeItem = (index) => {

        if (items.length === 1) {

            toast.error(
                "يجب أن تحتوي الفاتورة على صنف واحد على الأقل"
            );

            return;

        }

        setItems((current) =>
            current.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );

    };


    // =========================
    // UPDATE ITEM
    // =========================

    const updateItem = (
        index,
        field,
        value
    ) => {

        setItems((current) =>

            current.map(
                (item, itemIndex) => {

                    if (itemIndex !== index) {

                        return item;

                    }

                    return {
                        ...item,
                        [field]: value
                    };

                }
            )

        );

    };


    // =========================
    // TOTAL
    // =========================

    const totalAmount = items.reduce(
        (total, item) => {

            const quantity =
                Number(item.quantity) || 0;

            const price =
                Number(item.purchase_price) || 0;

            return total + (
                quantity * price
            );

        },
        0
    );


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!supplier) {

            toast.error(
                "اختر المورد"
            );

            return;

        }


        if (!items.length) {

            toast.error(
                "أضف صنف واحد على الأقل"
            );

            return;

        }


        // =========================
        // VALIDATE ITEMS
        // =========================

        for (
            let index = 0;
            index < items.length;
            index++
        ) {

            const item =
                items[index];


            if (!item.product) {

                toast.error(
                    `اختر المنتج في الصنف رقم ${index + 1}`
                );

                return;

            }


            if (
                !item.quantity ||
                Number(item.quantity) <= 0
            ) {

                toast.error(
                    `أدخل كمية صحيحة في الصنف رقم ${index + 1}`
                );

                return;

            }


            if (
                !item.purchase_price ||
                Number(item.purchase_price) <= 0
            ) {

                toast.error(
                    `أدخل سعر شراء صحيح في الصنف رقم ${index + 1}`
                );

                return;

            }

        }


        try {

            setSaving(true);


            const data = {

                supplier: Number(supplier),

                items: items.map(
                    (item) => ({

                        product:
                            Number(item.product),

                        quantity:
                            Number(item.quantity),

                        purchase_price:
                            Number(
                                item.purchase_price
                            ),

                        expiry_date:
                            item.expiry_date ||
                            null

                    })
                )

            };


            await createPurchase(data);


            toast.success(
                "تم إنشاء فاتورة الشراء بنجاح"
            );


            if (onSuccess) {

                await onSuccess();

            }


            onClose();


        } catch (error) {

            console.error(
                "CREATE PURCHASE ERROR:",
                error
            );


            const responseData =
                error?.response?.data;


            let message =
                "فشل إنشاء فاتورة الشراء";


            if (
                typeof responseData?.detail ===
                "string"
            ) {

                message =
                    responseData.detail;

            } else if (
                typeof responseData?.message ===
                "string"
            ) {

                message =
                    responseData.message;

            } else if (
                typeof responseData ===
                "object"
            ) {

                const firstError =
                    Object.values(
                        responseData
                    )[0];

                if (Array.isArray(firstError)) {

                    message =
                        firstError[0];

                } else if (
                    typeof firstError ===
                    "string"
                ) {

                    message =
                        firstError;

                }

            }


            toast.error(message);

        } finally {

            setSaving(false);

        }

    };


    if (!open) {

        return null;

    }


    return (

        <div
            className="
                fixed
                inset-0
                z-[60]
                bg-black/40
                flex
                items-center
                justify-center
                p-4
            "
        >

            <div
                className="
                    bg-white
                    w-full
                    max-w-5xl
                    rounded-2xl
                    shadow-2xl
                    max-h-[92vh]
                    overflow-y-auto
                "
                dir="rtl"
            >

                {/* =========================
                    HEADER
                ========================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        p-6
                        border-b
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-black
                            "
                        >

                            إضافة فاتورة شراء

                        </h2>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >

                            إنشاء فاتورة وإضافة الأصناف

                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="
                            text-gray-500
                            hover:text-red-500
                            transition
                            disabled:opacity-50
                        "
                    >

                        <X size={22} />

                    </button>

                </div>


                {/* =========================
                    FORM
                ========================= */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        p-6
                        space-y-6
                    "
                >

                    {/* =========================
                        SUPPLIER
                    ========================= */}

                    <div>

                        <label
                            className="
                                block
                                font-bold
                                mb-2
                            "
                        >

                            المورد

                        </label>


                        <select
                            value={supplier}
                            onChange={(e) =>
                                setSupplier(
                                    e.target.value
                                )
                            }
                            disabled={
                                loadingData ||
                                saving
                            }
                            className="
                                w-full
                                border
                                rounded-xl
                                px-4
                                py-3
                                bg-white
                                outline-none
                                focus:ring-2
                                focus:ring-purple-200
                            "
                        >

                            <option value="">

                                {loadingData
                                    ? "جاري تحميل الموردين..."
                                    : "اختر المورد"
                                }

                            </option>


                            {suppliers.map(
                                (item) => (

                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >

                                        {
                                            item.name ||
                                            item.company_name ||
                                            `مورد #${item.id}`
                                        }

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* =========================
                        ITEMS
                    ========================= */}

                    <div className="space-y-4">

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-3
                            "
                        >

                            <div>

                                <h3
                                    className="
                                        text-lg
                                        font-black
                                    "
                                >

                                    أصناف الفاتورة

                                </h3>

                                <p
                                    className="
                                        text-sm
                                        text-gray-500
                                        mt-1
                                    "
                                >

                                    أضف المنتجات والكميات والأسعار

                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={addItem}
                                disabled={
                                    loadingData ||
                                    saving
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2
                                    rounded-xl
                                    bg-purple-100
                                    text-[#5B2A86]
                                    font-bold
                                    hover:bg-purple-200
                                    transition
                                    disabled:opacity-50
                                "
                            >

                                <Plus size={18} />

                                إضافة صنف

                            </button>

                        </div>


                        {/* ITEMS */}

                        <div className="space-y-4">

                            {items.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="
                                            border
                                            rounded-2xl
                                            p-4
                                            bg-gray-50
                                        "
                                    >

                                        <div
                                            className="
                                                grid
                                                grid-cols-1
                                                md:grid-cols-2
                                                lg:grid-cols-5
                                                gap-4
                                                items-end
                                            "
                                        >

                                            {/* PRODUCT */}

                                            <div
                                                className="
                                                    lg:col-span-2
                                                "
                                            >

                                                <label
                                                    className="
                                                        block
                                                        text-sm
                                                        font-bold
                                                        mb-2
                                                    "
                                                >

                                                    المنتج

                                                </label>


                                                <select
                                                    value={
                                                        item.product
                                                    }
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            "product",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={
                                                        loadingData ||
                                                        saving
                                                    }
                                                    className="
                                                        w-full
                                                        border
                                                        rounded-xl
                                                        px-3
                                                        py-2.5
                                                        bg-white
                                                        outline-none
                                                    "
                                                >

                                                    <option value="">

                                                        اختر المنتج

                                                    </option>


                                                    {products.map(
                                                        (product) => (

                                                            <option
                                                                key={
                                                                    product.id
                                                                }
                                                                value={
                                                                    product.id
                                                                }
                                                            >

                                                                {
                                                                    product.name
                                                                }

                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            </div>


                                            {/* QUANTITY */}

                                            <div>

                                                <label
                                                    className="
                                                        block
                                                        text-sm
                                                        font-bold
                                                        mb-2
                                                    "
                                                >

                                                    الكمية

                                                </label>


                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={
                                                        item.quantity
                                                    }
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            "quantity",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={saving}
                                                    className="
                                                        w-full
                                                        border
                                                        rounded-xl
                                                        px-3
                                                        py-2.5
                                                        bg-white
                                                        outline-none
                                                    "
                                                />

                                            </div>


                                            {/* PRICE */}

                                            <div>

                                                <label
                                                    className="
                                                        block
                                                        text-sm
                                                        font-bold
                                                        mb-2
                                                    "
                                                >

                                                    سعر الشراء

                                                </label>


                                                <input
                                                    type="number"
                                                    min="0.01"
                                                    step="0.01"
                                                    value={
                                                        item.purchase_price
                                                    }
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            "purchase_price",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={saving}
                                                    className="
                                                        w-full
                                                        border
                                                        rounded-xl
                                                        px-3
                                                        py-2.5
                                                        bg-white
                                                        outline-none
                                                    "
                                                />

                                            </div>


                                            {/* EXPIRY */}

                                            <div>

                                                <label
                                                    className="
                                                        block
                                                        text-sm
                                                        font-bold
                                                        mb-2
                                                    "
                                                >

                                                    تاريخ الانتهاء

                                                </label>


                                                <input
                                                    type="date"
                                                    value={
                                                        item.expiry_date
                                                    }
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            "expiry_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={saving}
                                                    className="
                                                        w-full
                                                        border
                                                        rounded-xl
                                                        px-3
                                                        py-2.5
                                                        bg-white
                                                        outline-none
                                                    "
                                                />

                                            </div>

                                        </div>


                                        {/* ITEM FOOTER */}

                                        <div
                                            className="
                                                mt-4
                                                flex
                                                items-center
                                                justify-between
                                                gap-4
                                            "
                                        >

                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-500
                                                "
                                            >

                                                إجمالي الصنف:

                                                <span
                                                    className="
                                                        font-black
                                                        text-gray-900
                                                        mr-2
                                                    "
                                                >

                                                    {(
                                                        (
                                                            Number(
                                                                item.quantity
                                                            ) || 0
                                                        ) *
                                                        (
                                                            Number(
                                                                item.purchase_price
                                                            ) || 0
                                                        )
                                                    ).toLocaleString(
                                                        "ar-EG",
                                                        {
                                                            minimumFractionDigits: 2
                                                        }
                                                    )}

                                                </span>

                                            </p>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(
                                                        index
                                                    )
                                                }
                                                disabled={
                                                    items.length === 1 ||
                                                    saving
                                                }
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    px-3
                                                    py-2
                                                    rounded-lg
                                                    bg-red-100
                                                    text-red-600
                                                    font-bold
                                                    text-sm
                                                    hover:bg-red-200
                                                    transition
                                                    disabled:opacity-40
                                                "
                                            >

                                                <Trash2
                                                    size={16}
                                                />

                                                حذف

                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    {/* =========================
                        TOTAL
                    ========================= */}

                    <div
                        className="
                            rounded-2xl
                            bg-gray-50
                            border
                            p-5
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >

                        <span
                            className="
                                font-bold
                                text-gray-600
                            "
                        >

                            إجمالي الفاتورة

                        </span>


                        <span
                            className="
                                text-2xl
                                font-black
                                text-[#5B2A86]
                            "
                        >

                            {totalAmount.toLocaleString(
                                "ar-EG",
                                {
                                    minimumFractionDigits: 2
                                }
                            )}

                        </span>

                    </div>


                    {/* =========================
                        ACTIONS
                    ========================= */}

                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                            pt-2
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="
                                px-5
                                py-2.5
                                rounded-xl
                                bg-gray-100
                                hover:bg-gray-200
                                font-bold
                                disabled:opacity-50
                            "
                        >

                            إلغاء

                        </button>


                        <button
                            type="submit"
                            disabled={
                                saving ||
                                loadingData
                            }
                            className="
                                px-6
                                py-2.5
                                rounded-xl
                                bg-[#5B2A86]
                                text-white
                                font-bold
                                hover:bg-[#4a216d]
                                transition
                                disabled:opacity-50
                            "
                        >

                            {saving
                                ? "جاري الحفظ..."
                                : "إنشاء فاتورة الشراء"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}