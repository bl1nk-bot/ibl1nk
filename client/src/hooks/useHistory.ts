import { useState, useCallback } from "react";

/**
 * Custom hook for managing undo/redo history
 * @template T - Type of state being tracked
 */
export function useHistory<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const state = history[currentIndex];

  const setState = useCallback(
    (newState: T | ((prev: T) => T)) => {
      const nextState =
        typeof newState === "function"
          ? (newState as (prev: T) => T)(state)
          : newState;

      // Remove any future history when making a new change
      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push(nextState);

      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
    },
    [state, history, currentIndex]
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    history: history.slice(0, currentIndex + 1),
  };
}
