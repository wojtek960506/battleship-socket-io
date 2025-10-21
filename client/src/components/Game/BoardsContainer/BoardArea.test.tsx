import { render, screen } from "@testing-library/react";
import { BoardArea } from "./BoardArea";

describe("boardArea", () => {
  
  test.each<[mode: "ships-dock" | "waiting" | "opponent-board", dataTestId: string]>([
    ["ships-dock", "ships-dock"],
    ["waiting", "waiting-ships-dock"],
    ["opponent-board", "opponent-board"],
  ])("%s rendered when game status is '%s'", (mode , dataTestId) => {    
    render(<BoardArea mode={mode} />);

    for (const testId of ["ships-dock", "waiting-ships-dock", "opponent-board"]) {
      if (testId === dataTestId) {
        expect(screen.queryByTestId(testId)).toBeInTheDocument();
      } else {
        expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
      }
    }
  })
})