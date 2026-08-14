import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";


import api from "../api/axios";

import toast from "react-hot-toast";

import {
    addCartItem
} from "../services/cart/cartService";



const AuthContext = createContext();





export const AuthProvider = ({ children }) => {



    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);







    // =========================
    // Sync Local Cart To Backend
    // =========================

    const syncCart = async()=>{


        const savedCart =
            localStorage.getItem("cart");



        if(!savedCart){

            return;

        }



        const cart =
            JSON.parse(savedCart);



        if(cart.length === 0){

            return;

        }




        try{


            for(const item of cart){


                await addCartItem(

                    item.id,

                    item.quantity

                );


            }



            console.log(
                "Cart synced"
            );


        }


        catch(error){


            console.log(
                "Cart sync error",
                error
            );


        }


    };









    // =========================
    // Load Current User
    // =========================

    useEffect(()=>{


        const loadUser = async()=>{


            const token =
                localStorage.getItem(
                    "access_token"
                );



            if(!token){


                setLoading(false);

                return;


            }





            try{


                const response =
                    await api.get(
                        "/users/me/"
                    );



                console.log(
                    "CURRENT USER =>",
                    response.data
                );

                console.log("ROLE =>", response.data.role);



                setUser(
                    response.data
                );



                localStorage.setItem(

                    "user",

                    JSON.stringify(
                        response.data
                    )

                );





                await syncCart();



            }


            catch(error){


                console.log(
                    "LOAD USER ERROR",
                    error
                );



                localStorage.removeItem(
                    "access_token"
                );


                localStorage.removeItem(
                    "refresh_token"
                );


                localStorage.removeItem(
                    "user"
                );


                setUser(null);



            }



            finally{


                setLoading(false);


            }



        };



        loadUser();



    },[]);












    // =========================
    // Login
    // =========================

    const login = async(
        username,
        password
    )=>{


        setLoading(true);



        try{


            const response =
                await api.post(

                    "/users/login/",

                    {
                        username,
                        password
                    }

                );







            localStorage.setItem(

                "access_token",

                response.data.access

            );



            localStorage.setItem(

                "refresh_token",

                response.data.refresh

            );








            // مهم جدا
            // نجيب بيانات المستخدم كاملة
            // ومنها role

            const userResponse =
                await api.get(
                    "/users/me/"
                );





            setUser(
                userResponse.data
            );





            localStorage.setItem(

                "user",

                JSON.stringify(
                    userResponse.data
                )

            );







            await syncCart();






            toast.success(

                "تم تسجيل الدخول بنجاح"

            );





            return userResponse.data;



        }



        catch(error){



            console.log(

                "LOGIN ERROR",

                error.response?.data

            );



            toast.error(

                "بيانات الدخول غير صحيحة"

            );



            return null;



        }



        finally{


            setLoading(false);


        }



    };









    // =========================
    // Register
    // =========================


    const register = async(data)=>{


        setLoading(true);



        try{


            await api.post(

                "/users/register/",

                data

            );



            toast.success(

                "تم إنشاء الحساب"

            );



            return await login(

                data.username,

                data.password

            );



        }



        catch(error){



            console.log(

                error.response?.data

            );



            toast.error(

                "خطأ أثناء إنشاء الحساب"

            );



            return null;


        }



        finally{


            setLoading(false);


        }


    };









    // =========================
    // Logout
    // =========================


    const logout = ()=>{



        localStorage.removeItem(

            "access_token"

        );


        localStorage.removeItem(

            "refresh_token"

        );


        localStorage.removeItem(

            "user"

        );



        setUser(null);





        toast.success(

            "تم تسجيل الخروج"

        );



    };









    return (


        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,

                role: user?.role,
                isAuthenticated: !!user,

                isOwner: user?.role === "OWNER",
                isManager: user?.role === "MANAGER",
                isPharmacist: user?.role === "PHARMACIST",
                isCashier: user?.role === "CASHIER",
                isAccountant: user?.role === "ACCOUNTANT",
                isDelivery: user?.role === "DELIVERY",
                isCustomer: user?.role === "CUSTOMER",
            }}
        >
            {children}
        </AuthContext.Provider>



    );



};









export const useAuth = ()=>useContext(AuthContext);