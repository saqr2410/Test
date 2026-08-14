import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { syncCart } from "../../services/cart/cartService";
import toast from "react-hot-toast";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { login, loading } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = await login(username, password);

            if (!user) return;

            // مزامنة السلة
            const localCart =
                JSON.parse(localStorage.getItem("cart")) || [];

            if (localCart.length > 0) {
                try {
                    await syncCart(
                        localCart.map((item) => ({
                            product_id: item.id,
                            quantity: item.quantity,
                        }))
                    );

                    localStorage.removeItem("cart");
                    toast.success("تم مزامنة السلة");
                } catch (error) {
                    console.log(error);
                }
            }

            // العميل
            if (user.role === "CUSTOMER") {
                navigate("/");
                return;
            }

            // أي موظف
            navigate("/admin/dashboard");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            dir="rtl"
            className="min-h-screen flex items-center justify-center bg-gray-100"
        >
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">
                    تسجيل الدخول
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        placeholder="اسم المستخدم"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border p-3 rounded-lg outline-none"
                        required
                    />

                    <input
                        type="password"
                        placeholder="كلمة المرور"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-3 rounded-lg outline-none"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg"
                    >
                        {loading ? "جاري تسجيل الدخول..." : "دخول"}
                    </button>
                </form>

                <p className="text-center mt-6">
                    ليس لديك حساب؟{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 font-bold"
                    >
                        سجل الآن
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;