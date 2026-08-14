import { MapPin, Plus, Home, Building2 } from "lucide-react";

export default function Addresses() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-10">

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-[#5B2A86]">
                        العناوين
                    </h1>

                    <p className="text-gray-500 mt-2">
                        إدارة عناوين الشحن الخاصة بك.
                    </p>
                </div>

                <button
                    className="
                    flex items-center
                    gap-2
                    bg-[#5B2A86]
                    text-white
                    px-5
                    py-3
                    rounded-xl
                    hover:scale-105
                    transition
                    "
                >
                    <Plus size={18} />
                    إضافة عنوان
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                <div className="bg-white rounded-3xl shadow-lg p-6 border">

                    <div className="flex justify-between">

                        <div className="flex gap-3">

                            <div className="bg-purple-100 p-3 rounded-xl">
                                <Home className="text-[#5B2A86]" />
                            </div>

                            <div>
                                <h3 className="font-bold text-lg">
                                    المنزل
                                </h3>

                                <p className="text-gray-500 mt-2">
                                    القاهرة - مدينة نصر
                                    <br />
                                    شارع عباس العقاد
                                </p>
                            </div>

                        </div>

                        <span
                            className="
                            bg-green-100
                            text-green-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            h-fit
                            "
                        >
                            افتراضي
                        </span>

                    </div>

                    <div className="flex gap-3 mt-6">

                        <button
                            className="
                            flex-1
                            border
                            rounded-xl
                            py-2
                            hover:bg-gray-50
                            "
                        >
                            تعديل
                        </button>

                        <button
                            className="
                            flex-1
                            border
                            border-red-300
                            text-red-600
                            rounded-xl
                            py-2
                            hover:bg-red-50
                            "
                        >
                            حذف
                        </button>

                    </div>

                </div>

                <div className="bg-white rounded-3xl shadow-lg p-6 border">

                    <div className="flex gap-3">

                        <div className="bg-blue-100 p-3 rounded-xl">
                            <Building2 className="text-blue-600" />
                        </div>

                        <div>

                            <h3 className="font-bold text-lg">
                                العمل
                            </h3>

                            <p className="text-gray-500 mt-2">
                                الجيزة - المهندسين
                                <br />
                                شارع جامعة الدول
                            </p>

                        </div>

                    </div>

                    <div className="flex gap-3 mt-6">

                        <button
                            className="
                            flex-1
                            border
                            rounded-xl
                            py-2
                            hover:bg-gray-50
                            "
                        >
                            تعديل
                        </button>

                        <button
                            className="
                            flex-1
                            border
                            border-red-300
                            text-red-600
                            rounded-xl
                            py-2
                            hover:bg-red-50
                            "
                        >
                            حذف
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}