import { CircularProgress } from '@mui/material';
import type AvalonGame from './avalon.js';
import { AvalonProvider, useAvalon } from './AvalonContext';
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

export default function App({ createAvalon }: AppProps) {
  return <AvalonProvider createAvalon={createAvalon}><AppContent /></AvalonProvider>;
}

function AppContent() {
  const avalon = useAvalon();

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
