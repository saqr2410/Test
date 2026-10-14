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
    HeartPulse,
    Baby,
    ShieldPlus,
    Syringe,
    Stethoscope
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import {
    useCart
} from "../../contexts/CartContext";

import {
    useAuth
} from "../../contexts/AuthContext";

import {
    getStoreCategories
} from "../../services/products/productService";

import toast from "react-hot-toast";

import logo from "../../assets/logo.png";


// =========================================================
// Category Icons
// =========================================================

const CATEGORY_ICONS = {
    "الأدوية": Pill,
    "الفيتامينات": HeartPulse,
    "الأطفال": Baby,
    "العناية الشخصية": ShieldPlus,
    "المستلزمات الطبية": Syringe,
    "الأجهزة الطبية": Stethoscope
};


// =========================================================
// Navbar
// =========================================================

export default function Navbar() {

    const {
        user,
        logout
    } = useAuth();

    const favoriteCount = 0;

    const navigate = useNavigate();
    const location = useLocation();

    const [
        mobileOpen,
        setMobileOpen
    ] = useState(false);

    const [
        accountOpen,
        setAccountOpen
    ] = useState(false);

    const [
        categoryOpen,
        setCategoryOpen
    ] = useState(false);

    const [
        categories,
        setCategories
    ] = useState([]);

    const [
        categoriesLoading,
        setCategoriesLoading
    ] = useState(true);


    // =====================================================
    // Cart
    // =====================================================

    const {
        cartItems
    } = useCart();

    const cartCount =
        cartItems?.length || 0;


    // =====================================================
    // Load Categories
    // =====================================================

    useEffect(() => {

        const loadCategories = async () => {

            try {

                const data =
                    await getStoreCategories();

                const items =
                    Array.isArray(data)
                        ? data
                        : data?.results || [];

                setCategories(items);

            } catch (error) {

                console.error(
                    "NAVBAR CATEGORIES ERROR:",
                    error
                );

                setCategories([]);

            } finally {

                setCategoriesLoading(false);

            }

        };

        loadCategories();

    }, []);


    // =====================================================
    // Close Menus On Navigation
    // =====================================================

    useEffect(() => {

        setAccountOpen(false);
        setMobileOpen(false);
        setCategoryOpen(false);

    }, [location.pathname]);


    // =====================================================
    // Logout
    // =====================================================

    const handleLogout = () => {

        logout();

        setAccountOpen(false);
        setMobileOpen(false);

        navigate("/login");

    };


    // =====================================================
    // Navbar Links
    // =====================================================

    const links = [

        {
            name: "الرئيسية",
            path: "/",
            icon: <Home size={18} />
        },

        {
            name: "الأدوية",
            path: "/products",
            icon: <Pill size={18} />
        },

        {
            name: "رفع روشتة",
            path: "/prescriptions/upload",
            icon: <Upload size={18} />
        },

        {
            name: "الملف الصحي",
            path: "/account/health",
            icon: <FileUser size={18} />
        },

        {
            name: "العروض",
            path: "/",
            icon: <Tag size={18} />,
            state: {
                scrollTo: "offers"
            }
        },

        {
            name: "عن الصيدلية",
            path: "/",
            icon: <Info size={18} />,
            state: {
                scrollTo: "about"
            }
        }

    ];


    // =====================================================
    // Link Active State
    // =====================================================

    const isLinkActive = (item) => {

        if (item.state?.scrollTo) {

            return (
                location.pathname === "/" &&
                location.state?.scrollTo ===
                item.state.scrollTo
            );

        }

        if (item.path === "/") {

            return (
                location.pathname === "/" &&
                !location.state?.scrollTo
            );

        }

        if (item.path === "/products") {

            return (
                location.pathname === "/products" ||
                location.pathname.startsWith("/products/")
            );

        }

        return (
            location.pathname === item.path ||
            (
                item.path === "/account/health" &&
                location.pathname === "/account/health"
            )
        );

    };


    // =====================================================
    // Render Navbar Link
    // =====================================================

    const renderNavLink = (item, index) => (

        <NavLink
            key={index}
            to={item.path}
            state={item.state || null}
            className={`
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
                transition-all
                duration-300

                ${isLinkActive(item)
                    ? "bg-[#5B2A86] text-white shadow-md"
                    : "text-gray-600 hover:text-[#5B2A86] hover:bg-[#5B2A86]/10"
                }
            `}
        >

            {item.icon}

            {item.name}

        </NavLink>

    );


    // =====================================================
    // Render
    // =====================================================

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
                        h-20 flex items-center justify-start gap-8
                    "
                >

                    {/* LOGO */}

                    <Link
                        to="/"
                        className="
                            flex
                            items-center
                            gap-3
                            group
                            ml-2
                        "
                    >

                        <div
                            className="
                                w-14 h-14
                                flex items-center justify-center
                                overflow-hidden rounded-2xl
                                bg-white border border-gray-100
                                shadow-md
                                group-hover:scale-105
                                transition duration-300
                                shrink-0
                            "
                        >

                            <img
                                src={logo}
                                alt="Dr. Ahmed Rashed Pharmacy"
                                className="w-full h-full object-contain"
                            />

                        </div>

                        <div className="flex flex-col items-center justify-center leading-none text-center">

                            <span className="text-[10px] font-bold text-[#5B2A86] mb-0.5 whitespace-nowrap">
                                صيدلية
                            </span>

                            <span className="text-lg font-black text-[#5B2A86] leading-none mb-0.5 whitespace-nowrap">
                                د. أحمد راشد
                            </span>

                            <span className="text-[9px] font-extrabold text-[#5B2A86] tracking-[0.15em] uppercase leading-none mb-0.5 whitespace-nowrap">
                                Dr. AHMED RASHED
                            </span>

                            <span className="text-[9px] font-extrabold text-[#5B2A86] tracking-[0.15em] uppercase leading-none whitespace-nowrap">
                                PHARMACY
                            </span>

                        </div>

                    </Link>


                    {/* DESKTOP LINKS */}

                    <nav
                        className="
                            hidden lg:flex
                            items-center gap-1
                            mr-auto
                        "
                    >

                        {links.map(renderNavLink)}


                        {/* CATEGORIES */}

                        {categories.length > 0 && (

                            <div className="relative">

                                <button
                                    onClick={() =>
                                        setCategoryOpen(!categoryOpen)
                                    }
                                    className="
                                        flex items-center gap-1
                                        px-4 py-2 rounded-full
                                        text-sm font-semibold
                                        text-gray-600
                                        hover:text-[#5B2A86]
                                        hover:bg-[#5B2A86]/10
                                        transition
                                    "
                                >

                                    الأقسام

                                    <ChevronDown size={16} />

                                </button>


                                {categoryOpen && (

                                    <div
                                        className="
                                            absolute top-12 right-0
                                            w-64 bg-white/95
                                            backdrop-blur-xl
                                            rounded-2xl shadow-2xl
                                            border border-gray-100
                                            p-4 z-50
                                        "
                                    >

                                        <h3
                                            className="
                                                flex items-center gap-2
                                                font-bold text-[#5B2A86]
                                                mb-3
                                            "
                                        >
                                            تصفح الأقسام
                                        </h3>


                                        {categoriesLoading ? (

                                            <div className="grid grid-cols-2 gap-2">

                                                {Array.from(
                                                    { length: 6 }
                                                ).map((_, index) => (

                                                    <div
                                                        key={index}
                                                        className="
                                                            h-10 rounded-xl
                                                            bg-gray-100
                                                            animate-pulse
                                                        "
                                                    />

                                                ))}

                                            </div>

                                        ) : (

                                            <div className="grid grid-cols-2 gap-2">

                                                {categories.map(category => {

                                                    const Icon =
                                                        CATEGORY_ICONS[
                                                        category.name
                                                        ] || Package;

                                                    return (

                                                        <Link
                                                            key={category.id}
                                                            to={`/products?category=${category.id}`}
                                                            onClick={() =>
                                                                setCategoryOpen(false)
                                                            }
                                                            className="
                                                                flex flex-col
                                                                items-center justify-center
                                                                gap-1 text-xs text-center
                                                                p-3 rounded-xl
                                                                bg-purple-50
                                                                hover:bg-[#5B2A86]
                                                                hover:text-white
                                                                transition
                                                            "
                                                        >

                                                            <Icon size={18} />

                                                            <span>
                                                                {category.name}
                                                            </span>

                                                        </Link>

                                                    );

                                                })}

                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>

                        )}

                    </nav>


                    {/* ACTIONS */}

                    <div className="flex items-center gap-2">

                        {/* FAVORITES */}

                        <Link
                            to={
                                user
                                    ? "/account/favorites"
                                    : "/login"
                            }
                            onClick={() => {

                                if (!user) {

                                    toast.error(
                                        "يجب تسجيل الدخول أولاً"
                                    );

                                }

                            }}
                            className="
                                hidden md:flex relative
                                w-10 h-10 items-center justify-center
                                rounded-full hover:bg-purple-50
                                text-gray-500 hover:text-[#5B2A86]
                                transition
                            "
                        >

                            <Heart size={21} />

                            {user && favoriteCount > 0 && (

                                <span
                                    className="
                                        absolute -top-1 -right-1
                                        min-w-[18px] h-[18px] px-1
                                        rounded-full bg-red-500
                                        text-white text-[10px] font-bold
                                        flex items-center justify-center
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
                                flex items-center justify-center
                                rounded-full hover:bg-purple-50
                                text-gray-500 hover:text-[#5B2A86]
                                transition
                            "
                        >

                            <ShoppingCart size={22} />

                            {cartCount > 0 && (

                                <span
                                    className="
                                        absolute -top-1 -right-1
                                        min-w-5 h-5 px-1
                                        rounded-full
                                        bg-gradient-to-r
                                        from-red-500 to-pink-500
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
                                    onClick={() =>
                                        setAccountOpen(!accountOpen)
                                    }
                                    className="
                                        flex items-center gap-2
                                        px-3 py-2 rounded-full
                                        bg-purple-50 hover:bg-purple-100
                                        transition
                                    "
                                >

                                    <User
                                        size={18}
                                        className="text-[#5B2A86]"
                                    />

                                    <span
                                        className="
                                            hidden md:block
                                            text-sm font-bold
                                            text-[#5B2A86]
                                        "
                                    >
                                        {user.name || "حسابي"}
                                    </span>

                                    <ChevronDown size={15} />

                                </button>


                                {accountOpen && (

                                    <div
                                        className="
                                            absolute left-0 mt-3 w-60
                                            bg-white rounded-2xl shadow-2xl
                                            border border-gray-100 p-2 z-50
                                        "
                                    >

                                        {/* ACCOUNT HEADER */}

                                        <div
                                            className="
                                                px-3 py-3 mb-1 rounded-xl
                                                bg-gradient-to-r
                                                from-purple-50 to-violet-50
                                            "
                                        >

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className="
                                                        w-10 h-10 rounded-xl
                                                        bg-[#5B2A86] text-white
                                                        flex items-center justify-center
                                                        shadow-md
                                                    "
                                                >
                                                    <User size={19} />
                                                </div>

                                                <div className="min-w-0">

                                                    <p
                                                        className="
                                                            text-sm font-bold
                                                            text-gray-800 truncate
                                                        "
                                                    >
                                                        {user.name || "حسابي"}
                                                    </p>

                                                    <p className="text-[11px] text-gray-400">
                                                        حسابك الشخصي
                                                    </p>

                                                </div>

                                            </div>

                                        </div>


                                        {/* PROFILE */}

                                        <Link
                                            to="/account/profile"
                                            onClick={() =>
                                                setAccountOpen(false)
                                            }
                                            className="
                                                flex items-center gap-3
                                                p-3 rounded-xl
                                                hover:bg-purple-50 transition
                                            "
                                        >

                                            <User
                                                size={18}
                                                className="text-[#5B2A86]"
                                            />

                                            <span className="font-medium">
                                                الملف الشخصي
                                            </span>

                                        </Link>


                                        {/* HEALTH PROFILE */}

                                        <Link
                                            to="/account/health"
                                            onClick={() =>
                                                setAccountOpen(false)
                                            }
                                            className="
                                                flex items-center gap-3
                                                p-3 rounded-xl
                                                hover:bg-purple-50 transition
                                            "
                                        >

                                            <FileUser
                                                size={18}
                                                className="text-[#5B2A86]"
                                            />

                                            <span className="font-medium">
                                                الملف الصحي
                                            </span>

                                        </Link>


                                        {/* ORDERS */}

                                        <Link
                                            to="/orders"
                                            onClick={() =>
                                                setAccountOpen(false)
                                            }
                                            className="
                                                flex items-center gap-3
                                                p-3 rounded-xl
                                                hover:bg-purple-50 transition
                                            "
                                        >

                                            <Package
                                                size={18}
                                                className="text-[#5B2A86]"
                                            />

                                            <span className="font-medium">
                                                طلباتي
                                            </span>

                                        </Link>


                                        {/* FAVORITES */}

                                        <Link
                                            to="/account/favorites"
                                            onClick={() =>
                                                setAccountOpen(false)
                                            }
                                            className="
                                                flex items-center gap-3
                                                p-3 rounded-xl
                                                hover:bg-purple-50 transition
                                            "
                                        >

                                            <Heart
                                                size={18}
                                                className="text-[#5B2A86]"
                                            />

                                            <span className="font-medium">
                                                المفضلة
                                            </span>

                                        </Link>


                                        {/* SETTINGS */}

                                        <Link
                                            to="/account/settings"
                                            onClick={() =>
                                                setAccountOpen(false)
                                            }
                                            className="
                                                flex items-center gap-3
                                                p-3 rounded-xl
                                                hover:bg-purple-50 transition
                                            "
                                        >

                                            <Settings
                                                size={18}
                                                className="text-[#5B2A86]"
                                            />

                                            <span className="font-medium">
                                                الإعدادات
                                            </span>

                                        </Link>


                                        <hr className="my-2" />


                                        {/* LOGOUT */}

                                        <button
                                            onClick={handleLogout}
                                            className="
                                                w-full flex items-center gap-3
                                                p-3 rounded-xl
                                                text-red-500 hover:bg-red-50
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
                                        px-4 py-2 rounded-full
                                        text-[#5B2A86] font-bold
                                        hover:bg-purple-50 transition
                                    "
                                >
                                    دخول
                                </Link>

                                <Link
                                    to="/register"
                                    className="
                                        flex items-center gap-2
                                        px-5 py-2 rounded-full
                                        text-white font-bold
                                        bg-gradient-to-r
                                        from-violet-600 to-purple-600
                                        shadow-lg hover:scale-105
                                        transition
                                    "
                                >

                                    <UserPlus size={16} />

                                    إنشاء حساب

                                </Link>

                            </div>

                        )}


                        {/* MOBILE BUTTON */}

                        <button
                            onClick={() =>
                                setMobileOpen(!mobileOpen)
                            }
                            className="
                                lg:hidden w-10 h-10 rounded-full
                                bg-purple-50 flex items-center
                                justify-center text-[#5B2A86]
                            "
                        >

                            {mobileOpen
                                ? <X size={22} />
                                : <Menu size={22} />
                            }

                        </button>

                    </div>

                </div>


                {/* MOBILE MENU */}

                {mobileOpen && (

                    <div
                        className="
                            lg:hidden bg-white border-t
                            px-5 py-4 shadow-lg
                        "
                    >

                        <div className="flex flex-col gap-2">

                            {links.map(renderNavLink)}


                            {/* MOBILE CATEGORIES */}

                            {categories.length > 0 && (

                                <div className="pt-2">

                                    <button
                                        onClick={() =>
                                            setCategoryOpen(!categoryOpen)
                                        }
                                        className="
                                            w-full flex items-center
                                            justify-between px-4 py-2
                                            rounded-full text-sm font-semibold
                                            text-gray-600
                                            hover:text-[#5B2A86]
                                            hover:bg-[#5B2A86]/10
                                            transition
                                        "
                                    >

                                        <span className="flex items-center gap-2">

                                            <Sparkles size={18} />

                                            الأقسام

                                        </span>

                                        <ChevronDown
                                            size={16}
                                            className={`
                                                transition-transform
                                                ${categoryOpen
                                                    ? "rotate-180"
                                                    : ""
                                                }
                                            `}
                                        />

                                    </button>


                                    {categoryOpen && (

                                        <div
                                            className="
                                                grid grid-cols-2 gap-2
                                                mt-2 pr-3
                                            "
                                        >

                                            {categories.map(category => {

                                                const Icon =
                                                    CATEGORY_ICONS[
                                                    category.name
                                                    ] || Package;

                                                return (

                                                    <Link
                                                        key={category.id}
                                                        to={`/products?category=${category.id}`}
                                                        onClick={() => {

                                                            setCategoryOpen(false);
                                                            setMobileOpen(false);

                                                        }}
                                                        className="
                                                            flex items-center gap-2
                                                            text-xs p-3 rounded-xl
                                                            bg-purple-50
                                                            hover:bg-[#5B2A86]
                                                            hover:text-white
                                                            transition
                                                        "
                                                    >

                                                        <Icon size={17} />

                                                        <span>
                                                            {category.name}
                                                        </span>

                                                    </Link>

                                                );

                                            })}

                                        </div>

                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                )}

            </header>

        </>

    );

}
