import {
    Phone,
    MessageCircle,
    BriefcaseMedical
} from "lucide-react";


// =========================================================
// Pharmacists
// =========================================================

const pharmacists = [
    {
        id: 1,
        name: "",
        specialty: "",
        experience: "",
        phone: "",
        image: ""
    },
    {
        id: 2,
        name: "",
        specialty: "",
        experience: "",
        phone: "",
        image: ""
    },
    {
        id: 3,
        name: "",
        specialty: "",
        experience: "",
        phone: "",
        image: ""
    },
    {
        id: 4,
        name: "",
        specialty: "",
        experience: "",
        phone: "",
        image: ""
    }
];


export default function Pharmacists() {

    return (

        <section className="min-h-screen bg-white py-20">

            <div className="max-w-7xl mx-auto px-6">

                {/* =================================================
                    Header
                ================================================= */}

                <div className="text-center mb-14">

                    <h1
                        className="
                            text-3xl
                            md:text-4xl
                            font-black
                            text-[#5B2A86]
                        "
                    >
                        صيادلة متخصصون
                    </h1>

                </div>


                {/* =================================================
                    Pharmacists
                ================================================= */}

                <div
                    className="
                        flex
                        flex-wrap
                        justify-center
                        gap-8
                    "
                >

                    {pharmacists.map(
                        pharmacist => (

                            <div
                                key={pharmacist.id}
                                className="
                                    w-full
                                    sm:w-[calc(50%-16px)]
                                    lg:w-[calc(25%-24px)]

                                    max-w-[280px]

                                    bg-white
                                    border
                                    border-gray-100
                                    rounded-3xl

                                    overflow-hidden

                                    shadow-sm
                                    hover:shadow-xl
                                    hover:-translate-y-1

                                    transition-all
                                    duration-300
                                "
                            >

                                {/* =================================================
                                    Image
                                ================================================= */}

                                <div
                                    className="
                                        h-64
                                        bg-gray-100

                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    {pharmacist.image ? (

                                        <img
                                            src={pharmacist.image}
                                            alt={pharmacist.name}
                                            className="
                                                w-full
                                                h-full
                                                object-cover
                                            "
                                        />

                                    ) : (

                                        <BriefcaseMedical
                                            size={64}
                                            strokeWidth={1.5}
                                            className="
                                                text-gray-300
                                            "
                                        />

                                    )}

                                </div>


                                {/* =================================================
                                    Information
                                ================================================= */}

                                <div className="p-6">

                                    <h2
                                        className="
                                            text-lg
                                            font-bold
                                            text-gray-800
                                            text-center
                                            min-h-[28px]
                                        "
                                    >
                                        {pharmacist.name}
                                    </h2>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            text-gray-500
                                            text-center
                                            min-h-[20px]
                                        "
                                    >
                                        {pharmacist.specialty}
                                    </p>


                                    <p
                                        className="
                                            mt-2
                                            text-sm
                                            text-gray-500
                                            text-center
                                            min-h-[20px]
                                        "
                                    >
                                        {pharmacist.experience}
                                    </p>


                                    {/* =================================================
                                        Contact
                                    ================================================= */}

                                    <div className="mt-6 flex gap-3">

                                        <button
                                            type="button"
                                            disabled={!pharmacist.phone}
                                            className="
                                                flex-1

                                                h-11

                                                rounded-xl

                                                flex
                                                items-center
                                                justify-center
                                                gap-2

                                                bg-[#5B2A86]
                                                text-white

                                                font-bold
                                                text-sm

                                                disabled:opacity-40
                                                disabled:cursor-not-allowed

                                                hover:bg-[#4A216D]

                                                transition-colors
                                            "
                                        >

                                            <Phone size={17} />

                                            تواصل

                                        </button>


                                        <button
                                            type="button"
                                            disabled={!pharmacist.phone}
                                            className="
                                                w-11
                                                h-11

                                                rounded-xl

                                                flex
                                                items-center
                                                justify-center

                                                border
                                                border-[#5B2A86]

                                                text-[#5B2A86]

                                                disabled:opacity-40
                                                disabled:cursor-not-allowed

                                                hover:bg-[#5B2A86]
                                                hover:text-white

                                                transition-colors
                                            "
                                        >

                                            <MessageCircle
                                                size={18}
                                            />

                                        </button>

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>

            </div>

        </section>

    );

}