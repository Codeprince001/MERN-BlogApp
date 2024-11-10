import { z } from "zod";

export const profileSchema = z.object({
  username: z.string().min(1, "Username cannot be empty"),
  email: z.string().email("Enter a valid email address"),
});
