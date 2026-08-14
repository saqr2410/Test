export default function RecentOrders({
    orders=[]
}){


    return (

        <div

            className="
            bg-white
            rounded-2xl
            shadow
            p-6
            "

        >


            <h2

                className="
                text-xl
                font-bold
                mb-5
                "

            >

                Recent Orders


            </h2>





            {

                orders.map(order=>(


                    <div

                        key={order.id}

                        className="
                        border-b
                        py-3
                        flex
                        justify-between
                        "

                    >


                        <span>

                            #{order.id}


                        </span>



                        <span>

                            {order.total}

                            جنيه

                        </span>



                    </div>


                ))


            }



        </div>

    );


}