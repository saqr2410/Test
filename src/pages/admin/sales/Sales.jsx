import {
    useEffect,
    useState
} from "react";


import {
    getSaleProducts,
    createSale
} from "../../../services/sales/salesService";


import toast from "react-hot-toast";






export default function Sales(){



    const [products,setProducts]=useState([]);


    const [cart,setCart]=useState([]);


    const [loading,setLoading]=useState(false);







    useEffect(()=>{


        loadProducts();


    },[]);







    const loadProducts = async()=>{


        const data = await getSaleProducts();


        setProducts(data);


    };








    const addProduct=(product)=>{


        const exists = cart.find(

            item=>item.id === product.id

        );




        if(exists){


            setCart(

                cart.map(item=>


                    item.id === product.id


                    ?

                    {

                        ...item,

                        quantity:item.quantity+1

                    }


                    :

                    item


                )

            );


            return;


        }







        setCart([

            ...cart,

            {

                ...product,

                quantity:1

            }


        ]);



    };









    const removeProduct=(id)=>{


        setCart(

            cart.filter(

                item=>item.id !== id

            )

        );


    };









    const total = cart.reduce(


        (sum,item)=>

        sum +

        (

            Number(item.selling_price)

            *

            item.quantity

        ),


        0


    );









    const checkout = async()=>{



        if(cart.length===0){


            toast.error(
                "السلة فارغة"
            );


            return;


        }






        try{


            setLoading(true);




            await createSale({


                items:cart.map(item=>(


                    {


                        product_id:item.id,


                        quantity:item.quantity


                    }


                ))



            });





            toast.success(

                "تم تسجيل البيع"

            );




            setCart([]);



        }



        catch(error){


            console.log(error);


            toast.error(

                "حدث خطأ"

            );


        }



        finally{


            setLoading(false);


        }



    };











    return (


        <div

            className="
            space-y-8
            "

            dir="rtl"

        >





            <h1

                className="
                text-3xl
                font-black
                "

            >

                نقطة البيع POS


            </h1>









            <div

                className="
                grid
                lg:grid-cols-3
                gap-6
                "

            >





                {/* Products */}


                <div

                    className="
                    lg:col-span-2
                    grid
                    md:grid-cols-3
                    gap-5
                    "

                >




                {


                    products.map(product=>(



                        <div

                            key={product.id}

                            onClick={()=>addProduct(product)}

                            className="
                            bg-white
                            rounded-2xl
                            shadow
                            p-5
                            cursor-pointer
                            hover:shadow-xl
                            "

                        >



                            <h3

                                className="
                                font-bold
                                "

                            >

                                {product.name}


                            </h3>




                            <p

                                className="
                                text-blue-600
                                font-black
                                mt-3
                                "

                            >

                                {product.selling_price}

                                جنيه


                            </p>




                        </div>



                    ))


                }





                </div>













                {/* Cart */}



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
                        "

                    >

                        الفاتورة


                    </h2>





                    {

                    cart.map(item=>(


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

                                x

                                {item.quantity}


                            </span>




                            <button

                            onClick={()=>removeProduct(item.id)}

                            className="
                            text-red-600
                            "

                            >

                                حذف


                            </button>




                        </div>


                    ))

                    }







                    <div

                    className="
                    mt-6
                    text-xl
                    font-black
                    "

                    >

                        الإجمالي:

                        {total}

                        جنيه


                    </div>







                    <button


                    onClick={checkout}


                    disabled={loading}


                    className="
                    w-full
                    mt-5
                    bg-green-600
                    text-white
                    py-3
                    rounded-xl
                    font-bold
                    "

                    >


                        تسجيل البيع


                    </button>




                </div>






            </div>






        </div>


    );


}