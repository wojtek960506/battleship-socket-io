import { Socket } from "socket.io";
import { MoveSendData, RoomNamePlayer, ShotResultData } from "../types/socketTypes";


export function registerGameSocket(socket: Socket) {


  socket.on("server:send-shot", ({ roomName, player, ...data }: MoveSendData) => {
    socket.to(roomName).emit("player:receive-shot", { playerFromServer: player, ...data })
  })

  socket.on("server:shot-result", ({ roomName, player, ...data }: ShotResultData) => {
    socket.to(roomName).emit(
      "player:receive-shot-result",
      { playerFromServer: player, ...data }
    )
  })

  socket.on("server:board-set", ({ roomName, player }: RoomNamePlayer) => {
    console.log(`Player '${player}' set its board in room '${roomName}'`)
    socket.to(roomName).emit('player:board-set', { otherPlayer: player })
  })

  socket.on("server:reposition-ships", ({ roomName, player }: RoomNamePlayer) => {
    console.log(`Player '${player}' is repositioning its ships in room '${roomName}'`)
    socket.to(roomName).emit('player:reposition-ships', { otherPlayer: player })
  })
}