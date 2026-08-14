import api from "../../api/axios";



// =======================
// Store Products
// =======================

export const getStoreProducts = async () => {

    const response = await api.get(

        "/products/store/products/"

    );

    return response.data;

};





// =======================
// Admin Products
// =======================

export const getProducts = async () => {

    const response = await api.get(

        "/products/products/"

    );

    return response.data;

};





// =======================
// Product Details
// =======================

export const getProductDetails = async (id) => {

    const response = await api.get(

        `/products/products/${id}/`

    );

    return response.data;

};





// =======================
// Create Product
// =======================

export const createProduct = async (data) => {

    const response = await api.post(

        "/products/products/",

        data

    );

    return response.data;

};





// =======================
// Update Product
// =======================

export const updateProduct = async (id, data) => {

    const response = await api.put(

        `/products/products/${id}/`,

        data

    );

    return response.data;

};





// =======================
// Delete Product
// =======================

export const deleteProduct = async (id) => {

    await api.delete(

        `/products/products/${id}/`

    );

};