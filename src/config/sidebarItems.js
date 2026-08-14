import {
    LayoutDashboard,
    Pill,
    Package,
    ShoppingCart,
    Users,
    Truck,
    Receipt,
    FileText,
    BarChart3,
    Settings,
    Shield,
    UserCog,
    ClipboardList,
    Bell,
} from "lucide-react";


export const SIDEBAR_ITEMS = [

    {
        title: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard",
    },


    {
        title: "Products",
        path: "/admin/products",
        icon: Pill,
        permission: "products",
    },


    {
        title: "Inventory",
        path: "/admin/inventory",
        icon: Package,
        permission: "inventory",
    },


    {
        title: "Purchases",
        path: "/admin/purchases",
        icon: ClipboardList,
        permission: "purchases",
    },


    {
        title: "Suppliers",
        path: "/admin/suppliers",
        icon: Truck,
        permission: "suppliers",
    },


    {
        title: "Sales",
        path: "/admin/sales",
        icon: ShoppingCart,
        permission: "sales",
    },


    {
        title: "Customers",
        path: "/admin/customers",
        icon: Users,
        permission: "customers",
    },


    {
        title: "Prescriptions",
        path: "/admin/prescriptions",
        icon: FileText,
        permission: "prescriptions",
    },


    {
        title: "Finance",
        path: "/admin/finance",
        icon: Receipt,
        permission: "finance",
    },


    {
        title: "Reports",
        path: "/admin/reports",
        icon: BarChart3,
        permission: "reports",
    },


    {
        title: "Employees",
        path: "/admin/employees",
        icon: UserCog,
        permission: "employees",
    },


    {
        title: "Roles",
        path: "/admin/roles",
        icon: Shield,
        permission: "roles",
    },


    {
        title: "Notifications",
        path: "/admin/notifications",
        icon: Bell,
        permission: "notifications",
    },


    {
        title: "Settings",
        path: "/admin/settings",
        icon: Settings,
        permission: "settings",
    },


    {
        title: "POS",
        path: "/admin/pos",
        icon: ShoppingCart,
        permission: "pos",
    },


    {
        title: "Orders",
        path: "/admin/orders",
        icon: ClipboardList,
        permission: "orders",
    },

];