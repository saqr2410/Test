import { X } from "lucide-react";

import toast from "react-hot-toast";

import ProductForm from "./ProductForm";

import { createProduct } from "../../../services/products/productService";

export default function AddProductModal({

    open,

    onClose

}) {

    if (!open) return null;

    const handleSubmit = async (data) => {

        try {

            await createProduct(data);

            toast.success(

                "Product added successfully."

            );

            onClose();

        }

        catch (error) {

            console.error(error);

            toast.error(

                "Failed to add product."

            );

        }

    };

    return (

        <div
            className="
            fixed
            inset-0
            bg-black/40
            flex
            justify-center
            items-center
            z-50
            "
        >

            <div
                className="
                bg-white
                rounded-2xl
                shadow-xl
                w-full
                max-w-4xl
                "
            >

                {/* Header */}

                <div
                    className="
                    flex
                    justify-between
                    items-center
                    p-6
                    border-b
                    "
                >

                    <h2 className="text-2xl font-bold">

                        Add Product

                    </h2>

                    <button

                        onClick={onClose}

                        className="hover:text-red-500"

                    >

                        <X />

                    </button>

                </div>

                {/* Body */}

                <div className="p-6">

                    <ProductForm

                        onSubmit={handleSubmit}

                    />

                </div>

            </div>

        </div>

    );

}