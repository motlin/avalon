import React, { useState, useEffect } from 'react';
import styles from './StartGameEventHandler.module.css';

interface AvalonProps {
  notifyEvent: (event: string, ...args: any[]) => void;
  onEvent?: (callback: (event: string, ...args: any[]) => void) => (() => void);
}

interface StartGameEventHandlerProps {
  avalon: AvalonProps;
}

const StartGameEventHandler: React.FC<StartGameEventHandlerProps> = ({ avalon }) => {
  const [startGameDialog, setStartGameDialog] = useState(false);

  useEffect(() => {
    if (!avalon.onEvent) {
      return;
    }

    const unsubscribe = avalon.onEvent((event: string) => {
      if (event === 'GAME_STARTED') {
        setStartGameDialog(true);
      } else if (event === 'GAME_ENDED') {
        setStartGameDialog(false);
      }
    });

    return unsubscribe;
  }, [avalon]);

  const startGameDialogClosed = () => {
    setStartGameDialog(false);
    avalon.notifyEvent('show-role');
  };

  if (!startGameDialog) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.card}>
          <div className={styles.title}>
            <h3>Game Started</h3>
          </div>
          <div className={styles.content}>
            <p>A new game has started. When you are ready, view your secret role.</p>
            <p>You may also view your role anytime by clicking on your name in the toolbar.</p>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.actions}>
            <button onClick={startGameDialogClosed} className={styles.button}>
              View Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartGameEventHandler;