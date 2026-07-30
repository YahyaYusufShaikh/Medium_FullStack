import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";

export const blogRouter = new Hono<
    {
        Bindings: {
            DATABASE_URL: string,
            JWT_SECRET: string
        }
    }
>();


blogRouter.use("/*", (c, next)=>{
  next();
})

blogRouter.post('/', async (c) => {

    const prisma = new PrismaClient({
      accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    await prisma.blog.create({
      data: {
        title : body.title,
        content : body.content,
        authorId: 1

      }
    })

  return c.text('Hello Hono!')
})

blogRouter.put('/a', (c) => {
  return c.text('Hello Hono!')
})

blogRouter.get('/', (c) => {
  return c.text('Hello Hono!')
})

blogRouter.get('/bulk', (c) => {
  return c.text('Hello Hono!')
})