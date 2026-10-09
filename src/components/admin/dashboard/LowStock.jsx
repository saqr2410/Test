import {
    AlertTriangle,
    Package
} from "lucide-react";

export default function LowStock({
    products = []
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
                        bg-red-50
                        text-red-500
                        flex
                        items-center
                        justify-center
                    "
                >
                    <AlertTriangle size={21} />
                </div>

                <div>

                    <h2 className="text-xl font-black">
                        المخزون المنخفض
                    </h2>

                    <p className="text-sm text-gray-400">
                        المنتجات التي تحتاج إلى إعادة تخزين
                    </p>

                </div>

            </div>


            {products.length === 0 ? (

                <div
                    className="
                        py-10
                        text-center
                        text-gray-400
                    "
                >
                    المخزون جيد حاليًا
                </div>

            ) : (

                <div className="space-y-3">

                    {products.map((product) => (

                        <div
                            key={product.id}
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                border
                                border-gray-100
                                rounded-2xl
                                p-4
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        w-10
                                        h-10
                                        rounded-xl
                                        bg-gray-100
                                        flex
                                        items-center
                                        justify-center
                                        text-gray-500
                                    "
                                >
                                    <Package size={19} />
                                </div>

                                <span className="font-bold">
                                    {product.product_name}
                                </span>

                            </div>


                            <div className="text-left">

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        px-3
                                        py-1
                                        rounded-full
                                        bg-red-100
                                        text-red-600
                                        text-xs
                                        font-black
                                    "
                                >
                                    {product.available_quantity}
                                </span>

                                <p className="text-[11px] text-gray-400 mt-1">
                                    متاح
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}