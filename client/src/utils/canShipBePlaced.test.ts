import { canShipBePlaced } from "./canShipBePlaced";
import { getDefaultShips, getPlacedShip } from "./general";
import type { Ship } from "./types";

test("canShipBePlaced", () => {
    let ship = {
      startColumn: null,
      startRow: null,
      direction: "horizontal",
      length: 4,
    } as Ship;
    expect(canShipBePlaced(ship, [])).toBeFalsy();

    const ships = [getDefaultShips()[0]];
    ship.startColumn = 1;
    ship.startRow = 1;
    expect(canShipBePlaced(ship, ships)).toBeTruthy();

    ships[0] = getPlacedShip(ships[0], 2, 2);
    expect(canShipBePlaced(ship, ships)).toBeFalsy();

    ship.startColumn = 0;
    ship.startRow = 0;
    expect(canShipBePlaced(ship, ships)).toBeTruthy();

    ship.direction = "vertical";
    ship.startColumn = 6;
    ship.startRow = 2;
    expect(canShipBePlaced(ship, ships)).toBeFalsy();
  })