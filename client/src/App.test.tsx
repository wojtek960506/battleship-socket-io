import { render, screen } from '@testing-library/react';
import App from './App';
import { useRoomStore } from './store/RoomStore';
import { renderWithMockSocket } from './test-utils/renderWithMockSocket';


describe("App", () => {
  const mockSocket = { emit: jest.fn() }

  test("show room selection when game is not ready", () => {
    useRoomStore.setState({ status: "idle"})
    renderWithMockSocket(<App />, mockSocket);

    expect(screen.queryByTestId("create-room-btn")).toBeInTheDocument();
    expect(screen.queryByText("Vertical")).not.toBeInTheDocument();
  })

  test("show game screen when setting rooms is finished", () => {
    useRoomStore.setState({ status: "ready"})
    renderWithMockSocket(<App />, mockSocket);

    expect(screen.queryByTestId("create-room-btn")).not.toBeInTheDocument();
    expect(screen.queryByText("Rotate to Vertical")).toBeInTheDocument();
  })

  test('renders app title', () => {
    render(<App />);
    expect(screen.getByText(/Battleship/i)).toBeInTheDocument();

  })
})


