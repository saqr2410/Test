import React, {
    useEffect,
    useState
} from "react";


import {
    useParams
} from "react-router-dom";


import { getOrderDetails } from "../../../services/orders/orderService";



export default function OrderDetails(){


    const {
        id
    } = useParams();



    const [
        order,
        setOrder
    ] = useState(null);




    useEffect(()=>{


        load();


    },[]);




    const load = async()=>{


        const data = await getOrderDetails(id);


        setOrder(data);


    };





    if(!order){

        return (

            <div className="p-8">

                جاري التحميل...

            </div>

        );

    }





    return (

        <div className="
        p-8
        max-w-4xl
        mx-auto
        ">



            <h1 className="
            text-3xl
            font-black
            mb-6
            ">

                طلب رقم #{order.id}

            </h1>




            <div className="
            bg-white
            rounded-2xl
            shadow
            p-6
            ">



                {
                    order.items.map(item=>(


                        <div

                        key={item.id}

                        className="
                        flex
                        justify-between
                        border-b
                        py-3
                        "

                        >


                            <span>

                                {item.product_name}

                                {" x "}

                                {item.quantity}

                            </span>



                            <span>

                                {
                                item.line_total
                                }

                                جنيه

                            </span>



                        </div>


                    ))
                }





                <div className="
                mt-6
                font-black
                text-2xl
                ">

                    الإجمالي:

                    {" "}

                    {order.total_price}

                    جنيه


                </div>



            </div>



        </div>

    );


}