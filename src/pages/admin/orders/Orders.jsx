import {
    useEffect,
    useState
} from "react";


import {
    getOrders,
    updateOrderStatus
} from "../../../services/orders/orderService";


import PageHeader from "../../../components/ui/layout/PageHeader";

import toast from "react-hot-toast";




export default function Orders(){


    const [orders,setOrders]=useState([]);

    const [loading,setLoading]=useState(true);







    const loadOrders=async()=>{


        try{


            const data =
                await getOrders();


            setOrders(data);


        }

        catch(error){


            console.log(error);


        }

        finally{


            setLoading(false);


        }


    };






    useEffect(()=>{


        loadOrders();


    },[]);








    const changeStatus=async(id,status)=>{


        try{


            await updateOrderStatus(
                id,
                status
            );


            toast.success(
                "Order updated"
            );


            loadOrders();


        }

        catch(error){


            console.log(error);


            toast.error(
                "Update failed"
            );


        }


    };









    return (

        <div className="space-y-6">


            <PageHeader

                title="Orders"

                subtitle="Delivery Orders Management"

            />





            <div

                className="
                    bg-white
                    rounded-2xl
                    shadow
                    p-6
                "

            >



                <table

                    className="
                        w-full
                    "

                >


                    <thead>


                        <tr

                            className="
                                border-b
                                text-gray-500
                            "

                        >

                            <th className="p-3 text-left">
                                ID
                            </th>


                            <th className="p-3 text-left">
                                Customer
                            </th>


                            <th className="p-3 text-left">
                                Total
                            </th>


                            <th className="p-3 text-left">
                                Status
                            </th>


                            <th className="p-3 text-left">
                                Action
                            </th>


                        </tr>


                    </thead>





                    <tbody>


                    {
                        orders.map(order=>(


                            <tr

                                key={order.id}

                                className="
                                    border-b
                                "

                            >


                                <td className="p-3">

                                    #{order.id}

                                </td>



                                <td className="p-3">

                                    {
                                        order.customer?.name
                                        ||
                                        "Customer"
                                    }

                                </td>




                                <td className="p-3">

                                    {
                                        order.total
                                    }
                                    EGP

                                </td>




                                <td className="p-3">


                                    <span

                                        className="
                                            px-3
                                            py-1
                                            rounded-full
                                            bg-purple-100
                                            text-purple-700
                                        "

                                    >

                                        {
                                            order.status
                                        }

                                    </span>


                                </td>





                                <td className="p-3">


                                    {
                                        order.status !== "DELIVERED" &&

                                        <button

                                            onClick={()=>


                                                changeStatus(

                                                    order.id,

                                                    "DELIVERED"

                                                )


                                            }


                                            className="
                                                bg-[#5B2A86]
                                                text-white
                                                px-4
                                                py-2
                                                rounded-xl
                                            "

                                        >

                                            Delivered

                                        </button>

                                    }


                                </td>



                            </tr>


                        ))
                    }


                    </tbody>



                </table>



            </div>




        </div>

    );

}