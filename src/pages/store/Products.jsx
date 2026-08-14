import {
    useEffect,
    useState
} from "react";


import {
    Search,
    SlidersHorizontal
} from "lucide-react";


import ProductCard from "../../components/store/products/ProductCard";


import {
    getStoreProducts
} from "../../services/products/productService";





export default function Products(){


    const [products,setProducts] = useState([]);

    const [filteredProducts,setFilteredProducts] = useState([]);

    const [loading,setLoading] = useState(true);


    const [search,setSearch] = useState("");

    const [type,setType] = useState("ALL");






    useEffect(()=>{

        loadProducts();

    },[]);







    const loadProducts = async()=>{


        try{


            const data = await getStoreProducts();



            const items = data.results || data;



            setProducts(items);

            setFilteredProducts(items);



        }

        catch(error){


            console.log(
                "PRODUCT ERROR",
                error
            );


        }

        finally{


            setLoading(false);


        }


    };









    useEffect(()=>{


        let result = [...products];



        // Search

        if(search){


            result = result.filter(product=>

                product.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )

            );


        }






        // Type Filter

        if(type !== "ALL"){


            result = result.filter(product=>

                product.product_type === type

            );


        }




        setFilteredProducts(result);



    },[search,type,products]);









    if(loading){


        return (

            <div

                className="
                min-h-screen
                flex
                items-center
                justify-center
                "

            >

                <div

                    className="
                    text-[#5B2A86]
                    text-xl
                    font-bold
                    "

                >

                    جاري تحميل المنتجات...

                </div>


            </div>

        );


    }







    return (


        <div

            className="
            bg-[#FAF8FC]
            min-h-screen
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






                {/* Header */}


                <div

                    className="
                    flex
                    flex-col
                    lg:flex-row
                    justify-between
                    gap-6
                    items-center
                    "

                >



                    <div>


                        <h1

                            className="
                            text-4xl
                            font-black
                            text-[#5B2A86]
                            "

                        >

                            منتجات الصيدلية


                        </h1>



                        <p

                            className="
                            text-gray-500
                            mt-3
                            "

                        >

                            اكتشف الأدوية والمستلزمات الطبية الأصلية

                        </p>


                    </div>





                    <div

                        className="
                        bg-white
                        rounded-2xl
                        px-5
                        py-3
                        shadow
                        font-bold
                        "

                    >

                        {filteredProducts.length}

                        منتج

                    </div>




                </div>










                {/* Search */}


                <div

                    className="
                    mt-10
                    bg-white
                    rounded-3xl
                    p-5
                    shadow
                    "

                >



                    <div

                        className="
                        flex
                        flex-col
                        lg:flex-row
                        gap-4
                        "

                    >



                        <div

                            className="
                            flex-1
                            relative
                            "

                        >


                            <Search

                                className="
                                absolute
                                right-4
                                top-3.5
                                text-gray-400
                                "

                            />


                            <input


                                value={search}


                                onChange={
                                    e=>setSearch(e.target.value)
                                }


                                placeholder="ابحث عن دواء..."


                                className="
                                w-full
                                bg-gray-50
                                rounded-2xl
                                py-3
                                pr-12
                                pl-5
                                outline-none
                                "

                            />


                        </div>








                        <div

                            className="
                            flex
                            items-center
                            gap-2
                            "

                        >


                            <SlidersHorizontal

                                className="text-[#5B2A86]"

                            />



                            <select


                                value={type}


                                onChange={
                                    e=>setType(e.target.value)
                                }


                                className="
                                bg-gray-50
                                rounded-2xl
                                px-5
                                py-3
                                outline-none
                                "

                            >

                                <option value="ALL">
                                    كل المنتجات
                                </option>


                                <option value="RX">
                                    روشتة
                                </option>


                                <option value="OTC">
                                    بدون روشتة
                                </option>


                                <option value="COSMETIC">
                                    تجميل
                                </option>


                                <option value="SUPPLEMENT">
                                    مكملات
                                </option>


                            </select>



                        </div>



                    </div>


                </div>









                {/* Products Grid */}


                {

                    filteredProducts.length === 0 ?



                    (

                        <div

                            className="
                            bg-white
                            rounded-3xl
                            p-16
                            text-center
                            mt-10
                            "

                        >

                            لا توجد منتجات مطابقة


                        </div>

                    )



                    :



                    (

                        <div

                            className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            lg:grid-cols-4
                            gap-8
                            mt-10
                            "

                        >


                            {

                                filteredProducts.map(product=>(


                                    <ProductCard

                                        key={product.id}

                                        product={product}

                                    />


                                ))


                            }


                        </div>


                    )

                }







            </div>



        </div>


    );

}