import { useEffect, useState } from "react";

import {
    getProducts
} from "../services/products/adminProductService";



export default function useAdminProducts() {


    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);



    useEffect(() => {


        loadProducts();


    }, []);




    const loadProducts = async () => {


        try {


            setLoading(true);



            const data = await getProducts();



            setProducts(data);



        }


        catch(error) {


            console.log(
                error
            );


        }


        finally {


            setLoading(false);


        }


    };




    return {


        products,

        loading,

        reload: loadProducts


    };


}