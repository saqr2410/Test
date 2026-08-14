import { UploadCloud, Sparkles, FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
export default function PrescriptionAISection() {

    return (

        <section
            id="prescriptions"
            className="py-24 bg-[#F8F5FC]"
        >

            <div className="max-w-7xl mx-auto px-6">

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left */}

                    <div>

                        <span
                            className="
                            inline-flex
                            items-center
                            gap-2
                            bg-[#5B2A86]
                            text-white
                            px-5
                            py-2
                            rounded-full
                            "
                        >

                            <Sparkles size={16}/>

                            AI Prescription

                        </span>

                        <h2
                            className="
                            text-5xl
                            font-black
                            text-[#5B2A86]
                            mt-8
                            "
                        >

                            ارفع الروشتة

                            <br/>
                            <span className="inline-block mt-3">

                                واترك الباقى علينا
                            </span>   
                        </h2>

                        <p
                            className="
                            text-gray-600
                            leading-9
                            mt-8
                            text-lg
                            "
                        >

                            يستخدم النظام الذكاء الاصطناعى
                            لقراءة الروشتة واستخراج أسماء
                            الأدوية والجرعات تلقائياً ثم
                            إضافتها مباشرة إلى السلة.

                        </p>

                        <Link
                            to="/prescriptions/upload"
                            className="
                            mt-10
                            bg-[#5B2A86]
                            hover:bg-[#472064]
                            text-white
                            rounded-2xl
                            px-8
                            py-4
                            font-bold
                            inline-flex
                            items-center
                            gap-3
                            duration-300
                            "
                        >
                            ابدأ الآن
                            <ArrowLeft size={18}/>
                        </Link>

                    </div>

                    {/* Right */}

                    <div>

                        <div

                            className="
                            bg-white
                            rounded-[35px]
                            p-10
                            shadow-2xl
                            border-2
                            border-dashed
                            border-[#5B2A86]
                            text-center
                            "

                        >

                            <div

                                className="
                                w-28
                                h-28
                                rounded-full
                                bg-[#F4EDFC]
                                flex
                                items-center
                                justify-center
                                mx-auto
                                "

                            >

                                <UploadCloud

                                    size={55}

                                    className="text-[#5B2A86]"

                                />

                            </div>

                            <h3

                                className="
                                text-3xl
                                font-black
                                text-[#5B2A86]
                                mt-8
                                "

                            >

                                اسحب الروشتة هنا

                            </h3>

                            <p

                                className="
                                text-gray-500
                                mt-4
                                "

                            >

                                أو اضغط لاختيار ملف

                            </p>

                            <Link
                                to="/prescriptions/upload"
                                className="
                                mt-8
                                inline-block
                                bg-[#5B2A86]
                                text-white
                                px-8
                                py-4
                                rounded-2xl
                                font-bold
                                "
                            >
                                اختيار ملف
                            </Link>

                            <div

                                className="
                                mt-10
                                grid
                                grid-cols-3
                                gap-4
                                "

                            >

                                <div
                                    className="
                                    bg-[#F8F5FC]
                                    rounded-2xl
                                    p-5
                                    "
                                >

                                    <FileText
                                        className="
                                        mx-auto
                                        text-[#5B2A86]
                                        "
                                    />

                                    <p
                                        className="
                                        mt-3
                                        text-sm
                                        "
                                    >

                                        PDF

                                    </p>

                                </div>

                                <div
                                    className="
                                    bg-[#F8F5FC]
                                    rounded-2xl
                                    p-5
                                    "
                                >

                                    <FileText
                                        className="
                                        mx-auto
                                        text-[#5B2A86]
                                        "
                                    />

                                    <p
                                        className="
                                        mt-3
                                        text-sm
                                        "
                                    >

                                        JPG

                                    </p>

                                </div>

                                <div
                                    className="
                                    bg-[#F8F5FC]
                                    rounded-2xl
                                    p-5
                                    "
                                >

                                    <Sparkles
                                        className="
                                        mx-auto
                                        text-[#5B2A86]
                                        "
                                    />

                                    <p
                                        className="
                                        mt-3
                                        text-sm
                                        "
                                    >

                                        AI

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}