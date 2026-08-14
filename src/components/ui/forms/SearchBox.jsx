import { Search } from "lucide-react";

export default function SearchBox({

    value,

    onChange,

    placeholder = "Search..."

}) {

    return (

        <div className="relative">

            <Search

                size={18}

                className="absolute left-4 top-3 text-gray-500"

            />

            <input

                value={value}

                onChange={onChange}

                placeholder={placeholder}

                className="

                    w-80

                    border

                    rounded-xl

                    pl-10

                    pr-4

                    py-3

                    outline-none

                    focus:ring-2

                    focus:ring-blue-500

                "

            />

        </div>

    );

}