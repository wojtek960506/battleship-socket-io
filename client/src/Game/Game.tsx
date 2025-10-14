import { useSocket } from "@/context/SocketContext";
import { resetGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";
import { BoardsContainer } from "./BoardsContainer/BoardsContainer";
import "./Game.css"
import { InfoPanel } from "./BoardsContainer/InfoPanel";

export type BoardAreaProps = {
  mode: "ship-dock" | "waiting" | "opponent-board";
}

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
      <button className="leave-room-btn" onClick={handleLeaveRoom}>Leave room</button>
    </div>
  )
}
