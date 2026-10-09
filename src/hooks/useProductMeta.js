import { useEffect, useState } from "react";

import {
    getCategories,
    getUnits
} from "../services/products/categoryService";


export default function useProductMeta() {

    const [categories, setCategories] = useState([]);

    const [units, setUnits] = useState([]);

    const [loading, setLoading] = useState(true);


    async function load() {

        try {

            setLoading(true);

            const [
                categoriesData,
                unitsData
            ] = await Promise.all([

                getCategories(),

                getUnits()

            ]);


            setCategories(categoriesData);

            setUnits(unitsData);

        }

        catch (error) {

            console.error(
                "Product Meta Error:",
                error
            );

        }

        finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        load();

    }, []);


    return {

        categories,

        units,

        loading,

        reload: load

    };

}