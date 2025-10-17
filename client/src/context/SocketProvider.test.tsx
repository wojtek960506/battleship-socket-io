import { render } from "@testing-library/react";
import { socket } from "@/socket/socket";
import { SocketProvider } from "./SocketProvider";


jest.mock("@/socket/socket", () => ({
  socket: { connect: jest.fn(), disconnect: jest.fn() },
}));

describe("SocketProvider", () => {
  it("connects socket on mount and disconnects on unmount", () => {
    const { unmount } = render(<SocketProvider><div>child</div></SocketProvider>);

    expect(socket.connect).toHaveBeenCalledTimes(1);
    expect(socket.disconnect).not.toHaveBeenCalled();

    unmount();

    expect(socket.disconnect).toHaveBeenCalledTimes(1);
  });
});