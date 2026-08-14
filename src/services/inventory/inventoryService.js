import api from "../../api/axios";


export const getInventory = async()=>{

    const response = await api.get(
        "/inventory/"
    );


    const data = response.data;


    return Array.isArray(data)
        ? data
        : data.results || [];

};