import { Route } from "react-router-dom";

import RoleRoute from "./RoleRoute";
import AdminLayout from "../layouts/AdminLayout";

import { ADMIN_PERMISSIONS } from "../config/adminPermissions";

import Dashboard from "../pages/admin/dashboard/Dashboard";
import ProductsPage from "../pages/admin/products/ProductsPage";
import Inventory from "../pages/admin/inventory/Inventory";
import Purchases from "../pages/admin/purchases/Purchases";
import Sales from "../pages/admin/sales/Sales";
import SaleDetails from "../pages/admin/sales/SaleDetails";
import Suppliers from "../pages/admin/suppliers/Suppliers";
import Finance from "../pages/admin/finance/Finance";
import Reports from "../pages/admin/reports/Reports";
import Settings from "../pages/admin/settings/Settings";
import Customers from "../pages/admin/customers/Customers";
import Prescriptions from "../pages/admin/prescriptions/Prescriptions";
import Employees from "../pages/admin/employees/Employees";
import Roles from "../pages/admin/roles/Roles";
import Notifications from "../pages/admin/notifications/Notifications";
import POS from "../pages/admin/pos/POS";
import Orders from "../pages/admin/orders/Orders";
import OrderDetails from "../pages/admin/orders/OrderDetails";
import HealthProfiles from "../pages/admin/healthProfiles/HealthProfiles";
import HealthProfileDetails from "../pages/admin/healthProfiles/HealthProfileDetails";

export default function AdminRoutes() {
    return (
        <Route
            path="/admin"
            element={
                <RoleRoute roles={ADMIN_PERMISSIONS.dashboard.view}>
                    <AdminLayout />
                </RoleRoute>
            }
        >
            <Route
                path="dashboard"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.dashboard.view}>
                        <Dashboard />
                    </RoleRoute>
                }
            />

            <Route
                path="products"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.products.view}>
                        <ProductsPage />
                    </RoleRoute>
                }
            />

            <Route
                path="inventory"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.inventory.view}>
                        <Inventory />
                    </RoleRoute>
                }
            />

            <Route
                path="purchases"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.purchases.view}>
                        <Purchases />
                    </RoleRoute>
                }
            />

            <Route
                path="sales"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.sales.view}>
                        <Sales />
                    </RoleRoute>
                }
            />

            <Route
                path="sales/:id"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.sales.view}>
                        <SaleDetails />
                    </RoleRoute>
                }
            />

            <Route
                path="suppliers"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.suppliers.view}>
                        <Suppliers />
                    </RoleRoute>
                }
            />

            <Route
                path="finance"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.finance.view}>
                        <Finance />
                    </RoleRoute>
                }
            />

            <Route
                path="reports"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.reports.view}>
                        <Reports />
                    </RoleRoute>
                }
            />

            <Route
                path="settings"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.settings.view}>
                        <Settings />
                    </RoleRoute>
                }
            />

            <Route
                path="customers"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.customers.view}>
                        <Customers />
                    </RoleRoute>
                }
            />

            <Route
                path="health-profiles"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.healthProfiles.view}>
                        <HealthProfiles />
                    </RoleRoute>
                }
            />

            <Route
                path="health-profiles/:id"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.healthProfiles.view}>
                        <HealthProfileDetails />
                    </RoleRoute>
                }
            />

            <Route
                path="prescriptions"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.prescriptions.view}>
                        <Prescriptions />
                    </RoleRoute>
                }
            />

            <Route
                path="employees"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.employees.view}>
                        <Employees />
                    </RoleRoute>
                }
            />

            <Route
                path="roles"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.roles.view}>
                        <Roles />
                    </RoleRoute>
                }
            />

            <Route
                path="notifications"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.notifications.view}>
                        <Notifications />
                    </RoleRoute>
                }
            />

            <Route
                path="pos"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.pos.view}>
                        <POS />
                    </RoleRoute>
                }
            />

            <Route
                path="orders"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.orders.view}>
                        <Orders />
                    </RoleRoute>
                }
            />

            <Route
                path="orders/:id"
                element={
                    <RoleRoute roles={ADMIN_PERMISSIONS.orders.view}>
                        <OrderDetails />
                    </RoleRoute>
                }
            />
        </Route>
    );
}