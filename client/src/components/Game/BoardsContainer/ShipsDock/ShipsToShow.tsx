import { useGameStore } from "@/store/GameStore";
import type { Ship } from "@/utils/types"

type ShipToShowProps = {
  ship: Ship,
  chosenShipId: number | null,
  handleShipClick: (shipId: number) => void;
}

const ShipCells = ({ length }: { length: number}) => (
  <>
    {[...Array(length)].map((_, index) => (
      <div key={index} className="board-cell taken-cell" />
    ))}
  </>
)

const ShipToShow = ({ ship, chosenShipId, handleShipClick }: ShipToShowProps) => {
  const className = `ship ${ship.direction}-ship ${chosenShipId === ship.id ? "chosen" : ""}`
  return (
    <div 
      key={ship.id}
      className={className}
      onClick={(event) => {
        event.stopPropagation()
        handleShipClick(ship.id)
      }}
    >
      <ShipCells length={ship.length} />
    </div>
  )
}


type ShipsToShowProps = {
  shipsToSet: Ship[]
}

export const ShipsToShow = ({ shipsToSet }: ShipsToShowProps) => {

  const { chosenShipId, setChosenShipId } = useGameStore();

  const handleShipClick = (shipId: number) => {
    if (shipId !== chosenShipId) {
      setChosenShipId(shipId)
    } else {
      setChosenShipId(null)
    }
  }

  const horizontalShips = shipsToSet.filter(s => s.direction === "horizontal");
  const verticalShips = shipsToSet.filter(s => s.direction === "vertical");
  
  return (
    <div style={{display: "flex", gap: 20}}>
      {horizontalShips.length > 0 && (
        <div className={`ships-display horizontal-ships`}>
          {horizontalShips.map(((ship, i) => (
            <ShipToShow
              key={i}
              ship={ship}
              chosenShipId={chosenShipId}
              handleShipClick={handleShipClick}
            />
          )))}
        </div>
      )}
      {verticalShips.length > 0 && (
        <div className={`ships-display vertical-ships`}>
          {verticalShips.map(((ship, i) => (
            <ShipToShow 
              key={i}
              ship={ship}
              chosenShipId={chosenShipId}
              handleShipClick={handleShipClick}
            />
          )))}
        </div>
      )}
    </div>
  )
}