import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    Activity,
    ArrowRight,
    Baby,
    Calendar,
    ClipboardList,
    FileText,
    HeartPulse,
    MapPin,
    Pill,
    Stethoscope,
    UserRound,
    Utensils,
} from "lucide-react";

import toast from "react-hot-toast";

import patientService from "../../../services/patients/patientService";

import Loading from "../../../components/ui/feedback/Loading";


const PROFILE_TYPES = {
    FITNESS: {
        label: "لياقة بدنية",
        icon: Activity,
    },
    NUTRITION: {
        label: "تغذية",
        icon: Utensils,
    },
    CHRONIC: {
        label: "أمراض مزمنة",
        icon: HeartPulse,
    },
    PREGNANCY: {
        label: "متابعة الحمل",
        icon: HeartPulse,
    },
    CHILD: {
        label: "ملف طفل",
        icon: Baby,
    },
};


const getProfileType = (type) => {
    return (
        PROFILE_TYPES[type] || {
            label: type || "ملف صحي",
            icon: UserRound,
        }
    );
};


const formatDate = (date) => {
    if (!date) {
        return "—";
    }

    return new Date(date).toLocaleDateString(
        "ar-EG",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );
};


const formatDateTime = (date) => {
    if (!date) {
        return "—";
    }

    return new Date(date).toLocaleString(
        "ar-EG"
    );
};


export default function PatientProfile() {

    const {
        id,
    } = useParams();

    const [
        profile,
        setProfile,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);


    useEffect(() => {

        if (id) {
            loadProfile();
        }

    }, [id]);


    const loadProfile = async () => {

        try {

            setLoading(true);

            const data =
                await patientService.getFullProfile(
                    id
                );

            setProfile(data);

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "فشل تحميل الملف الصحي."
            );

            setProfile(null);

        } finally {

            setLoading(false);

        }

    };


    if (loading) {

        return (
            <div
                dir="rtl"
                className="
                    min-h-screen
                    bg-gray-50
                    p-6
                "
            >
                <Loading />
            </div>
        );

    }


    if (!profile) {

        return (
            <div
                dir="rtl"
                className="
                    min-h-screen
                    bg-gray-50
                    p-6
                "
            >
                <div className="
                    mx-auto
                    max-w-2xl
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-10
                    text-center
                    shadow-sm
                ">

                    <HeartPulse
                        size={48}
                        className="
                            mx-auto
                            text-primary-600
                        "
                    />

                    <h2 className="
                        mt-4
                        text-2xl
                        font-bold
                        text-gray-900
                    ">
                        الملف الصحي غير موجود
                    </h2>

                    <p className="
                        mt-2
                        text-sm
                        text-gray-500
                    ">
                        لم نتمكن من تحميل بيانات الملف الصحي.
                    </p>

                    <Link
                        to="/patients"
                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-primary-600
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-primary-700
                        "
                    >
                        <ArrowRight size={17} />
                        العودة إلى الملفات الصحية
                    </Link>

                </div>
            </div>
        );

    }


    const type =
        getProfileType(
            profile.patient_type
        );

    const TypeIcon =
        type.icon;


    const diseases =
        Array.isArray(profile.diseases)
            ? profile.diseases
            : profile.diseases?.results || [];

    const medications =
        Array.isArray(profile.medications)
            ? profile.medications
            : profile.medications?.results || [];

    const advices =
        Array.isArray(profile.advices)
            ? profile.advices
            : profile.advices?.results || [];

    const visits =
        Array.isArray(profile.visits)
            ? profile.visits
            : profile.visits?.results || [];


    return (

        <div
            dir="rtl"
            className="
                min-h-screen
                bg-gray-50
                p-4
                sm:p-6
            "
        >

            <div className="
                mx-auto
                max-w-7xl
                space-y-6
            ">

                <div className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        <Link
                            to="/patients"
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
                                hover:border-primary-200
                                hover:bg-primary-50
                                hover:text-primary-600
                            "
                        >
                            <ArrowRight size={19} />
                        </Link>

                        <div>

                            <h1 className="
                                text-2xl
                                font-bold
                                text-gray-900
                            ">
                                {profile.name}
                            </h1>

                            <p className="
                                mt-1
                                text-sm
                                text-gray-500
                            ">
                                الملف الصحي الكامل
                            </p>

                        </div>

                    </div>

                </div>


                <section className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-6
                    shadow-sm
                ">

                    <div className="
                        flex
                        flex-col
                        gap-5
                        sm:flex-row
                        sm:items-center
                    ">

                        <div className="
                            flex
                            h-16
                            w-16
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            bg-primary-50
                            text-primary-600
                        ">
                            <TypeIcon size={29} />
                        </div>

                        <div>

                            <h2 className="
                                text-2xl
                                font-bold
                                text-gray-900
                            ">
                                {profile.name}
                            </h2>

                            <div className="
                                mt-2
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            ">

                                <span className="
                                    inline-flex
                                    rounded-full
                                    bg-primary-50
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-primary-700
                                ">
                                    {
                                        profile.patient_type_display ||
                                        type.label
                                    }
                                </span>

                                {profile.is_for_child && (
                                    <span className="
                                        inline-flex
                                        rounded-full
                                        bg-amber-50
                                        px-3
                                        py-1
                                        text-xs
                                        font-semibold
                                        text-amber-700
                                    ">
                                        ملف طفل
                                    </span>
                                )}

                            </div>

                        </div>

                    </div>


                    <div className="
                        mt-7
                        grid
                        gap-5
                        sm:grid-cols-2
                        lg:grid-cols-3
                    ">

                        <InfoItem
                            icon={UserRound}
                            label="صاحب الملف"
                            value={profile.customer_name}
                        />

                        <InfoItem
                            icon={UserRound}
                            label="النوع"
                            value={
                                profile.gender_display ||
                                profile.gender
                            }
                        />

                        <InfoItem
                            icon={Calendar}
                            label="تاريخ الميلاد"
                            value={
                                formatDate(
                                    profile.date_of_birth
                                )
                            }
                        />

                        <InfoItem
                            icon={FileText}
                            label="نوع الملف"
                            value={
                                profile.patient_type_display ||
                                type.label
                            }
                        />

                        <InfoItem
                            icon={MapPin}
                            label="العنوان"
                            value={profile.address}
                        />

                        <InfoItem
                            label="رقم الهاتف"
                            value={
                                profile.phone ||
                                profile.customer_phone
                            }
                        />

                    </div>

                </section>


                <section className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-6
                    shadow-sm
                ">

                    <SectionTitle
                        icon={FileText}
                        title="معلومات الملف"
                    />

                    <div className="
                        mt-6
                        grid
                        gap-5
                        sm:grid-cols-2
                        lg:grid-cols-3
                    ">

                        <InfoItem
                            label="تاريخ إنشاء الملف"
                            value={formatDateTime(
                                profile.created_at
                            )}
                        />

                        <InfoItem
                            label="آخر تحديث"
                            value={formatDateTime(
                                profile.updated_at
                            )}
                        />

                        <InfoItem
                            label="تم الإنشاء بواسطة"
                            value={
                                profile.created_by_name
                            }
                        />

                    </div>

                </section>


                {profile.fitness && (

                    <ProfileSection
                        icon={Activity}
                        title="بيانات اللياقة البدنية"
                    >

                        <InfoGrid
                            items={[
                                [
                                    "الطول",
                                    profile.fitness.height_cm
                                        ? `${profile.fitness.height_cm} سم`
                                        : null,
                                ],
                                [
                                    "الوزن",
                                    profile.fitness.weight_kg
                                        ? `${profile.fitness.weight_kg} كجم`
                                        : null,
                                ],
                                [
                                    "هدف اللياقة",
                                    profile.fitness.fitness_goal,
                                ],
                                [
                                    "مستوى النشاط",
                                    profile.fitness.activity_level,
                                ],
                                [
                                    "ملاحظات",
                                    profile.fitness.notes,
                                ],
                            ]}
                        />

                    </ProfileSection>

                )}


                {profile.nutrition && (

                    <ProfileSection
                        icon={Utensils}
                        title="بيانات التغذية"
                    >

                        <InfoGrid
                            items={[
                                [
                                    "الطول",
                                    profile.nutrition.height_cm
                                        ? `${profile.nutrition.height_cm} سم`
                                        : null,
                                ],
                                [
                                    "الوزن",
                                    profile.nutrition.weight_kg
                                        ? `${profile.nutrition.weight_kg} كجم`
                                        : null,
                                ],
                                [
                                    "الوزن المستهدف",
                                    profile.nutrition.target_weight_kg
                                        ? `${profile.nutrition.target_weight_kg} كجم`
                                        : null,
                                ],
                                [
                                    "الهدف",
                                    profile.nutrition.goal,
                                ],
                                [
                                    "التفضيلات الغذائية",
                                    profile.nutrition.dietary_preferences,
                                ],
                                [
                                    "الحساسيات الغذائية",
                                    profile.nutrition.food_allergies,
                                ],
                                [
                                    "ملاحظات",
                                    profile.nutrition.notes,
                                ],
                            ]}
                        />

                    </ProfileSection>

                )}


                {profile.pregnancy && (

                    <ProfileSection
                        icon={HeartPulse}
                        title="بيانات الحمل"
                    >

                        <InfoGrid
                            items={[
                                [
                                    "تاريخ آخر دورة",
                                    formatDate(
                                        profile.pregnancy.last_menstrual_period
                                    ),
                                ],
                                [
                                    "موعد الولادة المتوقع",
                                    formatDate(
                                        profile.pregnancy.expected_due_date
                                    ),
                                ],
                                [
                                    "أسبوع الحمل",
                                    profile.pregnancy.pregnancy_week,
                                ],
                                [
                                    "ملاحظات الطبيب",
                                    profile.pregnancy.doctor_notes,
                                ],
                                [
                                    "ملاحظات المخاطر",
                                    profile.pregnancy.risk_notes,
                                ],
                            ]}
                        />

                    </ProfileSection>

                )}


                {profile.child && (

                    <ProfileSection
                        icon={Baby}
                        title="بيانات الطفل"
                    >

                        <InfoGrid
                            items={[
                                [
                                    "اسم ولي الأمر",
                                    profile.child.guardian_name,
                                ],
                                [
                                    "هاتف ولي الأمر",
                                    profile.child.guardian_phone,
                                ],
                                [
                                    "الطول",
                                    profile.child.height_cm
                                        ? `${profile.child.height_cm} سم`
                                        : null,
                                ],
                                [
                                    "الوزن",
                                    profile.child.weight_kg
                                        ? `${profile.child.weight_kg} كجم`
                                        : null,
                                ],
                                [
                                    "الحساسيات",
                                    profile.child.allergies,
                                ],
                                [
                                    "ملاحظات",
                                    profile.child.notes,
                                ],
                            ]}
                        />

                    </ProfileSection>

                )}


                <ListSection
                    icon={HeartPulse}
                    title="الأمراض المزمنة"
                    items={diseases}
                    emptyText="لا توجد أمراض مزمنة مسجلة."
                    renderItem={(item) => (

                        <div>

                            <p className="
                                font-semibold
                                text-gray-900
                            ">
                                {
                                    item.disease_name ||
                                    item.custom_disease_name ||
                                    item.disease ||
                                    "مرض غير معروف"
                                }
                            </p>

                            {item.diagnosed_at && (
                                <p className="
                                    mt-1
                                    text-xs
                                    text-gray-500
                                ">
                                    تاريخ التشخيص:{" "}
                                    {formatDate(
                                        item.diagnosed_at
                                    )}
                                </p>
                            )}

                            {item.notes && (
                                <p className="
                                    mt-2
                                    whitespace-pre-wrap
                                    text-sm
                                    text-gray-600
                                ">
                                    {item.notes}
                                </p>
                            )}

                        </div>

                    )}
                />


                <ListSection
                    icon={Pill}
                    title="الأدوية"
                    items={medications}
                    emptyText="لا توجد أدوية مسجلة."
                    renderItem={(item) => (

                        <div>

                            <p className="
                                font-semibold
                                text-gray-900
                            ">
                                {
                                    item.product_name ||
                                    item.name ||
                                    "دواء غير معروف"
                                }
                            </p>

                            <div className="
                                mt-2
                                grid
                                gap-2
                                text-sm
                                text-gray-600
                                sm:grid-cols-3
                            ">

                                <span>
                                    الجرعة:{" "}
                                    {item.dosage || "—"}
                                </span>

                                <span>
                                    التكرار:{" "}
                                    {item.frequency || "—"}
                                </span>

                                <span>
                                    المدة:{" "}
                                    {item.duration_days
                                        ? `${item.duration_days} يوم`
                                        : "—"}
                                </span>

                            </div>

                            {(item.start_date ||
                                item.end_date) && (

                                    <p className="
                                    mt-2
                                    text-xs
                                    text-gray-500
                                ">
                                        {formatDate(
                                            item.start_date
                                        )}
                                        {" → "}
                                        {formatDate(
                                            item.end_date
                                        )}
                                    </p>

                                )}

                            {item.instructions && (
                                <p className="
                                    mt-2
                                    whitespace-pre-wrap
                                    text-sm
                                    text-gray-600
                                ">
                                    {item.instructions}
                                </p>
                            )}

                        </div>

                    )}
                />


                <ListSection
                    icon={FileText}
                    title="النصائح الطبية"
                    items={advices}
                    emptyText="لا توجد نصائح طبية مسجلة."
                    renderItem={(item) => (

                        <div>

                            <p className="
                                font-semibold
                                text-gray-900
                            ">
                                {item.title || "نصيحة طبية"}
                            </p>

                            {item.content && (
                                <p className="
                                    mt-2
                                    whitespace-pre-wrap
                                    text-sm
                                    leading-6
                                    text-gray-600
                                ">
                                    {item.content}
                                </p>
                            )}

                            <p className="
                                mt-2
                                text-xs
                                text-gray-400
                            ">
                                {
                                    item.created_by_name ||
                                    "النظام"
                                }

                                {item.created_at && (
                                    <>
                                        {" · "}
                                        {formatDateTime(
                                            item.created_at
                                        )}
                                    </>
                                )}
                            </p>

                        </div>

                    )}
                />


                <ListSection
                    icon={Stethoscope}
                    title="الزيارات"
                    items={visits}
                    emptyText="لا توجد زيارات مسجلة."
                    renderItem={(item) => (

                        <div>

                            <div className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            ">

                                <p className="
                                    font-semibold
                                    text-gray-900
                                ">
                                    {
                                        item.visit_type_display ||
                                        item.visit_type ||
                                        "زيارة"
                                    }
                                </p>

                                {item.created_at && (
                                    <span className="
                                        rounded-full
                                        bg-gray-100
                                        px-2.5
                                        py-1
                                        text-xs
                                        text-gray-600
                                    ">
                                        {formatDate(
                                            item.created_at
                                        )}
                                    </span>
                                )}

                            </div>

                            {item.notes && (
                                <p className="
                                    mt-2
                                    whitespace-pre-wrap
                                    text-sm
                                    text-gray-600
                                ">
                                    {item.notes}
                                </p>
                            )}

                            <p className="
                                mt-2
                                text-xs
                                text-gray-400
                            ">
                                بواسطة{" "}
                                {
                                    item.created_by_name ||
                                    "النظام"
                                }
                            </p>

                        </div>

                    )}
                />

            </div>

        </div>
    );
}


function InfoItem({
    label,
    value,
    icon: Icon,
}) {

    return (
        <div>

            <div className="
                flex
                items-center
                gap-2
            ">

                {Icon && (
                    <Icon
                        size={15}
                        className="text-gray-400"
                    />
                )}

                <p className="
                    text-xs
                    font-medium
                    text-gray-400
                ">
                    {label}
                </p>

            </div>

            <p className="
                mt-1
                whitespace-pre-wrap
                break-words
                text-sm
                font-medium
                text-gray-800
            ">
                {value || "—"}
            </p>

        </div>
    );
}


function SectionTitle({
    icon: Icon,
    title,
}) {

    return (
        <div className="
            flex
            items-center
            gap-3
        ">

            <div className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-primary-50
                text-primary-600
            ">
                <Icon size={19} />
            </div>

            <h2 className="
                font-semibold
                text-gray-900
            ">
                {title}
            </h2>

        </div>
    );
}


function ProfileSection({
    title,
    icon: Icon,
    children,
}) {

    return (
        <section className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
        ">

            <SectionTitle
                icon={Icon}
                title={title}
            />

            <div className="mt-6">
                {children}
            </div>

        </section>
    );
}


function InfoGrid({
    items = [],
}) {

    return (
        <div className="
            grid
            gap-5
            sm:grid-cols-2
        ">

            {items.map(
                ([label, value]) => (
                    <InfoItem
                        key={label}
                        label={label}
                        value={value}
                    />
                )
            )}

        </div>
    );
}


function ListSection({
    title,
    icon: Icon,
    items = [],
    emptyText,
    renderItem,
}) {

    return (
        <section className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
        ">

            <SectionTitle
                icon={Icon}
                title={title}
            />

            {!items ||
                items.length === 0 ? (

                <div className="
                    mt-5
                    rounded-xl
                    bg-gray-50
                    p-5
                    text-center
                    text-sm
                    text-gray-500
                ">
                    {emptyText}
                </div>

            ) : (

                <div className="
                    mt-5
                    divide-y
                    divide-gray-100
                    rounded-xl
                    border
                    border-gray-100
                ">

                    {items.map(
                        (item, index) => (

                            <div
                                key={
                                    item.id ||
                                    index
                                }
                                className="p-5"
                            >
                                {renderItem(item)}
                            </div>

                        )
                    )}

                </div>

            )}

        </section>
    );
}