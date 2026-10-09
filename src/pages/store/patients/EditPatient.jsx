import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowRight,
    Baby,
    Calendar,
    HeartPulse,
    MapPin,
    Save,
    UserRound,
} from "lucide-react";

import toast from "react-hot-toast";

import patientService from "../../../services/patients/patientService";

import Loading from "../../../components/ui/feedback/Loading";


const PATIENT_TYPES = [
    {
        value: "GENERAL",
        label: "متابعة عامة",
        icon: UserRound,
    },
    {
        value: "CHRONIC",
        label: "أمراض مزمنة",
        icon: HeartPulse,
    },
    {
        value: "FITNESS",
        label: "لياقة بدنية",
        icon: HeartPulse,
    },
    {
        value: "NUTRITION",
        label: "تغذية",
        icon: HeartPulse,
    },
    {
        value: "PREGNANCY",
        label: "متابعة الحمل",
        icon: HeartPulse,
    },
    {
        value: "CHILD",
        label: "ملف طفل",
        icon: Baby,
    },
];


export default function EditPatient() {

    const {
        id,
    } = useParams();

    const navigate =
        useNavigate();


    const [
        form,
        setForm,
    ] = useState({
        name: "",
        phone: "",
        date_of_birth: "",
        gender: "",
        patient_type: "GENERAL",
        is_for_child: false,
        address: "",
    });


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        saving,
        setSaving,
    ] = useState(false);


    useEffect(() => {

        if (!id) {
            navigate("/patients");
            return;
        }

        loadPatient();

    }, [id]);


    const loadPatient = async () => {

        try {

            setLoading(true);

            const data =
                await patientService.getPatientDetails(
                    id
                );

            if (!data) {

                toast.error(
                    "الملف الصحي غير موجود"
                );

                navigate("/patients");

                return;
            }


            setForm({
                name:
                    data.name ||
                    "",

                phone:
                    data.phone ||
                    data.customer_phone ||
                    "",

                date_of_birth:
                    data.date_of_birth ||
                    "",

                gender:
                    data.gender ||
                    "",

                patient_type:
                    data.patient_type ||
                    "GENERAL",

                is_for_child:
                    Boolean(
                        data.is_for_child
                    ),

                address:
                    data.address ||
                    "",
            });

        } catch (error) {

            toast.error(
                error?.response?.data?.detail ||
                "حدث خطأ أثناء تحميل الملف الصحي"
            );

        } finally {

            setLoading(false);

        }
    };


    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;


        setForm(
            (current) => ({
                ...current,
                [name]: value,
            })
        );

    };


    const handlePatientTypeChange = (
        event
    ) => {

        const value =
            event.target.value;


        setForm(
            (current) => ({
                ...current,
                patient_type:
                    value,
                is_for_child:
                    value === "CHILD",
            })
        );

    };


    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        const name =
            form.name.trim();


        if (!name) {

            toast.error(
                "اسم المريض مطلوب"
            );

            return;
        }


        if (
            form.phone &&
            !/^\d{11}$/.test(
                form.phone
            )
        ) {

            toast.error(
                "رقم الهاتف يجب أن يكون 11 رقم"
            );

            return;
        }


        if (
            form.patient_type === "CHILD" &&
            !form.is_for_child
        ) {

            toast.error(
                "ملف الطفل يجب تحديده كملف طفل"
            );

            return;
        }


        setSaving(true);


        try {

            await patientService.updatePatient(
                id,
                {
                    ...form,
                    name,
                }
            );


            toast.success(
                "تم تحديث الملف الصحي بنجاح"
            );


            navigate(
                `/patients/${id}/profile`
            );

        } catch (error) {

            const data =
                error?.response?.data;


            if (
                data &&
                typeof data === "object"
            ) {

                let shownError =
                    false;


                Object.values(
                    data
                ).forEach(
                    (message) => {

                        if (
                            Array.isArray(
                                message
                            )
                        ) {

                            message.forEach(
                                (item) => {

                                    if (item) {

                                        toast.error(
                                            String(
                                                item
                                            )
                                        );

                                        shownError =
                                            true;
                                    }
                                }
                            );

                        } else if (
                            message
                        ) {

                            toast.error(
                                String(
                                    message
                                )
                            );

                            shownError =
                                true;
                        }

                    }
                );


                if (!shownError) {

                    toast.error(
                        "فشل تحديث الملف الصحي"
                    );
                }

            } else {

                toast.error(
                    "فشل تحديث الملف الصحي"
                );
            }

        } finally {

            setSaving(false);

        }
    };


    if (loading) {

        return (

            <div
                dir="rtl"
                className="
                    space-y-6
                "
            >

                <Loading />

            </div>

        );
    }


    return (

        <div
            dir="rtl"
            className="
                space-y-6
            "
        >

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-4
                    "
                >

                    <Link
                        to={`/patients/${id}/profile`}
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            text-gray-600
                            transition
                            hover:bg-gray-50
                            hover:text-primary-600
                        "
                    >

                        <ArrowRight
                            size={19}
                        />

                    </Link>


                    <div>

                        <h1
                            className="
                                text-2xl
                                font-bold
                                text-gray-900
                            "
                        >

                            تعديل الملف الصحي

                        </h1>


                        <p
                            className="
                                mt-1
                                text-sm
                                text-gray-500
                            "
                        >

                            تعديل البيانات الأساسية للملف الصحي

                        </p>

                    </div>

                </div>

            </div>


            <div
                className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-6
                    shadow-sm
                "
            >

                <div
                    className="
                        mb-7
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-primary-50
                            text-primary-600
                        "
                    >

                        <UserRound
                            size={21}
                        />

                    </div>


                    <div>

                        <h2
                            className="
                                font-semibold
                                text-gray-900
                            "
                        >

                            البيانات الأساسية

                        </h2>


                        <p
                            className="
                                mt-1
                                text-xs
                                text-gray-500
                            "
                        >

                            قم بتحديث بيانات الملف الصحي

                        </p>

                    </div>

                </div>


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        space-y-6
                    "
                >

                    <div
                        className="
                            grid
                            gap-5
                            md:grid-cols-2
                        "
                    >

                        <Input
                            label="اسم المريض"
                            name="name"
                            value={
                                form.name
                            }
                            onChange={
                                handleChange
                            }
                            required
                            icon={
                                UserRound
                            }
                        />


                        <Input
                            label="رقم الهاتف"
                            name="phone"
                            value={
                                form.phone
                            }
                            onChange={
                                handleChange
                            }
                            type="tel"
                            icon={
                                PhoneIcon
                            }
                            dir="ltr"
                        />


                        <Input
                            label="تاريخ الميلاد"
                            name="date_of_birth"
                            value={
                                form.date_of_birth
                            }
                            onChange={
                                handleChange
                            }
                            type="date"
                            icon={
                                Calendar
                            }
                        />


                        <SelectInput
                            label="النوع"
                            name="gender"
                            value={
                                form.gender
                            }
                            onChange={
                                handleChange
                            }
                            options={[
                                {
                                    value: "MALE",
                                    label: "ذكر",
                                },
                                {
                                    value: "FEMALE",
                                    label: "أنثى",
                                },
                            ]}
                            placeholder="اختر النوع"
                        />

                    </div>


                    <div>

                        <label
                            className="
                                mb-3
                                block
                                text-sm
                                font-semibold
                                text-gray-800
                            "
                        >

                            نوع الملف الصحي

                        </label>


                        <div
                            className="
                                grid
                                gap-3
                                sm:grid-cols-2
                                lg:grid-cols-3
                            "
                        >

                            {PATIENT_TYPES.map(
                                (type) => {

                                    const Icon =
                                        type.icon;

                                    const selected =
                                        form.patient_type ===
                                        type.value;


                                    return (

                                        <button
                                            key={
                                                type.value
                                            }
                                            type="button"
                                            onClick={() =>
                                                handlePatientTypeChange(
                                                    {
                                                        target: {
                                                            value:
                                                                type.value,
                                                        },
                                                    }
                                                )
                                            }
                                            className={`
                                                flex
                                                items-center
                                                gap-3
                                                rounded-xl
                                                border
                                                p-4
                                                text-right
                                                transition
                                                ${selected
                                                    ? "border-primary-500 bg-primary-50 text-primary-700"
                                                    : "border-gray-200 bg-white text-gray-700 hover:border-primary-200 hover:bg-gray-50"
                                                }
                                            `}
                                        >

                                            <div
                                                className={`
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    ${selected
                                                        ? "bg-white text-primary-600"
                                                        : "bg-gray-50 text-gray-500"
                                                    }
                                                `}
                                            >

                                                <Icon
                                                    size={19}
                                                />

                                            </div>


                                            <span
                                                className="
                                                    text-sm
                                                    font-semibold
                                                "
                                            >

                                                {
                                                    type.label
                                                }

                                            </span>

                                        </button>

                                    );
                                }
                            )}

                        </div>

                    </div>


                    {form.patient_type ===
                        "CHILD" && (

                            <div
                                className="
                                rounded-xl
                                border
                                border-amber-200
                                bg-amber-50
                                p-4
                            "
                            >

                                <div
                                    className="
                                    flex
                                    items-center
                                    gap-3
                                "
                                >

                                    <Baby
                                        size={20}
                                        className="
                                        text-amber-600
                                    "
                                    />


                                    <div>

                                        <p
                                            className="
                                            text-sm
                                            font-semibold
                                            text-amber-800
                                        "
                                        >

                                            ملف طفل

                                        </p>


                                        <p
                                            className="
                                            mt-1
                                            text-xs
                                            text-amber-700
                                        "
                                        >

                                            سيتم حفظ هذا الملف على أنه ملف خاص بطفل.

                                        </p>

                                    </div>

                                </div>

                            </div>

                        )}


                    <div>

                        <label
                            className="
                                mb-2
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-semibold
                                text-gray-800
                            "
                        >

                            <MapPin
                                size={16}
                                className="
                                    text-gray-400
                                "
                            />

                            العنوان

                        </label>


                        <textarea
                            name="address"
                            value={
                                form.address
                            }
                            onChange={
                                handleChange
                            }
                            rows={4}
                            placeholder="أدخل عنوان المريض..."
                            className="
                                w-full
                                resize-none
                                rounded-xl
                                border
                                border-gray-200
                                bg-gray-50
                                px-4
                                py-3
                                text-sm
                                text-gray-800
                                outline-none
                                transition
                                focus:border-primary-500
                                focus:bg-white
                                focus:ring-2
                                focus:ring-primary-100
                            "
                        />

                    </div>


                    <div
                        className="
                            flex
                            flex-col-reverse
                            gap-3
                            border-t
                            border-gray-100
                            pt-5
                            sm:flex-row
                        "
                    >

                        <Link
                            to={`/patients/${id}/profile`}
                            className="
                                inline-flex
                                flex-1
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-gray-200
                                bg-white
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-gray-700
                                transition
                                hover:bg-gray-50
                            "
                        >

                            إلغاء

                        </Link>


                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                inline-flex
                                flex-1
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-primary-600
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-primary-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            <Save
                                size={18}
                            />

                            {saving
                                ? "جاري الحفظ..."
                                : "حفظ التعديلات"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


function Input({
    label,
    name,
    value,
    onChange,
    type = "text",
    required = false,
    icon: Icon,
    dir,
}) {

    return (

        <div>

            <label
                className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-gray-800
                "
            >

                {Icon && (
                    <Icon
                        size={16}
                        className="
                            text-gray-400
                        "
                    />
                )}

                {label}

            </label>


            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                dir={dir}
                className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    py-3
                    text-sm
                    text-gray-800
                    outline-none
                    transition
                    focus:border-primary-500
                    focus:bg-white
                    focus:ring-2
                    focus:ring-primary-100
                "
            />

        </div>
    );
}


function SelectInput({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder,
}) {

    return (

        <div>

            <label
                className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-gray-800
                "
            >

                {label}

            </label>


            <select
                name={name}
                value={value}
                onChange={onChange}
                className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    py-3
                    text-sm
                    text-gray-800
                    outline-none
                    transition
                    focus:border-primary-500
                    focus:bg-white
                    focus:ring-2
                    focus:ring-primary-100
                "
            >

                <option value="">
                    {placeholder}
                </option>


                {options.map(
                    (option) => (

                        <option
                            key={
                                option.value
                            }
                            value={
                                option.value
                            }
                        >

                            {
                                option.label
                            }

                        </option>

                    )
                )}

            </select>

        </div>
    );
}


function PhoneIcon({
    size = 16,
    className = "",
}) {

    return (

        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >

            <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"
            />

        </svg>
    );
}