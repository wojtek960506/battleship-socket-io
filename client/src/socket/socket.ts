import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";

// const HOST_ADDRESS = "http://localhost:3001"
const HOST_ADDRESS = "http://192.168.0.213:3001"

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  HOST_ADDRESS, 
  { autoConnect: false }
);
