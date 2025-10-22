import { Server } from "socket.io";
import { registerRoomSocket } from "./roomSocket";
import { registerGameSocket } from "./gameSocket";
import { registerDisconnectingSocket } from "./disconnectingSocket";


export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    registerRoomSocket(io, socket);
    registerGameSocket(socket);
    registerDisconnectingSocket(io, socket);

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });
}