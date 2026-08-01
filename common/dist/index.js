import z from "zod";
export const signupInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
});
export const signinInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
});
export const createblogInput = z.object({
    tite: z.string(),
    content: z.string()
});
export const updateblogInput = z.object({
    tite: z.string(),
    content: z.string(),
    id: z.string()
});
//# sourceMappingURL=index.js.map