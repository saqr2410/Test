// src/pages/store/account/AccountDashboard.jsx

import { Link } from "react-router-dom";

import {
  User,
  Heart,
  Settings,
  FileHeart,
  Package,
  ChevronLeft,
  ShieldCheck,
  Sparkles,
} from "lucide-react";


export default function AccountDashboard() {

  const cards = [
    {
      title: "الملف الشخصي",
      desc: "إدارة بياناتك الشخصية ومعلومات حسابك.",
      icon: User,
      iconBg: "bg-purple-50",
      iconColor: "text-[#5B2A86]",
      to: "/account/profile",
    },
    {
      title: "ملفي الصحي",
      desc: "تابع بياناتك الصحية والأدوية والمتابعات.",
      icon: FileHeart,
      iconBg: "bg-pink-50",
      iconColor: "text-pink-500",
      to: "/account/health-profile",
    },
    {
      title: "المفضلة",
      desc: "الوصول السريع إلى المنتجات التي حفظتها.",
      icon: Heart,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      to: "/account/favorites",
    },
    {
      title: "طلباتي",
      desc: "تابع طلباتك وتفاصيل كل طلب بسهولة.",
      icon: Package,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      to: "/orders",
    },
    {
      title: "الإعدادات",
      desc: "إدارة بيانات الحساب وكلمة المرور.",
      icon: Settings,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
      to: "/account/settings",
    },
  ];


  return (

    <div
      dir="rtl"
      className="min-h-screen bg-[#FAF8FC] py-10 md:py-14"
    >

      <div className="max-w-6xl mx-auto px-4 sm:px-6">


        {/* ==========================================
                    HERO
                ========================================== */}

        <div
          className="
                        relative
                        overflow-hidden
                        bg-gradient-to-br
                        from-[#5B2A86]
                        via-[#69329B]
                        to-[#7B3FD6]
                        rounded-[2rem]
                        p-7
                        md:p-10
                        text-white
                        shadow-xl
                    "
        >

          {/* Decorative circles */}

          <div
            className="
                            absolute
                            -top-20
                            -left-20
                            w-56
                            h-56
                            rounded-full
                            bg-white/10
                        "
          />

          <div
            className="
                            absolute
                            -bottom-28
                            right-20
                            w-72
                            h-72
                            rounded-full
                            bg-white/5
                        "
          />


          <div className="relative z-10 max-w-3xl">

            <div className="flex items-center gap-3 mb-5">

              <div
                className="
                                    w-11
                                    h-11
                                    rounded-2xl
                                    bg-white/15
                                    border
                                    border-white/20
                                    flex
                                    items-center
                                    justify-center
                                "
              >

                <Sparkles size={22} />

              </div>

              <span className="text-purple-100 font-bold text-sm">
                حسابي
              </span>

            </div>


            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              أهلاً بيك في حسابك 👋
            </h1>


            <p className="mt-5 text-white/80 text-base md:text-lg leading-8 max-w-2xl">
              من هنا تقدر تدير بياناتك الشخصية،
              تتابع ملفك الصحي، طلباتك، والمنتجات المفضلة
              في مكان واحد.
            </p>

          </div>

        </div>


        {/* ==========================================
                    QUICK INFO
                ========================================== */}

        <div className="grid sm:grid-cols-2 gap-4 mt-6">

          <div
            className="
                            bg-white
                            border
                            border-gray-100
                            rounded-2xl
                            p-5
                            flex
                            items-center
                            gap-4
                            shadow-sm
                        "
          >

            <div
              className="
                                w-11
                                h-11
                                rounded-xl
                                bg-green-50
                                flex
                                items-center
                                justify-center
                            "
            >

              <ShieldCheck
                size={21}
                className="text-green-600"
              />

            </div>


            <div>

              <p className="font-bold text-gray-800">
                حسابك آمن
              </p>

              <p className="text-sm text-gray-500 mt-1">
                يمكنك إدارة كلمة المرور من الإعدادات
              </p>

            </div>

          </div>


          <div
            className="
                            bg-white
                            border
                            border-gray-100
                            rounded-2xl
                            p-5
                            flex
                            items-center
                            gap-4
                            shadow-sm
                        "
          >

            <div
              className="
                                w-11
                                h-11
                                rounded-xl
                                bg-purple-50
                                flex
                                items-center
                                justify-center
                            "
            >

              <User
                size={21}
                className="text-[#5B2A86]"
              />

            </div>


            <div>

              <p className="font-bold text-gray-800">
                إدارة الحساب
              </p>

              <p className="text-sm text-gray-500 mt-1">
                حدّث بياناتك الشخصية وقت ما تحب
              </p>

            </div>

          </div>

        </div>


        {/* ==========================================
                    SECTION TITLE
                ========================================== */}

        <div className="flex items-end justify-between mt-10 mb-6">

          <div>

            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              إدارة حسابك
            </h2>

            <p className="text-gray-500 mt-2">
              اختار القسم اللي عايز تديره
            </p>

          </div>

        </div>


        {/* ==========================================
                    CARDS
                ========================================== */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {cards.map((card) => {

            const Icon = card.icon;

            return (

              <Link
                key={card.to}
                to={card.to}
                className="
                                    group
                                    bg-white
                                    border
                                    border-gray-100
                                    rounded-3xl
                                    p-6
                                    shadow-sm
                                    hover:shadow-xl
                                    hover:-translate-y-1
                                    transition-all
                                    duration-300
                                "
              >

                <div className="flex items-start justify-between">

                  <div
                    className={`
                                            w-14
                                            h-14
                                            rounded-2xl
                                            ${card.iconBg}
                                            flex
                                            items-center
                                            justify-center
                                        `}
                  >

                    <Icon
                      size={26}
                      className={card.iconColor}
                    />

                  </div>


                  <div
                    className="
                                            w-9
                                            h-9
                                            rounded-xl
                                            bg-gray-50
                                            flex
                                            items-center
                                            justify-center
                                            text-gray-400
                                            group-hover:bg-purple-50
                                            group-hover:text-[#5B2A86]
                                            transition
                                        "
                  >

                    <ChevronLeft size={18} />

                  </div>

                </div>


                <h3 className="text-xl font-black text-gray-900 mt-6">
                  {card.title}
                </h3>


                <p className="text-gray-500 text-sm leading-7 mt-2 min-h-[50px]">
                  {card.desc}
                </p>


                <div
                  className="
                                        flex
                                        items-center
                                        gap-2
                                        mt-5
                                        text-[#5B2A86]
                                        font-bold
                                        text-sm
                                    "
                >

                  فتح القسم

                  <ChevronLeft
                    size={17}
                    className="
                                            group-hover:-translate-x-1
                                            transition
                                        "
                  />

                </div>

              </Link>

            );
          })}

        </div>


        {/* ==========================================
                    FOOTER NOTE
                ========================================== */}

        <div
          className="
                        mt-8
                        bg-purple-50
                        border
                        border-purple-100
                        rounded-2xl
                        px-5
                        py-4
                        text-center
                    "
        >

          <p className="text-sm text-purple-800">
            كل بياناتك وإعدادات حسابك متاحة من هنا بسهولة.
          </p>

        </div>

      </div>

    </div>
  );
}