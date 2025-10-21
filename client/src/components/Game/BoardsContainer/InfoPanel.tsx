import { useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";

export const InfoPanel = () => {
  const { player } = useRoomStore();
  const { currentPlayer, winner } = useGameStore();
  
  return (
    <div className="info-panel">
      <div data-testid="info-panel-player-id">Your player id: {player}</div>
      { winner !== null
        ? <div data-testid="info-panel-winner">Winner is: {winner}</div>        
        : <div data-testid="info-panel-current-player">
          Current Player: {currentPlayer !== null ? currentPlayer : 'no current player'}
        </div>
      }
    </div>
  )
}