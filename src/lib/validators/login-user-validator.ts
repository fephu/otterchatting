import { z } from "zod";

export const LoginUserValidator = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export type TLoginUserValidator = z.infer<typeof LoginUserValidator>;
