// Vercel serverless function entry point
try {
  const app = require('../dist/server.cjs').default;
  module.exports = app;
} catch (e) {
  console.error("Initialization error:", e);
  module.exports = (req, res) => res.status(500).json({ error: "Internal Server Error" });
}
