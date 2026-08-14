import {
    useEffect,
    useState
} from "react";


import {
    useParams,
    Link
} from "react-router-dom";


import {
    User,
    Phone,
    Calendar,
    HeartPulse,
    Pill,
    ClipboardList,
    Edit
} from "lucide-react";


import {
    getPatientDetails,
    getPatientMedications,
    getPatientVisits,
    getPatientDiseases
} from "../../../services/patients/patientService";




export default function PatientProfile(){


    const {
        id
    } = useParams();




    const [patient,setPatient] = useState(null);

    const [medications,setMedications] = useState([]);

    const [visits,setVisits] = useState([]);

    const [diseases,setDiseases] = useState([]);

    const [loading,setLoading] = useState(true);








    useEffect(()=>{

        loadData();

    },[id]);









    const loadData = async()=>{


        try{


            const patientData =
            await getPatientDetails(id);



            const medicationData =
            await getPatientMedications(id);



            const visitData =
            await getPatientVisits(id);


            const diseaseData =
            await getPatientDiseases(id);





            setPatient(patientData);



            setMedications(
                medicationData.results ||
                medicationData
            );



            setVisits(
                visitData.results ||
                visitData
            );


            setDiseases(
                diseaseData.results ||
                diseaseData
            );


        }


        catch(error){


            console.log(error);


        }


        finally{


            setLoading(false);


        }


    };









    if(loading){


        return (

            <div className="p-8">

                جاري تحميل ملف المريض...

            </div>

        );

    }

    if(!patient){

        return(

            <div className="p-8">

                المريض غير موجود

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



            {/* Header */}



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
                    ">


                        {patient.name}


                    </h1>



                    <p

                    className="
                    text-gray-500
                    mt-2
                    ">

                        الملف الصحي


                    </p>


                </div>





                <Link

                to={`/patients/${id}/edit`}

                className="
                bg-[#5B2A86]
                text-white
                px-5
                py-3
                rounded-xl
                font-bold
                flex
                items-center
                gap-2
                ">


                    <Edit size={18}/>

                    تعديل


                </Link>



            </div>









            {/* Basic Info */}



            <div

            className="
            bg-white
            rounded-3xl
            p-6
            shadow
            mb-6
            ">



                <h2

                className="
                text-xl
                font-black
                mb-5
                ">


                    البيانات الأساسية


                </h2>





                <div

                className="
                grid
                md:grid-cols-3
                gap-5
                ">



                    <InfoCard

                    icon={<User/>}

                    title="الاسم"

                    value={patient.name}

                    />




                    <InfoCard

                    icon={<Phone/>}

                    title="الهاتف"

                    value={
                        patient.phone || "-"
                    }

                    />





                    <InfoCard

                    icon={<Calendar/>}

                    title="تاريخ الميلاد"

                    value={
                        patient.date_of_birth || "-"
                    }

                    />



                </div>


            </div>









            {/* Medications */}



            <Section

            icon={<Pill/>}

            title="الأدوية الحالية">


                {
                    medications.length === 0

                    ?

                    <p className="text-gray-500">

                        لا يوجد أدوية مسجلة

                    </p>


                    :

                    medications.map(item=>(


                        <div

                        key={item.id}

                        className="
                        border-b
                        py-3
                        ">


                            <p

                            className="
                            font-bold
                            ">

                                {
                                    item.product_name ||
                                    item.product
                                }

                            </p>


                            <p

                            className="
                            text-gray-500
                            ">


                                الجرعة:
                                {" "}
                                {item.dosage}


                            </p>


                        </div>


                    ))

                }


            </Section>









            {/* Visits */}



            <Section

            icon={<ClipboardList/>}

            title="سجل المتابعات">


                {

                    visits.length === 0


                    ?

                    <p className="text-gray-500">

                        لا يوجد زيارات

                    </p>


                    :


                    visits.map(visit=>(


                        <div

                        key={visit.id}

                        className="
                        border-b
                        py-3
                        ">



                            <p className="font-bold">

                                {visit.visit_type}

                            </p>



                            <p className="text-gray-600">

                                {visit.notes || "-"}

                            </p>



                        </div>


                    ))

                }



            </Section>









            {/* Future Chronic */}


            <Section

            icon={<HeartPulse />}

            title="الأمراض المزمنة"

            >

            {

            diseases.length === 0

            ?

            (

            <p className="text-gray-500">

            لا يوجد أمراض مزمنة مسجلة

            </p>

            )

            :

            (

            diseases.map(item => (

            <div

            key={item.id}

            className="border-b py-3"

            >

            <p className="font-bold">

            {item.disease_name}

            </p>

            <p className="text-gray-500 mt-1">

            {item.notes || "-"}

            </p>

            </div>

            ))

            )

            }

            </Section>





        </div>


    );

}









function InfoCard({

    icon,

    title,

    value

}){


    return (

        <div

        className="
        bg-gray-50
        rounded-2xl
        p-4
        ">


            <div

            className="
            text-[#5B2A86]
            mb-2
            ">

                {icon}

            </div>



            <p className="text-gray-500 text-sm">

                {title}

            </p>



            <p className="font-bold mt-1">

                {value}

            </p>



        </div>

    );

}









function Section({

    icon,

    title,

    children

}){


    return (


        <div

        className="
        bg-white
        rounded-3xl
        p-6
        shadow
        mb-6
        ">



            <h2

            className="
            text-xl
            font-black
            mb-5
            flex
            items-center
            gap-3
            ">

                <span className="text-[#5B2A86]">

                    {icon}

                </span>


                {title}


            </h2>



            {children}



        </div>


    );


}