import api from "../../api/axios";

export const getCustomers = async () => {
    const { data } = await api.get("/users/");
    // فلترة العملاء فقط (CUSTOMER)
    return data.filter(user => user.role === "CUSTOMER");
};

export const getCustomer = async (id) => {
    const { data } = await api.get(`/users/${id}/`);
    return data;
};

export const createCustomer = async (payload) => {
    // إضافة role = CUSTOMER تلقائياً
    const { data } = await api.post("/users/", {
        ...payload,
        role: "CUSTOMER"
    });
    return data;
};

export const updateCustomer = async (id, payload) => {
    const { data } = await api.patch(`/users/${id}/`, payload);
    return data;
};

export const deleteCustomer = async (id) => {
    const { data } = await api.delete(`/users/${id}/`);
    return data;
};