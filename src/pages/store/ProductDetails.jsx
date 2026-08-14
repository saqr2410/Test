import {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";


import {
    ShoppingCart,
    ShieldCheck,
    PackageCheck
} from "lucide-react";


import {
    getProductDetails
} from "../../services/products/productService";


import {
    useCart
} from "../../contexts/CartContext";






export default function ProductDetails(){


    const {id} = useParams();


    const [product,setProduct] = useState(null);

    const [loading,setLoading] = useState(true);



    const {
        addToCart
    } = useCart();






    useEffect(()=>{


        loadProduct();


    },[id]);







    const loadProduct = async()=>{


        try{


            const data = await getProductDetails(id);


            setProduct(data);


        }

        catch(error){


            console.log(
                "DETAIL ERROR",
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
                min-h-screen
                flex
                justify-center
                items-center
                "

            >

                جاري تحميل المنتج...

            </div>

        );


    }









    if(!product){


        return (

            <div

                className="
                text-center
                py-20
                "

            >

                المنتج غير موجود

            </div>

        );


    }









    return (


        <div

            className="
            bg-[#FAF8FC]
            min-h-screen
            py-14
            "

        >


            <div

                className="
                max-w-7xl
                mx-auto
                px-6
                "

            >






                <div

                    className="
                    grid
                    lg:grid-cols-2
                    gap-12
                    "

                >







                    {/* Image */}


                    <div

                        className="
                        bg-white
                        rounded-[35px]
                        shadow
                        p-8
                        "

                    >



                        {

                            product.image &&


                            <img


                                src={

                                    product.image.startsWith("http")

                                    ?

                                    product.image

                                    :

                                    `http://127.0.0.1:8000${product.image}`

                                }


                                alt={product.name}


                                className="
                                w-full
                                h-[500px]
                                object-cover
                                rounded-3xl
                                "

                            />


                        }



                    </div>









                    {/* Info */}



                    <div>


                        <span

                            className="
                            bg-[#F0E8FA]
                            text-[#5B2A86]
                            px-5
                            py-2
                            rounded-full
                            font-bold
                            "

                        >

                            {product.product_type}


                        </span>







                        <h1

                            className="
                            text-5xl
                            font-black
                            text-[#5B2A86]
                            mt-8
                            "

                        >

                            {product.name}


                        </h1>







                        {

                            product.scientific_name &&


                            <p

                                className="
                                text-gray-500
                                text-xl
                                mt-4
                                "

                            >

                                {product.scientific_name}


                            </p>


                        }









                        <div

                            className="
                            text-4xl
                            font-black
                            text-green-600
                            mt-8
                            "

                        >

                            {product.selling_price}

                            جنيه


                        </div>









                        <div

                            className="
                            grid
                            grid-cols-2
                            gap-5
                            mt-10
                            "

                        >



                            <div

                                className="
                                bg-white
                                rounded-2xl
                                p-5
                                "

                            >

                                <ShieldCheck

                                    className="text-[#5B2A86]"

                                />

                                <p className="mt-3">

                                    منتج أصلي

                                </p>


                            </div>







                            <div

                                className="
                                bg-white
                                rounded-2xl
                                p-5
                                "

                            >

                                <PackageCheck

                                    className="text-[#5B2A86]"

                                />

                                <p className="mt-3">

                                    متوفر بالمخزن

                                </p>


                            </div>



                        </div>









                        <button


                            onClick={()=>addToCart(product)}


                            className="
                            mt-10
                            w-full
                            bg-[#5B2A86]
                            hover:bg-[#472064]
                            text-white
                            py-5
                            rounded-3xl
                            font-black
                            text-xl
                            flex
                            items-center
                            justify-center
                            gap-3
                            "

                        >


                            <ShoppingCart/>


                            إضافة إلى السلة


                        </button>









                        {

                            product.description &&


                            <div

                                className="
                                bg-white
                                rounded-3xl
                                p-6
                                mt-8
                                "

                            >

                                <h3

                                    className="
                                    font-black
                                    text-xl
                                    text-[#5B2A86]
                                    "

                                >

                                    وصف المنتج


                                </h3>


                                <p

                                    className="
                                    text-gray-600
                                    leading-8
                                    mt-4
                                    "

                                >

                                    {product.description}


                                </p>


                            </div>


                        }







                    </div>







                </div>





            </div>


        </div>


    );


}