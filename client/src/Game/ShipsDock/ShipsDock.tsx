import { useState } from "react"
import { useGameStore } from "../../store/GameStore"
import { type Direction } from "../../helpers/utils"

export const ShipsDock = () => {

  const [shipsDirection, setShipsDirection] = useState<Direction>("horizontal")

  const { ships } = useGameStore()

  const shipsToSet = ships.filter(s => s.status === "not-placed")

  const handleShipDirectionClick = () => {
    if (shipsDirection === "horizontal") {
      setShipsDirection("vertical")
    } else {
      setShipsDirection("horizontal")
    }
  }

  const shipsToShow = shipsToSet.map((ship, i) => {
    
    const shipElems = [...Array(ship.length)].map((_, index) => {
      let className ="board-field taken-cell "


      return <div key={index} className={className} />
    })

    return (
        <div key={i}className={
          shipsDirection === "horizontal" ? "horizontal-ship" : "vertical-ship"
        }>{shipElems}</div>
    )

  })

  const nextDirection = shipsDirection === "vertical" ? "Horizontal" : "Vertical"

  return (
    <div className="ships-container">
      <button 
        onClick={handleShipDirectionClick}
        className="ship-direction-btn"
      >{nextDirection}</button>
      <div className={shipsDirection === "horizontal" ? "horizontal-ships" : "vertical-ships"}>
        {shipsToShow}
      </div>
    </div>
  )
}