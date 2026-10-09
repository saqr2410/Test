import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import {
    createCategory
} from "../../../services/products/categoryService";

export default function AddCategoryModal({
    open,
    onClose,
    onCreated
}) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("اكتب اسم التصنيف");
            return;
        }

        try {
            setLoading(true);

            const category = await createCategory({
                name: name.trim()
            });

            toast.success("تم إضافة التصنيف بنجاح");

            setName("");

            if (onCreated) {
                onCreated(category);
            }

            onClose();
        } catch (error) {
            console.error(error);

            const message =
                error?.response?.data?.name?.[0] ||
                "فشل إضافة التصنيف";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

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
                    max-w-md
                    rounded-2xl
                    shadow-2xl
                "
            >
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        p-6
                        border-b
                    "
                >
                    <h2 className="text-xl font-bold">
                        إضافة تصنيف جديد
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            text-gray-500
                            hover:text-red-500
                            transition
                        "
                    >
                        <X size={22} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-5"
                >
                    <div>
                        <label
                            className="
                                block
                                font-medium
                                mb-2
                            "
                        >
                            اسم التصنيف
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="مثال: أدوية"
                            className="
                                w-full
                                border
                                rounded-xl
                                px-4
                                py-3
                                outline-none
                                focus:ring-2
                                focus:ring-[#5B2A86]
                            "
                            autoFocus
                        />
                    </div>

                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                        "
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                px-5
                                py-2.5
                                rounded-xl
                                bg-gray-100
                                hover:bg-gray-200
                            "
                        >
                            إلغاء
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                px-5
                                py-2.5
                                rounded-xl
                                bg-[#5B2A86]
                                text-white
                                font-bold
                                hover:bg-[#4a216d]
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "جاري الحفظ..."
                                : "إضافة تصنيف"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}