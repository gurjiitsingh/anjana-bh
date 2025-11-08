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
import { fetchCategoriesClient } from "@/lib/firestore/categoryClient";
import { categoryType } from "@/lib/types/categoryType";

const ListView = () => {
  const [categoryData, setCategoryData] = useState<categoryType[]>([]);

  useEffect(() => {
    async function fetchCategoriesList() {
      try {
        const categories = await fetchCategories();
        categories.sort((a, b) => a.sortOrder! - b.sortOrder!);
        setCategoryData(categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategoriesList();
  }, []);

  return (
    <div className="mt-6">
      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        🗂️ Categories
      </h3>

      <div className="rounded-2xl shadow-md border border-gray-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-zinc-800">
            <TableRow>
              <TableHead className="hidden md:table-cell text-sm text-gray-700 dark:text-gray-300">
                Image
              </TableHead>
              <TableHead className="hidden md:table-cell text-sm text-gray-700 dark:text-gray-300">
                Name
              </TableHead>
              <TableHead className="hidden md:table-cell text-sm text-gray-700 dark:text-gray-300">
                Active
              </TableHead>
              <TableHead className="text-sm text-gray-700 dark:text-gray-300">
                Description
              </TableHead>
              <TableHead className="hidden md:table-cell text-sm text-gray-700 dark:text-gray-300">
                Action
              </TableHead>
              <TableHead className="text-sm text-gray-700 dark:text-gray-300">
                Related Products
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categoryData.map((category) => (
              <TableRows key={category.name} category={category} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListView;
