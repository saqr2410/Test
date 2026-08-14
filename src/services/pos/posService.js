import api from "../../api/axios";



export const getPOSProducts = async()=>{

    const {data}= await api.get(
        "/pos/products/"
    );


    console.log("POS PRODUCTS =>", data);


    if(Array.isArray(data)){
        return data;
    }


    if(data.results){
        return data.results;
    }


    return [];

};





export const createPOSSale = async(payload)=>{

    const {data}= await api.post(
        "/pos/sales/",
        payload
    );

    return data;

};