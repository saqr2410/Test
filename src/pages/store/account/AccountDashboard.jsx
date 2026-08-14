// src/pages/store/account/AccountDashboard.jsx

import { Link } from "react-router-dom";

import {
  User,
  Heart,
  MapPin,
  Settings,
  FileHeart,
  Package,
  ChevronLeft,
} from "lucide-react";

export default function AccountDashboard() {
  const cards = [
    {
      title: "الملف الشخصي",
      desc: "تعديل بيانات الحساب",
      icon: User,
      color: "from-violet-600 to-purple-500",
      to: "/account/profile",
    },
    {
      title: "ملفي الصحي",
      desc: "الأدوية والحساسية والأمراض",
      icon: FileHeart,
      color: "from-pink-500 to-rose-500",
      to: "/account/health-profile",
    },
    {
      title: "عناويني",
      desc: "إدارة عناوين التوصيل",
      icon: MapPin,
      color: "from-blue-500 to-cyan-500",
      to: "/account/addresses",
    },
    {
      title: "المفضلة",
      desc: "منتجاتك المحفوظة",
      icon: Heart,
      color: "from-red-500 to-pink-500",
      to: "/account/favorites",
    },
    {
      title: "طلباتي",
      desc: "متابعة جميع الطلبات",
      icon: Package,
      color: "from-emerald-500 to-green-500",
      to: "/orders",
    },
    {
      title: "الإعدادات",
      desc: "اللغة والإشعارات والأمان",
      icon: Settings,
      color: "from-slate-700 to-slate-500",
      to: "/account/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8fc] py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}

        <div className="bg-gradient-to-r from-[#5B2A86] to-[#7B3FD6] rounded-3xl p-10 text-white shadow-xl">
          <p className="text-purple-200 font-medium">مرحباً بعودتك 👋</p>

          <h1 className="text-4xl font-black mt-3">
            لوحة التحكم الخاصة بحسابك
          </h1>

          <p className="mt-5 text-white/80 max-w-2xl leading-8">
            يمكنك إدارة بياناتك الشخصية، ملفك الصحي، العناوين، الطلبات،
            المفضلة، والإعدادات من مكان واحد.
          </p>
        </div>

        {/* Cards */}

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-12">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <Link
                key={index}
                to={card.to}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center text-white`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="mt-7 text-2xl font-black text-gray-800">
                  {card.title}
                </h3>

                <p className="mt-3 text-gray-500 leading-7">
                  {card.desc}
                </p>

                <div className="flex items-center gap-2 mt-8 text-[#5B2A86] font-bold">
                  عرض الصفحة

                  <ChevronLeft
                    size={18}
                    className="group-hover:-translate-x-1 transition"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}