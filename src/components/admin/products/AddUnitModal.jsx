import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import {
    createUnit
} from "../../../services/products/categoryService";

export default function AddUnitModal({
    open,
    onClose,
    onCreated
}) {
    const [name, setName] = useState("");
    const [conversionFactor, setConversionFactor] = useState(1);
    const [loading, setLoading] = useState(false);

    if (!open) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("اكتب اسم الوحدة");
            return;
        }

        try {
            setLoading(true);

            const unit = await createUnit({
                name: name.trim(),
                conversion_factor: Number(
                    conversionFactor
                )
            });

            toast.success("تم إضافة الوحدة بنجاح");

            setName("");
            setConversionFactor(1);

            if (onCreated) {
                onCreated(unit);
            }

            onClose();
        } catch (error) {
            console.error(error);

            const message =
                error?.response?.data?.name?.[0] ||
                "فشل إضافة الوحدة";

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
                        إضافة وحدة جديدة
                    </h2>

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
                            اسم الوحدة
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="مثال: علبة"
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

                    <div>
                        <label
                            className="
                                block
                                font-medium
                                mb-2
                            "
                        >
                            عامل التحويل
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={conversionFactor}
                            onChange={(e) =>
                                setConversionFactor(
                                    e.target.value
                                )
                            }
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
                                : "إضافة وحدة"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}