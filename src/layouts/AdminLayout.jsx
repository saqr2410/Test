import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-[#f8fafc]"
        >
            <div className="flex">
                <Sidebar
                    open={sidebarOpen}
                    setOpen={setSidebarOpen}
                />

                <div className="flex-1 min-h-screen">
                    <Topbar
                        setOpen={setSidebarOpen}
                    />

                    <main className="p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}