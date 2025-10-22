import { Server, Socket } from "socket.io";
import { roomStore } from "@/data/store";
import { getRoomsList } from "@/sockets/utils";
import { registerJoinRoomSocket } from "./joinRoomSocket";
import { registerLeaveRoomSocket } from "./leaveRoomSocket";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socketEventsTypes";

export function registerRoomSocket(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {

  socket.on("server:create-room", (room: string) => {
    if (!roomStore.getRoom(room)) {
      roomStore.createRoom(room, socket.id);

      // joining new room
      socket.join(room)
      socket.emit("room:created", {
        room,
        message: `You have just created and joined room '${room}'`,
        playerId: socket.id,
      });
    } else {
      socket.emit("room:already-exists", {
        room,
        message: `Room with name '${room}' already exists`
      })
    }
  })

  socket.on("server:list-rooms", () => {
    socket.emit("rooms:list", getRoomsList());
    socket.emit("room:set-player", socket.id);
  });

  socket.on("server:list-rooms-for-everyone", () => {
    socket.broadcast.emit("rooms:list", getRoomsList())
  })

  registerJoinRoomSocket(io, socket);
  registerLeaveRoomSocket(io, socket);
}