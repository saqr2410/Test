import {
    useEffect,
    useState
} from "react";


import {
    useNavigate,
    useParams
} from "react-router-dom";


import toast from "react-hot-toast";


import {
 getPatientDetails,
 updatePatient
} from "../../../services/patients/patientService";




export default function EditPatient(){


    const { id } = useParams();

    const navigate = useNavigate();



    const [form,setForm] = useState({

        name:"",
        phone:"",
        date_of_birth:"",
        gender:"",
        patient_type:"",
        address:""

    });



    const [loading,setLoading] = useState(true);

    const [saving,setSaving] = useState(false);







    useEffect(()=>{

        loadPatient();

    },[id]);








    const loadPatient = async()=>{


        try{


            const data =
            await getPatientDetails(id);

            if(!data){

                toast.error("المريض غير موجود");

                navigate("/patients");

                return;

            }



            setForm({

                name:data.name || "",

                phone:data.phone || "",

                date_of_birth:data.date_of_birth || "",

                gender:data.gender || "",

                patient_type:data.patient_type || "GENERAL",

                address:data.address || ""

            });


        }

        catch(error){


            console.log(error);

            toast.error(
                "حدث خطأ في تحميل البيانات"
            );


        }

        finally{

            setLoading(false);

        }


    };









    const handleChange=(e)=>{


        setForm({

            ...form,

            [e.target.name]:
            e.target.value

        });


    };


    const validateForm = () => {

        if(!form.name.trim()){

            toast.error("اسم المريض مطلوب");

            return false;

        }

        if(form.phone && form.phone.length < 11){

            toast.error("رقم الهاتف غير صحيح");

            return false;

        }

        return true;

    };









    const handleSubmit=async(e)=>{


        e.preventDefault();

        if(!validateForm()){

            return;

        }


        setSaving(true);



        try{


            await updatePatient(
                id,
                form
            );



            toast.success(
                "تم تحديث الملف"
            );



            navigate(
                `/patients/${id}/profile`
            );


        }

        catch(error){


            console.log(error);


            toast.error(
                "فشل تحديث الملف"
            );


        }

        finally{

            setSaving(false);

        }


    };









    if(loading){

        return (

            <div className="p-8">

                جاري تحميل الملف...

            </div>

        );

    }









    return (


        <div

        dir="rtl"

        className="
        min-h-screen
        bg-gray-100
        p-6
        "

        >



            <div

            className="
            max-w-3xl
            mx-auto
            bg-white
            rounded-3xl
            shadow
            p-8
            "

            >



                <h1

                className="
                text-3xl
                font-black
                mb-8
                "

                >

                    تعديل الملف الصحي

                </h1>






                <form

                onSubmit={handleSubmit}

                className="
                space-y-5
                "

                >




                    <Input

                    label="الاسم"

                    name="name"

                    value={form.name}

                    onChange={handleChange}

                    />






                    <Input

                    label="رقم الهاتف"

                    name="phone"

                    value={form.phone}

                    onChange={handleChange}

                    />








                    <div>

                        <label className="block mb-2 font-bold">

                            تاريخ الميلاد

                        </label>


                        <input

                        type="date"

                        name="date_of_birth"

                        value={form.date_of_birth}

                        onChange={handleChange}

                        className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        "

                        />


                    </div>









                    <div>

                        <label className="block mb-2 font-bold">

                            النوع

                        </label>


                        <select

                        name="gender"

                        value={form.gender}

                        onChange={handleChange}

                        className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        "

                        >

                            <option value="">
                                اختر
                            </option>


                            <option value="MALE">
                                ذكر
                            </option>


                            <option value="FEMALE">
                                أنثى
                            </option>


                        </select>


                    </div>









                    <div>

                        <label className="block mb-2 font-bold">

                            نوع المتابعة

                        </label>


                        <select

                        name="patient_type"

                        value={form.patient_type}

                        onChange={handleChange}

                        className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        "

                        >


                            <option value="GENERAL">
                                متابعة عامة
                            </option>


                            <option value="CHRONIC">
                                مرض مزمن
                            </option>


                            <option value="FITNESS">
                                لياقة وجيم
                            </option>


                            <option value="NUTRITION">
                                تغذية
                            </option>



                        </select>


                    </div>









                    <div>

                        <label className="block mb-2 font-bold">

                            العنوان

                        </label>


                        <textarea

                        name="address"

                        value={form.address}

                        onChange={handleChange}

                        rows="4"

                        className="
                        w-full
                        border
                        rounded-xl
                        p-3
                        "

                        />


                    </div>









                    <button

                        disabled={saving}

                        className={`
                        w-full
                        py-3
                        rounded-full
                        font-black
                        transition-all
                        duration-200
                        ${
                            saving
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#5B2A86] hover:bg-[#4A2070] text-white"
                        }
                        `}

                    >

                        {
                            saving
                                ? "جاري الحفظ..."
                                : "حفظ التعديلات"
                        }

                    </button>





                </form>





            </div>



        </div>


    );


}










function Input({
    label,
    name,
    value,
    onChange
}){


    return (

        <div>

            <label className="block mb-2 font-bold">

                {label}

            </label>


            <input

                name={name}

                value={value}

                onChange={onChange}

                required

                className="
                w-full
                border
                border-gray-300
                rounded-xl
                p-3
                outline-none
                transition-all
                duration-200
                focus:border-[#5B2A86]
                focus:ring-2
                focus:ring-[#5B2A86]/20
                "

            />


        </div>

    );


}