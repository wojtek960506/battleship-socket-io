import { useCallback } from "react";
import { useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";

export const useGame = () => {
  
  const {
    gameStatus,
    setGameStatus,
    setCurrentPlayer,
    setIsOtherBoardSet,
  } = useGameStore()

  const { player } = useRoomStore()


  
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


  return { handleBoardSet }
}