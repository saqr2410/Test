import api from "../../api/axios";

export const getInventory = async () => {
    const response = await api.get("/inventory/snapshots/");
    const data = response.data;
    return Array.isArray(data) ? data : data?.results || [];
};

export const getStockMovements = async () => {
    const response = await api.get("/inventory/movements/");
    const data = response.data;
    return Array.isArray(data) ? data : data?.results || [];
};

export const addStock = async (data) => {
    const response = await api.post("/inventory/actions/add_stock/", data);
    return response.data;
};

export const deductStock = async (data) => {
    const response = await api.post("/inventory/actions/deduct_stock/", data);
    return response.data;
};

export const returnSale = async (data) => {
    const response = await api.post("/inventory/actions/return_sale/", data);
    return response.data;
};

export const markDamage = async (data) => {
    const response = await api.post("/inventory/actions/mark_damage/", data);
    return response.data;
};

export const markExpired = async () => {
    const response = await api.post("/inventory/actions/mark_expired/");
    return response.data;
};

export const refreshInventorySnapshots = async () => {
    const response = await api.post("/inventory/snapshots/refresh_all/");
    return response.data;
};