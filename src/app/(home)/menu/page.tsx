"use client";


//import CategorySlider from "@/components/level-1/CategorySlider";
import CategorySliderSm2 from "@/components/level-1/CategorySliderSm2";
import { useLanguage } from "@/store/LanguageContext";
import Hero from "@/custom/cus-components/Hero";
import Products from "@/components/level-1/Products";
import ProductCategoryList from "@/components/level-1/ProductCategoryList";
import ProductCategorySliderList from "@/components/level-1/ProductCategorySliderList";


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
          <div className="container mx-auto">
            <Hero />

            {/* Order Menu Button */}
          
          </div>

          <CategorySliderSm2 />
     
          <ProductCategoryList />
          <ProductCategorySliderList />
          <Products />
        </div>
      </div>
    </>
  );
}
