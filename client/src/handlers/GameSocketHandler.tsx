import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useGameStore } from "../store/GameStore";
import { useRoomStore } from "../store/RoomStore";


export const GameSocketHandler = () => {
  const socket = useSocket();
  const { setIsOtherBoardSet, gameStatus, setGameStatus, setCurrentPlayer, currentPlayer } = useGameStore();
  const { player } = useRoomStore();

  useEffect(() => {
    socket.on("player:board-set", ({ otherPlayer }: { otherPlayer: string}) => {
      if (player === otherPlayer) return;

      setIsOtherBoardSet(true);
      if (gameStatus === "board-set") {
        setGameStatus("playing")
      } else {
        setCurrentPlayer(otherPlayer)
      }
    });

    socket.on("player:reposition-ships", ({ otherPlayer }: { otherPlayer: string }) => {
      if (player === otherPlayer) return;

      if (otherPlayer === currentPlayer) {
        console.log('set current player to null')
        setCurrentPlayer(null);
      }

      setIsOtherBoardSet(false);
    })

    return () => {
      socket.off("player:board-set");
      socket.off("player:reposition-ships")
    }
  }, [gameStatus, player, currentPlayer])

  return null;
}