import api from "../../api/axios";




// الموردين

export const getSuppliers = async()=>{

    const response = await api.get(
        "/suppliers/"
    );


    const data = response.data;


    return Array.isArray(data)
        ? data
        : data.results || [];

};






// المنتجات

export const getProducts = async()=>{

    const response = await api.get(
        "/products/"
    );


    const data = response.data;


    return Array.isArray(data)
        ? data
        : data.results || [];

};






// إنشاء شراء

export const createPurchase = async(data)=>{

    const response = await api.post(

        "/purchases/create/",

        data

    );


    return response.data;

};