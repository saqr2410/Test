import {
    useCallback,
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
    X,
} from "lucide-react";

import toast from "react-hot-toast";

import {
    getHealthProfileDetails,
    deleteHealthProfile,
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
        label: "لياقة وتغذية",
        icon: Activity,
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
    FITNESS: "لياقة وتغذية",
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


const inputClass = `
    w-full rounded-xl border border-gray-200
    bg-white px-4 py-3 text-sm text-gray-800
    outline-none transition
    focus:border-purple-500 focus:ring-2
    focus:ring-purple-100
    disabled:cursor-not-allowed
    disabled:bg-gray-100
`;


const buttonClass = `
    inline-flex items-center justify-center gap-2
    rounded-xl px-4 py-2.5 text-sm font-medium
    transition disabled:cursor-not-allowed
    disabled:opacity-50
`;


export default function HealthProfileDetails() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [medicationModal, setMedicationModal] =
        useState(false);

    const [medicationLoading, setMedicationLoading] =
        useState(false);

    const [medicationForm, setMedicationForm] =
        useState({ ...emptyMedication });

    const [editingMedication, setEditingMedication] =
        useState(null);

    const [followUpModal, setFollowUpModal] =
        useState(false);

    const [followUpLoading, setFollowUpLoading] =
        useState(false);

    const [followUpForm, setFollowUpForm] =
        useState({ ...emptyFollowUp });

    const [editingFollowUp, setEditingFollowUp] =
        useState(null);

    const [productModal, setProductModal] =
        useState(false);

    const [productLoading, setProductLoading] =
        useState(false);

    const [productForm, setProductForm] =
        useState({ ...emptyFollowUpProduct });

    const [editingProduct, setEditingProduct] =
        useState(null);

    const [selectedFollowUp, setSelectedFollowUp] =
        useState(null);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    const [deleteTarget, setDeleteTarget] =
        useState(null);


    const loadProfile = useCallback(async () => {
        if (!id) {
            setProfile(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const response =
                await getHealthProfileDetails(id);

            setProfile(response?.data ?? response);
        } catch (error) {
            console.error(
                "Failed to load health profile:",
                error
            );

            setProfile(null);

            toast.error(
                getErrorMessage(
                    error,
                    "فشل تحميل الملف الصحي."
                )
            );
        } finally {
            setLoading(false);
        }
    }, [id]);


    useEffect(() => {
        loadProfile();
    }, [loadProfile]);


    // =====================================================
    // Medication Modal
    // =====================================================

    const openMedicationCreate = () => {
        setEditingMedication(null);

        setMedicationForm({
            ...emptyMedication,
        });

        setMedicationModal(true);
    };


    const openMedicationEdit = (medication) => {
        setEditingMedication(medication);

        setMedicationForm({
            product:
                medication.product_id ??
                (
                    typeof medication.product === "number"
                        ? medication.product
                        : medication.product?.id
                ) ??
                "",

            dosage: medication.dosage ?? "",

            frequency: medication.frequency ?? "",

            duration_days:
                medication.duration_days ?? "",

            start_date:
                medication.start_date ?? "",

            instructions:
                medication.instructions ?? "",
        });

        setMedicationModal(true);
    };


    const closeMedicationModal = (force = false) => {
        if (medicationLoading && !force) {
            return;
        }

        setMedicationModal(false);

        setEditingMedication(null);

        setMedicationForm({
            ...emptyMedication,
        });
    };


    const submitMedication = async (event) => {
        event.preventDefault();

        if (
            !medicationForm.product ||
            !medicationForm.dosage.trim() ||
            !medicationForm.frequency.trim()
        ) {
            toast.error(
                "من فضلك أكمل بيانات الدواء المطلوبة."
            );

            return;
        }

        setMedicationLoading(true);

        const payload = {
            patient: Number(id),

            product: Number(medicationForm.product),

            dosage: medicationForm.dosage.trim(),

            frequency: medicationForm.frequency.trim(),

            duration_days: toNumberOrNull(
                medicationForm.duration_days
            ),

            start_date:
                medicationForm.start_date || null,

            instructions:
                medicationForm.instructions.trim(),
        };

        try {
            if (editingMedication) {
                await updateHealthProfileMedication(
                    editingMedication.id,
                    payload
                );

                toast.success(
                    "تم تعديل بيانات الدواء بنجاح."
                );
            } else {
                await createHealthProfileMedication(
                    payload
                );

                toast.success(
                    "تمت إضافة الدواء بنجاح."
                );
            }

            closeMedicationModal(true);

            await loadProfile();
        } catch (error) {
            console.error(
                "Medication save failed:",
                error
            );

            toast.error(
                getErrorMessage(
                    error,
                    "فشل حفظ بيانات الدواء."
                )
            );
        } finally {
            setMedicationLoading(false);
        }
    };


    // =====================================================
    // Follow-up Modal
    // =====================================================

    const openFollowUpCreate = () => {
        setEditingFollowUp(null);

        setFollowUpForm({
            ...emptyFollowUp,

            follow_up_type:
                profile?.patient_type || "",

            follow_up_date: getToday(),
        });

        setFollowUpModal(true);
    };


    const openFollowUpEdit = (followUp) => {
        setEditingFollowUp(followUp);

        setFollowUpForm({
            follow_up_type:
                followUp.follow_up_type ?? "",

            follow_up_date:
                followUp.follow_up_date ?? "",

            next_follow_up_date:
                followUp.next_follow_up_date ?? "",

            weight_kg:
                followUp.weight_kg ?? "",

            height_cm:
                followUp.height_cm ?? "",

            weight_change_kg:
                followUp.weight_change_kg ?? "",

            waist_cm:
                followUp.waist_cm ?? "",

            blood_pressure:
                followUp.blood_pressure ?? "",

            blood_glucose:
                followUp.blood_glucose ?? "",

            pregnancy_week:
                followUp.pregnancy_week ?? "",

            goal:
                followUp.goal ?? "",

            progress:
                followUp.progress ?? "",

            symptoms:
                followUp.symptoms ?? "",

            customer_notes:
                followUp.customer_notes ?? "",

            pharmacist_notes:
                followUp.pharmacist_notes ?? "",

            recommendations:
                followUp.recommendations ?? "",
        });

        setFollowUpModal(true);
    };


    const closeFollowUpModal = (force = false) => {
        if (followUpLoading && !force) {
            return;
        }

        setFollowUpModal(false);

        setEditingFollowUp(null);

        setFollowUpForm({
            ...emptyFollowUp,
        });
    };


    const submitFollowUp = async (event) => {
        event.preventDefault();

        if (
            !followUpForm.follow_up_type ||
            !followUpForm.follow_up_date
        ) {
            toast.error(
                "من فضلك اختر نوع المتابعة وتاريخها."
            );

            return;
        }

        setFollowUpLoading(true);

        const payload = {
            patient: Number(id),

            follow_up_type:
                followUpForm.follow_up_type,

            follow_up_date:
                followUpForm.follow_up_date,

            next_follow_up_date:
                followUpForm.next_follow_up_date || null,

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
                followUpForm.blood_pressure.trim(),

            blood_glucose:
                toNumberOrNull(
                    followUpForm.blood_glucose
                ),

            pregnancy_week:
                toNumberOrNull(
                    followUpForm.pregnancy_week
                ),

            goal: followUpForm.goal.trim(),

            progress:
                followUpForm.progress.trim(),

            symptoms:
                followUpForm.symptoms.trim(),

            customer_notes:
                followUpForm.customer_notes.trim(),

            pharmacist_notes:
                followUpForm.pharmacist_notes.trim(),

            recommendations:
                followUpForm.recommendations.trim(),
        };

        try {
            if (editingFollowUp) {
                await updateHealthProfileFollowUp(
                    editingFollowUp.id,
                    payload
                );

                toast.success(
                    "تم تعديل المتابعة بنجاح."
                );
            } else {
                await createHealthProfileFollowUp(
                    payload
                );

                toast.success(
                    "تمت إضافة المتابعة بنجاح."
                );
            }

            /*
             * منتجات المتابعة يتم حفظها من خلال
             * نافذة مستقلة؛ لا ننشئها مرة أخرى
             * أثناء تعديل المتابعة حتى لا تتكرر.
             */

            closeFollowUpModal(true);

            await loadProfile();
        } catch (error) {
            console.error(
                "Follow-up save failed:",
                error
            );

            toast.error(
                getErrorMessage(
                    error,
                    "فشل حفظ بيانات المتابعة."
                )
            );
        } finally {
            setFollowUpLoading(false);
        }
    };


    // =====================================================
    // Follow-up Product Modal
    // =====================================================

    const openProductCreate = (followUp) => {
        setSelectedFollowUp(followUp);

        setEditingProduct(null);

        setProductForm({
            ...emptyFollowUpProduct,
        });

        setProductModal(true);
    };


    const openProductEdit = (followUp, product) => {
        setSelectedFollowUp(followUp);

        setEditingProduct(product);

        setProductForm({
            product:
                product.product_id ??
                (
                    typeof product.product === "number"
                        ? product.product
                        : product.product?.id
                ) ??
                "",

            usage_type:
                product.usage_type || "RECOMMENDED",

            dosage: product.dosage ?? "",

            frequency: product.frequency ?? "",

            instructions:
                product.instructions ?? "",

            started_at:
                product.started_at ?? "",

            stopped_at:
                product.stopped_at ?? "",

            notes: product.notes ?? "",
        });

        setProductModal(true);
    };


    const closeProductModal = (force = false) => {
        if (productLoading && !force) {
            return;
        }

        setProductModal(false);

        setSelectedFollowUp(null);

        setEditingProduct(null);

        setProductForm({
            ...emptyFollowUpProduct,
        });
    };


    const submitProduct = async (event) => {
        event.preventDefault();

        if (
            !selectedFollowUp?.id ||
            !productForm.product
        ) {
            toast.error(
                "من فضلك اختر المنتج."
            );

            return;
        }

        setProductLoading(true);

        const payload = {
            follow_up: selectedFollowUp.id,

            product: Number(productForm.product),

            usage_type:
                productForm.usage_type,

            dosage:
                productForm.dosage.trim(),

            frequency:
                productForm.frequency.trim(),

            instructions:
                productForm.instructions.trim(),

            started_at:
                productForm.started_at || null,

            stopped_at:
                productForm.stopped_at || null,

            notes:
                productForm.notes.trim(),
        };

        try {
            if (editingProduct) {
                await updateFollowUpProduct(
                    editingProduct.id,
                    payload
                );

                toast.success(
                    "تم تعديل منتج المتابعة."
                );
            } else {
                await createFollowUpProduct(
                    payload
                );

                toast.success(
                    "تمت إضافة المنتج للمتابعة."
                );
            }

            closeProductModal(true);

            await loadProfile();
        } catch (error) {
            console.error(
                "Follow-up product save failed:",
                error
            );

            toast.error(
                getErrorMessage(
                    error,
                    "فشل حفظ منتج المتابعة."
                )
            );
        } finally {
            setProductLoading(false);
        }
    };


    // =====================================================
    // Delete Actions
    // =====================================================

    const askDeleteProfile = () => {
        if (!profile?.id) {
            return;
        }

        setDeleteTarget({
            type: "patient",
            item: profile,
        });

        setDeleteOpen(true);
    };


    const askDeleteMedication = (medication) => {
        setDeleteTarget({
            type: "medication",
            item: medication,
        });

        setDeleteOpen(true);
    };


    const askDeleteFollowUp = (followUp) => {
        setDeleteTarget({
            type: "followUp",
            item: followUp,
        });

        setDeleteOpen(true);
    };


    const askDeleteProduct = (product) => {
        setDeleteTarget({
            type: "product",
            item: product,
        });

        setDeleteOpen(true);
    };


    const closeDeleteDialog = () => {
        if (deleteLoading) {
            return;
        }

        setDeleteOpen(false);

        setDeleteTarget(null);
    };


    const handleDelete = async () => {
        if (!deleteTarget?.item?.id) {
            return;
        }

        setDeleteLoading(true);

        try {
            switch (deleteTarget.type) {
                case "patient": {
                    await deleteHealthProfile(
                        deleteTarget.item.id
                    );

                    toast.success(
                        "تم حذف الملف الصحي بنجاح."
                    );

                    setDeleteOpen(false);

                    setDeleteTarget(null);

                    navigate("/admin/health-profiles");

                    return;
                }

                case "medication": {
                    await deleteHealthProfileMedication(
                        deleteTarget.item.id
                    );

                    toast.success(
                        "تم حذف الدواء بنجاح."
                    );

                    break;
                }

                case "followUp": {
                    await deleteHealthProfileFollowUp(
                        deleteTarget.item.id
                    );

                    toast.success(
                        "تم حذف المتابعة بنجاح."
                    );

                    break;
                }

                case "product": {
                    await deleteFollowUpProduct(
                        deleteTarget.item.id
                    );

                    toast.success(
                        "تم حذف المنتج من المتابعة."
                    );

                    break;
                }

                default:
                    return;
            }

            setDeleteOpen(false);

            setDeleteTarget(null);

            await loadProfile();
        } catch (error) {
            console.error(
                "Delete operation failed:",
                error
            );

            toast.error(
                getErrorMessage(
                    error,
                    "فشل تنفيذ عملية الحذف."
                )
            );
        } finally {
            setDeleteLoading(false);
        }
    };


    // =====================================================
    // Loading / Empty States
    // =====================================================

    if (loading) {
        return <Loading />;
    }

    if (!profile) {
        return (
            <div
                className="
                    flex min-h-[50vh] flex-col
                    items-center justify-center
                    gap-4 px-4 text-center
                "
            >
                <div
                    className="
                        flex h-16 w-16 items-center
                        justify-center rounded-2xl
                        bg-gray-100 text-gray-400
                    "
                >
                    <FileText size={30} />
                </div>

                <h2 className="text-xl font-bold text-gray-800">
                    الملف الصحي غير موجود
                </h2>

                <p className="text-sm text-gray-500">
                    تعذر العثور على الملف المطلوب.
                </p>

                <Link
                    to="/admin/health-profiles"
                    className={`
                        ${buttonClass}
                        bg-purple-700 text-white
                        hover:bg-purple-800
                    `}
                >
                    <ArrowLeft size={17} />
                    العودة للملفات الصحية
                </Link>
            </div>
        );
    }


    const fitness = profile.fitness || profile.nutrition;

    const medications = profile.medications || [];

    const diseases = profile.diseases || [];

    const advices = profile.advices || [];

    const visits = profile.visits || [];

    const followUps = profile.follow_ups || [];


    return (
        <div
            className="
                mx-auto w-full max-w-7xl
                space-y-6 p-4 sm:p-6
            "
            dir="rtl"
        >
            {/* ================================================= */}
            {/* Header */}
            {/* ================================================= */}

            <div
                className="
                    flex flex-col gap-4
                    sm:flex-row sm:items-center
                    sm:justify-between
                "
            >
                <div className="flex items-start gap-3">
                    <Link
                        to="/admin/health-profiles"
                        aria-label="العودة"
                        className="
                            flex h-11 w-11 shrink-0
                            items-center justify-center
                            rounded-xl border border-gray-200
                            bg-white text-gray-600
                            transition hover:bg-gray-50
                        "
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            تفاصيل الملف الصحي
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            عرض وإدارة البيانات الصحية للمريض.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={askDeleteProfile}
                    className={`
                        ${buttonClass}
                        border border-red-200
                        bg-red-50 text-red-600
                        hover:bg-red-100
                    `}
                >
                    <Trash2 size={17} />
                    حذف الملف الصحي
                </button>
            </div>


            {/* ================================================= */}
            {/* Patient Information */}
            {/* ================================================= */}

            <ProfileSection
                title="البيانات الأساسية"
                icon={UserRound}
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoItem
                        label="اسم المريض"
                        value={
                            profile.patient_name ||
                            profile.name ||
                            profile.patient?.full_name ||
                            profile.patient?.username
                        }
                    />

                    <InfoItem
                        label="اسم المستخدم"
                        value={
                            profile.patient_username ||
                            profile.patient?.username
                        }
                    />

                    <InfoItem
                        label="رقم الهاتف"
                        value={
                            profile.phone ||
                            profile.patient_phone ||
                            profile.patient?.phone
                        }
                    />

                    <InfoItem
                        label="البريد الإلكتروني"
                        value={
                            profile.email ||
                            profile.patient?.email
                        }
                    />

                    <InfoItem
                        label="نوع الملف"
                        value={
                            PROFILE_TYPES[
                                profile.patient_type
                            ]?.label ||
                            profile.patient_type
                        }
                    />

                    <InfoItem
                        label="تاريخ الإنشاء"
                        value={formatDate(profile.created_at)}
                        icon={CalendarDays}
                    />

                    <div className="sm:col-span-2 lg:col-span-3">
                        <InfoItem
                            label="العنوان"
                            value={profile.address}
                            icon={MapPin}
                        />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                        <InfoItem
                            label="الحساسية"
                            value={profile.allergies}
                        />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                        <InfoItem
                            label="ملاحظات طبية"
                            value={profile.medical_notes}
                        />
                    </div>
                </div>
            </ProfileSection>


            {/* ================================================= */}
            {/* Fitness And Nutrition */}
            {/* ================================================= */}

            {fitness && (
                <ProfileSection
                    title="بيانات اللياقة والتغذية"
                    icon={Activity}
                >
                    <InfoGrid
                        items={[
                            {
                                label: "الطول",
                                value: formatMetric(
                                    fitness.height_cm,
                                    "سم"
                                ),
                            },
                            {
                                label: "الوزن",
                                value: formatMetric(
                                    fitness.weight_kg,
                                    "كجم"
                                ),
                            },
                            {
                                label: "الوزن المستهدف",
                                value: formatMetric(
                                    fitness.target_weight_kg,
                                    "كجم"
                                ),
                            },
                            {
                                label: "الهدف الرياضي",
                                value: fitness.fitness_goal,
                            },
                            {
                                label: "الهدف الغذائي",
                                value: fitness.goal,
                            },
                            {
                                label: "مستوى النشاط",
                                value: fitness.activity_level,
                            },
                            {
                                label: "عدد الوجبات",
                                value: fitness.meals_per_day,
                            },
                            {
                                label: "استهلاك المياه",
                                value: formatMetric(
                                    fitness.water_intake_liters,
                                    "لتر"
                                ),
                            },
                            {
                                label: "النظام الغذائي",
                                value: fitness.dietary_preferences,
                            },
                            {
                                label: "الحساسية الغذائية",
                                value: fitness.food_allergies,
                            },
                            {
                                label: "روتين التمارين",
                                value: fitness.exercise_routine,
                            },
                            {
                                label: "ملاحظات التغذية",
                                value: fitness.nutrition_notes,
                            },
                            {
                                label: "ملاحظات عامة",
                                value: fitness.notes,
                            },
                        ]}
                    />
                </ProfileSection>
            )}


            {/* ================================================= */}
            {/* Pregnancy */}
            {/* ================================================= */}

            {profile.pregnancy && (
                <ProfileSection
                    title="بيانات الحمل"
                    icon={HeartPulse}
                >
                    <InfoGrid
                        items={[
                            {
                                label: "أسبوع الحمل",
                                value: profile.pregnancy.pregnancy_week,
                            },
                            {
                                label: "تاريخ الولادة المتوقع",
                                value: formatDate(
                                    profile.pregnancy.expected_delivery_date
                                ),
                            },
                            {
                                label: "حالة الحمل",
                                value: profile.pregnancy.status,
                            },
                            {
                                label: "ملاحظات المخاطر",
                                value: profile.pregnancy.risk_notes,
                            },
                            {
                                label: "ملاحظات",
                                value: profile.pregnancy.notes,
                            },
                        ]}
                    />
                </ProfileSection>
            )}


            {/* ================================================= */}
            {/* Child */}
            {/* ================================================= */}

            {profile.child && (
                <ProfileSection
                    title="بيانات الطفل"
                    icon={Baby}
                >
                    <InfoGrid
                        items={[
                            {
                                label: "اسم ولي الأمر",
                                value: profile.child.guardian_name,
                            },
                            {
                                label: "هاتف ولي الأمر",
                                value: profile.child.guardian_phone,
                            },
                            {
                                label: "الحساسية",
                                value:
                                    profile.child.allergies ||
                                    profile.allergies,
                            },
                            {
                                label: "ملاحظات",
                                value: profile.child.notes,
                            },
                        ]}
                    />
                </ProfileSection>
            )}


            {/* ================================================= */}
            {/* Chronic Diseases */}
            {/* ================================================= */}

            <ListSection
                title="الأمراض المزمنة"
                icon={HeartPulse}
                items={diseases}
                emptyText="لا توجد أمراض مزمنة مسجلة."
                renderItem={(item) => (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-800">
                            {item.disease_name ||
                                item.chronic_disease_name ||
                                item.disease?.name ||
                                item.name ||
                                "مرض مزمن"}
                        </h3>

                        <InfoGrid
                            items={[
                                {
                                    label: "تاريخ التشخيص",
                                    value: formatDate(
                                        item.diagnosed_at ||
                                        item.diagnosis_date
                                    ),
                                },
                                {
                                    label: "الحالة",
                                    value: item.status,
                                },
                                {
                                    label: "ملاحظات",
                                    value: item.notes,
                                },
                            ]}
                        />
                    </div>
                )}
            />


            {/* ================================================= */}
            {/* Medications */}
            {/* ================================================= */}

            <ListSection
                title="الأدوية"
                icon={Pill}
                items={medications}
                emptyText="لا توجد أدوية مسجلة."
                action={
                    <button
                        type="button"
                        onClick={openMedicationCreate}
                        className={`
                            ${buttonClass}
                            bg-purple-700 text-white
                            hover:bg-purple-800
                        `}
                    >
                        <Plus size={17} />
                        إضافة دواء
                    </button>
                }
                renderItem={(item) => (
                    <div className="space-y-4">
                        <div
                            className="
                                flex flex-col gap-3
                                sm:flex-row sm:items-start
                                sm:justify-between
                            "
                        >
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {item.product_name ||
                                        item.product?.name ||
                                        item.product ||
                                        "دواء"}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    {item.dosage || "—"}
                                    {" · "}
                                    {item.frequency || "—"}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <IconButton
                                    label="تعديل الدواء"
                                    onClick={() =>
                                        openMedicationEdit(item)
                                    }
                                >
                                    <Pencil size={16} />
                                </IconButton>

                                <IconButton
                                    label="حذف الدواء"
                                    danger
                                    onClick={() =>
                                        askDeleteMedication(item)
                                    }
                                >
                                    <Trash2 size={16} />
                                </IconButton>
                            </div>
                        </div>

                        <InfoGrid
                            items={[
                                {
                                    label: "مدة الاستخدام",
                                    value: item.duration_days
                                        ? `${item.duration_days} يوم`
                                        : "—",
                                },
                                {
                                    label: "تاريخ البداية",
                                    value: formatDate(
                                        item.start_date
                                    ),
                                },
                                {
                                    label: "تاريخ النهاية",
                                    value: formatDate(
                                        item.end_date
                                    ),
                                },
                                {
                                    label: "تعليمات",
                                    value: item.instructions,
                                },
                            ]}
                        />
                    </div>
                )}
            />


            {/* ================================================= */}
            {/* Advice */}
            {/* ================================================= */}

            <ListSection
                title="النصائح والإرشادات"
                icon={FileText}
                items={advices}
                emptyText="لا توجد نصائح مسجلة."
                renderItem={(item) => (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-800">
                            {item.title || item.advice_title || "نصيحة"}
                        </h3>

                        <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
                            {item.content ||
                                item.description ||
                                item.advice ||
                                "—"}
                        </p>

                        <p className="text-xs text-gray-400">
                            {formatDate(
                                item.created_at
                            )}
                        </p>
                    </div>
                )}
            />


            {/* ================================================= */}
            {/* Visits */}
            {/* ================================================= */}

            <ListSection
                title="الزيارات"
                icon={Stethoscope}
                items={visits}
                emptyText="لا توجد زيارات مسجلة."
                renderItem={(item) => (
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-semibold text-gray-800">
                                {item.title ||
                                    item.visit_type ||
                                    "زيارة"}
                            </h3>

                            <span
                                className="
                                    rounded-lg bg-purple-50
                                    px-3 py-1 text-xs
                                    font-medium text-purple-700
                                "
                            >
                                {formatDate(
                                    item.visit_date ||
                                    item.created_at
                                )}
                            </span>
                        </div>

                        <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
                            {item.notes ||
                                item.description ||
                                "لا توجد ملاحظات."}
                        </p>

                        {item.created_by_name && (
                            <p className="text-xs text-gray-400">
                                بواسطة: {item.created_by_name}
                            </p>
                        )}
                    </div>
                )}
            />


            {/* ================================================= */}
            {/* Follow-ups */}
            {/* ================================================= */}

            <ListSection
                title="المتابعات الصحية"
                icon={CalendarDays}
                items={followUps}
                emptyText="لا توجد متابعات مسجلة."
                action={
                    <button
                        type="button"
                        onClick={openFollowUpCreate}
                        className={`
                            ${buttonClass}
                            bg-purple-700 text-white
                            hover:bg-purple-800
                        `}
                    >
                        <Plus size={17} />
                        إضافة متابعة
                    </button>
                }
                renderItem={(item) => (
                    <div className="space-y-5">
                        <div
                            className="
                                flex flex-col gap-3
                                sm:flex-row sm:items-start
                                sm:justify-between
                            "
                        >
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {FOLLOW_UP_TYPES[
                                        item.follow_up_type
                                    ] ||
                                        item.follow_up_type ||
                                        "متابعة صحية"}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    تاريخ المتابعة:{" "}
                                    {formatDate(
                                        item.follow_up_date
                                    )}
                                </p>

                                {item.next_follow_up_date && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        المتابعة القادمة:{" "}
                                        {formatDate(
                                            item.next_follow_up_date
                                        )}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <IconButton
                                    label="تعديل المتابعة"
                                    onClick={() =>
                                        openFollowUpEdit(item)
                                    }
                                >
                                    <Pencil size={16} />
                                </IconButton>

                                <IconButton
                                    label="حذف المتابعة"
                                    danger
                                    onClick={() =>
                                        askDeleteFollowUp(item)
                                    }
                                >
                                    <Trash2 size={16} />
                                </IconButton>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            <FollowUpMetric
                                label="الوزن"
                                value={formatMetric(
                                    item.weight_kg,
                                    "كجم"
                                )}
                            />

                            <FollowUpMetric
                                label="الطول"
                                value={formatMetric(
                                    item.height_cm,
                                    "سم"
                                )}
                            />

                            <FollowUpMetric
                                label="تغير الوزن"
                                value={formatMetric(
                                    item.weight_change_kg,
                                    "كجم"
                                )}
                            />

                            <FollowUpMetric
                                label="محيط الخصر"
                                value={formatMetric(
                                    item.waist_cm,
                                    "سم"
                                )}
                            />

                            <FollowUpMetric
                                label="ضغط الدم"
                                value={item.blood_pressure}
                            />

                            <FollowUpMetric
                                label="سكر الدم"
                                value={item.blood_glucose}
                            />

                            <FollowUpMetric
                                label="أسبوع الحمل"
                                value={item.pregnancy_week}
                            />

                            <FollowUpMetric
                                label="مؤشر كتلة الجسم"
                                value={calculateBMI(
                                    item.weight_kg,
                                    item.height_cm
                                )}
                            />
                        </div>

                        <div className="space-y-3">
                            <FollowUpText
                                label="الهدف"
                                value={item.goal}
                            />

                            <FollowUpText
                                label="التقدم"
                                value={item.progress}
                            />

                            <FollowUpText
                                label="الأعراض"
                                value={item.symptoms}
                            />

                            <FollowUpText
                                label="ملاحظات المريض"
                                value={item.customer_notes}
                            />

                            <FollowUpText
                                label="ملاحظات الصيدلي"
                                value={item.pharmacist_notes}
                            />

                            <FollowUpText
                                label="التوصيات"
                                value={item.recommendations}
                            />
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <h4 className="font-semibold text-gray-800">
                                    المنتجات المرتبطة بالمتابعة
                                </h4>

                                <button
                                    type="button"
                                    onClick={() =>
                                        openProductCreate(item)
                                    }
                                    className={`
                                        ${buttonClass}
                                        border border-purple-200
                                        bg-purple-50 text-purple-700
                                        hover:bg-purple-100
                                    `}
                                >
                                    <Plus size={16} />
                                    إضافة منتج
                                </button>
                            </div>

                            {Array.isArray(item.products) &&
                                item.products.length > 0 ? (
                                <div className="space-y-3">
                                    {item.products.map(
                                        (product) => (
                                            <div
                                                key={product.id}
                                                className="
                                                    flex flex-col
                                                    gap-3 rounded-xl
                                                    border border-gray-100
                                                    bg-gray-50 p-4
                                                    sm:flex-row
                                                    sm:items-center
                                                    sm:justify-between
                                                "
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className="
                                                            flex h-10 w-10
                                                            shrink-0 items-center
                                                            justify-center
                                                            rounded-xl bg-white
                                                            text-purple-700
                                                        "
                                                    >
                                                        <Package
                                                            size={19}
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {product.product_name ||
                                                                product.product?.name ||
                                                                product.product ||
                                                                "منتج"}
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {USAGE_TYPES[
                                                                product.usage_type
                                                            ] ||
                                                                product.usage_type}
                                                        </p>

                                                        {(product.dosage ||
                                                            product.frequency) && (
                                                                <p className="mt-1 text-sm text-gray-500">
                                                                    {product.dosage}
                                                                    {product.dosage &&
                                                                        product.frequency &&
                                                                        " · "}
                                                                    {product.frequency}
                                                                </p>
                                                            )}

                                                        {product.instructions && (
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                {product.instructions}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <IconButton
                                                        label="تعديل المنتج"
                                                        onClick={() =>
                                                            openProductEdit(
                                                                item,
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <Pencil
                                                            size={16}
                                                        />
                                                    </IconButton>

                                                    <IconButton
                                                        label="حذف المنتج"
                                                        danger
                                                        onClick={() =>
                                                            askDeleteProduct(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <Trash2
                                                            size={16}
                                                        />
                                                    </IconButton>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                                    لا توجد منتجات مرتبطة بهذه المتابعة.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            />


            {/* ================================================= */}
            {/* Medication Modal */}
            {/* ================================================= */}

            {medicationModal && (
                <Modal
                    title={
                        editingMedication
                            ? "تعديل الدواء"
                            : "إضافة دواء"
                    }
                    onClose={() =>
                        closeMedicationModal()
                    }
                    loading={medicationLoading}
                >
                    <form
                        onSubmit={submitMedication}
                        className="space-y-4"
                    >
                        <FormField
                            label="رقم المنتج"
                            required
                        >
                            <input
                                type="number"
                                min="1"
                                value={medicationForm.product}
                                onChange={(event) =>
                                    setMedicationForm({
                                        ...medicationForm,
                                        product: event.target.value,
                                    })
                                }
                                className={inputClass}
                                placeholder="أدخل رقم المنتج"
                                required
                            />
                        </FormField>

                        <FormField
                            label="الجرعة"
                            required
                        >
                            <input
                                value={medicationForm.dosage}
                                onChange={(event) =>
                                    setMedicationForm({
                                        ...medicationForm,
                                        dosage: event.target.value,
                                    })
                                }
                                className={inputClass}
                                placeholder="مثال: قرص واحد"
                                required
                            />
                        </FormField>

                        <FormField
                            label="معدل الاستخدام"
                            required
                        >
                            <input
                                value={medicationForm.frequency}
                                onChange={(event) =>
                                    setMedicationForm({
                                        ...medicationForm,
                                        frequency: event.target.value,
                                    })
                                }
                                className={inputClass}
                                placeholder="مثال: مرتين يوميًا"
                                required
                            />
                        </FormField>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField label="مدة الاستخدام بالأيام">
                                <input
                                    type="number"
                                    min="1"
                                    value={
                                        medicationForm.duration_days
                                    }
                                    onChange={(event) =>
                                        setMedicationForm({
                                            ...medicationForm,
                                            duration_days:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField label="تاريخ البداية">
                                <input
                                    type="date"
                                    value={
                                        medicationForm.start_date
                                    }
                                    onChange={(event) =>
                                        setMedicationForm({
                                            ...medicationForm,
                                            start_date:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                />
                            </FormField>
                        </div>

                        <FormField label="تعليمات إضافية">
                            <textarea
                                rows={3}
                                value={
                                    medicationForm.instructions
                                }
                                onChange={(event) =>
                                    setMedicationForm({
                                        ...medicationForm,
                                        instructions:
                                            event.target.value,
                                    })
                                }
                                className={inputClass}
                            />
                        </FormField>

                        <ModalActions
                            onCancel={() =>
                                closeMedicationModal()
                            }
                            loading={medicationLoading}
                            submitLabel={
                                editingMedication
                                    ? "حفظ التعديلات"
                                    : "إضافة الدواء"
                            }
                        />
                    </form>
                </Modal>
            )}


            {/* ================================================= */}
            {/* Follow-up Modal */}
            {/* ================================================= */}

            {followUpModal && (
                <Modal
                    title={
                        editingFollowUp
                            ? "تعديل المتابعة"
                            : "إضافة متابعة"
                    }
                    onClose={() =>
                        closeFollowUpModal()
                    }
                    loading={followUpLoading}
                    large
                >
                    <form
                        onSubmit={submitFollowUp}
                        className="space-y-5"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                label="نوع المتابعة"
                                required
                            >
                                <select
                                    value={
                                        followUpForm.follow_up_type
                                    }
                                    onChange={(event) =>
                                        setFollowUpForm({
                                            ...followUpForm,
                                            follow_up_type:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                    required
                                >
                                    <option value="">
                                        اختر نوع المتابعة
                                    </option>

                                    {Object.entries(
                                        FOLLOW_UP_TYPES
                                    ).map(([value, label]) => (
                                        <option
                                            key={value}
                                            value={value}
                                        >
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </FormField>

                            <FormField
                                label="تاريخ المتابعة"
                                required
                            >
                                <input
                                    type="date"
                                    value={
                                        followUpForm.follow_up_date
                                    }
                                    onChange={(event) =>
                                        setFollowUpForm({
                                            ...followUpForm,
                                            follow_up_date:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                    required
                                />
                            </FormField>

                            <FormField label="المتابعة القادمة">
                                <input
                                    type="date"
                                    value={
                                        followUpForm.next_follow_up_date
                                    }
                                    onChange={(event) =>
                                        setFollowUpForm({
                                            ...followUpForm,
                                            next_follow_up_date:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField label="الوزن بالكيلوجرام">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={followUpForm.weight_kg}
                                    onChange={(event) =>
                                        setFollowUpForm({
                                            ...followUpForm,
                                            weight_kg:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField label="الطول بالسنتيمتر">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={followUpForm.height_cm}
                                    onChange={(event) =>
                                        setFollowUpForm({
                                            ...followUpForm,
                                            height_cm:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField label="تغير الوزن بالكيلوجرام">
                                <input
                                    type="number"
                                    step="0.01"
                                    value={
                                        followUpForm.weight_change_kg
                                    }
                                    onChange={(event) =>
                                        setFollowUpForm({
                                            ...followUpForm,
                                            weight_change_kg:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField label="محيط الخصر بالسنتيمتر">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={followUpForm.waist_cm}
                                    onChange={(event) =>
                                        setFollowUpForm({
                                            ...followUpForm,
                                            waist_cm:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField label="ضغط الدم">
                                <input
                                    value={
                                        followUpForm.blood_pressure
                                    }
                                    onChange={(event) =>
                                        setFollowUpForm({
                                            ...followUpForm,
                                            blood_pressure:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                    placeholder="مثال: 120/80"
                                />
                            </FormField>

                            <FormField label="سكر الدم">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={
                                        followUpForm.blood_glucose
                                    }
                                    onChange={(event) =>
                                        setFollowUpForm({
                                            ...followUpForm,
                                            blood_glucose:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField label="أسبوع الحمل">
                                <input
                                    type="number"
                                    min="1"
                                    max="45"
                                    value={
                                        followUpForm.pregnancy_week
                                    }
                                    onChange={(event) =>
                                        setFollowUpForm({
                                            ...followUpForm,
                                            pregnancy_week:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                />
                            </FormField>
                        </div>

                        <FormField label="الهدف">
                            <textarea
                                rows={2}
                                value={followUpForm.goal}
                                onChange={(event) =>
                                    setFollowUpForm({
                                        ...followUpForm,
                                        goal: event.target.value,
                                    })
                                }
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="التقدم">
                            <textarea
                                rows={2}
                                value={followUpForm.progress}
                                onChange={(event) =>
                                    setFollowUpForm({
                                        ...followUpForm,
                                        progress: event.target.value,
                                    })
                                }
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="الأعراض">
                            <textarea
                                rows={2}
                                value={followUpForm.symptoms}
                                onChange={(event) =>
                                    setFollowUpForm({
                                        ...followUpForm,
                                        symptoms: event.target.value,
                                    })
                                }
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="ملاحظات المريض">
                            <textarea
                                rows={2}
                                value={
                                    followUpForm.customer_notes
                                }
                                onChange={(event) =>
                                    setFollowUpForm({
                                        ...followUpForm,
                                        customer_notes:
                                            event.target.value,
                                    })
                                }
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="ملاحظات الصيدلي">
                            <textarea
                                rows={2}
                                value={
                                    followUpForm.pharmacist_notes
                                }
                                onChange={(event) =>
                                    setFollowUpForm({
                                        ...followUpForm,
                                        pharmacist_notes:
                                            event.target.value,
                                    })
                                }
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="التوصيات">
                            <textarea
                                rows={3}
                                value={
                                    followUpForm.recommendations
                                }
                                onChange={(event) =>
                                    setFollowUpForm({
                                        ...followUpForm,
                                        recommendations:
                                            event.target.value,
                                    })
                                }
                                className={inputClass}
                            />
                        </FormField>

                        <ModalActions
                            onCancel={() =>
                                closeFollowUpModal()
                            }
                            loading={followUpLoading}
                            submitLabel={
                                editingFollowUp
                                    ? "حفظ التعديلات"
                                    : "إضافة المتابعة"
                            }
                        />
                    </form>
                </Modal>
            )}


            {/* ================================================= */}
            {/* Follow-up Product Modal */}
            {/* ================================================= */}

            {productModal && (
                <Modal
                    title={
                        editingProduct
                            ? "تعديل منتج المتابعة"
                            : "إضافة منتج للمتابعة"
                    }
                    onClose={() =>
                        closeProductModal()
                    }
                    loading={productLoading}
                >
                    <form
                        onSubmit={submitProduct}
                        className="space-y-4"
                    >
                        <FormField
                            label="رقم المنتج"
                            required
                        >
                            <input
                                type="number"
                                min="1"
                                value={productForm.product}
                                onChange={(event) =>
                                    setProductForm({
                                        ...productForm,
                                        product: event.target.value,
                                    })
                                }
                                className={inputClass}
                                placeholder="أدخل رقم المنتج"
                                required
                            />
                        </FormField>

                        <FormField label="حالة الاستخدام">
                            <select
                                value={productForm.usage_type}
                                onChange={(event) =>
                                    setProductForm({
                                        ...productForm,
                                        usage_type:
                                            event.target.value,
                                    })
                                }
                                className={inputClass}
                            >
                                {Object.entries(
                                    USAGE_TYPES
                                ).map(([value, label]) => (
                                    <option
                                        key={value}
                                        value={value}
                                    >
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label="الجرعة">
                            <input
                                value={productForm.dosage}
                                onChange={(event) =>
                                    setProductForm({
                                        ...productForm,
                                        dosage: event.target.value,
                                    })
                                }
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="معدل الاستخدام">
                            <input
                                value={productForm.frequency}
                                onChange={(event) =>
                                    setProductForm({
                                        ...productForm,
                                        frequency: event.target.value,
                                    })
                                }
                                className={inputClass}
                            />
                        </FormField>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField label="تاريخ البداية">
                                <input
                                    type="date"
                                    value={productForm.started_at}
                                    onChange={(event) =>
                                        setProductForm({
                                            ...productForm,
                                            started_at:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField label="تاريخ التوقف">
                                <input
                                    type="date"
                                    value={productForm.stopped_at}
                                    onChange={(event) =>
                                        setProductForm({
                                            ...productForm,
                                            stopped_at:
                                                event.target.value,
                                        })
                                    }
                                    className={inputClass}
                                />
                            </FormField>
                        </div>

                        <FormField label="تعليمات الاستخدام">
                            <textarea
                                rows={2}
                                value={productForm.instructions}
                                onChange={(event) =>
                                    setProductForm({
                                        ...productForm,
                                        instructions:
                                            event.target.value,
                                    })
                                }
                                className={inputClass}
                            />
                        </FormField>

                        <FormField label="ملاحظات">
                            <textarea
                                rows={2}
                                value={productForm.notes}
                                onChange={(event) =>
                                    setProductForm({
                                        ...productForm,
                                        notes: event.target.value,
                                    })
                                }
                                className={inputClass}
                            />
                        </FormField>

                        <ModalActions
                            onCancel={() =>
                                closeProductModal()
                            }
                            loading={productLoading}
                            submitLabel={
                                editingProduct
                                    ? "حفظ التعديلات"
                                    : "إضافة المنتج"
                            }
                        />
                    </form>
                </Modal>
            )}


            {/* ================================================= */}
            {/* Delete Confirmation */}
            {/* ================================================= */}

            <ConfirmDialog
                open={deleteOpen}
                onClose={closeDeleteDialog}
                onConfirm={handleDelete}
                loading={deleteLoading}
                title={getDeleteTitle(deleteTarget)}
                message={getDeleteMessage(deleteTarget)}
            />
        </div>
    );
}


// =========================================================
// Helpers
// =========================================================

function getToday() {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function toNumberOrNull(value) {
    if (
        value === "" ||
        value === null ||
        value === undefined
    ) {
        return null;
    }

    const number = Number(value);

    return Number.isNaN(number)
        ? null
        : number;
}


function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("ar-EG");
}


function formatMetric(value, unit = "") {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    return `${value}${unit ? ` ${unit}` : ""}`;
}


function calculateBMI(weight, height) {
    const numericWeight = Number(weight);

    const numericHeight = Number(height);

    if (
        !numericWeight ||
        !numericHeight ||
        numericWeight <= 0 ||
        numericHeight <= 0
    ) {
        return "—";
    }

    const heightInMeters =
        numericHeight / 100;

    return (
        numericWeight /
        (heightInMeters * heightInMeters)
    ).toFixed(1);
}


function getErrorMessage(error, fallback) {
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

    if (data && typeof data === "object") {
        const firstKey = Object.keys(data)[0];

        if (firstKey) {
            const value = data[firstKey];

            if (Array.isArray(value) && value.length) {
                return String(value[0]);
            }

            if (typeof value === "string") {
                return value;
            }
        }
    }

    return fallback;
}


function getDeleteTitle(target) {
    if (target?.type === "patient") {
        return "حذف الملف الصحي";
    }

    if (target?.type === "medication") {
        return "حذف الدواء";
    }

    if (target?.type === "followUp") {
        return "حذف المتابعة";
    }

    if (target?.type === "product") {
        return "حذف المنتج";
    }

    return "تأكيد الحذف";
}


function getDeleteMessage(target) {
    if (target?.type === "patient") {
        return (
            "هل أنت متأكد من حذف الملف الصحي بالكامل؟ " +
            "لا يمكن التراجع عن هذا الإجراء."
        );
    }

    if (target?.type === "medication") {
        return "هل أنت متأكد من حذف هذا الدواء؟";
    }

    if (target?.type === "followUp") {
        return (
            "هل أنت متأكد من حذف هذه المتابعة " +
            "وما يرتبط بها من بيانات؟"
        );
    }

    if (target?.type === "product") {
        return "هل أنت متأكد من حذف المنتج من المتابعة؟";
    }

    return "هل أنت متأكد من تنفيذ عملية الحذف؟";
}


// =========================================================
// Reusable Components
// =========================================================

function Modal({
    title,
    children,
    onClose,
    loading,
    large = false,
}) {
    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                overflow-y-auto bg-black/50
                p-3 sm:p-6
            "
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !loading
                ) {
                    onClose();
                }
            }}
        >
            <div
                className={`
                    my-auto w-full rounded-2xl
                    bg-white shadow-xl
                    ${large ? "max-w-3xl" : "max-w-xl"}
                `}
                dir="rtl"
            >
                <div
                    className="
                        flex items-center justify-between
                        gap-3 border-b border-gray-100
                        px-5 py-4
                    "
                >
                    <h2 className="text-lg font-bold text-gray-900">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="إغلاق"
                        className="
                            flex h-9 w-9 items-center
                            justify-center rounded-lg
                            text-gray-500 transition
                            hover:bg-gray-100
                            disabled:opacity-50
                        "
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="max-h-[75vh] overflow-y-auto p-5">
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
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}

                {required && (
                    <span className="mr-1 text-red-500">
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
        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
            <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className={`
                    ${buttonClass}
                    border border-gray-200
                    bg-white text-gray-600
                    hover:bg-gray-50
                `}
            >
                إلغاء
            </button>

            <button
                type="submit"
                disabled={loading}
                className={`
                    ${buttonClass}
                    bg-purple-700 text-white
                    hover:bg-purple-800
                `}
            >
                {loading ? "جارٍ الحفظ..." : submitLabel}
            </button>
        </div>
    );
}


function IconButton({
    children,
    label,
    onClick,
    danger = false,
}) {
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            onClick={onClick}
            className={`
                flex h-9 w-9 items-center
                justify-center rounded-lg
                border transition
                ${danger
                    ? "border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }
            `}
        >
            {children}
        </button>
    );
}


function InfoItem({
    label,
    value,
    icon: Icon,
}) {
    const displayValue =
        value === null ||
            value === undefined ||
            value === ""
            ? "—"
            : value;

    return (
        <div className="min-w-0 rounded-xl bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
                {Icon && <Icon size={15} />}

                <span>{label}</span>
            </div>

            <p className="whitespace-pre-wrap break-words text-sm font-medium leading-6 text-gray-800">
                {displayValue}
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
        <section
            className="
                overflow-hidden rounded-2xl
                border border-gray-100
                bg-white shadow-sm
            "
        >
            <div
                className="
                    flex items-center gap-3
                    border-b border-gray-100
                    px-5 py-4
                "
            >
                <div
                    className="
                        flex h-10 w-10 items-center
                        justify-center rounded-xl
                        bg-purple-50 text-purple-700
                    "
                >
                    <Icon size={20} />
                </div>

                <h2 className="font-bold text-gray-900">
                    {title}
                </h2>
            </div>

            <div className="p-5">
                {children}
            </div>
        </section>
    );
}


function InfoGrid({ items = [] }) {
    const visibleItems = items.filter(
        (item) =>
            item.value !== null &&
            item.value !== undefined &&
            item.value !== ""
    );

    if (!visibleItems.length) {
        return (
            <p className="text-sm text-gray-500">
                لا توجد بيانات مسجلة.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item, index) => (
                <InfoItem
                    key={`${item.label}-${index}`}
                    label={item.label}
                    value={item.value}
                />
            ))}
        </div>
    );
}


function FollowUpMetric({
    label,
    value,
}) {
    return (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
                {label}
            </p>

            <p className="mt-2 break-words text-sm font-semibold text-gray-800">
                {value || "—"}
            </p>
        </div>
    );
}


function FollowUpText({
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
        <div>
            <h4 className="mb-1 text-sm font-semibold text-gray-700">
                {label}
            </h4>

            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
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
    action,
    renderItem,
}) {
    return (
        <section
            className="
                overflow-hidden rounded-2xl
                border border-gray-100
                bg-white shadow-sm
            "
        >
            <div
                className="
                    flex flex-col gap-3
                    border-b border-gray-100
                    px-5 py-4
                    sm:flex-row sm:items-center
                    sm:justify-between
                "
            >
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex h-10 w-10 items-center
                            justify-center rounded-xl
                            bg-purple-50 text-purple-700
                        "
                    >
                        <Icon size={20} />
                    </div>

                    <h2 className="font-bold text-gray-900">
                        {title}
                    </h2>

                    <span
                        className="
                            rounded-full bg-gray-100
                            px-2.5 py-1 text-xs
                            font-semibold text-gray-600
                        "
                    >
                        {items.length}
                    </span>
                </div>

                {action}
            </div>

            <div className="divide-y divide-gray-100">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <div
                            key={
                                item.id ??
                                `${title}-${index}`
                            }
                            className="p-5"
                        >
                            {renderItem(item)}
                        </div>
                    ))
                ) : (
                    <div className="px-5 py-10 text-center">
                        <p className="text-sm text-gray-500">
                            {emptyText}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}