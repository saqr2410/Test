export default function ProductRow({

    product

}) {



    return (


        <tr className="border-t hover:bg-gray-50">



            {/* Image */}

            <td className="px-6 py-4">


                <img

                    src={
                        product.image ||
                        "https://placehold.co/60"
                    }

                    alt={product.name}

                    className="
                    w-12
                    h-12
                    rounded-lg
                    object-cover
                    "

                />


            </td>





            {/* Name */}

            <td className="px-6 py-4 font-semibold">


                {product.name}


                {

                    product.scientific_name &&

                    (

                        <div className="text-sm text-gray-500">

                            {product.scientific_name}

                        </div>

                    )

                }


            </td>





            {/* Category */}

            <td className="px-6 py-4">


                {

                    product.category_name ||

                    "-"

                }


            </td>





            {/* Price */}

            <td className="px-6 py-4">


                {product.selling_price} EGP


            </td>





            {/* Stock */}

            <td className="px-6 py-4">


                {product.stock ?? 0}


            </td>





            {/* Status */}

            <td className="px-6 py-4">


                {

                    product.is_active ?


                    (

                        <span className="
                        bg-green-100
                        text-green-700
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        ">

                            Active

                        </span>

                    )


                    :


                    (

                        <span className="
                        bg-red-100
                        text-red-700
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        ">

                            Disabled

                        </span>

                    )


                }


            </td>






            {/* Actions */}

            <td className="px-6 py-4">


                <div className="flex gap-2">


                    <button

                        className="
                        px-3
                        py-1
                        bg-blue-600
                        text-white
                        rounded-lg
                        text-sm
                        "

                    >

                        Edit

                    </button>





                    <button

                        className="
                        px-3
                        py-1
                        bg-red-600
                        text-white
                        rounded-lg
                        text-sm
                        "

                    >

                        Delete

                    </button>



                </div>


            </td>




        </tr>


    );


}