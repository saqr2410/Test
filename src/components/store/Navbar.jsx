import {
    Link,
    NavLink,
    useNavigate,
    useLocation
} from "react-router-dom";

import {
    ShoppingCart,
    User,
    Pill,
    Upload,
    FileUser,
    Home,
    Tag,
    Info,
    UserPlus,
    Heart,
    ChevronDown,
    Menu,
    X,
    LogOut,
    Package,
    Settings,
    Sparkles,
    MapPin
} from "lucide-react";

import { useState } from "react";

import { useCart } from "../../contexts/CartContext"; // ✅ استخدم CartContext
import { useAuth } from "../../contexts/AuthContext";

import toast from "react-hot-toast";


export default function Navbar() {
    const { user, logout } = useAuth();

    const favoriteCount = 0;

    const navigate = useNavigate();
    const location = useLocation();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);

    // ✅ عدد السلة من CartContext
    const { cartItems } = useCart();
    const cartCount = cartItems?.length || 0;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const links = [
        { name: "الرئيسية", path: "/", icon: <Home size={18} /> },
        { name: "الأدوية", path: "/products", icon: <Pill size={18} /> },
        { name: "رفع روشتة", path: "/prescriptions/upload", icon: <Upload size={18} /> },
        { name: "الملف الصحي", path: "/patients/create", icon: <FileUser size={18} /> },
        { 
            name: "العروض", 
            path: "/", 
            icon: <Tag size={18} />,
            state: { scrollTo: "offers" } // ✅ سينتقل لقسم العروض
        },
        { 
            name: "عن الصيدلية", 
            path: "/", 
            icon: <Info size={18} />,
            state: { scrollTo: "about" } // ✅ سينتقل لقسم "عن الصيدلية"
        }
    ];

    return (
        <>
            <header
                className="
                    sticky top-0 z-50
                    bg-white/80 backdrop-blur-2xl
                    border-b border-gray-100
                    shadow-[0_10px_35px_rgba(91,42,134,0.08)]
                "
            >
                <div
                    className="
                        max-w-7xl mx-auto px-5
                        h-20 flex items-center justify-between
                    "
                >
                    {/* LOGO */}
                    <Link
                        to="/"
                        className="flex items-center gap-3 group"
                    >
                        <div
                            className="
                                relative w-12 h-12 rounded-2xl
                                bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500
                                flex items-center justify-center text-white
                                shadow-lg shadow-purple-200
                                group-hover:scale-110 transition duration-300
                            "
                        >
                            <Pill size={27} />
                            <span
                                className="
                                    absolute top-0 right-0 w-3 h-3
                                "
                            />
                        </div>
                        <div>
                            <h1
                                className="
                                    text-xl font-black
                                    bg-gradient-to-r from-[#5B2A86] to-purple-500
                                    bg-clip-text text-transparent
                                "
                            >
                                Rashed Smart Pharmacy
                            </h1>
                            <p className="text-[11px] text-gray-400 font-medium">
                                صحتك أولويتنا ✨
                            </p>
                        </div>
                    </Link>

                    {/* DESKTOP LINKS */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {links.map((item, index) => {

                            const active =
                                item.path === "/"
                                    ? location.pathname === "/" &&
                                    (
                                        (item.state?.scrollTo === undefined &&
                                            location.state?.scrollTo === undefined) ||

                                        item.state?.scrollTo === location.state?.scrollTo
                                    )
                                    : location.pathname === item.path;

                            return (
                                <NavLink
                                    key={index}
                                    to={item.path}
                                    state={item.state || null}
                                    className={`
                                        flex items-center gap-2 px-3 py-2 rounded-xl
                                        text-sm font-semibold transition-all duration-300
                                        ${
                                            active
                                                ? "bg-[#5B2A86] text-white shadow-md"
                                                : "text-gray-600 hover:text-[#5B2A86] hover:bg-[#5B2A86]/10"
                                        }
                                    `}
                                >
                                    {item.icon}
                                    {item.name}
                                </NavLink>
                            );
                        })}

                        {/* CATEGORIES */}
                        <div className="relative">
                            <button
                                onClick={() => setCategoryOpen(!categoryOpen)}
                                className="
                                    flex items-center gap-1 px-3 py-2 rounded-xl
                                    text-sm font-semibold text-gray-600
                                    hover:text-[#5B2A86] hover:bg-purple-50 transition
                                "
                            >
                                الأقسام
                                <ChevronDown size={16} />
                            </button>

                            {categoryOpen && (
                                <div
                                    className="
                                        absolute top-11 right-0 w-64
                                        bg-white/95 backdrop-blur-xl rounded-2xl
                                        shadow-2xl border border-gray-100 p-4 z-50
                                    "
                                >
                                    <h3
                                        className="
                                            flex items-center gap-2
                                            font-bold text-[#5B2A86] mb-3
                                        "
                                    >
                                        <Sparkles size={16} />
                                        تصفح الأقسام
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            "أدوية الأطفال",
                                            "العناية بالبشرة",
                                            "الفيتامينات",
                                            "الأجهزة الطبية",
                                            "العناية بالشعر",
                                            "المسكنات"
                                        ].map((item, index) => (
                                            <Link
                                                key={index}
                                                to="/products"
                                                className="
                                                    text-xs text-center p-3 rounded-xl
                                                    bg-purple-50 hover:bg-purple-100 transition
                                                "
                                            >
                                                {item}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2">
                        {/* FAVORITES */}
                        <Link
                            to={user ? "/account/favorites" : "/login"}
                            onClick={() => {
                                if (!user) {
                                    toast.error("يجب تسجيل الدخول أولاً");
                                }
                            }}
                            className="
                                hidden md:flex
                                relative
                                w-10 h-10
                                items-center justify-center
                                rounded-xl
                                hover:bg-purple-50
                                text-gray-500
                                hover:text-[#5B2A86]
                                transition
                            "
                        >
                            <Heart size={21} />

                            {user && favoriteCount > 0 && (
                                <span
                                    className="
                                        absolute
                                        -top-1
                                        -right-1
                                        min-w-[18px]
                                        h-[18px]
                                        px-1
                                        rounded-full
                                        bg-red-500
                                        text-white
                                        text-[10px]
                                        font-bold
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    {favoriteCount}
                                </span>
                            )}
                        </Link>
                            

                        {/* CART */}
                        <Link
                            to="/cart"
                            className="
                                relative w-10 h-10
                                flex items-center justify-center rounded-xl
                                hover:bg-purple-50 text-gray-500 hover:text-[#5B2A86] transition
                            "
                        >
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span
                                    className="
                                        absolute -top-1 -right-1
                                        min-w-5 h-5 px-1 rounded-full
                                        bg-gradient-to-r from-red-500 to-pink-500
                                        text-white text-[11px] font-bold
                                        flex items-center justify-center
                                    "
                                >
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* ACCOUNT */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setAccountOpen(!accountOpen)}
                                    className="
                                        flex items-center gap-2 px-3 py-2 rounded-xl
                                        bg-purple-50 hover:bg-purple-100 transition
                                    "
                                >
                                    <User size={18} className="text-[#5B2A86]" />
                                    <span className="hidden md:block text-sm font-bold text-[#5B2A86]">
                                         {user.name || "حسابي"}
                                    </span>
                                    <ChevronDown size={15} />
                                </button>

                                {accountOpen && (
                                    <div
                                        className="
                                            absolute left-0 mt-3 w-56
                                            bg-white rounded-2xl shadow-2xl border border-gray-100
                                            p-2 z-50
                                        "
                                    >
                                        <Link
                                            to="/account/profile"
                                            className="
                                                flex items-center gap-3
                                                p-3 rounded-xl
                                                hover:bg-purple-50
                                                transition
                                            "
                                        >
                                            <User size={18} className="text-[#5B2A86]" />

                                            <span className="font-medium">
                                                الملف الشخصي
                                            </span>
                                        </Link>

                                        <Link
                                            to="/orders"
                                            className="
                                                flex items-center gap-3
                                                p-3 rounded-xl
                                                hover:bg-purple-50
                                                transition
                                            "
                                        >
                                            <Package size={18} className="text-[#5B2A86]" />

                                            <span className="font-medium">
                                                طلباتي
                                            </span>
                                        </Link>

                                        <Link
                                            to="/account/settings"
                                            className="
                                                flex items-center gap-3
                                                p-3 rounded-xl
                                                hover:bg-purple-50
                                                transition
                                            "
                                        >
                                            <Settings size={18} className="text-[#5B2A86]" />

                                            <span className="font-medium">
                                                الإعدادات
                                            </span>
                                        </Link>

                                        <Link
                                            to="/account/favorites"
                                            className="
                                                flex items-center gap-3
                                                p-3 rounded-xl
                                                hover:bg-purple-50
                                                transition
                                            "
                                        >
                                            <Heart size={18} className="text-[#5B2A86]" />

                                            <span className="font-medium">
                                                المفضلة
                                            </span>
                                        </Link>

                                        <Link
                                            to="/account/addresses"
                                            className="
                                                flex items-center gap-3
                                                p-3 rounded-xl
                                                hover:bg-purple-50
                                                transition
                                            "
                                        >
                                            <MapPin size={18} className="text-[#5B2A86]" />

                                            <span className="font-medium">
                                                العناوين
                                            </span>
                                        </Link>

                                        <hr className="my-2" />

                                        <button
                                            onClick={handleLogout}
                                            className="
                                                w-full
                                                flex items-center gap-3
                                                p-3 rounded-xl
                                                text-red-500
                                                hover:bg-red-50
                                                transition
                                            "
                                        >
                                            <LogOut size={18} />

                                            <span className="font-medium">
                                                تسجيل الخروج
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="
                                        px-4 py-2 rounded-xl text-[#5B2A86] font-bold
                                        hover:bg-purple-50 transition
                                    "
                                >
                                    دخول
                                </Link>
                                <Link
                                    to="/register"
                                    className="
                                        flex items-center gap-2 px-5 py-2 rounded-xl
                                        text-white font-bold
                                        bg-gradient-to-r from-violet-600 to-purple-600
                                        shadow-lg hover:scale-105 transition
                                    "
                                >
                                    <UserPlus size={16} />
                                    إنشاء حساب
                                </Link>
                            </div>
                        )}

                        {/* MOBILE BUTTON */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="
                                lg:hidden w-10 h-10 rounded-xl
                                bg-purple-50 flex items-center justify-center
                                text-[#5B2A86]
                            "
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {mobileOpen && (
                    <div className="lg:hidden bg-white border-t px-5 py-4 shadow-lg">
                        <div className="flex flex-col gap-2">
                            {links.map((item, index) => {

                                const active =
                                    item.path === "/"
                                        ? location.pathname === "/" &&
                                        (
                                            (item.state?.scrollTo === undefined &&
                                                location.state?.scrollTo === undefined) ||

                                            item.state?.scrollTo === location.state?.scrollTo
                                        )
                                        : location.pathname === item.path;

                                return (
                                    <NavLink
                                        key={index}
                                        to={item.path}
                                        state={item.state || null}
                                        className={`
                                            flex items-center gap-2 px-3 py-2 rounded-xl
                                            text-sm font-semibold transition-all duration-300
                                            ${
                                                active
                                                    ? "bg-[#5B2A86] text-white shadow-md"
                                                    : "text-gray-600 hover:text-[#5B2A86] hover:bg-[#5B2A86]/10"
                                            }
                                        `}
                                    >
                                        {item.icon}
                                        {item.name}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}