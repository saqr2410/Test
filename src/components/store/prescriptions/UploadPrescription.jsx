import React, { useState } from "react";

import toast from "react-hot-toast";

import {
    uploadPrescription,
    analyzePrescription
} from "../../../services/prescriptions/prescriptionService";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../contexts/AuthContext";


function UploadPrescription({

    patient,

    onFinished

}) {


    const [image, setImage] = useState(null);

    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();

    const { user, loading: authLoading } = useAuth();



    const submit = async () => {


        // استنى تحميل حالة المستخدم
        if (authLoading) {

            return;

        }



        // لو مفيش تسجيل دخول
        if (!user) {

            toast.error(
                "يجب تسجيل الدخول أولاً"
            );

            navigate("/login");

            return;

        }



        // لو مفيش صورة
        if (!image) {

            toast.error(
                "اختر صورة"
            );

            return;

        }



        try {


            setLoading(true);



            const form = new FormData();



            form.append(
                "patient",
                patient
            );



            form.append(
                "image",
                image
            );



            const prescription =
                await uploadPrescription(
                    form
                );



            toast.success(
                "تم رفع الروشتة"
            );



            const result =
                await analyzePrescription(
                    prescription.id
                );



            toast.success(
                "تم تحليل الروشتة"
            );



            if (onFinished) {

                onFinished(result);

            }



        }

        catch (error) {


            console.log(error);



            if (error.response?.status === 401) {


                toast.error(
                    "يجب تسجيل الدخول أولاً"
                );


                navigate("/login");


                return;

            }



            toast.error(
                "حدث خطأ أثناء تحليل الروشتة"
            );


        }


        finally {


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

                onChange={(e)=>{

                    setImage(
                        e.target.files[0]
                    );

                }}

                className="mb-5"

            />



            <button

                onClick={submit}

                disabled={loading}

                className="
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    px-6
                    py-3
                    rounded-lg
                "

            >

                {
                    loading
                    ?
                    "جاري التحليل..."
                    :
                    "رفع وتحليل"
                }


            </button>


        </div>

    );


}


export default UploadPrescription;