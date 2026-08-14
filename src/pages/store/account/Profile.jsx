import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Camera } from "lucide-react";
import {
    getCurrentUser,
    updateCurrentUser
} from "../../../services/users/userService";
import toast from "react-hot-toast";

export default function Profile() {

    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        profile: {
            address: ""
        }
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {

            const data = await getCurrentUser();

            setForm({
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                email: data.email || "",
                phone: data.phone || "",
                profile: {
                    address: data.profile?.address || ""
                }
            });

        } catch (err) {
            toast.error("فشل تحميل البيانات");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "address") {
            setForm(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    address: value
                }
            }));
            return;
        }

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const saveProfile = async () => {

        try {

            await updateCurrentUser(form);

            toast.success("تم حفظ البيانات");

        } catch (err) {

            toast.error("حدث خطأ");

        }

    };

    if (loading) {

        return (
            <div className="flex justify-center py-20">
                جاري التحميل...
            </div>
        );

    }

    return (

        <div className="max-w-5xl mx-auto px-6 py-10">

            <div className="mb-8">

                <h1 className="text-3xl font-black text-[#5B2A86]">
                    الملف الشخصي
                </h1>

                <p className="text-gray-500 mt-2">
                    يمكنك تعديل بيانات حسابك الشخصية.
                </p>

            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8">

                <div className="flex flex-col items-center">

                    <div className="relative">

                        <img
                            src={`https://ui-avatars.com/api/?name=${form.first_name}+${form.last_name}&background=5B2A86&color=fff&size=180`}
                            alt="profile"
                            className="w-36 h-36 rounded-full border-4 border-purple-100"
                        />

                        <button
                            className="
                            absolute
                            bottom-2
                            left-2
                            w-11
                            h-11
                            rounded-full
                            bg-[#5B2A86]
                            text-white
                            flex
                            items-center
                            justify-center
                            shadow-lg
                            "
                        >
                            <Camera size={18} />
                        </button>

                    </div>

                    <h2 className="text-2xl font-black mt-5">
                        {form.first_name} {form.last_name}
                    </h2>

                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-12">

                    <Input
                        icon={<User size={20} />}
                        label="الاسم الأول"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                    />

                    <Input
                        icon={<User size={20} />}
                        label="الاسم الأخير"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                    />

                    <Input
                        icon={<Mail size={20} />}
                        label="البريد الإلكتروني"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <Input
                        icon={<Phone size={20} />}
                        label="رقم الهاتف"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                    />

                    <Input
                        icon={<MapPin size={20} />}
                        label="العنوان"
                        name="address"
                        value={form.profile.address}
                        onChange={handleChange}
                    />

                </div>

                <div className="flex justify-end mt-10">

                    <button
                        onClick={saveProfile}
                        className="
                        bg-[#5B2A86]
                        text-white
                        px-8
                        py-3
                        rounded-xl
                        font-bold
                        hover:bg-[#6C2EA8]
                        transition
                        "
                    >
                        حفظ التعديلات
                    </button>

                </div>

            </div>

        </div>

    );

}

function Input({
    icon,
    label,
    name,
    value,
    onChange
}) {

    return (

        <div>

            <label className="font-bold text-gray-700 flex items-center gap-2 mb-3">

                {icon}

                {label}

            </label>

            <input
                name={name}
                value={value}
                onChange={onChange}
                className="
                w-full
                border
                rounded-2xl
                px-5
                py-4
                focus:ring-2
                focus:ring-[#5B2A86]
                outline-none
                "
            />

        </div>

    );

}