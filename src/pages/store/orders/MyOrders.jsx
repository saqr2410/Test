import {
    useEffect,
    useState
} from "react";


import {
    Link
} from "react-router-dom";


import {
    Package,
    CalendarDays,
    ArrowLeft,
    ShoppingBag
} from "lucide-react";


import { getMyOrders } from "../../../services/orders/orderService";





export default function MyOrders(){


    const [
        orders,
        setOrders
    ] = useState([]);



    const [
        loading,
        setLoading
    ] = useState(true);







    useEffect(()=>{

        loadOrders();

    },[]);







    const loadOrders = async()=>{


        try{


            const data = await getMyOrders();


            setOrders(data);


        }

        catch(error){


            console.log(
                "ORDERS ERROR",
                error
            );


        }

        finally{


            setLoading(false);


        }


    };









    const statusStyle = (status)=>{


        switch(status){


            case "PENDING":

                return {
                    text:"قيد المراجعة",
                    color:"bg-yellow-100 text-yellow-700"
                };



            case "CONFIRMED":

                return {
                    text:"تم التأكيد",
                    color:"bg-blue-100 text-blue-700"
                };



            case "SHIPPED":

                return {
                    text:"جاري التوصيل",
                    color:"bg-purple-100 text-purple-700"
                };



            case "DELIVERED":

                return {
                    text:"تم التسليم",
                    color:"bg-green-100 text-green-700"
                };



            case "CANCELLED":

                return {
                    text:"ملغي",
                    color:"bg-red-100 text-red-700"
                };



            default:

                return {
                    text:status,
                    color:"bg-gray-100 text-gray-700"
                };


        }


    };









    if(loading){


        return (

            <div

            className="
            min-h-screen
            flex
            items-center
            justify-center
            text-[#5B2A86]
            font-bold
            "

            >

                جاري تحميل الطلبات...

            </div>

        );


    }











    return (


<div

className="
min-h-screen
bg-[#FAF8FC]
py-14
"

dir="rtl"

>



<div

className="
max-w-6xl
mx-auto
px-6
"

>



<h1

className="
text-4xl
font-black
text-[#5B2A86]
mb-10
"

>

طلباتي


</h1>









{

orders.length === 0 ?



<div

className="
bg-white
rounded-3xl
shadow
p-12
text-center
"

>


<div

className="
w-20
h-20
mx-auto
rounded-full
bg-purple-100
flex
items-center
justify-center
mb-5
"

>

<ShoppingBag

size={40}

className="text-[#5B2A86]"

/>


</div>





<h2

className="
text-2xl
font-black
mb-5
"

>

لا يوجد طلبات حتى الآن

</h2>





<Link

to="/products"

className="
inline-flex
items-center
gap-2
bg-[#5B2A86]
text-white
px-8
py-3
rounded-full
font-bold
"

>

تصفح المنتجات

<ArrowLeft size={18}/>

</Link>




</div>







:



<div

className="
grid
gap-6
"

>


{

orders.map(order=>{


const status = statusStyle(
    order.status
);



return (


<div

key={order.id}

className="
bg-white
rounded-3xl
shadow-md
p-6
hover:shadow-xl
transition
"

>




<div

className="
flex
justify-between
items-center
mb-6
"

>


<div>


<h2

className="
text-xl
font-black
text-[#5B2A86]
"

>

طلب رقم #{order.id}

</h2>



<div

className="
flex
items-center
gap-2
text-gray-500
mt-2
"

>

<CalendarDays size={18}/>


{

new Date(
order.created_at
).toLocaleDateString(
"ar-EG"
)

}


</div>



</div>







<span

className={`
px-5
py-2
rounded-full
font-bold
${status.color}
`}

>

{status.text}

</span>



</div>









<div

className="
border-t
pt-5
flex
justify-between
items-center
"

>



<div

className="
flex
items-center
gap-2
font-bold
"

>

<Package

size={20}

className="text-[#5B2A86]"

/>


{

order.items_count || 0

}

منتجات


</div>







<div

className="
text-xl
font-black
text-green-600
"

>

{

order.total || order.total_price

}

 جنيه


</div>




</div>








<Link

to={`/orders/${order.id}`}

className="
mt-6
inline-flex
items-center
gap-2
text-[#5B2A86]
font-black
hover:underline
"

>

عرض التفاصيل

<ArrowLeft size={18}/>

</Link>




</div>



);


})


}



</div>


}




</div>


</div>


);


}