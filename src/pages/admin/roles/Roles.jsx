import {
    useEffect,
    useState
} from "react";


import {
    getRoles
} from "../../../services/roles/roleService";


import PageHeader from "../../../components/ui/layout/PageHeader";


import Loading from "../../../components/ui/feedback/Loading";



export default function Roles(){


    const [roles,setRoles]=useState([]);

    const [loading,setLoading]=useState(true);





    useEffect(()=>{


        const load = async()=>{


            try{


                const data =
                    await getRoles();


                setRoles(data);


            }

            catch(error){

                console.log(error);

            }


            finally{

                setLoading(false);

            }


        };


        load();


    },[]);






    if(loading){

        return <Loading/>;

    }





    return (

        <div className="space-y-6">


            <PageHeader

                title="Roles"

                subtitle="Manage roles and permissions"

            />






            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow
                    p-6
                "
            >


                <table
                    className="
                        w-full
                    "
                >


                    <thead>

                        <tr className="border-b">


                            <th className="p-3 text-right">
                                Role
                            </th>


                            <th className="p-3 text-right">
                                Permissions
                            </th>


                            <th className="p-3 text-right">
                                Users
                            </th>


                        </tr>


                    </thead>





                    <tbody>


                    {

                        roles.map(role=>(


                            <tr

                                key={role.id}

                                className="border-b"

                            >


                                <td className="p-3 font-bold">

                                    {
                                        role.name
                                    }

                                </td>




                                <td className="p-3">


                                    {
                                        role.permissions?.length
                                        ||
                                        0
                                    }

                                    {" "}
                                    Permissions


                                </td>





                                <td className="p-3">


                                    {
                                        role.users_count
                                        ||
                                        0
                                    }


                                </td>



                            </tr>


                        ))

                    }



                    </tbody>



                </table>



            </div>



        </div>

    );

}