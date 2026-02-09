import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
  VALUE_FROM_CLOUDFLARE: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) =>
  c.html(`
    <h1 style="font-family: sans-serif; color: #0af;">
      Welcome to LUKAIRO ENGINE
    </h1>
    <p>Your worker is live.</p>
  `)
);

app.get('/api/orders', async (c) => {
  try {
    const result = await c.env.DB.prepare(
      'SELECT * FROM [Order] ORDER BY id LIMIT 100'
    ).run();
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Database query failed', details: String(error) }, 500);
  }
});

export default app;
