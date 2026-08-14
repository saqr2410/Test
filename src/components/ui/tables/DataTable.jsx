export default function DataTable({

    columns,

    data

}) {

    return (

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

            <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>

                        {

                            columns.map(column => (

                                <th

                                    key={column.key}

                                    className="px-6 py-4 text-left font-semibold"

                                >

                                    {column.title}

                                </th>

                            ))

                        }

                    </tr>

                </thead>

                <tbody>

                    {

                        data.map((row, index) => (

                            <tr

                                key={index}

                                className="border-t hover:bg-gray-50"

                            >

                                {

                                    columns.map(column => (

                                        <td

                                            key={column.key}

                                            className="px-6 py-4"

                                        >

                                            {row[column.key]}

                                        </td>

                                    ))

                                }

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}