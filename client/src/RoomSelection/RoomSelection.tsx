import { useEffect } from "react"
import { useRoomStore } from "../store/RoomStore"
import { useSocket } from "../context/SocketContext";
import { ChooseRoom } from "./ChooseRoom/ChooseRoom";
import { WaitingRoom } from "./WaitingRoom/WaitingRoom";

export const RoomSelection = () => {

  const socket = useSocket();
  const { roomName } = useRoomStore();

  useEffect(() => {
    socket.emit("server:list-rooms")
  }, [])

  return (
    <main className="room-container">
      { roomName === null
        ? <ChooseRoom />
        : <WaitingRoom />
      }
    </main>
  )
}