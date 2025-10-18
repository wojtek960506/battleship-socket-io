import { getDefaultShips } from "./getDefaultShips";

test("getDefaultShips", () => {
    const defaultShips = getDefaultShips();
    const defaultLenghts = [5,4,3,3,2];

    expect(defaultShips).toHaveLength(5);
    defaultShips.forEach((ship, index) => {
      expect(ship.id).toBe(index);
      expect(ship.direction).toBe("horizontal");
      expect(ship.startColumn).toBeNull();
      expect(ship.startRow).toBeNull();
      expect(ship.length).toBe(defaultLenghts[index]);
      expect(ship.cells).toHaveLength(0);
      expect(ship.status).toBe("not-placed")
    })
  })