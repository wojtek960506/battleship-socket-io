import { act } from "@testing-library/react";
import { useSocket } from "@/context/SocketContext";
import { resetGameStore, useGameStore } from "@/store/GameStore";
import { useRoomStore } from "@/store/RoomStore";
import { getHookResult, type HookResult } from "@/test-utils/getHookResult"
import type { Direction, Ship, ShipStatus } from "@/types";
import { getEmptyBoard } from "@/utils/board";
import { useReceiveShot } from "./useReceiveShot"

const PLAYER_ID = "player_1";
const ROOM_NAME = "room_1";
const OTHER_PLAYER = "player_2";

const COMMON_SHIP_1: Ship = {
  id: 1,
  direction: "horizontal" as Direction,
  startColumn: 1,
  startRow: 1,
  length: 3,
  cells: [
    { row: 1, column: 1 },
    { row: 1, column: 2 },
    { row: 1, column: 3 },
  ],
  surroundingCells: [],
  hitCells: [],
  status: "placed" as ShipStatus,
}

const COMMON_SHIP_2: Ship = {
  id: 2,
  direction: "vertical" as Direction,
  startColumn: 5,
  startRow: 4,
  length: 3,
  cells: [
    { row: 4, column: 5 },
    { row: 5, column: 5 },
    { row: 6, column: 5 },
  ],
  surroundingCells: [],
  hitCells: [
    { row: 4, column: 5 },
    { row: 5, column: 5 },
  ],
  status: "placed" as ShipStatus,
}

const getInitialBoard = () => {
  const board = getEmptyBoard();
  board[1][1] = "taken";
  board[1][2] = "taken";
  board[1][3] = "taken";

  board[4][5] = "hit";
  board[5][5] = "hit";
  board[6][5] = "taken";
  return board;
}

jest.mock("@/context/SocketContext");

describe("useReceiveShot", () => {
  
  let result: HookResult<typeof useReceiveShot>;
  const mockSocket = {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  }

  beforeEach(() => {
    (useSocket as jest.Mock).mockReturnValue(mockSocket);
    act(() => {
      useRoomStore.getState().setPlayer(PLAYER_ID);
      useRoomStore.getState().setRoom(ROOM_NAME);
      resetGameStore();
      result = getHookResult(useReceiveShot);
    })
    jest.clearAllMocks();
  })

  test("receiveMissedShot", () => {
    
    act(() => result.current.receiveMissedShot(1,1));

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "server:shot-result",
      { player: PLAYER_ID, roomName: ROOM_NAME, value: "missed", row: 1, column: 1 }
    )
  })

  test("receiveHitShot - not sunk ship", () => {
    const ships = [{...COMMON_SHIP_1}, {...COMMON_SHIP_2}];
    act(() => {
      useGameStore.getState().setShips([...ships]);
      useGameStore.getState().setYourBoard(getInitialBoard())
    })

    act(() => result.current.receiveHitShot(1, 1, OTHER_PLAYER));

    const board = getInitialBoard();
    board[1][1] = "hit";
    ships[0].hitCells = [{ row: 1, column: 1 }];
  
    const gameState = useGameStore.getState();  
    expect(gameState.ships).toEqual(ships);
    expect(gameState.yourBoard).toEqual(board);
    expect(mockSocket.emit).toHaveBeenCalledWith(
      "server:shot-result",
      {
        player: PLAYER_ID,
        roomName: ROOM_NAME,
        value: "hit",
        row: 1,
        column: 1,
        sunkCells: [],
        isFinished: false,
      }
    );
  })

  // test("receiveHitShot - sunk ship (not the last one)", () => {
  //   const ships = [{...COMMON_SHIP_1}, {...COMMON_SHIP_2}];
  //   act(() => {
  //     useGameStore.getState().setShips([...ships]);
  //     useGameStore.getState().setYourBoard(getInitialBoard())
  //   })

  //   act(() => result.current.receiveHitShot(6, 5, OTHER_PLAYER));

  //   const board = getInitialBoard();
  //   board[4][5] = "sunk";
  //   board[5][5] = "sunk";
  //   board[6][5] = "sunk";
  //   ships[1].hitCells = [...ships[1].cells];
  //   ships[1].status = "sunk";
  
  //   const gameState = useGameStore.getState();  
  //   expect(gameState.ships).toEqual(ships);
  //   expect(gameState.yourBoard).toEqual(board);
  //   expect(mockSocket.emit).toHaveBeenCalledWith(
  //     "server:shot-result",
  //     {
  //       player: PLAYER_ID,
  //       roomName: ROOM_NAME,
  //       value: "sunk",
  //       row: 6,
  //       column: 5,
  //       sunkCells: ships[1].hitCells,
  //       isFinished: false,
  //     }
  //   );
  // })

  test("receiveHitShot - sunk the last ship", () => {
    const ships: Ship[] = [{
        ...COMMON_SHIP_1,
        hitCells: [...COMMON_SHIP_1.cells],
        status: "sunk" as ShipStatus
      }, {
        ...COMMON_SHIP_2
      }
    ];
    act(() => {
      useGameStore.getState().setShips([...ships]);
      useGameStore.getState().setYourBoard(getInitialBoard())
    })

    act(() => result.current.receiveHitShot(6, 5, OTHER_PLAYER));

    const board = getInitialBoard();
    board[4][5] = "sunk";
    board[5][5] = "sunk";
    board[6][5] = "sunk";
    ships[1].hitCells = [...ships[1].cells];
    ships[1].status = "sunk";

  
    const gameState = useGameStore.getState();  
    expect(gameState.ships).toEqual(ships);
    expect(gameState.yourBoard).toEqual(board);
    expect(mockSocket.emit).toHaveBeenCalledWith(
      "server:shot-result",
      {
        player: PLAYER_ID,
        roomName: ROOM_NAME,
        value: "sunk",
        row: 6,
        column: 5,
        sunkCells: ships[1].hitCells,
        isFinished: true,
      }
    );
  })

})