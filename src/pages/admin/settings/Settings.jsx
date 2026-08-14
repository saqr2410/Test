import {
    useEffect,
    useState
} from "react";


import {
    User,
    Store,
    Lock,
    Save
} from "lucide-react";


import {
    getProfile,
    updateProfile,
    changePassword,
    getPharmacySettings,
    updatePharmacySettings
} from "../../../services/settings/settingsService";





export default function Settings(){



    const [profile,setProfile] = useState({});


    const [pharmacy,setPharmacy] = useState({});


    const [password,setPassword] = useState({

        old_password:"",
        new_password:""

    });



    const [loading,setLoading] = useState(true);






    useEffect(()=>{


        load();


    },[]);






    const load = async()=>{


        try{


            const [

                profileData,

                pharmacyData

            ] = await Promise.all([


                getProfile(),

                getPharmacySettings()


            ]);



            setProfile(profileData);

            setPharmacy(pharmacyData);



        }


        catch(error){


            console.log(
                "SETTINGS ERROR",
                error
            );


        }


        finally{


            setLoading(false);


        }


    };









    const saveProfile = async()=>{


        await updateProfile(profile);


        alert(
            "Profile Updated"
        );


    };







    const savePharmacy = async()=>{


        await updatePharmacySettings(
            pharmacy
        );


        alert(
            "Pharmacy Updated"
        );


    };








    const savePassword = async()=>{


        await changePassword(
            password
        );


        alert(
            "Password Changed"
        );


    };









    if(loading){


        return (

            <div className="p-10">

                Loading Settings...

            </div>

        );


    }









    return (


        <div className="space-y-8">






            <h1

            className="
            text-3xl
            font-black
            "

            >

                Settings

            </h1>








            {/* Profile */}



            <Section

            title="Profile"

            icon={<User/>}

            >



                <Input

                label="Username"

                value={profile.username}

                onChange={
                    e=>
                    setProfile({

                        ...profile,

                        username:e.target.value

                    })
                }

                />




                <Input

                label="Phone"

                value={profile.phone}

                onChange={
                    e=>
                    setProfile({

                        ...profile,

                        phone:e.target.value

                    })
                }

                />





                <button

                onClick={saveProfile}

                className="
                bg-[#5B2A86]
                text-white
                px-6
                py-3
                rounded-xl
                flex
                gap-2
                items-center
                "

                >

                    <Save size={18}/>

                    Save

                </button>




            </Section>









            {/* Pharmacy */}



            <Section

            title="Pharmacy Information"

            icon={<Store/>}

            >



                <Input

                label="Pharmacy Name"

                value={
                    pharmacy.name
                }

                onChange={
                    e=>
                    setPharmacy({

                        ...pharmacy,

                        name:e.target.value

                    })
                }

                />





                <Input

                label="Address"

                value={
                    pharmacy.address
                }

                onChange={
                    e=>
                    setPharmacy({

                        ...pharmacy,

                        address:e.target.value

                    })
                }

                />






                <button

                onClick={savePharmacy}

                className="
                bg-[#5B2A86]
                text-white
                px-6
                py-3
                rounded-xl
                "

                >

                    Save Pharmacy

                </button>




            </Section>









            {/* Password */}



            <Section

            title="Change Password"

            icon={<Lock/>}

            >



                <Input

                label="Old Password"

                type="password"

                value={
                    password.old_password
                }

                onChange={
                    e=>
                    setPassword({

                        ...password,

                        old_password:e.target.value

                    })
                }

                />





                <Input

                label="New Password"

                type="password"

                value={
                    password.new_password
                }

                onChange={
                    e=>
                    setPassword({

                        ...password,

                        new_password:e.target.value

                    })
                }

                />





                <button

                onClick={savePassword}

                className="
                bg-[#5B2A86]
                text-white
                px-6
                py-3
                rounded-xl
                "

                >

                    Change Password

                </button>




            </Section>








        </div>


    );


}









function Section({

    title,

    icon,

    children

}){


    return (

        <div

        className="
        bg-white
        rounded-3xl
        shadow
        p-6
        space-y-5
        "

        >


            <h2

            className="
            text-xl
            font-black
            flex
            items-center
            gap-2
            "

            >

                {icon}

                {title}

            </h2>


            {children}


        </div>

    );

}









function Input({

    label,

    value,

    onChange,

    type="text"

}){


    return (

        <div>


            <label

            className="
            block
            font-bold
            mb-2
            "

            >

                {label}

            </label>



            <input

            type={type}

            value={value || ""}

            onChange={onChange}

            className="
            w-full
            border
            rounded-xl
            px-4
            py-3
            "

            />


        </div>

    );

}