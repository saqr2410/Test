import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LoadingScreen() {
    return (
        <div
            dir="rtl"
            className="min-h-screen flex items-center justify-center bg-gray-50"
        >
            <div className="flex flex-col items-center gap-4">

                <div className="w-10 h-10 border-4 border-purple-200 border-t-[#5B2A86] rounded-full animate-spin" />

                <p className="font-bold text-gray-600">
                    جاري التحقق من الصلاحيات...
                </p>

            </div>
        </div>
    );
}

export default function RoleRoute({
    roles = [],
    children,
}) {
    const {
        user,
        loading,
    } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    const hasRole =
        roles.includes(user.role);

    if (!hasRole) {
        return (
            <Navigate
                to="/admin/dashboard"
                replace
            />
        );
    }

    if (children) {
        return children;
    }

    return <Outlet />;
}