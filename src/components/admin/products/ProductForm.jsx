
import { useState } from "react";

import PrimaryButton from "../../ui/buttons/PrimaryButton";

import useProductMeta from "../../../hooks/useProductMeta";

export default function ProductForm({

    initialData = {},

    onSubmit

}) {

    const {

        categories,

        units,

        loading

    } = useProductMeta();

    const [form, setForm] = useState({

        name: initialData.name || "",

        scientific_name: initialData.scientific_name || "",

        barcode: initialData.barcode || "",

        category: initialData.category || "",

        product_type: initialData.product_type || "OTC",

        unit: initialData.unit || "",

        manufacturer: initialData.manufacturer || "",

        description: initialData.description || "",

        selling_price: initialData.selling_price || "",

        reorder_level: initialData.reorder_level || 10,

    });

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(form);

    };

    if (loading) {

        return (

            <div className="text-center py-10">

                Loading...

            </div>

        );

    }

    return (

        <form

            onSubmit={handleSubmit}

            className="space-y-6"

        >

            <div className="grid md:grid-cols-2 gap-5">

                <div>

                    <label className="font-medium">

                        Product Name

                    </label>

                    <input

                        className="w-full border rounded-lg p-3 mt-1"

                        name="name"

                        value={form.name}

                        onChange={handleChange}

                    />

                </div>

                <div>

                    <label className="font-medium">

                        Scientific Name

                    </label>

                    <input

                        className="w-full border rounded-lg p-3 mt-1"

                        name="scientific_name"

                        value={form.scientific_name}

                        onChange={handleChange}

                    />

                </div>

                <div>

                    <label className="font-medium">

                        Barcode

                    </label>

                    <input

                        className="w-full border rounded-lg p-3 mt-1"

                        name="barcode"

                        value={form.barcode}

                        onChange={handleChange}

                    />

                </div>

                <div>

                    <label className="font-medium">

                        Category

                    </label>

                    <select

                        className="w-full border rounded-lg p-3 mt-1"

                        name="category"

                        value={form.category}

                        onChange={handleChange}

                    >

                        <option value="">

                            Select Category

                        </option>

                        {

                            categories.map(category => (

                                <option

                                    key={category.id}

                                    value={category.id}

                                >

                                    {category.name}

                                </option>

                            ))

                        }

                    </select>

                </div>

                <div>

                    <label className="font-medium">

                        Unit

                    </label>

                    <select

                        className="w-full border rounded-lg p-3 mt-1"

                        name="unit"

                        value={form.unit}

                        onChange={handleChange}

                    >

                        <option value="">

                            Select Unit

                        </option>

                        {

                            units.map(unit => (

                                <option

                                    key={unit.id}

                                    value={unit.id}

                                >

                                    {unit.name}

                                </option>

                            ))

                        }

                    </select>

                </div>

                <div>

                    <label className="font-medium">

                        Manufacturer

                    </label>

                    <input

                        className="w-full border rounded-lg p-3 mt-1"

                        name="manufacturer"

                        value={form.manufacturer}

                        onChange={handleChange}

                    />

                </div>

                <div>

                    <label className="font-medium">

                        Product Type

                    </label>

                    <select

                        className="w-full border rounded-lg p-3 mt-1"

                        name="product_type"

                        value={form.product_type}

                        onChange={handleChange}

                    >

                        <option value="RX">

                            Prescription

                        </option>

                        <option value="OTC">

                            OTC

                        </option>

                        <option value="SUPPLEMENT">

                            Supplement

                        </option>

                        <option value="COSMETIC">

                            Cosmetic

                        </option>

                        <option value="PERSONAL">

                            Personal Care

                        </option>

                    </select>

                </div>

                <div>

                    <label className="font-medium">

                        Selling Price

                    </label>

                    <input

                        type="number"

                        className="w-full border rounded-lg p-3 mt-1"

                        name="selling_price"

                        value={form.selling_price}

                        onChange={handleChange}

                    />

                </div>

                <div>

                    <label className="font-medium">

                        Reorder Level

                    </label>

                    <input

                        type="number"

                        className="w-full border rounded-lg p-3 mt-1"

                        name="reorder_level"

                        value={form.reorder_level}

                        onChange={handleChange}

                    />

                </div>

            </div>

            <div>

                <label className="font-medium">

                    Description

                </label>

                <textarea

                    rows={4}

                    className="w-full border rounded-lg p-3 mt-1"

                    name="description"

                    value={form.description}

                    onChange={handleChange}

                />

            </div>

            <div className="flex justify-end">

                <PrimaryButton>

                    Save Product

                </PrimaryButton>

            </div>

        </form>

    );

}

