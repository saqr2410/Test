import {
    useEffect,
    useState
} from "react";


import {
    getSuppliers,
    getProducts,
    createPurchase
} from "../../../services/purchases/purchaseService";


import toast from "react-hot-toast";






export default function Purchases(){



    const [suppliers,setSuppliers]=useState([]);

    const [products,setProducts]=useState([]);


    const [supplier,setSupplier]=useState("");



    const [items,setItems]=useState([]);




    const [loading,setLoading]=useState(false);








    useEffect(()=>{


        load();


    },[]);






    const load=async()=>{


        const [

            suppliersData,

            productsData

        ] = await Promise.all([


            getSuppliers(),


            getProducts()


        ]);



        setSuppliers(suppliersData);

        setProducts(productsData);


    };









    const addItem=(product)=>{


        const exists = items.find(

            i=>i.product_id===product.id

        );




        if(exists){


            setItems(

                items.map(i=>


                    i.product_id===product.id


                    ?

                    {

                    ...i,

                    quantity:i.quantity+1

                    }


                    :

                    i


                )

            );


            return;

        }







        setItems([

            ...items,

            {

                product_id:product.id,

                name:product.name,

                quantity:1,

                purchase_price:0

            }


        ]);



    };










    const updatePrice=(id,value)=>{


        setItems(

            items.map(item=>


                item.product_id===id


                ?

                {

                    ...item,

                    purchase_price:value

                }


                :

                item


            )

        );


    };









    const savePurchase=async()=>{


        if(!supplier){


            toast.error(
                "اختر المورد"
            );


            return;

        }




        if(items.length===0){


            toast.error(
                "أضف منتجات"
            );


            return;


        }





        try{


            setLoading(true);



            await createPurchase({


                supplier_id:supplier,


                items:items.map(item=>(


                    {

                    product_id:item.product_id,

                    quantity:item.quantity,

                    purchase_price:item.purchase_price

                    }


                ))



            });





            toast.success(

                "تم تسجيل الشراء"

            );




            setItems([]);



        }


        catch(error){


            console.log(error);


            toast.error(
                "خطأ أثناء الشراء"
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

                المشتريات


            </h1>









            <div

            className="
            bg-white
            rounded-3xl
            shadow
            p-6
            "

            >




                <select


                value={supplier}


                onChange={e=>

                    setSupplier(
                        e.target.value
                    )

                }


                className="
                border
                p-3
                rounded-xl
                w-full
                "

                >


                    <option>

                        اختر المورد

                    </option>



                    {

                    suppliers.map(s=>(

                        <option

                        key={s.id}

                        value={s.id}

                        >

                            {s.name}


                        </option>


                    ))

                    }


                </select>



            </div>













            <div

            className="
            grid
            md:grid-cols-4
            gap-5
            "

            >



            {


            products.map(product=>(



                <button

                key={product.id}

                onClick={()=>addItem(product)}


                className="
                bg-white
                shadow
                rounded-2xl
                p-5
                font-bold
                "

                >


                    {product.name}


                </button>



            ))


            }



            </div>












            <div

            className="
            bg-white
            rounded-3xl
            shadow
            p-6
            "

            >



            {

            items.map(item=>(



                <div

                key={item.product_id}

                className="
                flex
                justify-between
                items-center
                border-b
                py-4
                "

                >



                    <span>

                        {item.name}

                        {" x "}

                        {item.quantity}


                    </span>





                    <input


                    type="number"


                    placeholder="سعر الشراء"


                    onChange={e=>

                        updatePrice(

                            item.product_id,

                            e.target.value

                        )

                    }


                    className="
                    border
                    p-2
                    rounded
                    "

                    />




                </div>



            ))

            }








            <button


            onClick={savePurchase}


            disabled={loading}


            className="
            mt-6
            bg-blue-600
            text-white
            px-8
            py-3
            rounded-xl
            font-bold
            "

            >

                حفظ الشراء


            </button>




            </div>







        </div>


    );



}