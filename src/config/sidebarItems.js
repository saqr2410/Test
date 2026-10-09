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
    HeartPulse,
} from "lucide-react";

export const SIDEBAR_ITEMS = [

    {
        title: "لوحة التحكم",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard",
    },

    {
        title: "نقطة البيع",
        path: "/admin/pos",
        icon: ShoppingCart,
        permission: "pos",
    },

    {
        title: "الروشتات",
        path: "/admin/prescriptions",
        icon: FileText,
        permission: "prescriptions",
    },

    {
        title: "المنتجات",
        path: "/admin/products",
        icon: Pill,
        permission: "products",
    },

    {
        title: "المخزون",
        path: "/admin/inventory",
        icon: Package,
        permission: "inventory",
    },

    {
        title: "المبيعات",
        path: "/admin/sales",
        icon: ShoppingCart,
        permission: "sales",
    },

    {
        title: "الطلبات",
        path: "/admin/orders",
        icon: ClipboardList,
        permission: "orders",
    },

    {
        title: "العملاء",
        path: "/admin/customers",
        icon: Users,
        permission: "customers",
    },

    {
        title: "الملفات الصحية",
        path: "/admin/health-profiles",
        icon: HeartPulse,
        permission: "healthProfiles",
    },

    {
        title: "المشتريات",
        path: "/admin/purchases",
        icon: ClipboardList,
        permission: "purchases",
    },

    {
        title: "الموردين",
        path: "/admin/suppliers",
        icon: Truck,
        permission: "suppliers",
    },

    {
        title: "المالية",
        path: "/admin/finance",
        icon: Receipt,
        permission: "finance",
    },

    {
        title: "التقارير",
        path: "/admin/reports",
        icon: BarChart3,
        permission: "reports",
    },

    {
        title: "الموظفين",
        path: "/admin/employees",
        icon: UserCog,
        permission: "employees",
    },

    {
        title: "الأدوار والصلاحيات",
        path: "/admin/roles",
        icon: Shield,
        permission: "roles",
    },

    {
        title: "الإشعارات",
        path: "/admin/notifications",
        icon: Bell,
        permission: "notifications",
    },

    {
        title: "الإعدادات",
        path: "/admin/settings",
        icon: Settings,
        permission: "settings",
    },

];