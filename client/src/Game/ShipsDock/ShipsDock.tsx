import { useState } from "react"
import { useGameStore } from "../../store/GameStore"
import { type Direction } from "../../helpers/utils"

export const ShipsDock = () => {

  const [shipsDirection, setShipsDirection] = useState<Direction>("horizontal")

  const { ships } = useGameStore()
  const shipsToSet = ships.filter(s => s.status === "not-placed")

  const handleShipDirectionClick = () => {
    setShipsDirection(prev => (prev === "horizontal" ? "vertical" : "horizontal"));
  }

  const shipsToShow = shipsToSet.map((ship, i) => (
    <div key={i} className={`ship ${shipsDirection}-ship`}>
      {[...Array(ship.length)].map((_, index) => (
        <div key={index} className="board-field taken-cell" />
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