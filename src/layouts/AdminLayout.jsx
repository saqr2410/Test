import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

export default function AdminLayout() {
    // Mobile sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Desktop sidebar
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div
            dir="rtl"
            className="h-screen overflow-hidden bg-[#f8fafc]"
        >
            <div className="flex h-screen">

                <Sidebar
                    open={sidebarOpen}
                    setOpen={setSidebarOpen}
                    collapsed={sidebarCollapsed}
                />

                <div
                    className="
                        flex-1
                        h-screen
                        min-w-0
                        flex
                        flex-col
                    "
                >
                    <Topbar
                        setOpen={setSidebarOpen}
                        collapsed={sidebarCollapsed}
                        setCollapsed={setSidebarCollapsed}
                    />

                    <main
                        className="
                            flex-1
                            overflow-y-auto
                            p-6
                        "
                    >
                        <Outlet />
                    </main>
                </div>

            </div>
        </div>
    );
}