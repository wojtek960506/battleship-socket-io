import type { Ship } from "@/types";
import { isWithinBoard } from "./isWithinBoard";

test("isWithinBoard", () => {
  let ship = {
    startColumn: 1,
    startRow: 1,
    direction: "horizontal",
    length: 5,
  } as Ship;

  expect(isWithinBoard(ship)).toBeTruthy();
  ship.direction = "vertical";
  expect(isWithinBoard(ship)).toBeTruthy();

  ship.startColumn = null;
  expect(isWithinBoard(ship)).toBeFalsy();
  ship.startColumn = 10;
  expect(isWithinBoard(ship)).toBeFalsy();
  ship.startColumn = -1;
  expect(isWithinBoard(ship)).toBeFalsy();

  ship.startColumn = 1;
  ship.startRow = null;
  expect(isWithinBoard(ship)).toBeFalsy();
  ship.startRow = 10;
  expect(isWithinBoard(ship)).toBeFalsy();
  ship.startRow = -1;
  expect(isWithinBoard(ship)).toBeFalsy();

  ship.startColumn = 6;
  ship.startRow = 6;
  expect(isWithinBoard(ship)).toBeFalsy();

  ship.direction = "horizontal";
  expect(isWithinBoard(ship)).toBeFalsy();  
})