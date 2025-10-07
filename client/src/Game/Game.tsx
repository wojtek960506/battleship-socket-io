import { useSocket } from "../context/SocketContext";
import { useRoomStore } from "../store/RoomStore";
import { Board } from "./Board/Board";
import "./Game.css"


export const Game = () => {

  const { roomName } = useRoomStore()
  
  const socket = useSocket();
  
  const handleLeaveRoom = () => {
    socket.emit("server:leave-room", roomName)
  }

  return (
    <div className="game-container">
      
      <div className="boards-container">
        <Board />
        <Board />
      </div>
      
      <button onClick={handleLeaveRoom}>Leave room</button>
    </div>
  )
}
