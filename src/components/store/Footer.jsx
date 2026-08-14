export default function Footer() {

    return (

        <footer className="bg-slate-900 text-white mt-20">

            <div className="max-w-7xl mx-auto px-8 py-14">

                <div className="grid md:grid-cols-4 gap-10">

                    <div>

                        <h2 className="text-2xl font-bold text-blue-400">

                            Rashed Smart Pharmacy

                        </h2>

                        <p className="mt-4 text-gray-300 leading-8">

                            نظام إدارة صيدلية ومتجر إلكتروني متكامل
                            لبيع الأدوية وإدارة المخزون والطلبات.

                        </p>

                    </div>

                    <div>

                        <h3 className="font-bold text-lg">

                            روابط

                        </h3>

                        <ul className="space-y-3 mt-5 text-gray-300">

                            <li>الرئيسية</li>

                            <li>الأدوية</li>

                            <li>العروض</li>

                            <li>تواصل معنا</li>

                        </ul>

                    </div>

                    <div>

                        <h3 className="font-bold text-lg">

                            خدمة العملاء

                        </h3>

                        <ul className="space-y-3 mt-5 text-gray-300">

                            <li>الأسئلة الشائعة</li>

                            <li>سياسة الاسترجاع</li>

                            <li>سياسة الخصوصية</li>

                            <li>الشروط والأحكام</li>

                        </ul>

                    </div>

                    <div>

                        <h3 className="font-bold text-lg">

                            تواصل معنا

                        </h3>

                        <p className="mt-5 text-gray-300">

                            📞 01000000000

                        </p>

                        <p className="mt-3 text-gray-300">

                            📧 info@smartpharmacy.com

                        </p>

                    </div>

                </div>

                <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">

                    © 2026 Rashed Smart Pharmacy. جميع الحقوق محفوظة.

                </div>

            </div>

        </footer>

    );

}