import api from "../../api/axios";

// =============================
// Get Cart
// =============================
export const getCart = async () => {
    const response = await api.get("/cart/summary/");
    return response.data;
};

// =============================
// Add Item
// =============================
export const addCartItem = async (product_id, quantity = 1) => {
    const response = await api.post("/cart/add_item/", { product_id, quantity });
    // 🔥 إطلاق حدث لتحديث النافبار فوراً
    window.dispatchEvent(new Event("cartUpdated"));
    return response.data;
};

// =============================
// Update Quantity
// =============================
export const updateCartItem = async (product_id, quantity) => {
    const response = await api.patch("/cart/update_item/", { product_id, quantity });
    // 🔥 إطلاق حدث لتحديث النافبار فوراً
    window.dispatchEvent(new Event("cartUpdated"));
    return response.data;
};

// =============================
// Remove Item
// =============================
export const removeCartItem = async (product_id) => {
    const response = await api.delete("/cart/remove_item/", { data: { product_id } });
    // 🔥 إطلاق حدث لتحديث النافبار فوراً
    window.dispatchEvent(new Event("cartUpdated"));
    return response.data;
};

// =============================
// Sync Local Cart After Login
// =============================
export const syncCart = async (items) => {
    const response = await api.post("/cart/sync/", { items });
    // 🔥 إطلاق حدث لتحديث النافبار فوراً
    window.dispatchEvent(new Event("cartUpdated"));
    return response.data;
};