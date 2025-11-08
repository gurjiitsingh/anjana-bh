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

export default function HeroSectionCustom() {
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
    <div className="text-[#2b2b2b] md:text-white max-w-2xl px-6 pb-6 mt-[-60px] md:mt-0 md:p-0 text-left md:text-left">
      
      {/* Tagline */}
      <p className="text-[#ff7519] md:text-white text-lg font-semibold uppercase tracking-wide">
        Crafting Traditions in Every Bite
      </p>

      {/* Title */}
      <h2
        className={`${chicle.className} text-6xl md:text-[90px] my-3 text-black md:text-black`}
      >
        Anjana Bhog Sweets
      </h2>

      {/* Subtitle */}
      <p className="text-[16px] md:text-lg text-[#555] md:text-white mb-4">
        From the heart of our kitchen to your celebrations — taste the purity,
        freshness, and love in every sweet we make.
      </p>

      {/* Features */}
      <ul className="space-y-2 text-base text-[12px] text-center md:text-left">
        <li className="flex items-center justify-center md:justify-start gap-2 text-[#c36b1e] md:text-white">
          <FaThumbsUp className="text-[#c36b1e] md:text-white" />
          100% Freshly Made Every Day
        </li>
        <li className="flex items-center justify-center md:justify-start gap-2 text-center md:text-left text-[#c36b1e] md:text-white">
          <FaShieldAlt className="text-[#c36b1e] md:text-white" />
          Pure Ingredients · No Preservatives
        </li>
        <li className="flex items-center justify-center md:justify-start gap-2 text-center md:text-left text-[#c36b1e] md:text-white">
          <FaSmile className="text-[#c36b1e] md:text-white" />
          Loved by{" "}
          <a
            href="#"
            className="underline text-[#c36b1e] md:text-white hover:text-green-400"
          >
            1000+ Happy Customers
          </a>
        </li>
      </ul>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row justify-start gap-4 pt-6">
        <Link
          href="/menu"
          rel="noopener noreferrer"
          data-aos="fade-left"
          className={`${lato.className} bg-[#ff7519] hover:bg-[#611616] text-2xl text-white font-semibold px-6 py-1 rounded-xl transition text-center tracking-wide`}
        >
          ORDER SWEETS
        </Link>

        <Link
          href="/#contact"
          rel="noopener noreferrer"
          className={`${lato.className} bg-white text-[#ff7519] text-2xl font-bold px-6 py-1 rounded-xl border-1 border-[#ff7519] hover:bg-[#7a1f1f] hover:text-white transition text-center`}
        >
          CONTACT US
        </Link>
      </div>
    </div>
  </div>
</div>


    </section>
  );
}
