import {
    useEffect,
    useState
} from "react";


import {
    Plus,
    Search,
    Edit,
    Trash2,
    Truck
} from "lucide-react";


import toast from "react-hot-toast";


import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../../../services/suppliers/supplierService";





export default function Suppliers(){


    const [suppliers,setSuppliers] = useState([]);

    const [filtered,setFiltered] = useState([]);

    const [search,setSearch] = useState("");

    const [loading,setLoading] = useState(true);


    const [showForm,setShowForm] = useState(false);


    const [editing,setEditing] = useState(null);



    const [form,setForm] = useState({

        name:"",
        phone:"",
        email:"",
        address:"",
        tax_number:""

    });









    useEffect(()=>{

        loadSuppliers();

    },[]);









    const loadSuppliers = async()=>{


        try{


            const data = await getSuppliers();



            const list =
            data.results || data;



            setSuppliers(list);

            setFiltered(list);



        }


        catch(error){


            console.log(error);


            toast.error(
                "فشل تحميل الموردين"
            );


        }


        finally{


            setLoading(false);


        }


    };









    const handleSearch=(value)=>{


        setSearch(value);



        const result = suppliers.filter(item=>{


            return (

                item.name
                ?.toLowerCase()
                .includes(
                    value.toLowerCase()
                )


                ||

                item.phone
                ?.includes(value)


            );


        });



        setFiltered(result);


    };









    const handleChange=(e)=>{


        setForm({

            ...form,

            [e.target.name]:
            e.target.value

        });


    };









    const resetForm=()=>{


        setForm({

            name:"",
            phone:"",
            email:"",
            address:"",
            tax_number:""

        });


        setEditing(null);


    };









    const saveSupplier=async(e)=>{


        e.preventDefault();



        try{


            if(editing){


                await updateSupplier(
                    editing,
                    form
                );


                toast.success(
                    "تم تعديل المورد"
                );


            }


            else{


                await createSupplier(
                    form
                );


                toast.success(
                    "تم إضافة المورد"
                );


            }




            resetForm();

            setShowForm(false);

            loadSuppliers();



        }


        catch(error){


            console.log(error);


            toast.error(
                "حدث خطأ"
            );


        }


    };









    const editSupplier=(supplier)=>{


        setEditing(
            supplier.id
        );


        setForm({

            name:supplier.name || "",

            phone:supplier.phone || "",

            email:supplier.email || "",

            address:supplier.address || "",

            tax_number:supplier.tax_number || ""

        });


        setShowForm(true);


    };









    const removeSupplier=async(id)=>{


        if(
            !window.confirm(
                "هل تريد حذف المورد؟"
            )
        )
        return;



        try{


            await deleteSupplier(id);



            toast.success(
                "تم حذف المورد"
            );


            loadSuppliers();



        }


        catch(error){


            toast.error(
                "لا يمكن حذف المورد"
            );


        }


    };









    if(loading){


        return (

            <div className="p-8">

                جاري تحميل الموردين...

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

                        الموردين

                    </h1>


                    <p className="text-gray-500 mt-2">

                        إدارة الموردين وحساباتهم

                    </p>


                </div>





                <button

                onClick={()=>{

                    resetForm();

                    setShowForm(true);

                }}

                className="
                bg-[#5B2A86]
                text-white
                px-6
                py-3
                rounded-2xl
                font-bold
                flex
                items-center
                gap-2
                ">

                    <Plus size={18}/>

                    إضافة مورد

                </button>



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


                placeholder="بحث باسم المورد أو الهاتف"


                className="
                flex-1
                outline-none
                "

                />


            </div>









            {
                showForm &&


                <form

                onSubmit={saveSupplier}

                className="
                bg-white
                rounded-3xl
                p-6
                mb-6
                space-y-4
                ">


                    <h2 className="text-xl font-black">

                        {
                            editing
                            ?
                            "تعديل مورد"
                            :
                            "إضافة مورد"
                        }

                    </h2>



                    <Input
                    name="name"
                    placeholder="اسم المورد"
                    value={form.name}
                    onChange={handleChange}
                    />



                    <Input
                    name="phone"
                    placeholder="رقم الهاتف"
                    value={form.phone}
                    onChange={handleChange}
                    />


                    <Input
                    name="email"
                    placeholder="البريد الإلكتروني"
                    value={form.email}
                    onChange={handleChange}
                    />



                    <Input
                    name="tax_number"
                    placeholder="الرقم الضريبي"
                    value={form.tax_number}
                    onChange={handleChange}
                    />



                    <textarea

                    name="address"

                    value={form.address}

                    onChange={handleChange}

                    placeholder="العنوان"

                    className="
                    w-full
                    border
                    rounded-xl
                    p-3
                    "

                    />





                    <button

                    className="
                    bg-[#5B2A86]
                    text-white
                    px-8
                    py-3
                    rounded-xl
                    font-bold
                    ">

                        حفظ

                    </button>



                </form>


            }









            <div

            className="
            grid
            md:grid-cols-3
            gap-5
            ">



            {
                filtered.map(item=>(


                    <div

                    key={item.id}

                    className="
                    bg-white
                    rounded-3xl
                    shadow
                    p-6
                    ">


                        <div

                        className="
                        flex
                        gap-4
                        items-center
                        mb-5
                        ">


                            <div

                            className="
                            w-14
                            h-14
                            bg-purple-100
                            rounded-full
                            flex
                            items-center
                            justify-center
                            ">


                                <Truck

                                className="text-[#5B2A86]"

                                />


                            </div>



                            <div>

                                <h2 className="font-black">

                                    {item.name}

                                </h2>


                                <p className="text-gray-500">

                                    {item.phone || "-"}

                                </p>


                            </div>



                        </div>





                        <p className="text-gray-600 mb-3">

                            الرصيد:
                            {" "}
                            {item.balance || 0}

                        </p>



                        <p className="text-gray-500 text-sm mb-5">

                            {item.address || "-"}

                        </p>






                        <div className="flex gap-3">


                            <button

                            onClick={()=>editSupplier(item)}

                            className="
                            flex-1
                            bg-purple-100
                            text-[#5B2A86]
                            rounded-xl
                            py-2
                            flex
                            justify-center
                            ">


                                <Edit size={18}/>


                            </button>




                            <button

                            onClick={()=>removeSupplier(item.id)}

                            className="
                            flex-1
                            bg-red-100
                            text-red-600
                            rounded-xl
                            py-2
                            flex
                            justify-center
                            ">


                                <Trash2 size={18}/>


                            </button>



                        </div>





                    </div>


                ))

            }



            </div>





        </div>


    );


}









function Input({

name,

placeholder,

value,

onChange

}){


return (

<input

name={name}

placeholder={placeholder}

value={value}

onChange={onChange}

className="
w-full
border
rounded-xl
p-3
outline-none
"

/>

);


}