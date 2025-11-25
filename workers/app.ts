export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const DB = env.DB; // or env.lukairo_main if your binding name differs

    // --- handle preflight for CORS ---
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // --- test endpoint ---
    if (url.pathname === "/api/test") {
      const { results } = await DB.prepare(
        "SELECT 'Connected to LUKAIRO DB' AS status;"
      ).all();

      return new Response(JSON.stringify(results), {
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // --- default ---
    return new Response("LUKAIRO Engine API Active", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
