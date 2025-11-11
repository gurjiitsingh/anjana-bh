"use client";

import { useLanguage } from "@/store/LanguageContext";
import Products from "@/components/level-1/Products";
import HeroSectionCustomMenu from "@/custom/cus-components/HeroSectionCustomMenu";
import CategorySliderLight from "@/components/level-1/CategorySliderLight";

//import { TnewProductSchema } from '@/lib/types';
// import {  TnewProductSchema } from '@/lib/type/productType';

export default function Page() {
  // const products = await fetchProducts();

  const { lang } = useLanguage();

  if (!lang) {
    return (
      <div className="text-center p-4 text-gray-500">Loading language...</div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen px-3 md:px-0 pb-6 mt-3">
        {/* Foreground Content */}
        <div className="relative z-10">
          <HeroSectionCustomMenu />

          {/* Order Menu Button */}

          <CategorySliderLight />
          {/* <CategorySliderSm2 /> */}
          <Products />
          {/*      
          <ProductCategoryList /> */}
          {/* <ProductCategorySliderList /> */}
        </div>
      </div>
    </>
  );
}
