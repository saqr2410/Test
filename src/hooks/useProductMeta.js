import { useEffect, useState } from "react";

import {

    getCategories,

    getUnits

} from "../services/products/categoryService";

export default function useProductMeta() {

    const [categories, setCategories] = useState([]);

    const [units, setUnits] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        load();

    }, []);

    async function load() {

        try {

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

        finally {

            setLoading(false);

        }

    }

    return {

        categories,

        units,

        loading

    };

}