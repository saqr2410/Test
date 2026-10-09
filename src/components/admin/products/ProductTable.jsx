import ProductRow from "./ProductRow";

export default function ProductTable({
    products = [],
    onEdit,
    onSuccess
}) {
    return (
        <div
            className="
                bg-white
                rounded-2xl
                shadow
                border
                overflow-x-auto
            "
        >
            <table className="w-full">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-4">
                            الصورة
                        </th>

                        <th className="px-6 py-4">
                            الاسم
                        </th>

                        <th className="px-6 py-4">
                            التصنيف
                        </th>

                        <th className="px-6 py-4">
                            السعر
                        </th>

                        <th className="px-6 py-4">
                            المخزون
                        </th>

                        <th className="px-6 py-4">
                            الحالة
                        </th>

                        <th className="px-6 py-4">
                            الإجراءات
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductRow
                                key={product.id}
                                product={product}
                                onEdit={onEdit}
                                onSuccess={onSuccess}
                            />
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="7"
                                className="
                                    text-center
                                    py-10
                                    text-gray-500
                                "
                            >
                                لا توجد منتجات
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}