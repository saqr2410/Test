import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { addStock } from "../../../services/inventory/inventoryService";

export default function AddStockModal({ open, onClose, products, onSuccess }) {
    const [product, setProduct] = useState("");
    const [batchNumber, setBatchNumber] = useState("");
    const [quantity, setQuantity] = useState("");
    const [purchasePrice, setPurchasePrice] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setProduct("");
            setBatchNumber("");
            setQuantity("");
            setPurchasePrice("");
            setExpiryDate("");
            setNote("");
        }
    }, [open]);

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product) {
            toast.error("اختر المنتج");
            return;
        }
        if (!batchNumber.trim()) {
            toast.error("اكتب رقم الباتش");
            return;
        }
        if (!quantity || Number(quantity) <= 0) {
            toast.error("اكتب كمية صحيحة");
            return;
        }
        if (!purchasePrice || Number(purchasePrice) <= 0) {
            toast.error("اكتب سعر شراء صحيح");
            return;
        }
        if (!expiryDate) {
            toast.error("اختر تاريخ الانتهاء");
            return;
        }

        try {
            setLoading(true);

            // ✅ تحويل التاريخ إلى تنسيق YYYY-MM-DD
            const formattedDate = new Date(expiryDate).toISOString().split('T')[0];

            const data = {
                product: Number(product),
                batch_number: batchNumber.trim(),
                quantity: Number(quantity),
                purchase_price: Number(purchasePrice),
                expiry_date: formattedDate,
                note: note.trim(),
            };

            console.log("📦 Sending data:", data); // ✅ للفحص

            await addStock(data);
            toast.success("تم إضافة المخزون بنجاح");
            if (onSuccess) await onSuccess();
            onClose();
        } catch (error) {
            console.error("ADD STOCK ERROR:", error);
            console.error("Response:", error.response?.data);

            const message = error?.response?.data?.message ||
                error?.response?.data?.error ||
                "فشل إضافة المخزون";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-xl font-bold">إضافة مخزون</h2>
                        <p className="text-sm text-gray-500 mt-1">إضافة Batch جديد للمنتج</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-500 hover:text-red-500">
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block font-medium mb-2">المنتج *</label>
                        <select
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                            required
                        >
                            <option value="">اختر المنتج</option>
                            {products.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-2">رقم الباتش *</label>
                        <input
                            type="text"
                            value={batchNumber}
                            onChange={(e) => setBatchNumber(e.target.value)}
                            placeholder="مثال: BATCH-001"
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">الكمية *</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">سعر الشراء *</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={purchasePrice}
                            onChange={(e) => setPurchasePrice(e.target.value)}
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">تاريخ الانتهاء *</label>
                        <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#5B2A86]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">ملاحظات</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows="3"
                            placeholder="ملاحظات اختيارية..."
                            className="w-full border rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-[#5B2A86]"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 rounded-xl bg-[#5B2A86] text-white font-bold hover:bg-[#4a216d] disabled:opacity-50 transition"
                        >
                            {loading ? "جاري الحفظ..." : "إضافة المخزون"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}