import { X } from "lucide-react";
import toast from "react-hot-toast";
import ProductForm from "./ProductForm";
import {
    createProduct,
    updateProduct
} from "../../../services/products/adminProductService";

export default function AddProductModal({
    open,
    onClose,
    product = null,
    onSuccess
}) {
    if (!open) return null;

    const isEdit = !!product;

    const handleSubmit = async (data) => {
        try {
            if (isEdit) {
                await updateProduct(
                    product.id,
                    data
                );
                toast.success(
                    "تم تحديث المنتج بنجاح"
                );
            } else {
                await createProduct(data);
                toast.success(
                    "تم إضافة المنتج بنجاح"
                );
            }

            onClose();

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error(
                "Product Save Error:",
                error
            );
            toast.error(
                isEdit
                    ? "فشل تحديث المنتج"
                    : "فشل إضافة المنتج"
            );
        }
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                backdrop-blur-sm
                p-4
            "
        >
            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    w-full
                    max-w-4xl
                    max-h-[90vh]
                    overflow-y-auto
                "
            >
                <div
                    className="
                        sticky
                        top-0
                        z-10
                        flex
                        items-center
                        justify-between
                        p-6
                        bg-white
                        border-b
                    "
                >
                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-gray-800
                        "
                    >
                        {
                            isEdit
                                ? "تعديل المنتج"
                                : "إضافة منتج جديد"
                        }
                    </h2>

                    <button
                        onClick={onClose}
                        className="
                            text-gray-500
                            hover:text-red-500
                            transition
                        "
                    >
                        <X />
                    </button>
                </div>

                <div className="p-6">
                    <ProductForm
                        initialData={product || {}}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}