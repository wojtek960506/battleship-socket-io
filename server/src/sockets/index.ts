import { Server } from "socket.io";
import { registerRoomSocket } from "./roomSocket";


export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    registerRoomSocket(io, socket);

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });
}