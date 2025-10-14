import { type ReactNode } from "react";
import { SocketContext } from "@/context/SocketContext";
import { render } from "@testing-library/react";


export const renderWithMockSocket = (ui: ReactNode, mockSocket: { emit: jest.Mock }) =>
    render(<SocketContext.Provider value={mockSocket as never}>
      {ui}
    </SocketContext.Provider>)
