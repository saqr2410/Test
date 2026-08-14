import api from "../../api/axios";



// جلب الـ Roles
export const getRoles = async()=>{

    const {data} = await api.get(
        "/roles/"
    );

    return data;

};




// إنشاء Role
export const createRole = async(payload)=>{

    const {data}= await api.post(
        "/roles/",
        payload
    );

    return data;

};





// تعديل Role
export const updateRole = async(id,payload)=>{

    const {data}= await api.patch(
        `/roles/${id}/`,
        payload
    );

    return data;

};





// حذف Role
export const deleteRole = async(id)=>{

    const {data}= await api.delete(
        `/roles/${id}/`
    );

    return data;

};





// جلب Permissions
export const getPermissions = async()=>{

    const {data}= await api.get(
        "/permissions/"
    );

    return data;

};