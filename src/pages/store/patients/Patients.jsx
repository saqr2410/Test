import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    Activity,
    Baby,
    Calendar,
    ChevronLeft,
    ClipboardList,
    HeartPulse,
    MapPin,
    Plus,
    RefreshCw,
    Search,
    ShieldAlert,
    UserRound,
    Users,
    X,
} from "lucide-react";

import toast from "react-hot-toast";

import patientService from "../../../services/patients/patientService";

import Loading from "../../../components/ui/feedback/Loading";

import EmptyState from "../../../components/ui/feedback/EmptyState";


const PATIENT_TYPES = [
    {
        value: "FITNESS",
        label: "اللياقة والتغذية",
        icon: Activity,
        color: "violet",
    },
    {
        value: "CHRONIC",
        label: "الأمراض المزمنة",
        icon: HeartPulse,
        color: "rose",
    },
    {
        value: "PREGNANCY",
        label: "متابعة الحمل",
        icon: HeartPulse,
        color: "pink",
    },
    {
        value: "CHILD",
        label: "صحة الطفل",
        icon: Baby,
        color: "amber",
    },
];


const getPatientType = (type) => {
    return (
        PATIENT_TYPES.find((item) => item.value === type) || {
            label: type || "ملف صحي",
            icon: UserRound,
            color: "slate",
        }
    );
};


const getArray = (data) => {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.results)) {
        return data.results;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
};


const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};


const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (data?.detail) {
        return data.detail;
    }

    if (data?.message) {
        return data.message;
    }

    if (data?.error) {
        return data.error;
    }

    return "تعذر تحميل الملفات الصحية. حاول مرة أخرى.";
};


export default function Patients() {
    const [patients, setPatients] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [type, setType] = useState("");

    const [requestError, setRequestError] = useState(false);


    const loadPatients = useCallback(async () => {
        try {
            setLoading(true);
            setRequestError(false);

            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (type) {
                params.patient_type = type;
            }

            const response =
                await patientService.getPatients(params);

            const data = response?.data ?? response;

            setPatients(getArray(data));
        } catch (error) {
            setRequestError(true);

            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }, [search, type]);


    useEffect(() => {
        let active = true;

        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                setRequestError(false);

                const params = {};

                if (search.trim()) {
                    params.search = search.trim();
                }

                if (type) {
                    params.patient_type = type;
                }

                const response =
                    await patientService.getPatients(params);

                if (!active) {
                    return;
                }

                const data = response?.data ?? response;

                setPatients(getArray(data));
            } catch (error) {
                if (!active) {
                    return;
                }

                setRequestError(true);

                toast.error(getErrorMessage(error));
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }, 300);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [search, type]);


    const clearFilters = () => {
        setSearch("");
        setType("");
    };


    const hasFilters = Boolean(search.trim() || type);


    if (loading && patients.length === 0 && !requestError) {
        return (
            <div
                dir="rtl"
                className="min-h-[60vh] p-6"
            >
                <Loading />
            </div>
        );
    }


    return (
        <main
            dir="rtl"
            className="min-h-screen space-y-6 bg-slate-50/70 p-4 sm:p-6 lg:p-8"
        >
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Page header */}
                <header className="
                    flex flex-col gap-4
                    sm:flex-row sm:items-center sm:justify-between
                ">
                    <div>
                        <div className="
                            mb-2 flex items-center gap-2
                            text-xs font-semibold text-violet-600
                        ">
                            <ClipboardList size={15} />
                            إدارة المرضى
                        </div>

                        <h1 className="
                            text-2xl font-bold tracking-tight
                            text-slate-900 sm:text-3xl
                        ">
                            الملفات الصحية
                        </h1>

                        <p className="
                            mt-2 max-w-2xl text-sm leading-6
                            text-slate-500
                        ">
                            إدارة بيانات المرضى، ومتابعة المعلومات
                            الصحية والتاريخ الطبي من مكان واحد.
                        </p>
                    </div>

                    <Link
                        to="/patients/create"
                        className="
                            inline-flex items-center justify-center
                            gap-2 rounded-xl bg-violet-600
                            px-5 py-3 text-sm font-semibold
                            text-white shadow-sm transition
                            hover:bg-violet-700
                            focus:outline-none focus:ring-4
                            focus:ring-violet-100
                        "
                    >
                        <Plus size={19} />
                        إنشاء ملف صحي
                    </Link>
                </header>


                {/* Summary */}
                <section className="
                    grid gap-4 sm:grid-cols-2
                ">
                    <SummaryCard
                        icon={Users}
                        title="إجمالي الملفات المعروضة"
                        value={patients.length}
                        description={
                            hasFilters
                                ? "نتائج البحث الحالي"
                                : "الملفات الصحية المسترجعة"
                        }
                    />

                    <SummaryCard
                        icon={HeartPulse}
                        title="نوع الملف"
                        value={
                            type
                                ? getPatientType(type).label
                                : "كل الأنواع"
                        }
                        description={
                            type
                                ? "تم تطبيق فلتر نوع الملف"
                                : "يمكنك التصفية حسب نوع الملف"
                        }
                    />
                </section>


                {/* Search and filters */}
                <section className="
                    rounded-2xl border border-slate-200
                    bg-white p-4 shadow-sm sm:p-5
                ">
                    <div className="
                        mb-4 flex items-center gap-2
                    ">
                        <Search
                            size={18}
                            className="text-violet-600"
                        />

                        <h2 className="
                            text-sm font-bold text-slate-800
                        ">
                            البحث والتصفية
                        </h2>
                    </div>

                    <div className="
                        grid gap-4 md:grid-cols-[minmax(0,1fr)_250px_auto]
                    ">
                        <div className="relative">
                            <Search
                                size={18}
                                className="
                                    absolute right-4 top-1/2
                                    -translate-y-1/2 text-slate-400
                                "
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                }}
                                placeholder="ابحث بالاسم أو رقم الهاتف..."
                                aria-label="البحث في الملفات الصحية"
                                className="
                                    w-full rounded-xl
                                    border border-slate-200
                                    bg-slate-50 py-3 pr-11 pl-10
                                    text-sm text-slate-800
                                    outline-none transition
                                    placeholder:text-slate-400
                                    focus:border-violet-400
                                    focus:bg-white focus:ring-4
                                    focus:ring-violet-50
                                "
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label="مسح البحث"
                                    className="
                                        absolute left-3 top-1/2
                                        -translate-y-1/2
                                        rounded-lg p-1
                                        text-slate-400
                                        hover:bg-slate-100
                                        hover:text-slate-700
                                    "
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <select
                            value={type}
                            onChange={(event) => setType(event.target.value)}
                            aria-label="تصفية حسب نوع الملف"
                            className="
                                w-full rounded-xl
                                border border-slate-200
                                bg-slate-50 px-4 py-3
                                text-sm text-slate-700
                                outline-none transition
                                focus:border-violet-400
                                focus:bg-white focus:ring-4
                                focus:ring-violet-50
                            "
                        >
                            <option value="">كل أنواع الملفات</option>

                            {PATIENT_TYPES.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </select>

                        <div className="
                            flex flex-wrap items-center gap-2
                        ">
                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="
                                        inline-flex items-center
                                        justify-center gap-2
                                        rounded-xl border
                                        border-slate-200 bg-white
                                        px-4 py-3 text-sm
                                        font-medium text-slate-600
                                        transition hover:bg-slate-50
                                    "
                                >
                                    <X size={16} />
                                    مسح الفلاتر
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={loadPatients}
                                disabled={loading}
                                aria-label="تحديث الملفات الصحية"
                                className="
                                    inline-flex items-center
                                    justify-center gap-2
                                    rounded-xl border
                                    border-slate-200 bg-white
                                    px-4 py-3 text-sm
                                    font-medium text-slate-600
                                    transition hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                <RefreshCw
                                    size={16}
                                    className={
                                        loading ? "animate-spin" : ""
                                    }
                                />
                                تحديث
                            </button>
                        </div>
                    </div>
                </section>


                {/* Results header */}
                <div className="
                    flex flex-wrap items-center
                    justify-between gap-3
                ">
                    <div>
                        <h2 className="
                            font-bold text-slate-900
                        ">
                            قائمة الملفات
                        </h2>

                        <p className="
                            mt-1 text-xs text-slate-500
                        ">
                            {loading
                                ? "جارٍ تحديث النتائج..."
                                : `عدد النتائج: ${patients.length}`}
                        </p>
                    </div>

                    {loading && patients.length > 0 && (
                        <div className="
                            flex items-center gap-2
                            text-xs text-violet-600
                        ">
                            <span className="
                                h-4 w-4 animate-spin rounded-full
                                border-2 border-violet-200
                                border-t-violet-600
                            " />
                            جارٍ التحديث
                        </div>
                    )}
                </div>


                {/* Error state */}
                {requestError && patients.length === 0 ? (
                    <div className="
                        flex flex-col items-center
                        rounded-3xl border border-rose-100
                        bg-white px-5 py-12 text-center shadow-sm
                    ">
                        <div className="
                            flex h-14 w-14 items-center
                            justify-center rounded-2xl
                            bg-rose-50 text-rose-600
                        ">
                            <ShieldAlert size={27} />
                        </div>

                        <h2 className="
                            mt-4 text-lg font-bold text-slate-900
                        ">
                            تعذر تحميل الملفات
                        </h2>

                        <p className="
                            mt-2 max-w-md text-sm leading-6
                            text-slate-500
                        ">
                            تأكد من اتصالك بالخادم ثم حاول مرة أخرى.
                        </p>

                        <button
                            type="button"
                            onClick={loadPatients}
                            className="
                                mt-5 inline-flex items-center
                                gap-2 rounded-xl bg-violet-600
                                px-5 py-3 text-sm font-semibold
                                text-white transition hover:bg-violet-700
                            "
                        >
                            <RefreshCw size={16} />
                            إعادة المحاولة
                        </button>
                    </div>
                ) : !loading && patients.length === 0 ? (
                    <div className="
                        rounded-3xl border border-slate-200
                        bg-white p-5 shadow-sm
                    ">
                        <EmptyState
                            title={
                                hasFilters
                                    ? "لا توجد نتائج مطابقة"
                                    : "لا توجد ملفات صحية"
                            }
                            description={
                                hasFilters
                                    ? "جرّب تغيير كلمات البحث أو نوع الملف المحدد."
                                    : "أنشئ أول ملف صحي لبدء تسجيل البيانات الطبية."
                            }
                        />

                        {hasFilters && (
                            <div className="mt-4 text-center">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="
                                        text-sm font-semibold
                                        text-violet-600
                                        hover:text-violet-800
                                    "
                                >
                                    عرض كل الملفات
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="
                        grid gap-5 sm:grid-cols-2 lg:grid-cols-3
                    ">
                        {patients.map((patient) => (
                            <PatientCard
                                key={patient.id}
                                patient={patient}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}


function SummaryCard({
    icon: Icon,
    title,
    value,
    description,
}) {
    return (
        <div className="
            flex items-center gap-4 rounded-2xl
            border border-slate-200 bg-white
            p-5 shadow-sm
        ">
            <div className="
                flex h-12 w-12 shrink-0
                items-center justify-center
                rounded-2xl bg-violet-50
                text-violet-700
            ">
                <Icon size={23} />
            </div>

            <div className="min-w-0">
                <p className="text-xs text-slate-500">
                    {title}
                </p>

                <p className="
                    mt-1 truncate text-lg
                    font-bold text-slate-900
                ">
                    {value}
                </p>

                <p className="
                    mt-1 text-xs text-slate-400
                ">
                    {description}
                </p>
            </div>
        </div>
    );
}


function PatientCard({
    patient,
}) {
    const typeInfo = getPatientType(patient.patient_type);

    const Icon = typeInfo.icon;

    const colorClasses = {
        violet: "bg-violet-50 text-violet-700",
        rose: "bg-rose-50 text-rose-700",
        pink: "bg-pink-50 text-pink-700",
        amber: "bg-amber-50 text-amber-700",
        slate: "bg-slate-100 text-slate-600",
    };

    return (
        <Link
            to={`/patients/${patient.id}/profile`}
            className="
                group flex h-full flex-col
                rounded-2xl border border-slate-200
                bg-white p-5 shadow-sm
                transition duration-200
                hover:-translate-y-1 hover:border-violet-200
                hover:shadow-lg hover:shadow-violet-900/5
                focus:outline-none focus:ring-4
                focus:ring-violet-100
            "
        >
            <div className="
                flex items-start justify-between gap-3
            ">
                <div className={`
                    flex h-12 w-12 items-center
                    justify-center rounded-2xl
                    ${colorClasses[typeInfo.color] || colorClasses.slate}
                `}>
                    <Icon size={24} />
                </div>

                <span className="
                    inline-flex items-center gap-1
                    rounded-full bg-slate-50
                    px-2.5 py-1 text-[11px]
                    font-medium text-slate-500
                ">
                    ملف صحي
                </span>
            </div>

            <div className="mt-5">
                <h3 className="
                    break-words text-lg font-bold
                    text-slate-900 transition
                    group-hover:text-violet-700
                ">
                    {patient.name || "ملف بدون اسم"}
                </h3>

                <p className="
                    mt-2 inline-flex rounded-full
                    bg-violet-50 px-3 py-1
                    text-xs font-semibold text-violet-700
                ">
                    {patient.patient_type_display || typeInfo.label}
                </p>
            </div>

            <div className="
                mt-5 flex-1 space-y-3
                border-t border-slate-100 pt-4
            ">
                <PatientDetail
                    icon={UserRound}
                    label="النوع"
                    value={
                        patient.gender_display ||
                        getGenderLabel(patient.gender)
                    }
                />

                <PatientDetail
                    icon={Calendar}
                    label="تاريخ الميلاد"
                    value={formatDate(patient.date_of_birth)}
                />

                {patient.phone && (
                    <PatientDetail
                        icon={Users}
                        label="رقم الهاتف"
                        value={patient.phone}
                    />
                )}

                {patient.address && (
                    <PatientDetail
                        icon={MapPin}
                        label="العنوان"
                        value={patient.address}
                    />
                )}

                {patient.allergies && (
                    <div className="
                        mt-2 rounded-xl border
                        border-rose-100 bg-rose-50/70 p-3
                    ">
                        <div className="
                            flex items-center gap-2
                            text-xs font-semibold text-rose-700
                        ">
                            <ShieldAlert size={15} />
                            الحساسيات
                        </div>

                        <p className="
                            mt-1 line-clamp-2
                            whitespace-pre-wrap text-xs
                            leading-5 text-rose-800
                        ">
                            {patient.allergies}
                        </p>
                    </div>
                )}
            </div>

            <div className="
                mt-5 flex items-center
                justify-between border-t
                border-slate-100 pt-4
            ">
                <span className="
                    text-sm font-semibold text-slate-600
                    transition group-hover:text-violet-700
                ">
                    عرض الملف الصحي
                </span>

                <span className="
                    flex h-8 w-8 items-center
                    justify-center rounded-xl
                    bg-slate-50 text-slate-400
                    transition group-hover:bg-violet-600
                    group-hover:text-white
                ">
                    <ChevronLeft size={18} />
                </span>
            </div>
        </Link>
    );
}


function PatientDetail({
    icon: Icon,
    label,
    value,
}) {
    if (!value) {
        return null;
    }

    return (
        <div className="
            flex min-w-0 items-start gap-2.5
        ">
            <Icon
                size={15}
                className="mt-0.5 shrink-0 text-slate-400"
            />

            <div className="min-w-0">
                <span className="
                    text-[11px] text-slate-400
                ">
                    {label}
                </span>

                <p className="
                    mt-0.5 break-words text-sm
                    font-medium text-slate-700
                ">
                    {value}
                </p>
            </div>
        </div>
    );
}


function getGenderLabel(gender) {
    if (gender === "MALE") {
        return "ذكر";
    }

    if (gender === "FEMALE") {
        return "أنثى";
    }

    return gender || "";
}
