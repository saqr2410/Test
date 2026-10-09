import React from "react";

import {

    CheckCircle,

    XCircle,

    Pill,

    FileText

} from "lucide-react";

import {
    useCart
} from "../../../contexts/CartContext";

import toast from "react-hot-toast";

function PrescriptionResult({ prescription }) {

    const { addToCart } = useCart();

    if (!prescription) return null;

    const items = prescription.items || [];

    const review = prescription.review || {};

    const doctorNotes = review.doctor_notes
        ? review.doctor_notes.split("\n")
        : [];

    const addMatched = () => {

        let count = 0;

        items.forEach(item => {

            if (item.product) {

                addToCart(item.product);

                count++;

            }

        });

        toast.success(

            `${count} دواء تمت إضافتهم للسلة`

        );

    };

    return (

        <div className="mt-10 space-y-8">

            <div className="bg-white rounded-xl shadow p-6">

                <div className="flex items-center gap-3 mb-6">

                    <Pill size={30} />

                    <h2 className="text-2xl font-bold">

                        الأدوية المستخرجة

                    </h2>

                </div>

                <div className="space-y-5">

                    {

                        items.map(item => (

                            <div

                                key={item.id}

                                className="border rounded-xl p-5"

                            >

                                <div className="flex justify-between">

                                    <div>

                                        <h3 className="font-bold text-xl">

                                            {item.raw_name}

                                        </h3>

                                        {

                                            item.matched_name &&

                                            <p className="text-green-700">

                                                المنتج:

                                                {" "}

                                                {item.matched_name}

                                            </p>

                                        }

                                    </div>

                                    {

                                        item.is_matched

                                            ?

                                            <CheckCircle

                                                className="text-green-600"

                                            />

                                            :

                                            <XCircle

                                                className="text-red-600"

                                            />

                                    }

                                </div>

                                {

                                    item.dosage &&

                                    <p className="mt-3">

                                        الجرعة:

                                        {" "}

                                        {item.dosage}

                                    </p>

                                }

                                {

                                    item.frequency &&

                                    <p>

                                        الميعاد:

                                        {" "}

                                        {item.frequency}

                                    </p>

                                }

                                {

                                    item.duration &&

                                    <p>

                                        المدة:

                                        {" "}

                                        {item.duration}

                                    </p>

                                }

                                <div className="mt-3">

                                    نسبة الثقة

                                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">

                                        <div

                                            style={{

                                                width: `${item.confidence * 100}%`

                                            }}

                                            className="bg-green-600 h-3 rounded-full"

                                        />

                                    </div>

                                    <p className="text-sm mt-1">

                                        {(item.confidence * 100).toFixed(0)}%

                                    </p>

                                </div>

                                {

                                    item.product &&

                                    <button

                                        onClick={() => addToCart(item.product)}

                                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"

                                    >

                                        إضافة للسلة

                                    </button>

                                }

                            </div>

                        ))

                    }

                </div>

                <button

                    onClick={addMatched}

                    className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"

                >

                    إضافة جميع الأدوية للسلة

                </button>

            </div>

            <div className="bg-white rounded-xl shadow p-6">

                <div className="flex items-center gap-3 mb-5">

                    <FileText size={28} />

                    <h2 className="text-2xl font-bold">

                        تعليمات الطبيب

                    </h2>

                </div>

                {

                    doctorNotes.length === 0

                        ?

                        <p>

                            لا توجد تعليمات

                        </p>

                        :

                        <ul className="list-disc pr-5 space-y-2">

                            {

                                doctorNotes.map((note, index) => (

                                    <li key={index}>

                                        {note}

                                    </li>

                                ))

                            }

                        </ul>

                }

            </div>

        </div>

    );

}

export default PrescriptionResult;