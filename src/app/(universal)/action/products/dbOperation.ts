"use server";


import { formatPriceStringToNumber } from "@/utils/formatters";

import { adminDb } from "@/lib/firebaseAdmin";
import {  ProductType } from "@/lib/types/productType";

import { newPorductSchema, editPorductSchema } from "@/lib/types/productType";

//import { z } from "zod";
import { deleteImage, upload } from "@/lib/cloudinary";

//import { product } from "@/--------db/schema";
// import { Weight } from "lucide-react";
// import { revalidatePath } from "next/cache";





//productT,productTs, productTsArr, TproductSchemaArr

//from "@/lib/firestore/products/write";

import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';




export async function deleteProduct(id: string, oldImageUrl: string) {

  const docRef = adminDb.collection("products").doc(id);

  try {
    await docRef.delete();
    console.log("Product deleted from Firestore:", id);

    if (oldImageUrl !== "/com.jpg") {
      const imagePublicId = oldImageUrl.split("/").slice(-2).join("/").split(".")[0];
      try {
        await deleteImage(imagePublicId);
        console.log("Image deleted");
      } catch (error) {
        console.error("Error deleting image:", error);
        return { errors: "Product deleted, but failed to delete image." };
      }
    }

    return { message: "Product and image deleted successfully." };
  } catch (error) {
    console.error("Error deleting product from Firestore:", error);
    return { errors: "Failed to delete product." };
  }
}







//* addition */

export async function fetchAllProducts(): Promise<ProductType[]> {
  const snapshot = await adminDb.collection("products").get();
  const data: ProductType[] = [];

  snapshot.forEach((doc) => {
    const product = { id: doc.id, ...doc.data() } as ProductType;
    data.push(product);
  });

  return data;
}


export async function uploadImage(formData: FormData) {
  console.log("formdata-----", formData);

  let featured_img: boolean = false;
  if (formData.get("isFeatured") === "ture") {
    featured_img = true;
  }

  const name = formData.get("name");
  const price = formData.get("price");
  const discountPrice = formData.get("discountPrice");
  const sortOrder = formData.get("sortOrder") as string;
  const categoryId = formData.get("categoryId");
  const productDesc = formData.get("productDesc");
  const image = formData.get("image"); // type: File or string
  const isFeatured = featured_img;

  let imageUrl: string | null = null;

  if (image && typeof image !== 'string') {
    const file = image as File;

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || '.jpg';
      const fileName = `${Date.now()}-${randomUUID()}${ext}`;
      const tempDir = path.join(process.cwd(), 'public', 'temp');
      const savePath = path.join(tempDir, fileName);

      // Ensure /public/temp exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      fs.writeFileSync(savePath, buffer);
      imageUrl = `/temp/${fileName}`;
      console.log('Image saved to:', imageUrl);
    } catch (err) {
      console.error('Failed to save image:', err);
      return { error: 'Image upload failed' };
    }
  } else if (image === '0') {
    imageUrl = '/com.jpg'; // default fallback
  }

  // You can now use `imageUrl` to save in Firestore or return it
  return {
    message: 'Image processed successfully',
    imageUrl,
    name,
    price,
    discountPrice,
    sortOrder,
    categoryId,
    productDesc,
    isFeatured,
  };
}



export async function addNewProduct(formData: FormData) {
  try {
    const featured_img = formData.get("isFeatured") === "true";
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const discountPrice = formData.get("discountPrice") as string;
    const sortOrder = formData.get("sortOrder") as string;
    const categoryId = formData.get("categoryId") as string;
    const productDesc = formData.get("productDesc") as string;
    const image = formData.get("image");
    const status = formData.get("status") as "published" | "draft" | "out_of_stock";
    const stockQtyRaw = formData.get("stockQty") as string | null;

    // ✅ New tax fields
    const taxRateRaw = formData.get("taxRate") as string | null; // e.g. "5", "12", "18"
    const taxType = (formData.get("taxType") as string | null) || "GST"; // default to GST if empty

    const stockQty = stockQtyRaw ? parseInt(stockQtyRaw, 10) : null;
    const priceF = parseFloat(price.replace(/,/g, ".")) || 0;
    const discountPriceF = parseFloat(discountPrice.replace(/,/g, ".")) || 0;
    const sortOrderN = parseInt(sortOrder || "0", 10);
    const taxRate = taxRateRaw ? parseFloat(taxRateRaw) : null;

    const receivedData = {
      name,
      price: priceF,
      discountPrice: discountPriceF,
      stockQty,
      sortOrder: sortOrderN,
      categoryId,
      productDesc,
      image,
      isFeatured: featured_img,
      status,
      taxRate,
      taxType,
    };

    // ✅ Validate with Zod schema
    const result = newPorductSchema.safeParse(receivedData);
    if (!result.success) {
      const zodErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        zodErrors[issue.path[0]] = issue.message;
      });
      return { errors: zodErrors };
    }

    // ✅ Upload image if exists
    let imageUrl = "/com.jpg";
    if (image && image !== "0") {
      try {
        imageUrl = await upload(image);
      } catch (error) {
        console.error("❌ Image upload failed:", error);
        return { errors: { image: "Image upload failed" } };
      }
    }

    // 🔹 Fetch category name for productCat
  let productCat = "Uncategorized";
  try {
    const categories = await fetchCategories();
    const matchedCategory = categories.find((cat) => cat.id === categoryId);
    if (matchedCategory) {
      productCat = matchedCategory.name;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
    // ✅ Prepare Firestore document data
    const data = {
      name,
      price: priceF,
      discountPrice: discountPriceF,
      stockQty,
      sortOrder: sortOrderN,
      categoryId,
      productCat,
      productDesc,
      image: image ? imageUrl : null,
      isFeatured: featured_img,
      flavors: false,
      status,
      baseProductId: "",
      purchaseSession: null,
      quantity: null,
      taxRate: taxRate ?? null, // ✅ Save tax rate
      taxType: taxType ?? "GST", // ✅ Save tax type
      createdAt: new Date().toISOString(),
    };

    console.log("data---------------",data)

    // ✅ Save to Firestore
    const docRef = await adminDb.collection("products").add(data);
    return { success: true, message: "Product saved successfully", id: docRef.id };

  } catch (error) {
    console.error("❌ Firestore add failed:", error);
    return { errors: { general: "Could not save product" } };
  }
}







const stockQtyS = "4";
export async function addNewProduct_oldworking(formData: FormData) {
  console.log("formdata-----", formData);

  const featured_img = formData.get("isFeatured") === "ture";
  const name = formData.get("name");
  const price = formData.get("price");
  const discountPrice = formData.get("discountPrice");
  const sortOrder = formData.get("sortOrder") as string;
  const categoryId = formData.get("categoryId");
  const productDesc = formData.get("productDesc");
  const image = formData.get("image");
  const isFeatured = featured_img;
  const status = formData.get("status");

  const receivedData = {
    name,
    price,
    discountPrice,
    sortOrder,
    categoryId,
    productDesc,
    image,
    isFeatured,
  };

  const result = newPorductSchema.safeParse(receivedData);

  let zodErrors = {};
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });

    return Object.keys(zodErrors).length > 0
      ? { errors: zodErrors }
      : { success: true };
  }

  let imageUrl;
  if (image === "0") {
    imageUrl = "/com.jpg";
  } else {
    try {
      imageUrl = await upload(image);
      console.log(imageUrl);
    } catch (error) {
      console.log(error);
      return { errors: "image cannot uploaded" };
    }
  }

  const priceValue = formData.get("price") as string;
  const priceV = parseFloat(priceValue.replace(/,/g, ".")).toFixed(2);
  const priceF = new Number(parseFloat(priceV)).toFixed(2);

  const discountPriceValue = formData.get("discountPrice") as string;
  const discountPriceValueV = parseFloat(discountPriceValue.replace(/,/g, ".")).toFixed(2);
  const discountPriceValueF = new Number(parseFloat(discountPriceValueV)).toFixed(2);

  const sortOrderN = parseInt(sortOrder) as number;

  const data = {
    name,
    price: priceF,
    discountPrice: discountPriceValueF,
    stockQty:stockQtyS,
    flavors: false,
    sortOrder: sortOrderN,
    categoryId,
    productDesc,
    image: imageUrl,
    isFeatured,
    status
  };

  try {
    const docRef = await adminDb.collection("products").add(data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
    return { errors: "Could not save product" };
  }

  return { message: "Product saved" };
}





import { fetchCategories } from "@/app/(universal)/action/category/dbOperations";

export async function editProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name");
  const priceRaw = formData.get("price") as string;
  const discountPriceRaw = formData.get("discountPrice") as string;
  const stockQtyS = formData.get("stockQty") as string;
  const sortOrderRaw = formData.get("sortOrder") as string;
  let categoryId = formData.get("categoryId") as string;
  const productDesc = formData.get("productDesc");
  const oldImageUrl = formData.get("oldImgageUrl") as string;
  const image = formData.get("image");
  const status = formData.get("status") || "published";

  // ✅ isFeatured now correctly handled
  const isFeaturedRaw = formData.get("isFeatured");
  const isFeatured =
    isFeaturedRaw === null
      ? undefined // means: not sent → don’t overwrite
      : isFeaturedRaw === "true";

  // ✅ GST / tax fields
  const taxRateRaw = formData.get("taxRate") as string | null;
  const taxType = (formData.get("taxType") as string | null) ?? null;

  // ✅ Validate received data
  const receivedData = {
    name,
    price: priceRaw,
    discountPrice: discountPriceRaw,
    stockQty: stockQtyS,
    sortOrder: sortOrderRaw,
    categoryId,
    productDesc,
    image,
    status,
  };

  const result = editPorductSchema.safeParse(receivedData);
  if (!result.success) {
    const zodErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      zodErrors[issue.path[0]] = issue.message;
    });
    return { errors: zodErrors };
  }

  // 🔹 Fetch existing product
  const productRef = adminDb.collection("products").doc(id);
  const productSnap = await productRef.get();
  if (!productSnap.exists) {
    return { errors: "Product not found" };
  }

  const existingProduct = productSnap.data();

  // 🔸 Handle image upload
  let imageUrl = oldImageUrl;
  if (image && image !== "undefined") {
    try {
      imageUrl = await upload(image);
    } catch (error) {
      console.error("Image upload failed:", error);
      return { errors: "Image could not be uploaded" };
    }
  } else {
    imageUrl = existingProduct?.image || oldImageUrl;
  }

  // 🔸 Handle category (keep same if not changed)
  if (categoryId === "0" || !categoryId) {
    categoryId = existingProduct?.categoryId || "";
  }

  // 🔹 Fetch category name
  let productCat = "Uncategorized";
  try {
    const categories = await fetchCategories();
    const matchedCategory = categories.find((cat) => cat.id === categoryId);
    if (matchedCategory) productCat = matchedCategory.name;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // 🔸 Format numbers
  const formatPrice = (val: string): string =>
    Number(parseFloat(val.replace(/,/g, ".")).toFixed(2)).toFixed(2);

  const price = formatPrice(priceRaw);
  const discountPrice = discountPriceRaw ? formatPrice(discountPriceRaw) : "0.00";
  const sortOrder = parseInt(sortOrderRaw);

  // ✅ Convert taxRate safely
  const taxRate = taxRateRaw ? parseFloat(taxRateRaw) || null : null;

  // ✅ Build update data
  const productData: Record<string, any> = {
    name,
    price,
    discountPrice,
    stockQty: Number(stockQtyS),
    flavors: existingProduct?.flavors ?? false,
    sortOrder,
    categoryId,
    productCat,
    productDesc,
    image: imageUrl,
    status,
    updatedAt: new Date().toISOString(),
    taxRate,
    taxType: taxType ?? existingProduct?.taxType ?? null,
  };

  // ✅ Only overwrite isFeatured if explicitly sent
  if (typeof isFeatured !== "undefined") {
    productData.isFeatured = isFeatured;
  } else {
    productData.isFeatured = existingProduct?.isFeatured ?? false;
  }

  try {
    await productRef.update(productData);
    return { message: "✅ Product updated successfully" };
  } catch (error) {
    console.error("❌ Failed to update product:", error);
    return { errors: "Failed to update product" };
  }
}










export async function fetchProductById(id: string): Promise<ProductType | null> {
  try {
    const docSnap = await adminDb.collection("products").doc(id).get();

    if (!docSnap.exists) {
      console.warn(`No product found with ID: ${id}`);
      return null;
    }

    const data = docSnap.data();
    console.log("data.taxRate----------------------", data?.taxRate)

    const product: ProductType = {
      id: docSnap.id,
      name: data?.name ?? "",
      price: data?.price ?? 0,
      stockQty: data?.stockQty ?? 0,
      discountPrice: data?.discountPrice ?? undefined,
      categoryId: data?.categoryId ?? "",
      productCat: data?.productCat ?? undefined,
      baseProductId: data?.baseProductId ?? "",
      productDesc: data?.productDesc ?? "",
      sortOrder: data?.sortOrder ?? 0,
      image: data?.image ?? "",
      isFeatured: data?.isFeatured ?? false,
      purchaseSession: data?.purchaseSession ?? null,
      quantity: data?.quantity ?? null,
      flavors: data?.flavors ?? false,
      status: data?.status ?? "draft",

      // ✅ New GST / Tax Fields (safe fallbacks)
      taxRate: data?.taxRate ?? null,
      taxType: data?.taxType ?? null,
    };

    return product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    throw new Error("Error fetching product");
  }
}





export async function fetchProducts(): Promise<ProductType[]> {
  try {
    const snapshot = await adminDb.collection("products").get();

    if (snapshot.empty) {
      console.warn("No products found in the database.");
      return [];
    }

    const products: ProductType[] = snapshot.docs.map((doc) => {
      const data = doc.data() as Partial<ProductType> & { updatedAt?: any };

      // ✅ Normalize updatedAt (handle Firestore Timestamp or string)
      let updatedAt: string | null = null;
      if (data.updatedAt) {
        if (typeof data.updatedAt.toDate === "function") {
          updatedAt = data.updatedAt.toDate().toISOString();
        } else if (typeof data.updatedAt === "string") {
          updatedAt = data.updatedAt;
        }
      }

      return {
        id: doc.id,
        name: data.name ?? "",
        price: data.price ?? 0,
        stockQty: data.stockQty ?? 0,
        discountPrice: data.discountPrice ?? 0,
        categoryId: data.categoryId ?? "",
        productCat: data.productCat ?? "",
        flavors: data.flavors ?? false,
        status: data.status ?? "draft",
        baseProductId: data.baseProductId ?? "",
        productDesc: data.productDesc ?? "",
        sortOrder: data.sortOrder ?? 0,
        image: data.image ?? "",
        isFeatured: data.isFeatured ?? false,
        purchaseSession: data.purchaseSession ?? null,
        quantity: data.quantity ?? null,
        updatedAt,

        // ✅ New tax fields
        taxRate: data.taxRate ?? null, // number or null
        taxType: data.taxType ?? null, // string or null ("gst", "vat", etc.)
      };
    });

    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw new Error("Error retrieving product list");
  }
}




export async function fetchProducts_old(): Promise<ProductType[]> {
  try {
    const snapshot = await adminDb.collection("products").get();

    if (snapshot.empty) {
      console.warn("No products found in the database.");
      return [];
    }

    const products: ProductType[] = snapshot.docs.map((doc) => {
      const data = doc.data() as Partial<ProductType> & { updatedAt?: any };

      // ✅ Normalize updatedAt (handle Firestore Timestamp or string)
      let updatedAt: string | null = null;
      if (data.updatedAt) {
        if (typeof data.updatedAt.toDate === "function") {
          updatedAt = data.updatedAt.toDate().toISOString();
        } else if (typeof data.updatedAt === "string") {
          updatedAt = data.updatedAt;
        }
      }

      return {
        id: doc.id,
        name: data.name ?? "",
        price: data.price ?? 0,
        stockQty: data.stockQty ?? 0,
        discountPrice: data.discountPrice ?? 0,
        categoryId: data.categoryId ?? "",
        productCat: data.productCat ?? "",
        flavors: data.flavors ?? false,
        status: data.status ?? "draft",
        baseProductId: data.baseProductId ?? "",
        productDesc: data.productDesc ?? "",
        sortOrder: data.sortOrder ?? 0,
        image: data.image ?? "",
        isFeatured: data.isFeatured ?? false,
        purchaseSession: data.purchaseSession ?? null,
        quantity: data.quantity ?? null,
        updatedAt, // ✅ always string or null, safe for client
      };
    });

    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw new Error("Error retrieving product list");
  }
}



export async function fetchProductByCategoryId(id: string): Promise<ProductType[]> {
 
 console.log("by id ---------------")
  try {
    const querySnapshot = await adminDb
      .collection("products")
      .where("categoryId", "==", id)
      .get();

    if (querySnapshot.empty) {
      console.warn(`No products found for categoryId: ${id}`);
      return [];
    }

    const products: ProductType[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProductType[];

    return products;
  } catch (error) {
    console.error("Error fetching products by category ID:", error);
    throw new Error("Failed to retrieve products for this category");
  }
}


export async function fetchProductsForExport(): Promise<ProductType[]> {
  const snapshot = await adminDb.collection("product").get();

  const data: ProductType[] = snapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as ProductType;
  });

  return data;
}


export async function fetchProductsForBestOfMonth(): Promise<ProductType[]> {
  const snapshot = await adminDb.collection("product").get();

  const data: ProductType[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ProductType[];

  return data.filter((p) => p.isFeatured === true);
}

/**
 * Toggle the 'isFeatured' field on a product document.
 * Works with Firebase Admin SDK for secure, server-side updates.
 */
export async function toggleFeatured(productId: string, isFeatured: boolean) {
  try {
    const productRef = adminDb.collection("products").doc(productId);
    await productRef.update({ isFeatured });

    return { success: true, message: `Product ${isFeatured ? "featured" : "unfeatured"} successfully.` };
  } catch (error) {
    console.error("Error toggling featured status:", error);
    return { success: false, error: (error as Error).message };
  }
}


/**
 * Upload a product to Firestore from CSV data
 */
export async function uploadProductFromCSV(data: Partial<ProductType>) {
  if (!data.name || data.price === undefined) {
    throw new Error("Missing required fields: name or price");
  }

  console.log("data------",data)

  const productData: Omit<ProductType, "id"> = {
    name: data.name,
    price: Number(data.price),
    discountPrice:
      data.discountPrice !== undefined ? Number(data.discountPrice) : 0,
    stockQty: data.stockQty ?? 0,
    categoryId: data.categoryId ?? "",
    productCat: data.productCat ?? "",
    baseProductId: data.baseProductId ?? "",
    productDesc: data.productDesc ?? "",
    sortOrder: data.sortOrder !== undefined ? Number(data.sortOrder) : 0,
    image: data.image ?? "",
    isFeatured:
      String(data.isFeatured).toLowerCase() === "true" ? true : false,
    purchaseSession: data.purchaseSession ?? null,
    quantity:
      data.quantity !== undefined && data.quantity !== null
        ? Number(data.quantity)
        : null,
    flavors:
      String(data.flavors).toLowerCase() === "true" ? true : false,
    status:
      data.status === "published" ||
      data.status === "draft" ||
      data.status === "out_of_stock"
        ? data.status
        : undefined,
  };

  await adminDb.collection("products").add(productData);
}
