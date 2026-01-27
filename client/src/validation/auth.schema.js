import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(12, "Password must be at most 12 characters")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character")
  .refine((val) => !val.includes(" "), {
    message: "Password must not contain spaces",
  });

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().transform((e) => e.toLowerCase().trim()),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email().transform((e) => e.toLowerCase().trim()),
  password: z.string().min(1),
});
