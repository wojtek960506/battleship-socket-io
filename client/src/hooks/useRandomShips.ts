import { getRandomlyPlacedShips } from "../helpers/shipPlacement";
import { useGameStore } from "../store/GameStore"

export const useRandomShips = () => {
  const { ships, yourBoard, setYourBoard, setShips, setChosenShipId } = useGameStore();

  const placeShipsRandomly = () => {
    const { newBoard, newShips } = getRandomlyPlacedShips(yourBoard, ships);

    setYourBoard(newBoard);
    setShips(newShips);
    setChosenShipId(null);
  }

  return { placeShipsRandomly }
}
