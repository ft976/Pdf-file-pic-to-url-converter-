import app from "./app";
import express from "express";
import path from "path";

const PORT = process.env.PORT || 3000;
const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL_ENV;

if (process.env.NODE_ENV !== "production" && !isVercel) {
  import("vite").then(({ createServer: createViteServer }) => {
    createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    }).then((vite) => {
      app.use(vite.middlewares);
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Dev server running on port ${PORT}`);
      });
    });
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  if (!isVercel) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Production server running on port ${PORT}`);
    });
  }
}

export default app;