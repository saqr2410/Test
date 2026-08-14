import {
    useEffect,
    useState
} from "react";


import {
    getDashboardStats,
    getRecentOrders,
    getLowStockProducts
} from "../../../services/dashboard/dashboardService";


import StatCard from "../../../components/admin/dashboard/StatCard";
import RecentOrders from "../../../components/admin/dashboard/RecentOrders";
import LowStock from "../../../components/admin/dashboard/LowStock";
import SalesChart from "../../../components/admin/dashboard/SalesChart";




export default function ManagerDashboard(){



    const [
        stats,
        setStats
    ] = useState({});



    const [
        orders,
        setOrders
    ] = useState([]);



    const [
        lowStock,
        setLowStock
    ] = useState([]);



    const [
        loading,
        setLoading
    ] = useState(true);









    useEffect(()=>{


        load();


    },[]);









    const load = async()=>{


        try{


            const [


                statsData,


                ordersData,


                stockData


            ] = await Promise.all([



                getDashboardStats(),



                getRecentOrders(),



                getLowStockProducts()



            ]);





            setStats(

                statsData || {}

            );



            setOrders(

                ordersData || []

            );



            setLowStock(

                stockData || []

            );



        }



        catch(error){


            console.log(

                "Manager Dashboard Error",

                error

            );


        }



        finally{


            setLoading(false);


        }


    };












    if(loading){


        return (

            <div

            className="
            p-10
            text-center
            font-bold
            "

            >

                Loading Dashboard...


            </div>

        );


    }









    return (



        <div

        className="
        space-y-8
        "

        >







            <h1

            className="
            text-3xl
            font-black
            "

            >

                Manager Dashboard


            </h1>









            <div

            className="
            grid
            md:grid-cols-3
            gap-6
            "

            >







                <StatCard


                title="Orders"



                value={

                    stats.orders_count || 0

                }


                />









                <StatCard


                title="Products"



                value={

                    stats.products || 0

                }


                />









                <StatCard


                title="Sales"



                value={

                    stats.total_sales || 0

                }


                />









            </div>












            <SalesChart


            data={

                stats.sales_chart || []

            }


            />













            <div

            className="
            grid
            md:grid-cols-2
            gap-6
            "

            >





                <RecentOrders


                orders={orders}


                />







                <LowStock


                products={lowStock}


                />





            </div>









        </div>


    );


}