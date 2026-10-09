import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LoadingScreen() {
    return (
        <div
            dir="rtl"
            className="min-h-screen flex items-center justify-center bg-gray-50"
        >
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-purple-200 border-t-[#5B2A86] rounded-full animate-spin" />

                <p className="text-gray-600 font-bold">
                    جاري التحميل...
                </p>
            </div>
        </div>
    );
}

export default function PublicRoute({ children }) {
    const { user, initializing } = useAuth();

    const location = useLocation();

    if (initializing) {
        return <LoadingScreen />;
    }

    // المستخدم غير مسجل
    if (!user) {
        return children;
    }

    // لو العميل
    if (user.role === "CUSTOMER") {
        return (
            <Navigate
                to="/"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );
    }

    // الموظفين
    return (
        <Navigate
            to="/admin/dashboard"
            replace
            state={{
                from: location.pathname,
            }}
        />
    );
}