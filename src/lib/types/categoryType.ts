import { z } from "zod";

export type categoryType = {
  id: string;
  name: string;
  desc: string;
  productDesc?: string;
  slug?: string | undefined;
  image?: string | undefined;
  isFeatured?: boolean | undefined;
  sortOrder?: number | undefined;
  disablePickupDiscount?: boolean | undefined;
};

export type categoryTypeArr = {
  id: string;
  name: string;
  desc: string;
  slug?: string | undefined;
  image?: string;
}[];

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Category name is required" })
    .max(30, { message: "Category name is to long" }),
  sortOrder: z.string().optional(),
  desc: z
    .string().optional(),    
    oldImgageUrl: z.any().optional(),
  slug: z.string().optional(),
  image: z.any().optional(),
  isFeatured: z.string().optional(),
});

export type TcategorySchema = z.infer<typeof categorySchema>;

export const editCategorySchema = z.object({
  id: z.string().optional(),
  sortOrder: z.string().optional(),
  name: z
    .string()
    .trim()
    .min(1, { message: "Category name is required" })
    .max(30, { message: "Category name is to long" }),
  desc: z
    .string()
    .min(4, { message: "productDescrition of product is needed" })
    .max(100, { message: "productDescription is too long" }),
  // slug: z
  // .string()
  // .min(4, { message: "productDescrition of product is needed" })
  // .max(100, { message: "productDescription is too long" }),
  // image: z.any().refine((file: File) => file?.length !== 0, "File is required"),
  image: z.any().optional(),
  oldImgageUrl: z.any().optional(),
  isFeatured: z.string().optional(),
});

export type TeditCategorySchema = z.infer<typeof editCategorySchema>;
