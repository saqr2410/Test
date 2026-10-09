import { useEffect, useMemo, useState } from "react";

import Card from "../../ui/cards/Card";
import SearchBox from "../../ui/forms/SearchBox";
import Loading from "../../ui/feedback/Loading";
import EmptyState from "../../ui/feedback/EmptyState";

import {
    getStockMovements
} from "../../../services/inventory/inventoryService";


const movementLabels = {
    PURCHASE: "شراء",
    SALE: "بيع",
    RETURN_SALE: "مرتجع بيع",
    RETURN_PURCHASE: "مرتجع شراء",
    DAMAGE: "تالف",
    EXPIRED: "منتهي",
    ADJUSTMENT: "تسوية",
};

const movementColors = {
    PURCHASE: "bg-green-100 text-green-700",
    SALE: "bg-blue-100 text-blue-700",
    RETURN_SALE: "bg-purple-100 text-purple-700",
    RETURN_PURCHASE: "bg-orange-100 text-orange-700",
    DAMAGE: "bg-red-100 text-red-700",
    EXPIRED: "bg-gray-100 text-gray-700",
    ADJUSTMENT: "bg-yellow-100 text-yellow-700",
};


export default function StockMovements() {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const loadMovements = async () => {
        try {
            setLoading(true);
            const data = await getStockMovements();
            setMovements(
                Array.isArray(data)
                    ? data
                    : data?.results || []
            );
        } catch (error) {
            console.error(
                "STOCK MOVEMENTS ERROR:",
                error
            );
            setMovements([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMovements();
    }, []);

    const filteredMovements = useMemo(() => {
        const query = search.toLowerCase();
        return movements.filter((movement) => {
            const productName =
                movement.product_name
                    ?.toLowerCase() || "";
            const batchNumber =
                movement.batch_number
                    ?.toLowerCase() || "";
            const username =
                movement.created_by_username
                    ?.toLowerCase() || "";
            return (
                productName.includes(query) ||
                batchNumber.includes(query) ||
                username.includes(query)
            );
        });
    }, [movements, search]);

    if (loading) {
        return <Loading />;
    }

    return (
        <Card>
            <div className="p-5 space-y-5">
                <div className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    flex-wrap
                ">
                    <div>
                        <h2 className="
                            text-xl
                            font-black
                        ">
                            حركات المخزون
                        </h2>
                        <p className="
                            text-sm
                            text-gray-500
                            mt-1
                        ">
                            سجل عمليات دخول وخروج المخزون
                        </p>
                    </div>

                    <SearchBox
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="بحث..."
                    />
                </div>

                {filteredMovements.length === 0 ? (
                    <EmptyState
                        title="لا توجد حركات"
                        description="لا توجد حركات مخزون مطابقة للبحث."
                    />
                ) : (
                    <div className="
                        overflow-x-auto
                    ">
                        <table className="
                            w-full
                            text-right
                        ">
                            <thead>
                                <tr className="
                                    border-b
                                    bg-gray-50
                                ">
                                    <th className="p-4">
                                        المنتج
                                    </th>
                                    <th className="p-4">
                                        الباتش
                                    </th>
                                    <th className="p-4">
                                        الكمية
                                    </th>
                                    <th className="p-4">
                                        النوع
                                    </th>
                                    <th className="p-4">
                                        المستخدم
                                    </th>
                                    <th className="p-4">
                                        التاريخ
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredMovements.map(
                                    (movement) => (
                                        <tr
                                            key={movement.id}
                                            className="
                                                border-b
                                                hover:bg-gray-50
                                            "
                                        >
                                            <td className="
                                                p-4
                                                font-bold
                                            ">
                                                {
                                                    movement.product_name
                                                }
                                            </td>

                                            <td className="p-4">
                                                {
                                                    movement.batch_number ||
                                                    "-"
                                                }
                                            </td>

                                            <td className="
                                                p-4
                                                font-bold
                                            ">
                                                {
                                                    movement.quantity
                                                }
                                            </td>

                                            <td className="p-4">
                                                <span className={`
                                                    inline-flex
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    text-sm
                                                    font-bold
                                                    ${movementColors[movement.movement_type] || "bg-gray-100 text-gray-700"}
                                                `}>
                                                    {
                                                        movementLabels[
                                                        movement.movement_type
                                                        ] ||
                                                        movement.movement_type
                                                    }
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                {
                                                    movement.created_by_username ||
                                                    "-"
                                                }
                                            </td>

                                            <td className="p-4">
                                                {
                                                    movement.created_at
                                                        ? new Date(
                                                            movement.created_at
                                                        ).toLocaleString(
                                                            "ar-EG"
                                                        )
                                                        : "-"
                                                }
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Card>
    );
}