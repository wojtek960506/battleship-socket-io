import { useSocket } from "@/context/SocketContext";
import { useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";

export const WaitingShipsDock = () => {
  
  const { roomName, player } = useRoomStore();
  const {
    setCurrentPlayer,
    isOtherBoardSet,
    setGameStatus,
  } = useGameStore();
  const socket = useSocket();

  const handleShipsReposition = () => {
    setGameStatus("setting-board");
    socket.emit("server:reposition-ships", { roomName, player })
    
    if (!isOtherBoardSet) {
      setCurrentPlayer(null)
    }
  }
  
  return (
    <div data-testid="waiting-ships-dock" className="waiting-container">
      <div>Waiting for other player to set its board</div>
      <button 
        onClick={(event) => {
          event.stopPropagation()
          handleShipsReposition()
        }}
        className="random-ships-btn"
        data-testid="reposition-ships-btn"
      >Reposition Ships</button>
    </div>
  )
}