export default function PageHeader({

    title,

    subtitle,

    action

}) {

    return (

        <div className="flex justify-between items-center mb-8">

            <div>

                <h1 className="text-4xl font-bold">

                    {title}

                </h1>

                <p className="text-gray-500 mt-2">

                    {subtitle}

                </p>

            </div>

            {action}

        </div>

    );

}