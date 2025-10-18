import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useGameSocketHandlers } from "@/hooks/useGameSocketHandlers";


export const GameSocketHandler = () => {
  const socket = useSocket();
  const { 
    handleBoardSet,
    handleRepositionShips,
    handleReceiveShot,
    handleReceiveShotResult,
  } = useGameSocketHandlers();

  useEffect(() => {
    socket.on("player:board-set", handleBoardSet)
    socket.on("player:reposition-ships", handleRepositionShips)
    socket.on("player:receive-shot", handleReceiveShot)
  
    // TODO - detect strange defect which occurs when on mobile phone you use "Version for computer"
    // then sunk ships are not properly handled and thus the winner is not correctly marked when
    // we sunk all ships on phone (colors are also not updated). It was only when I switched to
    // the "Version on computer". When I started second game it works fine
    socket.on("player:receive-shot-result", handleReceiveShotResult)

    return () => {
      socket.off("player:board-set", handleBoardSet);
      socket.off("player:reposition-ships", handleRepositionShips);
      socket.off("player:receive-shot", handleReceiveShot);
      socket.off("player:receive-shot-result", handleReceiveShotResult);
    }
  }, [handleBoardSet, handleReceiveShot, handleReceiveShotResult, handleRepositionShips, socket])

  return null;
}