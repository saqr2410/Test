import api from "../../api/axios";

// =========================
// CATEGORIES
// =========================

export const getCategories = async () => {
    const response = await api.get(
        "/products/categories/"
    );

    return response.data;
};

export const createCategory = async (data) => {
    const response = await api.post(
        "/products/categories/",
        data
    );

    return response.data;
};

export const updateCategory = async (id, data) => {
    const response = await api.patch(
        `/products/categories/${id}/`,
        data
    );

    return response.data;
};

export const deleteCategory = async (id) => {
    await api.delete(
        `/products/categories/${id}/`
    );
};


// =========================
// PRODUCT UNITS
// =========================

export const getUnits = async () => {
    const response = await api.get(
        "/products/units/"
    );

    return response.data;
};

export const createUnit = async (data) => {
    const response = await api.post(
        "/products/units/",
        data
    );

    return response.data;
};

export const updateUnit = async (id, data) => {
    const response = await api.patch(
        `/products/units/${id}/`,
        data
    );

    return response.data;
};

export const deleteUnit = async (id) => {
    await api.delete(
        `/products/units/${id}/`
    );
};