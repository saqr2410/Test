import {
    useEffect,
    useState
} from "react";


import {
    getPrescriptions
} from "../../../services/prescriptions/prescriptionService";


import PageHeader from "../../../components/ui/layout/PageHeader";


import Loading from "../../../components/ui/feedback/Loading";



export default function Prescriptions(){


    const [prescriptions,setPrescriptions]=useState([]);

    const [loading,setLoading]=useState(true);




    useEffect(()=>{


        const load = async()=>{


            try{


                const data =
                    await getPrescriptions();


                setPrescriptions(data);


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

                title="Prescriptions"

                subtitle="Manage customer prescriptions"

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


                        <tr
                            className="
                                border-b
                            "
                        >


                            <th className="p-3 text-right">
                                Customer
                            </th>


                            <th className="p-3 text-right">
                                Image
                            </th>


                            <th className="p-3 text-right">
                                Status
                            </th>


                            <th className="p-3 text-right">
                                Date
                            </th>


                        </tr>


                    </thead>





                    <tbody>


                    {

                        prescriptions.map(item=>(


                            <tr

                                key={item.id}

                                className="border-b"

                            >



                                <td className="p-3">


                                    {
                                        item.customer_name ||
                                        "-"
                                    }


                                </td>




                                <td className="p-3">


                                    {
                                        item.image
                                        ?
                                        <img

                                            src={item.image}

                                            className="
                                                w-16
                                                h-16
                                                object-cover
                                                rounded-xl
                                            "

                                        />
                                        :
                                        "-"
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
                                            item.status
                                        }

                                    </span>


                                </td>





                                <td className="p-3">


                                    {
                                        item.created_at
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