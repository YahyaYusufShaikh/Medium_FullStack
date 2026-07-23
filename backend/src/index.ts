import { Hono } from 'hono'
import { PrismaClient } from '../src/generated/prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
    JWT_SECRET: string
	}
}>();


app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

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

app.post('/api/v1/signin', async (c) => {
  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const user = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  })
  if(!user){
    c.status(403);
    return c.json({ error: 'User not found' });
  }
  const jwt = await sign({id: user.id}, c.env.JWT_SECRET);
  return c.json({ jwt });
})

app.post('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.put('/api/v1/blog/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('Hello Hono!')
})

export default app
