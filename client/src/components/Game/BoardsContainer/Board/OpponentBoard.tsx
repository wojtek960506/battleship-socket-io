import { useCallback } from "react"
import { useSocket } from "@/context/SocketContext";
import { useGameStore } from "@/store/GameStore"
import "./Board.css";
import { useRoomStore } from "@/store/RoomStore";
import { BoardGrid } from "./BoardGrid";



export const OpponentBoard = () => {
  const { player, roomName } = useRoomStore();
  const {
    opponentBoard,
    gameStatus,
    currentPlayer
  } = useGameStore()

  const socket = useSocket();

  const handleCellClick = useCallback((rowIndex: number, columnIndex: number) => {
    // clicking on opponent's board outside of the playing phase has no effect
    if (gameStatus !== "playing") return;
    // clicking when it is not your turn has no effect
    if (player !== currentPlayer) return;
    
    const value = opponentBoard[rowIndex][columnIndex];
    // clicking on a cell which has been clicked before has no effect
    if (value !== "empty") return;

    socket.emit(
      "server:send-shot",
      { roomName: roomName!, player: player!, row: rowIndex, column: columnIndex }
    )
  }, [currentPlayer, gameStatus, opponentBoard, player, roomName, socket])

  return <BoardGrid
    board={opponentBoard}
    hoverPreview={[]}
    dataTestId="opponent-board"
    onCellClick={handleCellClick}
  />
}