import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

import HeroSection from "../../components/store/home/HeroSection";
import SearchSection from "../../components/store/home/SearchSection";
import PrescriptionAISection from "../../components/store/home/PrescriptionAISection";
import CategoriesSection from "../../components/store/home/CategoriesSection";
import BestSellerSection from "../../components/store/home/BestSellerSection";
import WhyUsSection from "../../components/store/home/WhyUsSection";
import PatientRegisterSection from "../../components/store/home/PatientRegisterSection";

function Home() {
    const location = useLocation();
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const targetId = location.state?.scrollTo;
        if (!targetId) return;

        const element = document.getElementById(targetId);
        if (!element) return;

        setTimeout(() => {
            const rect = element.getBoundingClientRect();
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // 🔥 قيمة كبيرة عشان القسم يظهر في نص الشاشة (مسافة كبيرة تحت النافبار)
            // --------------------------------------------
            // 0.4 = يظهر تحت النافبار بمسافة كبيرة (نص الشاشة تقريباً)
            // 0.5 = بالضبط في منتصف الشاشة
            // 0.6 = تحت النص بشوية
            const positionRatio = 0.00099; // <--- زود الرقم عشان ينزل تحت أكثر
            // --------------------------------------------
            
            const targetPosition = 
                rect.top + scrollY - (windowHeight * positionRatio) + (rect.height / 2);

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        }, 400);
    }, [location]);

    return (
        <div className="bg-gray-50">
            <HeroSection />
            <SearchSection />
            <PrescriptionAISection />
            <PatientRegisterSection />
            
            <div id="offers">
                <CategoriesSection />
            </div>
            
            <BestSellerSection />
            
            <div id="about">
                <WhyUsSection />
            </div>
        </div>
    );
}

export default Home;