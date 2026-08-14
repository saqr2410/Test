import {
    useEffect,
    useState
} from "react";


import {
    getDashboardStats,
    getLowStockProducts
} from "../../../services/dashboard/dashboardService";


import StatCard from "../../../components/admin/dashboard/StatCard";
import LowStock from "../../../components/admin/dashboard/LowStock";





export default function PharmacistDashboard(){



    const [
        stats,
        setStats
    ] = useState({});



    const [
        stock,
        setStock
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


                stockData


            ] = await Promise.all([



                getDashboardStats(),



                getLowStockProducts()



            ]);





            setStats(

                statsData || {}

            );



            setStock(

                stockData || []

            );





        }


        catch(error){


            console.log(

                "Pharmacist Dashboard Error",

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

                Pharmacist Dashboard


            </h1>









            <div

            className="
            grid
            md:grid-cols-3
            gap-6
            "

            >







                <StatCard


                title="Prescriptions"



                value={

                    stats.prescriptions_count || 0

                }


                />









                <StatCard


                title="Products"



                value={

                    stats.products || 0

                }


                />









                <StatCard


                title="Customers"



                value={

                    stats.customers || 0

                }


                />









            </div>









            <LowStock


            products={stock}


            />









        </div>


    );


}