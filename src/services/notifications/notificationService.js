import api from "../../api/axios";


// جلب الاشعارات

export const getNotifications = async()=>{

    const {data} = await api.get(
        "/notifications/"
    );


    console.log("NOTIFICATIONS API RESPONSE =>", data);


    if(Array.isArray(data)){
        return data;
    }


    if(data.results){
        return data.results;
    }


    return [];

};




// تعليم الاشعار كمقروء

export const markNotificationRead = async(id)=>{

    const {data} = await api.post(
        `/notifications/${id}/mark_read/`
    );

    return data;

};




// إنشاء Notification

export const createNotification = async(payload)=>{

    const {data}= await api.post(
        "/notifications/",
        payload
    );

    return data;

};




// حذف Notification

export const deleteNotification = async(id)=>{

    const {data}= await api.delete(
        `/notifications/${id}/`
    );

    return data;

};