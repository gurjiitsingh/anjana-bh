"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import TableRows from "./TableRows";

import { fetchCategories } from "@/app/(universal)/action/category/dbOperations";
import { ProductType } from "@/lib/types/productType";
import { categoryType } from "@/lib/types/categoryType";
import { useSearchParams } from "next/navigation";
import {
  fetchProductByCategoryId,
  fetchProducts,
} from "@/app/(universal)/action/products/dbOperation";

const ListView = ({ title }: { title?: string }) => {
  const searchParams = useSearchParams();
  const productIdFromQuery = searchParams.get("productId");

  const [productData, setProductData] = useState<ProductType[]>([]);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [categoryData, setCategoryData] = useState<categoryType[]>([]);
  const [cateId, setCateId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const categories = await fetchCategories();
        categories.sort((a, b) => a.sortOrder! - b.sortOrder!);
        setCategoryData(categories);

        const allProds = await fetchProducts();
        allProds.sort((a, b) => a.sortOrder - b.sortOrder);
        setAllProducts(allProds);

        if (productIdFromQuery) {
          const matched = allProds.find((p) => p.id === productIdFromQuery);
          setProductData(matched ? [matched] : []);
        } else {
          setProductData(allProds);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchInitialData();
  }, [productIdFromQuery]);

  useEffect(() => {
    async function fetchProductsByCategory() {
      try {
        if (cateId === "") {
          setProductData(allProducts);
        } else {
          const filteredProds = await fetchProductByCategoryId(cateId);
          filteredProds.sort((a, b) => a.sortOrder - b.sortOrder);
          setProductData(filteredProds);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchProductsByCategory();
  }, [cateId, allProducts]);

  const filteredProducts = productData.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-2">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium mb-1">
            Select Category
          </label>
          <select
            value={cateId}
            onChange={(e) => {
              setCateId(e.target.value);
              setSearchTerm("");
            }}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All</option>
            {categoryData.map((cate) => (
              <option key={cate.id} value={cate.id}>
                {cate.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      <h3 className="text-2xl mb-4 font-semibold">{title || "Products"}</h3>
      <div className="bg-slate-50 rounded-lg p-1 overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-zinc-800">
            <TableRow>
              <TableHead className="hidden md:table-cell">Image</TableHead>
              <TableHead className="hidden md:table-cell">Name</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">
                Discount Price
              </TableHead>
              <TableHead className="hidden md:table-cell">Quantity</TableHead>

              {/* ✅ New GST Column */}
              <TableHead className="hidden md:table-cell">GST %</TableHead>

              <TableHead>Status</TableHead>
              <TableHead>Desc</TableHead>
              <TableHead className="hidden md:table-cell">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProducts.map((product) => (
              <TableRows key={product.id} product={product} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListView;
