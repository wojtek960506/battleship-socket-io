import { useSocket } from "@/context/SocketContext"
import { useGameStore } from "@/store/GameStore"
import { useRoomStore } from "@/store/RoomStore"
import { RandomShipsButton } from "./RandomShipsButton"
import { RotateShipsButton } from "./RotateButton"
import { ShipsToShow } from "./ShipsToShow"
import "./ShipsDock.css"


export const ShipsDock = () => {
  const { 
    ships,
    isOtherBoardSet,
    setGameStatus,
    setCurrentPlayer,
  } = useGameStore()
  const { roomName, player } = useRoomStore();
  
  const socket = useSocket();
  
  const shipsToSet = ships.filter(s => s.status === "not-placed")

  const handleStartGame = () => {
    if (isOtherBoardSet) {
      setGameStatus("playing");
    } else {
      setGameStatus("board-set");
      setCurrentPlayer(player)
    }
    socket.emit("server:board-set", { roomName: roomName!, player: player! })
  }

  const StartButton = () => (
    <button 
      onClick={(event) => {
        event.stopPropagation()
        handleStartGame()
      }}
      className="ship-direction-btn"
      data-testid="start-game-btn"
    >
      Start Game
    </button>
  )

  return (
    <div data-testid="ships-dock" className="ships-container">
      {shipsToSet.length === 0 ? (
        <StartButton />
      ) :  (
        <>
          <RotateShipsButton shipsToSet={shipsToSet} />
          <ShipsToShow shipsToSet={shipsToSet}/>
          <RandomShipsButton />
        </>
      )}
    </div>
  )
}