export default function Footer() {
    return (
        <footer
            dir="rtl"
            className="mt-20 bg-slate-900 text-white"
        >
            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

                {/* MAIN FOOTER */}
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

                    {/* BRAND */}
                    <div>
                        <h2 className="text-2xl font-bold text-blue-400">
                            Rashed Smart Pharmacy
                        </h2>

                        <p className="mt-4 max-w-sm text-sm leading-8 text-gray-300">
                            نظام إدارة صيدلية ومتجر إلكتروني متكامل
                            لبيع الأدوية وإدارة المخزون والطلبات،
                            مع توفير تجربة سهلة وآمنة للعملاء.
                        </p>
                    </div>


                    {/* LINKS */}
                    <div>
                        <h3 className="text-lg font-bold text-white">
                            روابط سريعة
                        </h3>

                        <ul className="mt-5 space-y-3 text-sm text-gray-300">

                            <li>
                                <a
                                    href="/"
                                    className="transition hover:text-blue-400"
                                >
                                    الرئيسية
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/products"
                                    className="transition hover:text-blue-400"
                                >
                                    الأدوية
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/offers"
                                    className="transition hover:text-blue-400"
                                >
                                    العروض
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/contact"
                                    className="transition hover:text-blue-400"
                                >
                                    تواصل معنا
                                </a>
                            </li>

                        </ul>
                    </div>


                    {/* CUSTOMER SERVICE */}
                    <div>
                        <h3 className="text-lg font-bold text-white">
                            خدمة العملاء
                        </h3>

                        <ul className="mt-5 space-y-3 text-sm text-gray-300">

                            <li>
                                <a
                                    href="/faq"
                                    className="transition hover:text-blue-400"
                                >
                                    الأسئلة الشائعة
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/return-policy"
                                    className="transition hover:text-blue-400"
                                >
                                    سياسة الاسترجاع
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/privacy"
                                    className="transition hover:text-blue-400"
                                >
                                    سياسة الخصوصية
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/terms"
                                    className="transition hover:text-blue-400"
                                >
                                    الشروط والأحكام
                                </a>
                            </li>

                        </ul>
                    </div>


                    {/* CONTACT */}
                    <div>
                        <h3 className="text-lg font-bold text-white">
                            تواصل معنا
                        </h3>

                        <div className="mt-5 space-y-4 text-sm text-gray-300">

                            <a
                                href="tel:0114316063"
                                dir="ltr"
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    transition
                                    hover:text-blue-400
                                "
                            >
                                <span className="text-lg">
                                    📞
                                </span>

                                <span>
                                    0114316063
                                </span>
                            </a>


                            <a
                                href="mailto:info@smartpharmacy.com"
                                dir="ltr"
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    transition
                                    hover:text-blue-400
                                "
                            >
                                <span className="text-lg">
                                    📧
                                </span>

                                <span>
                                    info@smartpharmacy.com
                                </span>
                            </a>

                        </div>
                    </div>

                </div>


                {/* BOTTOM */}
                <div className="
                    mt-12
                    border-t
                    border-gray-700
                    pt-6
                    text-center
                    text-sm
                    text-gray-400
                ">
                    <p>
                        © 2026 Rashed Smart Pharmacy.
                        جميع الحقوق محفوظة.
                    </p>
                </div>

            </div>
        </footer>
    );
}