import {
    Truck,
    Shield,
    Clock3,
    BadgeCheck
} from "lucide-react";

import {
    Link
} from "react-router-dom";


// =========================================================
// Why Us Data
// =========================================================

const data = [

    {
        icon: Truck,
        title: "توصيل سريع",
        desc: "حتى باب المنزل",
        path: "/fast-delivery"
    },

    {
        icon: Shield,
        title: "منتجات أصلية",
        desc: "معتمدة 100%",
        path: "/authentic-products"
    },

    {
        icon: Clock3,
        title: "24/7",
        desc: "خدمة طوال اليوم",
        path: "/support"
    },

    {
        icon: BadgeCheck,
        title: "صيادلة متخصصون",
        desc: "استشارات مجانية",
        path: "/pharmacists"
    }

];


// =========================================================
// Why Us Section
// =========================================================

export default function WhyUsSection() {

    return (

        <section
            className="
                py-24
                bg-[#F8F5FC]
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
                    Section Title
                ================================================= */}

                <h2
                    className="
                        text-center

                        text-3xl
                        md:text-4xl

                        font-black

                        text-[#5B2A86]
                    "
                >
                    لماذا نحن؟
                </h2>


                {/* =================================================
                    Cards
                ================================================= */}

                <div
                    className="
                        flex
                        flex-wrap
                        justify-center
                        gap-8

                        mt-16
                    "
                >

                    {data.map(
                        (item, index) => {

                            const Icon =
                                item.icon;


                            return (

                                <Link
                                    key={index}
                                    to={item.path}
                                    className="
                                        group

                                        w-full
                                        sm:w-[calc(50%-16px)]
                                        lg:w-[calc(25%-24px)]

                                        max-w-[300px]

                                        bg-white

                                        rounded-3xl

                                        shadow-lg

                                        p-8

                                        text-center

                                        border
                                        border-transparent

                                        hover:border-[#5B2A86]

                                        hover:-translate-y-2

                                        hover:shadow-xl

                                        transition-all
                                        duration-300
                                    "
                                >

                                    {/* =================================================
                                        Icon
                                    ================================================= */}

                                    <div
                                        className="
                                            w-20
                                            h-20

                                            rounded-full

                                            bg-[#5B2A86]
                                            text-white

                                            flex
                                            items-center
                                            justify-center

                                            mx-auto

                                            transition-all
                                            duration-300

                                            group-hover:scale-110
                                            group-hover:shadow-lg
                                        "
                                    >

                                        <Icon
                                            size={35}
                                            strokeWidth={1.8}
                                        />

                                    </div>


                                    {/* =================================================
                                        Title
                                    ================================================= */}

                                    <h3
                                        className="
                                            font-bold
                                            text-xl

                                            mt-6

                                            text-gray-800

                                            group-hover:text-[#5B2A86]

                                            transition-colors
                                            duration-300
                                        "
                                    >
                                        {item.title}
                                    </h3>


                                    {/* =================================================
                                        Description
                                    ================================================= */}

                                    <p
                                        className="
                                            text-gray-500

                                            mt-3

                                            leading-6
                                        "
                                    >
                                        {item.desc}
                                    </p>


                                    {/* =================================================
                                        Click Indicator
                                    ================================================= */}

                                    <div
                                        className="
                                            mt-5

                                            text-sm
                                            font-bold

                                            text-[#5B2A86]

                                            opacity-0

                                            translate-y-1

                                            group-hover:opacity-100
                                            group-hover:translate-y-0

                                            transition-all
                                            duration-300
                                        "
                                    >
                                        اكتشف المزيد ←
                                    </div>

                                </Link>

                            );

                        }
                    )}

                </div>

            </div>

        </section>

    );

}