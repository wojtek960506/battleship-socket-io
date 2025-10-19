import type { Cell, Ship } from "@/types";

type AllShipCells = {
  shipCells: Cell[];
  surroundingCells: Cell[];
}

export const calculateShipCells = (ship: Ship): AllShipCells => {
  const shipCells: Cell[] = [];
  const surroundingCells: Cell[] = [];

  for (let i = 0 ; i < ship.length ; i++) {
    let column = ship.startColumn!;
    let row = ship.startRow!;

    if (ship.direction === "horizontal") {
      column = ship.startColumn! + i

      surroundingCells.push({ row: row - 1, column })
      surroundingCells.push({ row: row + 1, column })
    } else {
      row = ship.startRow! + i

      surroundingCells.push({ row, column: column - 1 })
      surroundingCells.push({ row, column: column + 1 })
    }

    shipCells.push({ column, row })
  }

  const startRow = ship.startRow!
  const startColumn = ship.startColumn!
  if (ship.direction === "horizontal") {
    [-1, 0, 1].forEach(num => {
      surroundingCells.push({ row: startRow + num, column: startColumn - 1 })
      surroundingCells.push({ row: startRow + num, column: startColumn + ship.length })
    });
  } else {
    [-1, 0, 1].forEach(num => {
      surroundingCells.push({ row: startRow -1, column: startColumn + num })
      surroundingCells.push({ row: startRow + ship.length, column: startColumn + num })
    });
  }

  return { shipCells, surroundingCells };
}
