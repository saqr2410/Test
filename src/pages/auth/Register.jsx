import React, {
    useState
} from "react";

import { useAuth } from "../../contexts/AuthContext";

import {
    Link,
    useNavigate
} from "react-router-dom";



const Register = ()=>{


    const [form,setForm] =
    useState({

        username:"",
        email:"",
        password:"",
        password2:""

    });



    const {
        register,
        loading
    } = useAuth();



    const navigate =
    useNavigate();






    const handleChange = (e)=>{


        setForm({

            ...form,

            [e.target.name]:
            e.target.value

        });


    };







    const handleSubmit = async(e)=>{


        e.preventDefault();



        const success =
        await register(form);



        if(success){

            navigate(
                "/dashboard"
            );

        }


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






                    <input

                    name="username"

                    type="text"

                    placeholder="اسم المستخدم"

                    value={form.username}

                    onChange={handleChange}

                    className="
                    w-full
                    p-3
                    border
                    rounded-lg
                    outline-none
                    focus:ring-2
                    focus:ring-green-500
                    "

                    required

                    />









                    <input

                    name="email"

                    type="email"

                    placeholder="البريد الإلكتروني"

                    value={form.email}

                    onChange={handleChange}

                    className="
                    w-full
                    p-3
                    border
                    rounded-lg
                    outline-none
                    focus:ring-2
                    focus:ring-green-500
                    "

                    />









                    <input

                    name="password"

                    type="password"

                    placeholder="كلمة المرور"

                    value={form.password}

                    onChange={handleChange}

                    className="
                    w-full
                    p-3
                    border
                    rounded-lg
                    outline-none
                    focus:ring-2
                    focus:ring-green-500
                    "

                    required

                    />










                    <input

                    name="password2"

                    type="password"

                    placeholder="تأكيد كلمة المرور"

                    value={form.password2}

                    onChange={handleChange}

                    className="
                    w-full
                    p-3
                    border
                    rounded-lg
                    outline-none
                    focus:ring-2
                    focus:ring-green-500
                    "

                    required

                    />









                    <button

                    type="submit"

                    disabled={loading}

                    className="
                    w-full
                    bg-green-600
                    text-white
                    p-3
                    rounded-lg
                    hover:bg-green-700
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
                    text-blue-600
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