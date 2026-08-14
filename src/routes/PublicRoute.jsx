import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            Loading...
        </div>
    );
}

export default function PublicRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }

    if (user) {
        // العميل يروح للهوم
        if (user.role === "CUSTOMER") {
            return <Navigate to="/" replace />;
        }

        // أي موظف يروح الداشبورد
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
}