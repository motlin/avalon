import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import AvalonGame from './avalon.js';

const AvalonContext = createContext<AvalonGame | null>(null);
const createGame = () => new AvalonGame();

interface AvalonProviderProps {
  children: ReactNode;
  createAvalon?: () => AvalonGame;
}

export function AvalonProvider({ children, createAvalon = createGame }: AvalonProviderProps) {
  const [avalon] = useState(createAvalon);

  useEffect(() => {
    avalon.init();
    return () => avalon.dispose();
  }, [avalon]);

  return <AvalonContext.Provider value={avalon}>{children}</AvalonContext.Provider>;
}

export function useAvalon() {
  const avalon = useContext(AvalonContext);
  if (!avalon) throw new Error('useAvalon requires an AvalonProvider');
  useSyncExternalStore(avalon.subscribe, avalon.getSnapshot);
  return avalon;
}
