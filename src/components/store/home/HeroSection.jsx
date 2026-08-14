import { Link } from "react-router-dom";

import {
    ArrowLeft,
    ShieldCheck,
    Truck,
    Sparkles,
    Upload,
    UserPlus
} from "lucide-react";

import ownerImage from "../../../assets/owner.jpeg";



export default function HeroSection() {


    return (


        <section

        className="
        relative
        overflow-hidden
        bg-gradient-to-br
        from-[#4B1D6D]
        via-[#6C2EA8]
        to-[#8B5CF6]
        "

        >



            <div className="absolute inset-0 opacity-10">


                <div

                className="
                absolute
                w-96
                h-96
                bg-white
                rounded-full
                -top-24
                -left-24
                blur-3xl
                "

                ></div>



                <div

                className="
                absolute
                w-[500px]
                h-[500px]
                bg-pink-300
                rounded-full
                -bottom-48
                -right-32
                blur-3xl
                "

                ></div>



            </div>






            <div

            className="
            relative
            max-w-7xl
            mx-auto
            px-6
            py-24
            "

            >




                <div

                className="
                grid
                lg:grid-cols-2
                gap-14
                items-center
                "

                >






                    {/* النص */}


                    <div className="text-white">



                        <span

                        className="
                        inline-flex
                        items-center
                        gap-2
                        bg-white/20
                        backdrop-blur
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        "

                        >


                            <Sparkles size={16}/>


                            صيدلية ذكية   


                        </span>






                        <h1

                        className="
                        mt-8
                        text-5xl
                        lg:text-7xl
                        font-black
                        leading-tight
                        "

                        >

                            صحتك...

                            <br/>

                            بين إيديك


                        </h1>







                        <p

                        className="
                        mt-8
                        text-lg
                        text-white/90
                        leading-9
                        max-w-xl
                        "

                        >

                            اطلب جميع الأدوية ومنتجات العناية الشخصية،
                            وارفع الروشتة وسيقوم الذكاء الاصطناعي بتحليلها
                            وإضافة الأدوية إلى السلة تلقائياً.


                        </p>









                        <div

                        className="
                        flex
                        flex-wrap
                        gap-5
                        mt-10
                        "

                        >





                            {/* المنتجات */}


                            <Link

                            to="/products"

                            className="
                            bg-white
                            text-[#5B2A86]
                            px-8
                            py-4
                            rounded-2xl
                            font-bold
                            flex
                            items-center
                            gap-2
                            hover:scale-105
                            duration-300
                            shadow-xl
                            "

                            >


                                تصفح المنتجات


                                <ArrowLeft size={18}/>


                            </Link>









                            {/* رفع الروشتة */}


                            <Link

                            to="/prescriptions/upload"

                            className="
                            border
                            border-white
                            text-white
                            px-8
                            py-4
                            rounded-2xl
                            flex
                            items-center
                            gap-2
                            hover:bg-white
                            hover:text-[#5B2A86]
                            duration-300
                            "

                            >


                                <Upload size={18}/>


                                رفع روشتة



                            </Link>









                            {/* إنشاء ملف صحي */}


                            <Link

                            to="/patients/create"

                            className="
                            border
                            border-white
                            text-white
                            px-8
                            py-4
                            rounded-2xl
                            flex
                            items-center
                            gap-2
                            hover:bg-white
                            hover:text-[#5B2A86]
                            duration-300
                            "

                            >


                                <UserPlus size={18}/>


                                إنشاء ملف صحي



                            </Link>







                        </div>









                        <div

                        className="
                        grid
                        grid-cols-3
                        gap-5
                        mt-14
                        "

                        >





                            <div

                            className="
                            bg-white/10
                            backdrop-blur
                            rounded-2xl
                            p-5
                            "

                            >

                                <Truck className="mb-3"/>


                                <h3 className="font-bold">

                                    توصيل سريع

                                </h3>


                            </div>








                            <div

                            className="
                            bg-white/10
                            backdrop-blur
                            rounded-2xl
                            p-5
                            "

                            >

                                <ShieldCheck className="mb-3"/>


                                <h3 className="font-bold">

                                    منتجات أصلية

                                </h3>


                                <p className="text-white/70 text-sm mt-2">

                                    100%

                                </p>


                            </div>








                            <div

                            className="
                            bg-white/10
                            backdrop-blur
                            rounded-2xl
                            p-5
                            "

                            >

                                <Sparkles className="mb-3"/>


                                <h3 className="font-bold">

                                    AI Pharmacy

                                </h3>


                                <p className="text-white/70 text-sm mt-2">

                                    قراءة الروشتة

                                </p>


                            </div>






                        </div>





                    </div>









                    {/* الصورة */}



                    {/* Doctor Card */}

                    <div className="relative">


                        <div
                            className="
                            bg-white/95
                            backdrop-blur-xl
                            rounded-[45px]
                            p-6
                            shadow-2xl
                            border
                            border-white/40
                            "
                        >


                            <div className="relative">


                                <img

                                    src={ownerImage}

                                    alt="Dr Ahmed Rashad"

                                    className="
                                    rounded-[35px]
                                    w-full
                                    h-[560px]
                                    object-cover
                                    object-center
                                    "

                                />



                                {/* Badge فوق الصورة */}

                                <div

                                    className="
                                    absolute
                                    top-6
                                    right-6
                                    bg-white
                                    rounded-2xl
                                    px-5
                                    py-3
                                    shadow-xl
                                    flex
                                    items-center
                                    gap-3
                                    "

                                >

                                    <div

                                        className="
                                        w-10
                                        h-10
                                        rounded-full
                                        bg-[#5B2A86]
                                        text-white
                                        flex
                                        items-center
                                        justify-center
                                        "
                                    >

                                        ✓

                                    </div>


                                    <div>

                                        <p className="
                                        font-black
                                        text-[#5B2A86]
                                        text-sm
                                        ">

                                            صيدلي معتمد

                                        </p>


                                        <span className="
                                        text-xs
                                        text-gray-500
                                        ">

                                            Rashed Smart Pharmacy

                                        </span>


                                    </div>


                                </div>



                            </div>






                            {/* بيانات الدكتور */}


                            <div className="mt-6">


                                <h2

                                className="
                                text-2xl
                                font-black
                                text-[#5B2A86]
                                "
                                >

                                    د. أحمد راشد

                                </h2>



                                <p

                                className="
                                text-gray-500
                                mt-2
                                "
                                >

                                    مؤسس Rashed Smart Pharmacy

                                </p>




                                <p

                                className="
                                text-gray-600
                                leading-7
                                mt-4
                                "
                                >

                                    نعمل على تقديم تجربة صيدلية
                                    ذكية تجمع بين الخبرة الطبية
                                    والتكنولوجيا الحديثة لخدمة المرضى.

                                </p>



                            </div>







                            {/* Stats */}


                            



                        </div>



                    </div>






                </div>





            </div>






        </section>


    );

}