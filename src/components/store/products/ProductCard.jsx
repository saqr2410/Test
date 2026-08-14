import {
    ShoppingCart,
    Pill,
    ShieldCheck
} from "lucide-react";

import {
    Link
} from "react-router-dom";


import {
    useCart
} from "../../../contexts/CartContext";



export default function ProductCard({product}) {


    const {
        addToCart
    } = useCart();



    const imageUrl = product.image

        ?

        (
            product.image.startsWith("http")

            ?

            product.image

            :

            `http://127.0.0.1:8000${product.image}`
        )

        :

        "https://placehold.co/500x400/f5f3ff/5B2A86?text=Medicine";





    return (

        <div

            className="
            group
            bg-white
            rounded-3xl
            shadow-md
            hover:shadow-2xl
            transition-all
            duration-300
            overflow-hidden
            border
            border-gray-100
            "

        >


            {/* Image */}

            <div

                className="
                relative
                bg-[#F8F5FC]
                p-5
                "

            >


                <img

                    src={imageUrl}

                    alt={product.name}

                    className="
                    w-full
                    h-52
                    object-cover
                    rounded-2xl
                    group-hover:scale-105
                    transition
                    duration-300
                    "

                />



                {
                    product.requires_prescription &&

                    <span

                        className="
                        absolute
                        top-7
                        right-7
                        bg-red-500
                        text-white
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-bold
                        "

                    >

                        روشتة مطلوبة

                    </span>

                }



            </div>





            {/* Content */}


            <div className="p-5">



                <div className="flex items-center gap-2">


                    <Pill

                        size={18}

                        className="text-[#5B2A86]"

                    />


                    <h2

                        className="
                        font-black
                        text-lg
                        text-gray-800
                        "

                    >

                        {product.name}


                    </h2>


                </div>





                {

                    product.scientific_name &&


                    <p

                        className="
                        text-gray-500
                        text-sm
                        mt-2
                        "

                    >

                        {product.scientific_name}


                    </p>


                }






                {

                    product.manufacturer &&


                    <p

                        className="
                        text-xs
                        text-gray-400
                        mt-2
                        "

                    >

                        {product.manufacturer}


                    </p>

                }





                <div

                    className="
                    flex
                    justify-between
                    items-center
                    mt-5
                    "

                >


                    <span

                        className="
                        text-2xl
                        font-black
                        text-[#5B2A86]
                        "

                    >

                        {product.selling_price} ج

                    </span>



                    {


                        product.stock > 0 ?

                        <span

                            className="
                            flex
                            items-center
                            gap-1
                            text-green-600
                            text-sm
                            "

                        >

                            <ShieldCheck size={16}/>

                            متوفر

                        </span>


                        :


                        <span

                            className="
                            text-red-500
                            text-sm
                            "

                        >

                            غير متوفر

                        </span>


                    }



                </div>







                <div

                    className="
                    flex
                    gap-3
                    mt-6
                    "

                >



                    <Link

                        to={`/products/${product.id}`}

                        className="
                        flex-1
                        text-center
                        bg-gray-100
                        py-3
                        rounded-xl
                        font-bold
                        hover:bg-gray-200
                        "

                    >

                        التفاصيل

                    </Link>





                    <button

                        onClick={()=>addToCart(product)}

                        disabled={product.stock <= 0}


                        className="
                        flex-1
                        bg-[#5B2A86]
                        text-white
                        py-3
                        rounded-xl
                        font-bold
                        flex
                        justify-center
                        items-center
                        gap-2
                        hover:bg-[#472064]
                        disabled:bg-gray-400
                        "

                    >

                        <ShoppingCart size={18}/>

                        إضافة


                    </button>



                </div>



            </div>




        </div>

    );

}