import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle as faCircleSolid } from '@fortawesome/free-solid-svg-icons';
import { faCircle, faTimesCircle, faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import MissionSummaryTable from './MissionSummaryTable';
import styles from './Missions.module.css';

interface Mission {
  state: 'PENDING' | 'SUCCESS' | 'FAIL';
  teamSize: number;
  failsRequired: number;
  numFails: number;
  team: { joinWithAnd: () => string };
  proposals?: Array<{
    proposer: string;
    team: string[];
    votes: string[];
    state: 'PENDING' | 'APPROVED' | 'REJECTED';
  }>;
}

interface GameData {
  missions: Mission[];
  currentMissionIdx: number;
  phase: string;
  players: string[];
  options?: {
    inGameLog: boolean;
  };
}

interface AvalonData {
  game: GameData;
  lobby: {
    game: {
      currentMissionIdx: number;
    };
  };
}

interface MissionsProps {
  avalon: AvalonData;
}

const Missions: React.FC<MissionsProps> = ({ avalon }) => {
  const [activeMissionTab, setActiveMissionTab] = useState(0);

  const isFutureMission = (mission: Mission, idx: number): boolean => {
    return (idx > 0) && (avalon.game.missions[idx - 1].state === 'PENDING');
  };

  const classForMission = (mission: Mission): string => {
    if (mission.state === 'FAIL') return styles.failMission;
    if (mission.state === 'SUCCESS') return styles.successMission;
    return styles.pendingMission;
  };

  useEffect(() => {
    const currentIdx = avalon.lobby.game.currentMissionIdx;
    if ((currentIdx >= 0) && (currentIdx < 5)) {
      setActiveMissionTab(currentIdx);
    }
  }, [avalon.lobby.game.currentMissionIdx]);

  return (
    <div className={styles.container}>
      <div className={styles.tabsContainer}>
        <div className={styles.tabsList}>
          {avalon.game.missions.map((mission, idx) => (
            <button
              key={`missionTab${idx}`}
              className={`${styles.tab} ${activeMissionTab === idx ? styles.activeTab : ''}`}
              onClick={() => setActiveMissionTab(idx)}
            >
              <div className={styles.iconContainer}>
                {mission.state === 'PENDING' ? (
                  <div className={styles.iconStack}>
                    <FontAwesomeIcon
                      icon={faCircle}
                      color={isFutureMission(mission, idx) ? 'gray' : 'black'}
                      size="2x"
                    />
                    <span className={styles.teamSizeText}>{mission.teamSize}</span>
                  </div>
                ) : mission.state === 'FAIL' ? (
                  <FontAwesomeIcon icon={faTimesCircle} color="red" size="2x" />
                ) : (
                  <FontAwesomeIcon icon={faCheckCircle} color="green" size="2x" />
                )}
                {mission.failsRequired > 1 && (
                  <FontAwesomeIcon
                    icon={faCircleSolid}
                    color="red"
                    className={styles.failsRequiredIndicator}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
        
        <div className={styles.tabContent}>
          {avalon.game.missions.map((mission, idx) => (
            <div
              key={`missionItem${idx}`}
              className={`${styles.tabPanel} ${activeMissionTab === idx ? styles.activePanel : styles.hiddenPanel}`}
            >
              <div className={`${styles.card} ${classForMission(mission)}`}>
                <div className={styles.cardContent}>
                  <div className={styles.missionTitle}>
                    Mission {idx + 1}:{' '}
                    {(idx === avalon.game.currentMissionIdx) && (avalon.game.phase !== 'ASSASSINATION') 
                      ? 'CURRENT' 
                      : mission.state}
                    {mission.numFails > 0 && (
                      <span> ({mission.numFails} {mission.numFails > 1 ? 'fails' : 'fail'})</span>
                    )}
                  </div>
                  
                  {mission.state === 'PENDING' ? (
                    <div className={styles.missionDetails}>
                      Team Size: {mission.teamSize}
                      {mission.failsRequired > 1 && (
                        <span> ({mission.failsRequired} fails required)</span>
                      )}
                    </div>
                  ) : (
                    <div className={styles.missionDetails}>
                      <div>Team: {mission.team.joinWithAnd()}</div>
                    </div>
                  )}
                  
                  {avalon.game.options?.inGameLog && (
                    <MissionSummaryTable
                      players={avalon.game.players}
                      missions={[mission]}
                      roles={null}
                      missionVotes={null}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Missions;