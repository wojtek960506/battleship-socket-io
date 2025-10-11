import { useCallback } from "react"
import { useGameStore } from "../../store/GameStore"
import "./Board.css";
import { BoardGrid } from "./BoardGrid";


export const OpponentBoard = () => {
  const {
    opponentBoard,
    gameStatus,
  } = useGameStore()

  const handleCellClick = useCallback((rowIndex: number, columnIndex: number) => {
    // clicking on your board outside of the ship placement phase
    // has no effect
    if (gameStatus !== "playing") return;
    
    console.log(
      `opponentBoard[${rowIndex}][${columnIndex}] - '${opponentBoard[rowIndex][columnIndex]}'`
    )
    
  }, [gameStatus])

  return <BoardGrid
    board={opponentBoard}
    hoverPreview={[]}
    onCellClick={handleCellClick}
  />
}