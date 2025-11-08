"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type ProductType = {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  productDesc?: string;
  productCat: string;
  image?: string;
};

export default function ProductCategoryList() {
  const [groupedProducts, setGroupedProducts] = useState<
    Record<string, ProductType[]>
  >({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch products");
        const products: ProductType[] = await res.json();

        // Group by productCat
        const grouped = products.reduce((acc, product) => {
          const category = product.productCat || "Uncategorized";
          if (!acc[category]) acc[category] = [];
          acc[category].push(product);
          return acc;
        }, {} as Record<string, ProductType[]>);

        setGroupedProducts(grouped);
      } catch (err) {
        console.error("Error loading products:", err);
      }
    };

    fetchProducts();
  }, []);

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -140; // Adjust offset to account for sticky bar height
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-gray-50 py-6  ">
      {/* Sticky Category Bar */}
      <div className="sticky top-13 z-50 bg-white border-b border-gray-200 shadow-sm overflow-x-auto">
        <div className="flex gap-4 px-4 py-3 max-w-6xl mx-auto whitespace-nowrap">
          {Object.keys(groupedProducts).map((category) => (
            <button
              key={category}
              onClick={() => scrollToCategory(category)}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-[#d24a0f] hover:text-white transition text-sm font-medium"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-6xl mx-auto space-y-10 mt-8">
        {Object.entries(groupedProducts).map(([category, products]) => (
          <div key={category} id={category} className="scroll-mt-24">
            {/* Category Title */}
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
              {category}
              <span className="text-lg">🥗</span>
            </h2>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white flex items-center gap-4 rounded-2xl shadow-sm hover:shadow-md transition p-3"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {product.productDesc || "Delicious dish"}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#d24a0f]">
                      {product.discountPrice ? (
                        <>
                          <span className="line-through text-gray-400 mr-1">
                            {product.price}€
                          </span>
                          {product.discountPrice}€
                        </>
                      ) : (
                        `${product.price}€`
                      )}
                    </p>
                  </div>

                  {/* Add Button */}
                  <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-[#d24a0f] hover:text-white transition">
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
