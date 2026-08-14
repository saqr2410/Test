import api from "../../api/axios";


// جلب العملاء
export const getCustomers = async () => {

    const {data} = await api.get(
        "/customers/"
    );

    return data;

};



// إنشاء عميل
export const createCustomer = async(payload)=>{

    const {data}= await api.post(
        "/customers/",
        payload
    );

    return data;

};



// تعديل عميل
export const updateCustomer = async(id,payload)=>{

    const {data}= await api.patch(
        `/customers/${id}/`,
        payload
    );

    return data;

};



// حذف عميل
export const deleteCustomer = async(id)=>{

    const {data}= await api.delete(
        `/customers/${id}/`
    );

    return data;

};