import { act, renderHook } from "@testing-library/react"
import { resetGameStore, useGameStore } from "@/store/GameStore"
import type { BoardCellType, Ship } from "@/types"
import { getEmptyBoard } from "@/utils/board"
import { calculateShipCells, getDefaultShips } from "@/utils/ship"
import { useBoard } from "./useBoard"


describe("test useBoard", () => {

  beforeEach(() => resetGameStore())

  test.each([{
      label: "updateYourBoard",
      setter: "setYourBoard" as const,
      getter: "yourBoard" as const,
      updater: "updateYourBoard" as const,
    }, {
      label: "updateOpponentBoard",
      setter: "setOpponentBoard" as const,
      getter: "opponentBoard" as const,
      updater: "updateOpponentBoard" as const,
    },
  ])("$label", ({ setter, getter, updater }) => {
    const smallBoard: BoardCellType[][] = [
      ["empty", "empty"],
      ["empty", "empty"]
    ]
    useGameStore.getState()[setter](smallBoard.map(row => [...row]));
    expect(useGameStore.getState()[getter]).toEqual(smallBoard);

    const { result } = renderHook(() => useBoard());
    act(() => {
      result.current[updater]([{row:0,column:0}, {row:1,column:1}], "hit");
    })

    smallBoard[0][0] = "hit";
    smallBoard[1][1] = "hit";
    expect(useGameStore.getState()[getter]).toEqual(smallBoard)
  })

  test("placeShipOnBoard - ship not found", () => {
    const { result } = renderHook(() => useBoard());
    act(() => result.current.placeShipOnBoard(5, 5, 5));

    const gameState = useGameStore.getState();
    expect(gameState.yourBoard).toEqual(getEmptyBoard());
    expect(gameState.ships).toEqual(getDefaultShips());
  });

  test("placeShipOnBoard - ship found", () => {
    const { result } = renderHook(() => useBoard());
    act(() => {
      result.current.placeShipOnBoard(0, 1, 2);  
    })
    
    const board: BoardCellType[][] = getEmptyBoard();
    const ships: Ship[] = getDefaultShips();
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
      cells: [
        { row: 1, column: 2 },
        { row: 1, column: 3 },
        { row: 1, column: 4 },
        { row: 1, column: 5 },
        { row: 1, column: 6 },
      ],
    }
    ships[0].surroundingCells = calculateShipCells(ships[0]).surroundingCells

    expect(useGameStore.getState().yourBoard).toEqual(board);
    expect(useGameStore.getState().ships).toEqual(ships);
  })

  test("removeShipFromBoard - ship not found", () => {
    const { result } = renderHook(() => useBoard());
    act(() => result.current.removeShipFromBoard(6));

    const gameState = useGameStore.getState();
    expect(gameState.yourBoard).toEqual(getEmptyBoard());
    expect(gameState.ships).toEqual(getDefaultShips());
  });

  test("removeShipFromBoard - ship found", () => {
    const { result } = renderHook(() => useBoard());
    act(() => {
      result.current.placeShipOnBoard(2, 4, 6);
    })
    
    const board: BoardCellType[][] = getEmptyBoard();
    const ships: Ship[] = getDefaultShips();
    board[4][6] = "taken";
    board[4][7] = "taken";
    board[4][8] = "taken";
    expect(useGameStore.getState().yourBoard).toEqual(board);
    
    act(() => {
      result.current.removeShipFromBoard(2);
    })
    
    board[4][6] = "empty";
    board[4][7] = "empty";
    board[4][8] = "empty";
    ships[2] = {
      ...ships[2],
      startRow: null,
      startColumn: null,
      status: "not-placed",
      cells: [],
      surroundingCells: [],
    }

    expect(useGameStore.getState().yourBoard).toEqual(board);
    expect(useGameStore.getState().ships).toEqual(ships);
  })

})