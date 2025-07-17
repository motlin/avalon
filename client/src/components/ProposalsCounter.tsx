import React from 'react';
import styles from './ProposalsCounter.module.css';

interface Game {
  currentProposalIdx: number;
}

interface AvalonProps {
  game: Game;
}

interface ProposalsCounterProps {
  avalon: AvalonProps;
}

const ProposalsCounter: React.FC<ProposalsCounterProps> = ({ avalon }) => {
  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className={styles.proposalIcon}>
            {avalon.game.currentProposalIdx + 1 === n ? (
              <span className={styles.crown}>👑</span>
            ) : (
              <span className={styles.circle}>●</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalsCounter;