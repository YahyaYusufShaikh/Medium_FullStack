import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import ts from "typescript";
import { updateblogInput, createblogInput } from "@yahya_coder/medium-common"


export const blogRouter = new Hono<
    {
        Bindings: {
            DATABASE_URL: string,
            JWT_SECRET: string
        },
        // Variables: {
        //   userId: string,
        // }
    }
>();

// blogRouter.get("/", (c) => {
//   return c.text("GET works");
// });

// blogRouter.post("/", (c) => {
//   console.log("POST works");
//   return c.text("POST works");
// });

blogRouter.use("/*", async (c, next)=>{
  const authHeader = c.req.header("Authorization") || "";
  //@ts-ignore
  const user = await verify(authHeader, c.env.JWT_SECRET, "HS256"); 
 try{
       if(user){
      //@ts-ignore
      c.set("userId", user.id);
      await next();
    }else{
      c.status(403);
      return c.json({
        message: "You are not logged in"
      });
    }
 } catch(e){
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

  const body = await c.req.json();

  const {success} = createblogInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      message:"Inputs are not correct"
    })
  }

  const prisma = new PrismaClient({
      accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    //@ts-ignore
    const authorId = c.get("userId");
    const blog = await prisma.post.create({
      data: {
        title : body.title,
        content : body.content,
        // @ts-ignore
        authorId: authorId
      }
    })

  return c.json({
    id: blog.id,
  })
})



blogRouter.put('/', async(c) => {
  const body = await c.req.json();
  
  const {success} = updateblogInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      message:"Inputs are not correct"
    })
  }
  
  const prisma = new PrismaClient({
      accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blog = await prisma.post.update({
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

//it should be before the get by id other wise compiler will get bulk as an ID and find the blog with id as bulk
blogRouter.get('/bulk', async(c) => {
    const prisma = new PrismaClient({
      accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    
    const blog = await prisma.post.findMany();

    return c.json({
      blog
    })
})


blogRouter.get('/:id', async(c) => {

  const prisma = new PrismaClient({
      accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const id = c.req.param("id");

    try{
        const blog = await prisma.post.findFirst({
          where:{
            id: id
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

