import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

// ===== API =====
app.get("/api/markers", (req, res) => {
  res.json([]); // Fallback
});

app.post("/api/markers", (req, res) => {
  const marker = {
    id: crypto.randomUUID(),
    ...req.body,
    created_at: new Date().toISOString()
  };

  io.emit("marker:created", marker);
  res.json(marker);
});

// ===== SOCKET =====
io.on("connection", socket => {
  console.log("🟢 Client connected:", socket.id);
});

// ===== РОЗДАЧА ФРОНТЕНДУ =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Папка зі зібраним Vite
app.use(express.static(path.join(__dirname, "dist")));

// Головний маршрут
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ===== START =====
const PORT = 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
