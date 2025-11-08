import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    // Fetch only featured products, ordered by sortOrder
    const snapshot = await adminDb
      .collection("products")
      .where("isFeatured", "==", true)
     // .orderBy("sortOrder", "asc")
      .get();

    const featuredProducts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(featuredProducts, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      { error: "Failed to load featured products" },
      { status: 500 }
    );
  }
}
