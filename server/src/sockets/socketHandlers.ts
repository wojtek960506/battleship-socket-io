import { Server } from "socket.io";
import { registerRoomSocket } from "./roomSocket";
import { registerGameSocket } from "./gameSocket";
import { registerDisconnectingSocket } from "./disconnectingSocket";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socketEventsTypes";

export function registerSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>
) {
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