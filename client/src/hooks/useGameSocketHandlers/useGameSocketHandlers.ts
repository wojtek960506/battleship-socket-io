import { useBoardHandlers } from "./useBoardHandlers";
import { useShotHandlers } from "./useShotHandlers";

export const useGameSocketHandlers = () => {
  const boardHandlers = useBoardHandlers();
  const shotHandlers = useShotHandlers();
  
  return { 
    ...boardHandlers,
    ...shotHandlers,
  }
}