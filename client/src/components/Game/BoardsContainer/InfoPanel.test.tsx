import { act, render, screen } from "@testing-library/react"
import { useRoomStore } from "@/store/RoomStore"
import { PLAYER_ID } from "@/test-utils/constants"
import { InfoPanel } from "./InfoPanel"
import { useGameStore } from "@/store/GameStore"


describe("Info Panel", () => {

  test("show that there is no current player", () => {
    act(() => {
      useRoomStore.getState().setPlayer(PLAYER_ID)
      useGameStore.getState().setCurrentPlayer(null);
    })
    render(<InfoPanel />);

    const playerIdInfo = screen.queryByTestId("info-panel-player-id");
    const currentPlayerInfo = screen.queryByTestId("info-panel-current-player");
    const winnerInfo = screen.queryByTestId("info-panel-winner")
    expect(playerIdInfo).toBeInTheDocument();
    expect(playerIdInfo?.textContent).toContain(PLAYER_ID);
    expect(currentPlayerInfo).toBeInTheDocument();
    expect(currentPlayerInfo?.textContent).toContain('no current player');
    expect(winnerInfo).not.toBeInTheDocument();
  })

  test("show that there is current player", () => {
    act(() => {
      useRoomStore.getState().setPlayer(PLAYER_ID)
      useGameStore.getState().setCurrentPlayer(PLAYER_ID);
    })
    render(<InfoPanel />);

    const playerIdInfo = screen.queryByTestId("info-panel-player-id");
    const currentPlayerInfo = screen.queryByTestId("info-panel-current-player");
    const winnerInfo = screen.queryByTestId("info-panel-winner")
    expect(playerIdInfo).toBeInTheDocument();
    expect(playerIdInfo?.textContent).toContain(PLAYER_ID);
    expect(currentPlayerInfo).toBeInTheDocument();
    expect(currentPlayerInfo?.textContent).toContain(PLAYER_ID);
    expect(winnerInfo).not.toBeInTheDocument();
  })

  test("show that there is winner", () => {
    act(() => {
      useRoomStore.getState().setPlayer(PLAYER_ID)
      useGameStore.getState().setCurrentPlayer(PLAYER_ID);
      useGameStore.getState().setWinner(PLAYER_ID);
    })
    render(<InfoPanel />);

    const playerIdInfo = screen.queryByTestId("info-panel-player-id");
    const currentPlayerInfo = screen.queryByTestId("info-panel-current-player");
    const winnerInfo = screen.queryByTestId("info-panel-winner")
    expect(playerIdInfo).toBeInTheDocument();
    expect(playerIdInfo?.textContent).toContain(PLAYER_ID);
    expect(currentPlayerInfo).not.toBeInTheDocument();
    // expect(currentPlayerInfo?.textContent).toContain(PLAYER_ID);
    expect(winnerInfo).toBeInTheDocument();
    expect(winnerInfo?.textContent).toContain(PLAYER_ID);
  })
})