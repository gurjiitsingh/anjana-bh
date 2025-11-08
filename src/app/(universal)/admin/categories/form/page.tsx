'use client';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, TcategorySchema } from "@/lib/types/categoryType";
import { Button } from "@/components/ui/button";
import { addNewCategory } from '@/app/(universal)/action/category/dbOperations';

const Form = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<TcategorySchema>({
    resolver: zodResolver(categorySchema),
  });

  async function onSubmit(data: TcategorySchema) {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("sortOrder", data.sortOrder!);
      formData.append("desc", data.desc ?? "");
      formData.append("isFeatured", data.isFeatured!);

      if (data.image?.[0] === undefined) {
        formData.append("image", "0");
      } else {
        formData.append("image", data.image[0]);
      }

      await addNewCategory(formData);

      setValue("name", "");
      setValue("desc", "");
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 p-5">
        <h1 className="text-2xl font-semibold mb-2">Add Category</h1>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left Box */}
          <div className="flex-1 flex flex-col gap-y-5">
            <div className="flex flex-col gap-3 bg-white rounded-xl p-4 border">
              <h2 className="font-semibold">Category</h2>

              <div className="flex flex-col gap-1 w-full">
                <label className="label-style">
                  Name<span className="text-red-500">*</span>
                </label>
                <input {...register("name")} className="input-style" />
                {errors.name && (
                  <span className="error-text">{errors.name.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="label-style">
                  Sort Order<span className="text-red-500">*</span>
                </label>
                <input {...register("sortOrder")} className="input-style" />
                {errors.sortOrder && (
                  <span className="error-text">{errors.sortOrder.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Box */}
          <div className="flex-1 flex flex-col gap-5 h-full">
            <div className="flex flex-col gap-3 bg-white rounded-xl p-4 border">
              <h2 className="font-semibold">Pictures</h2>
              <label className="label-style">Image</label>
              <input
                {...register("image", { required: true })}
                type="file"
                className="input-image-style"
              />
              {errors.image && (
                <p className="error-text">Select category image</p>
              )}
            </div>

            <div className="flex flex-col gap-3 bg-white rounded-xl p-4 border">
              <h2 className="font-semibold">General Detail</h2>

              <label className="label-style">Category Description</label>
              <textarea {...register("desc")} className="textarea-style" />
              {errors.desc && (
                <p className="error-text">Category description is required</p>
              )}

              <label className="label-style">
                Active<span className="text-red-500">*</span>
              </label>
              <select {...register("isFeatured")} className="input-style">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              {errors.isFeatured && (
                <p className="error-text">{errors.isFeatured.message}</p>
              )}

              <Button
  type="submit"
  disabled={isSubmitting}
  className={`btn-save ${isSubmitting ? 'opacity-80' : ''}`}
>
  {isSubmitting ? 'Saving...' : 'Save'}
</Button>

            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;
