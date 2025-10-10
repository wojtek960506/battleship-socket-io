import { useSocket } from "../context/SocketContext";
import { useGameStore } from "../store/GameStore";
import { useRoomStore } from "../store/RoomStore";
import { Board } from "./Board/Board";
import "./Game.css"
import { ShipsDock } from "./ShipsDock/ShipsDock";


export const Game = () => {

  const { roomName } = useRoomStore()
  const { gameStatus, setChosenShipId } = useGameStore()
  
  const socket = useSocket();
  
  const handleLeaveRoom = () => {
    socket.emit("server:leave-room", roomName)
  }

  return (
    <div className="game-container">
      
      <div 
        onClick={() => setChosenShipId(null)}
        className="boards-container"
      >
        <Board />
        { gameStatus === "setting-board"
          ? <ShipsDock />
          : <Board />
        }
      </div>
      
      <button onClick={handleLeaveRoom}>Leave room</button>
    </div>
  )
}
