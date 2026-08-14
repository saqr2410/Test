import React, {
    useState
} from "react";


import {
    useNavigate
} from "react-router-dom";


import {
    useCart
} from "../../contexts/CartContext";


import {
    createOrder
} from "../../services/orders/orderService";


import toast from "react-hot-toast";





function Checkout(){



    const navigate = useNavigate();





    const {

        cartItems,

        total,

        clearCart

    } = useCart();






    const [

        loading,

        setLoading

    ] = useState(false);







    const [

        form,

        setForm

    ] = useState({

        customer_name:"",

        phone:"",

        address:""

    });









    const handleChange = (e)=>{


        setForm({

            ...form,

            [e.target.name]:

            e.target.value

        });


    };









    const submitOrder = async()=>{



        const token = localStorage.getItem(

            "access_token"

        );





        if(!token){


            toast.error(

                "يجب تسجيل الدخول أولاً"

            );



            navigate(

                "/login?next=/checkout"

            );


            return;


        }







        if(cartItems.length === 0){


            toast.error(

                "السلة فارغة"

            );


            return;


        }









        if(


            !form.customer_name ||

            !form.phone ||

            !form.address


        ){


            toast.error(

                "من فضلك أدخل بيانات التوصيل"

            );


            return;


        }









        try{


            setLoading(true);





            const order = await createOrder({

                customer_name:

                form.customer_name,


                phone:

                form.phone,


                address:

                form.address


            });









            toast.success(

                "تم إنشاء الطلب بنجاح"

            );








            // تنظيف السلة

            clearCart();








            navigate(

                `/orders/${order.id}`

            );




        }

        catch(error){



            console.log(

                "CHECKOUT ERROR",

                error.response?.data

            );



            toast.error(

                error.response?.data?.error ||

                "حدث خطأ أثناء إنشاء الطلب"

            );



        }



        finally{


            setLoading(false);


        }



    };












    return (



        <div

            dir="rtl"

            className="
            p-8
            max-w-5xl
            mx-auto
            "

        >





            <h1

                className="
                text-3xl
                font-black
                mb-8
                "

            >

                إتمام الطلب

            </h1>









            <div

                className="
                grid
                md:grid-cols-2
                gap-8
                "

            >







                {/* بيانات العميل */}





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

                        بيانات التوصيل

                    </h2>








                    <input


                        name="customer_name"


                        value={form.customer_name}


                        onChange={handleChange}


                        placeholder="الاسم"


                        className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        mb-4
                        "

                    />








                    <input


                        name="phone"


                        value={form.phone}


                        onChange={handleChange}


                        placeholder="رقم الهاتف"


                        className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        mb-4
                        "

                    />








                    <textarea


                        name="address"


                        value={form.address}


                        onChange={handleChange}


                        placeholder="العنوان"


                        rows="4"


                        className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        "

                    />





                </div>









                {/* ملخص الطلب */}






                <div

                    className="
                    bg-gray-50
                    rounded-2xl
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

                        المنتجات

                    </h2>









                    {

                        cartItems.map(item=>(



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


                                    {item.name}


                                    {" x "}


                                    {item.quantity}


                                </span>







                                <span

                                    className="
                                    font-bold
                                    "

                                >

                                    {

                                        Number(
                                            item.selling_price
                                        )

                                        *

                                        item.quantity

                                    }


                                    جنيه


                                </span>





                            </div>



                        ))


                    }









                    <div

                        className="
                        mt-6
                        text-2xl
                        font-black
                        "

                    >



                        الإجمالي:


                        {" "}


                        {total}


                        جنيه



                    </div>









                    <button


                        onClick={submitOrder}


                        disabled={loading}


                        className="
                        w-full
                        mt-6
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        py-4
                        rounded-xl
                        font-bold
                        "

                    >





                        {

                            loading

                            ?

                            "جاري إنشاء الطلب..."

                            :

                            "تأكيد الطلب"

                        }





                    </button>






                </div>








            </div>








        </div>



    );


}





export default Checkout;