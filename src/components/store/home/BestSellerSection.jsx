import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";

const products = [

    {
        id:1,
        name:"Panadol Extra",
        price:120,
        oldPrice:150,
        image:"https://placehold.co/500x400/F6F3FB/5B2A86?text=Panadol",
        rate:4.9
    },

    {
        id:2,
        name:"Vitamin C",
        price:80,
        oldPrice:100,
        image:"https://placehold.co/500x400/F6F3FB/5B2A86?text=Vitamin+C",
        rate:4.8
    },

    {
        id:3,
        name:"Omega 3",
        price:250,
        oldPrice:300,
        image:"https://placehold.co/500x400/F6F3FB/5B2A86?text=Omega+3",
        rate:5
    },

    {
        id:4,
        name:"Cough Syrup",
        price:95,
        oldPrice:130,
        image:"https://placehold.co/500x400/F6F3FB/5B2A86?text=Syrup",
        rate:4.7
    }

];

export default function BestSellerSection(){

    return(

<section
    id="offers"
    className="py-24 bg-white"
>

<div className="max-w-7xl mx-auto px-6">

<div className="flex justify-between items-center mb-14">

<div>

<h2 className="text-4xl font-black text-[#5B2A86]">

الأكثر مبيعاً

</h2>

<p className="text-gray-500 mt-3">

أفضل المنتجات طلباً

</p>

</div>

<Link

to="/products"

className="text-[#5B2A86] font-bold"

>

عرض الكل →

</Link>

</div>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

{

products.map(product=>(

<div

key={product.id}

className="
bg-white
rounded-[30px]
overflow-hidden
shadow-xl
border
hover:-translate-y-3
duration-300
group
"

>

<div className="relative">

<img

src={product.image}

className="w-full h-64 object-cover"

/>

<span

className="
absolute
top-5
right-5
bg-[#5B2A86]
text-white
px-4
py-2
rounded-full
text-sm
"

>

خصم

</span>

<button

className="
absolute
top-5
left-5
bg-white
w-11
h-11
rounded-full
flex
items-center
justify-center
shadow-lg
"

>

<Heart size={20}/>

</button>

</div>

<div className="p-6">

<div className="flex items-center gap-1 text-yellow-500">

<Star fill="currentColor" size={18}/>

<span>

{product.rate}

</span>

</div>

<h3

className="
font-bold
text-xl
mt-4
"

>

{product.name}

</h3>

<div className="flex items-center gap-3 mt-4">

<span

className="
text-[#5B2A86]
font-black
text-2xl
"

>

{product.price} جنيه

</span>

<span

className="
line-through
text-gray-400
"

>

{product.oldPrice}

</span>

</div>

<button

className="
w-full
mt-6
bg-[#5B2A86]
hover:bg-[#472064]
text-white
rounded-2xl
py-4
font-bold
flex
justify-center
items-center
gap-2
duration-300
"

>

<ShoppingCart size={18}/>

إضافة للسلة

</button>

</div>

</div>

))

}

</div>

</div>

</section>

);

}