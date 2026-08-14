import api from "../../api/axios";



// تسجيل

export const register = async(data)=>{


    const response = await api.post(
        "/users/register/",
        data
    );


    return response.data;

};




// Login

export const login = async(data)=>{


    const response = await api.post(
        "/users/login/",
        data
    );


    return response.data;

};




// بيانات المستخدم

export const getMe = async()=>{


    const response = await api.get(
        "/users/me/"
    );


    return response.data;

};




// Logout

export const logout = ()=>{


    localStorage.removeItem(
        "access_token"
    );


    localStorage.removeItem(
        "refresh_token"
    );


};