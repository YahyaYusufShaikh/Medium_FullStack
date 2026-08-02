    import {Hono} from "hono";
    import { PrismaClient } from '../generated/prisma/client'
    import { withAccelerate } from '@prisma/extension-accelerate'
    import { sign, verify } from 'hono/jwt'
    import z from 'zod'
    import { signupInput, signinInput } from "@yahya_coder/medium-common"

import { signInput } from "../zod";

 

    export const userRouter = new Hono<{
        Bindings:{
            DATABASE_URL: string,
            JWT_SECRET: string
        }
    }>();



    userRouter.post('/signup', async (c) => {

    const body = await c.req.json();
    const {success} = signupInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message:"Inputs are not correct"
        })
    }
    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

   

    try{
        const user = await prisma.user.create({
        data: {
            email: body.email,
            password: body.password,
        },
        })
        const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
        return c.json({ jwt });
    }catch(e){
        c.status(403);
        return c.json({ error: e });
    }
    })

    userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const success = signinInput.safeParse(body);
    if(!success){
        c.status(411);
        return c.json({
            message:"Inputs are not correct"
        })
    }


    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findUnique({
        where: {
        email: body.email,
        password: body.password
        }
    })
    if(!user){
        c.status(403);
        return c.json({ error: 'User not found' });
    }
    const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
    return c.json({ jwt });
    })