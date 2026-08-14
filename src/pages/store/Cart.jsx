import React from "react";

import {
    Trash2,
    Plus,
    Minus,
    ShoppingBag
} from "lucide-react";

import {
    Link
} from "react-router-dom";


import {
    useCart
} from "../../contexts/CartContext";





export default function Cart(){


    const {

        cartItems,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        total

    } = useCart();








    if(cartItems.length === 0){


        return (

            <div

                dir="rtl"

                className="
                min-h-screen
                bg-[#FAF8FC]
                flex
                items-center
                justify-center
                "

            >


                <div

                    className="
                    bg-white
                    rounded-[35px]
                    shadow-lg
                    p-10
                    text-center
                    max-w-md
                    "

                >


                    <div

                        className="
                        w-24
                        h-24
                        mx-auto
                        rounded-full
                        bg-[#F0E8FA]
                        flex
                        items-center
                        justify-center
                        "

                    >

                        <ShoppingBag

                            size={45}

                            className="
                            text-[#5B2A86]
                            "

                        />


                    </div>





                    <h1

                        className="
                        text-3xl
                        font-black
                        text-[#5B2A86]
                        mt-6
                        "

                    >

                        السلة فارغة


                    </h1>





                    <p

                        className="
                        text-gray-500
                        mt-3
                        "

                    >

                        لم تقم بإضافة أي منتجات بعد


                    </p>






                    <Link

                        to="/products"

                        className="
                        block
                        mt-8
                        bg-[#5B2A86]
                        hover:bg-[#472064]
                        text-white
                        py-4
                        rounded-2xl
                        font-bold
                        "

                    >

                        تصفح الأدوية


                    </Link>




                </div>


            </div>

        );


    }









    return (

        <div

            dir="rtl"

            className="
            min-h-screen
            bg-[#FAF8FC]
            py-12
            "

        >



            <div

                className="
                max-w-7xl
                mx-auto
                px-6
                "

            >





                <h1

                    className="
                    text-4xl
                    font-black
                    text-[#5B2A86]
                    mb-10
                    "

                >

                    سلة المشتريات


                </h1>








                <div

                    className="
                    grid
                    lg:grid-cols-3
                    gap-8
                    "

                >







                    {/* Items */}



                    <div

                        className="
                        lg:col-span-2
                        space-y-5
                        "

                    >




                    {

                        cartItems.map(item=>(


                            <div

                                key={item.id}

                                className="
                                bg-white
                                rounded-[30px]
                                shadow-sm
                                p-6
                                flex
                                items-center
                                justify-between
                                gap-5
                                "

                            >







                                <div

                                    className="
                                    flex
                                    items-center
                                    gap-5
                                    "

                                >




                                    <div

                                        className="
                                        w-24
                                        h-24
                                        bg-[#F5F0FA]
                                        rounded-2xl
                                        flex
                                        items-center
                                        justify-center
                                        "

                                    >

                                        💊


                                    </div>






                                    <div>


                                        <h2

                                            className="
                                            text-xl
                                            font-black
                                            text-gray-800
                                            "

                                        >

                                            {item.name}


                                        </h2>




                                        <p

                                            className="
                                            text-[#5B2A86]
                                            font-bold
                                            mt-2
                                            "

                                        >

                                            {item.selling_price}

                                            جنيه


                                        </p>



                                    </div>



                                </div>









                                <div

                                    className="
                                    flex
                                    items-center
                                    gap-4
                                    "

                                >



                                    <button

                                        onClick={()=>decreaseQuantity(item.id)}

                                        className="
                                        w-9
                                        h-9
                                        rounded-full
                                        bg-gray-100
                                        hover:bg-[#F0E8FA]
                                        "

                                    >

                                        <Minus size={18}/>


                                    </button>






                                    <span

                                        className="
                                        font-black
                                        text-lg
                                        "

                                    >

                                        {item.quantity}


                                    </span>






                                    <button

                                        onClick={()=>increaseQuantity(item.id)}

                                        className="
                                        w-9
                                        h-9
                                        rounded-full
                                        bg-[#5B2A86]
                                        text-white
                                        "

                                    >

                                        <Plus size={18}/>


                                    </button>







                                </div>









                                <button

                                    onClick={()=>removeFromCart(item.id)}

                                    className="
                                    text-red-500
                                    hover:bg-red-50
                                    p-3
                                    rounded-full
                                    "

                                >

                                    <Trash2 size={22}/>


                                </button>






                            </div>


                        ))

                    }



                    </div>









                    {/* Summary */}



                    <div


                        className="
                        bg-white
                        rounded-[35px]
                        shadow-lg
                        p-8
                        h-fit
                        "

                    >



                        <h2

                            className="
                            text-2xl
                            font-black
                            text-[#5B2A86]
                            mb-8
                            "

                        >

                            ملخص الطلب


                        </h2>






                        <div

                            className="
                            flex
                            justify-between
                            text-gray-600
                            "

                        >

                            <span>

                                المنتجات

                            </span>


                            <span>

                                {cartItems.length}

                            </span>


                        </div>







                        <div

                            className="
                            border-t
                            my-6
                            "

                        />







                        <div

                            className="
                            flex
                            justify-between
                            text-2xl
                            font-black
                            "

                        >

                            <span>

                                الإجمالي

                            </span>



                            <span

                                className="
                                text-[#5B2A86]
                                "

                            >

                                {total}

                                جنيه


                            </span>


                        </div>








                        <Link

                            to="/checkout"

                            className="
                            block
                            text-center
                            mt-8
                            bg-[#5B2A86]
                            hover:bg-[#472064]
                            text-white
                            py-4
                            rounded-2xl
                            font-black
                            "

                        >

                            إتمام الطلب


                        </Link>





                    </div>





                </div>





            </div>



        </div>


    );


}