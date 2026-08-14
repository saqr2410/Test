import {
    useEffect,
    useState
} from "react";


import {
    getPOSProducts,
    createPOSSale
} from "../../../services/pos/posService";


import PageHeader from "../../../components/ui/layout/PageHeader";

import toast from "react-hot-toast";




export default function POS(){


    const [products,setProducts]=useState([]);

    const [cart,setCart]=useState([]);

    const [loading,setLoading]=useState(true);





    useEffect(()=>{


        const loadProducts = async()=>{


            try{


                const data =
                    await getPOSProducts();


                setProducts(data);


            }

            catch(error){

                console.log(error);

            }


            finally{

                setLoading(false);

            }


        };


        loadProducts();


    },[]);







    const addToCart=(product)=>{


        const exists =
            cart.find(
                item=>item.id===product.id
            );



        if(exists){


            setCart(

                cart.map(item=>

                    item.id===product.id

                    ?

                    {
                        ...item,
                        quantity:item.quantity+1
                    }

                    :

                    item

                )

            );


        }

        else{


            setCart([

                ...cart,

                {
                    id:product.id,
                    name:product.name,
                    price:product.selling_price,
                    quantity:1
                }

            ]);


        }


    };








    const total = cart.reduce(

        (sum,item)=>

            sum +
            item.price *
            item.quantity,

        0

    );









    const checkout=async()=>{


        try{


            await createPOSSale({

                items:cart.map(item=>(

                    {
                        product:item.id,
                        quantity:item.quantity
                    }

                ))

            });



            toast.success(
                "Sale completed"
            );


            setCart([]);


        }


        catch(error){


            console.log(error);

            toast.error(
                "Sale failed"
            );


        }



    };








    return (

        <div className="space-y-6">



            <PageHeader

                title="POS"

                subtitle="Point Of Sale"

            />






            <div
                className="
                    grid
                    grid-cols-1
                    lg:grid-cols-3
                    gap-6
                "
            >





                {/* Products */}


                <div

                    className="
                        lg:col-span-2
                        bg-white
                        p-6
                        rounded-2xl
                        shadow
                    "

                >


                    <h2 className="font-bold text-xl mb-5">

                        Products

                    </h2>



                    <div
                        className="
                            grid
                            grid-cols-2
                            md:grid-cols-3
                            gap-4
                        "
                    >


                    {
                        products.map(product=>(


                            <button

                                key={product.id}

                                onClick={()=>
                                    addToCart(product)
                                }

                                className="
                                    border
                                    rounded-xl
                                    p-4
                                    hover:bg-purple-50
                                    text-left
                                "

                            >


                                <h3 className="font-bold">

                                    {product.name}

                                </h3>



                                <p className="text-gray-500">

                                    {product.selling_price} EGP

                                </p>



                            </button>


                        ))

                    }


                    </div>



                </div>







                {/* Cart */}


                <div

                    className="
                        bg-white
                        p-6
                        rounded-2xl
                        shadow
                    "

                >


                    <h2 className="font-bold text-xl mb-5">

                        Cart

                    </h2>





                    {
                        cart.map(item=>(


                            <div

                                key={item.id}

                                className="
                                    flex
                                    justify-between
                                    mb-3
                                "

                            >

                                <span>

                                    {item.name}

                                    x

                                    {item.quantity}

                                </span>


                                <span>

                                    {item.price *
                                    item.quantity}

                                </span>


                            </div>


                        ))

                    }




                    <hr className="my-4"/>




                    <div className="font-bold text-lg">

                        Total:
                        {total}
                        EGP

                    </div>





                    <button

                        onClick={checkout}

                        disabled={!cart.length}

                        className="
                            mt-5
                            w-full
                            bg-[#5B2A86]
                            text-white
                            py-3
                            rounded-xl
                        "

                    >

                        Checkout

                    </button>




                </div>



            </div>




        </div>

    );

}