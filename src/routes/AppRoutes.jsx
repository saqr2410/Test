import { Routes, Route, Navigate } from "react-router-dom";

import StoreRoutes from "./StoreRoutes";
import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";

export default function AppRoutes() {
    return (
        <Routes>

            {StoreRoutes()}

            {AuthRoutes()}

            {AdminRoutes()}

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
}