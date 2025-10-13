import { useSocket } from "../context/SocketContext";
import { useGameStore } from "../store/GameStore";
import { useRoomStore } from "../store/RoomStore";
import { OpponentBoard } from "./Board/OpponentBoard";
import { YourBoard } from "./Board/YourBoard";
import { ShipsDock } from "./ShipsDock/ShipsDock";


export const BoardsContainer = () => {

  const { roomName, player } = useRoomStore();
  const {
    gameStatus,
    setCurrentPlayer,
    isOtherBoardSet,
    setGameStatus,
    setChosenShipId,
  } = useGameStore();
  const socket = useSocket();
  
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

  return (
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
  )
}