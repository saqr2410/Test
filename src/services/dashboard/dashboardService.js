import api from "../../api/axios";



// Owner Dashboard Statistics

export const getDashboardStats = async () => {


    const response = await api.get(

        "/dashboard/stats/"

    );


    return response.data;


};




// Recent Orders

export const getRecentOrders = async () => {


    const response = await api.get(

        "/dashboard/recent-orders/"

    );


    return response.data;


};




// Low Stock Products

export const getLowStockProducts = async () => {


    const response = await api.get(

        "/dashboard/low-stock/"

    );


    return response.data;


};