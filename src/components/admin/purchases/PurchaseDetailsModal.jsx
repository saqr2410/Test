import { useEffect, useState } from "react";

import { X } from "lucide-react";

import {
    getPurchase
} from "../../../services/purchases/purchaseService";


const statusConfig = {

    DRAFT: {
        label: "مسودة",
        className: "bg-gray-100 text-gray-700"
    },

    ORDERED: {
        label: "تم الطلب",
        className: "bg-blue-100 text-blue-700"
    },

    RECEIVED: {
        label: "تم الاستلام",
        className: "bg-green-100 text-green-700"
    },

    CANCELLED: {
        label: "ملغاة",
        className: "bg-red-100 text-red-700"
    }

};


export default function PurchaseDetailsModal({
    open,
    purchaseId,
    onClose
}) {

    const [purchase, setPurchase] =
        useState(null);

    const [loading, setLoading] =
        useState(false);


    // =========================
    // LOAD PURCHASE
    // =========================

    useEffect(() => {

        if (!open || !purchaseId) {

            return;

        }


        const loadPurchase = async () => {

            try {

                setLoading(true);

                const data =
                    await getPurchase(
                        purchaseId
                    );

                setPurchase(data);

            } catch (error) {

                console.error(
                    "PURCHASE DETAILS ERROR:",
                    error
                );

                setPurchase(null);

            } finally {

                setLoading(false);

            }

        };


        loadPurchase();

    }, [
        open,
        purchaseId
    ]);


    if (!open) {

        return null;

    }


    const supplierName =
        purchase?.supplier_name ||
        purchase?.supplier?.name ||
        (
            purchase?.supplier
                ? `مورد #${purchase.supplier}`
                : "-"
        );


    const status =
        statusConfig[
        purchase?.status
        ] || {

            label:
                purchase?.status || "-",

            className:
                "bg-gray-100 text-gray-700"

        };


    return (

        <div
            className="
                fixed
                inset-0
                z-[70]
                bg-black/40
                flex
                items-center
                justify-center
                p-4
            "
            dir="rtl"
        >

            <div
                className="
                    bg-white
                    w-full
                    max-w-4xl
                    rounded-2xl
                    shadow-2xl
                    max-h-[90vh]
                    overflow-y-auto
                "
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

                            تفاصيل فاتورة الشراء

                        </h2>


                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >

                            {purchaseId
                                ? `PO-${purchaseId}`
                                : "-"
                            }

                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            text-gray-500
                            hover:text-red-500
                        "
                    >

                        <X size={22} />

                    </button>

                </div>


                {/* =========================
                    CONTENT
                ========================= */}

                {loading ? (

                    <div
                        className="
                            p-10
                            text-center
                            text-gray-500
                        "
                    >

                        جاري تحميل بيانات الفاتورة...

                    </div>

                ) : !purchase ? (

                    <div
                        className="
                            p-10
                            text-center
                            text-red-500
                        "
                    >

                        فشل تحميل بيانات الفاتورة

                    </div>

                ) : (

                    <div className="p-6 space-y-6">

                        {/* =========================
                            INFO
                        ========================= */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-4
                                gap-4
                            "
                        >

                            <InfoCard
                                label="رقم الفاتورة"
                                value={`PO-${purchase.id}`}
                            />


                            <InfoCard
                                label="المورد"
                                value={supplierName}
                            />


                            <InfoCard
                                label="التاريخ"
                                value={
                                    purchase.created_at
                                        ? new Date(
                                            purchase.created_at
                                        ).toLocaleDateString(
                                            "ar-EG"
                                        )
                                        : "-"
                                }
                            />


                            <div
                                className="
                                    border
                                    rounded-xl
                                    p-4
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        text-gray-500
                                        mb-2
                                    "
                                >

                                    الحالة

                                </p>


                                <span
                                    className={`
                                        inline-flex
                                        px-3
                                        py-1
                                        rounded-full
                                        text-sm
                                        font-bold
                                        ${status.className}
                                    `}
                                >

                                    {status.label}

                                </span>

                            </div>

                        </div>


                        {/* =========================
                            ITEMS
                        ========================= */}

                        <div>

                            <h3
                                className="
                                    text-lg
                                    font-black
                                    mb-4
                                "
                            >

                                أصناف الفاتورة

                            </h3>


                            <div
                                className="
                                    border
                                    rounded-2xl
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
                                                bg-gray-50
                                            "
                                        >

                                            <th className="p-4">
                                                المنتج
                                            </th>

                                            <th className="p-4">
                                                الكمية
                                            </th>

                                            <th className="p-4">
                                                سعر الشراء
                                            </th>

                                            <th className="p-4">
                                                تاريخ الانتهاء
                                            </th>

                                            <th className="p-4">
                                                الإجمالي
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {purchase.items?.length ? (

                                            purchase.items.map(
                                                (item, index) => {

                                                    const quantity =
                                                        Number(
                                                            item.quantity
                                                        ) || 0;


                                                    const price =
                                                        Number(
                                                            item.purchase_price
                                                        ) || 0;


                                                    const total =
                                                        Number(
                                                            item.total
                                                        ) ||
                                                        quantity *
                                                        price;


                                                    const productName =
                                                        item.product_name ||
                                                        item.product?.name ||
                                                        (
                                                            item.product
                                                                ? `منتج #${item.product}`
                                                                : "-"
                                                        );


                                                    return (

                                                        <tr
                                                            key={
                                                                item.id ||
                                                                index
                                                            }
                                                            className="
                                                                border-b
                                                                last:border-b-0
                                                            "
                                                        >

                                                            <td
                                                                className="
                                                                    p-4
                                                                    font-bold
                                                                "
                                                            >

                                                                {
                                                                    productName
                                                                }

                                                            </td>


                                                            <td className="p-4">

                                                                {
                                                                    quantity
                                                                }

                                                            </td>


                                                            <td className="p-4">

                                                                {
                                                                    price.toLocaleString(
                                                                        "ar-EG",
                                                                        {
                                                                            minimumFractionDigits: 2
                                                                        }
                                                                    )
                                                                }

                                                            </td>


                                                            <td className="p-4">

                                                                {
                                                                    item.expiry_date ||
                                                                    "-"
                                                                }

                                                            </td>


                                                            <td
                                                                className="
                                                                    p-4
                                                                    font-bold
                                                                "
                                                            >

                                                                {
                                                                    total.toLocaleString(
                                                                        "ar-EG",
                                                                        {
                                                                            minimumFractionDigits: 2
                                                                        }
                                                                    )
                                                                }

                                                            </td>

                                                        </tr>

                                                    );

                                                }

                                            )

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan="5"
                                                    className="
                                                        p-8
                                                        text-center
                                                        text-gray-500
                                                    "
                                                >

                                                    لا توجد أصناف

                                                </td>

                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* =========================
                            TOTAL
                        ========================= */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                border
                                rounded-2xl
                                p-5
                                bg-gray-50
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

                                {Number(
                                    purchase.total_amount || 0
                                ).toLocaleString(
                                    "ar-EG",
                                    {
                                        minimumFractionDigits: 2
                                    }
                                )}

                            </span>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}


// =========================
// INFO CARD
// =========================

function InfoCard({
    label,
    value
}) {

    return (

        <div
            className="
                border
                rounded-xl
                p-4
            "
        >

            <p
                className="
                    text-sm
                    text-gray-500
                    mb-2
                "
            >

                {label}

            </p>


            <p
                className="
                    font-bold
                "
            >

                {value}

            </p>

        </div>

    );

}