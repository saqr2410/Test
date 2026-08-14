import api from "../../api/axios";

export const getCategories = async () => {

    const response = await api.get(
        "/products/categories/"
    );

    return response.data;

};

export const getUnits = async () => {

    const response = await api.get(
        "/products/units/"
    );

    return response.data;

};