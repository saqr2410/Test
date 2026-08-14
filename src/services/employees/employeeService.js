import api from "../../api/axios";


// جلب الموظفين
export const getEmployees = async()=>{

    const {data} = await api.get(
        "/employees/"
    );

    return data;

};



// إنشاء موظف
export const createEmployee = async(payload)=>{

    const {data}= await api.post(
        "/employees/",
        payload
    );

    return data;

};



// تعديل موظف
export const updateEmployee = async(id,payload)=>{

    const {data}= await api.patch(
        `/employees/${id}/`,
        payload
    );

    return data;

};



// حذف موظف
export const deleteEmployee = async(id)=>{

    const {data}= await api.delete(
        `/employees/${id}/`
    );

    return data;

};