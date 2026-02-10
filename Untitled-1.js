app.get('/api/orders', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT * FROM [Order] ORDER BY id LIMIT 100'
  ).run();
  return c.json(result);
});