import { useEffect, useState, useSyncExternalStore } from 'react';
import { CircularProgress } from '@mui/material';
import AvalonGame from './avalon.js';
import EventHandler from './components/EventHandler';
import Game from './components/Game';
import Lobby from './components/Lobby';
import Login from './components/Login';
import Toolbar from './components/Toolbar';
import UserLogin from './components/UserLogin';
import styles from './App.module.css';

interface AppProps {
  createAvalon?: () => AvalonGame;
}

const createGame = () => new AvalonGame();

export default function App({ createAvalon = createGame }: AppProps) {
  const [avalon] = useState(createAvalon);
  useSyncExternalStore(avalon.subscribe, avalon.getSnapshot);

  useEffect(() => {
    avalon.init();
    return () => avalon.dispose();
  }, [avalon]);

  return (
    <div className={styles.app}>
      <EventHandler avalon={avalon} />
      {!avalon.initialized ? (
        <main className={styles.centered}>
          <CircularProgress size={150} sx={{ color: '#ffeb3b' }} aria-label="Loading Avalon" />
        </main>
      ) : !avalon.isLoggedIn ? (
        <main className={styles.centered}>
          <UserLogin avalon={avalon} />
        </main>
      ) : (
        <>
          <Toolbar avalon={avalon} />
          <main className={styles.content}>
            {!avalon.isInLobby ? <Login avalon={avalon} />
              : !avalon.isGameInProgress ? <Lobby avalon={avalon} />
                : <Game avalon={avalon} />}
          </main>
        </>
      )}
    </div>
  );
}
