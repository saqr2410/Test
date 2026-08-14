import { useState } from "react";
import PageHeader from "../../../components/ui/layout/PageHeader";
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";
import Card from "../../../components/ui/cards/Card";
import SearchBox from "../../../components/ui/forms/SearchBox";

import ProductTable from "../../../components/admin/products/ProductTable";
import AddProductModal from "../../../components/admin/products/AddProductModal";
import useAdminProducts from "../../../hooks/useAdminProducts";


export default function ProductsPage() {

    const [search, setSearch] = useState("");
    const [openAddModal, setOpenAddModal] = useState(false);

    const {
        products,
        loading
    } = useAdminProducts();

    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <div className="space-y-6">

            <PageHeader
                title="Products"
                subtitle="Manage all pharmacy products"
                action={
                    <PrimaryButton
                        onClick={() => setOpenAddModal(true)}
                    >
                        + Add Product
                    </PrimaryButton>
                }
            />

            <Card>

                <SearchBox
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search product..."
                />

            </Card>

            {
                loading ? (

                    <div className="text-center py-10">
                        Loading products...
                    </div>

                ) : (

                    <ProductTable
                        products={filteredProducts}
                    />

                )
            }

            <AddProductModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
            />

        </div>

    );

}