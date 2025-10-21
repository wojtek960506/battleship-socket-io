import { act, render, screen } from "@testing-library/react"
import { useGameStore } from "@/store/GameStore"
import { useRoomStore } from "@/store/RoomStore"
import { PLAYER_ID } from "@/test-utils/constants"
import { InfoPanel } from "./InfoPanel"


describe("Info Panel", () => {

  test.each([
    ["no current player", PLAYER_ID, null, null],
    ["current player", PLAYER_ID, PLAYER_ID, null],
    ["winner", PLAYER_ID, PLAYER_ID, PLAYER_ID],
  ])("show that there is %s", (_title, player, currentPlayer, winner) => {
    act(() => {
      useRoomStore.getState().setPlayer(player);
      useGameStore.getState().setCurrentPlayer(currentPlayer);
      useGameStore.getState().setWinner(winner);
    })
    render(<InfoPanel />);

    const playerIdInfo = screen.queryByTestId("info-panel-player-id");
    const currentPlayerInfo = screen.queryByTestId("info-panel-current-player");
    const winnerInfo = screen.queryByTestId("info-panel-winner")
    expect(playerIdInfo).toBeInTheDocument();
    expect(playerIdInfo?.textContent).toContain(player);
    if (!winner) {
      expect(currentPlayerInfo).toBeInTheDocument();
      if (!currentPlayer) {
        expect(currentPlayerInfo?.textContent).toContain('no current player');
      } else {
        expect(currentPlayerInfo?.textContent).toContain(currentPlayer);  
      }
    } else {
      expect(currentPlayerInfo).not.toBeInTheDocument();  
    }
    if (winner) {
      expect(winnerInfo).toBeInTheDocument();
      expect(winnerInfo?.textContent).toContain(winner);
    } else {
      expect(winnerInfo).not.toBeInTheDocument();  
    }
  })
})