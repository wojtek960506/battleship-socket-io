import { useState } from "react"
import { useGameStore } from "../../store/GameStore"
import { type Direction, type Ship } from "../../helpers/utils"
import "./ShipsDock.css"
import { useSocket } from "../../context/SocketContext"
import { useRoomStore } from "../../store/RoomStore"

export const ShipsDock = () => {

  const [shipsDirection, setShipsDirection] = useState<Direction>("horizontal")
  const { 
    ships,
    chosenShipId,
    isOtherBoardSet,
    setChosenShipId,
    updateShipsDirection,
    setGameStatus,
  } = useGameStore()
  const { roomName, player } = useRoomStore();
  const socket = useSocket()
  const shipsToSet = ships.filter(s => s.status === "not-placed")

  const handleShipDirectionClick = () => {
    const nextDirection = shipsDirection === "horizontal" ? "vertical" : "horizontal"
    setShipsDirection(nextDirection);
    updateShipsDirection(shipsToSet.map(s => s.id), nextDirection)
  }

  const handleShipClick = (shipId: number) => {
    if (shipId !== chosenShipId) {
      setChosenShipId(shipId)
    } else {
      setChosenShipId(null)
    }
  }

  const handleStartGame = () => {
    if (isOtherBoardSet) {
      setGameStatus("playing");
    } else {
      setGameStatus("board-set");
    }  
    
    socket.emit("server:board-set", { roomName, player })
  }

  const ShipToShow = ({ ship }: { ship: Ship }) => {
    return (
      <div 
      key={ship.id}
      className={`ship ${ship.direction}-ship ${chosenShipId === ship.id ? "chosen" : ""}` }
      onClick={(event) => {
        event.stopPropagation()
        handleShipClick(ship.id)
      }}
    >
      {[...Array(ship.length)].map((_, index) => (
        <div key={index} className="board-cell taken-cell" />
      ))}
    </div>
    )

  }

  const ShipsToShow = () => {
    
    const horizontalShips = shipsToSet.filter(s => s.direction === "horizontal");
    const verticalShips = shipsToSet.filter(s => s.direction === "vertical");
    
    return (
      <div style={{display: "flex", gap: 20}}>
        {horizontalShips.length > 0 && (
          <div className={`ships-display horizontal-ships`}>
            {horizontalShips.map(((ship, i) => <ShipToShow key={i} ship={ship} />))}
          </div>
        )}
        {verticalShips.length > 0 && (
          <div className={`ships-display vertical-ships`}>
            {verticalShips.map(((ship, i) => <ShipToShow key={i} ship={ship} />))}
          </div>
        )}
      </div>
    )
  }

  

  return (
    <div className="ships-container">
      { shipsToSet.length !== 0
        ? (<>
            <button
              onClick={(event) => {
                event.stopPropagation()
                handleShipDirectionClick()
              }}
              className="ship-direction-btn"
            >
              Rotate to {`${shipsDirection === "vertical" ? "Horizontal" : "Vertical"}`}
            </button>
            <ShipsToShow />
            <button
              onClick={(event) => {
                event.stopPropagation()
                console.log('random ships placement')
              }}
              className="random-ships-btn"
            >
              Random ships placement
            </button>
          </>)
        : <button 
            onClick={(event) => {
              event.stopPropagation()
              handleStartGame()
            }}
            className="start-game-btn"
            data-testid="start-game-btn"
          >Start Game</button>
      }
    </div>
  )
}