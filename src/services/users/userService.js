
import api from "../../api/axios";

// ========================================
// Current User
// ========================================

export const getCurrentUser = async () => {
    const { data } = await api.get("/users/me/");
    return data;
};

export const updateCurrentUser = async (payload) => {
    const { data } = await api.patch(
        "/users/me/",
        payload
    );

    return data;
};

// ========================================
// Change Password
// ========================================

export const changePassword = async (
    oldPassword,
    newPassword,
    confirmPassword
) => {
    const { data } = await api.post(
        "/users/change-password/",
        {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
        }
    );

    return data;
};

// ========================================
// Admin - Users
// ========================================

export const getUsers = async () => {
    const { data } = await api.get("/users/");
    return data;
};

export const getUser = async (id) => {
    const { data } = await api.get(
        `/users/${id}/`
    );

    return data;
};

export const createUser = async (payload) => {
    const { data } = await api.post(
        "/users/",
        payload
    );

    return data;
};

export const updateUser = async (id, payload) => {
    const { data } = await api.patch(
        `/users/${id}/`,
        payload
    );

    return data;
};

export const deleteUser = async (id) => {
    const { data } = await api.delete(
        `/users/${id}/`
    );

    return data;
};
