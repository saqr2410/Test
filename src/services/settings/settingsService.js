import api from "../../api/axios";



/*
==================================================
 User Profile
==================================================
*/

export const getProfile = async () => {

    const { data } = await api.get(
        "/users/me/"
    );

    return data;
};



export const updateProfile = async (payload) => {

    const { data } = await api.patch(
        "/users/update_profile/",
        payload
    );

    return data;
};





/*
==================================================
 Change Password
==================================================
*/

export const changePassword = async (payload) => {

    const { data } = await api.post(
        "/users/change_password/",
        payload
    );

    return data;
};







/*
==================================================
 System Settings
==================================================
*/


export const getSettings = async () => {

    const { data } = await api.get(
        "/settings/"
    );

    return data;
};




export const createSetting = async (payload) => {

    const { data } = await api.post(
        "/settings/",
        payload
    );

    return data;
};





export const updateSetting = async (id, payload) => {

    const { data } = await api.patch(
        `/settings/${id}/`,
        payload
    );

    return data;
};





export const deleteSetting = async (id) => {

    const { data } = await api.delete(
        `/settings/${id}/`
    );

    return data;
};









/*
==================================================
 Pharmacy Settings Aliases
==================================================
*/


export const getPharmacySettings = async () => {

    const { data } = await api.get(
        "/settings/"
    );

    return data;
};





export const updatePharmacySettings = async (payload) => {

    const { data } = await api.patch(
        "/settings/",
        payload
    );

    return data;
};