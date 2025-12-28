import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Root(): JSX.Element {
  return (
    <div>
      <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <nav>
          <Link to="/">Home</Link>{" · "}
          <Link to="/about">About</Link>
        </nav>
      </header>

      <main style={{ padding: 16 }}>
        {/* child route UI will be rendered here */}
        <Outlet />
      </main>

      <footer style={{ padding: 16, borderTop: "1px solid #eee", marginTop: 24 }}>
        © {new Date().getFullYear()} Your App
      </footer>
    </div>
  );
}

/** Optional error boundary exported by route modules (React Router will use it).
 *  Helps surface server/client errors during SSR/hydration.
 */
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <div style={{ padding: 24 }}>
      <h1>Something went wrong</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>{String(error?.message ?? error)}</pre>
    </div>
  );
}
