import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus, X } from "lucide-react";

import {
    getUnits,
    createUnit,
    updateUnit,
    deleteUnit,
} from "../../../services/products/unitService";

export default function UnitManager() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [conversionFactor, setConversionFactor] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [editingConversionFactor, setEditingConversionFactor] =
        useState(1);
    const [saving, setSaving] = useState(false);

    const loadUnits = async () => {
        try {
            setLoading(true);
            const data = await getUnits();
            setUnits(data);
        } catch (error) {
            console.error(error);
            toast.error(
                "فشل تحميل الوحدات"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUnits();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error(
                "أدخل اسم الوحدة"
            );
            return;
        }

        if (
            !conversionFactor ||
            Number(conversionFactor) < 1
        ) {
            toast.error(
                "عامل التحويل يجب أن يكون 1 على الأقل"
            );
            return;
        }

        try {
            setSaving(true);

            const unit = await createUnit({
                name: name.trim(),
                conversion_factor:
                    Number(conversionFactor),
            });

            setUnits((prev) => [
                ...prev,
                unit,
            ]);

            setName("");
            setConversionFactor(1);

            toast.success(
                "تم إضافة الوحدة بنجاح"
            );
        } catch (error) {
            console.error(error);
            toast.error(
                error?.response?.data?.detail ||
                "فشل إضافة الوحدة"
            );
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (unit) => {
        setEditingId(unit.id);
        setEditingName(unit.name);
        setEditingConversionFactor(
            unit.conversion_factor
        );
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingName("");
        setEditingConversionFactor(1);
    };

    const handleUpdate = async (id) => {
        if (!editingName.trim()) {
            toast.error(
                "أدخل اسم الوحدة"
            );
            return;
        }

        if (
            !editingConversionFactor ||
            Number(editingConversionFactor) < 1
        ) {
            toast.error(
                "عامل التحويل يجب أن يكون 1 على الأقل"
            );
            return;
        }

        try {
            setSaving(true);

            const updated = await updateUnit(
                id,
                {
                    name:
                        editingName.trim(),
                    conversion_factor:
                        Number(
                            editingConversionFactor
                        ),
                }
            );

            setUnits((prev) =>
                prev.map((unit) =>
                    unit.id === id
                        ? updated
                        : unit
                )
            );

            cancelEdit();

            toast.success(
                "تم تحديث الوحدة بنجاح"
            );
        } catch (error) {
            console.error(error);
            toast.error(
                "فشل تحديث الوحدة"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed =
            window.confirm(
                "هل أنت متأكد من حذف هذه الوحدة؟"
            );

        if (!confirmed) return;

        try {
            await deleteUnit(id);

            setUnits((prev) =>
                prev.filter(
                    (unit) =>
                        unit.id !== id
                )
            );

            toast.success(
                "تم حذف الوحدة بنجاح"
            );
        } catch (error) {
            console.error(error);
            toast.error(
                "لا يمكن حذف هذه الوحدة"
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
            <div className="mb-6">
                <h2
                    className="
                        text-xl
                        font-black
                        text-gray-800
                    "
                >
                    الوحدات
                </h2>

                <p
                    className="
                        text-sm
                        text-gray-500
                        mt-1
                    "
                >
                    إدارة وحدات المنتجات
                </p>
            </div>

            <form
                onSubmit={handleAdd}
                className="
                    space-y-3
                    mb-6
                "
            >
                <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    placeholder="اسم الوحدة..."
                    className="
                        w-full
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

                <input
                    type="number"
                    min="1"
                    value={conversionFactor}
                    onChange={(e) =>
                        setConversionFactor(
                            e.target.value
                        )
                    }
                    placeholder="عامل التحويل..."
                    className="
                        w-full
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
                        w-full
                        flex
                        items-center
                        justify-center
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
                    إضافة وحدة
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
                    جاري تحميل الوحدات...
                </div>
            ) : units.length === 0 ? (
                <div
                    className="
                        text-center
                        py-8
                        text-gray-500
                    "
                >
                    لا توجد وحدات
                </div>
            ) : (
                <div
                    className="
                        space-y-2
                    "
                >
                    {units.map((unit) => (
                        <div
                            key={unit.id}
                            className="
                                border
                                border-gray-100
                                rounded-xl
                                p-4
                                hover:bg-gray-50
                                transition
                            "
                        >
                            {editingId === unit.id ? (
                                <div
                                    className="
                                        space-y-3
                                    "
                                >
                                    <input
                                        type="text"
                                        value={
                                            editingName
                                        }
                                        onChange={(e) =>
                                            setEditingName(
                                                e.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            border
                                            rounded-lg
                                            px-3
                                            py-2
                                            outline-none
                                            focus:border-[#5B2A86]
                                        "
                                        autoFocus
                                    />

                                    <input
                                        type="number"
                                        min="1"
                                        value={
                                            editingConversionFactor
                                        }
                                        onChange={(e) =>
                                            setEditingConversionFactor(
                                                e.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            border
                                            rounded-lg
                                            px-3
                                            py-2
                                            outline-none
                                            focus:border-[#5B2A86]
                                        "
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
                                                    unit.id
                                                )
                                            }
                                            className="
                                                flex-1
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
                                            onClick={
                                                cancelEdit
                                            }
                                            className="
                                                px-4
                                                py-2
                                                rounded-lg
                                                bg-gray-100
                                                text-gray-600
                                            "
                                        >
                                            <X size={17} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    "
                                >
                                    <div>
                                        <p
                                            className="
                                                font-bold
                                                text-gray-700
                                            "
                                        >
                                            {unit.name}
                                        </p>

                                        <p
                                            className="
                                                text-xs
                                                text-gray-400
                                                mt-1
                                            "
                                        >
                                            عامل التحويل:
                                            {" "}
                                            {unit.conversion_factor}
                                        </p>
                                    </div>

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
                                                    unit
                                                )
                                            }
                                            className="
                                                p-2
                                                rounded-lg
                                                text-[#5B2A86]
                                                hover:bg-purple-50
                                            "
                                        >
                                            <Pencil
                                                size={17}
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    unit.id
                                                )
                                            }
                                            className="
                                                p-2
                                                rounded-lg
                                                text-red-500
                                                hover:bg-red-50
                                            "
                                        >
                                            <Trash2
                                                size={17}
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}