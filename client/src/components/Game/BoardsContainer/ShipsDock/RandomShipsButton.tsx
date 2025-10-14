import { useRandomShips } from "@/hooks/useRandomShips";

export const RandomShipsButton = () => {
  const { placeShipsRandomly } = useRandomShips();
  
  return (
    <button
      onClick={(event) => {
        event.stopPropagation()
        placeShipsRandomly()
      }}
      className="random-ships-btn"
      data-testid="random-ships-btn"
    >
      Random ships placement
    </button>
  )
}