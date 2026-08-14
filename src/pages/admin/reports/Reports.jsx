import {
    useEffect,
    useState
} from "react";


import {
    FileText,
    TrendingUp,
    ShoppingBag,
    Package,
    AlertTriangle
} from "lucide-react";


import {
    getReportsSummary,
    getSalesReport,
    getBestProducts,
    getLowStockReport
} from "../../../services/reports/reportService";



import StatCard from "../../../components/admin/dashboard/StatCard";





export default function Reports(){



    const [
        summary,
        setSummary
    ] = useState({});


    const [
        sales,
        setSales
    ] = useState([]);


    const [
        bestProducts,
        setBestProducts
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

        loadReports();

    },[]);







    const loadReports = async()=>{


        try{


            const [

                summaryData,

                salesData,

                productsData,

                stockData


            ] = await Promise.all([



                getReportsSummary(),


                getSalesReport(),


                getBestProducts(),


                getLowStockReport()



            ]);



            setSummary(summaryData);

            setSales(salesData);

            setBestProducts(productsData);

            setLowStock(stockData);



        }


        catch(error){


            console.log(
                "REPORTS ERROR",
                error
            );


        }


        finally{


            setLoading(false);


        }


    };








    if(loading){


        return (

            <div className="p-10">

                Loading Reports...

            </div>

        );


    }







    return (


        <div className="space-y-8">





            <h1

            className="
            text-3xl
            font-black
            "

            >

                Reports


            </h1>







            <div

            className="
            grid
            md:grid-cols-4
            gap-6
            "

            >



                <StatCard

                title="Total Sales"

                value={
                    summary.total_sales || 0
                }

                icon={<TrendingUp/>}

                />





                <StatCard

                title="Orders"

                value={
                    summary.orders || 0
                }

                icon={<ShoppingBag/>}

                />





                <StatCard

                title="Products"

                value={
                    summary.products || 0
                }

                icon={<Package/>}

                />





                <StatCard

                title="Low Stock"

                value={
                    lowStock.length
                }

                icon={<AlertTriangle/>}

                />



            </div>









            <div

            className="
            grid
            md:grid-cols-2
            gap-6
            "

            >




                <ReportBox

                title="Best Selling Products"

                icon={<TrendingUp/>}

                >



                {
                    bestProducts.map(item=>(


                        <div

                        key={item.id}

                        className="
                        flex
                        justify-between
                        bg-gray-50
                        p-3
                        rounded-xl
                        "

                        >

                            <span>

                                {item.name}

                            </span>


                            <b>

                                {item.sales_count}

                            </b>


                        </div>


                    ))
                }



                </ReportBox>









                <ReportBox

                title="Low Stock Products"

                icon={<AlertTriangle/>}

                >



                {
                    lowStock.map(item=>(


                        <div

                        key={item.id}

                        className="
                        flex
                        justify-between
                        bg-red-50
                        p-3
                        rounded-xl
                        "

                        >

                            <span>

                                {item.product_name}

                            </span>


                            <b>

                                {item.quantity}

                            </b>


                        </div>


                    ))
                }



                </ReportBox>





            </div>










            <div

            className="
            bg-white
            rounded-3xl
            shadow
            p-6
            "

            >


                <h2

                className="
                text-xl
                font-black
                mb-5
                flex
                gap-2
                items-center
                "

                >

                    <FileText/>

                    Sales Report


                </h2>




                <div className="space-y-3">


                {
                    sales.map(item=>(


                        <div

                        key={item.id}

                        className="
                        flex
                        justify-between
                        bg-gray-50
                        p-4
                        rounded-xl
                        "

                        >


                            <span>

                                {item.date}

                            </span>



                            <span className="
                            font-bold
                            text-[#5B2A86]
                            ">

                                {item.amount} EGP

                            </span>



                        </div>


                    ))
                }



                </div>




            </div>






        </div>


    );


}









function ReportBox({

    title,

    icon,

    children

}){


    return (


        <div

        className="
        bg-white
        rounded-3xl
        shadow
        p-6
        "

        >


            <h2

            className="
            font-black
            text-xl
            mb-5
            flex
            gap-2
            items-center
            "

            >

                {icon}

                {title}


            </h2>


            <div className="space-y-3">

                {children}

            </div>



        </div>


    );


}