import {
    BadgeCheck,
    ShieldCheck,
    PackageCheck,
    CircleCheck
} from "lucide-react";


const features = [
    {
        icon: BadgeCheck,
        title: "منتجات أصلية",
        description: "جميع المنتجات أصلية وموثوقة."
    },
    {
        icon: ShieldCheck,
        title: "مصادر موثوقة",
        description: "نحرص على التعامل مع مصادر موثوقة."
    },
    {
        icon: PackageCheck,
        title: "جودة مضمونة",
        description: "نهتم بجودة المنتجات وسلامتها."
    }
];


export default function AuthenticProducts() {

    return (

        <section
            className="
                min-h-screen
                bg-white
                py-20
            "
        >

            <div
                className="
                    max-w-5xl
                    mx-auto
                    px-6
                "
            >

                {/* Header */}

                <div className="text-center">

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

                        <BadgeCheck
                            size={48}
                            strokeWidth={1.7}
                        />

                    </div>


                    <h1
                        className="
                            mt-8

                            text-3xl
                            md:text-4xl

                            font-black

                            text-[#5B2A86]
                        "
                    >
                        منتجات أصلية
                    </h1>


                    <p
                        className="
                            mt-4
                            max-w-xl
                            mx-auto

                            text-gray-500
                            leading-7
                        "
                    >
                        نهتم بتوفير منتجات موثوقة
                        بجودة عالية لضمان تجربة
                        آمنة وموثوقة.
                    </p>

                </div>


                {/* Features */}

                <div
                    className="
                        mt-14

                        flex
                        flex-wrap
                        justify-center

                        gap-6
                    "
                >

                    {features.map(
                        (item, index) => {

                            const Icon =
                                item.icon;


                            return (

                                <div
                                    key={index}
                                    className="
                                        w-full
                                        md:w-[calc(33.333%-16px)]

                                        max-w-sm

                                        bg-white
                                        border
                                        border-gray-100

                                        rounded-3xl

                                        p-7

                                        text-center

                                        shadow-sm
                                    "
                                >

                                    <div
                                        className="
                                            w-14
                                            h-14

                                            mx-auto

                                            rounded-2xl

                                            bg-purple-50
                                            text-[#5B2A86]

                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >

                                        <Icon
                                            size={28}
                                            strokeWidth={1.8}
                                        />

                                    </div>


                                    <h2
                                        className="
                                            mt-5

                                            text-lg
                                            font-bold
                                            text-gray-800
                                        "
                                    >
                                        {item.title}
                                    </h2>


                                    <p
                                        className="
                                            mt-2

                                            text-sm
                                            text-gray-500

                                            leading-6
                                        "
                                    >
                                        {item.description}
                                    </p>

                                </div>

                            );

                        }
                    )}

                </div>


                {/* Trust Note */}

                <div
                    className="
                        mt-10

                        flex
                        items-center
                        justify-center
                        gap-2

                        text-sm
                        font-medium

                        text-gray-500
                    "
                >

                    <CircleCheck
                        size={18}
                        className="text-[#5B2A86]"
                    />

                    جودة وثقة في كل منتج

                </div>

            </div>

        </section>

    );

}