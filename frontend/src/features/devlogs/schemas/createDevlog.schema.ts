import { z } from "zod";
import { apiClient } from "@/lib/apiClient";

export function createDevlogSchema(originalSlug: string) {
  return z.object({
    title: z.string().trim().min(3).max(120),

    slug: z
      .string()
      .trim()
      .min(1)
      .regex(/^[a-z0-9-_]+$/i)
      .refine(async (value) => {
        if (value === originalSlug) return true
        try {
          return (await apiClient.get(`/post/${value}`)).status !== 200;
        } catch (err: any) {
          return err?.response?.status === 404;
        }
      }, "Slug already exists"),

    category: z.string().trim().optional(),
    description: z.string().trim().optional(),
    skills: z.string().trim().optional(),
    projects: z.string().trim().optional(),
    tags: z.array(z.string().trim().min(1)).max(10).optional(),

    content: z
      .string()
      .trim()
      .min(50, "Content must have at least 50 characters"),

    previewImgUrl: z.string()
      .optional()
      .refine((value) => !value || /^https?:\/\//.test(value), "Image URL must start with http or https")
      .refine(async (value) => {
        if (!value) return true
        return new Promise<boolean>((resolve) => {
          const img = new Image()
          img.onload = () => resolve(true)
          img.onerror = () => resolve(false)
          img.src = value
        })
      }, "The URL does not point to a valid image")
  });
}

export type CreateDevlogDTO = z.infer<ReturnType<typeof createDevlogSchema>>;
