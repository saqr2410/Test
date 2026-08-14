import {
    Link
} from "react-router-dom";


import {
    HeartPulse,
    Dumbbell,
    Activity,
    UserPlus
} from "lucide-react";


import { useAuth } from "../../../contexts/AuthContext";





export default function PatientRegisterSection(){



    const {
        user
    } = useAuth();





    const link = user

        ?

        "/patients/create"

        :

        "/login";







    return (


        <section

        id="patient-register"

        dir="rtl"

        className="
        py-20
        bg-gradient-to-br
        from-purple-50
        to-white
        "

        >





            <div

            className="
            max-w-6xl
            mx-auto
            px-6
            "

            >






                <div

                className="
                bg-white
                rounded-3xl
                shadow-xl
                p-10
                grid
                md:grid-cols-2
                gap-10
                items-center
                "

                >







                    <div>


                        <h2

                        className="
                        text-4xl
                        font-black
                        text-[#5B2A86]
                        mb-5
                        "

                        >

                            ملفك الصحي مع صيدلية راشد الذكية


                        </h2>







                        <p

                        className="
                        text-gray-600
                        text-lg
                        leading-8
                        "

                        >

                            سواء كنت مريض مزمن،
                            أو تهتم باللياقة والجيم،
                            أو تريد متابعة صحتك بشكل مستمر،
                            قم بإنشاء ملفك الصحي معنا
                            وسنساعدك في متابعة أدويتك وحالتك الصحية.


                        </p>









                        <Link


                        to={link}


                        className="
                        inline-flex
                        items-center
                        gap-2
                        mt-8
                        bg-[#5B2A86]
                        text-white
                        px-8
                        py-4
                        rounded-full
                        font-black
                        hover:scale-105
                        transition
                        "

                        >


                            <UserPlus size={20}/>


                            إنشاء ملف صحي


                        </Link>




                    </div>












                    <div

                    className="
                    grid
                    grid-cols-3
                    gap-4
                    "

                    >








                        <Card

                        icon={<HeartPulse/>}

                        title="مرضى مزمنين"

                        />






                        <Card

                        icon={<Dumbbell/>}

                        title="جيم ولياقة"

                        />








                        <Card

                        icon={<Activity/>}

                        title="صحة عامة"

                        />








                    </div>








                </div>









            </div>







        </section>


    );









}













function Card({

    icon,

    title

}){



    return (



        <div

        className="
        bg-purple-50
        rounded-2xl
        p-5
        text-center
        "

        >




            <div

            className="
            flex
            justify-center
            text-[#5B2A86]
            mb-3
            "

            >

                {icon}

            </div>







            <p

            className="
            font-bold
            text-sm
            "

            >

                {title}


            </p>







        </div>



    );


}