import { renderHook, type RenderHookResult } from "@testing-library/react";

type HookReturn<T extends (...args: any[]) => any> = ReturnType<T>;

export type HookResult<
  T extends (...args: any[]) => any
> = RenderHookResult<HookReturn<T>, undefined>["result"];

export const getHookResult = <T extends (...args: any[]) => any>(hook: T): HookResult<T> => {
  const { result } = renderHook(() => hook());
  return result;
}
