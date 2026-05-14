import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Setup storage directories
const STORAGE_DIR = process.env.NODE_ENV === "production" ? path.join(process.cwd(), "uploads") : path.join(process.cwd(), "uploads");
const DB_FILE = process.env.NODE_ENV === "production" ? path.join(process.cwd(), "db.json") : path.join(process.cwd(), "db.json");

if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({}), "utf-8");
}

// Helper to read/write DB
const getDb = () => JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
const saveDb = (data: any) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STORAGE_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ 
  storage, 
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

async function startServer() {
  // API Routes
  
  // Static route for serving uploaded files
  app.use("/api/raw", express.static(STORAGE_DIR));

  app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileId = uuidv4();
      const fileData = {
        id: fileId,
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // Expires in 24 hours
      };

      const db = getDb();
      db[fileId] = fileData;
      saveDb(db);

      return res.json({ success: true, file: fileData });
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ error: "Upload failed: " + e.message });
    }
  });

  app.get("/api/files/:id", (req, res) => {
    const db = getDb();
    const fileData = db[req.params.id];
    
    if (!fileData) {
      return res.status(404).json({ error: "File not found" });
    }

    // Check expiration immediately on access
    if (fileData.expiresAt && Date.now() > fileData.expiresAt) {
      // Auto-delete if expired upon access
      delete db[req.params.id];
      saveDb(db);
      try {
        fs.unlinkSync(path.join(STORAGE_DIR, fileData.filename));
      } catch (err) {}
      return res.status(404).json({ error: "This link has expired." });
    }
    
    return res.json({ success: true, file: fileData });
  });

  // Background job to clean up expired files every hour
  setInterval(() => {
    try {
      const db = getDb();
      let hasChanges = false;
      const now = Date.now();
      
      for (const [id, data] of Object.entries<any>(db)) {
        if (data.expiresAt && now > data.expiresAt) {
          delete db[id];
          hasChanges = true;
          try {
            fs.unlinkSync(path.join(STORAGE_DIR, data.filename));
          } catch (err) {}
        }
      }
      
      if (hasChanges) saveDb(db);
    } catch (e) {
      console.error("Cleanup error", e);
    }
  }, 60 * 60 * 1000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
