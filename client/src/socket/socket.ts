import { io } from "socket.io-client";

// const HOST_ADDRESS = "http://localhost:3001"
const HOST_ADDRESS = "http://192.168.0.213:3001"

export const socket = io(HOST_ADDRESS, {
  autoConnect: false
});
