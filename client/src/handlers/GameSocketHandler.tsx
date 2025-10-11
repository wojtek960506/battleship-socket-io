import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useGameStore } from "../store/GameStore";
import { useRoomStore } from "../store/RoomStore";


export const GameSocketHandler = () => {
  const socket = useSocket();
  const { setIsOtherBoardSet, gameStatus, setGameStatus } = useGameStore();
  const { player } = useRoomStore();

  useEffect(() => {
    socket.on("player:board-set", ({ player: otherPlayer }: { player: string}) => {
      
      console.log("player:board-set - game status", gameStatus);

      if (player === otherPlayer) return;

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