import { render, screen } from '@testing-library/react';
import { useRoomStore } from './store/RoomStore';
import App from './App';
import { renderWithMockSocket } from './context/renderWithMockSocket';


describe("App", () => {
  const mockSocket = { emit: jest.fn() }

  test("show room selection when game is not ready", () => {
    useRoomStore.setState({ status: "idle"})
    renderWithMockSocket(<App />, mockSocket);

    expect(screen.queryByTestId("create-room-btn")).toBeInTheDocument();
    expect(screen.queryByText("Game")).not.toBeInTheDocument();
  })

  test("show game screen when setting rooms is finished", () => {
    useRoomStore.setState({ status: "ready"})
    renderWithMockSocket(<App />, mockSocket);

    expect(screen.queryByTestId("create-room-btn")).not.toBeInTheDocument();
    expect(screen.queryByText("Game")).toBeInTheDocument();
  })

  test('renders app title', () => {
    render(<App />);
    expect(screen.getByText(/Battleship/i)).toBeInTheDocument();

  })
})


