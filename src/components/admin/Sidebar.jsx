import { Link, useLocation } from "react-router-dom";

import {
    X,
    Pill,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

import { SIDEBAR_ITEMS } from "../../config/sidebarItems";

import { ADMIN_PERMISSIONS } from "../../config/adminPermissions";


export default function Sidebar({ open, setOpen }) {


    const location = useLocation();

    const { user } = useAuth();



    const currentMenu = SIDEBAR_ITEMS.filter((item) => {


        const permission =
            ADMIN_PERMISSIONS[item.permission];



        if (!permission) {
            return false;
        }



        if (!user?.role) {
            return false;
        }



        return permission.view.some(
            (role) =>
                role.toUpperCase() ===
                user.role.toUpperCase()
        );


    });



    console.log("SIDEBAR USER ROLE =>", user?.role);

    console.log("SIDEBAR MENU =>", currentMenu);




    return (
        <>


            {
                open && (

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

                )
            }





            <aside

                className={`

                    fixed

                    top-0

                    right-0

                    z-50

                    h-screen

                    w-72

                    bg-white

                    shadow-xl

                    border-l

                    p-6

                    transition-transform

                    duration-300


                    lg:translate-x-0

                    lg:static


                    ${
                        open
                            ? "translate-x-0"
                            : "translate-x-full lg:translate-x-0"
                    }

                `}

            >





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
                            "

                        >

                            <Pill />

                        </div>





                        <div>


                            <h2

                                className="
                                    font-black
                                    text-xl
                                    text-[#5B2A86]
                                "

                            >

                                Smart Pharmacy

                            </h2>



                            <p

                                className="
                                    text-xs
                                    text-gray-400
                                "

                            >

                                ERP System

                            </p>


                        </div>


                    </div>






                    <button

                        onClick={() => setOpen(false)}

                        className="
                            lg:hidden
                        "

                    >

                        <X />

                    </button>


                </div>







                <nav

                    className="
                        space-y-2
                    "

                >



                    {
                        currentMenu.map((item) => {


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

                                        transition


                                        ${
                                            active

                                            ?

                                            "bg-[#5B2A86] text-white shadow-lg"

                                            :

                                            "text-gray-600 hover:bg-purple-50 hover:text-[#5B2A86]"

                                        }

                                    `}


                                >




                                    <Icon size={21}/>




                                    <span>

                                        {item.title}

                                    </span>



                                </Link>

                            );


                        })

                    }



                </nav>





            </aside>



        </>
    );
}