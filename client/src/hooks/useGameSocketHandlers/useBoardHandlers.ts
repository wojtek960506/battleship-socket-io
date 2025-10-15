import { useCallback } from "react";
import { useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";

export const useBoardHandlers = () => {

  const {       
    gameStatus,
    currentPlayer,      
    setGameStatus,
    setCurrentPlayer,
    setIsOtherBoardSet,
  } = useGameStore();
  const player = useRoomStore(s => s.player);

  const handleBoardSet = useCallback(({ otherPlayer }: { otherPlayer: string}) => {
    // just in case message was emited to the sender
      if (player === otherPlayer) return;

      setIsOtherBoardSet(true);
      if (gameStatus === "board-set") {
        setGameStatus("playing")
      } else {
        setCurrentPlayer(otherPlayer)
      }
  }, [player, setIsOtherBoardSet, gameStatus, setGameStatus, setCurrentPlayer])

  const handleRepositionShips = useCallback(({ otherPlayer }: { otherPlayer: string }) => {
    if (player === otherPlayer) return;

    if (otherPlayer === currentPlayer) setCurrentPlayer(null);
    setIsOtherBoardSet(false);
  }, [currentPlayer, player, setCurrentPlayer, setIsOtherBoardSet])

  return { handleBoardSet, handleRepositionShips }
}