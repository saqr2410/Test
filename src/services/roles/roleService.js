import api from "../../api/axios";

export const getRoles = async () => {
    const { data } = await api.get("/groups/");
    return data;
};

export const createRole = async (payload) => {
    const { data } = await api.post("/groups/", payload);
    return data;
};

export const updateRole = async (id, payload) => {
    const { data } = await api.patch(`/groups/${id}/`, payload);
    return data;
};

export const deleteRole = async (id) => {
    const { data } = await api.delete(`/groups/${id}/`);
    return data;
};

export const getPermissions = async () => {
    const { data } = await api.get("/permissions/");
    return data;
};