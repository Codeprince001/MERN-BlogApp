import { z } from "zod";

export const profileSchema = z.object({
  username: z.string({
    required_error: "Username cannot be blank"
  }).min(5, { message: "must be a mininum of 5 character" }),
  email: z.string().email("Enter a valid email address"),
  // password: z.string().min(8, "Password must be at least 8 characters long.\n")
  //   .regex(/[A-Z]/, "\n Password must contain at least one uppercase letter.\n")
  //   .regex(/[a-z]/, "\n Password must contain at least one lowercase letter.\n")
  //   .regex(/[0-9]/, "\n Password must contain at least one number.\n")
  //   .max(20, "Password cannot exceed 20 characters")
  //   .nullish()
});
