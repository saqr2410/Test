import {
    LineChart,
    Line,
    ResponsiveContainer,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const data = [

    { month: "Jan", sales: 12000 },

    { month: "Feb", sales: 18000 },

    { month: "Mar", sales: 14000 },

    { month: "Apr", sales: 22000 },

    { month: "May", sales: 26000 },

    { month: "Jun", sales: 30000 },

    { month: "Jul", sales: 28000 },

];

export default function SalesChart() {

    return (

        <div className="bg-white rounded-2xl shadow p-6 h-[400px]">

            <h2 className="text-xl font-bold mb-6">

                Sales Overview

            </h2>

            <ResponsiveContainer
                width="100%"
                height="90%"
            >

                <LineChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Line

                        type="monotone"

                        dataKey="sales"

                        stroke="#2563eb"

                        strokeWidth={4}

                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}