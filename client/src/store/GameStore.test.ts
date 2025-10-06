import { getDefaultShips, getEmptyBoard, type FieldType, type Ship } from "../helpers/utils"
import { resetGameStore, useGameStore } from "./GameStore"


describe("test GameStore", () => {

  beforeEach(() => resetGameStore())

  test("setYourBoard", () => {
    const smallBoard: FieldType[][] = [
      ["empty", "empty"],
      ["empty", "empty"]
    ]
    useGameStore.getState().setYourBoard(smallBoard)
    expect(useGameStore.getState().yourBoard).toEqual(smallBoard)
  })

  test("setOpponentBoardField", () => {
    const smallBoard: FieldType[][] = [
      ["empty", "empty"],
      ["empty", "empty"]
    ]
    useGameStore.getState().setOpponentBoard(smallBoard)
    expect(useGameStore.getState().opponentBoard).toEqual(smallBoard)
    useGameStore.getState().setOpponentBoardField(1,1,"hit");
    useGameStore.getState().setOpponentBoardField(0,1, "missed");
    smallBoard[1][1] = "hit";
    smallBoard[0][1] = "missed";
    expect(useGameStore.getState().opponentBoard).toEqual(smallBoard);
  })

  test("updateShipsDirection", () => {
    const ships: Ship[] = getDefaultShips();

    useGameStore.getState().updateShipsDirection([0,2,4], "vertical")
    ships[0].direction = "vertical"
    ships[2].direction = "vertical"
    ships[4].direction = "vertical"

    expect(useGameStore.getState().ships).toEqual(ships);
  })

  test("placeShipOnBoard", () => {
    const board: FieldType[][] = getEmptyBoard();
    const ships: Ship[] = getDefaultShips();

    useGameStore.getState().placeShipOnBoard(0, 1, 2);
    board[1][2] = "taken";
    board[1][3] = "taken";
    board[1][4] = "taken";
    board[1][5] = "taken";
    board[1][6] = "taken";
    ships[0] = {
      ...ships[0],
      startRow: 1,
      startColumn: 2,
      status: "placed",
      fields: [
        { row: 1, column: 2 },
        { row: 1, column: 3 },
        { row: 1, column: 4 },
        { row: 1, column: 5 },
        { row: 1, column: 6 },
      ]
    }

    expect(useGameStore.getState().yourBoard).toEqual(board);
    expect(useGameStore.getState().ships).toEqual(ships);
  })

    test("removeShipFromBoard", () => {
    const board: FieldType[][] = getEmptyBoard();
    const ships: Ship[] = getDefaultShips();

    useGameStore.getState().placeShipOnBoard(2, 4, 6);
    board[4][6] = "taken";
    board[4][7] = "taken";
    board[4][8] = "taken";
    expect(useGameStore.getState().yourBoard).toEqual(board);
    
    useGameStore.getState().removeShipFromBoard(2)
    board[4][6] = "empty";
    board[4][7] = "empty";
    board[4][8] = "empty";
    ships[2] = {
      ...ships[2],
      startRow: null,
      startColumn: null,
      status: "not-placed",
      fields: []
    }

    expect(useGameStore.getState().yourBoard).toEqual(board);
    expect(useGameStore.getState().ships).toEqual(ships);
  })

  test("moveShipOnBoard", () => {
    const board: FieldType[][] = getEmptyBoard();
    const ships: Ship[] = getDefaultShips();

    
    useGameStore.getState().updateShipsDirection([1], "vertical")
    useGameStore.getState().placeShipOnBoard(1, 1, 2);
    useGameStore.getState().moveShipOnBoard(1, 3, 4);
    board[3][4] = "taken";
    board[4][4] = "taken";
    board[5][4] = "taken";
    board[6][4] = "taken";
    ships[1] = {
      ...ships[1],
      startRow: 3,
      startColumn: 4,
      status: "placed",
      direction: "vertical",
      fields: [
        { row: 3, column: 4 },
        { row: 4, column: 4 },
        { row: 5, column: 4 },
        { row: 6, column: 4 },
      ]
    }
    expect(useGameStore.getState().yourBoard).toEqual(board);
    expect(useGameStore.getState().ships).toEqual(ships);
  })

})