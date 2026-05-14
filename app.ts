import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import os from "os";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(cors());
app.use(express.json());

const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL_ENV;
const baseDir = process.env.NODE_ENV === "production" || isVercel ? os.tmpdir() : process.cwd();
const STORAGE_DIR = path.join(baseDir, "uploads");
const DB_FILE = path.join(baseDir, "db.json");

if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({}), "utf-8");
}

const getDb = () => JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
const saveDb = (data: any) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");

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
  limits: { fileSize: 50 * 1024 * 1024 } 
});

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
      expiresAt: Date.now() + 2 * 60 * 60 * 1000,
      maxViews: 3,
      views: 0,
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
  try {
    const db = getDb();
    const fileData = db[req.params.id];
    
    if (!fileData) {
      return res.status(404).json({ error: "File not found" });
    }

    if (fileData.expiresAt && Date.now() > fileData.expiresAt) {
      delete db[req.params.id];
      saveDb(db);
      try {
        fs.unlinkSync(path.join(STORAGE_DIR, fileData.filename));
      } catch (err) {}
      return res.status(404).json({ error: "This link has expired." });
    }

    fileData.views = (fileData.views || 0) + 1;
    
    if (fileData.views > fileData.maxViews) {
      delete db[req.params.id];
      saveDb(db);
      try {
        fs.unlinkSync(path.join(STORAGE_DIR, fileData.filename));
      } catch (err) {}
      return res.status(404).json({ error: "This link has reached its maximum view limit and has been deleted." });
    }
    
    saveDb(db);
    return res.json({ success: true, file: fileData });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: "Database error" });
  }
});

if (!isVercel) {
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
}

export default app;
