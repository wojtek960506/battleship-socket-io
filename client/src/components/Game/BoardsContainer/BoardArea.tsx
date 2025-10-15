import type { BoardAreaProps } from "../Game";
import { OpponentBoard } from "./Board/OpponentBoard";
import { ShipsDock } from "./ShipsDock/ShipsDock";
import { WaitingShipsDock } from "./WaitingShipsDock";

export const BoardArea = ({ mode }: BoardAreaProps) => {
  switch (mode) {
    case "ship-dock":
      return <ShipsDock />
    case "waiting":
      return <WaitingShipsDock />
    case "opponent-board":
      return <OpponentBoard />
    default:
      return null
  }
}