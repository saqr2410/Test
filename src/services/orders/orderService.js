import api from "../../api/axios";


/* ==========================================
   Admin Orders
========================================== */

export const getOrders = async (
    params = {}
) => {

    const { data } = await api.get(
        "/orders/",
        {
            params,
        }
    );

    return data;
};


/* ==========================================
   My Orders
========================================== */

export const getMyOrders = async () => {

    const { data } = await api.get(
        "/orders/my-orders/"
    );

    return data;
};


/* ==========================================
   Single Order
========================================== */

export const getOrder = async (
    id
) => {

    const { data } = await api.get(
        `/orders/${id}/`
    );

    return data;
};


export const getOrderDetails = async (
    id
) => {

    const { data } = await api.get(
        `/orders/${id}/`
    );

    return data;
};


/* ==========================================
   Checkout
========================================== */

export const createOrder = async (
    payload
) => {

    const { data } = await api.post(
        "/orders/checkout/",
        payload
    );

    return data;
};


/* ==========================================
   Update Status
========================================== */

export const updateOrderStatus = async (
    id,
    status
) => {

    const { data } = await api.post(
        `/orders/${id}/update-status/`,
        {
            status,
        }
    );

    return data;
};


/* ==========================================
   Cancel Order
========================================== */

export const cancelOrder = async (
    id,
    reason
) => {

    const { data } = await api.post(
        `/orders/${id}/cancel/`,
        {
            reason,
        }
    );

    return data;
};


/* ==========================================
   Timeline
========================================== */

export const getOrderTimeline = async (
    id
) => {

    const { data } = await api.get(
        `/orders/${id}/timeline/`
    );

    return data;
};