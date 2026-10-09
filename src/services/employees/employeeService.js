import api from "../../api/axios";

export const getEmployees = async () => {
    const { data } = await api.get("/users/");
    return data;
};

export const getEmployee = async (id) => {
    const { data } = await api.get(`/users/${id}/`);
    return data;
};

export const createEmployee = async (payload) => {
    const { data } = await api.post("/users/", payload);
    return data;
};

export const updateEmployee = async (id, payload) => {
    const { data } = await api.patch(`/users/${id}/`, payload);
    return data;
};

export const deleteEmployee = async (id) => {
    const { data } = await api.delete(`/users/${id}/`);
    return data;
};

export const getMe = async () => {
    const { data } = await api.get("/users/me/");
    return data;
};

export const updateMe = async (payload) => {
    const { data } = await api.patch("/users/me/", payload);
    return data;
};

export const changePassword = async (payload) => {
    const { data } = await api.post("/users/change-password/", payload);
    return data;
};