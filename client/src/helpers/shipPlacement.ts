import { BOARD_SIZE, calculateShipCells, getBoardPlacingShip, getPlacedShip } from "./utils";
import type { BoardType, Direction, Ship } from "./utils";

export const canShipBePlaced = (ship: Ship, ships: Ship[]) => {
  
  // TODO maybe in the future if I will decide to somehow mark surrounding
  // cell on the board then `board` can be used in this function instead
  // of `ships`. Then there will be less computations

  if (!isWithinBoard(ship)) return false

  const { shipCells } = calculateShipCells(ship);

  const otherShips = ships.filter(s => s.id !== ship.id)

  for (const otherShip of otherShips) {
    for (const cell of shipCells) {
      if (otherShip.cells.some(otherCell => 
        cell.row === otherCell.row && cell.column === otherCell.column 
      )) return false
      if (otherShip.surroundingCells.some(otherCell => 
        cell.row === otherCell.row && cell.column === otherCell.column
      )) return false
    }
  }

  return true
}

export const isWithinBoard = (ship: Ship) => {
  if (ship.startColumn === null || ship.startRow === null) return false;
  if (ship.startColumn < 0 || ship.startRow < 0) return false;

  let finalColumn = ship.startColumn;
  let finalRow = ship.startRow;

  if (ship.direction === "horizontal") finalColumn += ship.length - 1;
  else finalRow += ship.length - 1;
  
  return (finalColumn < BOARD_SIZE && finalRow < BOARD_SIZE);
}

export const findShip = (ships: Ship[], row: number, column: number) => (
  ships.find(s => s.cells.some(cell => cell.row === row && cell.column === column))
)

const getRandomInt = (min: number, max: number) => {
  // ensure min and max are integers
  min = Math.ceil(min);
  max = Math.floor(max);

  // generate a random integer in the inclusive range [min, max]
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomlyPlacedShips = (board: BoardType, ships: Ship[]) => {

  console.log('-----------------------------------------')
  console.log('placeShipsRandomly')

  let placedShips = ships.filter(ship => ship.status === "placed")

  console.log('placed ships before randomization:', [...placedShips])

  let numberOfInvalidRandomPlacements = 0;

  for (const ship of ships) {

    if (ship.status === "placed") continue;

    let isPlacementValid = false;

    let placedShip: Ship;

    while (!isPlacementValid) {

      const startRow: number = getRandomInt(0, 9)
      const startColumn: number = getRandomInt(0,9)
      const direction: Direction = getRandomInt(0,1) === 0 ? "horizontal" : "vertical";

      const newShip = {
        ...ship,
        direction,
        startColumn,
        startRow,
      }

      if (!canShipBePlaced(newShip, placedShips)) {
        numberOfInvalidRandomPlacements += 1;
        // continue;
      } else {
        placedShip = getPlacedShip(newShip, startRow, startColumn);
        placedShips.push(placedShip);
        board = getBoardPlacingShip(board, placedShip)
        isPlacementValid = true;
      }
    }

    
  }

  
  console.log('numberOfInvalidRandomPlacements:', numberOfInvalidRandomPlacements)
  console.log('board:', board)
  console.log('ships:', placedShips)
  console.log('-----------------------------------------')

  return { newBoard: board, newShips: placedShips }

}
