import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { registerSocketHandlers } from "./sockets";

const app = express();

app.use(cors());

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://192.168.0.213:5173"
    ],
    methods: ["GET", "POST"],
  },
});

registerSocketHandlers(io);

server.listen(3001, () => {
  console.log("SERVER IS RUNNING")
})