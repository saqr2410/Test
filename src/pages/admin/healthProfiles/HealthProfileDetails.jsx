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
    Activity,
    ArrowLeft,
    Baby,
    CalendarDays,
    FileText,
    HeartPulse,
    MapPin,
    Package,
    Pencil,
    Pill,
    Plus,
    Stethoscope,
    Trash2,
    UserRound,
    Utensils,
    X,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getHealthProfileDetails,
    createHealthProfileMedication,
    updateHealthProfileMedication,
    deleteHealthProfileMedication,
    createHealthProfileFollowUp,
    updateHealthProfileFollowUp,
    deleteHealthProfileFollowUp,
    createFollowUpProduct,
    updateFollowUpProduct,
    deleteFollowUpProduct,
} from "../../../services/healthProfiles/healthProfileService";

import Loading from "../../../components/ui/feedback/Loading";

import ConfirmDialog from "../../../components/common/ConfirmDialog";


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
        label: "حمل",
        icon: HeartPulse,
    },

    CHILD: {
        label: "طفل",
        icon: Baby,
    },
};


const FOLLOW_UP_TYPES = {
    CHRONIC: "أمراض مزمنة",
    FITNESS: "لياقة بدنية",
    NUTRITION: "تغذية",
    PREGNANCY: "حمل",
    CHILD: "طفل",
};


const USAGE_TYPES = {
    RECOMMENDED: "موصى به",
    USING: "يستخدم حاليًا",
    STOPPED: "متوقف",
};


const emptyMedication = {
    product: "",
    dosage: "",
    frequency: "",
    duration_days: "",
    start_date: "",
    instructions: "",
};


const emptyFollowUp = {
    follow_up_type: "",
    follow_up_date: "",
    next_follow_up_date: "",
    weight_kg: "",
    height_cm: "",
    weight_change_kg: "",
    waist_cm: "",
    blood_pressure: "",
    blood_glucose: "",
    pregnancy_week: "",
    goal: "",
    progress: "",
    symptoms: "",
    customer_notes: "",
    pharmacist_notes: "",
    recommendations: "",
    products: [],
};


const emptyFollowUpProduct = {
    product: "",
    usage_type: "RECOMMENDED",
    dosage: "",
    frequency: "",
    instructions: "",
    started_at: "",
    stopped_at: "",
    notes: "",
};


export default function HealthProfileDetails() {

    const {
        id,
    } = useParams();

    const navigate =
        useNavigate();


    const [
        profile,
        setProfile,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        medicationModal,
        setMedicationModal,
    ] = useState(false);


    const [
        medicationLoading,
        setMedicationLoading,
    ] = useState(false);


    const [
        medicationForm,
        setMedicationForm,
    ] = useState(emptyMedication);


    const [
        editingMedication,
        setEditingMedication,
    ] = useState(null);


    const [
        followUpModal,
        setFollowUpModal,
    ] = useState(false);


    const [
        followUpLoading,
        setFollowUpLoading,
    ] = useState(false);


    const [
        followUpForm,
        setFollowUpForm,
    ] = useState(emptyFollowUp);


    const [
        editingFollowUp,
        setEditingFollowUp,
    ] = useState(null);


    const [
        productModal,
        setProductModal,
    ] = useState(false);


    const [
        productLoading,
        setProductLoading,
    ] = useState(false);


    const [
        productForm,
        setProductForm,
    ] = useState(emptyFollowUpProduct);


    const [
        selectedFollowUp,
        setSelectedFollowUp,
    ] = useState(null);


    const [
        editingProduct,
        setEditingProduct,
    ] = useState(null);


    const [
        deleteOpen,
        setDeleteOpen,
    ] = useState(false);


    const [
        deleteLoading,
        setDeleteLoading,
    ] = useState(false);


    const [
        deleteTarget,
        setDeleteTarget,
    ] = useState(null);


    useEffect(() => {

        loadProfile();

    }, [id]);


    const loadProfile = async () => {

        try {

            setLoading(true);

            const data =
                await getHealthProfileDetails(id);

            setProfile(data);

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "فشل تحميل الملف الصحي."
            );

        } finally {

            setLoading(false);

        }
    };


    const openMedicationCreate = () => {

        setEditingMedication(null);

        setMedicationForm({
            ...emptyMedication,
        });

        setMedicationModal(true);
    };


    const openMedicationEdit = (medication) => {

        setEditingMedication(
            medication
        );

        setMedicationForm({
            product:
                medication.product || "",

            dosage:
                medication.dosage || "",

            frequency:
                medication.frequency || "",

            duration_days:
                medication.duration_days || "",

            start_date:
                medication.start_date || "",

            instructions:
                medication.instructions || "",
        });

        setMedicationModal(true);
    };


    const closeMedicationModal = () => {

        if (medicationLoading) {
            return;
        }

        setMedicationModal(false);

        setEditingMedication(null);

        setMedicationForm({
            ...emptyMedication,
        });
    };


    const handleMedicationChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setMedicationForm(
            previous => ({
                ...previous,
                [name]: value,
            })
        );
    };


    const handleMedicationSubmit = async (
        event
    ) => {

        event.preventDefault();

        if (!medicationForm.product) {

            toast.error(
                "يجب اختيار المنتج."
            );

            return;
        }

        if (!medicationForm.dosage) {

            toast.error(
                "يجب إدخال الجرعة."
            );

            return;
        }

        if (!medicationForm.frequency) {

            toast.error(
                "يجب إدخال التكرار."
            );

            return;
        }

        try {

            setMedicationLoading(true);

            const payload = {
                patient: Number(id),
                product: Number(
                    medicationForm.product
                ),
                dosage:
                    medicationForm.dosage,

                frequency:
                    medicationForm.frequency,

                duration_days:
                    medicationForm.duration_days
                        ? Number(
                            medicationForm.duration_days
                        )
                        : null,

                start_date:
                    medicationForm.start_date ||
                    null,

                instructions:
                    medicationForm.instructions,
            };


            if (editingMedication) {

                await updateHealthProfileMedication(
                    editingMedication.id,
                    payload
                );

                toast.success(
                    "تم تحديث الدواء بنجاح."
                );

            } else {

                await createHealthProfileMedication(
                    payload
                );

                toast.success(
                    "تم إضافة الدواء بنجاح."
                );
            }


            closeMedicationModal();

            await loadProfile();

        } catch (error) {

            const data =
                error.response?.data;

            toast.error(
                data?.detail ||
                data?.patient?.[0] ||
                data?.product?.[0] ||
                data?.non_field_errors?.[0] ||
                "فشل حفظ الدواء."
            );

        } finally {

            setMedicationLoading(false);

        }
    };


    const openFollowUpCreate = () => {

        setEditingFollowUp(null);

        setFollowUpForm({
            ...emptyFollowUp,
            follow_up_type:
                getDefaultFollowUpType(),
            follow_up_date:
                getToday(),
        });

        setFollowUpModal(true);
    };


    const openFollowUpEdit = (followUp) => {

        setEditingFollowUp(
            followUp
        );

        setFollowUpForm({
            follow_up_type:
                followUp.follow_up_type || "",

            follow_up_date:
                followUp.follow_up_date || "",

            next_follow_up_date:
                followUp.next_follow_up_date || "",

            weight_kg:
                followUp.weight_kg ?? "",

            height_cm:
                followUp.height_cm ?? "",

            weight_change_kg:
                followUp.weight_change_kg ?? "",

            waist_cm:
                followUp.waist_cm ?? "",

            blood_pressure:
                followUp.blood_pressure || "",

            blood_glucose:
                followUp.blood_glucose || "",

            pregnancy_week:
                followUp.pregnancy_week ?? "",

            goal:
                followUp.goal || "",

            progress:
                followUp.progress || "",

            symptoms:
                followUp.symptoms || "",

            customer_notes:
                followUp.customer_notes || "",

            pharmacist_notes:
                followUp.pharmacist_notes || "",

            recommendations:
                followUp.recommendations || "",

            products:
                followUp.products || [],
        });

        setFollowUpModal(true);
    };


    const closeFollowUpModal = () => {

        if (followUpLoading) {
            return;
        }

        setFollowUpModal(false);

        setEditingFollowUp(null);

        setFollowUpForm({
            ...emptyFollowUp,
        });
    };


    const handleFollowUpChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setFollowUpForm(
            previous => ({
                ...previous,
                [name]: value,
            })
        );
    };


    const handleFollowUpSubmit = async (
        event
    ) => {

        event.preventDefault();

        if (!followUpForm.follow_up_type) {

            toast.error(
                "يجب اختيار نوع المتابعة."
            );

            return;
        }

        if (!followUpForm.follow_up_date) {

            toast.error(
                "يجب تحديد تاريخ المتابعة."
            );

            return;
        }

        try {

            setFollowUpLoading(true);

            const payload = {
                patient: Number(id),

                follow_up_type:
                    followUpForm.follow_up_type,

                follow_up_date:
                    followUpForm.follow_up_date,

                next_follow_up_date:
                    followUpForm.next_follow_up_date ||
                    null,

                weight_kg:
                    toNumberOrNull(
                        followUpForm.weight_kg
                    ),

                height_cm:
                    toNumberOrNull(
                        followUpForm.height_cm
                    ),

                weight_change_kg:
                    toNumberOrNull(
                        followUpForm.weight_change_kg
                    ),

                waist_cm:
                    toNumberOrNull(
                        followUpForm.waist_cm
                    ),

                blood_pressure:
                    followUpForm.blood_pressure,

                blood_glucose:
                    followUpForm.blood_glucose,

                pregnancy_week:
                    toNumberOrNull(
                        followUpForm.pregnancy_week
                    ),

                goal:
                    followUpForm.goal,

                progress:
                    followUpForm.progress,

                symptoms:
                    followUpForm.symptoms,

                customer_notes:
                    followUpForm.customer_notes,

                pharmacist_notes:
                    followUpForm.pharmacist_notes,

                recommendations:
                    followUpForm.recommendations,
            };


            let savedFollowUp;


            if (editingFollowUp) {

                savedFollowUp =
                    await updateHealthProfileFollowUp(
                        editingFollowUp.id,
                        payload
                    );

                toast.success(
                    "تم تحديث المتابعة بنجاح."
                );

            } else {

                savedFollowUp =
                    await createHealthProfileFollowUp(
                        payload
                    );

                toast.success(
                    "تم إنشاء المتابعة بنجاح."
                );
            }


            const products =
                followUpForm.products || [];


            if (
                products.length > 0 &&
                savedFollowUp?.id
            ) {

                for (
                    const product
                    of products
                ) {

                    if (
                        product.id &&
                        product._existing
                    ) {

                        await updateFollowUpProduct(
                            product.id,
                            {
                                follow_up:
                                    savedFollowUp.id,

                                product:
                                    Number(
                                        product.product
                                    ),

                                usage_type:
                                    product.usage_type,

                                dosage:
                                    product.dosage,

                                frequency:
                                    product.frequency,

                                instructions:
                                    product.instructions,

                                started_at:
                                    product.started_at ||
                                    null,

                                stopped_at:
                                    product.stopped_at ||
                                    null,

                                notes:
                                    product.notes,
                            }
                        );

                    } else {

                        await createFollowUpProduct(
                            {
                                follow_up:
                                    savedFollowUp.id,

                                product:
                                    Number(
                                        product.product
                                    ),

                                usage_type:
                                    product.usage_type,

                                dosage:
                                    product.dosage,

                                frequency:
                                    product.frequency,

                                instructions:
                                    product.instructions,

                                started_at:
                                    product.started_at ||
                                    null,

                                stopped_at:
                                    product.stopped_at ||
                                    null,

                                notes:
                                    product.notes,
                            }
                        );
                    }
                }
            }


            closeFollowUpModal();

            await loadProfile();

        } catch (error) {

            const data =
                error.response?.data;

            toast.error(
                data?.detail ||
                data?.patient?.[0] ||
                data?.follow_up_type?.[0] ||
                data?.follow_up_date?.[0] ||
                data?.next_follow_up_date?.[0] ||
                data?.non_field_errors?.[0] ||
                "فشل حفظ المتابعة."
            );

        } finally {

            setFollowUpLoading(false);

        }
    };


    const openProductCreate = (
        followUp
    ) => {

        setSelectedFollowUp(
            followUp
        );

        setEditingProduct(null);

        setProductForm({
            ...emptyFollowUpProduct,
        });

        setProductModal(true);
    };


    const openProductEdit = (
        followUp,
        product
    ) => {

        setSelectedFollowUp(
            followUp
        );

        setEditingProduct(
            product
        );

        setProductForm({
            product:
                product.product || "",

            usage_type:
                product.usage_type ||
                "RECOMMENDED",

            dosage:
                product.dosage || "",

            frequency:
                product.frequency || "",

            instructions:
                product.instructions || "",

            started_at:
                product.started_at || "",

            stopped_at:
                product.stopped_at || "",

            notes:
                product.notes || "",
        });

        setProductModal(true);
    };


    const closeProductModal = () => {

        if (productLoading) {
            return;
        }

        setProductModal(false);

        setSelectedFollowUp(null);

        setEditingProduct(null);

        setProductForm({
            ...emptyFollowUpProduct,
        });
    };


    const handleProductChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setProductForm(
            previous => ({
                ...previous,
                [name]: value,
            })
        );
    };


    const handleProductSubmit = async (
        event
    ) => {

        event.preventDefault();

        if (!selectedFollowUp) {
            return;
        }

        if (!productForm.product) {

            toast.error(
                "يجب اختيار المنتج."
            );

            return;
        }

        try {

            setProductLoading(true);

            const payload = {
                follow_up:
                    selectedFollowUp.id,

                product:
                    Number(
                        productForm.product
                    ),

                usage_type:
                    productForm.usage_type,

                dosage:
                    productForm.dosage,

                frequency:
                    productForm.frequency,

                instructions:
                    productForm.instructions,

                started_at:
                    productForm.started_at ||
                    null,

                stopped_at:
                    productForm.stopped_at ||
                    null,

                notes:
                    productForm.notes,
            };


            if (editingProduct) {

                await updateFollowUpProduct(
                    editingProduct.id,
                    payload
                );

                toast.success(
                    "تم تحديث المنتج بنجاح."
                );

            } else {

                await createFollowUpProduct(
                    payload
                );

                toast.success(
                    "تم إضافة المنتج للمتابعة."
                );
            }


            closeProductModal();

            await loadProfile();

        } catch (error) {

            const data =
                error.response?.data;

            toast.error(
                data?.detail ||
                data?.product?.[0] ||
                data?.follow_up?.[0] ||
                data?.non_field_errors?.[0] ||
                "فشل حفظ المنتج."
            );

        } finally {

            setProductLoading(false);

        }
    };


    const askDeleteMedication = (
        medication
    ) => {

        setDeleteTarget({
            type: "medication",
            item: medication,
        });

        setDeleteOpen(true);
    };


    const askDeleteFollowUp = (
        followUp
    ) => {

        setDeleteTarget({
            type: "followup",
            item: followUp,
        });

        setDeleteOpen(true);
    };


    const askDeleteProduct = (
        followUp,
        product
    ) => {

        setDeleteTarget({
            type: "product",
            item: product,
            followUp,
        });

        setDeleteOpen(true);
    };


    const handleDelete = async () => {

        if (!deleteTarget) {
            return;
        }

        try {

            setDeleteLoading(true);


            if (
                deleteTarget.type ===
                "medication"
            ) {

                await deleteHealthProfileMedication(
                    deleteTarget.item.id
                );

                toast.success(
                    "تم حذف الدواء."
                );
            }


            if (
                deleteTarget.type ===
                "followup"
            ) {

                await deleteHealthProfileFollowUp(
                    deleteTarget.item.id
                );

                toast.success(
                    "تم حذف المتابعة."
                );
            }


            if (
                deleteTarget.type ===
                "product"
            ) {

                await deleteFollowUpProduct(
                    deleteTarget.item.id
                );

                toast.success(
                    "تم حذف المنتج من المتابعة."
                );
            }


            setDeleteOpen(false);

            setDeleteTarget(null);

            await loadProfile();

        } catch (error) {

            const data =
                error.response?.data;

            toast.error(
                data?.detail ||
                "فشل تنفيذ الحذف."
            );

        } finally {

            setDeleteLoading(false);

        }
    };


    const getDefaultFollowUpType =
        () => {

            return profile?.patient_type ||
                "";
        };


    if (loading) {

        return <Loading />;

    }


    if (!profile) {

        return null;

    }


    const type =
        PROFILE_TYPES[
        profile.patient_type
        ] || {
            label:
                profile.patient_type ||
                "غير معروف",
            icon: UserRound,
        };


    const TypeIcon =
        type.icon;


    return (

        <div
            dir="rtl"
            className="space-y-6"
        >

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
                    gap-4
                ">

                    <Link
                        to="/admin/health-profiles"
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            text-gray-600
                            transition
                            hover:bg-gray-50
                        "
                    >

                        <ArrowLeft
                            size={19}
                        />

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


                <button
                    type="button"
                    onClick={() =>
                        setDeleteTarget({
                            type: "patient",
                            item: profile,
                        })
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-red-200
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-red-600
                        transition
                        hover:bg-red-50
                    "
                >

                    <Trash2 size={17} />

                    حذف الملف

                </button>

            </div>


            <div className="
                grid
                gap-6
                lg:grid-cols-3
            ">

                <section className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-6
                    shadow-sm
                    lg:col-span-2
                ">

                    <div className="
                        flex
                        items-center
                        gap-4
                    ">

                        <div className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-primary-50
                            text-primary-600
                        ">

                            <TypeIcon
                                size={27}
                            />

                        </div>


                        <div>

                            <h2 className="
                                text-xl
                                font-bold
                                text-gray-900
                            ">

                                {profile.name}

                            </h2>

                            <p className="
                                mt-1
                                text-sm
                                text-primary-600
                            ">

                                {
                                    profile.patient_type_display ||
                                    type.label
                                }

                            </p>

                        </div>

                    </div>


                    <div className="
                        mt-7
                        grid
                        gap-5
                        sm:grid-cols-2
                    ">

                        <InfoItem
                            label="صاحب الملف"
                            value={
                                profile.customer_name
                            }
                        />

                        <InfoItem
                            label="رقم الهاتف"
                            value={
                                profile.phone ||
                                profile.customer_phone
                            }
                        />

                        <InfoItem
                            label="تاريخ الميلاد"
                            value={
                                profile.date_of_birth
                            }
                        />

                        <InfoItem
                            label="النوع"
                            value={
                                profile.gender_display ||
                                profile.gender
                            }
                        />

                        <InfoItem
                            label="نوع الملف الصحي"
                            value={
                                profile.patient_type_display ||
                                type.label
                            }
                        />

                        <InfoItem
                            label="ملف طفل"
                            value={
                                profile.is_for_child
                                    ? "نعم"
                                    : "لا"
                            }
                        />

                        <div className="sm:col-span-2">

                            <InfoItem
                                label="العنوان"
                                value={
                                    profile.address
                                }
                                icon={MapPin}
                            />

                        </div>

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

                    <h2 className="
                        font-semibold
                        text-gray-900
                    ">

                        معلومات الملف

                    </h2>


                    <div className="
                        mt-5
                        space-y-4
                    ">

                        <InfoItem
                            label="تم الإنشاء بواسطة"
                            value={
                                profile.created_by_name
                            }
                        />

                        <InfoItem
                            label="تاريخ الإنشاء"
                            value={
                                profile.created_at
                                    ? new Date(
                                        profile.created_at
                                    ).toLocaleString(
                                        "ar-EG"
                                    )
                                    : null
                            }
                        />

                        <InfoItem
                            label="آخر تحديث"
                            value={
                                profile.updated_at
                                    ? new Date(
                                        profile.updated_at
                                    ).toLocaleString(
                                        "ar-EG"
                                    )
                                    : null
                            }
                        />

                    </div>

                </section>

            </div>


            {profile.fitness && (

                <ProfileSection
                    title="بيانات اللياقة البدنية"
                    icon={Activity}
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
                                "الهدف",
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
                    title="بيانات التغذية"
                    icon={Utensils}
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
                    title="بيانات الحمل"
                    icon={HeartPulse}
                >

                    <InfoGrid
                        items={[
                            [
                                "تاريخ آخر دورة",
                                profile.pregnancy.last_menstrual_period,
                            ],

                            [
                                "موعد الولادة المتوقع",
                                profile.pregnancy.expected_due_date,
                            ],

                            [
                                "أسبوع الحمل",
                                profile.pregnancy.pregnancy_week,
                            ],

                            [
                                "ملاحظات",
                                profile.pregnancy.notes,
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
                    title="بيانات الطفل"
                    icon={Baby}
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
                title="الأمراض المزمنة"
                icon={HeartPulse}
                items={profile.diseases}
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
                                {item.diagnosed_at}

                            </p>

                        )}


                        {item.notes && (

                            <p className="
                                mt-2
                                text-sm
                                text-gray-600
                            ">

                                {item.notes}

                            </p>

                        )}

                    </div>

                )}
            />


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

                            <Pill
                                size={19}
                            />

                        </div>

                        <div>

                            <h2 className="
                                font-semibold
                                text-gray-900
                            ">

                                الأدوية

                            </h2>

                            <p className="
                                mt-1
                                text-xs
                                text-gray-500
                            ">

                                إدارة الأدوية الخاصة بالمريض

                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={
                            openMedicationCreate
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-primary-600
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-primary-700
                        "
                    >

                        <Plus
                            size={17}
                        />

                        إضافة دواء

                    </button>

                </div>


                {!profile.medications ||
                    profile.medications.length === 0 ? (

                    <div className="
                        mt-5
                        rounded-xl
                        bg-gray-50
                        p-5
                        text-center
                        text-sm
                        text-gray-500
                    ">

                        لا توجد أدوية مسجلة.

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

                        {profile.medications.map(
                            medication => (

                                <div
                                    key={
                                        medication.id
                                    }
                                    className="
                                        p-5
                                    "
                                >

                                    <div className="
                                        flex
                                        flex-col
                                        gap-4
                                        sm:flex-row
                                        sm:items-start
                                        sm:justify-between
                                    ">

                                        <div>

                                            <p className="
                                                font-semibold
                                                text-gray-900
                                            ">

                                                {
                                                    medication.product_name ||
                                                    "دواء غير معروف"
                                                }

                                            </p>


                                            <div className="
                                                mt-3
                                                grid
                                                gap-2
                                                text-sm
                                                text-gray-600
                                                sm:grid-cols-3
                                            ">

                                                <span>
                                                    الجرعة:{" "}
                                                    {
                                                        medication.dosage ||
                                                        "—"
                                                    }
                                                </span>

                                                <span>
                                                    التكرار:{" "}
                                                    {
                                                        medication.frequency ||
                                                        "—"
                                                    }
                                                </span>

                                                <span>
                                                    المدة:{" "}
                                                    {
                                                        medication.duration_days ||
                                                        "—"
                                                    } يوم
                                                </span>

                                            </div>


                                            {(medication.start_date ||
                                                medication.end_date) && (

                                                    <p className="
                                                    mt-2
                                                    text-xs
                                                    text-gray-500
                                                ">

                                                        {
                                                            medication.start_date ||
                                                            "—"
                                                        }

                                                        {" → "}

                                                        {
                                                            medication.end_date ||
                                                            "—"
                                                        }

                                                    </p>

                                                )}


                                            {medication.instructions && (

                                                <p className="
                                                    mt-2
                                                    text-sm
                                                    text-gray-600
                                                ">

                                                    {
                                                        medication.instructions
                                                    }

                                                </p>

                                            )}

                                        </div>


                                        <div className="
                                            flex
                                            shrink-0
                                            items-center
                                            gap-2
                                        ">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openMedicationEdit(
                                                        medication
                                                    )
                                                }
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-gray-200
                                                    p-2
                                                    text-gray-500
                                                    transition
                                                    hover:bg-gray-50
                                                "
                                            >

                                                <Pencil
                                                    size={16}
                                                />

                                            </button>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    askDeleteMedication(
                                                        medication
                                                    )
                                                }
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-red-100
                                                    p-2
                                                    text-red-500
                                                    transition
                                                    hover:bg-red-50
                                                "
                                            >

                                                <Trash2
                                                    size={16}
                                                />

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            <ListSection
                title="النصائح الطبية"
                icon={FileText}
                items={profile.advices}
                emptyText="لا توجد نصائح طبية مسجلة."
                renderItem={(item) => (

                    <div>

                        <p className="
                            font-semibold
                            text-gray-900
                        ">

                            {item.title}

                        </p>


                        <p className="
                            mt-2
                            whitespace-pre-wrap
                            text-sm
                            text-gray-600
                        ">

                            {item.content}

                        </p>


                        <p className="
                            mt-2
                            text-xs
                            text-gray-400
                        ">

                            {
                                item.created_by_name ||
                                "النظام"
                            }

                            {" · "}

                            {item.created_at
                                ? new Date(
                                    item.created_at
                                ).toLocaleString(
                                    "ar-EG"
                                )
                                : ""}

                        </p>

                    </div>

                )}
            />


            <ListSection
                title="الزيارات"
                icon={Stethoscope}
                items={profile.visits}
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
                                    item.visit_type
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

                                    {new Date(
                                        item.created_at
                                    ).toLocaleDateString(
                                        "ar-EG"
                                    )}

                                </span>

                            )}

                        </div>


                        {item.notes && (

                            <p className="
                                mt-2
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

                            <CalendarDays
                                size={19}
                            />

                        </div>

                        <div>

                            <h2 className="
                                font-semibold
                                text-gray-900
                            ">

                                المتابعات

                            </h2>

                            <p className="
                                mt-1
                                text-xs
                                text-gray-500
                            ">

                                متابعة الحالة الصحية للمريض

                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={
                            openFollowUpCreate
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-primary-600
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-primary-700
                        "
                    >

                        <Plus
                            size={17}
                        />

                        إضافة متابعة

                    </button>

                </div>


                {!profile.follow_ups ||
                    profile.follow_ups.length === 0 ? (

                    <div className="
                        mt-5
                        rounded-xl
                        bg-gray-50
                        p-5
                        text-center
                        text-sm
                        text-gray-500
                    ">

                        لا توجد متابعات مسجلة.

                    </div>

                ) : (

                    <div className="
                        mt-5
                        space-y-4
                    ">

                        {profile.follow_ups.map(
                            followUp => (

                                <div
                                    key={
                                        followUp.id
                                    }
                                    className="
                                        rounded-xl
                                        border
                                        border-gray-100
                                        p-5
                                    "
                                >

                                    <div className="
                                        flex
                                        flex-col
                                        gap-3
                                        sm:flex-row
                                        sm:items-start
                                        sm:justify-between
                                    ">

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
                                                        FOLLOW_UP_TYPES[
                                                        followUp.follow_up_type
                                                        ] ||
                                                        followUp.follow_up_type_display ||
                                                        followUp.follow_up_type ||
                                                        "متابعة"
                                                    }

                                                </p>


                                                <span className="
                                                    rounded-full
                                                    bg-primary-50
                                                    px-2.5
                                                    py-1
                                                    text-xs
                                                    font-medium
                                                    text-primary-700
                                                ">

                                                    {
                                                        followUp.follow_up_date ||
                                                        "—"
                                                    }

                                                </span>

                                            </div>


                                            {followUp.next_follow_up_date && (

                                                <p className="
                                                    mt-2
                                                    text-xs
                                                    text-gray-500
                                                ">

                                                    المتابعة القادمة:{" "}
                                                    {
                                                        followUp.next_follow_up_date
                                                    }

                                                </p>

                                            )}

                                        </div>


                                        <div className="
                                            flex
                                            shrink-0
                                            items-center
                                            gap-2
                                        ">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openFollowUpEdit(
                                                        followUp
                                                    )
                                                }
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-gray-200
                                                    p-2
                                                    text-gray-500
                                                    transition
                                                    hover:bg-gray-50
                                                "
                                            >

                                                <Pencil
                                                    size={16}
                                                />

                                            </button>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    askDeleteFollowUp(
                                                        followUp
                                                    )
                                                }
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-red-100
                                                    p-2
                                                    text-red-500
                                                    transition
                                                    hover:bg-red-50
                                                "
                                            >

                                                <Trash2
                                                    size={16}
                                                />

                                            </button>

                                        </div>

                                    </div>


                                    <div className="
                                        mt-5
                                        grid
                                        gap-4
                                        sm:grid-cols-2
                                        lg:grid-cols-4
                                    ">

                                        <FollowUpMetric
                                            label="الوزن"
                                            value={
                                                followUp.weight_kg
                                                    ? `${followUp.weight_kg} كجم`
                                                    : null
                                            }
                                        />

                                        <FollowUpMetric
                                            label="الطول"
                                            value={
                                                followUp.height_cm
                                                    ? `${followUp.height_cm} سم`
                                                    : null
                                            }
                                        />

                                        <FollowUpMetric
                                            label="تغير الوزن"
                                            value={
                                                followUp.weight_change_kg !==
                                                    null &&
                                                    followUp.weight_change_kg !==
                                                    undefined
                                                    ? `${followUp.weight_change_kg} كجم`
                                                    : null
                                            }
                                        />

                                        <FollowUpMetric
                                            label="محيط الخصر"
                                            value={
                                                followUp.waist_cm
                                                    ? `${followUp.waist_cm} سم`
                                                    : null
                                            }
                                        />

                                        <FollowUpMetric
                                            label="ضغط الدم"
                                            value={
                                                followUp.blood_pressure
                                            }
                                        />

                                        <FollowUpMetric
                                            label="سكر الدم"
                                            value={
                                                followUp.blood_glucose
                                            }
                                        />

                                        <FollowUpMetric
                                            label="أسبوع الحمل"
                                            value={
                                                followUp.pregnancy_week
                                            }
                                        />

                                        <FollowUpMetric
                                            label="BMI"
                                            value={
                                                followUp.bmi
                                            }
                                        />

                                    </div>


                                    <div className="
                                        mt-4
                                        grid
                                        gap-4
                                        sm:grid-cols-2
                                    ">

                                        <FollowUpText
                                            label="الهدف"
                                            value={
                                                followUp.goal
                                            }
                                        />

                                        <FollowUpText
                                            label="التقدم"
                                            value={
                                                followUp.progress
                                            }
                                        />

                                        <FollowUpText
                                            label="الأعراض"
                                            value={
                                                followUp.symptoms
                                            }
                                        />

                                        <FollowUpText
                                            label="ملاحظات العميل"
                                            value={
                                                followUp.customer_notes
                                            }
                                        />

                                        <FollowUpText
                                            label="ملاحظات الصيدلي"
                                            value={
                                                followUp.pharmacist_notes
                                            }
                                        />

                                        <FollowUpText
                                            label="التوصيات"
                                            value={
                                                followUp.recommendations
                                            }
                                        />

                                    </div>


                                    <div className="
                                        mt-5
                                        rounded-xl
                                        border
                                        border-gray-100
                                        bg-gray-50
                                        p-4
                                    ">

                                        <div className="
                                            flex
                                            flex-col
                                            gap-3
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                        ">

                                            <div className="
                                                flex
                                                items-center
                                                gap-2
                                            ">

                                                <Package
                                                    size={17}
                                                    className="text-primary-600"
                                                />

                                                <h3 className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-900
                                                ">

                                                    المنتجات المرتبطة

                                                </h3>

                                            </div>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openProductCreate(
                                                        followUp
                                                    )
                                                }
                                                className="
                                                    inline-flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-lg
                                                    bg-white
                                                    px-3
                                                    py-2
                                                    text-xs
                                                    font-semibold
                                                    text-primary-600
                                                    ring-1
                                                    ring-primary-100
                                                    transition
                                                    hover:bg-primary-50
                                                "
                                            >

                                                <Plus
                                                    size={14}
                                                />

                                                إضافة منتج

                                            </button>

                                        </div>


                                        {followUp.products &&
                                            followUp.products.length >
                                            0 ? (

                                            <div className="
                                                mt-3
                                                space-y-3
                                            ">

                                                {followUp.products.map(
                                                    product => (

                                                        <div
                                                            key={
                                                                product.id
                                                            }
                                                            className="
                                                                rounded-lg
                                                                border
                                                                border-gray-100
                                                                bg-white
                                                                p-3
                                                            "
                                                        >

                                                            <div className="
                                                                flex
                                                                flex-col
                                                                gap-3
                                                                sm:flex-row
                                                                sm:items-start
                                                                sm:justify-between
                                                            ">

                                                                <div>

                                                                    <div className="
                                                                        flex
                                                                        flex-wrap
                                                                        items-center
                                                                        gap-2
                                                                    ">

                                                                        <p className="
                                                                            font-medium
                                                                            text-gray-900
                                                                        ">

                                                                            {
                                                                                product.product_name ||
                                                                                "منتج"
                                                                            }

                                                                        </p>


                                                                        <span className="
                                                                            rounded-full
                                                                            bg-primary-50
                                                                            px-2.5
                                                                            py-1
                                                                            text-[11px]
                                                                            font-medium
                                                                            text-primary-700
                                                                        ">

                                                                            {
                                                                                USAGE_TYPES[
                                                                                product.usage_type
                                                                                ] ||
                                                                                product.usage_type ||
                                                                                "—"
                                                                            }

                                                                        </span>

                                                                    </div>


                                                                    <div className="
                                                                        mt-2
                                                                        grid
                                                                        gap-2
                                                                        text-xs
                                                                        text-gray-600
                                                                        sm:grid-cols-2
                                                                        lg:grid-cols-4
                                                                    ">

                                                                        <span>
                                                                            الجرعة:{" "}
                                                                            {
                                                                                product.dosage ||
                                                                                "—"
                                                                            }
                                                                        </span>

                                                                        <span>
                                                                            التكرار:{" "}
                                                                            {
                                                                                product.frequency ||
                                                                                "—"
                                                                            }
                                                                        </span>

                                                                        <span>
                                                                            بدأ:{" "}
                                                                            {
                                                                                product.started_at ||
                                                                                "—"
                                                                            }
                                                                        </span>

                                                                        <span>
                                                                            توقف:{" "}
                                                                            {
                                                                                product.stopped_at ||
                                                                                "—"
                                                                            }
                                                                        </span>

                                                                    </div>


                                                                    {product.instructions && (

                                                                        <p className="
                                                                            mt-2
                                                                            text-xs
                                                                            text-gray-600
                                                                        ">

                                                                            التعليمات:{" "}
                                                                            {
                                                                                product.instructions
                                                                            }

                                                                        </p>

                                                                    )}


                                                                    {product.notes && (

                                                                        <p className="
                                                                            mt-2
                                                                            text-xs
                                                                            text-gray-600
                                                                        ">

                                                                            ملاحظات:{" "}
                                                                            {
                                                                                product.notes
                                                                            }

                                                                        </p>

                                                                    )}

                                                                </div>


                                                                <div className="
                                                                    flex
                                                                    shrink-0
                                                                    items-center
                                                                    gap-2
                                                                ">

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            openProductEdit(
                                                                                followUp,
                                                                                product
                                                                            )
                                                                        }
                                                                        className="
                                                                            rounded-lg
                                                                            border
                                                                            border-gray-200
                                                                            p-2
                                                                            text-gray-500
                                                                            transition
                                                                            hover:bg-gray-50
                                                                        "
                                                                    >

                                                                        <Pencil
                                                                            size={14}
                                                                        />

                                                                    </button>


                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            askDeleteProduct(
                                                                                followUp,
                                                                                product
                                                                            )
                                                                        }
                                                                        className="
                                                                            rounded-lg
                                                                            border
                                                                            border-red-100
                                                                            p-2
                                                                            text-red-500
                                                                            transition
                                                                            hover:bg-red-50
                                                                        "
                                                                    >

                                                                        <Trash2
                                                                            size={14}
                                                                        />

                                                                    </button>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        ) : (

                                            <div className="
                                                mt-3
                                                rounded-lg
                                                bg-white
                                                p-4
                                                text-center
                                                text-xs
                                                text-gray-500
                                            ">

                                                لا توجد منتجات مرتبطة بهذه المتابعة.

                                            </div>

                                        )}

                                    </div>


                                    <div className="
                                        mt-4
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        text-gray-400
                                    ">

                                        <UserRound
                                            size={14}
                                        />

                                        بواسطة{" "}
                                        {
                                            followUp.created_by_name ||
                                            "النظام"
                                        }

                                        {followUp.created_at && (

                                            <>
                                                {" · "}
                                                {
                                                    new Date(
                                                        followUp.created_at
                                                    ).toLocaleString(
                                                        "ar-EG"
                                                    )
                                                }
                                            </>

                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>


            <ConfirmDialog
                open={deleteOpen}
                onClose={() => {

                    if (!deleteLoading) {

                        setDeleteOpen(false);

                        setDeleteTarget(null);

                    }

                }}
                onConfirm={handleDelete}
                loading={deleteLoading}
                title={
                    deleteTarget?.type ===
                        "medication"
                        ? "حذف الدواء"
                        : deleteTarget?.type ===
                            "followup"
                            ? "حذف المتابعة"
                            : deleteTarget?.type ===
                                "product"
                                ? "حذف المنتج"
                                : "حذف الملف الصحي"
                }
                message={
                    deleteTarget?.type ===
                        "medication"
                        ? "هل أنت متأكد أنك تريد حذف هذا الدواء؟"
                        : deleteTarget?.type ===
                            "followup"
                            ? "هل أنت متأكد أنك تريد حذف هذه المتابعة؟ سيتم حذف المنتجات المرتبطة بها."
                            : deleteTarget?.type ===
                                "product"
                                ? "هل أنت متأكد أنك تريد حذف هذا المنتج من المتابعة؟"
                                : "هل أنت متأكد أنك تريد حذف هذا الملف الصحي؟ لا يمكن التراجع عن هذا الإجراء."
                }
            />


            {medicationModal && (

                <Modal
                    title={
                        editingMedication
                            ? "تعديل الدواء"
                            : "إضافة دواء"
                    }
                    onClose={
                        closeMedicationModal
                    }
                    loading={
                        medicationLoading
                    }
                >

                    <form
                        onSubmit={
                            handleMedicationSubmit
                        }
                        className="space-y-5"
                    >

                        <FormField
                            label="المنتج"
                            required
                        >

                            <input
                                name="product"
                                type="number"
                                value={
                                    medicationForm.product
                                }
                                onChange={
                                    handleMedicationChange
                                }
                                placeholder="رقم المنتج"
                                className={
                                    inputClass
                                }
                            />

                        </FormField>


                        <div className="
                            grid
                            gap-4
                            sm:grid-cols-2
                        ">

                            <FormField
                                label="الجرعة"
                                required
                            >

                                <input
                                    name="dosage"
                                    value={
                                        medicationForm.dosage
                                    }
                                    onChange={
                                        handleMedicationChange
                                    }
                                    placeholder="مثال: قرص واحد"
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="التكرار"
                                required
                            >

                                <input
                                    name="frequency"
                                    value={
                                        medicationForm.frequency
                                    }
                                    onChange={
                                        handleMedicationChange
                                    }
                                    placeholder="مثال: 3 مرات يوميًا"
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="المدة بالأيام"
                            >

                                <input
                                    name="duration_days"
                                    type="number"
                                    min="1"
                                    value={
                                        medicationForm.duration_days
                                    }
                                    onChange={
                                        handleMedicationChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="تاريخ البداية"
                            >

                                <input
                                    name="start_date"
                                    type="date"
                                    value={
                                        medicationForm.start_date
                                    }
                                    onChange={
                                        handleMedicationChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>

                        </div>


                        <FormField
                            label="التعليمات"
                        >

                            <textarea
                                name="instructions"
                                rows="4"
                                value={
                                    medicationForm.instructions
                                }
                                onChange={
                                    handleMedicationChange
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>


                        <ModalActions
                            onCancel={
                                closeMedicationModal
                            }
                            loading={
                                medicationLoading
                            }
                            submitLabel={
                                editingMedication
                                    ? "حفظ التعديلات"
                                    : "إضافة الدواء"
                            }
                        />

                    </form>

                </Modal>

            )}


            {followUpModal && (

                <Modal
                    title={
                        editingFollowUp
                            ? "تعديل المتابعة"
                            : "إضافة متابعة"
                    }
                    onClose={
                        closeFollowUpModal
                    }
                    loading={
                        followUpLoading
                    }
                    large
                >

                    <form
                        onSubmit={
                            handleFollowUpSubmit
                        }
                        className="space-y-5"
                    >

                        <div className="
                            grid
                            gap-4
                            sm:grid-cols-2
                        ">

                            <FormField
                                label="نوع المتابعة"
                                required
                            >

                                <select
                                    name="follow_up_type"
                                    value={
                                        followUpForm.follow_up_type
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                >

                                    <option value="">
                                        اختر النوع
                                    </option>

                                    {Object.entries(
                                        FOLLOW_UP_TYPES
                                    ).map(
                                        ([
                                            value,
                                            label,
                                        ]) => (

                                            <option
                                                key={
                                                    value
                                                }
                                                value={
                                                    value
                                                }
                                            >
                                                {label}
                                            </option>

                                        )
                                    )}

                                </select>

                            </FormField>


                            <FormField
                                label="تاريخ المتابعة"
                                required
                            >

                                <input
                                    type="date"
                                    name="follow_up_date"
                                    value={
                                        followUpForm.follow_up_date
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="المتابعة القادمة"
                            >

                                <input
                                    type="date"
                                    name="next_follow_up_date"
                                    value={
                                        followUpForm.next_follow_up_date
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="الوزن كجم"
                            >

                                <input
                                    type="number"
                                    step="0.01"
                                    name="weight_kg"
                                    value={
                                        followUpForm.weight_kg
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="الطول سم"
                            >

                                <input
                                    type="number"
                                    step="0.01"
                                    name="height_cm"
                                    value={
                                        followUpForm.height_cm
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="تغير الوزن كجم"
                            >

                                <input
                                    type="number"
                                    step="0.01"
                                    name="weight_change_kg"
                                    value={
                                        followUpForm.weight_change_kg
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="محيط الخصر سم"
                            >

                                <input
                                    type="number"
                                    step="0.01"
                                    name="waist_cm"
                                    value={
                                        followUpForm.waist_cm
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="ضغط الدم"
                            >

                                <input
                                    name="blood_pressure"
                                    value={
                                        followUpForm.blood_pressure
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    placeholder="120/80"
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="سكر الدم"
                            >

                                <input
                                    name="blood_glucose"
                                    value={
                                        followUpForm.blood_glucose
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="أسبوع الحمل"
                            >

                                <input
                                    type="number"
                                    min="1"
                                    max="45"
                                    name="pregnancy_week"
                                    value={
                                        followUpForm.pregnancy_week
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>

                        </div>


                        <div className="
                            grid
                            gap-4
                            sm:grid-cols-2
                        ">

                            <FormField
                                label="الهدف"
                            >

                                <textarea
                                    name="goal"
                                    rows="3"
                                    value={
                                        followUpForm.goal
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="التقدم"
                            >

                                <textarea
                                    name="progress"
                                    rows="3"
                                    value={
                                        followUpForm.progress
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="الأعراض"
                            >

                                <textarea
                                    name="symptoms"
                                    rows="3"
                                    value={
                                        followUpForm.symptoms
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="ملاحظات العميل"
                            >

                                <textarea
                                    name="customer_notes"
                                    rows="3"
                                    value={
                                        followUpForm.customer_notes
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="ملاحظات الصيدلي"
                            >

                                <textarea
                                    name="pharmacist_notes"
                                    rows="3"
                                    value={
                                        followUpForm.pharmacist_notes
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="التوصيات"
                            >

                                <textarea
                                    name="recommendations"
                                    rows="3"
                                    value={
                                        followUpForm.recommendations
                                    }
                                    onChange={
                                        handleFollowUpChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>

                        </div>


                        <ModalActions
                            onCancel={
                                closeFollowUpModal
                            }
                            loading={
                                followUpLoading
                            }
                            submitLabel={
                                editingFollowUp
                                    ? "حفظ التعديلات"
                                    : "إضافة المتابعة"
                            }
                        />

                    </form>

                </Modal>

            )}


            {productModal && (

                <Modal
                    title={
                        editingProduct
                            ? "تعديل المنتج"
                            : "إضافة منتج للمتابعة"
                    }
                    onClose={
                        closeProductModal
                    }
                    loading={
                        productLoading
                    }
                >

                    <form
                        onSubmit={
                            handleProductSubmit
                        }
                        className="space-y-5"
                    >

                        <FormField
                            label="المنتج"
                            required
                        >

                            <input
                                name="product"
                                type="number"
                                value={
                                    productForm.product
                                }
                                onChange={
                                    handleProductChange
                                }
                                placeholder="رقم المنتج"
                                className={
                                    inputClass
                                }
                            />

                        </FormField>


                        <FormField
                            label="نوع الاستخدام"
                        >

                            <select
                                name="usage_type"
                                value={
                                    productForm.usage_type
                                }
                                onChange={
                                    handleProductChange
                                }
                                className={
                                    inputClass
                                }
                            >

                                {Object.entries(
                                    USAGE_TYPES
                                ).map(
                                    ([
                                        value,
                                        label,
                                    ]) => (

                                        <option
                                            key={
                                                value
                                            }
                                            value={
                                                value
                                            }
                                        >

                                            {label}

                                        </option>

                                    )
                                )}

                            </select>

                        </FormField>


                        <div className="
                            grid
                            gap-4
                            sm:grid-cols-2
                        ">

                            <FormField
                                label="الجرعة"
                            >

                                <input
                                    name="dosage"
                                    value={
                                        productForm.dosage
                                    }
                                    onChange={
                                        handleProductChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="التكرار"
                            >

                                <input
                                    name="frequency"
                                    value={
                                        productForm.frequency
                                    }
                                    onChange={
                                        handleProductChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="تاريخ البداية"
                            >

                                <input
                                    type="date"
                                    name="started_at"
                                    value={
                                        productForm.started_at
                                    }
                                    onChange={
                                        handleProductChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>


                            <FormField
                                label="تاريخ التوقف"
                            >

                                <input
                                    type="date"
                                    name="stopped_at"
                                    value={
                                        productForm.stopped_at
                                    }
                                    onChange={
                                        handleProductChange
                                    }
                                    className={
                                        inputClass
                                    }
                                />

                            </FormField>

                        </div>


                        <FormField
                            label="التعليمات"
                        >

                            <textarea
                                name="instructions"
                                rows="3"
                                value={
                                    productForm.instructions
                                }
                                onChange={
                                    handleProductChange
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>


                        <FormField
                            label="ملاحظات"
                        >

                            <textarea
                                name="notes"
                                rows="3"
                                value={
                                    productForm.notes
                                }
                                onChange={
                                    handleProductChange
                                }
                                className={
                                    inputClass
                                }
                            />

                        </FormField>


                        <ModalActions
                            onCancel={
                                closeProductModal
                            }
                            loading={
                                productLoading
                            }
                            submitLabel={
                                editingProduct
                                    ? "حفظ التعديلات"
                                    : "إضافة المنتج"
                            }
                        />

                    </form>

                </Modal>

            )}

        </div>
    );
}


function getToday() {

    return new Date()
        .toISOString()
        .split("T")[0];
}


function toNumberOrNull(value) {

    if (
        value === "" ||
        value === null ||
        value === undefined
    ) {

        return null;

    }

    const number =
        Number(value);

    return Number.isNaN(number)
        ? null
        : number;
}


const inputClass = `
    w-full
    rounded-xl
    border
    border-gray-200
    bg-white
    px-4
    py-3
    text-sm
    text-gray-800
    outline-none
    transition
    focus:border-primary-500
    focus:ring-2
    focus:ring-primary-100
`;


function Modal({
    title,
    children,
    onClose,
    loading,
    large = false,
}) {

    return (

        <div className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
        ">

            <div className={`
                w-full
                max-h-[90vh]
                overflow-y-auto
                rounded-2xl
                bg-white
                shadow-xl
                ${large
                    ? "max-w-4xl"
                    : "max-w-2xl"
                }
            `}>

                <div className="
                    sticky
                    top-0
                    z-10
                    flex
                    items-center
                    justify-between
                    border-b
                    border-gray-100
                    bg-white
                    px-6
                    py-4
                ">

                    <h2 className="
                        text-lg
                        font-bold
                        text-gray-900
                    ">

                        {title}

                    </h2>


                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="
                            rounded-lg
                            p-2
                            text-gray-400
                            transition
                            hover:bg-gray-100
                            hover:text-gray-600
                        "
                    >

                        <X
                            size={19}
                        />

                    </button>

                </div>


                <div className="
                    p-6
                ">

                    {children}

                </div>

            </div>

        </div>
    );
}


function FormField({
    label,
    children,
    required = false,
}) {

    return (

        <div>

            <label className="
                mb-2
                block
                text-sm
                font-medium
                text-gray-700
            ">

                {label}

                {required && (

                    <span className="
                        mr-1
                        text-red-500
                    ">

                        *

                    </span>

                )}

            </label>


            {children}

        </div>
    );
}


function ModalActions({
    onCancel,
    loading,
    submitLabel,
}) {

    return (

        <div className="
            flex
            flex-col-reverse
            gap-3
            border-t
            border-gray-100
            pt-5
            sm:flex-row
            sm:justify-end
        ">

            <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="
                    rounded-xl
                    border
                    border-gray-200
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-gray-600
                    transition
                    hover:bg-gray-50
                    disabled:opacity-50
                "
            >

                إلغاء

            </button>


            <button
                type="submit"
                disabled={loading}
                className="
                    rounded-xl
                    bg-primary-600
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-primary-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >

                {loading
                    ? "جاري الحفظ..."
                    : submitLabel
                }

            </button>

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
                    uppercase
                    tracking-wide
                    text-gray-400
                ">

                    {label}

                </p>

            </div>


            <p className="
                mt-1
                whitespace-pre-wrap
                text-sm
                font-medium
                text-gray-800
            ">

                {value || "—"}

            </p>

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

                    <Icon
                        size={19}
                    />

                </div>


                <h2 className="
                    font-semibold
                    text-gray-900
                ">

                    {title}

                </h2>

            </div>


            <div className="
                mt-6
            ">

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


function FollowUpMetric({
    label,
    value,
}) {

    return (

        <div className="
            rounded-xl
            border
            border-gray-100
            bg-gray-50
            p-3
        ">

            <p className="
                text-xs
                text-gray-400
            ">

                {label}

            </p>


            <p className="
                mt-1
                text-sm
                font-semibold
                text-gray-800
            ">

                {value || "—"}

            </p>

        </div>
    );
}


function FollowUpText({
    label,
    value,
}) {

    if (!value) {
        return null;
    }


    return (

        <div className="
            rounded-xl
            border
            border-gray-100
            bg-gray-50
            p-4
        ">

            <p className="
                text-xs
                font-medium
                text-gray-400
            ">

                {label}

            </p>


            <p className="
                mt-2
                whitespace-pre-wrap
                text-sm
                leading-6
                text-gray-700
            ">

                {value}

            </p>

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

                    <Icon
                        size={19}
                    />

                </div>


                <h2 className="
                    font-semibold
                    text-gray-900
                ">

                    {title}

                </h2>

            </div>


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
                                className="
                                    p-5
                                "
                            >

                                {renderItem(
                                    item
                                )}

                            </div>

                        )
                    )}

                </div>

            )}

        </section>
    );
}