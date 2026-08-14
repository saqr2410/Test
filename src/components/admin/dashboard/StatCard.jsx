export default function StatCard({
    title,
    value
}){


    return (


        <div

            className="
            bg-white
            rounded-2xl
            shadow
            p-6
            "

        >



            <p

                className="
                text-gray-500
                "

            >

                {title}


            </p>





            <h2

                className="
                text-3xl
                font-black
                mt-3
                text-blue-600
                "

            >

                {value ?? 0}


            </h2>




        </div>


    );


}