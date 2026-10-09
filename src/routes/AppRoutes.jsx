import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import StoreRoutes from "./StoreRoutes";
import AuthRoutes from "./AuthRoutes";
import AdminRoutes from "./AdminRoutes";

export default function AppRoutes() {
    return (
        <Routes>

            {/* =========================
                Public Store
            ========================= */}

            {StoreRoutes()}


            {/* =========================
                Authentication
            ========================= */}

            {AuthRoutes()}


            {/* =========================
                Admin Dashboard
            ========================= */}

            {AdminRoutes()}


            {/* =========================
                Fallback
            ========================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>
    );
}