"use client";

import Image from "next/image";
import { FaThumbsUp, FaShieldAlt, FaSmile } from "react-icons/fa";
import { Chicle, Ultra, Lobster, Lato } from "next/font/google";
import Link from "next/link";

const chicle = Lobster({
  subsets: ["latin"],
  weight: "400",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function HeroSectionCustomMenu() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image (Top Section) */}
      <div className="relative w-full h-[50vh] md:h-[90vh] flex items-center justify-center">
        <Image
          src="/images/29.jpg" // Replace with your image path
          alt="Restaurant background"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 md:bg-black/0 " />

        {/* Logo only over image on mobile */}
        {/* <div className="absolute  bottom-[13rem] md:bottom-auto md:left-20 md:top-40 flex justify-center md:justify-start z-20">
          <div
            className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center shadow-lg"
            data-aos="fade-right"
          >
            <img
              src="/logo-10.webp"
              alt="Logo"
              className="w-20 h-20 md:w-24 md:h-24 object-contain"
            />
          </div>
        </div> */}

        {/* Curved white bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-10  rounded-t-[50%]" />
      </div>

      {/* Text + Buttons Section (below image on mobile, overlay on desktop) */}
      <div className="relative bg-white md:bg-transparent md:absolute md:inset-0 md:flex md:items-center md:px-20 md:justify-start mt-0 md:mt-0">
        <div className="w-full flex justify-center md:justify-end">
          <div className="text-[#2b2b2b] md:text-white max-w-2xl px-6 pb-6  mt-[-60px] md:mt-0 md:p-0  text-left md:text-left">
            {/* Tagline */}
      <p className="text-[#ff7519]  text-lg font-semibold uppercase tracking-wide">
        Crafting Traditions in Every Bite
      </p>
            {/* Title */}
            <h2
              className={`${chicle.className} text-6xl md:text-[90px] my-3 text-black md:text-black`}
            >
              Anjana Bhog UK
            </h2>

            {/* Features */}
   

            {/* Buttons */}
           
          </div>
        </div>
      </div>
    </section>
  );
}
