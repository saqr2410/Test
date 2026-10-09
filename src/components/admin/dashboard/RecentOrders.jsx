import { ShoppingBag, Clock, CheckCircle, XCircle, Truck, Package, Store } from "lucide-react";

function getStatus(status) {
    switch (status) {
        case "PENDING":
            return { text: "قيد الانتظار", className: "bg-yellow-100 text-yellow-700", icon: <Clock size={14} /> };
        case "CONFIRMED":
            return { text: "تم التأكيد", className: "bg-blue-100 text-blue-700", icon: <CheckCircle size={14} /> };
        case "PROCESSING":
            return { text: "قيد التجهيز", className: "bg-purple-100 text-purple-700", icon: <Package size={14} /> };
        case "READY":
            return { text: "جاهز للاستلام", className: "bg-green-100 text-green-700", icon: <CheckCircle size={14} /> };
        case "SHIPPED":
            return { text: "جاري التوصيل", className: "bg-indigo-100 text-indigo-700", icon: <Truck size={14} /> };
        case "DELIVERED":
            return { text: "تم الاستلام", className: "bg-teal-100 text-teal-700", icon: <CheckCircle size={14} /> };
        case "CANCELLED":
            return { text: "ملغي", className: "bg-red-100 text-red-700", icon: <XCircle size={14} /> };
        default:
            return { text: status || "غير محدد", className: "bg-gray-100 text-gray-600", icon: <Clock size={14} /> };
    }
}

function getDeliveryMethodLabel(method) {
    const map = {
        "DELIVERY": "🚚 توصيل",
        "PICKUP": "🏪 استلام"
    };
    return map[method] || method;
}

export default function RecentOrders({ orders = [] }) {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#5B2A86] flex items-center justify-center">
                    <ShoppingBag size={21} />
                </div>
                <div>
                    <h2 className="text-xl font-black">أحدث الطلبات</h2>
                    <p className="text-sm text-gray-400">آخر الطلبات المسجلة</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="py-10 text-center text-gray-400">لا توجد طلبات حاليًا</div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => {
                        const status = getStatus(order.status);
                        return (
                            <div key={order.id} className="flex items-center justify-between gap-4 border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition">
                                <div>
                                    <p className="font-bold">طلب #{order.id}</p>
                                    <p className="text-sm text-gray-400 mt-1">{order.customer_name || "مستخدم"}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{getDeliveryMethodLabel(order.delivery_method)}</p>
                                </div>

                                <div className="text-left">
                                    <p className="font-black text-[#5B2A86]">{order.total_price ?? 0} جنيه</p>
                                    <span className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-bold ${status.className}`}>
                                        {status.icon}
                                        {status.text}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}