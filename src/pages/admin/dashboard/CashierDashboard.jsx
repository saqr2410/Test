import {
    useEffect,
    useState
} from "react";


import {
    getDashboardStats,
    getRecentOrders
} from "../../../services/dashboard/dashboardService";


import StatCard from "../../../components/admin/dashboard/StatCard";
import RecentOrders from "../../../components/admin/dashboard/RecentOrders";








export default function CashierDashboard(){



    const [
        stats,
        setStats
    ] = useState({});



    const [
        orders,
        setOrders
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



                ordersData



            ] = await Promise.all([




                getDashboardStats(),



                getRecentOrders()



            ]);






            setStats(

                statsData || {}

            );




            setOrders(

                ordersData || []

            );





        }


        catch(error){


            console.log(

                "Cashier Dashboard Error",

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

                Cashier Dashboard


            </h1>









            <div

            className="
            grid
            md:grid-cols-3
            gap-6
            "

            >






                <StatCard


                title="Today Sales"



                value={

                    stats.today_sales || 0

                }


                />









                <StatCard


                title="Orders"



                value={

                    stats.orders || 0

                }


                />









                <StatCard


                title="Customers"



                value={

                    stats.customers || 0

                }


                />









            </div>












            <RecentOrders


            orders={orders}


            />








        </div>


    );


}