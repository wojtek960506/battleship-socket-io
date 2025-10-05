import { useSocket } from "../context/SocketContext";
import { useRoomStore } from "../store/RoomStore";


export const Game = () => {

  const { roomName } = useRoomStore()
  
  const socket = useSocket();
  
  const handleLeaveRoom = () => {
    socket.emit("server:leave-room", roomName)
  }

  return (
    <div>
      Game
      <button onClick={handleLeaveRoom}>Leave room</button>
    </div>
  )
}
