import {
    useState
} from "react";

import {
    useAuth
} from "../../contexts/AuthContext";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    syncCart
} from "../../services/cart/cartService";

import toast from "react-hot-toast";


const Login = () => {

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [errors, setErrors] =
        useState({});


    const {
        login,
        loading
    } = useAuth();


    const navigate =
        useNavigate();


    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrors({});


        const result =
            await login(
                username,
                password
            );


        console.log(
            "LOGIN RESULT:",
            result
        );


        // ========================================
        // Login Failed
        // ========================================

        if (!result?.user) {

            console.log(
                "UI ERROR:",
                result?.errors
            );


            setErrors(
                result?.errors || {}
            );


            return;

        }


        // ========================================
        // Login Success
        // ========================================

        const user =
            result.user;


        const localCart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        if (localCart.length > 0) {

            try {

                await syncCart(

                    localCart.map(item => ({

                        id:
                            item.id,

                        quantity:
                            Number(
                                item.quantity
                            )

                    }))

                );


                localStorage.removeItem(
                    "cart"
                );


            } catch (error) {

                console.error(
                    "CART SYNC ERROR:",
                    error
                );


                toast.error(
                    error?.response?.data?.error ||
                    "حدث خطأ أثناء مزامنة السلة"
                );

            }

        }


        if (
            user.role === "CUSTOMER"
        ) {

            navigate("/");

            return;

        }


        navigate(
            "/admin/dashboard"
        );

    };


    return (

        <div
            dir="rtl"
            className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gray-100
                px-4
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    bg-white
                    p-8
                    rounded-xl
                    shadow-lg
                "
            >

                <h1
                    className="
                        text-3xl
                        font-bold
                        text-center
                        mb-6
                    "
                >
                    تسجيل الدخول
                </h1>


                <form
                    onSubmit={handleSubmit}
                >

                    {/* ================================= */}
                    {/* Username */}
                    {/* ================================= */}

                    <div
                        className="mb-5"
                    >

                        <input
                            type="text"
                            placeholder="اسم المستخدم"
                            value={username}
                            onChange={(e) => {

                                setUsername(
                                    e.target.value
                                );

                            }}
                            className="
                                w-full
                                border
                                border-gray-300
                                p-3
                                rounded-lg
                                outline-none
                            "
                        />


                        {errors.username && (

                            <div
                                style={{
                                    display: "block",
                                    color: "red",
                                    marginTop: "8px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                }}
                            >
                                {errors.username}
                            </div>

                        )}

                    </div>


                    {/* ================================= */}
                    {/* Password */}
                    {/* ================================= */}

                    <div
                        className="mb-5"
                    >

                        <input
                            type="password"
                            placeholder="كلمة المرور"
                            value={password}
                            onChange={(e) => {

                                setPassword(
                                    e.target.value
                                );

                            }}
                            className="
                                w-full
                                border
                                border-gray-300
                                p-3
                                rounded-lg
                                outline-none
                            "
                        />


                        {errors.password && (

                            <div
                                style={{
                                    display: "block",
                                    color: "red",
                                    marginTop: "8px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                }}
                            >
                                {errors.password}
                            </div>

                        )}

                    </div>


                    {/* ================================= */}
                    {/* General Error */}
                    {/* ================================= */}

                    {errors.general && (

                        <div
                            style={{
                                display: "block",
                                color: "red",
                                marginBottom: "20px",
                                textAlign: "center",
                                fontSize: "15px",
                                fontWeight: "bold",
                            }}
                        >
                            {errors.general}
                        </div>

                    )}


                    {/* ================================= */}
                    {/* Submit */}
                    {/* ================================= */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            bg-blue-600
                            text-white
                            p-3
                            rounded-lg
                            font-semibold
                            disabled:opacity-50
                        "
                    >

                        {
                            loading
                                ? "جاري تسجيل الدخول..."
                                : "دخول"
                        }

                    </button>

                </form>


                <p
                    className="
                        text-center
                        mt-6
                    "
                >

                    ليس لديك حساب؟{" "}

                    <Link
                        to="/register"
                        className="
                            text-blue-600
                            font-bold
                        "
                    >
                        سجل الآن
                    </Link>

                </p>

            </div>

        </div>

    );

};


export default Login;
