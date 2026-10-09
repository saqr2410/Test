import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    User,
    Phone,
    Calendar,
    MapPin,
    Activity,
    HeartPulse,
    Baby,
    Apple,
    ArrowRight,
    Loader2,
    Stethoscope,
    Search,
} from "lucide-react";

import {
    createPatient,
    getPatientDetails,
    updateFitnessProfile,
    updateNutritionProfile,
    updatePregnancyProfile,
    updateChildProfile,
    getChronicDiseases,
    createPatientDisease,
} from "../../../services/patients/patientService";

const initialForm = {
    name: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    patient_type: "",
    is_for_child: false,
    address: "",

    height_cm: "",
    weight_kg: "",
    fitness_goal: "",
    activity_level: "",
    fitness_notes: "",

    nutrition_height_cm: "",
    nutrition_weight_kg: "",
    target_weight_kg: "",
    nutrition_goal: "",
    dietary_preferences: "",
    food_allergies: "",
    nutrition_notes: "",

    last_menstrual_period: "",
    expected_due_date: "",
    pregnancy_week: "",
    pregnancy_notes: "",
    risk_notes: "",

    guardian_name: "",
    guardian_phone: "",
    child_height_cm: "",
    child_weight_kg: "",
    allergies: "",
    child_notes: "",

    chronic_disease: "",
    custom_disease_name: "",
    chronic_notes: "",
    diagnosed_at: "",
};

export default function CreatePatient() {
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);

    const [chronicDiseases, setChronicDiseases] = useState([]);
    const [chronicDiseasesLoading, setChronicDiseasesLoading] =
        useState(false);

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const getErrorMessage = (error) => {
        const data =
            error?.response?.data;

        if (!data) {
            return "حدث خطأ أثناء إنشاء الملف الصحي.";
        }

        if (typeof data === "string") {
            return data;
        }

        if (data.detail) {
            return data.detail;
        }

        if (data.error) {
            return data.error;
        }

        const firstError =
            Object.values(data)[0];

        if (Array.isArray(firstError)) {
            return firstError[0];
        }

        if (typeof firstError === "string") {
            return firstError;
        }

        return "البيانات غير صحيحة.";
    };

    useEffect(() => {
        if (
            form.patient_type !==
            "CHRONIC"
        ) {
            return;
        }

        const loadChronicDiseases =
            async () => {
                try {
                    setChronicDiseasesLoading(
                        true
                    );

                    const data =
                        await getChronicDiseases();

                    const items =
                        Array.isArray(data)
                            ? data
                            : data?.results || [];

                    setChronicDiseases(
                        items
                    );
                } catch (error) {
                    console.error(
                        "CHRONIC DISEASES ERROR:",
                        error
                    );

                    toast.error(
                        "تعذر تحميل قائمة الأمراض المزمنة."
                    );
                } finally {
                    setChronicDiseasesLoading(
                        false
                    );
                }
            };

        loadChronicDiseases();
    }, [form.patient_type]);

    const updateProfileAfterCreation = async (
        patient
    ) => {
        const profile =
            await getPatientDetails(
                patient.id
            );

        if (
            patient.patient_type ===
            "FITNESS" &&
            profile?.fitness
        ) {
            const data = {};

            if (
                form.height_cm !== ""
            ) {
                data.height_cm =
                    form.height_cm;
            }

            if (
                form.weight_kg !== ""
            ) {
                data.weight_kg =
                    form.weight_kg;
            }

            if (
                form.fitness_goal.trim()
            ) {
                data.fitness_goal =
                    form.fitness_goal.trim();
            }

            if (
                form.activity_level.trim()
            ) {
                data.activity_level =
                    form.activity_level.trim();
            }

            if (
                form.fitness_notes.trim()
            ) {
                data.notes =
                    form.fitness_notes.trim();
            }

            if (
                Object.keys(data).length >
                0
            ) {
                await updateFitnessProfile(
                    profile.fitness.id,
                    data
                );
            }
        }

        if (
            patient.patient_type ===
            "NUTRITION" &&
            profile?.nutrition
        ) {
            const data = {};

            if (
                form.nutrition_height_cm !==
                ""
            ) {
                data.height_cm =
                    form.nutrition_height_cm;
            }

            if (
                form.nutrition_weight_kg !==
                ""
            ) {
                data.weight_kg =
                    form.nutrition_weight_kg;
            }

            if (
                form.target_weight_kg !== ""
            ) {
                data.target_weight_kg =
                    form.target_weight_kg;
            }

            if (
                form.nutrition_goal.trim()
            ) {
                data.goal =
                    form.nutrition_goal.trim();
            }

            if (
                form.dietary_preferences.trim()
            ) {
                data.dietary_preferences =
                    form.dietary_preferences.trim();
            }

            if (
                form.food_allergies.trim()
            ) {
                data.food_allergies =
                    form.food_allergies.trim();
            }

            if (
                form.nutrition_notes.trim()
            ) {
                data.notes =
                    form.nutrition_notes.trim();
            }

            if (
                Object.keys(data).length >
                0
            ) {
                await updateNutritionProfile(
                    profile.nutrition.id,
                    data
                );
            }
        }

        if (
            patient.patient_type ===
            "PREGNANCY" &&
            profile?.pregnancy
        ) {
            const data = {};

            if (
                form.last_menstrual_period
            ) {
                data.last_menstrual_period =
                    form.last_menstrual_period;
            }

            if (
                form.expected_due_date
            ) {
                data.expected_due_date =
                    form.expected_due_date;
            }

            if (
                form.pregnancy_week !== ""
            ) {
                data.pregnancy_week =
                    form.pregnancy_week;
            }

            if (
                form.pregnancy_notes.trim()
            ) {
                data.notes =
                    form.pregnancy_notes.trim();
            }

            if (
                form.risk_notes.trim()
            ) {
                data.risk_notes =
                    form.risk_notes.trim();
            }

            if (
                Object.keys(data).length >
                0
            ) {
                await updatePregnancyProfile(
                    profile.pregnancy.id,
                    data
                );
            }
        }

        if (
            patient.patient_type ===
            "CHILD" &&
            profile?.child
        ) {
            const data = {};

            if (
                form.guardian_name.trim()
            ) {
                data.guardian_name =
                    form.guardian_name.trim();
            }

            if (
                form.guardian_phone.trim()
            ) {
                data.guardian_phone =
                    form.guardian_phone.trim();
            }

            if (
                form.child_height_cm !== ""
            ) {
                data.height_cm =
                    form.child_height_cm;
            }

            if (
                form.child_weight_kg !== ""
            ) {
                data.weight_kg =
                    form.child_weight_kg;
            }

            if (
                form.allergies.trim()
            ) {
                data.allergies =
                    form.allergies.trim();
            }

            if (
                form.child_notes.trim()
            ) {
                data.notes =
                    form.child_notes.trim();
            }

            if (
                Object.keys(data).length >
                0
            ) {
                await updateChildProfile(
                    profile.child.id,
                    data
                );
            }
        }

        if (
            patient.patient_type ===
            "CHRONIC"
        ) {
            const hasDisease =
                form.chronic_disease !== "";

            const hasCustomDisease =
                form.custom_disease_name.trim();

            if (
                hasDisease ||
                hasCustomDisease
            ) {
                const diseaseData = {
                    patient: patient.id,
                    disease:
                        form.chronic_disease ||
                        null,
                    custom_disease_name:
                        hasCustomDisease ||
                        null,
                    notes:
                        form.chronic_notes.trim() ||
                        null,
                    diagnosed_at:
                        form.diagnosed_at ||
                        null,
                };

                await createPatientDisease(
                    diseaseData
                );
            }
        }

        return profile;
    };

    const validateForm = () => {
        if (!form.name.trim()) {
            toast.error(
                "اكتب اسم صاحب الملف الصحي."
            );

            return false;
        }

        if (!form.patient_type) {
            toast.error(
                "اختر نوع الملف الصحي."
            );

            return false;
        }

        if (
            form.phone &&
            !/^\d{11}$/.test(
                form.phone.trim()
            )
        ) {
            toast.error(
                "رقم الهاتف يجب أن يكون 11 رقم."
            );

            return false;
        }

        if (
            form.patient_type ===
            "CHILD" &&
            !form.is_for_child
        ) {
            toast.error(
                "يجب تأكيد أن الملف خاص بطفل."
            );

            return false;
        }

        if (
            form.patient_type !==
            "CHILD" &&
            form.is_for_child
        ) {
            toast.error(
                "خيار ملف الطفل متاح فقط لنوع الملف طفل."
            );

            return false;
        }

        if (
            form.patient_type ===
            "CHRONIC"
        ) {
            if (
                !form.chronic_disease &&
                !form.custom_disease_name.trim()
            ) {
                toast.error(
                    "اختر مرضًا مزمنًا أو اكتب اسم المرض يدويًا."
                );

                return false;
            }

            if (
                form.chronic_disease &&
                form.custom_disease_name.trim()
            ) {
                toast.error(
                    "اختر مرضًا من القائمة أو اكتب اسم مرض مخصص، وليس الاثنين معًا."
                );

                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const patientData = {
                name: form.name.trim(),
                phone:
                    form.phone.trim() ||
                    null,
                date_of_birth:
                    form.date_of_birth ||
                    null,
                gender:
                    form.gender || null,
                patient_type:
                    form.patient_type,
                is_for_child:
                    form.patient_type ===
                    "CHILD",
                address:
                    form.address.trim() ||
                    null,
            };

            const patient =
                await createPatient(
                    patientData
                );

            await updateProfileAfterCreation(
                patient
            );

            toast.success(
                "تم إنشاء الملف الصحي بنجاح."
            );

            navigate(
                `/patients/${patient.id}/profile`
            );
        } catch (error) {
            console.error(
                "CREATE PATIENT ERROR:",
                error
            );

            toast.error(
                getErrorMessage(error)
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-slate-50 px-4 py-10"
            dir="rtl"
        >
            <div className="mx-auto max-w-5xl">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-l from-fuchsia-950 via-purple-900 to-slate-900 px-8 py-10 text-white">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                                <HeartPulse
                                    size={30}
                                />
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold">
                                    إنشاء ملف صحي
                                </h1>

                                <p className="mt-2 text-white/70">
                                    أنشئ ملفًا صحيًا جديدًا وأضف بياناته الأساسية.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="space-y-10 p-8"
                    >
                        <section>
                            <div className="mb-6 flex items-center gap-3">
                                <User className="text-fuchsia-900" />

                                <h2 className="text-xl font-bold text-slate-800">
                                    البيانات الأساسية
                                </h2>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Input
                                    label="الاسم"
                                    name="name"
                                    value={
                                        form.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    icon={
                                        <User
                                            size={
                                                18
                                            }
                                        />
                                    }
                                    required
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
                                        <Phone
                                            size={
                                                18
                                            }
                                        />
                                    }
                                />

                                <Input
                                    label="تاريخ الميلاد"
                                    name="date_of_birth"
                                    type="date"
                                    value={
                                        form.date_of_birth
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    icon={
                                        <Calendar
                                            size={
                                                18
                                            }
                                        />
                                    }
                                />

                                <Select
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
                                />

                                <Select
                                    label="نوع الملف الصحي"
                                    name="patient_type"
                                    value={
                                        form.patient_type
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    options={[
                                        {
                                            value: "FITNESS",
                                            label: "لياقة بدنية",
                                        },
                                        {
                                            value: "NUTRITION",
                                            label: "تغذية",
                                        },
                                        {
                                            value: "CHRONIC",
                                            label: "أمراض مزمنة",
                                        },
                                        {
                                            value: "PREGNANCY",
                                            label: "حمل",
                                        },
                                        {
                                            value: "CHILD",
                                            label: "طفل",
                                        },
                                    ]}
                                    required
                                />

                                <Input
                                    label="العنوان"
                                    name="address"
                                    value={
                                        form.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    icon={
                                        <MapPin
                                            size={
                                                18
                                            }
                                        />
                                    }
                                />
                            </div>

                            {form.patient_type ===
                                "CHILD" && (
                                    <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-4">
                                        <input
                                            type="checkbox"
                                            name="is_for_child"
                                            checked={
                                                form.is_for_child
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="h-5 w-5 accent-fuchsia-900"
                                        />

                                        <span className="font-medium text-slate-700">
                                            هذا الملف الصحي خاص بطفل
                                        </span>
                                    </label>
                                )}
                        </section>

                        {form.patient_type ===
                            "FITNESS" && (
                                <FitnessFields
                                    form={form}
                                    onChange={
                                        handleChange
                                    }
                                />
                            )}

                        {form.patient_type ===
                            "NUTRITION" && (
                                <NutritionFields
                                    form={form}
                                    onChange={
                                        handleChange
                                    }
                                />
                            )}

                        {form.patient_type ===
                            "CHRONIC" && (
                                <ChronicFields
                                    form={form}
                                    onChange={
                                        handleChange
                                    }
                                    diseases={
                                        chronicDiseases
                                    }
                                    loading={
                                        chronicDiseasesLoading
                                    }
                                />
                            )}

                        {form.patient_type ===
                            "PREGNANCY" && (
                                <PregnancyFields
                                    form={form}
                                    onChange={
                                        handleChange
                                    }
                                />
                            )}

                        {form.patient_type ===
                            "CHILD" && (
                                <ChildFields
                                    form={form}
                                    onChange={
                                        handleChange
                                    }
                                />
                            )}

                        <div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        -1
                                    )
                                }
                                disabled={
                                    loading
                                }
                                className="rounded-xl border border-slate-300 px-7 py-3 text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                            >
                                إلغاء
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    loading
                                }
                                className="flex items-center gap-2 rounded-xl bg-fuchsia-950 px-8 py-3 font-bold text-white transition hover:bg-fuchsia-900 disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={
                                                20
                                            }
                                            className="animate-spin"
                                        />

                                        جاري الحفظ...
                                    </>
                                ) : (
                                    <>
                                        إنشاء الملف

                                        <ArrowRight
                                            size={
                                                20
                                            }
                                        />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
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
    icon,
    required = false,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}

                {required && (
                    <span className="mr-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            <div className="relative">
                {icon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        {icon}
                    </div>
                )}

                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`w-full rounded-xl border border-slate-300 bg-white py-3 outline-none transition focus:border-fuchsia-900 focus:ring-2 focus:ring-fuchsia-100 ${icon
                            ? "pl-4 pr-11"
                            : "px-4"
                        }`}
                />
            </div>
        </div>
    );
}

function Select({
    label,
    name,
    value,
    onChange,
    options,
    required = false,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}

                {required && (
                    <span className="mr-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-fuchsia-900 focus:ring-2 focus:ring-fuchsia-100"
            >
                <option value="">
                    اختر
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

function SectionTitle({
    icon,
    title,
}) {
    return (
        <div className="mb-6 flex items-center gap-3">
            <div className="text-fuchsia-900">
                {icon}
            </div>

            <h2 className="text-xl font-bold text-slate-800">
                {title}
            </h2>
        </div>
    );
}

function FitnessFields({
    form,
    onChange,
}) {
    return (
        <section>
            <SectionTitle
                icon={
                    <Activity
                        size={24}
                    />
                }
                title="بيانات اللياقة البدنية"
            />

            <div className="grid gap-5 md:grid-cols-2">
                <Input
                    label="الطول بالسنتيمتر"
                    name="height_cm"
                    type="number"
                    value={
                        form.height_cm
                    }
                    onChange={onChange}
                />

                <Input
                    label="الوزن بالكيلوجرام"
                    name="weight_kg"
                    type="number"
                    value={
                        form.weight_kg
                    }
                    onChange={onChange}
                />

                <Input
                    label="هدف اللياقة"
                    name="fitness_goal"
                    value={
                        form.fitness_goal
                    }
                    onChange={onChange}
                />

                <Input
                    label="مستوى النشاط"
                    name="activity_level"
                    value={
                        form.activity_level
                    }
                    onChange={onChange}
                />
            </div>

            <textarea
                name="fitness_notes"
                value={
                    form.fitness_notes
                }
                onChange={onChange}
                placeholder="ملاحظات"
                rows="4"
                className="mt-5 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-900 focus:ring-2 focus:ring-fuchsia-100"
            />
        </section>
    );
}

function NutritionFields({
    form,
    onChange,
}) {
    return (
        <section>
            <SectionTitle
                icon={
                    <Apple
                        size={24}
                    />
                }
                title="بيانات التغذية"
            />

            <div className="grid gap-5 md:grid-cols-2">
                <Input
                    label="الطول"
                    name="nutrition_height_cm"
                    type="number"
                    value={
                        form.nutrition_height_cm
                    }
                    onChange={onChange}
                />

                <Input
                    label="الوزن"
                    name="nutrition_weight_kg"
                    type="number"
                    value={
                        form.nutrition_weight_kg
                    }
                    onChange={onChange}
                />

                <Input
                    label="الوزن المستهدف"
                    name="target_weight_kg"
                    type="number"
                    value={
                        form.target_weight_kg
                    }
                    onChange={onChange}
                />

                <Input
                    label="الهدف"
                    name="nutrition_goal"
                    value={
                        form.nutrition_goal
                    }
                    onChange={onChange}
                />
            </div>

            <textarea
                name="dietary_preferences"
                value={
                    form.dietary_preferences
                }
                onChange={onChange}
                placeholder="التفضيلات الغذائية"
                rows="3"
                className="mt-5 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-900 focus:ring-2 focus:ring-fuchsia-100"
            />

            <textarea
                name="food_allergies"
                value={
                    form.food_allergies
                }
                onChange={onChange}
                placeholder="الحساسيات الغذائية"
                rows="3"
                className="mt-5 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-900 focus:ring-2 focus:ring-fuchsia-100"
            />

            <textarea
                name="nutrition_notes"
                value={
                    form.nutrition_notes
                }
                onChange={onChange}
                placeholder="ملاحظات"
                rows="3"
                className="mt-5 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-900 focus:ring-2 focus:ring-fuchsia-100"
            />
        </section>
    );
}

function ChronicFields({
    form,
    onChange,
    diseases,
    loading,
}) {
    return (
        <section>
            <SectionTitle
                icon={
                    <Stethoscope
                        size={24}
                    />
                }
                title="بيانات الأمراض المزمنة"
            />

            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5">
                <div className="mb-5">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        المرض المزمن
                    </label>

                    <div className="relative">
                        <Stethoscope
                            size={18}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <select
                            name="chronic_disease"
                            value={
                                form.chronic_disease
                            }
                            onChange={(event) => {
                                onChange(
                                    event
                                );

                                if (
                                    event.target
                                        .value
                                ) {
                                    onChange({
                                        target: {
                                            name: "custom_disease_name",
                                            value: "",
                                            type: "text",
                                        },
                                    });
                                }
                            }}
                            disabled={loading}
                            className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 outline-none transition focus:border-fuchsia-900 focus:ring-2 focus:ring-fuchsia-100 disabled:bg-slate-100"
                        >
                            <option value="">
                                اختر مرضًا من القائمة
                            </option>

                            {diseases.map(
                                (disease) => (
                                    <option
                                        key={
                                            disease.id
                                        }
                                        value={
                                            disease.id
                                        }
                                    >
                                        {
                                            disease.name
                                        }
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    {loading && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                            <Loader2
                                size={16}
                                className="animate-spin"
                            />

                            جاري تحميل الأمراض...
                        </div>
                    )}

                    {!loading &&
                        diseases.length ===
                        0 && (
                            <p className="mt-3 text-sm text-amber-600">
                                لا توجد أمراض مضافة حاليًا في النظام.
                            </p>
                        )}
                </div>

                <div className="relative mb-5 flex items-center">
                    <div className="h-px flex-1 bg-slate-200" />

                    <span className="px-4 text-xs font-bold text-slate-400">
                        أو
                    </span>

                    <div className="h-px flex-1 bg-slate-200" />
                </div>

                <Input
                    label="اسم مرض غير موجود بالقائمة"
                    name="custom_disease_name"
                    value={
                        form.custom_disease_name
                    }
                    onChange={(event) => {
                        onChange(event);

                        if (
                            event.target.value.trim()
                        ) {
                            onChange({
                                target: {
                                    name: "chronic_disease",
                                    value: "",
                                    type: "text",
                                },
                            });
                        }
                    }}
                    icon={
                        <Search
                            size={18}
                        />
                    }
                />

                <div className="mt-5">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        تاريخ التشخيص
                    </label>

                    <input
                        type="date"
                        name="diagnosed_at"
                        value={
                            form.diagnosed_at
                        }
                        onChange={onChange}
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-fuchsia-900 focus:ring-2 focus:ring-fuchsia-100"
                    />
                </div>

                <div className="mt-5">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        ملاحظات
                    </label>

                    <textarea
                        name="chronic_notes"
                        value={
                            form.chronic_notes
                        }
                        onChange={onChange}
                        placeholder="اكتب أي ملاحظات مهمة عن المرض..."
                        rows="4"
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-fuchsia-900 focus:ring-2 focus:ring-fuchsia-100"
                    />
                </div>
            </div>
        </section>
    );
}

function PregnancyFields({
    form,
    onChange,
}) {
    return (
        <section>
            <SectionTitle
                icon={
                    <HeartPulse
                        size={24}
                    />
                }
                title="بيانات الحمل"
            />

            <div className="grid gap-5 md:grid-cols-2">
                <Input
                    label="تاريخ آخر دورة"
                    name="last_menstrual_period"
                    type="date"
                    value={
                        form.last_menstrual_period
                    }
                    onChange={onChange}
                />

                <Input
                    label="موعد الولادة المتوقع"
                    name="expected_due_date"
                    type="date"
                    value={
                        form.expected_due_date
                    }
                    onChange={onChange}
                />

                <Input
                    label="أسبوع الحمل"
                    name="pregnancy_week"
                    type="number"
                    value={
                        form.pregnancy_week
                    }
                    onChange={onChange}
                />
            </div>

            <textarea
                name="pregnancy_notes"
                value={
                    form.pregnancy_notes
                }
                onChange={onChange}
                placeholder="ملاحظات الطبيب"
                rows="4"
                className="mt-5 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-900 focus:ring-2 focus:ring-fuchsia-100"
            />

            <textarea
                name="risk_notes"
                value={
                    form.risk_notes
                }
                onChange={onChange}
                placeholder="ملاحظات المخاطر"
                rows="4"
                className="mt-5 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-900 focus:ring-2 focus:ring-fuchsia-100"
            />
        </section>
    );
}

function ChildFields({
    form,
    onChange,
}) {
    return (
        <section>
            <SectionTitle
                icon={
                    <Baby
                        size={24}
                    />
                }
                title="بيانات الطفل"
            />

            <div className="grid gap-5 md:grid-cols-2">
                <Input
                    label="اسم ولي الأمر"
                    name="guardian_name"
                    value={
                        form.guardian_name
                    }
                    onChange={onChange}
                />

                <Input
                    label="هاتف ولي الأمر"
                    name="guardian_phone"
                    value={
                        form.guardian_phone
                    }
                    onChange={onChange}
                />

                <Input
                    label="الطول"
                    name="child_height_cm"
                    type="number"
                    value={
                        form.child_height_cm
                    }
                    onChange={onChange}
                />

                <Input
                    label="الوزن"
                    name="child_weight_kg"
                    type="number"
                    value={
                        form.child_weight_kg
                    }
                    onChange={onChange}
                />
            </div>

            <textarea
                name="allergies"
                value={
                    form.allergies
                }
                onChange={onChange}
                placeholder="الحساسيات"
                rows="4"
                className="mt-5 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-900 focus:ring-2 focus:ring-fuchsia-100"
            />

            <textarea
                name="child_notes"
                value={
                    form.child_notes
                }
                onChange={onChange}
                placeholder="ملاحظات"
                rows="4"
                className="mt-5 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-fuchsia-900 focus:ring-2 focus:ring-fuchsia-100"
            />
        </section>
    );
}