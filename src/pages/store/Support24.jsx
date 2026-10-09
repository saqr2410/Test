import {
    Headphones,
    Phone,
    MessageCircle,
    Mail
} from "lucide-react";


const contactMethods = [
    {
        icon: Phone,
        title: "الهاتف",
        value: "",
        description: "تواصل معنا مباشرة"
    },
    {
        icon: MessageCircle,
        title: "WhatsApp",
        value: "",
        description: "راسلنا عبر WhatsApp"
    },
    {
        icon: Mail,
        title: "البريد الإلكتروني",
        value: "",
        description: "أرسل لنا رسالتك"
    }
];


export default function Support24() {

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

                        <Headphones
                            size={46}
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
                        خدمة 24/7
                    </h1>


                    <p
                        className="
                            mt-4

                            text-gray-500
                            leading-7
                        "
                    >
                        نحن هنا لمساعدتك
                        والإجابة عن استفساراتك.
                    </p>

                </div>


                {/* Contact Methods */}

                <div
                    className="
                        mt-14

                        flex
                        flex-wrap
                        justify-center

                        gap-6
                    "
                >

                    {contactMethods.map(
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
                                            size={27}
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

                                            min-h-[24px]
                                        "
                                    >
                                        {item.value}
                                    </p>


                                    <p
                                        className="
                                            mt-2

                                            text-sm

                                            text-gray-400
                                        "
                                    >
                                        {item.description}
                                    </p>

                                </div>

                            );

                        }
                    )}

                </div>


                {/* Availability */}

                <div
                    className="
                        mt-12

                        flex
                        justify-center
                    "
                >

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-3

                            px-6
                            py-3

                            rounded-full

                            bg-purple-50
                            text-[#5B2A86]

                            font-bold
                        "
                    >

                        <span
                            className="
                                w-2.5
                                h-2.5

                                rounded-full

                                bg-green-500
                            "
                        />

                        خدمة متاحة على مدار الساعة

                    </div>

                </div>

            </div>

        </section>

    );

}