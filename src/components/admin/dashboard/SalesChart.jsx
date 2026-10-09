import {
    BarChart3
} from "lucide-react";

export default function SalesChart({
    data = []
}) {

    return (

        <div
            className="
                bg-white
                rounded-3xl
                shadow-sm
                border border-gray-100
                p-6
            "
        >

            <div className="flex items-center gap-3 mb-6">

                <div
                    className="
                        w-11
                        h-11
                        rounded-xl
                        bg-purple-50
                        text-[#5B2A86]
                        flex
                        items-center
                        justify-center
                    "
                >
                    <BarChart3 size={21} />
                </div>

                <div>

                    <h2 className="text-xl font-black">
                        المبيعات
                    </h2>

                    <p className="text-sm text-gray-400">
                        نظرة عامة على المبيعات
                    </p>

                </div>

            </div>


            {data.length === 0 ? (

                <div
                    className="
                        h-[280px]
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-gray-400
                    "
                >

                    <BarChart3
                        size={50}
                        className="mb-4 text-gray-300"
                    />

                    <p>
                        لا توجد بيانات مبيعات كافية لعرض الرسم البياني
                    </p>

                </div>

            ) : (

                <div>
                    {/* هنرجع Recharts هنا لما نضيف sales_chart في Backend */}
                </div>

            )}

        </div>
    );
}