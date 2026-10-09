import {
    Edit,
    Trash2,
    Eye,
    EyeOff
} from "lucide-react";
import {
    useState
} from "react";
import toast from "react-hot-toast";
import {
    deleteProduct,
    updateProduct
} from "../../../services/products/adminProductService";

export default function ProductRow({
    product,
    onEdit,
    onSuccess
}) {
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `هل أنت متأكد من حذف "${product.name}"؟`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            await deleteProduct(product.id);
            toast.success(
                "تم حذف المنتج بنجاح"
            );

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error(
                "Delete Product Error:",
                error
            );
            toast.error(
                "فشل حذف المنتج"
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleToggleStatus = async () => {
        try {
            setUpdating(true);

            const payload = {
                is_active: !product.is_active
            };

            await updateProduct(product.id, payload);

            toast.success(
                product.is_active
                    ? "تم تعطيل المنتج بنجاح"
                    : "تم تفعيل المنتج بنجاح"
            );
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(
                "Toggle Status Error:",
                error
            );
            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.is_active?.[0] ||
                "فشل تغيير حالة المنتج"
            );
        } finally {
            setUpdating(false);
        }
    };

    return (
        <tr
            className="
                border-t
                hover:bg-gray-50
                transition
            "
        >
            <td className="px-6 py-4">
                <img
                    src={
                        product.image ||
                        "https://placehold.co/60"
                    }
                    alt={product.name}
                    className="
                        w-12
                        h-12
                        rounded-lg
                        object-cover
                    "
                />
            </td>

            <td className="px-6 py-4">
                <div className="font-semibold">
                    {product.name}
                </div>
                {product.scientific_name && (
                    <div className="text-sm text-gray-500 mt-0.5">
                        {product.scientific_name}
                    </div>
                )}
                <div className="text-xs font-mono text-gray-400 mt-1">
                    {product.barcode || "بدون باركود"}
                </div>
            </td>

            <td className="px-6 py-4">
                {product.category_name || "-"}
            </td>

            <td className="px-6 py-4">
                {product.selling_price ?? 0} جنيه
            </td>

            <td className="px-6 py-4">
                {product.stock ?? 0}
            </td>

            <td className="px-6 py-4">
                {product.is_active ? (
                    <span
                        className="
                            bg-green-100
                            text-green-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-medium
                        "
                    >
                        نشط
                    </span>
                ) : (
                    <span
                        className="
                            bg-red-100
                            text-red-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-medium
                        "
                    >
                        غير نشط
                    </span>
                )}
            </td>

            <td className="px-6 py-4">
                <div className="flex gap-1.5">
                    <button
                        type="button"
                        onClick={() => onEdit?.(product)}
                        className="
                            p-1.5
                            rounded-lg
                            bg-blue-600
                            text-white
                            hover:bg-blue-700
                            transition
                        "
                        title="تعديل"
                    >
                        <Edit size={14} />
                    </button>

                    <button
                        type="button"
                        onClick={handleToggleStatus}
                        disabled={updating}
                        className={`
                            p-1.5
                            rounded-lg
                            transition
                            ${product.is_active
                                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        `}
                        title={product.is_active ? "تعطيل" : "تفعيل"}
                    >
                        {product.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="
                            p-1.5
                            rounded-lg
                            bg-red-600
                            text-white
                            hover:bg-red-700
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            transition
                        "
                        title="حذف"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );
}