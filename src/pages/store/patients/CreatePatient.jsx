import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import {
    createPatient
} from "../../../services/patients/patientService";

export default function CreatePatient(){

    const navigate = useNavigate();

    const [form,setForm] = useState({

        name:"",
        phone:"",
        date_of_birth:"",
        gender:"",
        patient_type:"GENERAL",
        address:""

    });

    const [loading,setLoading] = useState(false);

    const handleChange=(e)=>{

        setForm({

            ...form,

            [e.target.name]:
            e.target.value

        });

    };

    const validateForm=()=>{

        if(!form.name.trim()){

            toast.error("اسم المريض مطلوب");

            return false;

        }

        return true;

    };

    const handleSubmit=async(e)=>{

        e.preventDefault();

        if(!validateForm()){

            return;

        }

        setLoading(true);

        try{

            const patient =
            await createPatient(form);

            toast.success(
                "تم إضافة المريض بنجاح"
            );

            navigate(
                `/patients/${patient.id}/profile`
            );

        }

        catch(error){

            console.log(error);

            toast.error(
                "حدث خطأ أثناء إضافة المريض"
            );

        }

        finally{

            setLoading(false);

        }

    };

    return(

        <div
        dir="rtl"
        className="
        min-h-screen
        bg-gray-100
        p-6
        ">

            <div
            className="
            max-w-3xl
            mx-auto
            bg-white
            rounded-3xl
            shadow
            p-8
            ">

                <h1
                className="
                text-3xl
                font-black
                mb-8
                ">
                    إضافة مريض جديد
                </h1>

                <form
                onSubmit={handleSubmit}
                className="space-y-5">

                    <Input
                    label="اسم المريض"
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
                        border-gray-300
                        rounded-xl
                        p-3
                        outline-none
                        focus:border-[#5B2A86]
                        focus:ring-2
                        focus:ring-[#5B2A86]/20
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
                        border-gray-300
                        rounded-xl
                        p-3
                        outline-none
                        focus:border-[#5B2A86]
                        focus:ring-2
                        focus:ring-[#5B2A86]/20
                        "

                        >

                            <option value="">
                                اختر النوع
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
                        border-gray-300
                        rounded-xl
                        p-3
                        outline-none
                        focus:border-[#5B2A86]
                        focus:ring-2
                        focus:ring-[#5B2A86]/20
                        "

                        >

                            <option value="GENERAL">متابعة عامة</option>
                            <option value="CHRONIC">مرض مزمن</option>
                            <option value="FITNESS">لياقة</option>
                            <option value="NUTRITION">تغذية</option>

                        </select>

                    </div>
                    <div>

                        <label
                        className="
                        block
                        mb-2
                        font-bold
                        ">

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

                    <button

                        type="submit"

                        disabled={loading}

                        className="
                        w-full
                        bg-[#5B2A86]
                        hover:bg-[#4A2070]
                        disabled:bg-gray-400
                        disabled:cursor-not-allowed
                        transition-all
                        duration-200
                        text-white
                        py-3
                        rounded-full
                        font-black
                        "

                    >

                        {
                            loading
                            ?
                            "جاري الحفظ..."
                            :
                            "حفظ المريض"
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

            <label

                className="
                block
                mb-2
                font-bold
                "

            >

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