import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.html(`
    <h1 style="font-family: sans-serif; color: #0af;">
      Welcome to LUKAIRO ENGINE
    </h1>
    <p>Your worker is live.</p>
  `);
});

app.get('/api/test', async (c) => {
  return c.json({ 
    message: 'LUKAIRO Engine API Active',
    timestamp: new Date().toISOString()
  });
});

export default app;
