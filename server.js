import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import Redis from "ioredis";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL);
const TTL_SECONDS = process.env.TTL_SECONDS || 1800;

app.post("/api/markers", async (req, res) => {
  const { lat, lng, color } = req.body;
  const id = Date.now();
  const marker = { id, lat, lng, color, created_at: Date.now() };
  await redis.set(`marker:${id}`, JSON.stringify(marker), "EX", TTL_SECONDS);
  io.emit("marker:created", marker);
  res.json({ success: true, marker });
});

app.get("/api/markers", async (req, res) => {
  const keys = await redis.keys("marker:*");
  const markers = await Promise.all(
    keys.map(async key => JSON.parse(await redis.get(key)))
  );
  res.json(markers);
});

// Обробка TTL видалення
const sub = new Redis(process.env.REDIS_URL);
sub.psubscribe("__keyevent@0__:expired");
sub.on("pmessage", (pattern, channel, key) => {
  if (key.startsWith("marker:")) {
    const id = key.split(":")[1];
    io.emit("marker:removed", parseInt(id));
  }
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
