import {
    useEffect,
    useState
} from "react";

import toast from "react-hot-toast";

import {
    Users,
    Search
} from "lucide-react";



export default function Customers(){


    const [customers,setCustomers] = useState([]);

    const [search,setSearch] = useState("");

    const [loading,setLoading] = useState(false);





    useEffect(()=>{

        loadCustomers();

    },[]);





    const loadCustomers = async()=>{

        try{

            setLoading(true);


            // هنربطه بالـ API بعدين
            // const data = await getCustomers()
            // setCustomers(data)


            setCustomers([]);


        }

        catch(error){

            console.log(
                "CUSTOMERS ERROR",
                error
            );

            toast.error(
                "خطأ في تحميل العملاء"
            );

        }

        finally{

            setLoading(false);

        }

    };






    const filteredCustomers =
        customers.filter(customer=>

            customer.name
            ?.toLowerCase()
            .includes(
                search.toLowerCase()
            )

        );





    if(loading){

        return (

            <div className="p-10">

                Loading Customers...

            </div>

        );

    }







    return (

        <div
            dir="rtl"
            className="
            space-y-8
            "
        >



            <div>

                <h1
                    className="
                    text-3xl
                    font-black
                    flex
                    items-center
                    gap-3
                    "
                >

                    <Users />

                    العملاء

                </h1>


                <p className="text-gray-500">

                    إدارة بيانات العملاء والمرضى

                </p>


            </div>







            <div
                className="
                bg-white
                rounded-3xl
                shadow
                p-5
                "
            >

                <div
                    className="
                    flex
                    items-center
                    gap-3
                    border
                    rounded-xl
                    px-4
                    "
                >

                    <Search size={20}/>


                    <input

                        value={search}

                        onChange={
                            e=>setSearch(
                                e.target.value
                            )
                        }

                        placeholder="بحث عن عميل..."

                        className="
                        w-full
                        p-3
                        outline-none
                        "

                    />


                </div>


            </div>









            <div
                className="
                bg-white
                rounded-3xl
                shadow
                overflow-hidden
                "
            >



                <table
                    className="
                    w-full
                    "
                >


                    <thead
                        className="
                        bg-gray-100
                        "
                    >

                        <tr>

                            <th className="p-4">
                                الاسم
                            </th>


                            <th className="p-4">
                                الهاتف
                            </th>


                            <th className="p-4">
                                البريد
                            </th>


                            <th className="p-4">
                                الحالة
                            </th>


                        </tr>

                    </thead>





                    <tbody>


                    {

                        filteredCustomers.length === 0 &&

                        (

                            <tr>

                                <td
                                    colSpan="4"
                                    className="
                                    p-10
                                    text-center
                                    text-gray-400
                                    "
                                >

                                    لا يوجد عملاء

                                </td>


                            </tr>

                        )


                    }





                    {

                        filteredCustomers.map(customer=>(


                            <tr
                                key={customer.id}
                                className="border-b"
                            >

                                <td className="p-4 font-bold">

                                    {customer.name}

                                </td>


                                <td className="p-4">

                                    {customer.phone}

                                </td>


                                <td className="p-4">

                                    {customer.email}

                                </td>


                                <td className="p-4">

                                    نشط

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