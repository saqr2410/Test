import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Favorites() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-10">

            <div className="mb-8">
                <h1 className="text-3xl font-black text-[#5B2A86]">
                    المنتجات المفضلة
                </h1>

                <p className="text-gray-500 mt-2">
                    احفظ المنتجات التى تشتريها باستمرار للوصول إليها بسرعة.
                </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-14 text-center">

                <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                    <Heart
                        size={45}
                        className="text-red-500"
                    />
                </div>

                <h2 className="text-2xl font-bold mt-6">
                    لا توجد منتجات مفضلة
                </h2>

                <p className="text-gray-500 mt-3">
                    أضف المنتجات التى تعجبك لتظهر هنا.
                </p>

                <Link
                    to="/products"
                    className="
                        inline-flex
                        mt-8
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
                    تصفح المنتجات
                </Link>

            </div>

        </div>
    );
}