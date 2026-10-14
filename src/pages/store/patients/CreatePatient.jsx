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
    ArrowRightLeft,
    Loader2,
    Stethoscope,
    Search,
    Droplets,
    Utensils,
    Weight,
    FileText,
    ShieldCheck,
} from "lucide-react";

import {
    createPatient,
    getPatientDetails,
    updateFitnessProfile,
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
    address: "",
    allergies: "",
    medical_notes: "",

    height_cm: "",
    weight_kg: "",
    fitness_goal: "",
    activity_level: "",
    notes: "",
    dietary_preferences: "",
    exercise_routine: "",
    food_allergies: "",
    goal: "",
    meals_per_day: "",
    nutrition_notes: "",
    target_weight_kg: "",
    water_intake_liters: "",

    last_menstrual_period: "",
    expected_due_date: "",
    pregnancy_week: "",
    pregnancy_notes: "",
    risk_notes: "",

    child_height_cm: "",
    child_weight_kg: "",
    child_notes: "",

    chronic_disease: "",
    custom_disease_name: "",
    chronic_notes: "",
    diagnosed_at: "",
};

const PATIENT_TYPES = [
    {
        value: "FITNESS",
        label: "اللياقة والتغذية",
        description: "متابعة الوزن والنشاط والنظام الغذائي",
        icon: Activity,
    },
    {
        value: "CHRONIC",
        label: "الأمراض المزمنة",
        description: "تسجيل الأمراض المزمنة ومتابعتها",
        icon: Stethoscope,
    },
    {
        value: "PREGNANCY",
        label: "متابعة الحمل",
        description: "بيانات الحمل ومواعيد المتابعة",
        icon: HeartPulse,
    },
    {
        value: "CHILD",
        label: "ملف طفل",
        description: "متابعة بيانات الطفل الصحية",
        icon: Baby,
    },
];

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

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const getErrorMessage = (error) => {
        const data = error?.response?.data;

        if (!data) {
            return "تعذر إنشاء الملف الصحي. حاول مرة أخرى.";
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

        const firstError = Object.values(data)[0];

        if (Array.isArray(firstError)) {
            return String(firstError[0]);
        }

        if (typeof firstError === "string") {
            return firstError;
        }

        return "راجع البيانات المدخلة وحاول مرة أخرى.";
    };

    useEffect(() => {
        if (form.patient_type !== "CHRONIC") {
            setChronicDiseases([]);
            return;
        }

        let active = true;

        const loadDiseases = async () => {
            setChronicDiseasesLoading(true);

            try {
                const response = await getChronicDiseases();

                const items = Array.isArray(response)
                    ? response
                    : response?.results ||
                    response?.data ||
                    [];

                if (active) {
                    setChronicDiseases(items);
                }
            } catch (error) {
                console.error("CHRONIC DISEASES ERROR:", error);

                if (active) {
                    toast.error("تعذر تحميل قائمة الأمراض المزمنة.");
                }
            } finally {
                if (active) {
                    setChronicDiseasesLoading(false);
                }
            }
        };

        loadDiseases();

        return () => {
            active = false;
        };
    }, [form.patient_type]);

    const updateProfileAfterCreation = async (patient) => {
        const profile = await getPatientDetails(patient.id);

        if (patient.patient_type === "FITNESS" && profile?.fitness) {
            const data = {};
            const fitnessFields = [
                "height_cm",
                "weight_kg",
                "fitness_goal",
                "activity_level",
                "dietary_preferences",
                "exercise_routine",
                "food_allergies",
                "goal",
                "meals_per_day",
                "nutrition_notes",
                "target_weight_kg",
                "water_intake_liters",
            ];

            fitnessFields.forEach((field) => {
                const value = form[field];

                if (value !== "" && value !== null && value !== undefined) {
                    data[field] =
                        typeof value === "string" ? value.trim() : value;
                }
            });

            if (form.notes.trim()) {
                data.notes = form.notes.trim();
            }

            if (Object.keys(data).length > 0) {
                await updateFitnessProfile(profile.fitness.id, data);
            }
        }

        if (patient.patient_type === "PREGNANCY" && profile?.pregnancy) {
            const data = {};

            if (form.last_menstrual_period) {
                data.last_menstrual_period = form.last_menstrual_period;
            }

            if (form.expected_due_date) {
                data.expected_due_date = form.expected_due_date;
            }

            if (form.pregnancy_week !== "") {
                data.pregnancy_week = form.pregnancy_week;
            }

            if (form.pregnancy_notes.trim()) {
                data.notes = form.pregnancy_notes.trim();
            }

            if (form.risk_notes.trim()) {
                data.risk_notes = form.risk_notes.trim();
            }

            if (Object.keys(data).length > 0) {
                await updatePregnancyProfile(profile.pregnancy.id, data);
            }
        }

        if (patient.patient_type === "CHILD" && profile?.child) {
            const data = {};

            if (form.child_height_cm !== "") {
                data.height_cm = form.child_height_cm;
            }

            if (form.child_weight_kg !== "") {
                data.weight_kg = form.child_weight_kg;
            }

            if (form.child_notes.trim()) {
                data.notes = form.child_notes.trim();
            }

            if (Object.keys(data).length > 0) {
                await updateChildProfile(profile.child.id, data);
            }
        }

        if (patient.patient_type === "CHRONIC") {
            const hasDisease = Boolean(form.chronic_disease);
            const customDisease = form.custom_disease_name.trim();

            if (hasDisease || customDisease) {
                await createPatientDisease({
                    patient: patient.id,
                    disease: form.chronic_disease || null,
                    custom_disease_name: customDisease || null,
                    notes: form.chronic_notes.trim() || null,
                    diagnosed_at: form.diagnosed_at || null,
                });
            }
        }

        return profile;
    };

    const validateForm = () => {
        if (!form.name.trim()) {
            toast.error("اكتب اسم صاحب الملف الصحي.");
            return false;
        }

        if (!form.patient_type) {
            toast.error("اختر نوع الملف الصحي.");
            return false;
        }

        if (form.phone.trim() && !/^\d{11}$/.test(form.phone.trim())) {
            toast.error("رقم الهاتف يجب أن يتكون من 11 رقمًا.");
            return false;
        }

        if (
            form.patient_type === "CHRONIC" &&
            !form.chronic_disease &&
            !form.custom_disease_name.trim()
        ) {
            toast.error("اختر مرضًا مزمنًا أو اكتب اسم المرض.");
            return false;
        }

        if (
            form.patient_type === "CHRONIC" &&
            form.chronic_disease &&
            form.custom_disease_name.trim()
        ) {
            toast.error("اختر مرضًا من القائمة أو اكتب اسمًا مخصصًا، وليس الاثنين.");
            return false;
        }

        if (
            form.pregnancy_week !== "" &&
            (Number(form.pregnancy_week) < 1 ||
                Number(form.pregnancy_week) > 45)
        ) {
            toast.error("أسبوع الحمل يجب أن يكون بين 1 و45.");
            return false;
        }

        if (
            form.meals_per_day !== "" &&
            Number(form.meals_per_day) < 1
        ) {
            toast.error("عدد الوجبات يجب أن يكون رقمًا صحيحًا موجبًا.");
            return false;
        }

        if (
            form.water_intake_liters !== "" &&
            Number(form.water_intake_liters) < 0
        ) {
            toast.error("كمية المياه لا يمكن أن تكون سالبة.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const patientData = {
                name: form.name.trim(),
                phone: form.phone.trim() || null,
                date_of_birth: form.date_of_birth || null,
                gender: form.gender || null,
                patient_type: form.patient_type,
                is_for_child: form.patient_type === "CHILD",
                address: form.address.trim() || null,
                allergies: form.allergies.trim(),
                medical_notes: form.medical_notes.trim(),
            };

            const patient = await createPatient(patientData);

            await updateProfileAfterCreation(patient);

            toast.success("تم إنشاء الملف الصحي بنجاح.");

            navigate(`/patients/${patient.id}/profile`);
        } catch (error) {
            console.error("CREATE PATIENT ERROR:", error);
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const selectedType = PATIENT_TYPES.find(
        (item) => item.value === form.patient_type
    );

    return (
        <div dir="rtl" className="min-h-screen bg-slate-50/80 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-fuchsia-900"
                >
                    <ArrowRight size={18} />
                    العودة
                </button>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <header className="relative overflow-hidden bg-gradient-to-l from-fuchsia-950 via-purple-900 to-slate-900 px-6 py-8 text-white sm:px-9 sm:py-10">
                        <div className="absolute -left-12 -top-16 h-48 w-48 rounded-full bg-white/5" />
                        <div className="absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-fuchsia-400/10" />

                        <div className="relative flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                                <HeartPulse size={30} />
                            </div>

                            <div>
                                <p className="mb-1 text-sm font-medium text-purple-200">
                                    إدارة الملفات الصحية
                                </p>

                                <h1 className="text-2xl font-bold sm:text-3xl">
                                    إنشاء ملف صحي جديد
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                                    أدخل البيانات الأساسية، ثم اختر نوع الملف
                                    وأضف التفاصيل الصحية المناسبة.
                                </p>
                            </div>
                        </div>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-9 p-5 sm:p-8">
                        <section>
                            <SectionTitle
                                icon={<User size={21} />}
                                title="البيانات الأساسية"
                                subtitle="بيانات صاحب الملف ومعلومات التواصل"
                            />

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Input
                                    label="الاسم بالكامل"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    icon={<User size={18} />}
                                    required
                                    placeholder="اكتب الاسم بالكامل"
                                />

                                <Input
                                    label="رقم الهاتف"
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    icon={<Phone size={18} />}
                                    placeholder="01XXXXXXXXX"
                                />

                                <Input
                                    label="تاريخ الميلاد"
                                    name="date_of_birth"
                                    type="date"
                                    value={form.date_of_birth}
                                    onChange={handleChange}
                                    icon={<Calendar size={18} />}
                                />

                                <Select
                                    label="النوع"
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    options={[
                                        { value: "MALE", label: "ذكر" },
                                        { value: "FEMALE", label: "أنثى" },
                                    ]}
                                />

                                <div className="sm:col-span-2">
                                    <Input
                                        label="العنوان"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        icon={<MapPin size={18} />}
                                        placeholder="المنطقة والعنوان بالتفصيل"
                                    />
                                </div>
                            </div>
                        </section>

                        <Divider />

                        <section>
                            <SectionTitle
                                icon={<ShieldCheck size={21} />}
                                title="نوع الملف الصحي"
                                subtitle="اختر النوع المناسب لعرض الحقول الخاصة به"
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                                {PATIENT_TYPES.map((type) => {
                                    const Icon = type.icon;
                                    const isSelected =
                                        form.patient_type === type.value;

                                    return (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() =>
                                                setForm((previous) => ({
                                                    ...previous,
                                                    patient_type: type.value,
                                                }))
                                            }
                                            className={`flex min-h-28 items-start gap-4 rounded-2xl border p-4 text-right transition ${isSelected
                                                ? "border-fuchsia-800 bg-fuchsia-50 ring-2 ring-fuchsia-100"
                                                : "border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50"
                                                }`}
                                        >
                                            <span
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isSelected
                                                    ? "bg-fuchsia-900 text-white"
                                                    : "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                <Icon size={22} />
                                            </span>

                                            <span className="flex-1">
                                                <span className="block font-bold text-slate-800">
                                                    {type.label}
                                                </span>

                                                <span className="mt-1 block text-sm leading-6 text-slate-500">
                                                    {type.description}
                                                </span>
                                            </span>

                                            <span
                                                className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${isSelected
                                                    ? "border-fuchsia-900 bg-fuchsia-900 ring-2 ring-fuchsia-200"
                                                    : "border-slate-300"
                                                    }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {selectedType && (
                            <>
                                <Divider />

                                {form.patient_type === "FITNESS" && (
                                    <FitnessFields
                                        form={form}
                                        onChange={handleChange}
                                    />
                                )}

                                {form.patient_type === "CHRONIC" && (
                                    <ChronicFields
                                        form={form}
                                        onChange={handleChange}
                                        diseases={chronicDiseases}
                                        loading={chronicDiseasesLoading}
                                    />
                                )}

                                {form.patient_type === "PREGNANCY" && (
                                    <PregnancyFields
                                        form={form}
                                        onChange={handleChange}
                                    />
                                )}

                                {form.patient_type === "CHILD" && (
                                    <ChildFields
                                        form={form}
                                        onChange={handleChange}
                                    />
                                )}
                            </>
                        )}

                        <Divider />

                        <section>
                            <SectionTitle
                                icon={<FileText size={21} />}
                                title="معلومات صحية إضافية"
                                subtitle="يمكن ترك هذه الحقول فارغة وإكمالها لاحقًا"
                            />

                            <div className="grid gap-5 sm:grid-cols-2">
                                <TextArea
                                    label="الحساسية"
                                    name="allergies"
                                    value={form.allergies}
                                    onChange={handleChange}
                                    placeholder="الأدوية أو الأطعمة التي تسبب الحساسية..."
                                />

                                <TextArea
                                    label="ملاحظات طبية"
                                    name="medical_notes"
                                    value={form.medical_notes}
                                    onChange={handleChange}
                                    placeholder="أي معلومات طبية إضافية مهمة..."
                                />
                            </div>
                        </section>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                إلغاء
                            </button>

                            <button
                                type="submit"
                                disabled={loading || !form.patient_type}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-fuchsia-950 px-7 py-3 font-bold text-white shadow-sm transition hover:bg-fuchsia-900 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />
                                        جاري حفظ الملف...
                                    </>
                                ) : (
                                    <>
                                        حفظ الملف الصحي
                                        <ArrowRight size={19} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-4 text-center text-xs leading-6 text-slate-400">
                    تأكد من صحة البيانات المدخلة قبل حفظ الملف الصحي.
                </p>
            </div>
        </div>
    );
}

function SectionTitle({ icon, title, subtitle }) {
    return (
        <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-fuchsia-900">
                {icon}
            </div>

            <div>
                <h2 className="font-bold text-slate-800">{title}</h2>
                {subtitle && (
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

function Divider() {
    return <div className="h-px bg-slate-100" />;
}

function Input({
    label,
    name,
    value,
    onChange,
    type = "text",
    icon,
    required = false,
    placeholder = "",
    min,
    max,
    step,
}) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-semibold text-slate-700"
            >
                {label}
                {required && <span className="mr-1 text-red-500">*</span>}
            </label>

            <div className="relative">
                {icon && (
                    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {icon}
                    </span>
                )}

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    step={step}
                    className={`w-full rounded-xl border border-slate-200 bg-white py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-fuchsia-800 focus:ring-4 focus:ring-fuchsia-50 ${icon ? "pl-4 pr-10" : "px-4"
                        }`}
                />
            </div>
        </div>
    );
}

function Select({ label, name, value, onChange, options }) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-semibold text-slate-700"
            >
                {label}
            </label>

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-fuchsia-800 focus:ring-4 focus:ring-fuchsia-50"
            >
                <option value="">اختر</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function TextArea({ label, name, value, onChange, placeholder }) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-semibold text-slate-700"
            >
                {label}
            </label>

            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={4}
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-fuchsia-800 focus:ring-4 focus:ring-fuchsia-50"
            />
        </div>
    );
}

function FitnessFields({ form, onChange }) {
    return (
        <section>
            <SectionTitle
                icon={<Activity size={21} />}
                title="بيانات اللياقة والتغذية"
                subtitle="بيانات الجسم والأهداف والعادات الغذائية"
            />

            <div className="grid gap-5 sm:grid-cols-2">
                <Input
                    label="الطول بالسنتيمتر"
                    name="height_cm"
                    type="number"
                    min="1"
                    step="0.1"
                    value={form.height_cm}
                    onChange={onChange}
                    icon={<Activity size={18} />}
                    placeholder="مثال: 175"
                />

                <Input
                    label="الوزن بالكيلوجرام"
                    name="weight_kg"
                    type="number"
                    min="1"
                    step="0.1"
                    value={form.weight_kg}
                    onChange={onChange}
                    icon={<Weight size={18} />}
                    placeholder="مثال: 80"
                />

                <Input
                    label="الوزن المستهدف"
                    name="target_weight_kg"
                    type="number"
                    min="1"
                    step="0.1"
                    value={form.target_weight_kg}
                    onChange={onChange}
                    placeholder="الوزن المطلوب الوصول إليه"
                />

                <Input
                    label="مستوى النشاط"
                    name="activity_level"
                    value={form.activity_level}
                    onChange={onChange}
                    placeholder="مثال: منخفض، متوسط، مرتفع"
                />

                <Input
                    label="هدف اللياقة"
                    name="fitness_goal"
                    value={form.fitness_goal}
                    onChange={onChange}
                    placeholder="مثال: زيادة الكتلة العضلية"
                />

                <Input
                    label="الهدف الغذائي"
                    name="goal"
                    value={form.goal}
                    onChange={onChange}
                    placeholder="مثال: خسارة الوزن"
                />

                <Input
                    label="عدد الوجبات يوميًا"
                    name="meals_per_day"
                    type="number"
                    min="1"
                    step="1"
                    value={form.meals_per_day}
                    onChange={onChange}
                    icon={<Utensils size={18} />}
                    placeholder="مثال: 3"
                />

                <Input
                    label="كمية المياه يوميًا باللتر"
                    name="water_intake_liters"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.water_intake_liters}
                    onChange={onChange}
                    icon={<Droplets size={18} />}
                    placeholder="مثال: 2.5"
                />
            </div>

            <div className="mt-5 grid gap-5">
                <TextArea
                    label="التفضيلات الغذائية"
                    name="dietary_preferences"
                    value={form.dietary_preferences}
                    onChange={onChange}
                    placeholder="الأطعمة المفضلة أو النظام الغذائي المتبع..."
                />

                <TextArea
                    label="الحساسية الغذائية"
                    name="food_allergies"
                    value={form.food_allergies}
                    onChange={onChange}
                    placeholder="أي أطعمة تسبب الحساسية..."
                />

                <TextArea
                    label="التمارين الرياضية"
                    name="exercise_routine"
                    value={form.exercise_routine}
                    onChange={onChange}
                    placeholder="نوع التمارين وعدد مرات ممارستها..."
                />

                <TextArea
                    label="ملاحظات اللياقة والتغذية"
                    name="nutrition_notes"
                    value={form.nutrition_notes}
                    onChange={onChange}
                    placeholder="ملاحظات إضافية..."
                />

                <TextArea
                    label="ملاحظات عامة"
                    name="notes"
                    value={form.notes}
                    onChange={onChange}
                    placeholder="أي تفاصيل إضافية عن الحالة..."
                />
            </div>
        </section>
    );
}

function ChronicFields({ form, onChange, diseases, loading }) {
    const handleDiseaseChange = (event) => {
        const { value } = event.target;

        onChange(event);

        if (value) {
            onChange({
                target: {
                    name: "custom_disease_name",
                    value: "",
                    type: "text",
                },
            });
        }
    };

    const handleCustomDiseaseChange = (event) => {
        const { value } = event.target;

        onChange(event);

        if (value.trim()) {
            onChange({
                target: {
                    name: "chronic_disease",
                    value: "",
                    type: "text",
                },
            });
        }
    };

    return (
        <section>
            <SectionTitle
                icon={<Stethoscope size={21} />}
                title="بيانات الأمراض المزمنة"
                subtitle="حدد المرض وتاريخ التشخيص وأي ملاحظات مهمة"
            />

            <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <div>
                    <label
                        htmlFor="chronic_disease"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        المرض المزمن
                    </label>

                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <select
                            id="chronic_disease"
                            name="chronic_disease"
                            value={form.chronic_disease}
                            onChange={handleDiseaseChange}
                            disabled={loading}
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm outline-none transition focus:border-fuchsia-800 focus:ring-4 focus:ring-fuchsia-50 disabled:bg-slate-100"
                        >
                            <option value="">اختر مرضًا من القائمة</option>

                            {diseases.map((disease) => (
                                <option
                                    key={disease.id}
                                    value={disease.id}
                                >
                                    {disease.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {loading && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                            <Loader2
                                size={15}
                                className="animate-spin"
                            />
                            جاري تحميل الأمراض...
                        </p>
                    )}

                    {!loading && diseases.length === 0 && (
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            يمكنك كتابة اسم المرض يدويًا إذا لم يكن موجودًا بالقائمة.
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-medium text-slate-400">
                        أو اكتب اسم المرض
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                </div>

                <Input
                    label="اسم مرض مخصص"
                    name="custom_disease_name"
                    value={form.custom_disease_name}
                    onChange={handleCustomDiseaseChange}
                    placeholder="اكتب اسم المرض"
                />

                <Input
                    label="تاريخ التشخيص"
                    name="diagnosed_at"
                    type="date"
                    value={form.diagnosed_at}
                    onChange={onChange}
                    icon={<Calendar size={18} />}
                />

                <TextArea
                    label="ملاحظات عن المرض"
                    name="chronic_notes"
                    value={form.chronic_notes}
                    onChange={onChange}
                    placeholder="الأعراض أو الملاحظات الطبية المهمة..."
                />
            </div>
        </section>
    );
}

function PregnancyFields({ form, onChange }) {
    return (
        <section>
            <SectionTitle
                icon={<HeartPulse size={21} />}
                title="بيانات الحمل"
                subtitle="مواعيد الحمل والأسبوع الحالي والملاحظات"
            />

            <div className="grid gap-5 sm:grid-cols-2">
                <Input
                    label="تاريخ آخر دورة شهرية"
                    name="last_menstrual_period"
                    type="date"
                    value={form.last_menstrual_period}
                    onChange={onChange}
                    icon={<Calendar size={18} />}
                />

                <Input
                    label="موعد الولادة المتوقع"
                    name="expected_due_date"
                    type="date"
                    value={form.expected_due_date}
                    onChange={onChange}
                    icon={<Calendar size={18} />}
                />

                <Input
                    label="أسبوع الحمل الحالي"
                    name="pregnancy_week"
                    type="number"
                    min="1"
                    max="45"
                    value={form.pregnancy_week}
                    onChange={onChange}
                    placeholder="مثال: 20"
                />
            </div>

            <div className="mt-5 grid gap-5">
                <TextArea
                    label="ملاحظات الحمل"
                    name="pregnancy_notes"
                    value={form.pregnancy_notes}
                    onChange={onChange}
                    placeholder="ملاحظات المتابعة..."
                />

                <TextArea
                    label="ملاحظات المخاطر"
                    name="risk_notes"
                    value={form.risk_notes}
                    onChange={onChange}
                    placeholder="أي مخاطر أو تنبيهات مسجلة..."
                />
            </div>
        </section>
    );
}

function ChildFields({ form, onChange }) {
    return (
        <section>
            <SectionTitle
                icon={<Baby size={21} />}
                title="بيانات الطفل"
                subtitle="الطول والوزن والمعلومات الصحية الخاصة بالطفل"
            />

            <div className="grid gap-5 sm:grid-cols-2">
                <Input
                    label="طول الطفل بالسنتيمتر"
                    name="child_height_cm"
                    type="number"
                    min="1"
                    step="0.1"
                    value={form.child_height_cm}
                    onChange={onChange}
                    placeholder="مثال: 110"
                />

                <Input
                    label="وزن الطفل بالكيلوجرام"
                    name="child_weight_kg"
                    type="number"
                    min="1"
                    step="0.1"
                    value={form.child_weight_kg}
                    onChange={onChange}
                    placeholder="مثال: 20"
                />
            </div>

            <div className="mt-5">
                <TextArea
                    label="ملاحظات الطفل"
                    name="child_notes"
                    value={form.child_notes}
                    onChange={onChange}
                    placeholder="ملاحظات النمو أو أي معلومات مهمة..."
                />
            </div>
        </section>
    );
}
