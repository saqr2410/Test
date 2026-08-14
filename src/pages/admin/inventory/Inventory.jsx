import {
    useEffect,
    useState
} from "react";


import {
    getInventory
} from "../../../services/inventory/inventoryService";





export default function Inventory(){



    const [products,setProducts] = useState([]);


    const [loading,setLoading] = useState(true);


    const [search,setSearch] = useState("");







    useEffect(()=>{


        loadInventory();


    },[]);







    const loadInventory = async()=>{

        try{

            const data = await getInventory();

            console.log(
                "INVENTORY DATA =>",
                data
            );


            setProducts(
                Array.isArray(data)
                    ? data
                    : data.results || []
            );


        }

        catch(error){

            console.log(
                "INVENTORY ERROR",
                error
            );

        }

        finally{

            setLoading(false);

        }

    };









    const filtered = products.filter(product=>


        product.name

        ?.toLowerCase()

        .includes(

            search.toLowerCase()

        )


    );










    if(loading){


        return (

            <div className="p-10">

                Loading Inventory...


            </div>

        );


    }








    return (


        <div

            className="
            space-y-8
            "

            dir="rtl"

        >





            <div>


                <h1

                    className="
                    text-3xl
                    font-black
                    "

                >

                    المخزون


                </h1>



                <p

                    className="
                    text-gray-500
                    "

                >

                    متابعة كميات الأدوية والبضائع


                </p>



            </div>









            <input


                value={search}


                onChange={e=>

                    setSearch(
                        e.target.value
                    )

                }


                placeholder="بحث عن منتج..."


                className="
                w-full
                md:w-96
                border
                rounded-xl
                p-3
                "

            />









            <div

                className="
                bg-white
                rounded-3xl
                shadow
                overflow-hidden
                "

            >




                <table

                    className="
                    w-full
                    "

                >



                    <thead

                        className="
                        bg-gray-100
                        "

                    >

                        <tr>


                            <th className="p-4">
                                المنتج
                            </th>


                            <th className="p-4">
                                الباركود
                            </th>


                            <th className="p-4">
                                الكمية
                            </th>


                            <th className="p-4">
                                الحالة
                            </th>



                        </tr>


                    </thead>







                    <tbody>



                    {


                        filtered.map(product=>(



                            <tr

                                key={product.id}

                                className="
                                border-b
                                "

                            >



                                <td className="p-4 font-bold">

                                    {
                                        product.name
                                    }

                                </td>





                                <td className="p-4">

                                    {
                                        product.barcode
                                    }

                                </td>





                                <td className="p-4">

                                    {
                                        product.quantity
                                    }

                                </td>






                                <td className="p-4">


                                    {

                                        product.quantity <= product.reorder_level


                                        ?

                                        <span

                                        className="
                                        bg-red-100
                                        text-red-600
                                        px-3
                                        py-1
                                        rounded-full
                                        "

                                        >

                                            منخفض


                                        </span>



                                        :


                                        <span

                                        className="
                                        bg-green-100
                                        text-green-600
                                        px-3
                                        py-1
                                        rounded-full
                                        "

                                        >

                                            جيد


                                        </span>


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