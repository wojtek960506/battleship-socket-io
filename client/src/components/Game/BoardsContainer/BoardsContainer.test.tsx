import { act, render, screen } from "@testing-library/react";
import { useGameStore } from "@/store/GameStore"
import type { GameStatus } from "@/types";
import { BoardsContainer } from "./BoardsContainer";

describe("BoardsContainer", () => {

  test("click boards area", () => {
    act(() => useGameStore.getState().setChosenShipId(1));
    render(<BoardsContainer />);

    const boardsContainerDiv = screen.queryByTestId("boards-container");
    expect(boardsContainerDiv).toBeInTheDocument();

    expect(useGameStore.getState().chosenShipId).toBe(1);
    act(() => boardsContainerDiv?.click());
    expect(useGameStore.getState().chosenShipId).toBeNull();
  })

  test.each([
    ["ShipsDock", "setting-board", "ships-dock"],
    ["WaitingShipsDock", "board-set", "waiting-ships-dock"],
    ["OpponentBoard", "playing", "opponent-board"],
  ])("%s rendered when game status is '%s'", (_compName, gameStatus, dataTestId) => {
    act(() => useGameStore.getState().setGameStatus(gameStatus as GameStatus));
    render(<BoardsContainer />);

    expect(screen.queryByTestId("your-board")).toBeInTheDocument();
    for (const testId of ["ships-dock", "waiting-ships-dock", "opponent-board"]) {
      if (testId === dataTestId) {
        expect(screen.queryByTestId(testId)).toBeInTheDocument();
      } else {
        expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
      }
    }
  })
})