export default function Card({

    title,

    subtitle,

    children,

    action

}) {

    return (

        <div className="bg-white rounded-2xl shadow-sm border">

            {

                (title || action) &&

                <div className="flex justify-between items-center px-6 py-5 border-b">

                    <div>

                        {

                            title &&

                            <h2 className="text-xl font-semibold">

                                {title}

                            </h2>

                        }

                        {

                            subtitle &&

                            <p className="text-gray-500 text-sm mt-1">

                                {subtitle}

                            </p>

                        }

                    </div>

                    {action}

                </div>

            }

            <div className="p-6">

                {children}

            </div>

        </div>

    );

}