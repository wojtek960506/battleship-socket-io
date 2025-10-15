import { act } from "@testing-library/react";

export type MockSocketType = {
  emit: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
}

export const triggerSocketEvent = (mockSocket: MockSocketType, eventName: string, args: unknown) => {
  const handler = mockSocket.on.mock.calls
    .find(([name]) => name === eventName)?.[1];
  if (!handler) throw new Error(`Handler for '${eventName}' not found`);

  // handler(args) doesn’t return a promise, and I know for sure this is purely synchronous:
  void act(() => handler(args))
}
