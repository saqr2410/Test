import {

Truck,

Shield,

Clock3,

BadgeCheck

} from "lucide-react";

const data=[

{

icon:Truck,

title:"توصيل سريع",

desc:"حتى باب المنزل"

},

{

icon:Shield,

title:"منتجات أصلية",

desc:"معتمدة 100%"

},

{

icon:Clock3,

title:"24/7",

desc:"خدمة طوال اليوم"

},

{

icon:BadgeCheck,

title:"صيادلة متخصصون",

desc:"استشارات مجانية"

}

];

export default function WhyUsSection(){

return(

<section className="py-24 bg-[#F8F5FC]">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-center text-4xl font-black text-[#5B2A86]">

لماذا نحن؟

</h2>

<div className="grid lg:grid-cols-4 gap-8 mt-16">

{

data.map((item,index)=>{

const Icon=item.icon;

return(

<div

key={index}

className="bg-white rounded-3xl shadow-xl p-8 text-center"

>

<div

className="w-20 h-20 rounded-full bg-[#5B2A86] text-white flex items-center justify-center mx-auto"

>

<Icon size={35}/>

</div>

<h3 className="font-bold text-xl mt-6">

{item.title}

</h3>

<p className="text-gray-500 mt-3">

{item.desc}

</p>

</div>

);

})

}

</div>

</div>

</section>

);

}