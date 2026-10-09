import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    Activity,
    Baby,
    Eye,
    HeartPulse,
    Search,
    UserRound,
    Utensils,
} from "lucide-react";

import toast from "react-hot-toast";

import patientService from "../../../services/patients/patientService";

import Loading from "../../../components/ui/feedback/Loading";

import EmptyState from "../../../components/ui/feedback/EmptyState";


const PROFILE_TYPES = [
    {
        value: "FITNESS",
        label: "لياقة بدنية",
        icon: Activity,
    },
    {
        value: "NUTRITION",
        label: "تغذية",
        icon: Utensils,
    },
    {
        value: "CHRONIC",
        label: "أمراض مزمنة",
        icon: HeartPulse,
    },
    {
        value: "PREGNANCY",
        label: "متابعة الحمل",
        icon: UserRound,
    },
    {
        value: "CHILD",
        label: "ملف طفل",
        icon: Baby,
    },
];


const getProfileType = (type) => {
    return (
        PROFILE_TYPES.find(
            (item) => item.value === type
        ) || {
            label: "غير محدد",
            icon: UserRound,
        }
    );
};


const getGenderLabel = (gender) => {
    if (gender === "MALE") {
        return "ذكر";
    }

    if (gender === "FEMALE") {
        return "أنثى";
    }

    return "—";
};


const formatDate = (date) => {
    if (!date) {
        return "—";
    }

    return new Date(date).toLocaleDateString(
        "ar-EG",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
};


export default function HealthProfiles() {
    const [profiles, setProfiles] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [profileType, setProfileType] = useState("");

    const [gender, setGender] = useState("");

    const [childOnly, setChildOnly] = useState("");


    const loadProfiles = async () => {
        try {
            setLoading(true);

            const data = await patientService.getPatients({
                search: search.trim() || undefined,
                patient_type: profileType || undefined,
                gender: gender || undefined,
                is_for_child: childOnly || undefined,
            });

            setProfiles(
                Array.isArray(data)
                    ? data
                    : data?.results || []
            );
        } catch (error) {
            toast.error(
                error.response?.data?.detail ||
                "حدث خطأ أثناء تحميل الملفات الصحية"
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            loadProfiles();
        }, 350);

        return () => clearTimeout(timer);
    }, [
        search,
        profileType,
        gender,
        childOnly,
    ]);


    const stats = useMemo(() => {
        return {
            total: profiles.length,

            children: profiles.filter(
                (profile) => profile.is_for_child
            ).length,

            chronic: profiles.filter(
                (profile) =>
                    profile.patient_type === "CHRONIC"
            ).length,

            pregnancy: profiles.filter(
                (profile) =>
                    profile.patient_type === "PREGNANCY"
            ).length,
        };
    }, [profiles]);


    return (
        <div
            dir="rtl"
            className="space-y-6"
        >
            <div className="
                flex
                flex-col
                gap-4
                lg:flex-row
                lg:items-center
                lg:justify-between
            ">
                <div>
                    <h1 className="
                        text-2xl
                        font-bold
                        text-gray-900
                    ">
                        الملفات الصحية
                    </h1>

                    <p className="
                        mt-1
                        text-sm
                        text-gray-500
                    ">
                        إدارة ومتابعة الملفات الصحية والبيانات الطبية للعملاء
                    </p>
                </div>

                <Link
                    to="/admin/health-profiles/create"
                    className="
                        inline-flex
                        items-center
                        justify-center
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
                    "
                >
                    إضافة ملف صحي
                </Link>
            </div>

            <div className="
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
            ">
                <StatCard
                    title="إجمالي الملفات"
                    value={stats.total}
                    icon={UserRound}
                />

                <StatCard
                    title="ملفات الأطفال"
                    value={stats.children}
                    icon={Baby}
                />

                <StatCard
                    title="الأمراض المزمنة"
                    value={stats.chronic}
                    icon={HeartPulse}
                />

                <StatCard
                    title="متابعة الحمل"
                    value={stats.pregnancy}
                    icon={Activity}
                />
            </div>

            <div className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
            ">
                <div className="mb-5">
                    <h2 className="
                        font-semibold
                        text-gray-900
                    ">
                        البحث والتصفية
                    </h2>

                    <p className="
                        mt-1
                        text-xs
                        text-gray-500
                    ">
                        ابحث عن ملف صحي أو استخدم الفلاتر للوصول إلى النتائج المطلوبة
                    </p>
                </div>

                <div className="
                    grid
                    gap-4
                    md:grid-cols-2
                    xl:grid-cols-4
                ">
                    <div className="relative">
                        <Search
                            size={18}
                            className="
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                            "
                        />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="ابحث باسم المريض أو رقم الهاتف..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                bg-gray-50
                                py-3
                                pl-4
                                pr-11
                                text-sm
                                outline-none
                                transition
                                focus:border-primary-500
                                focus:bg-white
                                focus:ring-2
                                focus:ring-primary-100
                            "
                        />
                    </div>

                    <select
                        value={profileType}
                        onChange={(event) =>
                            setProfileType(
                                event.target.value
                            )
                        }
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            bg-gray-50
                            px-4
                            py-3
                            text-sm
                            outline-none
                            transition
                            focus:border-primary-500
                            focus:bg-white
                        "
                    >
                        <option value="">
                            جميع أنواع الملفات
                        </option>

                        {PROFILE_TYPES.map(
                            (type) => (
                                <option
                                    key={type.value}
                                    value={type.value}
                                >
                                    {type.label}
                                </option>
                            )
                        )}
                    </select>

                    <select
                        value={gender}
                        onChange={(event) =>
                            setGender(
                                event.target.value
                            )
                        }
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            bg-gray-50
                            px-4
                            py-3
                            text-sm
                            outline-none
                            transition
                            focus:border-primary-500
                            focus:bg-white
                        "
                    >
                        <option value="">
                            جميع الأنواع
                        </option>

                        <option value="MALE">
                            ذكور
                        </option>

                        <option value="FEMALE">
                            إناث
                        </option>
                    </select>

                    <select
                        value={childOnly}
                        onChange={(event) =>
                            setChildOnly(
                                event.target.value
                            )
                        }
                        className="
                            rounded-xl
                            border
                            border-gray-200
                            bg-gray-50
                            px-4
                            py-3
                            text-sm
                            outline-none
                            transition
                            focus:border-primary-500
                            focus:bg-white
                        "
                    >
                        <option value="">
                            جميع الملفات
                        </option>

                        <option value="true">
                            الأطفال فقط
                        </option>

                        <option value="false">
                            البالغون فقط
                        </option>
                    </select>
                </div>
            </div>

            <div className="
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-sm
            ">
                <div className="
                    flex
                    flex-col
                    gap-2
                    border-b
                    border-gray-100
                    px-5
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">
                    <div>
                        <h2 className="
                            font-semibold
                            text-gray-900
                        ">
                            قائمة الملفات الصحية
                        </h2>

                        <p className="
                            mt-1
                            text-xs
                            text-gray-500
                        ">
                            {profiles.length} ملف صحي
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="p-8">
                        <Loading />
                    </div>
                ) : profiles.length === 0 ? (
                    <div className="p-8">
                        <EmptyState
                            title="لا توجد ملفات صحية"
                            description="لا توجد ملفات تطابق معايير البحث والتصفية الحالية."
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead className="
                                border-b
                                border-gray-200
                                bg-gray-50
                            ">
                                <tr>
                                    <TableHeader>
                                        المريض
                                    </TableHeader>

                                    <TableHeader>
                                        العميل
                                    </TableHeader>

                                    <TableHeader>
                                        نوع الملف
                                    </TableHeader>

                                    <TableHeader>
                                        النوع
                                    </TableHeader>

                                    <TableHeader>
                                        رقم الهاتف
                                    </TableHeader>

                                    <TableHeader>
                                        تاريخ الإنشاء
                                    </TableHeader>

                                    <TableHeader align="left">
                                        الإجراءات
                                    </TableHeader>
                                </tr>
                            </thead>

                            <tbody className="
                                divide-y
                                divide-gray-100
                            ">
                                {profiles.map(
                                    (profile) => {
                                        const type =
                                            getProfileType(
                                                profile.patient_type
                                            );

                                        const Icon =
                                            type.icon;

                                        return (
                                            <tr
                                                key={
                                                    profile.id
                                                }
                                                className="
                                                    transition
                                                    hover:bg-gray-50
                                                "
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    ">
                                                        <div className="
                                                            flex
                                                            h-11
                                                            w-11
                                                            shrink-0
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

                                                        <div className="min-w-0">
                                                            <p className="
                                                                truncate
                                                                font-semibold
                                                                text-gray-900
                                                            ">
                                                                {
                                                                    profile.name
                                                                }
                                                            </p>

                                                            {profile.is_for_child && (
                                                                <span className="
                                                                    mt-1
                                                                    inline-flex
                                                                    rounded-full
                                                                    bg-amber-50
                                                                    px-2
                                                                    py-0.5
                                                                    text-[11px]
                                                                    font-medium
                                                                    text-amber-700
                                                                ">
                                                                    ملف طفل
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="
                                                    px-5
                                                    py-4
                                                    text-sm
                                                    text-gray-700
                                                ">
                                                    {
                                                        profile.customer_name ||
                                                        "—"
                                                    }
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="
                                                        inline-flex
                                                        items-center
                                                        rounded-full
                                                        bg-primary-50
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-semibold
                                                        text-primary-700
                                                    ">
                                                        {
                                                            profile.patient_type_display ||
                                                            type.label
                                                        }
                                                    </span>
                                                </td>

                                                <td className="
                                                    px-5
                                                    py-4
                                                    text-sm
                                                    text-gray-600
                                                ">
                                                    {getGenderLabel(
                                                        profile.gender
                                                    )}
                                                </td>

                                                <td
                                                    dir="ltr"
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-right
                                                        text-sm
                                                        text-gray-600
                                                    "
                                                >
                                                    {
                                                        profile.phone ||
                                                        profile.customer_phone ||
                                                        "—"
                                                    }
                                                </td>

                                                <td className="
                                                    px-5
                                                    py-4
                                                    text-sm
                                                    text-gray-600
                                                ">
                                                    {formatDate(
                                                        profile.created_at
                                                    )}
                                                </td>

                                                <td className="
                                                    px-5
                                                    py-4
                                                    text-left
                                                ">
                                                    <Link
                                                        to={`/admin/health-profiles/${profile.id}`}
                                                        title="عرض الملف"
                                                        className="
                                                            inline-flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-lg
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
                                                        <Eye
                                                            size={17}
                                                        />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}


function StatCard({
    title,
    value,
    icon: Icon,
}) {
    return (
        <div className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-5
            shadow-sm
            transition
            hover:shadow-md
        ">
            <div className="
                flex
                items-center
                justify-between
            ">
                <div>
                    <p className="
                        text-sm
                        font-medium
                        text-gray-500
                    ">
                        {title}
                    </p>

                    <p className="
                        mt-2
                        text-2xl
                        font-bold
                        text-gray-900
                    ">
                        {value}
                    </p>
                </div>

                <div className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary-50
                    text-primary-600
                ">
                    <Icon size={21} />
                </div>
            </div>
        </div>
    );
}


function TableHeader({
    children,
    align = "right",
}) {
    return (
        <th
            className={`
                px-5
                py-4
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-gray-500
                ${align === "left"
                    ? "text-left"
                    : "text-right"
                }
            `}
        >
            {children}
        </th>
    );
}