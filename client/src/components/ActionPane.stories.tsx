import type { Meta, StoryObj } from '@storybook/react';
import ActionPane from './ActionPane';

const meta: Meta<typeof ActionPane> = {
  component: ActionPane,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The ActionPane component is the primary interface for player actions during an Avalon game. It dynamically displays the appropriate action interface based on the current game state and the player's role.

### Action Types

The component handles four main action types:

1. **Team Proposal** - When you're the proposer, select team members for the mission
2. **Team Voting** - Vote to approve or reject the proposed team
3. **Mission Action** - If you're on the mission team, choose to succeed or fail
4. **Assassination** - If you're the Assassin and evil wins, attempt to identify Merlin

### Game Flow

The ActionPane automatically determines which action to display based on:
- Current game phase (proposal, voting, mission, assassination)
- Player's role and permissions
- Whether the player has already taken their action

### Spectator Mode

When viewing as a spectator or after taking your action, the component displays the current game state without interactive elements.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseAvalon = {
  user: {
    name: 'Alice',
  },
  proposeTeam: (playerList: string[]) => {
    console.log('Proposing team:', playerList);
  },
  vote: (vote: boolean) => {
    console.log('Voting:', vote);
  },
  doMission: (action: boolean) => {
    console.log('Mission action:', action);
  },
  assassinate: (target: string) => {
    console.log('Assassinating:', target);
  },
  lobby: {
    role: {
      role: {
        name: 'Assassin',
        team: 'evil',
        description: 'Can assassinate Merlin at the end',
      },
      assassin: true,
      sees: ['Morgana'],
    },
  },
};

export const TeamProposalPhase: Story = {
  args: {
    avalon: {
      ...baseAvalon,
      game: {
        phase: 'TEAM_PROPOSAL',
        currentProposalIdx: 0,
        currentProposer: 'Alice',
        currentMission: {
          teamSize: 3,
        },
      },
    },
    selectedPlayers: ['Alice', 'Bob', 'Charlie'],
  },
};

export const TeamVotePhase: Story = {
  args: {
    avalon: {
      ...baseAvalon,
      game: {
        phase: 'PROPOSAL_VOTE',
        currentProposal: {
          team: ['Alice', 'Bob', 'Charlie'],
          votes: [],
        },
        currentProposer: 'Alice',
      },
    },
    selectedPlayers: [],
  },
};

export const MissionVotePhase: Story = {
  args: {
    avalon: {
      ...baseAvalon,
      game: {
        phase: 'MISSION_VOTE',
        currentProposal: {
          team: ['Alice', 'Bob', 'Charlie'],
        },
        currentMission: {
          team: ['Alice', 'Bob'],
        },
      },
    },
    selectedPlayers: [],
  },
};

export const AssassinationPhase: Story = {
  args: {
    avalon: {
      ...baseAvalon,
      game: {
        phase: 'ASSASSINATION',
      },
    },
    selectedPlayers: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
  },
};

export const NoActivePhase: Story = {
  args: {
    avalon: {
      ...baseAvalon,
      game: {
        phase: 'GAME_OVER',
      },
    },
    selectedPlayers: [],
  },
};