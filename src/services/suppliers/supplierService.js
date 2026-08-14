import api from "../../api/axios";


// جلب الموردين

export const getSuppliers = async()=>{

    const {data} = await api.get(
        "/suppliers/"
    );


    return Array.isArray(data)
        ? data
        : data.results || [];

};





// إنشاء مورد

export const createSupplier = async(payload)=>{

    const {data}= await api.post(
        "/suppliers/",
        payload
    );

    return data;

};





// تعديل مورد

export const updateSupplier = async(id,payload)=>{

    const {data}= await api.patch(
        `/suppliers/${id}/`,
        payload
    );

    return data;

};





// حذف مورد

export const deleteSupplier = async(id)=>{

    const {data}= await api.delete(
        `/suppliers/${id}/`
    );

    return data;

};