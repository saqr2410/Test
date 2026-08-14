import api from "../../api/axios";



/*
==================================================
 Reports Summary
==================================================
*/

export const getReportsSummary = async()=>{


    const {data} = await api.get(
        "/reports/summary/"
    );


    return data;


};







/*
==================================================
 Sales Report
==================================================
*/

export const getSalesReport = async()=>{


    const {data} = await api.get(
        "/reports/sales/"
    );


    return data;


};







/*
==================================================
 Best Selling Products
==================================================
*/

export const getBestProducts = async()=>{


    const {data} = await api.get(
        "/reports/best-products/"
    );


    return data;


};







/*
==================================================
 Low Stock Report
==================================================
*/

export const getLowStockReport = async()=>{


    const {data} = await api.get(
        "/reports/low-stock/"
    );


    return data;


};