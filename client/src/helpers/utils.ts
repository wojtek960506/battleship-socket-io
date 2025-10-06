
export type FieldType = "empty" | "hit" | "sunk" | "missed" | "taken";

export type Direction = "horizontal" | "vertical"

export type ShipStatus = "not-placed" | "placed" | "sunk"

export type ShipField = { column: number, row: number }

export type Ship = {
  id: number;
  direction: Direction;
  startColumn: number | null // in UI: 1,2,...
  startRow: number | null // in UI: A,B,...
  length: number
  fields: ShipField[] // maybe for easier detection of sunk
  status: ShipStatus
}

export const getEmptyBoard = (): FieldType[][] => (
  Array(10).fill(null).map(() => Array(10).fill("empty"))
);

export const getDefaultShips = (): Ship[] => (
  [5,4,3,3,2].map((length, i) => ({
    id: i + 1,
    direction: "horizontal",
    startColumn: null,
    startRow: null,
    length,
    fields: [],
    status: "not-placed"
  }))
)

export const calculateShipFields = (ship: Ship): ShipField[] => {
  let shipFields: ShipField[] = [];

  for (let i = 0 ; i < ship.length ; i++) {
    let column = ship.startColumn!;
    let row = ship.startRow!;

    if (ship.direction === "horizontal") {
      column = ship.startColumn! + i
    } else {
      row = ship.startRow! + i
    }

    shipFields.push({ column, row })
  }
  
  return shipFields;
}

export const getPlacedShip = (ship: Ship, startColumn: number, startRow: number, ) => {
  let newShip: Ship = { ...ship, startColumn, startRow, status: "placed" };

  const fields = calculateShipFields(newShip)

  return { ...newShip, fields }
}

export const getRemovedShip = (ship: Ship) => {
  return {
    ...ship,
    startColumn: null,
    startRow: null,
    fields: [],
    status: "not-placed"
  }
}
