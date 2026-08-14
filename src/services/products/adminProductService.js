import api from "../../api/axios";

// جلب كل منتجات لوحة التحكم

export const getProducts = async () => {


    const response = await api.get(
        "/products/products/"
    );


    return response.data;


};



// إضافة منتج

export const createProduct = async (data) => {


    const response = await api.post(
        "/products/products/",
        data
    );


    return response.data;


};



// تعديل منتج

export const updateProduct = async (id, data) => {


    const response = await api.patch(
        `/products/products/${id}/`,
        data
    );


    return response.data;


};



// حذف منتج

export const deleteProduct = async (id) => {


    const response = await api.delete(
        `/products/products/${id}/`
    );


    return response.data;


};