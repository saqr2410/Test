import {
    Menu,
    Bell,
    LogOut
} from "lucide-react";


import { useAuth } from "../../contexts/AuthContext";





export default function Topbar({

    setOpen

}) {



    const {

        user,

        logout

    } = useAuth();






    return (


        <header

            className="
            h-20
            bg-white
            border-b
            flex
            items-center
            justify-between
            px-6
            sticky
            top-0
            z-30
            "

        >






            {/* Mobile Menu */}


            <button


                onClick={()=>setOpen(true)}


                className="
                lg:hidden
                w-11
                h-11
                rounded-xl
                bg-purple-50
                text-[#5B2A86]
                flex
                items-center
                justify-center
                "

            >


                <Menu size={24}/>


            </button>









            <div>


                <h1

                    className="
                    text-2xl
                    font-black
                    text-gray-800
                    "

                >

                    Dashboard


                </h1>


                <p

                    className="
                    text-sm
                    text-gray-400
                    "

                >

                    إدارة الصيدلية


                </p>


            </div>









            <div

                className="
                flex
                items-center
                gap-4
                "

            >





                {/* Notification */}



                <button


                    className="
                    relative
                    w-11
                    h-11
                    rounded-full
                    bg-gray-100
                    flex
                    items-center
                    justify-center
                    hover:bg-purple-50
                    transition
                    "

                >


                    <Bell size={20}/>



                    <span

                        className="
                        absolute
                        top-1
                        right-1
                        w-2
                        h-2
                        rounded-full
                        bg-red-500
                        "

                    />



                </button>











                {/* User */}



                <div

                    className="
                    hidden
                    md:flex
                    items-center
                    gap-3
                    "

                >



                    <div

                        className="
                        text-right
                        "

                    >


                        <p

                            className="
                            font-black
                            text-gray-800
                            "

                        >

                            {
                                user?.username
                            }


                        </p>




                        <span

                            className="
                            inline-block
                            mt-1
                            text-xs
                            bg-purple-100
                            text-[#5B2A86]
                            px-3
                            py-1
                            rounded-full
                            font-bold
                            "

                        >

                            {
                                user?.role
                            }


                        </span>


                    </div>







                    <div

                        className="
                        w-12
                        h-12
                        rounded-full
                        bg-[#5B2A86]
                        text-white
                        flex
                        items-center
                        justify-center
                        font-black
                        text-lg
                        "

                    >


                        {
                            user?.username
                            ?.charAt(0)
                            ?.toUpperCase()
                        }



                    </div>




                </div>











                {/* Logout */}



                <button


                    onClick={logout}


                    className="
                    hidden
                    md:flex
                    items-center
                    gap-2
                    bg-red-50
                    text-red-600
                    px-4
                    py-3
                    rounded-xl
                    font-bold
                    hover:bg-red-100
                    transition
                    "

                >



                    <LogOut size={18}/>


                    خروج


                </button>






            </div>





        </header>


    );


}