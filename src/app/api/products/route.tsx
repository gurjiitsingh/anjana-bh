// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { fetchProducts } from "@/app/(universal)/action/products/dbOperation";

export async function GET() {
  try {
    const products = await fetchProducts();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}