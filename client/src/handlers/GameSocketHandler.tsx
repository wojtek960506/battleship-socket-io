import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useGameStore } from "../store/GameStore";


export const GameSocketHandler = () => {
  const socket = useSocket();
  const { setIsOtherBoardSet, gameStatus, setGameStatus } = useGameStore();

  useEffect(() => {
    socket.on("player:board-set", ({ player }: { player: string}) => {
      
      console.log("player:board-set - game status", gameStatus);
      
      setIsOtherBoardSet(true);
      if (gameStatus === "board-set") {
        setGameStatus("playing")
      }
    });

    return () => {
      socket.off("player:board-set");
    }
  }, [gameStatus])

  return null;
}