import type { Meta, StoryObj } from '@storybook/react';
import ActionPane from './ActionPane';

const meta: Meta<typeof ActionPane> = {
  component: ActionPane,
  parameters: {
    layout: 'centered',
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