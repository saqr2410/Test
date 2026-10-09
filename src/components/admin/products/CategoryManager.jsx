import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus, X } from "lucide-react";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../../services/products/categoryService";

export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");

    const [saving, setSaving] = useState(false);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
            toast.error("فشل تحميل التصنيفات");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("أدخل اسم التصنيف");
            return;
        }

        try {
            setSaving(true);

            const category = await createCategory({
                name: name.trim(),
            });

            setCategories((prev) => [
                ...prev,
                category,
            ]);

            setName("");

            toast.success("تم إضافة التصنيف بنجاح");
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.detail ||
                "فشل إضافة التصنيف"
            );
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (category) => {
        setEditingId(category.id);
        setEditingName(category.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingName("");
    };

    const handleUpdate = async (id) => {
        if (!editingName.trim()) {
            toast.error("أدخل اسم التصنيف");
            return;
        }

        try {
            setSaving(true);

            const updated = await updateCategory(id, {
                name: editingName.trim(),
            });

            setCategories((prev) =>
                prev.map((category) =>
                    category.id === id
                        ? updated
                        : category
                )
            );

            cancelEdit();

            toast.success("تم تحديث التصنيف بنجاح");
        } catch (error) {
            console.error(error);
            toast.error("فشل تحديث التصنيف");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "هل أنت متأكد من حذف هذا التصنيف؟"
        );

        if (!confirmed) return;

        try {
            await deleteCategory(id);

            setCategories((prev) =>
                prev.filter(
                    (category) =>
                        category.id !== id
                )
            );

            toast.success("تم حذف التصنيف بنجاح");
        } catch (error) {
            console.error(error);
            toast.error(
                "لا يمكن حذف هذا التصنيف"
            );
        }
    };

    return (
        <div
            className="
                bg-white
                rounded-2xl
                shadow
                border
                p-6
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    mb-6
                "
            >
                <div>
                    <h2
                        className="
                            text-xl
                            font-black
                            text-gray-800
                        "
                    >
                        التصنيفات
                    </h2>

                    <p
                        className="
                            text-sm
                            text-gray-500
                            mt-1
                        "
                    >
                        إدارة تصنيفات المنتجات
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleAdd}
                className="
                    flex
                    gap-3
                    mb-6
                "
            >
                <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    placeholder="اسم التصنيف..."
                    className="
                        flex-1
                        border
                        border-gray-200
                        rounded-xl
                        px-4
                        py-3
                        outline-none
                        focus:border-[#5B2A86]
                        focus:ring-2
                        focus:ring-purple-100
                    "
                />

                <button
                    type="submit"
                    disabled={saving}
                    className="
                        flex
                        items-center
                        gap-2
                        px-5
                        py-3
                        rounded-xl
                        bg-[#5B2A86]
                        text-white
                        font-bold
                        hover:bg-[#4a226d]
                        transition
                        disabled:opacity-50
                    "
                >
                    <Plus size={18} />
                    إضافة
                </button>
            </form>

            {loading ? (
                <div
                    className="
                        text-center
                        py-8
                        text-gray-500
                    "
                >
                    جاري تحميل التصنيفات...
                </div>
            ) : categories.length === 0 ? (
                <div
                    className="
                        text-center
                        py-8
                        text-gray-500
                    "
                >
                    لا توجد تصنيفات
                </div>
            ) : (
                <div
                    className="
                        space-y-2
                    "
                >
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="
                                flex
                                items-center
                                justify-between
                                gap-3
                                border
                                border-gray-100
                                rounded-xl
                                px-4
                                py-3
                                hover:bg-gray-50
                                transition
                            "
                        >
                            {editingId === category.id ? (
                                <>
                                    <input
                                        value={editingName}
                                        onChange={(e) =>
                                            setEditingName(
                                                e.target.value
                                            )
                                        }
                                        className="
                                            flex-1
                                            border
                                            rounded-lg
                                            px-3
                                            py-2
                                            outline-none
                                            focus:border-[#5B2A86]
                                        "
                                        autoFocus
                                    />

                                    <div
                                        className="
                                            flex
                                            gap-2
                                        "
                                    >
                                        <button
                                            type="button"
                                            disabled={saving}
                                            onClick={() =>
                                                handleUpdate(
                                                    category.id
                                                )
                                            }
                                            className="
                                                px-3
                                                py-2
                                                rounded-lg
                                                bg-green-600
                                                text-white
                                                text-sm
                                                font-bold
                                            "
                                        >
                                            حفظ
                                        </button>

                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="
                                                p-2
                                                rounded-lg
                                                bg-gray-100
                                                text-gray-600
                                            "
                                        >
                                            <X size={17} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span
                                        className="
                                            font-semibold
                                            text-gray-700
                                        "
                                    >
                                        {category.name}
                                    </span>

                                    <div
                                        className="
                                            flex
                                            gap-2
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                startEdit(
                                                    category
                                                )
                                            }
                                            className="
                                                p-2
                                                rounded-lg
                                                text-[#5B2A86]
                                                hover:bg-purple-50
                                            "
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    category.id
                                                )
                                            }
                                            className="
                                                p-2
                                                rounded-lg
                                                text-red-500
                                                hover:bg-red-50
                                            "
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}