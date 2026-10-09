import { useState } from "react";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import useProductMeta from "../../../hooks/useProductMeta";
import AddCategoryModal from "./AddCategoryModal";
import AddUnitModal from "./AddUnitModal";

export default function ProductForm({
    initialData = {},
    onSubmit
}) {
    const {
        categories,
        units,
        loading,
        reload
    } = useProductMeta();

    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [unitModalOpen, setUnitModalOpen] = useState(false);

    const [form, setForm] = useState({
        name: initialData.name || "",
        scientific_name: initialData.scientific_name || "",
        barcode: initialData.barcode || "",
        category: initialData.category || "",
        product_type: initialData.product_type || "OTC",
        unit: initialData.unit || "",
        manufacturer: initialData.manufacturer || "",
        description: initialData.description || "",
        selling_price: initialData.selling_price || "",
        reorder_level: initialData.reorder_level || 10,
    });

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    const handleCategoryCreated = async (category) => {
        await reload();
        setForm((prev) => ({
            ...prev,
            category: String(category.id)
        }));
    };

    const handleUnitCreated = async (unit) => {
        await reload();
        setForm((prev) => ({
            ...prev,
            unit: String(unit.id)
        }));
    };

    if (loading) {
        return (
            <div className="text-center py-10">
                جاري التحميل...
            </div>
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-[#5B2A86] mb-4">
                        المعلومات الأساسية
                    </h3>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block font-medium mb-1">
                                اسم المنتج *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">
                                الاسم العلمي
                            </label>
                            <input
                                type="text"
                                name="scientific_name"
                                value={form.scientific_name}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">
                                الباركود *
                            </label>
                            <input
                                type="text"
                                name="barcode"
                                value={form.barcode}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">
                                نوع المنتج
                            </label>
                            <select
                                name="product_type"
                                value={form.product_type}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                            >
                                <option value="RX">وصفة طبية</option>
                                <option value="OTC">بدون وصفة</option>
                                <option value="SUPPLEMENT">مكمل غذائي</option>
                                <option value="COSMETIC">مستحضر تجميل</option>
                                <option value="PERSONAL">عناية شخصية</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-[#5B2A86] mb-4">
                        التصنيف
                    </h3>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="font-medium">
                                    التصنيف *
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setCategoryModalOpen(true)}
                                    className="text-sm font-bold text-[#5B2A86] hover:underline"
                                >
                                    + إضافة تصنيف
                                </button>
                            </div>

                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                            >
                                <option value="">اختر التصنيف</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="font-medium">
                                    الوحدة
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setUnitModalOpen(true)}
                                    className="text-sm font-bold text-[#5B2A86] hover:underline"
                                >
                                    + إضافة وحدة
                                </button>
                            </div>

                            <select
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                            >
                                <option value="">اختر الوحدة</option>
                                {units.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-[#5B2A86] mb-4">
                        تفاصيل المنتج
                    </h3>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block font-medium mb-1">
                                الشركة المصنعة
                            </label>
                            <input
                                type="text"
                                name="manufacturer"
                                value={form.manufacturer}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">
                                سعر البيع *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="selling_price"
                                value={form.selling_price}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">
                                الحد الأدنى للمخزون
                            </label>
                            <input
                                type="number"
                                min="0"
                                name="reorder_level"
                                value={form.reorder_level}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                                placeholder="10"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                عند وصول المخزون لهذا الرقم، سيظهر تنبيه
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        الوصف
                    </label>
                    <textarea
                        rows={4}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <PrimaryButton type="submit">
                        حفظ المنتج
                    </PrimaryButton>
                </div>
            </form>

            <AddCategoryModal
                open={categoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                onCreated={handleCategoryCreated}
            />

            <AddUnitModal
                open={unitModalOpen}
                onClose={() => setUnitModalOpen(false)}
                onCreated={handleUnitCreated}
            />
        </>
    );
}