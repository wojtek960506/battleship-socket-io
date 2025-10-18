import { useState } from "react";
import { useShips } from "@/hooks/useShips";
import type { Direction, Ship } from "@/utils/types";


type RotateShipsButtonProps = {
  shipsToSet: Ship[];
}

export const RotateShipsButton = ({ shipsToSet }: RotateShipsButtonProps) => {

  const [shipsDirection, setShipsDirection] = useState<Direction>("horizontal")
  const { updateShipsDirection } = useShips();

  const handleShipDirectionClick = () => {
    const nextDirection = shipsDirection === "horizontal" ? "vertical" : "horizontal"
    setShipsDirection(nextDirection);
    updateShipsDirection(shipsToSet.map(s => s.id), nextDirection)
  }

  return (
    <button
      onClick={(event) => {
        event.stopPropagation()
        handleShipDirectionClick()
      }}
      className="ship-direction-btn"
      data-testid="ship-direction-btn"
    >
      Rotate to {`${shipsDirection === "vertical" ? "Horizontal" : "Vertical"}`}
    </button>
  )
}
