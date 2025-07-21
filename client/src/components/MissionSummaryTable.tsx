import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faThumbsUp, faThumbsDown, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle as faCircleOutline, faThumbsUp as faThumbsUpOutline, faThumbsDown as faThumbsDownOutline } from '@fortawesome/free-regular-svg-icons';
import styles from './MissionSummaryTable.module.css';

interface PlayerRole {
  name: string;
  role: string;
}

interface Proposal {
  proposer: string;
  team: string[];
  votes: string[];
  state: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface Mission {
  proposals: Proposal[];
  team: string[];
  state: string;
}

interface MissionSummaryTableProps {
  players: string[];
  missions: Mission[];
  roles?: PlayerRole[];
  missionVotes?: Record<number, Record<string, boolean>>;
}

const MissionSummaryTable: React.FC<MissionSummaryTableProps> = ({
  players,
  missions,
  roles,
  missionVotes
}) => {
  const isCurrentProposal = (mission: Mission, proposal: Proposal) => {
    return mission.state === 'PENDING' && mission.proposals.indexOf(proposal) === mission.proposals.length - 1;
  };

  return (
    <table className={styles.table}>
      <tbody>
        {players.map((player, playerIndex) => (
          <tr key={player} className={playerIndex % 2 === 0 ? styles.evenRow : styles.oddRow}>
            <td className={styles.playerName}>
              <span className={styles.fontWeightMedium}>{player}</span>
            </td>
            {roles && (
              <td className={styles.role}>
                {roles.find(r => r.name === player)?.role}
              </td>
            )}
            {missions.map((mission, missionIndex) => {
              const validProposals = mission.proposals.filter(p => p.team.length > 0);
              const proposalCells = validProposals.map((proposal, proposalIndex) => {
                const isProposer = proposal.proposer === player;
                const isOnTeam = proposal.team.includes(player);
                const votedYes = proposal.votes.includes(player);
                const isPending = proposal.state === 'PENDING';

                return (
                  <td
                    key={`${player}_proposal${missionIndex}_${proposalIndex}`}
                    className={styles.proposalCell}
                  >
                    <div className={styles.iconStack}>
                      {isProposer && (
                        <FontAwesomeIcon
                          icon={faCircle}
                          className={styles.proposerIcon}
                        />
                      )}
                      {isOnTeam && (
                        <FontAwesomeIcon
                          icon={faCircleOutline}
                          className={styles.teamIcon}
                        />
                      )}
                      {!isPending && (
                        <FontAwesomeIcon
                          icon={votedYes ? faThumbsUpOutline : faThumbsDownOutline}
                          className={votedYes ? styles.voteYes : styles.voteNo}
                        />
                      )}
                    </div>
                  </td>
                );
              });

              const missionVoteCell = missionVotes && (
                <td key={`${player}_mission${missionIndex}`} className={styles.missionResult}>
                  {mission.team.includes(player) && (
                    <FontAwesomeIcon
                      icon={missionVotes[missionIndex]?.[player] ? faCheckCircle : faTimesCircle}
                      color={missionVotes[missionIndex]?.[player] ? 'green' : 'red'}
                      size="sm"
                    />
                  )}
                </td>
              );

              return [...proposalCells, missionVoteCell];
            }).flat()}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MissionSummaryTable;
