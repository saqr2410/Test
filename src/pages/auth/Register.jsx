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


const Register = () => {

    const [form, setForm] = useState({

        username: "",
        email: "",
        password: "",
        password2: ""

    });


    const [errors, setErrors] =
        useState({});


    const {
        register,
        loading
    } = useAuth();


    const navigate =
        useNavigate();


    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm({

            ...form,

            [name]: value

        });


        setErrors({

            ...errors,

            [name]: undefined

        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrors({});


        const result =
            await register(form);


        if (!result?.user) {

            setErrors(
                result?.errors || {}
            );

            return;

        }


        const user =
            result.user;


        if (
            user.role ===
            "CUSTOMER"
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
            "
        >

            <div
                className="
                    max-w-md
                    w-full
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
                    إنشاء حساب
                </h1>


                <form
                    onSubmit={handleSubmit}
                    className="
                        space-y-4
                    "
                >

                    {/* Username */}

                    <div>

                        <input
                            name="username"
                            type="text"
                            placeholder="اسم المستخدم"
                            value={
                                form.username
                            }
                            onChange={
                                handleChange
                            }
                            className={`
                                w-full
                                p-3
                                border
                                rounded-lg
                                outline-none
                                ${errors.username
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }
                                focus:ring-2
                                focus:ring-[#5B2A86]
                            `}
                            required
                        />


                        {errors.username && (

                            <p
                                className="
                                    text-red-500
                                    text-sm
                                    mt-2
                                "
                            >
                                {errors.username}
                            </p>

                        )}

                    </div>


                    {/* Email */}

                    <div>

                        <input
                            name="email"
                            type="email"
                            placeholder="البريد الإلكتروني"
                            value={
                                form.email
                            }
                            onChange={
                                handleChange
                            }
                            className={`
                                w-full
                                p-3
                                border
                                rounded-lg
                                outline-none
                                ${errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }
                                focus:ring-2
                                focus:ring-[#5B2A86]
                            `}
                        />


                        {errors.email && (

                            <p
                                className="
                                    text-red-500
                                    text-sm
                                    mt-2
                                "
                            >
                                {errors.email}
                            </p>

                        )}

                    </div>


                    {/* Password */}

                    <div>

                        <input
                            name="password"
                            type="password"
                            placeholder="كلمة المرور"
                            value={
                                form.password
                            }
                            onChange={
                                handleChange
                            }
                            className={`
                                w-full
                                p-3
                                border
                                rounded-lg
                                outline-none
                                ${errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }
                                focus:ring-2
                                focus:ring-[#5B2A86]
                            `}
                            required
                        />


                        {errors.password && (

                            <p
                                className="
                                    text-red-500
                                    text-sm
                                    mt-2
                                "
                            >
                                {errors.password}
                            </p>

                        )}

                    </div>


                    {/* Confirm Password */}

                    <div>

                        <input
                            name="password2"
                            type="password"
                            placeholder="تأكيد كلمة المرور"
                            value={
                                form.password2
                            }
                            onChange={
                                handleChange
                            }
                            className={`
                                w-full
                                p-3
                                border
                                rounded-lg
                                outline-none
                                ${errors.password2
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }
                                focus:ring-2
                                focus:ring-[#5B2A86]
                            `}
                            required
                        />


                        {errors.password2 && (

                            <p
                                className="
                                    text-red-500
                                    text-sm
                                    mt-2
                                "
                            >
                                {errors.password2}
                            </p>

                        )}

                    </div>


                    {/* General Error */}

                    {errors.general && (

                        <div
                            className="
                                bg-red-50
                                border
                                border-red-200
                                text-red-600
                                p-3
                                rounded-lg
                                text-sm
                                text-center
                            "
                        >
                            {errors.general}
                        </div>

                    )}


                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            bg-[#5B2A86]
                            text-white
                            p-3
                            rounded-lg
                            hover:bg-[#4A216D]
                            disabled:bg-gray-400
                            transition
                        "
                    >

                        {
                            loading
                                ?
                                "جاري إنشاء الحساب..."
                                :
                                "تسجيل"
                        }

                    </button>

                </form>


                <p
                    className="
                        text-center
                        mt-6
                        text-gray-600
                    "
                >

                    لديك حساب بالفعل؟

                    {" "}

                    <Link
                        to="/login"
                        className="
                            text-[#5B2A86]
                            font-bold
                        "
                    >
                        تسجيل الدخول
                    </Link>

                </p>

            </div>

        </div>

    );

};


export default Register;
