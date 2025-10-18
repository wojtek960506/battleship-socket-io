import { useGameStore } from "@/store/GameStore";
import type { Direction } from "@/types";

export const useShips = () => {

  const { ships, setShips } = useGameStore();

  const updateShipsDirection = (ids: number[], direction: Direction) => {
    const newShips = ships.map(ship => 
      ids.includes(ship.id) ? { ...ship, direction }: ship
    )
    setShips(newShips);
  }

  return { updateShipsDirection }
}