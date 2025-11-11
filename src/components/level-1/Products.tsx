"use client";

import { useEffect, useState, useMemo } from "react";
import { UseSiteContext } from "@/SiteContext/SiteContext";
import dynamic from "next/dynamic";
import { ProductType } from "@/lib/types/productType";
import { addOnType } from "@/lib/types/addOnType";

export default function Products() {
  const { productCategoryIdG, settings, setAllProduct, productToSearchQuery } =
    UseSiteContext();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [allProducts, setAllProductsLocal] = useState<ProductType[]>([]);
  const [addOns, setAddOns] = useState<addOnType[]>([]);
  const [categoryId, setCategoryId] = useState("");

  const cardType = process.env.NEXT_PUBLIC_PRODUCT_CARD_TYPE;

  // ✅ DYNAMIC IMPORT — SAFE, NO RERENDER LOOP
  const Card = useMemo(() => {
    switch (cardType) {
      case "1":
        return dynamic(() => import("../level-2/ProductCard-h1"));
      case "11":
        return dynamic(() => import("../level-2/ProductCard-h11"));
      case "21":
        return dynamic(() => import("../level-2/ProductCard-h21"));
      case "2":
        return dynamic(() => import("../level-2/ProductCard-v2"));
      case "3":
        return dynamic(() => import("../level-2/ProductCard-v3"));
      case "4":
        return dynamic(() => import("../level-2/ProductCard-v4"));
      case "5":
        return dynamic(() => import("../level-2/ProductCard-v5"));
      case "6":
        return dynamic(() => import("../level-2/ProductCard-h6"));
      case "7":
        return dynamic(() => import("../level-2/ProductCard-v7"));
      default:
        return dynamic(() => import("../level-2/ProductCard-h1"));
    }
  }, [cardType]);

  // ✅ Set initial category (runs only when settings OR global id changes)
  useEffect(() => {
    const fallback = settings.display_category as string;
    setCategoryId(productCategoryIdG || fallback || "");
  }, [settings, productCategoryIdG]);

  // ✅ Fetch ONCE (no remount loop now)
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        console.log("Fetched products ✅");

        const published = data.filter((p: ProductType) => p.status === "published");

        const sorted = published.sort(
          (a: ProductType, b: ProductType) =>
            (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
        );

        if (!isMounted) return;

        setAllProductsLocal(sorted);
        setAllProduct(sorted); // ✅ context update (won’t remount now)
        setAddOns(data);

        setProducts(
          categoryId
            ? sorted.filter((p) => p.categoryId === categoryId)
            : sorted
        );
      } catch (err) {
        console.error("Error loading products:", err);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []); // ✅ runs ONCE ONLY

  // ✅ Category filter
  useEffect(() => {
    if (!categoryId) {
      setProducts(allProducts);
      return;
    }
    setProducts(allProducts.filter((p) => p.categoryId === categoryId));
  }, [categoryId, allProducts]);

  // ✅ Search filter
  useEffect(() => {
    if (!productToSearchQuery) {
      setProducts(allProducts);
      return;
    }

    setProducts(
      allProducts.filter((p) =>
        p.name.toLowerCase().includes(productToSearchQuery.toLowerCase())
      )
    );
  }, [productToSearchQuery]);

  // ✅ Layout logic (unchanged)
  let containerClass = "";
  switch (cardType) {
    case "1":
      containerClass =
        "flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-5";
      break;
    case "11":
      containerClass =
        "flex flex-col md:flex-row md:flex-wrap gap-0 md:gap-0";
      break;
    case "2":
    case "3":
      containerClass =
        "flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-5 justify-center";
      break;
    case "4":
      containerClass =
        "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3";
      break;
    case "5":
      containerClass =
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3";
      break;
    case "6":
      containerClass =
        "flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-5";
      break;
    case "7":
      containerClass =
        "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3";
      break;
    default:
      containerClass =
        "flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-5";
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className={containerClass}>
        {products.map((product, i) => (
          <Card
            key={product.id ?? `${product.name}-${i}`}
            product={product}
            allAddOns={addOns}
          />
        ))}
      </div>
    </div>
  );
}
