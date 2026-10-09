import api from "../../api/axios";

export const getPOSProducts = async () => {
    try {
        const { data } = await api.get("/products/products/");
        console.log("📦 POS Products Data:", data);
        if (Array.isArray(data)) return data;
        if (data?.results) return data.results;
        return [];
    } catch (error) {
        console.error("❌ POS Products Error:", error);
        return [];
    }
};

export const getPOSCategories = async () => {
    try {
        const { data } = await api.get("/products/categories/");
        console.log("📂 POS Categories Data:", data);
        if (Array.isArray(data)) return data;
        if (data?.results) return data.results;
        return [];
    } catch (error) {
        console.error("❌ POS Categories Error:", error);
        return [];
    }
};

export const createPOSSale = async (payload) => {
    const { data } = await api.post("/sales/", payload);
    return data;
};