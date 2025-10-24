export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { DB } = env;

    if (url.pathname === "/api/test") {
      const { results } = await DB.prepare("SELECT 'Connected to LUKAIRO DB' AS status;").all();
      return Response.json(results);
    }

    if (url.pathname === "/api/clients" && request.method === "GET") {
      const { results } = await DB.prepare("SELECT * FROM clients LIMIT 25;").all();
      return Response.json(results);
    }

    if (url.pathname === "/api/clients" && request.method === "POST") {
      const body = await request.json();
      const { name, email, plan } = body;
      await DB.prepare(
        "INSERT INTO clients (name, email, plan, created_at) VALUES (?, ?, ?, ?)"
      ).bind(name, email, plan, new Date().toISOString()).run();

      return Response.json({ success: true, message: "Client added." });
    }

    return new Response("LUKAIRO Engine API Active", { status: 200 });
  },
};
