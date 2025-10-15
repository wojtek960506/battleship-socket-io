import { useCallback } from "react";
import { useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";


export const useSwitchPlayers = () => {
  const { 
    setWinner,
    setGameStatus,
    setCurrentPlayer,
  } = useGameStore();
  const player = useRoomStore(s => s.player);

  const switchPlayers = useCallback((playerFromServer: string, isFinished: boolean) => {
    if (isFinished) {
      setGameStatus("finished");
      setWinner(playerFromServer);
      setCurrentPlayer(null);
    } else {
      setCurrentPlayer(player)
    }
  }, [player, setCurrentPlayer, setGameStatus, setWinner])

  return { switchPlayers }
}
