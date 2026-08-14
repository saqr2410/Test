import api from "../../api/axios";




// المنتجات المتاحة للبيع

export const getSaleProducts = async()=>{

    const response = await api.get(
        "/products/"
    );


    const data = response.data;


    return Array.isArray(data)
        ? data
        : data.results || [];

};







// إنشاء عملية بيع

export const createSale = async(data)=>{

    const response = await api.post(

        "/sales/create/",

        data

    );


    return response.data;

};