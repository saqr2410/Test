
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Activity,
    CalendarDays,
    ClipboardList,
    HeartPulse,
    Pill,
    RefreshCw,
    Ruler,
    ShieldCheck,
    Stethoscope,
    UserRound,
    Weight,
} from "lucide-react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import {
    getMyProfile,
    getFullProfile,
} from "../../../services/patients/patientService";


// =========================================================
// Constants
// =========================================================

const EMPTY_VALUE = "غير مسجل";


// =========================================================
// Helpers
// =========================================================

const unwrapResponse = (response) => {
    let data = response;

    for (let i = 0; i < 3; i += 1) {
        if (
            data &&
            typeof data === "object" &&
            !Array.isArray(data) &&
            data.data &&
            typeof data.data === "object"
        ) {
            data = data.data;
        } else {
            break;
        }
    }

    return data;
};


const normalizeList = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (Array.isArray(value?.results)) {
        return value.results;
    }

    if (Array.isArray(value?.data)) {
        return value.data;
    }

    return [];
};


const getPatientFromResponse = (response) => {
    const data = unwrapResponse(response);

    if (Array.isArray(data)) {
        return data[0] || null;
    }

    if (!data || typeof data !== "object") {
        return null;
    }

    if (data.patient && typeof data.patient === "object") {
        return Array.isArray(data.patient)
            ? data.patient[0] || null
            : data.patient;
    }

    if (Array.isArray(data.results)) {
        return data.results[0] || null;
    }

    return data;
};


const getValue = (
    value,
    fallback = EMPTY_VALUE
) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    return value;
};


const formatDate = (value) => {
    if (!value) {
        return EMPTY_VALUE;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return EMPTY_VALUE;
    }

    return date.toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};


const getGenderLabel = (patient) =>
    patient?.gender_display ||
    patient?.gender ||
    EMPTY_VALUE;


const getPatientTypeLabel = (patient) =>
    patient?.patient_type_display ||
    patient?.patient_type ||
    "ملف صحي";


const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (typeof data?.detail === "string") {
        return data.detail;
    }

    if (typeof data?.message === "string") {
        return data.message;
    }

    if (typeof data === "string") {
        return data;
    }

    return "تعذر تحميل الملف الصحي. حاول مرة أخرى.";
};


// =========================================================
// BMI
// =========================================================

const getBMIStatus = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    const bmi = Number(value);

    if (!Number.isFinite(bmi) || bmi <= 0) {
        return null;
    }

    if (bmi < 18.5) {
        return {
            label: "أقل من الطبيعي",
            classes: "bg-amber-50 text-amber-700",
        };
    }

    if (bmi < 25) {
        return {
            label: "طبيعي",
            classes: "bg-emerald-50 text-emerald-700",
        };
    }

    if (bmi < 30) {
        return {
            label: "أعلى من الطبيعي",
            classes: "bg-orange-50 text-orange-700",
        };
    }

    return {
        label: "مرتفع",
        classes: "bg-red-50 text-red-700",
    };
};


// =========================================================
// Reusable Components
// =========================================================

function PageHeading({
    eyebrow,
    title,
    description,
    icon: Icon = HeartPulse,
}) {
    return (
        <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
                <div
                    className="
                        flex h-12 w-12 items-center justify-center
                        rounded-2xl bg-purple-100 text-[#5B2A86]
                    "
                >
                    <Icon size={24} />
                </div>

                <div>
                    <p
                        className="
                            text-xs font-bold uppercase tracking-wide
                            text-[#5B2A86]
                        "
                    >
                        {eyebrow}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        {description}
                    </p>
                </div>
            </div>

            <h1
                className="
                    text-2xl font-black text-gray-900
                    sm:text-3xl md:text-4xl
                "
            >
                {title}
            </h1>
        </div>
    );
}


function SectionCard({
    title,
    description,
    icon: Icon,
    count,
    children,
}) {
    return (
        <section
            className="
                min-w-0 overflow-hidden rounded-3xl
                border border-gray-100 bg-white shadow-sm
            "
        >
            <div
                className="
                    flex items-center justify-between gap-4
                    border-b border-gray-100 p-5 sm:p-6
                "
            >
                <div className="flex min-w-0 items-center gap-3">
                    <div
                        className="
                            flex h-11 w-11 shrink-0 items-center
                            justify-center rounded-2xl
                            bg-purple-50 text-[#5B2A86]
                        "
                    >
                        <Icon size={22} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="font-black text-gray-900">
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-1 text-xs text-gray-400">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {count !== undefined && (
                    <span
                        className="
                            flex h-8 min-w-8 shrink-0 items-center
                            justify-center rounded-xl bg-purple-50
                            px-2 text-sm font-black text-[#5B2A86]
                        "
                    >
                        {count}
                    </span>
                )}
            </div>

            <div className="p-5 sm:p-6">
                {children}
            </div>
        </section>
    );
}


function EmptyState({
    icon: Icon = ClipboardList,
    message,
}) {
    return (
        <div
            className="
                flex flex-col items-center justify-center
                rounded-2xl bg-gray-50 px-4 py-8 text-center
            "
        >
            <Icon
                size={30}
                className="mb-3 text-gray-300"
            />

            <p className="text-sm text-gray-500">
                {message}
            </p>
        </div>
    );
}


function MetricCard({
    label,
    value,
    unit,
    icon: Icon,
    iconClasses,
    children,
}) {
    return (
        <div
            className="
                rounded-3xl border border-gray-100
                bg-white p-5 shadow-sm sm:p-6
            "
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-500">
                        {label}
                    </p>

                    <div
                        className="
                            mt-3 flex flex-wrap items-baseline gap-2
                        "
                    >
                        <span
                            className="
                                break-words text-3xl font-black
                                text-gray-900
                            "
                        >
                            {value}
                        </span>

                        {unit && (
                            <span className="text-sm font-bold text-gray-400">
                                {unit}
                            </span>
                        )}
                    </div>

                    {children}
                </div>

                <div
                    className={`
                        flex h-12 w-12 shrink-0 items-center
                        justify-center rounded-2xl
                        ${iconClasses}
                    `}
                >
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
}


function DetailItem({
    label,
    value,
}) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return null;
    }

    return (
        <div className="min-w-0 rounded-2xl bg-gray-50 p-4">
            <p className="text-xs font-bold text-gray-400">
                {label}
            </p>

            <p
                className="
                    mt-2 break-words whitespace-pre-wrap
                    text-sm font-bold leading-6 text-gray-800
                "
            >
                {value}
            </p>
        </div>
    );
}


// =========================================================
// Loading State
// =========================================================

function LoadingState() {
    return (
        <div
            dir="rtl"
            className="
                flex min-h-[60vh] items-center
                justify-center bg-[#FAF8FC] px-5
            "
        >
            <div className="w-full max-w-sm text-center">
                <div
                    className="
                        mx-auto mb-5 flex h-16 w-16
                        items-center justify-center rounded-2xl
                        bg-purple-100 text-[#5B2A86]
                    "
                >
                    <HeartPulse
                        size={30}
                        className="animate-pulse"
                    />
                </div>

                <h2 className="text-lg font-black text-gray-800">
                    جاري تحميل الملف الصحي
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                    بنجهز بياناتك الصحية...
                </p>

                <div
                    className="
                        mt-6 h-1.5 overflow-hidden rounded-full
                        bg-purple-100
                    "
                >
                    <div
                        className="
                            h-full w-1/2 animate-pulse
                            rounded-full bg-[#5B2A86]
                        "
                    />
                </div>
            </div>
        </div>
    );
}


// =========================================================
// Error State
// =========================================================

function ErrorState({
    message,
    onRetry,
    retrying,
}) {
    return (
        <div
            dir="rtl"
            className="min-h-[60vh] bg-[#FAF8FC] px-4 py-12"
        >
            <div
                className="
                    mx-auto max-w-xl rounded-3xl border
                    border-red-100 bg-white p-7 text-center shadow-sm
                    sm:p-10
                "
            >
                <div
                    className="
                        mx-auto mb-5 flex h-16 w-16
                        items-center justify-center rounded-2xl
                        bg-red-50 text-red-600
                    "
                >
                    <ShieldCheck size={30} />
                </div>

                <h2 className="text-xl font-black text-gray-900">
                    تعذر تحميل الملف الصحي
                </h2>

                <p
                    className="
                        mx-auto mt-3 max-w-md text-sm
                        leading-7 text-gray-500
                    "
                >
                    {message}
                </p>

                <button
                    type="button"
                    onClick={onRetry}
                    disabled={retrying}
                    className="
                        mt-6 inline-flex items-center
                        justify-center gap-2 rounded-2xl
                        bg-[#5B2A86] px-6 py-3
                        font-bold text-white transition
                        hover:bg-[#4b216f]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >
                    <RefreshCw
                        size={17}
                        className={retrying ? "animate-spin" : ""}
                    />

                    {retrying
                        ? "جاري المحاولة..."
                        : "إعادة المحاولة"}
                </button>
            </div>
        </div>
    );
}


// =========================================================
// No Profile State
// =========================================================

function NoProfileState() {
    return (
        <div
            dir="rtl"
            className="min-h-[60vh] bg-[#FAF8FC] px-4 py-12"
        >
            <div
                className="
                    mx-auto max-w-2xl rounded-3xl border
                    border-gray-100 bg-white p-8 text-center shadow-sm
                    sm:p-12
                "
            >
                <div
                    className="
                        mx-auto mb-6 flex h-20 w-20
                        items-center justify-center rounded-3xl
                        bg-purple-50 text-[#5B2A86]
                    "
                >
                    <HeartPulse size={40} />
                </div>

                <h1 className="text-2xl font-black text-gray-900">
                    لا يوجد ملف صحي حتى الآن
                </h1>

                <p
                    className="
                        mx-auto mt-3 max-w-md text-sm
                        leading-7 text-gray-500
                    "
                >
                    أنشئ ملفك الصحي لتسجيل بياناتك الطبية
                    ومتابعة حالتك الصحية.
                </p>

                <Link
                    to="/patients/create"
                    className="
                        mt-6 inline-flex items-center
                        justify-center gap-2 rounded-2xl
                        bg-[#5B2A86] px-6 py-3
                        font-bold text-white transition
                        hover:bg-[#4b216f]
                    "
                >
                    <HeartPulse size={18} />
                    إنشاء الملف الصحي
                </Link>
            </div>
        </div>
    );
}


// =========================================================
// Patient Information
// =========================================================

function PatientInformation({
    patient,
}) {
    return (
        <section
            className="
                mb-6 rounded-3xl border border-gray-100
                bg-white p-5 shadow-sm sm:p-8
            "
        >
            <div
                className="
                    flex flex-col gap-6
                    md:flex-row md:items-center
                    md:justify-between
                "
            >
                <div className="flex min-w-0 items-center gap-4">
                    <div
                        className="
                            flex h-16 w-16 shrink-0 items-center
                            justify-center rounded-2xl
                            bg-purple-100 text-[#5B2A86]
                        "
                    >
                        <UserRound size={30} />
                    </div>

                    <div className="min-w-0">
                        <h2
                            className="
                                break-words text-xl font-black
                                text-gray-900 sm:text-2xl
                            "
                        >
                            {getValue(patient.name)}
                        </h2>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <span
                                className="
                                    rounded-xl bg-purple-50
                                    px-3 py-1.5 text-xs
                                    font-bold text-[#5B2A86]
                                "
                            >
                                {getPatientTypeLabel(patient)}
                            </span>

                            <span
                                className="
                                    rounded-xl bg-gray-50
                                    px-3 py-1.5 text-xs
                                    font-bold text-gray-600
                                "
                            >
                                {getGenderLabel(patient)}
                            </span>

                            {patient.is_for_child && (
                                <span
                                    className="
                                        rounded-xl bg-amber-50
                                        px-3 py-1.5 text-xs
                                        font-bold text-amber-700
                                    "
                                >
                                    ملف طفل
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className="
                        grid grid-cols-1 gap-3
                        sm:grid-cols-2 md:min-w-[330px]
                    "
                >
                    <DetailItem
                        label="تاريخ الميلاد"
                        value={formatDate(patient.date_of_birth)}
                    />

                    <DetailItem
                        label="تاريخ إنشاء الملف"
                        value={formatDate(patient.created_at)}
                    />
                </div>
            </div>
        </section>
    );
}


// =========================================================
// Chronic Diseases
// =========================================================

function DiseasesSection({
    diseases,
}) {
    return (
        <SectionCard
            title="الأمراض المزمنة"
            description="الحالات الصحية المسجلة"
            icon={HeartPulse}
            count={diseases.length}
        >
            {diseases.length === 0 ? (
                <EmptyState
                    icon={Stethoscope}
                    message="لا توجد أمراض مزمنة مسجلة."
                />
            ) : (
                <div className="space-y-3">
                    {diseases.map((disease, index) => (
                        <div
                            key={disease.id ?? index}
                            className="
                                rounded-2xl border border-gray-100
                                bg-gray-50 p-4
                            "
                        >
                            <h3 className="font-black text-gray-800">
                                {getValue(
                                    disease.disease_name ||
                                    disease.custom_disease_name ||
                                    disease.disease
                                )}
                            </h3>

                            {disease.diagnosed_at && (
                                <p className="mt-2 text-xs text-gray-400">
                                    تاريخ التشخيص:{" "}
                                    {formatDate(disease.diagnosed_at)}
                                </p>
                            )}

                            {disease.notes && (
                                <p
                                    className="
                                        mt-3 whitespace-pre-wrap
                                        text-sm leading-7 text-gray-600
                                    "
                                >
                                    {disease.notes}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}


// =========================================================
// Medications
// =========================================================

function MedicationsSection({
    medications,
}) {
    return (
        <SectionCard
            title="الأدوية"
            description="الأدوية المسجلة في الملف الصحي"
            icon={Pill}
            count={medications.length}
        >
            {medications.length === 0 ? (
                <EmptyState
                    icon={Pill}
                    message="لا توجد أدوية مسجلة."
                />
            ) : (
                <div className="space-y-3">
                    {medications.map((medication, index) => (
                        <div
                            key={medication.id ?? index}
                            className="
                                rounded-2xl border border-gray-100
                                bg-gray-50 p-4
                            "
                        >
                            <h3 className="font-black text-gray-800">
                                {getValue(
                                    medication.product_name ||
                                    medication.name
                                )}
                            </h3>

                            <div
                                className="
                                    mt-3 grid grid-cols-1 gap-2
                                    sm:grid-cols-2
                                "
                            >
                                <DetailItem
                                    label="الجرعة"
                                    value={medication.dosage}
                                />

                                <DetailItem
                                    label="التكرار"
                                    value={medication.frequency}
                                />

                                <DetailItem
                                    label="المدة"
                                    value={
                                        medication.duration_days
                                            ? `${medication.duration_days} يوم`
                                            : null
                                    }
                                />

                                <DetailItem
                                    label="تاريخ البداية"
                                    value={
                                        medication.start_date
                                            ? formatDate(medication.start_date)
                                            : null
                                    }
                                />
                            </div>

                            {medication.instructions && (
                                <p
                                    className="
                                        mt-3 whitespace-pre-wrap
                                        text-sm leading-7 text-gray-600
                                    "
                                >
                                    {medication.instructions}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}


// =========================================================
// Latest Follow-up
// =========================================================

function LatestFollowUpSection({
    followUp,
}) {
    return (
        <SectionCard
            title="آخر متابعة"
            description="أحدث سجل متابعة صحي"
            icon={ClipboardList}
        >
            {!followUp ? (
                <EmptyState
                    icon={CalendarDays}
                    message="لا توجد متابعات صحية مسجلة."
                />
            ) : (
                <div className="space-y-4">
                    <div
                        className="
                            flex flex-wrap items-center
                            justify-between gap-3 rounded-2xl
                            bg-purple-50 p-4
                        "
                    >
                        <span className="text-sm font-bold text-gray-600">
                            تاريخ المتابعة
                        </span>

                        <span className="text-sm font-black text-[#5B2A86]">
                            {formatDate(followUp.follow_up_date)}
                        </span>
                    </div>

                    <div
                        className="
                            grid grid-cols-1 gap-3 sm:grid-cols-2
                        "
                    >
                        <DetailItem
                            label="ضغط الدم"
                            value={followUp.blood_pressure}
                        />

                        <DetailItem
                            label="سكر الدم"
                            value={followUp.blood_glucose}
                        />

                        <DetailItem
                            label="الوزن"
                            value={
                                followUp.weight_kg != null
                                    ? `${followUp.weight_kg} كجم`
                                    : null
                            }
                        />

                        <DetailItem
                            label="الطول"
                            value={
                                followUp.height_cm != null
                                    ? `${followUp.height_cm} سم`
                                    : null
                            }
                        />
                    </div>

                    {followUp.goal && (
                        <div>
                            <p className="mb-2 text-xs font-bold text-gray-400">
                                الهدف
                            </p>

                            <p
                                className="
                                    rounded-2xl bg-gray-50 p-4
                                    text-sm leading-7 text-gray-700
                                "
                            >
                                {followUp.goal}
                            </p>
                        </div>
                    )}

                    {followUp.progress && (
                        <div>
                            <p className="mb-2 text-xs font-bold text-gray-400">
                                التقدم
                            </p>

                            <p
                                className="
                                    rounded-2xl bg-gray-50 p-4
                                    text-sm leading-7 text-gray-700
                                "
                            >
                                {followUp.progress}
                            </p>
                        </div>
                    )}

                    {followUp.recommendations && (
                        <div>
                            <p className="mb-2 text-xs font-bold text-gray-400">
                                التوصيات
                            </p>

                            <p
                                className="
                                    rounded-2xl bg-purple-50 p-4
                                    text-sm leading-7 text-gray-700
                                "
                            >
                                {followUp.recommendations}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </SectionCard>
    );
}


// =========================================================
// Medical Advice
// =========================================================

function AdvicesSection({
    advices,
}) {
    return (
        <SectionCard
            title="النصائح الطبية"
            description="النصائح المسجلة في الملف"
            icon={Stethoscope}
            count={advices.length}
        >
            {advices.length === 0 ? (
                <EmptyState
                    icon={Stethoscope}
                    message="لا توجد نصائح طبية مسجلة."
                />
            ) : (
                <div className="space-y-3">
                    {advices.map((advice, index) => (
                        <div
                            key={advice.id ?? index}
                            className="
                                rounded-2xl border border-gray-100
                                bg-gray-50 p-4
                            "
                        >
                            {advice.title && (
                                <h3 className="mb-2 font-black text-gray-800">
                                    {advice.title}
                                </h3>
                            )}

                            <p
                                className="
                                    whitespace-pre-wrap text-sm
                                    leading-7 text-gray-600
                                "
                            >
                                {getValue(
                                    advice.content ||
                                    advice.advice ||
                                    advice.notes ||
                                    advice.description
                                )}
                            </p>

                            {(advice.created_at ||
                                advice.created_by_name) && (
                                    <p className="mt-3 text-xs text-gray-400">
                                        {advice.created_by_name || "النظام"}

                                        {advice.created_at && (
                                            <>
                                                {" · "}
                                                {formatDate(advice.created_at)}
                                            </>
                                        )}
                                    </p>
                                )}
                        </div>
                    ))}
                </div>
            )}
        </SectionCard>
    );
}


// =========================================================
// Main Page
// =========================================================

export default function HealthProfile() {
    const [patient, setPatient] = useState(null);
    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMyProfile();

            if (!response) {
                setPatient(null);
                setProfile(null);
                return;
            }

            const patientData = getPatientFromResponse(response);

            if (
                !patientData ||
                typeof patientData !== "object" ||
                Array.isArray(patientData) ||
                !patientData.id
            ) {
                setPatient(null);
                setProfile(null);
                return;
            }

            setPatient(patientData);

            const fullResponse = await getFullProfile(
                patientData.id
            );

            const fullData = unwrapResponse(fullResponse);

            setProfile(
                fullData && typeof fullData === "object"
                    ? fullData
                    : null
            );
        } catch (err) {
            console.error("HEALTH PROFILE ERROR:", err);

            // لا يوجد ملف صحي
            if (err?.response?.status === 404) {
                setPatient(null);
                setProfile(null);
                setError("");
                return;
            }

            setError(getErrorMessage(err));

            toast.error("تعذر تحميل بيانات الملف الصحي.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const diseases = useMemo(
        () => normalizeList(profile?.diseases),
        [profile]
    );

    const medications = useMemo(
        () => normalizeList(profile?.medications),
        [profile]
    );

    const followUps = useMemo(
        () => normalizeList(
            profile?.follow_ups ??
            profile?.followups
        ),
        [profile]
    );

    const advices = useMemo(
        () => normalizeList(profile?.advices),
        [profile]
    );

    const latestFollowUp = useMemo(() => {
        if (followUps.length === 0) {
            return null;
        }

        return [...followUps].sort((a, b) => {
            const dateA = new Date(
                a.follow_up_date || a.created_at || 0
            ).getTime();

            const dateB = new Date(
                b.follow_up_date || b.created_at || 0
            ).getTime();

            return dateB - dateA;
        })[0];
    }, [followUps]);

    const fitness = profile?.fitness || null;

    const weight =
        latestFollowUp?.weight_kg ??
        fitness?.weight_kg ??
        fitness?.weight ??
        null;

    const height =
        latestFollowUp?.height_cm ??
        fitness?.height_cm ??
        fitness?.height ??
        null;

    const bmi =
        latestFollowUp?.bmi ??
        (
            weight && height
                ? Number(
                    (
                        Number(weight) /
                        ((Number(height) / 100) ** 2)
                    ).toFixed(1)
                )
                : null
        );

    const bmiStatus = getBMIStatus(bmi);

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={loadProfile}
                retrying={loading}
            />
        );
    }

    if (!patient) {
        return <NoProfileState />;
    }

    return (
        <main
            dir="rtl"
            className="
                min-h-screen bg-[#FAF8FC]
                py-8 sm:py-10 md:py-14
            "
        >
            <div
                className="
                    mx-auto max-w-6xl px-4
                    sm:px-6 lg:px-8
                "
            >
                <PageHeading
                    eyebrow="حسابي"
                    title="ملفي الصحي"
                    description="بياناتك الطبية وقياساتك وسجل المتابعة"
                />

                <PatientInformation patient={patient} />

                {/* Health Metrics */}

                <section
                    aria-label="القياسات الصحية"
                    className="
                        mb-6 grid grid-cols-1 gap-4
                        sm:grid-cols-2 lg:grid-cols-3
                    "
                >
                    <MetricCard
                        label="الوزن"
                        value={getValue(weight, "--")}
                        unit="كجم"
                        icon={Weight}
                        iconClasses="bg-blue-50 text-blue-600"
                    />

                    <MetricCard
                        label="الطول"
                        value={getValue(height, "--")}
                        unit="سم"
                        icon={Ruler}
                        iconClasses="bg-emerald-50 text-emerald-600"
                    />

                    <MetricCard
                        label="مؤشر كتلة الجسم"
                        value={getValue(bmi, "--")}
                        icon={Activity}
                        iconClasses="bg-purple-50 text-[#5B2A86]"
                    >
                        {bmiStatus && (
                            <span
                                className={`
                                    mt-3 inline-flex rounded-lg
                                    px-2.5 py-1 text-xs font-bold
                                    ${bmiStatus.classes}
                                `}
                            >
                                {bmiStatus.label}
                            </span>
                        )}
                    </MetricCard>
                </section>

                {/* Medical Information */}

                <div
                    className="
                        grid grid-cols-1 items-start gap-6
                        lg:grid-cols-2
                    "
                >
                    <DiseasesSection diseases={diseases} />

                    <MedicationsSection medications={medications} />

                    <LatestFollowUpSection
                        followUp={latestFollowUp}
                    />

                    <AdvicesSection advices={advices} />
                </div>

                {/* Footer */}

                <section
                    className="
                        mt-6 rounded-3xl border
                        border-purple-100 bg-white p-5
                        shadow-sm sm:p-7
                    "
                >
                    <div className="flex items-start gap-4">
                        <div
                            className="
                                flex h-12 w-12 shrink-0
                                items-center justify-center
                                rounded-2xl bg-purple-50
                                text-[#5B2A86]
                            "
                        >
                            <HeartPulse size={24} />
                        </div>

                        <div>
                            <h2 className="font-black text-gray-900">
                                حافظ على تحديث ملفك الصحي
                            </h2>

                            <p
                                className="
                                    mt-2 max-w-xl text-sm
                                    leading-7 text-gray-500
                                "
                            >
                                راجع بياناتك الطبية بانتظام،
                                وتأكد من تسجيل المعلومات الصحية
                                الصحيحة عند الحاجة.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
