"use client";

import { useEffect, useRef, useState } from "react";
import { fetchCategories } from "@/app/(universal)/action/category/dbOperations";
import { UseSiteContext } from "@/SiteContext/SiteContext";
import {
  FaStar,
  FaFireAlt,
  FaLeaf,
  FaHeart,
  FaSmile,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Playfair_Display, Quicksand } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function CategoryScrollSnap() {
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const { setProductCategoryIdG, setDisablePickupCatDiscountIds } =
    UseSiteContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await fetchCategories();
        categories.sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder));
       const featured = categories.filter((c) => c.isFeatured !== false);

        
        setCategoryData(featured);

        const disablePickupCategoryIds = categories
          .filter((c) => c.disablePickupDiscount === true)
          .map((c) => c.id);
        setDisablePickupCatDiscountIds(disablePickupCategoryIds);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchData();
  }, [setDisablePickupCatDiscountIds]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-[#fdf4ec] py-12 relative overflow-hidden select-none">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className={`${playfair.className} text-3xl md:text-4xl font-extrabold text-[#2B2E4A] uppercase flex items-center justify-center gap-2`}
          >
            <FaStar className="text-[#d24a0f]" /> Best of the Month
          </h2>
          <p className="text-[#d24a0f] text-sm mt-2">
            Die meistbestellten Gerichte der letzten 30 Tage
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Fast alle Gerichte mit: <span className="font-semibold">Reis</span>
          </p>
        </div>

        {/* Arrows */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[#2B2E4A] text-white p-3 rounded-full hover:bg-[#d24a0f] transition"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[#2B2E4A] text-white p-3 rounded-full hover:bg-[#d24a0f] transition"
        >
          <FaChevronRight />
        </button>

        {/* Scroll Snap Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-hidden pb-6 scroll-smooth snap-x snap-mandatory"
        >
          {categoryData.length > 0
            ? categoryData.map((category) => (
                <div
                  key={category.id}
                  className="min-w-[280px] sm:min-w-[300px] md:min-w-[320px] flex-shrink-0 snap-center"
                >
                  <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-md transition p-4 h-full">
                    {/* Discount Badge */}
                    <div className="absolute top-2 right-2 bg-[#8b0000] text-white text-xs px-2 py-1 rounded-md font-semibold">
                      -5%
                    </div>

                    {/* Product Info */}
                    <button
                      onClick={() => setProductCategoryIdG(category.id)}
                      className="text-left w-full"
                    >
                      <h3
                        className={`${quicksand.className} text-lg font-extrabold text-[#2B2E4A] mb-1`}
                      >
                        {category.name || "74 Chicken Tikka Masala"}
                      </h3>

                      <p className="italic text-gray-500 text-sm mb-1">
                        Empfehlung vom Chefkoch
                      </p>

                      <div className="flex items-center gap-2 text-[#d24a0f] text-xs mb-1">
                        <FaFireAlt /> <FaLeaf /> <span>🌶️</span>
                      </div>

                      <p className="text-gray-700 text-sm leading-snug mb-2">
                        Tandoori-Hähnchenfiletstücke, Tomaten, Knoblauch, Rote
                        Currysauce
                      </p>

                      {/* Price */}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="line-through text-gray-400">
                          18,90€
                        </span>
                        <span className="text-[#d24a0f] font-semibold">
                          17,96€
                        </span>
                      </div>

                      {/* Emojis / Reactions */}
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-gray-600">
                          <FaHeart className="text-[#d24a0f]" /> 41
                        </span>
                        <span className="flex items-center gap-1 text-gray-600">
                          <FaSmile className="text-[#d24a0f]" /> 13
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              ))
            : [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-[280px] sm:min-w-[300px] md:min-w-[320px] flex-shrink-0 snap-center bg-white rounded-2xl shadow-sm animate-pulse p-6"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
