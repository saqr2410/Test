import { Search, Pill, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function SearchSection() {

    const [search, setSearch] = useState("");

    return (

        <section className="-mt-12 relative z-20">

            <div className="max-w-7xl mx-auto px-6">

                <div className="bg-white rounded-3xl shadow-2xl p-6">

                    <div className="grid lg:grid-cols-4 gap-4">

                        {/* Search */}

                        <div className="lg:col-span-2 relative">

                            <Search
                                size={20}
                                className="
                                    absolute
                                    left-5
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />

                            <input

                                value={search}

                                onChange={(e)=>setSearch(e.target.value)}

                                placeholder="ابحث عن دواء..."

                                className="
                                    w-full
                                    h-14
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    pl-14
                                    pr-4
                                    outline-none
                                    focus:border-[#5B2A86]
                                    focus:ring-2
                                    focus:ring-[#5B2A86]/20
                                "

                            />

                        </div>

                        {/* Category */}

                        <div className="relative">

                            <Pill

                                size={20}

                                className="
                                    absolute
                                    left-5
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "

                            />

                            <select

                                className="
                                    w-full
                                    h-14
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    pl-14
                                    pr-4
                                    outline-none
                                    appearance-none
                                    focus:border-[#5B2A86]
                                "

                            >

                                <option>كل الأقسام</option>
                                <option>الأدوية</option>
                                <option>الفيتامينات</option>
                                <option>العناية الشخصية</option>
                                <option>الأطفال</option>

                            </select>

                        </div>

                        {/* Button */}

                        <button

                            className="
                                h-14
                                rounded-2xl
                                bg-[#5B2A86]
                                hover:bg-[#472064]
                                text-white
                                font-bold
                                flex
                                items-center
                                justify-center
                                gap-2
                                duration-300
                            "

                        >

                            <SlidersHorizontal size={18}/>

                            بحث

                        </button>

                    </div>

                </div>

            </div>

        </section>

    );

}