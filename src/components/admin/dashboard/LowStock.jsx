export default function LowStock({
    products=[]
}){


    return (


        <div

            className="
            bg-white
            rounded-2xl
            shadow
            p-6
            "

        >


            <h2

                className="
                text-xl
                font-bold
                mb-5
                "

            >

                Low Stock


            </h2>





            {

                products.map(product=>(


                    <div

                        key={product.id}

                        className="
                        flex
                        justify-between
                        border-b
                        py-3
                        "

                    >

                        <span>

                            {product.name}

                        </span>


                        <span

                            className="
                            text-red-600
                            font-bold
                            "

                        >

                            {product.stock}


                        </span>


                    </div>


                ))

            }



        </div>


    );

}