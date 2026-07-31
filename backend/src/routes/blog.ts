import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<
    {
        Bindings: {
            DATABASE_URL: string,
            JWT_SECRET: string
        },
        Variables: {
          userId: string,
        }
    }
>();


blogRouter.use("/*", async (c, next)=>{
  console.log("Hit the blog m8d");
  const authHeader = c.req.header("Authorization") || "";
  //@ts-ignore
  const user = await verify(authHeader, c.env.JWT_SECRET, "HS256"); 
  if(user){
    //@ts-ignore
    c.set("userId", user.id);
    console.log(2);
    await next();
    console.log(3);
  }else{
    c.status(403);
    return c.json({
      message: "You are not logged in"
    });
  }
});

// blogRouter.use("/*", async (c, next) => {
//   const authHeader = c.req.header("Authorization");
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     c.status(401);
//     return c.json({ message: "You are not logged in" });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const user = await verify(token, c.env.JWT_SECRET);
//     c.set("userId", user.id as string);
//     await next();
//   } catch (e) {
//     c.status(401);
//     return c.json({ message: "You are not logged in" });
//   }
// });


blogRouter.post('/', async (c) => {
  console.log("Hit the blog router");

  const prisma = new PrismaClient({
      accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    //@ts-ignore
    const authorId = c.get("userId");
    const blog = await prisma.blog.create({
      data: {
        title : body.title,
        content : body.content,
        authorId: Number(authorId)
      }
    })

  return c.json({
    id: blog.id,
  })
})



blogRouter.put('/a', async(c) => {
  const prisma = new PrismaClient({
      accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const blog = await prisma.blog.update({
      where : {
        id : body.id
      },
      data: {
        title : body.title,
        content : body.content,
      }
    })
  return c.json({
    id: blog.id,
  });
})



blogRouter.get('/', async(c) => {

  const prisma = new PrismaClient({
      accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();

    try{
        const blog = await prisma.blog.findFirst({
          where:{
            id: body.id
          }
        })
          return c.json({
            blog
      });
    }catch(e){
      c.status(411);
      return c.json({
        message: "error while fetching blog post"
      });
    } 
})

blogRouter.get('/bulk', async(c) => {
    const prisma = new PrismaClient({
      accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();

    const blogs = await prisma.blog.findMany();

    return c.json({
      blogs
    })
})