# Workers

This directory contains the Cloudflare Workers backend API built with Hono framework.

## Structure

- `app.ts` - Main worker entry point with API routes
- `wrangler.toml` - Worker configuration file
- `*.d.ts` - TypeScript type definitions

## Development

Run the worker locally:
```bash
cd workers
wrangler dev
```

## Deployment

Deploy the worker to Cloudflare:
```bash
cd workers
wrangler deploy
```

Or use the deployment script from the root directory:
```bash
./deploy.sh
# Select option 1 for Workers only
```

## Configuration

Edit `wrangler.toml` to configure:
- Worker name
- Compatibility date
- Environment variables
- Bindings (KV, D1, R2, etc.)

## API Endpoints

The worker exposes API endpoints defined in `app.ts`. Add new routes using Hono's routing:

```typescript
app.get('/api/example', (c) => {
  return c.json({ message: 'Hello from Cloudflare Workers!' });
});
```

## Environment Variables

Access environment variables in your worker:
```typescript
export default {
  async fetch(request: Request, env: Env) {
    const value = env.VALUE_FROM_CLOUDFLARE;
    // Use the value
  }
}
```

Set environment variables:
- **Local**: Use `.dev.vars` file in the root directory
- **Production**: Set in Cloudflare Dashboard or use `wrangler secret put`

## Learn More

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Hono Framework Documentation](https://hono.dev/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
