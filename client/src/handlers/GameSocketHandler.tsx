import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useGameStore } from "../store/GameStore";
import { useRoomStore } from "../store/RoomStore";
import type { BoardCellType } from "../helpers/utils";


export const GameSocketHandler = () => {
  const socket = useSocket();
  const { 
    setIsOtherBoardSet,
    gameStatus,
    setGameStatus,
    setCurrentPlayer,
    currentPlayer,
    yourBoard,
    setYourBoardCell,
    setOpponentBoardCell,
  } = useGameStore();
  const { player, roomName } = useRoomStore();

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

    type ReceiveShotType = {
      column: number;
      row: number;
      playerFromServer: string
    }

    socket.on("player:receive-shot", ({ column, row, playerFromServer }: ReceiveShotType) => {
      if (player === playerFromServer) return;
      
      console.log('player:receive-shot - player:', player)

      const currentValue = yourBoard[row][column]
      if (currentValue === "empty") {
        // missed shot
        const value = "missed"
        socket.emit("server:shot-result", { player, roomName, value, column, row })

        setYourBoardCell(row, column, value)
        setCurrentPlayer(player);
      } else if (currentValue === "taken") {
        // hit or sunk shot
        const value = "hit"
        // TODO add some logic for sending sunk values of the whole ship
        socket.emit("server:shot-result", { player, roomName, value, column, row })

        setYourBoardCell(row, column, value)
        setCurrentPlayer(player);
      } else {
        // shot to the same cell as before (theoretically not possible, but maybe just in case
        // there should be some handling)
        console.log('TODO - wrong shot - send some response')
      }
    })

    type ReceiveShotResultType = {
      column: number;
      row: number;
      value: BoardCellType;
      playerFromServer: string
    }
    
    socket.on("player:receive-shot-result", (
      { column, row, value, playerFromServer }: ReceiveShotResultType
    ) => {
      if (playerFromServer === player) return;

      setOpponentBoardCell(row, column, value);
      setCurrentPlayer(playerFromServer);
    })

    return () => {
      socket.off("player:board-set");
      socket.off("player:reposition-ships");
      socket.off("player:receive-shot");
      socket.off("player:receive-shot-result");
    }
  }, [gameStatus, player, currentPlayer])

  return null;
}