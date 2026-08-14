import {
    useEffect,
    useState
} from "react";


import {
    Link
} from "react-router-dom";


import {
    Search,
    UserRound,
    HeartPulse
} from "lucide-react";


import { getPatients } from "../../../services/patients/patientService";



export default function Patients(){


    const [patients,setPatients] = useState([]);

    const [filtered,setFiltered] = useState([]);

    const [search,setSearch] = useState("");

    const [loading,setLoading] = useState(true);





    useEffect(()=>{

        loadPatients();

    },[]);





    const loadPatients = async()=>{


        try{


            const data = await getPatients();


            const list =
                data.results || data;


            setPatients(list);

            setFiltered(list);


        }
        catch(error){


            console.log(
                "PATIENT LOAD ERROR",
                error
            );


        }
        finally{


            setLoading(false);


        }


    };






    const handleSearch=(value)=>{


        setSearch(value);



        const result = patients.filter(patient=>{


            const name =
            (patient.name || "")
            .toLowerCase()
            .includes(value.toLowerCase());



            const phone =
            (patient.phone || "")
            .includes(value);



            return name || phone;


        });



        setFiltered(result);


    };







    if(loading){


        return (

            <div className="flex justify-center items-center h-64">
                جاري تحميل المرضى...
            </div>

        );

    }







    return (


        <div

        dir="rtl"

        className="
        min-h-screen
        bg-gray-100
        p-6
        ">





            <div

            className="
            flex
            justify-between
            items-center
            mb-8
            ">


                <div>


                    <h1

                    className="
                    text-3xl
                    font-black
                    text-gray-800
                    ">

                        المرضى


                    </h1>



                    <p

                    className="
                    text-gray-500
                    mt-2
                    ">


                        متابعة ملفات المرضى


                    </p>


                </div>





                <Link

                to="/patients/create"

                className="
                bg-[#5B2A86]
                text-white
                px-6
                py-3
                rounded-2xl
                font-bold
                ">

                    + إضافة مريض


                </Link>


            </div>








            <div

            className="
            bg-white
            rounded-3xl
            p-5
            mb-6
            flex
            items-center
            gap-3
            ">


                <Search/>




                <input


                value={search}


                onChange={
                    e=>
                    handleSearch(
                        e.target.value
                    )
                }


                placeholder="
                بحث باسم المريض أو رقم الهاتف
                "


                className="
                flex-1
                outline-none
                "
                
                />



            </div>









            <div

            className="
            grid
            md:grid-cols-3
            gap-5
            ">

            {filtered.length === 0 && (

                <div className="col-span-full text-center py-10 text-gray-500">

                    لا يوجد مرضى

                </div>

            )}


            {


            filtered.map(patient=>(


                <div

                key={patient.id}

                className="
                bg-white
                rounded-3xl
                shadow
                p-6
                ">



                    <div

                    className="
                    flex
                    items-center
                    gap-4
                    mb-5
                    ">


                        <div

                        className="
                        w-14
                        h-14
                        rounded-full
                        bg-purple-100
                        flex
                        items-center
                        justify-center
                        ">


                            <UserRound
                            className="text-[#5B2A86]"
                            />

                        </div>




                        <div>


                            <h2

                            className="
                            font-black
                            text-lg
                            ">

                                {patient.name}

                            </h2>



                            <p

                            className="
                            text-gray-500
                            text-sm
                            ">

                                {patient.phone || "-"}

                            </p>


                        </div>


                    </div>







                    <div

                    className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-gray-600
                    mb-5
                    ">


                        <HeartPulse
                        size={18}
                        />


                        متابعة صحية


                    </div>







                    <Link

                    to={`/patients/${patient.id}/profile`}

                    className="
                    block
                    text-center
                    bg-[#5B2A86]
                    text-white
                    py-3
                    rounded-xl
                    font-bold
                    ">


                        فتح الملف


                    </Link>



                </div>


            ))


            }



            </div>





        </div>


    );

}