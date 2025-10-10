import { useState } from "react"
import { useGameStore } from "../../store/GameStore"
import { type Direction } from "../../helpers/utils"
import "./ShipsDock.css"

export const ShipsDock = () => {

  const [shipsDirection, setShipsDirection] = useState<Direction>("horizontal")

  const { ships, chosenShipId, setChosenShipId, updateShipsDirection } = useGameStore()
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

  const shipsToShow = shipsToSet.map((ship, i) => (
    <div 
      key={i}
      className={`ship ${shipsDirection}-ship ${chosenShipId === ship.id ? "chosen" : ""}` }
      onClick={(event) => {
        event.stopPropagation()
        handleShipClick(ship.id)
      }}
    >
      {[...Array(ship.length)].map((_, index) => (
        <div key={index} className="board-cell taken-cell" />
      ))}
    </div>
  ))

  return (
    <div className="ships-container">
      <button
        onClick={(event) => {
          event.stopPropagation()
          handleShipDirectionClick()
        }}
        className="ship-direction-btn"
      >
        Rotate to {`${shipsDirection === "vertical" ? "Horizontal" : "Vertical"}`}
      </button>
      <div className={`ships-display ${shipsDirection}-ships`}>
        {shipsToShow}
      </div>
    </div>
  )
}