import { useState } from "react";
import { UploadCloud, Sparkles, ArrowRight } from "lucide-react";

import {
    uploadPrescription,
    analyzePrescription,
} from "../../../services/prescriptions/prescriptionService";

export default function UploadPrescription() {

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleChange(e) {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedFile(file);
        setAnalysis(null);

        if (file.type.startsWith("image")) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    }

    async function handleAnalyze() {

        if (!selectedFile) {
            alert("اختر الروشتة أولاً");
            return;
        }

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("image", selectedFile);

            const prescription = await uploadPrescription(formData);

            const result = await analyzePrescription(
                prescription.id
            );

            console.log("ANALYZE RESULT =", result);

            setAnalysis(result);

            alert("تم تحليل الروشتة بنجاح");

        } catch (error) {

            console.error(error);

            alert("حدث خطأ أثناء تحليل الروشتة");

        } finally {

            setLoading(false);

        }
    }

    return (

        <div className="min-h-screen bg-[#F8F5FC] py-20">

            <div className="max-w-5xl mx-auto px-6">

                <div className="bg-white rounded-[35px] shadow-2xl overflow-hidden">

                    <div className="bg-[#5B2A86] text-white p-10">

                        <div className="flex items-center gap-3">

                            <Sparkles />

                            <span className="font-bold">
                                AI Prescription
                            </span>

                        </div>

                        <h1 className="text-5xl font-black mt-6">
                            رفع الروشتة الطبية
                        </h1>

                        <p className="mt-4 text-white/80 text-lg">
                            ارفع صورة الروشتة وسيقوم الذكاء الاصطناعي بتحليلها
                            واستخراج الأدوية تلقائياً.
                        </p>

                    </div>

                    <div className="p-10">

                        <label
                            className="
                                border-2
                                border-dashed
                                border-[#5B2A86]
                                rounded-3xl
                                p-12
                                flex
                                flex-col
                                items-center
                                justify-center
                                cursor-pointer
                                hover:bg-[#F8F5FC]
                                duration-300
                            "
                        >

                            <UploadCloud
                                size={60}
                                className="text-[#5B2A86]"
                            />

                            <h2 className="text-2xl font-black mt-6">
                                اختر صورة الروشتة
                            </h2>

                            <p className="text-gray-500 mt-2">
                                PDF - JPG - PNG
                            </p>

                            <input
                                hidden
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleChange}
                            />

                        </label>

                        {selectedFile && (

                            <div className="mt-8">

                                <h3 className="font-bold text-[#5B2A86]">
                                    الملف المختار
                                </h3>

                                <div className="mt-4 bg-gray-50 rounded-2xl p-6">

                                    <p className="font-semibold">
                                        {selectedFile.name}
                                    </p>

                                    <p className="text-gray-500 mt-2">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>

                                    {preview && (

                                        <img
                                            src={preview}
                                            alt=""
                                            className="mt-6 rounded-2xl max-h-96 mx-auto"
                                        />

                                    )}

                                </div>

                            </div>

                        )}

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="
                                mt-10
                                w-full
                                bg-[#5B2A86]
                                hover:bg-[#472064]
                                disabled:opacity-50
                                text-white
                                rounded-2xl
                                py-5
                                text-lg
                                font-bold
                                flex
                                items-center
                                justify-center
                                gap-3
                            "
                        >

                            {loading ? "جارى التحليل..." : "تحليل الروشتة"}

                            <ArrowRight size={20} />

                        </button>

                        {analysis && (

                            <div className="mt-10 border rounded-3xl p-8">

                                <h2 className="text-3xl font-black text-[#5B2A86] mb-6">
                                    نتيجة التحليل
                                </h2>

                                <div className="space-y-2 mb-6">

                                    <p>
                                        <b>الحالة:</b> {analysis.status}
                                    </p>

                                    <p>
                                        <b>تم التحليل:</b>{" "}
                                        {analysis.ai_completed ? "نعم" : "لا"}
                                    </p>

                                </div>

                                <h3 className="text-2xl font-bold mb-4">
                                    الأدوية المستخرجة
                                </h3>

                                {analysis.items?.length ? (

                                    analysis.items.map((item) => (

                                        <div
                                            key={item.id}
                                            className="border rounded-2xl p-5 mb-4"
                                        >

                                            <p><b>الاسم:</b> {item.raw_name}</p>

                                            <p><b>المنتج:</b> {item.product_name || "غير مطابق"}</p>

                                            <p><b>الجرعة:</b> {item.dosage}</p>

                                            <p><b>التكرار:</b> {item.frequency}</p>

                                            <p><b>المدة:</b> {item.duration}</p>

                                            <p><b>الكمية:</b> {item.quantity}</p>

                                            <p><b>نسبة التطابق:</b> {item.confidence}</p>

                                        </div>

                                    ))

                                ) : (

                                    <div className="text-red-600 font-bold">
                                        لم يتم استخراج أي أدوية من الروشتة.
                                    </div>

                                )}

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}