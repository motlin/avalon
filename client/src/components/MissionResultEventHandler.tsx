import React, { useState, useEffect } from 'react';
import styles from './MissionResultEventHandler.module.css';

interface Mission {
  state: 'SUCCESS' | 'FAILURE';
  team: string[];
  numFails: number;
}

interface Game {
  currentMissionIdx: number;
  missions: Mission[];
}

interface Lobby {
  game: Game;
}

interface AvalonProps {
  lobby: Lobby;
  onEvent?: (callback: (event: string, ...args: any[]) => void) => (() => void);
}

interface MissionResultEventHandlerProps {
  avalon: AvalonProps;
}

function joinWithAnd(array: string[]): string {
  if (array.length === 0) return '';
  if (array.length === 1) return array[0];
  if (array.length === 2) return `${array[0]} and ${array[1]}`;
  return `${array.slice(0, -1).join(', ')}, and ${array[array.length - 1]}`;
}

const MissionResultEventHandler: React.FC<MissionResultEventHandlerProps> = ({ avalon }) => {
  const [missionDialog, setMissionDialog] = useState(false);

  useEffect(() => {
    if (!avalon.onEvent) {
      return;
    }

    const unsubscribe = avalon.onEvent((event: string) => {
      if (event === 'GAME_STARTED' || event === 'GAME_ENDED') {
        setMissionDialog(false);
      } else if (event === 'MISSION_RESULT') {
        setMissionDialog(true);
      }
    });

    return unsubscribe;
  }, [avalon]);

  if (!missionDialog) {
    return null;
  }

  const currentMissionIndex = (avalon.lobby.game.currentMissionIdx < 0) ?
    avalon.lobby.game.missions.length : avalon.lobby.game.currentMissionIdx;
  const mission = avalon.lobby.game.missions[currentMissionIndex - 1];

  if (!mission) {
    return null;
  }

  const isSuccess = mission.state === 'SUCCESS';
  const numFails = mission.numFails;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.card}>
          <div className={`${styles.title} ${isSuccess ? styles.success : styles.failure}`}>
            <h3>
              {isSuccess ? (
                <>
                  <span className={`${styles.icon} ${styles.checkIcon}`}>✓</span>
                  Mission Succeeded!
                </>
              ) : (
                <>
                  <span className={`${styles.icon} ${styles.timesIcon}`}>✗</span>
                  Mission Failed!
                </>
              )}
            </h3>
          </div>
          <div className={styles.content}>
            {joinWithAnd(mission.team)} had{' '}
            <span className={styles.bold}>
              {numFails > 0 ? numFails : "no"}
            </span>
            {' '}failure{numFails === 1 ? " vote." : " votes."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionResultEventHandler;