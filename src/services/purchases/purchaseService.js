import api from "../../api/axios";


// =========================
// SUPPLIERS
// =========================

export const getSuppliers = async () => {

    const response = await api.get(
        "/suppliers/"
    );

    const data = response.data;

    return Array.isArray(data)
        ? data
        : data?.results || [];
};


// =========================
// PRODUCTS
// =========================

export const getProducts = async () => {

    const response = await api.get(
        "/products/products/"
    );

    const data = response.data;

    return Array.isArray(data)
        ? data
        : data?.results || [];
};


// =========================
// PURCHASES
// =========================

export const getPurchases = async () => {

    const response = await api.get(
        "/purchases/purchases/"
    );

    const data = response.data;

    return Array.isArray(data)
        ? data
        : data?.results || [];
};


export const getPurchase = async (id) => {

    const response = await api.get(
        `/purchases/purchases/${id}/`
    );

    return response.data;
};


export const createPurchase = async (data) => {

    const response = await api.post(
        "/purchases/purchases/",
        data
    );

    return response.data;
};


// =========================
// PURCHASE ACTIONS
// =========================

export const receivePurchase = async (id) => {

    const response = await api.post(
        `/purchases/purchases/${id}/receive/`
    );

    return response.data;
};


export const cancelPurchase = async (id) => {

    const response = await api.post(
        `/purchases/purchases/${id}/cancel/`
    );

    return response.data;
};