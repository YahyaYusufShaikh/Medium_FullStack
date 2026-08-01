import z from "zod";
export declare const signupInput: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
export type SignupInput = z.infer<typeof signupInput>;
export declare const signinInput: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.z.core.$strip>;
export type SigninInput = z.infer<typeof signinInput>;
export declare const createblogInput: z.ZodObject<{
    tite: z.ZodString;
    content: z.ZodString;
}, z.z.core.$strip>;
export type CreateBlogInput = z.infer<typeof createblogInput>;
export declare const updateblogInput: z.ZodObject<{
    tite: z.ZodString;
    content: z.ZodString;
    id: z.ZodString;
}, z.z.core.$strip>;
export type UpdateBlogInput = z.infer<typeof updateblogInput>;
