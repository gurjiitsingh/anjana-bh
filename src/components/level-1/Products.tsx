"use client";

import { useEffect, useState } from "react";
import { UseSiteContext } from "@/SiteContext/SiteContext";
import dynamic from "next/dynamic";
import { ProductType } from "@/lib/types/productType";
import { addOnType } from "@/lib/types/addOnType";

// ✅ Dynamic card selection
let Card: React.ComponentType<any>;
const cardType = process.env.NEXT_PUBLIC_PRODUCT_CARD_TYPE;
switch (cardType) {
  case "1":
    Card = dynamic(() => import("../level-2/ProductCard-h1"));
    break;
  case "11":
    Card = dynamic(() => import("../level-2/ProductCard-h11"));
    break;
  case "21":
    Card = dynamic(() => import("../level-2/ProductCard-h21"));
    break;
  case "2":
    Card = dynamic(() => import("../level-2/ProductCard-v2"));
    break;
  case "3":
    Card = dynamic(() => import("../level-2/ProductCard-v3"));
    break;
  case "4":
    Card = dynamic(() => import("../level-2/ProductCard-v4"));
    break;
  case "5":
    Card = dynamic(() => import("../level-2/ProductCard-v5"));
    break;
  case "6":
    Card = dynamic(() => import("../level-2/ProductCard-h6"));
    break;
  case "7":
    Card = dynamic(() => import("../level-2/ProductCard-v7"));
    break;
  default:
    Card = dynamic(() => import("../level-2/ProductCard-h1"));
}

export default function Products() {
  const { productCategoryIdG, settings, setAllProduct, productToSearchQuery } =
    UseSiteContext();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [allProducts, setAllProductsLocal] = useState<ProductType[]>([]);
  const [addOns, setAddOns] = useState<addOnType[]>([]);
  const [categoryId, setCategoryId] = useState("");

  // ✅ Set initial category
  useEffect(() => {
    const fallbackCategory = settings.display_category as string;
    setCategoryId(productCategoryIdG || fallbackCategory || "");
  }, [settings, productCategoryIdG]);

  // ✅ Fetch from API only once (ZERO Firestore reads here)
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/initialData");
        const data = await res.json();

        const published = data.products.filter(
          (p: ProductType) => p.status === "published"
        );
        const sorted = published.sort(
          (a: ProductType, b: ProductType) =>
            (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
        );

        setAddOns(data.addons);
        setAllProductsLocal(sorted);
        setAllProduct(sorted); // context update

        // If category already selected
        if (categoryId) {
          setProducts(sorted.filter((p) => p.categoryId === categoryId));
        } else {
          setProducts(sorted);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    load();
  }, []);

  // ✅ Update when category changes (NO FIRESTORE)
  useEffect(() => {
    if (!categoryId) {
      setProducts(allProducts);
      return;
    }
    setProducts(allProducts.filter((p) => p.categoryId === categoryId));
  }, [categoryId, allProducts]);

  // ✅ Local search (NO FIRESTORE)
  useEffect(() => {
    if (productToSearchQuery === "") {
      setProducts(allProducts);
      return;
    }

    setProducts(
      allProducts.filter((p) =>
        p.name.toLowerCase().includes(productToSearchQuery.toLowerCase())
      )
    );
  }, [productToSearchQuery]);

  // ✅ UI Layout Logic
  let containerClass = "";
  switch (cardType) {
    case "1":
      containerClass = "flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-5";
      break;
    case "11":
      containerClass = "flex flex-col md:flex-row md:flex-wrap gap-0 md:gap-0";
      break;
    case "2":
    case "3":
      containerClass =
        "flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-5 justify-center";
      break;
    case "4":
      containerClass = "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3";
      break;
    case "5":
      containerClass = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3";
      break;
    case "6":
      containerClass = "flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-5";
      break;
    case "7":
      containerClass = "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3";
      break;
    default:
      containerClass = "flex flex-col md:flex-row md:flex-wrap gap-3 md:gap-5";
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
