import { Server, Socket } from "socket.io";
import { roomStore } from "@/data/store";
import { getRoomsList, isInRoom } from "@/sockets/utils";

export function registerLeaveRoomSocket(io: Server, socket: Socket) {
  socket.on("server:leave-room", (room: string) => {
    const roomData = roomStore.getRoom(room)

    if (!roomData) {
      socket.emit("room_not_found", { room, message: `Room '${room}' does not exist.` });
      return;
    } 
    if (!isInRoom(io, socket.id, room)) {
      socket.emit("not_in_room", { room, message: `You are not in a room '${room}'` });
      return;
    }

    socket.leave(room);
    // delete room if leaving user is the last one within it
    if (roomData.size === 1) {
      roomStore.deleteRoom(room)
      socket.emit("rooms:list", getRoomsList())
      socket.broadcast.emit("rooms:list", getRoomsList())
    } else {
      const newMembers = roomData.members.filter(m => m !== socket.id);
      roomStore.updateRoom(room, {
        size: newMembers.length,
        members: newMembers,
        owner: newMembers[0]
      })
    }
    socket.emit("room:you-left", {
      room,
      message: `Player with ID: '${socket.id}' left room '${room}'`,
      playerId: socket.id
    })
    socket.to(room).emit("room:someone-left", {
      room,
      message: `Player with ID: '${socket.id}' left room '${room}'`,
      playerId: socket.id
    })

    // update lists after leaving because new room is available
    socket.emit("rooms:list", getRoomsList())
    socket.broadcast.emit("rooms:list", getRoomsList())

    console.log(`Player with ID: '${socket.id}' left room '${room}'`)
  })
}