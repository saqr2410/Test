import {
    HeartPulse,
    Activity,
    Weight,
    Ruler,
    Droplets,
    Pill
} from "lucide-react";

export default function HealthProfile() {

    return (

        <div className="max-w-7xl mx-auto px-6 py-10">

            <div className="mb-8">

                <h1 className="text-3xl font-black text-[#5B2A86]">
                    الملف الصحي
                </h1>

                <p className="text-gray-500 mt-2">
                    ساعدنا فى تقديم أفضل تجربة علاجية لك.
                </p>

            </div>

            <div className="grid lg:grid-cols-2 gap-6">

                <Card
                    icon={<Droplets />}
                    title="فصيلة الدم"
                    value="A+"
                />

                <Card
                    icon={<Weight />}
                    title="الوزن"
                    value="82 كجم"
                />

                <Card
                    icon={<Ruler />}
                    title="الطول"
                    value="178 سم"
                />

                <Card
                    icon={<Activity />}
                    title="الأمراض المزمنة"
                    value="لا يوجد"
                />

                <Card
                    icon={<HeartPulse />}
                    title="الحساسية"
                    value="لا يوجد"
                />

                <Card
                    icon={<Pill />}
                    title="الأدوية الحالية"
                    value="Vitamin D"
                />

            </div>

            <div className="bg-white rounded-3xl shadow-lg mt-8 p-8">

                <h2 className="text-xl font-bold text-[#5B2A86] mb-5">
                    معلومات إضافية
                </h2>

                <textarea

                    rows={6}

                    placeholder="اكتب أى معلومات صحية مهمة..."

                    className="
                        w-full
                        border
                        rounded-2xl
                        p-5
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#5B2A86]
                    "

                />

                <button

                    className="
                        mt-6
                        bg-[#5B2A86]
                        text-white
                        px-8
                        py-3
                        rounded-xl
                        font-bold
                        hover:bg-[#6C2EA8]
                        transition
                    "

                >

                    حفظ البيانات

                </button>

            </div>

        </div>

    );

}

function Card({

    icon,

    title,

    value

}) {

    return (

        <div className="bg-white rounded-3xl shadow-lg p-6">

            <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-[#5B2A86]">
                    {icon}
                </div>

                <div>

                    <p className="text-gray-500">
                        {title}
                    </p>

                    <h3 className="text-xl font-bold mt-1">
                        {value}
                    </h3>

                </div>

            </div>

        </div>

    );

}