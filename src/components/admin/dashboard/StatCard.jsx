import {
    TrendingUp,
    ShoppingBag,
    Users,
    Package,
    DollarSign
} from "lucide-react";

const icons = {
    sales: TrendingUp,
    orders: ShoppingBag,
    customers: Users,
    products: Package,
    profit: DollarSign,
};

export default function StatCard({
    title,
    value,
    type,
    suffix = ""
}) {
    const Icon = icons[type] || Package;

    return (
        <div
            className="
                bg-white
                rounded-3xl
                shadow-sm
                border border-gray-100
                p-6
                hover:shadow-lg
                transition
            "
        >
            <div className="flex items-center justify-between">

                <div>
                    <p className="text-gray-500 text-sm font-semibold">
                        {title}
                    </p>

                    <h2
                        className="
                            text-3xl
                            font-black
                            mt-3
                            text-[#5B2A86]
                        "
                    >
                        {value ?? 0}
                    </h2>

                    {suffix && (
                        <span className="text-gray-400 text-sm">
                            {suffix}
                        </span>
                    )}
                </div>

                <div
                    className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-purple-50
                        text-[#5B2A86]
                        flex
                        items-center
                        justify-center
                    "
                >
                    <Icon size={26} />
                </div>

            </div>
        </div>
    );
}