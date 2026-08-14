import api from "../../api/axios";



export const getFinanceSummary = async()=>{


    const {data}= await api.get(
        "/finance/summary/"
    );


    return data;


};





export const getTransactions = async()=>{


    const {data}= await api.get(
        "/finance/transactions/"
    );


    return data;


};