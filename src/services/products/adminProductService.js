import api from "../../api/axios";

export const getProducts = async () => {
    const response = await api.get("/products/products/");
    return response.data;
};

export const createProduct = async (data) => {
    const payload = {
        name: data.name,
        scientific_name: data.scientific_name || "",
        barcode: data.barcode || "",
        category: Number(data.category),
        product_type: data.product_type || "OTC",
        unit: data.unit ? Number(data.unit) : null,
        manufacturer: data.manufacturer || "",
        description: data.description || "",
        selling_price: Number(data.selling_price) || 0,
        reorder_level: Number(data.reorder_level) || 10,
    };

    const response = await api.post("/products/products/", payload);
    return response.data;
};

export const updateProduct = async (id, data) => {
    // ✅ خد البيانات الأصلية للمنتج عشان نضمن إن كل الحقول موجودة
    const currentProduct = await getProducts();
    const product = currentProduct.find(p => p.id === id);

    const payload = {
        name: data.name !== undefined ? data.name : product?.name,
        scientific_name: data.scientific_name !== undefined ? data.scientific_name : product?.scientific_name || "",
        barcode: data.barcode !== undefined ? data.barcode : product?.barcode || "",
        category: data.category !== undefined ? Number(data.category) : product?.category,
        product_type: data.product_type || product?.product_type || "OTC",
        unit: data.unit !== undefined ? (data.unit ? Number(data.unit) : null) : product?.unit,
        manufacturer: data.manufacturer !== undefined ? data.manufacturer : product?.manufacturer || "",
        description: data.description !== undefined ? data.description : product?.description || "",
        selling_price: data.selling_price !== undefined ? Number(data.selling_price) : product?.selling_price || 0,
        reorder_level: data.reorder_level !== undefined ? Number(data.reorder_level) : product?.reorder_level || 10,
        is_active: data.is_active !== undefined ? data.is_active : product?.is_active,
    };

    console.log("📦 Updating product:", payload);

    const response = await api.patch(`/products/products/${id}/`, payload);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/products/${id}/`);
    return response.data;
};