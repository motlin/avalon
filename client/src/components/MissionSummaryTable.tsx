import React from 'react';
import styles from './MissionSummaryTable.module.css';
import CircleIcon from '@mui/icons-material/Circle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as faThumbsUpRegular, faThumbsDown as faThumbsDownRegular } from '@fortawesome/free-regular-svg-icons';

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
              const validProposals = mission.proposals && mission.proposals.length > 0
                ? mission.proposals.filter(p => p.team && p.team.length > 0)
                : [];
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
                        <span className={styles.proposerIcon}><CircleIcon /></span>
                      )}
                      {isOnTeam && (
                        <span className={styles.teamIcon}><RadioButtonUncheckedIcon /></span>
                      )}
                      {!isPending && (
                        <span className={votedYes ? styles.voteYes : styles.voteNo}>
                          <FontAwesomeIcon icon={votedYes ? faThumbsUpRegular : faThumbsDownRegular} />
                        </span>
                      )}
                    </div>
                  </td>
                );
              });

              const missionVoteCell = missionVotes && (
                <td key={`${player}_mission${missionIndex}`} className={styles.missionResult}>
                  {mission.team.includes(player) && (
                    <span style={{ color: missionVotes[missionIndex]?.[player] ? 'green' : 'red' }}>
                      <FontAwesomeIcon icon={missionVotes[missionIndex]?.[player] ? faCheckCircle : faTimesCircle} />
                    </span>
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
