import api from "../../api/axios";



// =========================
// كل الطلبات (Admin)
// =========================

export const getOrders = async()=>{

    const {data} = await api.get(
        "/orders/"
    );

    return data;

};




// =========================
// طلبات المستخدم الحالي
// =========================

export const getMyOrders = async()=>{

    const {data} = await api.get(
        "/orders/my-orders/"
    );

    return data;

};




// =========================
// جلب طلب واحد
// =========================

export const getOrder = async(id)=>{

    const {data} = await api.get(
        `/orders/${id}/`
    );

    return data;

};




// =========================
// تفاصيل الطلب
// =========================

export const getOrderDetails = async(id)=>{

    const {data} = await api.get(
        `/orders/${id}/`
    );

    return data;

};




// =========================
// إنشاء طلب
// =========================

export const createOrder = async(payload)=>{

    const {data} = await api.post(
        "/orders/",
        payload
    );

    return data;

};




// =========================
// تحديث الطلب
// =========================

export const updateOrder = async(id,payload)=>{

    const {data} = await api.patch(
        `/orders/${id}/`,
        payload
    );

    return data;

};




// =========================
// حذف الطلب
// =========================

export const deleteOrder = async(id)=>{

    const {data} = await api.delete(
        `/orders/${id}/`
    );

    return data;

};




// =========================
// تغيير حالة الطلب
// =========================

export const updateOrderStatus = async(id,status)=>{

    const {data} = await api.patch(
        `/orders/${id}/status/`,
        {
            status
        }
    );

    return data;

};




// =========================
// إلغاء الطلب
// =========================

export const cancelOrder = async(id)=>{

    const {data} = await api.post(
        `/orders/${id}/cancel/`
    );

    return data;

};