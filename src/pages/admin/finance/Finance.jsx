import {
    useEffect,
    useState
} from "react";


import {
  getFinanceSummary,
  getTransactions
} from "../../../services/finance/financeService";


import StatCard from "../../../components/admin/dashboard/StatCard";



export default function Finance(){


    const [summary,setSummary] = useState({});

    const [transactions,setTransactions] = useState([]);


    const [loading,setLoading] = useState(true);





    useEffect(()=>{

        load();

    },[]);





    const load = async()=>{


        try{


            const [
                summaryData,
                transactionsData
            ] = await Promise.all([


                getFinanceSummary(),

                getTransactions()


            ]);



            setSummary(summaryData);

            setTransactions(transactionsData);



        }

        catch(error){

            console.log(
                "Finance Error",
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

                Loading Finance...

            </div>

        );

    }





    return (


        <div className="space-y-8">



            <h1 className="
            text-3xl
            font-black
            ">

                Finance


            </h1>





            <div className="
            grid
            md:grid-cols-4
            gap-6
            ">


                <StatCard

                    title="Revenue"

                    value={
                        summary.revenue || 0
                    }

                />



                <StatCard

                    title="Expenses"

                    value={
                        summary.expenses || 0
                    }

                />



                <StatCard

                    title="Profit"

                    value={
                        summary.profit || 0
                    }

                />



                <StatCard

                    title="Transactions"

                    value={
                        summary.transactions || 0
                    }

                />


            </div>








            <div className="
            bg-white
            rounded-3xl
            shadow
            p-6
            ">



                <h2 className="
                text-xl
                font-black
                mb-5
                ">

                    Latest Transactions

                </h2>




                <div className="
                space-y-3
                ">


                {
                    transactions.map(item=>(


                        <div

                        key={item.id}

                        className="
                        flex
                        justify-between
                        bg-gray-50
                        rounded-xl
                        p-4
                        "

                        >


                            <span>

                                {item.type}

                            </span>



                            <span className="
                            font-bold
                            text-[#5B2A86]
                            ">

                                {item.amount}

                            </span>


                        </div>


                    ))
                }


                </div>



            </div>






        </div>


    );


}