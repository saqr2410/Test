export default function EmptyState({

    title,

    description

}) {

    return (

        <div className="text-center py-20">

            <h2 className="text-2xl font-bold">

                {title}

            </h2>

            <p className="text-gray-500 mt-3">

                {description}

            </p>

        </div>

    );

}