import { useState } from "react"
import { useGameStore } from "../../store/GameStore"
import { type Direction } from "../../helpers/utils"
import "./ShipsDock.css"

export const ShipsDock = () => {

  const [shipsDirection, setShipsDirection] = useState<Direction>("horizontal")

  const { ships, chosenShipId, setChosenShipId } = useGameStore()
  const shipsToSet = ships.filter(s => s.status === "not-placed")

  const handleShipDirectionClick = () => {
    setShipsDirection(prev => (prev === "horizontal" ? "vertical" : "horizontal"));
  }

  const handleShipClick = (shipId: number) => {
    if (shipId !== chosenShipId) {
      setChosenShipId(shipId)
    } else {
      setChosenShipId(null)
    }
  }

  console.log(chosenShipId);

  const shipsToShow = shipsToSet.map((ship, i) => (
    <div 
      key={i}
      className={`ship ${shipsDirection}-ship ${chosenShipId === ship.id ? "chosen" : ""}` }
      onClick={() => handleShipClick(ship.id)}
    >
      {[...Array(ship.length)].map((_, index) => (
        <div key={index} className="board-cell taken-cell" />
      ))}
    </div>
  ))

  return (
    <div className="ships-container">
      <button onClick={handleShipDirectionClick} className="ship-direction-btn">
        Rotate to {`${shipsDirection === "vertical" ? "Horizontal" : "Vertical"}`}
      </button>
      <div className={`ships-display ${shipsDirection}-ships`}>
        {shipsToShow}
      </div>
    </div>
  )
}