import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) =>
  c.html(`
    <h1 style="font-family: sans-serif; color: #0af;">
      Welcome to LUKAIRO ENGINE
    </h1>
    <p>Your worker is live.</p>
  `)
);

export default app;
