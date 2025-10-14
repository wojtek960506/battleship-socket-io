import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";
import { getShipsAfterShot } from "@/helpers/utils";
import type { BoardCellType, ReceiveShotResultType, ReceiveShotType, Cell } from "@/helpers/types";
import { getUpdatedBoard } from "@/helpers/boardHelper";


export const GameSocketHandler = () => {
  const socket = useSocket();
  const { 
    setIsOtherBoardSet,
    gameStatus,
    setGameStatus,
    setCurrentPlayer,
    currentPlayer,
    yourBoard,
    ships,
    setShips,
    setYourBoardCell,
    setOpponentBoardCell,
    opponentBoard,
    setYourBoard,
    setOpponentBoard,
    setWinner,
  } = useGameStore();
  const { player, roomName } = useRoomStore();

  useEffect(() => {
    socket.on("player:board-set", ({ otherPlayer }: { otherPlayer: string}) => {
      // just in case message was emited to the sender
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

      if (otherPlayer === currentPlayer) setCurrentPlayer(null);
      setIsOtherBoardSet(false);
    })

    socket.on("player:receive-shot", ({ column, row, playerFromServer }: ReceiveShotType) => {
      if (player === playerFromServer) return;

      const currentValue = yourBoard[row][column]
      if (currentValue === "empty") {
        // missed shot
        const value = "missed"
        socket.emit("server:shot-result", { player, roomName, value, column, row })

        setYourBoardCell(row, column, value)
        setCurrentPlayer(player);
      } else if (currentValue === "taken") {
        // hit or sunk shot
        let value: BoardCellType = "hit";
        let sunkCells: Cell[] = [];


        const { shipsAfterShot, hitShip } = getShipsAfterShot(ships, row, column);  
        if (hitShip?.status === "sunk") {
          value = "sunk";
          sunkCells = hitShip.hitCells;
          const newBoard = getUpdatedBoard(yourBoard, sunkCells, value)
          setYourBoard(newBoard);
        } else {
          setYourBoardCell(row, column, value)
        }


        // check game status
        let isFinished = false;
        if (shipsAfterShot.every(s => s.status === "sunk")) isFinished = true;

      
        socket.emit(
          "server:shot-result",
          { player, roomName, value, column, row, sunkCells, isFinished }
        )

        setShips(shipsAfterShot);  
        setCurrentPlayer(player);

        if (isFinished) {
          setGameStatus("finished");
          setWinner(playerFromServer);
          setCurrentPlayer(null);
        }
      } else {
        // shot to the same cell as before (theoretically not possible, but maybe just in case
        // there should be some handling)
        console.log('TODO - wrong shot - send some response')
      }
    })

    
    
    // TODO - detect strange defect which occurs when on mobile phone you use "Version for computer"
    // then sunk ships are not properly handled and thus the winner is not correctly marked when
    // we sunk all ships on phone (colors are also not updated). It was only when I switched to
    // the "Version on computer". When I started second game it works fine
    socket.on("player:receive-shot-result", (
      { column, row, value, playerFromServer, sunkCells, isFinished }: ReceiveShotResultType
    ) => {
      if (playerFromServer === player) return;
          
      if (value === "sunk") {
        const newBoard = opponentBoard.map(row => [...row]);

        sunkCells.forEach(({column, row}) => {
          newBoard[row][column] = value;
        })
        setOpponentBoard(newBoard);
      } else {
        setOpponentBoardCell(row, column, value);
      }

      if (isFinished) {
        setGameStatus("finished")
        setWinner(player!);
        setCurrentPlayer(null);
      } else {
        setCurrentPlayer(playerFromServer);
      }
    })

    return () => {
      socket.off("player:board-set");
      socket.off("player:reposition-ships");
      socket.off("player:receive-shot");
      socket.off("player:receive-shot-result");
    }
  }, [gameStatus, player, currentPlayer, ships, opponentBoard, socket, setIsOtherBoardSet, setGameStatus, setCurrentPlayer, yourBoard, roomName, setYourBoardCell, setShips, setYourBoard, setWinner, setOpponentBoard, setOpponentBoardCell])

  return null;
}