import {
    useEffect,
    useState
} from "react";


import {
    getDashboardStats,
    getRecentOrders,
    getLowStockProducts

} from "../services/dashboard/dashboardService";





export default function useDashboard() {



    const [stats, setStats] = useState({

        products: 0,

        revenue: 0,

        orders: 0,

        customers: 0

    });



    const [orders, setOrders] = useState([]);



    const [lowStock, setLowStock] = useState([]);



    const [loading, setLoading] = useState(true);





    useEffect(() => {


        loadDashboard();



    }, []);







    const loadDashboard = async () => {


        try {



            setLoading(true);




            const [

                statsData,

                ordersData,

                lowStockData


            ] = await Promise.all([


                getDashboardStats(),


                getRecentOrders(),


                getLowStockProducts()



            ]);







            setStats(statsData);



            setOrders(ordersData);



            setLowStock(lowStockData);





        }



        catch(error) {


            console.log(

                "Dashboard Error",

                error

            );


        }



        finally {


            setLoading(false);


        }



    };






    return {


        stats,

        orders,

        lowStock,

        loading,

        reload: loadDashboard


    };



}