import { useGameStore } from "@/store/GameStore";
import type { BoardAreaProps } from "../Game";
import { YourBoard } from "./Board/YourBoard";
import { BoardArea } from "./BoardArea";


export const BoardsContainer = () => {

  const { gameStatus, setChosenShipId } = useGameStore();
  
  const getBoardAreaMode = (): BoardAreaProps["mode"] => {
    if (gameStatus === "setting-board") return "ship-dock";
    if (gameStatus === "board-set") return "waiting";
    return "opponent-board"
  }

  return (
    <div 
      onClick={() => setChosenShipId(null)}
      className="boards-container"
    >
      <YourBoard />
      <BoardArea mode={getBoardAreaMode()} />
    </div>
  )
}