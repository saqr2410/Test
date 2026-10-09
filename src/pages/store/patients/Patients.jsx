import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Activity,
    Baby,
    ChevronRight,
    HeartPulse,
    Plus,
    Search,
    UserRound,
    Utensils,
} from "lucide-react";
import toast from "react-hot-toast";

import patientService from "../../../services/patients/patientService";
import Loading from "../../../components/ui/feedback/Loading";
import EmptyState from "../../../components/ui/feedback/EmptyState";

const patientTypes = [
    {
        value: "FITNESS",
        label: "Fitness",
        icon: Activity,
    },
    {
        value: "NUTRITION",
        label: "Nutrition",
        icon: Utensils,
    },
    {
        value: "CHRONIC",
        label: "Chronic Disease",
        icon: HeartPulse,
    },
    {
        value: "PREGNANCY",
        label: "Pregnancy",
        icon: HeartPulse,
    },
    {
        value: "CHILD",
        label: "Child",
        icon: Baby,
    },
];

const getPatientType = (type) =>
    patientTypes.find((item) => item.value === type) || {
        label: type || "Health Profile",
        icon: UserRound,
    };

const getGenderLabel = (gender) => {
    if (gender === "MALE") {
        return "Male";
    }

    if (gender === "FEMALE") {
        return "Female";
    }

    return gender || "";
};

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");

    const loadPatients = async () => {
        try {
            setLoading(true);

            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (type) {
                params.patient_type = type;
            }

            const data = await patientService.getPatients(params);

            setPatients(
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.results)
                        ? data.results
                        : []
            );
        } catch (error) {
            toast.error(
                error?.response?.data?.detail ||
                error?.response?.data?.error ||
                "Failed to load health profiles."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadPatients();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, type]);

    if (loading && patients.length === 0) {
        return <Loading />;
    }

    return (
        <div
            dir="ltr"
            className="space-y-6"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        My Health Profiles
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your health profiles and medical information.
                    </p>
                </div>

                <Link
                    to="/patients/create"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                    <Plus size={18} />
                    Create Profile
                </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search by name or phone..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary-500 focus:bg-white"
                        />
                    </div>

                    <select
                        value={type}
                        onChange={(event) =>
                            setType(event.target.value)
                        }
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-primary-500 focus:bg-white"
                    >
                        <option value="">
                            All Profiles
                        </option>

                        {patientTypes.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && patients.length > 0 && (
                <div className="flex items-center justify-center py-4">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
                </div>
            )}

            {!loading && patients.length === 0 ? (
                <EmptyState
                    title="No health profiles found"
                    description="Create your first health profile to get started."
                />
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {patients.map((patient) => {
                        const typeInfo = getPatientType(
                            patient.patient_type
                        );

                        const Icon = typeInfo.icon;

                        return (
                            <Link
                                key={patient.id}
                                to={`/patients/${patient.id}`}
                                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                                        <Icon size={23} />
                                    </div>

                                    <ChevronRight
                                        size={20}
                                        className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-primary-600"
                                    />
                                </div>

                                <div className="mt-5">
                                    <h2 className="font-semibold text-gray-900">
                                        {patient.name || "Unnamed Profile"}
                                    </h2>

                                    <p className="mt-1 text-sm text-primary-600">
                                        {patient.patient_type_display ||
                                            typeInfo.label}
                                    </p>
                                </div>

                                <div className="mt-5 space-y-2 text-sm text-gray-500">
                                    {patient.phone && (
                                        <p>
                                            Phone: {patient.phone}
                                        </p>
                                    )}

                                    {patient.date_of_birth && (
                                        <p>
                                            Date of birth:{" "}
                                            {patient.date_of_birth}
                                        </p>
                                    )}

                                    {patient.gender && (
                                        <p>
                                            Gender:{" "}
                                            {patient.gender_display ||
                                                getGenderLabel(
                                                    patient.gender
                                                )}
                                        </p>
                                    )}

                                    {patient.address && (
                                        <p className="line-clamp-2">
                                            Address: {patient.address}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}