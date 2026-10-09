import {
    useEffect,
    useState
} from "react";

import {
    getProducts
} from "../services/products/adminProductService";


export default function useAdminProducts() {


    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);



    const loadProducts = async () => {

        try {

            setLoading(true);

            const data = await getProducts();

            setProducts(data);

        } catch (error) {

            console.error(
                "Load Products Error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };



    useEffect(() => {

        loadProducts();

    }, []);



    return {

        products,

        loading,

        reload: loadProducts

    };

}