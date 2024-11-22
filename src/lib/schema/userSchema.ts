
import { z } from "zod";

enum Type {
  landmark,
  item,
  quest,
}

export const userLogin = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is Required" }).email(),
    user_name: z.string().optional(),
    first_name: z.string().min(2),
    last_name: z.string().optional(),
  }),
});

export const createUserCollectionSchema = z.object({
  body: z.object({
    type: z
      .string()
      .optional()
      .refine((type) => Type[type as keyof typeof Type], {
        message: "Invalid Log Type",
      }),
    id: z.string({ required_error: "please input object id" }).min(10),
    last_name: z.string().optional(),
  }),
});
