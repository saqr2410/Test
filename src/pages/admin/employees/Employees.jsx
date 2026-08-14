import {
    useEffect,
    useState
} from "react";


import {
    getEmployees
} from "../../../services/employees/employeeService";


import PageHeader from "../../../components/ui/layout/PageHeader";


import Loading from "../../../components/ui/feedback/Loading";



export default function Employees(){


    const [employees,setEmployees]=useState([]);

    const [loading,setLoading]=useState(true);



    useEffect(()=>{


        const load = async()=>{


            try{


                const data =
                    await getEmployees();


                setEmployees(data);


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

                title="Employees"

                subtitle="Manage pharmacy employees"

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
                                Name
                            </th>


                            <th className="p-3 text-right">
                                Email
                            </th>


                            <th className="p-3 text-right">
                                Role
                            </th>


                            <th className="p-3 text-right">
                                Status
                            </th>


                        </tr>


                    </thead>





                    <tbody>


                    {

                        employees.map(employee=>(


                            <tr

                                key={employee.id}

                                className="border-b"

                            >


                                <td className="p-3">


                                    {
                                        employee.first_name
                                        ||
                                        employee.username
                                    }


                                </td>




                                <td className="p-3">


                                    {
                                        employee.email
                                    }


                                </td>





                                <td className="p-3">


                                    <span
                                        className="
                                            px-3
                                            py-1
                                            rounded-full
                                            bg-purple-100
                                            text-purple-700
                                        "
                                    >

                                        {
                                            employee.role
                                        }

                                    </span>


                                </td>





                                <td className="p-3">


                                    {
                                        employee.is_active
                                        ?
                                        "Active"
                                        :
                                        "Disabled"
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