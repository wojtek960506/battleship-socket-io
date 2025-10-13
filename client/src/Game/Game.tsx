import { useSocket } from "../context/SocketContext";
import { resetGameStore, useGameStore } from "../store/GameStore";
import { useRoomStore } from "../store/RoomStore";
import { OpponentBoard } from "./Board/OpponentBoard";
import { YourBoard } from "./Board/YourBoard";
import "./Game.css"
import { ShipsDock } from "./ShipsDock/ShipsDock";


export const Game = () => {

  const { roomName, player } = useRoomStore()
  const {
    gameStatus,
    currentPlayer,
    setCurrentPlayer,
    isOtherBoardSet,
    setGameStatus,
    setChosenShipId,
    winner,
  } = useGameStore()
  
  const socket = useSocket();
  
  const handleLeaveRoom = () => {
    socket.emit("server:leave-room", roomName)
    resetGameStore();
  }

   const handleShipsReposition = () => {
      setGameStatus("setting-board");
      socket.emit("server:reposition-ships", { roomName, player })
      
      if (!isOtherBoardSet) {
        setCurrentPlayer(null)
      }
    }

  // TODO - rename it
  const Abc = () => gameStatus === "board-set"
    ? <>
      <div>Waiting for other player to set its board</div>
      <button 
        onClick={(event) => {
        event.stopPropagation()
        handleShipsReposition()
        }}
        className="random-ships-btn"
        data-testid="reposition-ships-btn"
      >Reposition Ships</button>
    </>
    : <OpponentBoard />

  // clicking anywhere outside the board or ship dock reseting chosen ship
  return (
    <div className="game-container">
      <div>Your player id: {player}</div>
      { winner !== null
        ? <div>Winner is: {winner}</div>        
        : <div>Current Player: {currentPlayer !== null ? currentPlayer : 'no current player'}</div>
      }
      <div 
        onClick={() => setChosenShipId(null)}
        className="boards-container"
      >
        <YourBoard />
        { gameStatus === "setting-board"
          ? <ShipsDock />
          : <Abc />
        }
      </div>
      
      <button onClick={handleLeaveRoom}>Leave room</button>
    </div>
  )
}
