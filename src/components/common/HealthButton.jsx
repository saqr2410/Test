import {
    HeartPulse,
    ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HealthButton({
    className = "",
}) {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() =>
                navigate("/patients/create")
            }
            className={`group inline-flex items-center gap-3 rounded-2xl bg-fuchsia-950 px-6 py-3.5 text-white font-bold shadow-lg shadow-fuchsia-950/20 hover:bg-fuchsia-900 hover:-translate-y-0.5 transition-all ${className}`}
        >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <HeartPulse size={20} />
            </span>

            <span>
                إنشاء الملف الصحي
            </span>

            <ArrowLeft
                size={19}
                className="group-hover:-translate-x-1 transition"
            />
        </button>
    );
}