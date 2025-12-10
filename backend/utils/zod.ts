import * as z from "zod";

// user register
const userSchema = z.object({
  name: z.string({ error: "Name is required" }),
  email: z.email({ error: "Email is required" }),
  password: z.string({ error: "password is required" }).min(8).max(20),
});

// user Login
const userLoginSchema = z.object({
  email: z.email({ error: "Email is required!!" }),
  password: z.string({ error: "password is required" }),
});

// update user role schema
const updateUserRoleSchema = z.object({
  role: z.enum(["STAFF", "USER", "ADMIN"]),
});

// Product schema
const productSchema = z.object({
  title: z.string({ error: "title is required" }),
  description: z.string({ error: "description is required" }),
  category: z.string({ error: "category is required" }),
  price: z.coerce.number({ error: "price is required" }),
  quantity: z.coerce.number({ error: "quantity is required" }),
});


// add to cart schema
const addToCartSchema = z.object({
  productId: z.string({ error: "product id is required" }),
});

export { userSchema, productSchema, userLoginSchema, updateUserRoleSchema,addToCartSchema };
