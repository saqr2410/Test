import React, {
    useState,
} from "react";

import toast from "react-hot-toast";

import {
    uploadPrescription,
} from "../../../services/prescriptions/prescriptionService";

import {
    useNavigate,
} from "react-router-dom";

import {
    useAuth,
} from "../../../contexts/AuthContext";


function UploadPrescription({

    patient,

    onFinished,

}) {

    const [
        image,
        setImage,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(false);


    const navigate = useNavigate();

    const {
        user,
        loading: authLoading,
    } = useAuth();


    const submit = async () => {

        if (authLoading) {
            return;
        }


        if (!user) {

            toast.error(
                "يجب تسجيل الدخول أولاً"
            );

            navigate("/login");

            return;
        }


        if (!image) {

            toast.error(
                "اختر صورة الروشتة أولاً"
            );

            return;
        }


        try {

            setLoading(true);


            const form = new FormData();


            if (patient) {

                form.append(
                    "patient",
                    patient
                );

            }


            form.append(
                "image",
                image
            );


            /*
             * Upload + Gemini Analysis
             * يتم في Request واحد
             */
            const result =
                await uploadPrescription(
                    form
                );


            toast.success(
                "تم تحليل الروشتة بنجاح"
            );


            if (onFinished) {

                onFinished(result);

            }


        } catch (error) {

            console.error(
                "Prescription Error:",
                error
            );


            if (
                error.response?.status === 401
            ) {

                toast.error(
                    "يجب تسجيل الدخول أولاً"
                );

                navigate("/login");

                return;
            }


            const message =
                error.response?.data?.detail;


            toast.error(
                message ||
                "حدث خطأ أثناء تحليل الروشتة"
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-2xl font-bold mb-5">

                رفع الروشتة

            </h2>


            <input

                type="file"

                accept="image/*"

                disabled={loading}

                onChange={(event) => {

                    const selectedFile =
                        event.target.files?.[0];

                    setImage(
                        selectedFile || null
                    );

                }}

                className="mb-5"

            />


            {
                image && (

                    <p className="text-sm text-gray-600 mb-4">

                        تم اختيار:

                        {" "}

                        {image.name}

                    </p>

                )
            }


            <button

                onClick={submit}

                disabled={
                    loading ||
                    authLoading
                }

                className="
                    bg-green-600
                    hover:bg-green-700
                    disabled:bg-gray-400
                    disabled:cursor-not-allowed
                    text-white
                    px-6
                    py-3
                    rounded-lg
                    transition
                "

            >

                {
                    loading
                        ? "جاري قراءة وتحليل الروشتة..."
                        : "رفع وتحليل الروشتة"
                }

            </button>

        </div>

    );

}


export default UploadPrescription;