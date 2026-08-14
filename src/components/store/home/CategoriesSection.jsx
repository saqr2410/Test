import {
    Pill,
    HeartPulse,
    Baby,
    ShieldPlus,
    Syringe,
    Stethoscope
} from "lucide-react";

const categories = [

    {
        icon: Pill,
        title: "الأدوية"
    },

    {
        icon: HeartPulse,
        title: "الفيتامينات"
    },

    {
        icon: Baby,
        title: "الأطفال"
    },

    {
        icon: ShieldPlus,
        title: "العناية الشخصية"
    },

    {
        icon: Syringe,
        title: "المستلزمات الطبية"
    },

    {
        icon: Stethoscope,
        title: "الأجهزة الطبية"
    }

];

export default function CategoriesSection() {

    return (

        <section className="py-20 bg-white">

            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl font-black text-center text-[#5B2A86]">

                    الأقسام

                </h2>

                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mt-14">

                    {

                        categories.map((item, index) => {

                            const Icon = item.icon;

                            return (

                                <div

                                    key={index}

                                    className="
                                    bg-white
                                    border
                                    rounded-3xl
                                    p-8
                                    text-center
                                    hover:bg-[#5B2A86]
                                    hover:text-white
                                    duration-300
                                    cursor-pointer
                                    shadow-lg
                                    "

                                >

                                    <Icon
                                        size={42}
                                        className="mx-auto"
                                    />

                                    <h3 className="mt-5 font-bold">

                                        {item.title}

                                    </h3>

                                </div>

                            );

                        })

                    }

                </div>

            </div>

        </section>

    );

}