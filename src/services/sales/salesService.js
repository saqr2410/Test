import api from "../../api/axios";

export const getSales = async () => {
    const response = await api.get("/sales/");
    const data = response.data;
    return Array.isArray(data) ? data : data?.results || [];
};

export const getSaleDetails = async (id) => {
    const response = await api.get(`/sales/${id}/`);
    return response.data;
};

export const createSale = async (data) => {
    const response = await api.post("/sales/", data);
    return response.data;
};

export const updateSale = async (id, data) => {
    const response = await api.patch(`/sales/${id}/`, data);
    return response.data;
};

export const deleteSale = async (id) => {
    const response = await api.delete(`/sales/${id}/`);
    return response.data;
};