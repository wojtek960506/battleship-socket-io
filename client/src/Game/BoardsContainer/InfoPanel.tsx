import { useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";

export const InfoPanel = () => {
  const { player } = useRoomStore();
  const { currentPlayer, winner } = useGameStore();
  
  return (
    <div className="info-panel">
      <div>Your player id: {player}</div>
      { winner !== null
        ? <div>Winner is: {winner}</div>        
        : <div>Current Player: {currentPlayer !== null ? currentPlayer : 'no current player'}</div>
      }
    </div>
  )
}