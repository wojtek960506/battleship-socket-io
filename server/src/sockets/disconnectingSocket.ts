import { Server, Socket } from "socket.io"
import { roomStore } from "@/data/store";
import { getRoomsList } from "./utils";

export function registerDisconnectingSocket(io: Server, socket: Socket) {
  socket.on("disconnecting", () => {
    console.log(`User Disconnecting: ${socket.id}`);
  
    for (const [roomName, members] of io.sockets.adapter.rooms.entries()) {
      if (members.has(socket.id)) {
        const roomData = roomStore.getRoom(roomName)

        if (roomData) { 
          if (roomData.size <= 1) {
            roomStore.deleteRoom(roomName)
          } else {
            const newMembers = roomData.members.filter(m => m !== socket.id)
            roomStore.updateRoom(roomName, {
              size: newMembers.length,
              members: newMembers,
              owner: newMembers[0]
            })
            // other members of this room has to be informed that room was left
            socket.to(roomName).emit('room:someone-left', {
              roomName,
              message: `'${socket.id}' has just left room '${roomName}`,
              playerId: socket.id,
            })
          }
        }
      }
    }
    
    // update all rooms with changes
    socket.broadcast.emit("rooms:list", getRoomsList())
  })
}