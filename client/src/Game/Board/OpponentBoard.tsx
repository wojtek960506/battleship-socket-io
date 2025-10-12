import { useCallback } from "react"
import { useGameStore } from "../../store/GameStore"
import "./Board.css";
import { BoardGrid } from "./BoardGrid";
import { useRoomStore } from "../../store/RoomStore";
import { useSocket } from "../../context/SocketContext";


export const OpponentBoard = () => {
  const { player, roomName } = useRoomStore();
  const {
    opponentBoard,
    gameStatus,
    currentPlayer
  } = useGameStore()

  const socket = useSocket();

  const handleCellClick = useCallback((rowIndex: number, columnIndex: number) => {
    // clicking on your board outside of the ship placement phase has no effect
    if (gameStatus !== "playing") return;
    // clicking when it is not your turn has no effect
    if (player !== currentPlayer) return;
    
    console.log(
      `opponentBoard[${rowIndex}][${columnIndex}] - '${opponentBoard[rowIndex][columnIndex]}'`
    )

    const value = opponentBoard[rowIndex][columnIndex];
    // clicking on a cell which has been clicked before has no effect
    if (value !== "empty") return;

    socket.emit("server:send-shot", { roomName, player, row: rowIndex, column: columnIndex })
    
  }, [gameStatus])

  return <BoardGrid
    board={opponentBoard}
    hoverPreview={[]}
    onCellClick={handleCellClick}
  />
}