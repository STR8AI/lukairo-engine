import React from "react";
import "./app.css";
import Home from "./routes/home";

  return (
    <div>
      <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <nav>
          <a href="/">Home</a>
        </nav>
      </header>

      <main style={{ padding: 16 }}>
        <Home />
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
// ErrorBoundary removed (no React Router)
