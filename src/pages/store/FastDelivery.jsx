import {
    Truck
} from "lucide-react";


export default function FastDelivery() {

    return (

        <section
            className="
                min-h-screen
                bg-white
                flex
                items-center
                justify-center
                px-6
                py-20
            "
        >

            <div
                className="
                    w-full
                    max-w-xl
                    text-center
                "
            >

                {/* =================================================
                    Icon
                ================================================= */}

                <div
                    className="
                        w-24
                        h-24

                        mx-auto

                        rounded-full

                        bg-purple-50
                        text-[#5B2A86]

                        flex
                        items-center
                        justify-center
                    "
                >

                    <Truck
                        size={46}
                        strokeWidth={1.7}
                    />

                </div>


                {/* =================================================
                    Title
                ================================================= */}

                <h1
                    className="
                        mt-8

                        text-3xl
                        md:text-4xl

                        font-black

                        text-[#5B2A86]
                    "
                >
                    توصيل سريع
                </h1>


                {/* =================================================
                    Coming Soon
                ================================================= */}

                <div
                    className="
                        mt-6

                        inline-flex
                        items-center

                        px-6
                        py-3

                        rounded-full

                        bg-[#5B2A86]
                        text-white

                        text-lg
                        font-bold
                    "
                >
                    قريبًا
                </div>

            </div>

        </section>

    );

}