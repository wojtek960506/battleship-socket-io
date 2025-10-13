import { useSocket } from "../context/SocketContext";
import { resetGameStore } from "../store/GameStore";
import { useRoomStore } from "../store/RoomStore";
import { BoardsContainer } from "./BoardsContainer";
import "./Game.css"
import { InfoPanel } from "./InfoPanel";


export const Game = () => {

  const { roomName } = useRoomStore();
  
  const socket = useSocket();
  
  const handleLeaveRoom = () => {
    socket.emit("server:leave-room", roomName)
    resetGameStore();
  }

  // clicking anywhere outside the board or ship dock reseting chosen ship
  return (
    <div className="game-container">
      <InfoPanel />
      <BoardsContainer />    
      <button onClick={handleLeaveRoom}>Leave room</button>
    </div>
  )
}
