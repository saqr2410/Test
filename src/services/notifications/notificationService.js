import api from "../../api/axios";

export const getNotifications = async () => {
    const { data } = await api.get("/notifications/");
    console.log("NOTIFICATIONS API RESPONSE =>", data);
    if (Array.isArray(data)) return data;
    if (data?.results) return data.results;
    return [];
};

export const markNotificationRead = async (id) => {
    const { data } = await api.post(`/notifications/${id}/mark_read/`);
    return data;
};

export const createNotification = async (payload) => {
    const { data } = await api.post("/notifications/", payload);
    return data;
};

export const deleteNotification = async (id) => {
    const { data } = await api.delete(`/notifications/${id}/`);
    return data;
};