import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    Activity,
    ArrowLeft,
    CalendarDays,
    ChevronLeft,
    ClipboardList,
    HeartPulse,
    Pill,
    Ruler,
    Scale,
    ShieldCheck,
    Stethoscope,
    User,
    Weight,
} from "lucide-react";

import {
    getMyProfile,
    getFullProfile,
} from "../../../services/patients/patientService";


export default function HealthProfile() {

    const [patient, setPatient] = useState(null);
    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // LOAD PROFILE
    // ==========================================

    useEffect(() => {
        loadProfile();
    }, []);


    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const patientData = await getMyProfile();

            if (!patientData) {
                setPatient(null);
                setProfile(null);
                return;
            }

            setPatient(patientData);

            const fullProfileData = await getFullProfile(
                patientData.id
            );

            setProfile(fullProfileData);

        } catch (error) {

            console.error(
                "خطأ في تحميل الملف الصحي:",
                error
            );

            setError(
                "حدث خطأ أثناء تحميل الملف الصحي."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // HELPERS
    // ==========================================

    const getValue = (value, fallback = "غير مسجل") => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return fallback;
        }

        return value;
    };


    const formatDate = (date) => {

        if (!date) {
            return "غير مسجل";
        }

        try {

            return new Date(date).toLocaleDateString(
                "ar-EG",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }
            );

        } catch {

            return "غير مسجل";

        }
    };


    const getGender = () => {

        return (
            patient?.gender_display ||
            patient?.gender ||
            "غير مسجل"
        );
    };


    const getPatientType = () => {

        return (
            patient?.patient_type_display ||
            patient?.patient_type ||
            "غير محدد"
        );
    };


    // ==========================================
    // DATA
    // ==========================================

    const fitness = profile?.fitness || null;

    const diseases = Array.isArray(
        profile?.diseases
    )
        ? profile.diseases
        : [];

    const medications = Array.isArray(
        profile?.medications
    )
        ? profile.medications
        : [];

    const followUps = Array.isArray(
        profile?.follow_ups
    )
        ? profile.follow_ups
        : [];

    const advices = Array.isArray(
        profile?.advices
    )
        ? profile.advices
        : [];


    // ==========================================
    // LATEST FOLLOW UP
    // ==========================================

    const latestFollowUp = useMemo(() => {

        if (!followUps.length) {
            return null;
        }

        return [...followUps].sort(
            (a, b) =>
                new Date(b.follow_up_date || 0) -
                new Date(a.follow_up_date || 0)
        )[0];

    }, [followUps]);


    // ==========================================
    // HEALTH METRICS
    // ==========================================

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
        null;


    // ==========================================
    // BMI LABEL
    // ==========================================

    const getBMIStatus = (value) => {

        if (!value) {
            return null;
        }

        const number = Number(value);

        if (number < 18.5) {
            return {
                text: "أقل من الطبيعي",
                className: "bg-amber-50 text-amber-700",
            };
        }

        if (number < 25) {
            return {
                text: "طبيعي",
                className: "bg-emerald-50 text-emerald-700",
            };
        }

        if (number < 30) {
            return {
                text: "أعلى من الطبيعي",
                className: "bg-orange-50 text-orange-700",
            };
        }

        return {
            text: "مرتفع",
            className: "bg-red-50 text-red-700",
        };
    };


    const bmiStatus = getBMIStatus(bmi);


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div
                dir="rtl"
                className="min-h-screen bg-[#FAF8FC] flex items-center justify-center px-6"
            >

                <div className="text-center">

                    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-purple-100 flex items-center justify-center">

                        <HeartPulse
                            size={30}
                            className="text-[#5B2A86] animate-pulse"
                        />

                    </div>

                    <h2 className="text-lg font-black text-gray-800">
                        جاري تحميل الملف الصحي
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                        لحظات ونجهزلك بياناتك الصحية
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // NO PROFILE
    // ==========================================

    if (!patient) {

        return (
            <div
                dir="rtl"
                className="min-h-screen bg-[#FAF8FC] py-14 px-4"
            >

                <div className="max-w-3xl mx-auto">

                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-10 md:p-14 text-center">

                        <div className="w-24 h-24 mx-auto rounded-3xl bg-purple-50 flex items-center justify-center mb-6">

                            <HeartPulse
                                size={44}
                                strokeWidth={1.7}
                                className="text-[#5B2A86]"
                            />

                        </div>

                        <h1 className="text-2xl font-black text-gray-900 mb-3">
                            لا يوجد ملف صحي حتى الآن
                        </h1>

                        <p className="text-gray-500 leading-7 max-w-md mx-auto mb-7">
                            أنشئ ملفك الصحي لتتمكن من متابعة بياناتك
                            الصحية والاستفادة من الخدمات الطبية بشكل أفضل.
                        </p>

                        <Link
                            to="/patients/create"
                            className="inline-flex items-center gap-2 bg-[#5B2A86] text-white px-7 py-3.5 rounded-2xl font-bold hover:bg-[#4b216f] transition"
                        >

                            إنشاء الملف الصحي

                            <ArrowLeft size={18} />

                        </Link>

                    </div>

                </div>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (
            <div
                dir="rtl"
                className="min-h-screen bg-[#FAF8FC] py-14 px-4"
            >

                <div className="max-w-2xl mx-auto">

                    <div className="bg-white border border-red-100 rounded-3xl p-10 text-center shadow-sm">

                        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-50 flex items-center justify-center">

                            <ShieldCheck
                                size={30}
                                className="text-red-600"
                            />

                        </div>

                        <h2 className="text-xl font-black text-gray-900">
                            تعذر تحميل الملف الصحي
                        </h2>

                        <p className="text-gray-500 mt-2 mb-6">
                            {error}
                        </p>

                        <button
                            onClick={loadProfile}
                            className="inline-flex items-center gap-2 bg-[#5B2A86] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#4b216f] transition"
                        >

                            إعادة المحاولة

                        </button>

                    </div>

                </div>

            </div>
        );
    }


    return (

        <div
            dir="rtl"
            className="min-h-screen bg-[#FAF8FC] py-10 md:py-14"
        >

            <div className="max-w-6xl mx-auto px-4 sm:px-6">


                {/* ==========================================
                    HEADER
                ========================================== */}

                <div className="mb-8 md:mb-10">

                    <div className="flex items-center gap-3 mb-3">

                        <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center">

                            <HeartPulse
                                size={23}
                                className="text-[#5B2A86]"
                            />

                        </div>

                        <span className="text-sm font-bold text-[#5B2A86]">
                            حسابي
                        </span>

                    </div>


                    <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                        الملف الصحي
                    </h1>

                    <p className="text-gray-500 mt-2">
                        تابع بياناتك الصحية وسجل المتابعة الخاص بك
                    </p>

                </div>


                {/* ==========================================
                    PATIENT CARD
                ========================================== */}

                <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8 mb-6">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">


                        <div className="flex items-center gap-4">

                            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">

                                <User
                                    size={30}
                                    className="text-[#5B2A86]"
                                />

                            </div>


                            <div>

                                <h2 className="text-xl md:text-2xl font-black text-gray-900">
                                    {getValue(patient.name)}
                                </h2>

                                <div className="flex flex-wrap items-center gap-2 mt-2">

                                    <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-[#5B2A86] text-xs font-bold">
                                        {getPatientType()}
                                    </span>

                                    <span className="px-3 py-1.5 rounded-xl bg-gray-50 text-gray-600 text-xs font-bold">
                                        {getGender()}
                                    </span>

                                </div>

                            </div>

                        </div>


                        <div className="grid grid-cols-2 gap-3">

                            <div className="bg-gray-50 rounded-2xl px-4 py-3">

                                <p className="text-xs text-gray-400 font-bold">
                                    تاريخ الميلاد
                                </p>

                                <p className="text-sm font-black text-gray-800 mt-1">
                                    {formatDate(
                                        patient.date_of_birth
                                    )}
                                </p>

                            </div>


                            <div className="bg-gray-50 rounded-2xl px-4 py-3">

                                <p className="text-xs text-gray-400 font-bold">
                                    تاريخ الإنشاء
                                </p>

                                <p className="text-sm font-black text-gray-800 mt-1">
                                    {formatDate(
                                        patient.created_at
                                    )}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    HEALTH METRICS
                ========================================== */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">


                    {/* WEIGHT */}

                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-gray-500 font-bold">
                                    الوزن
                                </p>

                                <div className="flex items-baseline gap-1 mt-2">

                                    <span className="text-3xl font-black text-gray-900">
                                        {getValue(weight, "--")}
                                    </span>

                                    <span className="text-sm text-gray-400 font-bold">
                                        كجم
                                    </span>

                                </div>

                            </div>

                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">

                                <Weight
                                    size={24}
                                    className="text-blue-600"
                                />

                            </div>

                        </div>

                    </div>


                    {/* HEIGHT */}

                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-gray-500 font-bold">
                                    الطول
                                </p>

                                <div className="flex items-baseline gap-1 mt-2">

                                    <span className="text-3xl font-black text-gray-900">
                                        {getValue(height, "--")}
                                    </span>

                                    <span className="text-sm text-gray-400 font-bold">
                                        سم
                                    </span>

                                </div>

                            </div>

                            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">

                                <Ruler
                                    size={24}
                                    className="text-green-600"
                                />

                            </div>

                        </div>

                    </div>


                    {/* BMI */}

                    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-gray-500 font-bold">
                                    مؤشر كتلة الجسم
                                </p>

                                <div className="flex items-baseline gap-2 mt-2">

                                    <span className="text-3xl font-black text-gray-900">
                                        {getValue(bmi, "--")}
                                    </span>

                                    {bmiStatus && (

                                        <span
                                            className={`
                                                px-2.5
                                                py-1
                                                rounded-lg
                                                text-xs
                                                font-bold
                                                ${bmiStatus.className}
                                            `}
                                        >
                                            {bmiStatus.text}
                                        </span>

                                    )}

                                </div>

                            </div>

                            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">

                                <Activity
                                    size={24}
                                    className="text-[#5B2A86]"
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==========================================
                    MAIN GRID
                ========================================== */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                    {/* ==========================================
                        CHRONIC DISEASES
                    ========================================== */}

                    <section className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

                        <div className="p-6 border-b border-gray-100">

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center">

                                        <HeartPulse
                                            size={22}
                                            className="text-red-600"
                                        />

                                    </div>

                                    <div>

                                        <h2 className="font-black text-gray-900">
                                            الأمراض المزمنة
                                        </h2>

                                        <p className="text-xs text-gray-400 mt-1">
                                            الحالات الصحية المسجلة
                                        </p>

                                    </div>

                                </div>

                                <span className="text-sm font-black text-[#5B2A86]">
                                    {diseases.length}
                                </span>

                            </div>

                        </div>


                        <div className="p-6">

                            {diseases.length === 0 ? (

                                <div className="text-center py-8">

                                    <Stethoscope
                                        size={30}
                                        className="mx-auto text-gray-300 mb-3"
                                    />

                                    <p className="text-sm text-gray-400">
                                        لا توجد أمراض مزمنة مسجلة
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {diseases.map((disease) => (

                                        <div
                                            key={disease.id}
                                            className="bg-gray-50 rounded-2xl p-4"
                                        >

                                            <div className="flex items-start justify-between gap-4">

                                                <div>

                                                    <h3 className="font-black text-gray-800">
                                                        {getValue(
                                                            disease.disease_name ||
                                                            disease.custom_disease_name
                                                        )}
                                                    </h3>

                                                    {disease.notes && (

                                                        <p className="text-sm text-gray-500 mt-2 leading-6">
                                                            {disease.notes}
                                                        </p>

                                                    )}

                                                </div>

                                                {disease.diagnosed_at && (

                                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                                        {formatDate(
                                                            disease.diagnosed_at
                                                        )}
                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </section>


                    {/* ==========================================
                        MEDICATIONS
                    ========================================== */}

                    <section className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

                        <div className="p-6 border-b border-gray-100">

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">

                                        <Pill
                                            size={22}
                                            className="text-blue-600"
                                        />

                                    </div>

                                    <div>

                                        <h2 className="font-black text-gray-900">
                                            الأدوية الحالية
                                        </h2>

                                        <p className="text-xs text-gray-400 mt-1">
                                            الأدوية المسجلة في الملف
                                        </p>

                                    </div>

                                </div>

                                <span className="text-sm font-black text-[#5B2A86]">
                                    {medications.length}
                                </span>

                            </div>

                        </div>


                        <div className="p-6">

                            {medications.length === 0 ? (

                                <div className="text-center py-8">

                                    <Pill
                                        size={30}
                                        className="mx-auto text-gray-300 mb-3"
                                    />

                                    <p className="text-sm text-gray-400">
                                        لا توجد أدوية مسجلة
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {medications.map((medication) => (

                                        <div
                                            key={medication.id}
                                            className="bg-gray-50 rounded-2xl p-4"
                                        >

                                            <h3 className="font-black text-gray-800">
                                                {getValue(
                                                    medication.product_name
                                                )}
                                            </h3>


                                            <div className="flex flex-wrap gap-2 mt-3">

                                                {medication.dosage && (

                                                    <span className="px-2.5 py-1 rounded-lg bg-white text-xs font-bold text-gray-600">
                                                        الجرعة: {medication.dosage}
                                                    </span>

                                                )}

                                                {medication.frequency && (

                                                    <span className="px-2.5 py-1 rounded-lg bg-white text-xs font-bold text-gray-600">
                                                        {medication.frequency}
                                                    </span>

                                                )}

                                            </div>


                                            {medication.instructions && (

                                                <p className="text-sm text-gray-500 mt-3 leading-6">
                                                    {medication.instructions}
                                                </p>

                                            )}

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </section>


                    {/* ==========================================
                        LATEST FOLLOW UP
                    ========================================== */}

                    <section className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

                        <div className="p-6 border-b border-gray-100">

                            <div className="flex items-center gap-3">

                                <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center">

                                    <ClipboardList
                                        size={22}
                                        className="text-green-600"
                                    />

                                </div>

                                <div>

                                    <h2 className="font-black text-gray-900">
                                        آخر متابعة
                                    </h2>

                                    <p className="text-xs text-gray-400 mt-1">
                                        أحدث سجل متابعة صحي
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="p-6">

                            {!latestFollowUp ? (

                                <div className="text-center py-8">

                                    <CalendarDays
                                        size={30}
                                        className="mx-auto text-gray-300 mb-3"
                                    />

                                    <p className="text-sm text-gray-400">
                                        لا توجد زيارات متابعة مسجلة
                                    </p>

                                </div>

                            ) : (

                                <div>

                                    <div className="flex items-center justify-between mb-5">

                                        <span className="text-sm font-bold text-gray-500">
                                            تاريخ المتابعة
                                        </span>

                                        <span className="text-sm font-black text-gray-800">
                                            {formatDate(
                                                latestFollowUp.follow_up_date
                                            )}
                                        </span>

                                    </div>


                                    <div className="grid grid-cols-2 gap-3">

                                        <div className="bg-gray-50 rounded-2xl p-4">

                                            <p className="text-xs text-gray-400 font-bold">
                                                الضغط
                                            </p>

                                            <p className="font-black text-gray-800 mt-2">
                                                {getValue(
                                                    latestFollowUp.blood_pressure
                                                )}
                                            </p>

                                        </div>


                                        <div className="bg-gray-50 rounded-2xl p-4">

                                            <p className="text-xs text-gray-400 font-bold">
                                                السكر
                                            </p>

                                            <p className="font-black text-gray-800 mt-2">
                                                {getValue(
                                                    latestFollowUp.blood_glucose
                                                )}
                                            </p>

                                        </div>

                                    </div>


                                    {latestFollowUp.goal && (

                                        <div className="mt-4">

                                            <p className="text-xs text-gray-400 font-bold mb-2">
                                                الهدف
                                            </p>

                                            <p className="text-sm text-gray-700 leading-7 bg-gray-50 rounded-2xl p-4">
                                                {latestFollowUp.goal}
                                            </p>

                                        </div>

                                    )}


                                    {latestFollowUp.progress && (

                                        <div className="mt-4">

                                            <p className="text-xs text-gray-400 font-bold mb-2">
                                                التقدم
                                            </p>

                                            <p className="text-sm text-gray-700 leading-7 bg-gray-50 rounded-2xl p-4">
                                                {latestFollowUp.progress}
                                            </p>

                                        </div>

                                    )}

                                </div>

                            )}

                        </div>

                    </section>


                    {/* ==========================================
                        RECOMMENDATIONS
                    ========================================== */}

                    <section className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">

                        <div className="p-6 border-b border-gray-100">

                            <div className="flex items-center gap-3">

                                <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center">

                                    <Stethoscope
                                        size={22}
                                        className="text-amber-600"
                                    />

                                </div>

                                <div>

                                    <h2 className="font-black text-gray-900">
                                        التوصيات والنصائح
                                    </h2>

                                    <p className="text-xs text-gray-400 mt-1">
                                        آخر النصائح المسجلة
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="p-6">

                            {latestFollowUp?.recommendations ? (

                                <div className="bg-purple-50 rounded-2xl p-5">

                                    <p className="text-sm text-gray-700 leading-7">
                                        {latestFollowUp.recommendations}
                                    </p>

                                </div>

                            ) : advices.length > 0 ? (

                                <div className="space-y-3">

                                    {advices.slice(0, 3).map((advice) => (

                                        <div
                                            key={advice.id}
                                            className="bg-gray-50 rounded-2xl p-4"
                                        >

                                            <p className="text-sm text-gray-700 leading-7">
                                                {getValue(
                                                    advice.advice ||
                                                    advice.notes ||
                                                    advice.description
                                                )}
                                            </p>

                                        </div>

                                    ))}

                                </div>

                            ) : (

                                <div className="text-center py-8">

                                    <Stethoscope
                                        size={30}
                                        className="mx-auto text-gray-300 mb-3"
                                    />

                                    <p className="text-sm text-gray-400">
                                        لا توجد توصيات مسجلة حاليًا
                                    </p>

                                </div>

                            )}

                        </div>

                    </section>

                </div>


                {/* ==========================================
                    ADDITIONAL INFO
                ========================================== */}

                <div className="bg-white border border-gray-100 rounded-3xl shadow-sm mt-6 p-6 md:p-8">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">

                                <Activity
                                    size={23}
                                    className="text-[#5B2A86]"
                                />

                            </div>

                            <div>

                                <h2 className="font-black text-gray-900">
                                    متابعة الملف الصحي
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    يمكنك مراجعة بياناتك الصحية وتحديثها عند الحاجة.
                                </p>

                            </div>

                        </div>


                        <Link
                            to="/patients"
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gray-50 text-[#5B2A86] font-black text-sm hover:bg-purple-50 transition"
                        >

                            إدارة الملف الصحي

                            <ChevronLeft size={18} />

                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );
}