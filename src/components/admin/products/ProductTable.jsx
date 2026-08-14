import ProductRow from "./ProductRow";


export default function ProductTable({

    products = []

}) {


    return (

        <div
            className="
            bg-white
            rounded-2xl
            shadow
            border
            overflow-hidden
            "
        >


            <table className="w-full">


                <thead className="bg-gray-100">


                    <tr>


                        <th className="px-6 py-4">
                            Image
                        </th>


                        <th className="px-6 py-4">
                            Name
                        </th>


                        <th className="px-6 py-4">
                            Category
                        </th>


                        <th className="px-6 py-4">
                            Price
                        </th>


                        <th className="px-6 py-4">
                            Stock
                        </th>


                        <th className="px-6 py-4">
                            Status
                        </th>


                        <th className="px-6 py-4">
                            Actions
                        </th>


                    </tr>


                </thead>





                <tbody>


                {


                    products.length > 0 ?


                    products.map(product => (


                        <ProductRow


                            key={product.id}


                            product={product}


                        />


                    ))



                    :


                    (


                        <tr>


                            <td

                                colSpan="7"

                                className="
                                text-center
                                py-10
                                text-gray-500
                                "

                            >

                                No products found


                            </td>


                        </tr>


                    )


                }



                </tbody>


            </table>


        </div>


    );

}