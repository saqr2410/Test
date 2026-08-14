import { useAuth } from "../../../contexts/AuthContext";

import OwnerDashboard from "./OwnerDashboard";
import ManagerDashboard from "./ManagerDashboard";
import PharmacistDashboard from "./PharmacistDashboard";
import CashierDashboard from "./CashierDashboard";
import AccountantDashboard from "./AccountantDashboard";
import DeliveryDashboard from "./DeliveryDashboard";

export default function Dashboard() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading...
            </div>
        );
    }

    switch (user?.role) {
        case "OWNER":
            return <OwnerDashboard />;

        case "MANAGER":
            return <ManagerDashboard />;

        case "PHARMACIST":
            return <PharmacistDashboard />;

        case "CASHIER":
            return <CashierDashboard />;

        case "ACCOUNTANT":
            return <AccountantDashboard />;

        case "DELIVERY":
            return <DeliveryDashboard />;

        default:
            return <div>Unauthorized</div>;
    }
}