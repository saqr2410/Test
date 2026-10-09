import { Link, useLocation } from "react-router-dom";
import { X, Pill } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import { SIDEBAR_ITEMS } from "../../config/sidebarItems";
import { ADMIN_PERMISSIONS } from "../../config/adminPermissions";

export default function Sidebar({
    open,
    setOpen,
    collapsed
}) {
    const location = useLocation();
    const { user } = useAuth();

    const userRole = String(user?.role || "")
        .trim()
        .toUpperCase();

    const currentMenu = SIDEBAR_ITEMS.filter((item) => {
        const permission =
            ADMIN_PERMISSIONS[item.permission];

        if (!permission || !userRole) {
            return false;
        }

        return (permission.view || []).some(
            (role) =>
                String(role)
                    .trim()
                    .toUpperCase() === userRole
        );
    });

    return (
        <>
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="
                        fixed
                        inset-0
                        bg-black/40
                        z-40
                        lg:hidden
                    "
                />
            )}

            <aside
                className={`
                    fixed
                    top-0
                    right-0
                    z-50
                    h-screen
                    bg-white
                    shadow-xl
                    border-l
                    overflow-y-auto
                    transition-all
                    duration-300
                    ease-in-out
                    lg:static
                    lg:shrink-0

                    ${collapsed
                        ? "lg:w-0 lg:border-0 lg:overflow-hidden"
                        : "lg:w-72"
                    }

                    ${open
                        ? "translate-x-0 w-72"
                        : "translate-x-full lg:translate-x-0"
                    }
                `}
            >
                <div className="w-72 p-6">
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            mb-10
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <div
                                className="
                                    w-12
                                    h-12
                                    rounded-2xl
                                    bg-[#5B2A86]
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    shrink-0
                                "
                            >
                                <Pill size={26} />
                            </div>

                            <div>
                                <h2
                                    className="
                                        font-black
                                        text-xl
                                        text-[#5B2A86]
                                    "
                                >
                                    الصيدلية الذكية
                                </h2>

                                <p
                                    className="
                                        text-xs
                                        text-gray-400
                                    "
                                >
                                    نظام إدارة المؤسسات
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            className="
                                lg:hidden
                                text-gray-500
                                hover:text-[#5B2A86]
                                transition
                            "
                        >
                            <X size={22} />
                        </button>
                    </div>

                    <nav className="space-y-2 pb-10">
                        {currentMenu.map((item) => {
                            const Icon = item.icon;

                            const active =
                                location.pathname === item.path ||
                                location.pathname.startsWith(
                                    item.path + "/"
                                );

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setOpen(false)}
                                    className={`
                                        flex
                                        items-center
                                        gap-4
                                        px-5
                                        py-3
                                        rounded-2xl
                                        font-bold
                                        transition-all
                                        duration-200

                                        ${active
                                            ? "bg-[#5B2A86] text-white shadow-lg"
                                            : "text-gray-600 hover:bg-purple-50 hover:text-[#5B2A86]"
                                        }
                                    `}
                                >
                                    <Icon
                                        size={21}
                                        className="shrink-0"
                                    />

                                    <span>
                                        {item.title}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
}