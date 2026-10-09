import api from "../../api/axios";

/* ==========================================
   Favorites
========================================== */

export const getFavorites = async () => {
    const { data } = await api.get("/favorites/");
    return data;
};

export const addFavorite = async (productId) => {
    const { data } = await api.post("/favorites/", {
        product_id: productId,
    });

    return data;
};

export const removeFavorite = async (productId) => {
    await api.delete(`/favorites/${productId}/`);
};

export const checkFavorite = async (productId) => {
    const { data } = await api.get(
        `/favorites/${productId}/check/`
    );

    return data.is_favorite;
};