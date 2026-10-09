import {
    useEffect,
    useState
} from "react";

import {
    Pill,
    HeartPulse,
    Baby,
    ShieldPlus,
    Syringe,
    Stethoscope,
    Package
} from "lucide-react";

import {
    Link
} from "react-router-dom";

import {
    getStoreCategories
} from "../../../services/products/productService";


// =========================================================
// Category Icons
// =========================================================

const CATEGORY_ICONS = {

    "الأدوية": Pill,

    "الفيتامينات": HeartPulse,

    "الأطفال": Baby,

    "العناية الشخصية": ShieldPlus,

    "المستلزمات الطبية": Syringe,

    "الأجهزة الطبية": Stethoscope

};


// =========================================================
// Category Card
// =========================================================

function CategoryCard({
    category
}) {

    const Icon =
        CATEGORY_ICONS[
        category.name
        ] || Package;


    return (

        <Link
            to={`/products?category=${category.id}`}
            className="
                group

                w-full
                sm:w-[calc(50%-12px)]
                md:w-[calc(33.333%-16px)]
                lg:w-[calc(25%-18px)]
                xl:w-[calc(16.666%-20px)]

                min-w-[160px]
                max-w-[210px]

                bg-white
                border
                border-gray-100
                rounded-3xl

                p-7

                text-center

                shadow-sm

                hover:bg-[#5B2A86]
                hover:border-[#5B2A86]
                hover:shadow-xl
                hover:-translate-y-1

                transition-all
                duration-300
                ease-out
            "
        >

            {/* Icon */}

            <div
                className="
                    flex
                    items-center
                    justify-center

                    w-16
                    h-16

                    mx-auto

                    rounded-2xl

                    bg-purple-50
                    text-[#5B2A86]

                    group-hover:bg-white/15
                    group-hover:text-white

                    transition-all
                    duration-300
                "
            >

                <Icon
                    size={34}
                    strokeWidth={1.8}
                    className="
                        transition-transform
                        duration-300

                        group-hover:scale-110
                    "
                />

            </div>


            {/* Category Name */}

            <h3
                className="
                    mt-5

                    text-base
                    font-bold

                    text-gray-800
                    group-hover:text-white

                    transition-colors
                    duration-300
                "
            >
                {category.name}
            </h3>

        </Link>

    );

}


// =========================================================
// Loading Card
// =========================================================

function CategorySkeleton() {

    return (

        <div
            className="
                w-full
                sm:w-[calc(50%-12px)]
                md:w-[calc(33.333%-16px)]
                lg:w-[calc(25%-18px)]
                xl:w-[calc(16.666%-20px)]

                min-w-[160px]
                max-w-[210px]

                h-[190px]

                bg-gray-100
                rounded-3xl

                animate-pulse
            "
        />

    );

}


// =========================================================
// Categories Section
// =========================================================

export default function CategoriesSection() {

    const [
        categories,
        setCategories
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    // =====================================================
    // Load Categories
    // =====================================================

    useEffect(() => {

        const loadCategories = async () => {

            try {

                const data =
                    await getStoreCategories();


                const items =
                    Array.isArray(data)
                        ? data
                        : data?.results || [];


                setCategories(items);

            } catch (error) {

                console.error(
                    "STORE CATEGORIES ERROR:",
                    error
                );

                setCategories([]);

            } finally {

                setLoading(false);

            }

        };


        loadCategories();

    }, []);


    // =====================================================
    // Empty State
    // =====================================================

    if (
        !loading &&
        categories.length === 0
    ) {

        return null;

    }


    return (

        <section
            className="
                py-20
                bg-white
            "
        >

            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-6
                "
            >

                {/* =================================================
                    Title
                ================================================= */}

                <h2
                    className="
                        text-3xl
                        md:text-4xl

                        font-black
                        text-center

                        text-[#5B2A86]
                    "
                >
                    الأقسام
                </h2>


                {/* =================================================
                    Categories
                ================================================= */}

                <div
                    className="
                        flex
                        flex-wrap
                        justify-center
                        items-stretch

                        gap-6

                        mt-14
                    "
                >

                    {loading

                        ? Array.from(
                            {
                                length: 6
                            }
                        ).map(
                            (_, index) => (

                                <CategorySkeleton
                                    key={index}
                                />

                            )
                        )

                        : categories.map(
                            category => (

                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                />

                            )
                        )

                    }

                </div>

            </div>

        </section>

    );

}