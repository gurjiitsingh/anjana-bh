import { z } from "zod";

export type productT = {
  id: string;
  Desc: string;
  category: string;
  image: string;
  isFeatured: boolean;
  name: string;
  price: string;
};

export type productTArr = {
  id: string;
  Desc: string;
  category: string;
  image: string;
  isFeatured: boolean;
  name: string;
  price: string;
}[];

export type ProductType = {
  id: string | undefined;
  name: string;
  price: number;
  stockQty: number;
  discountPrice: number | undefined;
  categoryId: string;
  productCat: string | undefined;
  baseProductId: string;
  productDesc: string;
  sortOrder: number;
  image: string;
  isFeatured: boolean;
  purchaseSession: string | null;
  quantity: number | null;
  flavors: boolean;
  status: "published" | "draft" | "out_of_stock" | undefined;

  // ✅ New GST / Tax Fields
  taxRate?: number | null; // e.g. 5, 12.5 etc.
  taxType?: "inclusive" | "exclusive" | null; // inclusive → tax included in price, exclusive → added later
};


export type ProductTypeArr = {
  name: string;
  price: string;
  sortOrder: string;
  productDesc: string;
  // image?: any; id?: string | undefined;
  image: string;
  isFeatured: boolean;
}[];

export type TproductSchemaArr = TproductSchema[];

export type TnewProductSchemaArr = TnewProductSchema[];

//add for type

const productSchema = z.object({
  // id: z.number().optional(),
  name: z
    .string()
    .trim()
    .min(2, { message: "Product name is very short" })
    .max(30, { message: "Product name is very long" }),
  price: z
    .string()
    .refine((value) => /^\d+$/.test(value), "Invalid product price"), // Refinement
        discountPrice:z.string().optional(),
    stockQty:z.string().optional(),
  sortOrder: z.string().min(1, { message: "Please select category" }),

  productDesc: z.string().min(1, { message: "Please select category" }),
  company: z.string().min(1, { message: "Please select category" }),
  featured: z.string().optional(),
  image: typeof window === "undefined" ? z.any() : z.any(),
  baseProductId: z.string().optional(),
  status: z
    .enum(['published', 'draft', 'out_of_stock'])
    .optional()
    .nullable(),
  // image:z.object({
  //   size: z.number(),
  // type: z.string(),
  // name: z.string(),
  // lastModified: z.number(),
  //  }),
});
export type TproductSchema = z.infer<typeof productSchema>;

// export const newPorductSchema = z.object({
//   id: z.string().optional(),

//   name: z.string().min(4, { message: "Product name is required" }),

//   price: z
//     .union([z.string(), z.number()])
//     .transform((val) => Number(val))
//     .refine((val) => !isNaN(val) && val >= 0, {
//       message: "Invalid product price",
//     }),

// discountPrice: z
//     .union([z.string(), z.number()])
//     .optional()
//     .transform((val) =>
//       val === undefined || val === "" ? undefined : Number(val)
//     )
//     .refine(
//       (val) => val === undefined || (!isNaN(val) && val >= 0),
//       { message: "Invalid discount price" }
//     ),

//   stockQty: z
//     .union([z.string(), z.number()])
//     .optional()
//     .transform((val) =>
//       val === undefined || val === "" ? undefined : Number(val)
//     )
//     .refine((val) => val === undefined || !isNaN(val), {
//       message: "Invalid stock quantity",
//     }),

//   categoryId: z.string().optional(),

//   sortOrder: z
//     .union([z.string(), z.number()])
//     .transform((val) => Number(val))
//     .refine((val) => !isNaN(val), { message: "Invalid sort order" }),

//   productDesc: z.string().optional(),

//   isFeatured: z.boolean().optional(),

//   image: z.any().optional(),

//   baseProductId: z.string().optional(),

//   flavors: z.boolean().optional(),

//   status: z
//     .enum(["published", "draft", "out_of_stock"])
//     .optional()
//     .nullable(),
// });




export const newPorductSchema = z.object({
  id: z.string().optional(),

  // ✅ Product name - required
  name: z.string().min(4, { message: "Product name is required" }),

  // ✅ Price - must be a number >= 0
  price: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val.replace(",", ".")) : val))
    .refine((num) => !isNaN(num) && num >= 0, { message: "Invalid product price" }),

  // ✅ Sort Order - must be an integer
  sortOrder: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseInt(val) : val))
    .refine((num) => !isNaN(num), { message: "Invalid sort order" }),

  // ✅ Category selection
  categoryId: z.string().min(1, { message: "Please select category" }),

  // ✅ Status enum
  status: z.enum(["published", "draft", "out_of_stock"]),

  // ✅ Optional fields
  discountPrice: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val === undefined || val === "" ? undefined : Number(val)))
    .refine((val) => val === undefined || (!isNaN(val) && val >= 0), {
      message: "Invalid discount price",
    }),

  // ✅ Tax / GST Rate (optional)
  taxRate: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val === undefined || val === "" ? undefined : Number(val)))
    .refine((val) => val === undefined || (!isNaN(val) && val >= 0 && val <= 100), {
      message: "Invalid tax rate (0–100%)",
    }),

  // ✅ Tax Type (optional) - for future extensibility (GST, VAT, etc.)
  taxType: z
    .string()
    .optional()
    .transform((val) => (val === undefined || val === "" ? undefined : val.trim()))
    .refine(
      (val) =>
        val === undefined ||
        ["GST", "VAT", "Service Tax", "None", ""].includes(val),
      { message: "Invalid tax type" }
    ),

  // ✅ Stock Quantity
  stockQty: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val === undefined || val === "" ? undefined : Number(val)))
    .refine((val) => val === undefined || !isNaN(val), {
      message: "Invalid stock quantity",
    }),

  // ✅ Product Description
  productDesc: z.string().optional(),

  // ✅ Featured Product
  isFeatured: z.boolean().optional(),

  // ✅ Image file input
  image: z.any().optional(),

  // ✅ Optional system fields
  baseProductId: z.string().optional(),
  flavors: z.boolean().optional(),
});

export type TnewProductSchema = z.infer<typeof newPorductSchema>;


export type ShowPorductT = {
  id: string;
  name: string;
  price: string;
  sortOrder: string;
  productDesc: string;
  isFeatured: boolean;
  image: string;
};

export const editPorductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(4, { message: "Product name is required" }),

  price: z
    .string()
    .refine((value) => /^\d*[.,]?\d*$/.test(value), "Invalid product price"),

  discountPrice: z.string().optional(),
  stockQty: z.string().optional(),

  sortOrder: z.string().min(1, { message: "Please enter sort order" }),

  categoryId: z.string().optional(),
  categoryIdOld: z.string().optional(),

  productDesc: z.string().optional(),

  isFeatured: z.boolean().optional(),

  image: z.any().optional(),
  oldImgageUrl: z.string().optional(),

  status: z
    .enum(["published", "draft", "out_of_stock"])
    .optional()
    .nullable(),

  // ✅ New Fields for Tax (GST)
  taxRate: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d*[.,]?\d*$/.test(val),
      "Invalid tax rate (must be numeric)"
    ),

  taxType: z
    .enum(["inclusive", "exclusive"])
    .optional()
    .default("inclusive"),
});

export type TeditProductSchema = z.infer<typeof editPorductSchema>;

export default productSchema;

export type TProduct = {
  product: {
    name: string;
    id: string;
    image: string;
    category: string;
  };
};

export type Timage = {
  size?: number;
  type?: string;
  name?: string;
  lastModified?: number;
};

const ImageSchema = z.object({
  size: z.number().optional(),
  type: z.string().optional(),
  name: z.string().optional(),
  lastModified: z.number().optional(),
});

// Now add this object into an array
const ImagesSchema = z.array(ImageSchema);

const MAX_FILE_SIZE = 1024 * 1024 * 6; // 3MB
// const ACCEPTED_IMAGE_TYPES = ['image/jpg','image/jpg','image/jpeg'];

function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType === "jpg" || fileType === "png") return true;
  }
  return false;
}
//image: ImageSchema.optional(),
