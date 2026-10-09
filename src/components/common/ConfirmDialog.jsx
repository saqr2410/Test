import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    loading = false,
    title = "تأكيد العملية",
    message = "هل أنت متأكد من تنفيذ هذه العملية؟",
}) {
    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
            dir="rtl"
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <AlertTriangle size={24} />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {title}
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    {message}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-7 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        إلغاء
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "جاري التنفيذ..." : "تأكيد"}
                    </button>
                </div>
            </div>
        </div>
    );
}