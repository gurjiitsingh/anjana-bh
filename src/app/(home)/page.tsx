// app/page.tsx
"use client";
import AOS from "aos";
import "aos/dist/aos.css";

import { useEffect } from "react";
import ContactInfo from "@/custom/cus-components/ContactInfo";
import QuoteBanner from "@/custom/cus-components/QuoteBanner";
import Catering from "@/custom/cus-components/Catering";
import BestOfMonth from "@/custom/cus-components/BestOfMonth";
import SlidersByCatId from "@/custom/cus-components/SlidersByCatId";
import DiscountSection from "@/custom/cus-components/DiscountSection";
import WelcomeBanner from "@/custom/cus-components/WelcomeBanner";
import HeroSectionCustom from "@/custom/cus-components/HeroSectionCustom";
import BuffetCard from "@/custom/cus-components/BuffetCard";
import LunchDiscountCard from "@/custom/cus-components/LunchDiscountCard";
import TableReservationCard from "@/custom/cus-components/TableReservationCard";

// import MenuPreview from "@/components/MenuPreview";
// import Contact from "@/components/Contact";
// import Footer from "@/components/Footer";

export default function Page() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <main className=" text-gray-900 font-sans">
      {/* <FlavorLine /> */}
      {/* <HeroSection /> */}
      <HeroSectionCustom />
      {/* <DiscountSectionSingle /> */}
      {/* <DiscountSection /> */}
      {/* <WelcomeBanner /> */}
      <BestOfMonth />
      {/* <div className="max-w-7xl flex flex-col mx-auto  md:flex-row gap-4">
        <div className="max-w-full mx-2 md:mx-0 md:w-[60%]">
          <LunchDiscountCard />
        </div>
        <div className="max-w-full mx-2 md:mx-0 md:w-[40%]">
          <TableReservationCard />
        </div>
      </div> */}
      <SlidersByCatId />

      {/* <SpecialRecommendations /> */}
      {/* <About /> */}
      {/* <MasalaFlyer /> */}
      {/* <BuffetCard /> */}
      {/* <FlyerBuffet /> */}

      {/* <QuoteBanner />
      <Catering /> */}
      <ContactInfo />
      {/* <MenuPreview /> */}
      {/* <Contact />*/}
    
    </main>
  );
}
