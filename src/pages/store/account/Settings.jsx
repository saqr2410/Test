import { useEffect, useState } from "react";
import {
    User,
    Lock,
    Save,
    LogOut,
} from "lucide-react";

import { useAuth } from "../../../contexts/AuthContext";

import {
    getCurrentUser,
    updateCurrentUser,
    changePassword,
} from "../../../services/users/userService";

import toast from "react-hot-toast";

export default function Settings() {

    const { logout } = useAuth();

    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
    });

    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getCurrentUser();

            setProfile({
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                email: data.email || "",
                phone: data.phone || "",
            });

        } catch {
            toast.error("تعذر تحميل البيانات");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {

            await updateCurrentUser(profile);

            toast.success("تم حفظ البيانات");

        } catch {

            toast.error("فشل تحديث البيانات");

        }
    };

    const handlePassword = async () => {

        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error("كلمتا المرور غير متطابقتين");
            return;
        }

        try {

            await changePassword(passwordData);

            toast.success("تم تغيير كلمة المرور");

            setPasswordData({
                old_password: "",
                new_password: "",
                confirm_password: "",
            });

        } catch {

            toast.error("فشل تغيير كلمة المرور");

        }
    };

    if (loading) {

        return (
            <div className="text-center py-20">
                جار التحميل...
            </div>
        );

    }

    return (

        <div className="max-w-4xl mx-auto py-10 px-6">

            <h1 className="text-3xl font-black text-[#5B2A86] mb-8">
                إعدادات الحساب
            </h1>

            {/* البيانات */}

            <div className="bg-white rounded-3xl shadow-xl p-8">

                <div className="flex items-center gap-3 mb-6">

                    <User className="text-[#5B2A86]" />

                    <h2 className="font-black text-xl">
                        البيانات الشخصية
                    </h2>

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                    <input
                        className="border rounded-xl p-3"
                        placeholder="الاسم الأول"
                        value={profile.first_name}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                first_name: e.target.value,
                            })
                        }
                    />

                    <input
                        className="border rounded-xl p-3"
                        placeholder="الاسم الأخير"
                        value={profile.last_name}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                last_name: e.target.value,
                            })
                        }
                    />

                    <input
                        className="border rounded-xl p-3"
                        placeholder="البريد الإلكتروني"
                        value={profile.email}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                email: e.target.value,
                            })
                        }
                    />

                    <input
                        className="border rounded-xl p-3"
                        placeholder="رقم الهاتف"
                        value={profile.phone}
                        onChange={(e) =>
                            setProfile({
                                ...profile,
                                phone: e.target.value,
                            })
                        }
                    />

                </div>

                <button
                    onClick={handleSave}
                    className="mt-6 bg-[#5B2A86] text-white px-6 py-3 rounded-xl flex items-center gap-2"
                >
                    <Save size={18} />
                    حفظ البيانات
                </button>

            </div>

            {/* تغيير الباسورد */}

            <div className="bg-white rounded-3xl shadow-xl p-8 mt-8">

                <div className="flex items-center gap-3 mb-6">

                    <Lock className="text-[#5B2A86]" />

                    <h2 className="font-black text-xl">
                        تغيير كلمة المرور
                    </h2>

                </div>

                <div className="space-y-4">

                    <input
                        type="password"
                        placeholder="كلمة المرور الحالية"
                        className="border rounded-xl p-3 w-full"
                        value={passwordData.old_password}
                        onChange={(e) =>
                            setPasswordData({
                                ...passwordData,
                                old_password: e.target.value,
                            })
                        }
                    />

                    <input
                        type="password"
                        placeholder="كلمة المرور الجديدة"
                        className="border rounded-xl p-3 w-full"
                        value={passwordData.new_password}
                        onChange={(e) =>
                            setPasswordData({
                                ...passwordData,
                                new_password: e.target.value,
                            })
                        }
                    />

                    <input
                        type="password"
                        placeholder="تأكيد كلمة المرور"
                        className="border rounded-xl p-3 w-full"
                        value={passwordData.confirm_password}
                        onChange={(e) =>
                            setPasswordData({
                                ...passwordData,
                                confirm_password: e.target.value,
                            })
                        }
                    />

                    <button
                        onClick={handlePassword}
                        className="bg-[#5B2A86] text-white px-6 py-3 rounded-xl"
                    >
                        تغيير كلمة المرور
                    </button>

                </div>

            </div>

            {/* تسجيل الخروج */}

            <button
                onClick={logout}
                className="mt-8 bg-red-600 hover:bg-red-700 text-white w-full py-4 rounded-2xl flex justify-center items-center gap-3"
            >
                <LogOut size={20} />
                تسجيل الخروج
            </button>

        </div>

    );
}