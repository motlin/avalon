import type { Meta, StoryObj } from '@storybook/react';
import GamePlayerList from './GamePlayerList';

const meta: Meta<typeof GamePlayerList> = {
  component: GamePlayerList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const createMockAvalon = (overrides = {}) => ({
  game: {
    players: ['CRAIGM', 'ZEHUA', 'VINAY', 'LUKEE', 'KEN'],
    phase: 'TEAM_PROPOSAL',
    currentProposer: 'CRAIGM',
    currentProposalIdx: 0,
    currentMission: {
      teamSize: 3,
    },
    currentProposal: {
      team: ['CRAIGM', 'ZEHUA', 'VINAY'],
      votes: ['CRAIGM', 'ZEHUA'],
    },
    lastProposal: null,
    hammer: 'KEN',
  },
  user: {
    name: 'CRAIGM',
  },
  lobby: {
    role: {
      assassin: false,
    },
  },
  ...overrides,
});

export const TeamProposal: Story = {
  args: {
    avalon: createMockAvalon(),
    onSelectedPlayers: (players: string[]) => {
      console.log('Selected players:', players);
    },
  },
};

export const ProposalVoting: Story = {
  args: {
    avalon: createMockAvalon({
      game: {
        players: ['CRAIGM', 'ZEHUA', 'VINAY', 'LUKEE', 'KEN'],
        phase: 'PROPOSAL_VOTE',
        currentProposer: 'CRAIGM',
        currentProposalIdx: 0,
        currentMission: {
          teamSize: 3,
        },
        currentProposal: {
          team: ['CRAIGM', 'ZEHUA', 'VINAY'],
          votes: ['CRAIGM', 'ZEHUA'],
        },
        lastProposal: null,
        hammer: 'KEN',
      },
    }),
    onSelectedPlayers: (players: string[]) => {
      console.log('Selected players:', players);
    },
  },
};

export const MissionVoting: Story = {
  args: {
    avalon: createMockAvalon({
      game: {
        players: ['CRAIGM', 'ZEHUA', 'VINAY', 'LUKEE', 'KEN'],
        phase: 'MISSION_VOTE',
        currentProposer: 'CRAIGM',
        currentProposalIdx: 0,
        currentMission: {
          teamSize: 3,
        },
        currentProposal: {
          team: ['CRAIGM', 'ZEHUA', 'VINAY'],
          votes: ['CRAIGM', 'ZEHUA'],
        },
        lastProposal: null,
        hammer: 'KEN',
      },
    }),
    onSelectedPlayers: (players: string[]) => {
      console.log('Selected players:', players);
    },
  },
};

export const Assassination: Story = {
  args: {
    avalon: createMockAvalon({
      game: {
        players: ['CRAIGM', 'ZEHUA', 'VINAY', 'LUKEE', 'KEN'],
        phase: 'ASSASSINATION',
        currentProposer: 'CRAIGM',
        currentProposalIdx: 0,
        currentMission: {
          teamSize: 3,
        },
        currentProposal: {
          team: ['CRAIGM', 'ZEHUA', 'VINAY'],
          votes: ['CRAIGM', 'ZEHUA', 'VINAY', 'LUKEE', 'KEN'],
        },
        lastProposal: {
          team: ['CRAIGM', 'ZEHUA', 'LUKEE'],
          votes: ['CRAIGM', 'ZEHUA', 'VINAY'],
        },
        hammer: 'KEN',
      },
      lobby: {
        role: {
          assassin: true,
        },
      },
    }),
    onSelectedPlayers: (players: string[]) => {
      console.log('Selected players:', players);
    },
  },
};

export const HammerTime: Story = {
  args: {
    avalon: createMockAvalon({
      game: {
        players: ['CRAIGM', 'ZEHUA', 'VINAY', 'LUKEE', 'KEN'],
        phase: 'TEAM_PROPOSAL',
        currentProposer: 'KEN',
        currentProposalIdx: 4,
        currentMission: {
          teamSize: 3,
        },
        currentProposal: {
          team: [],
          votes: [],
        },
        lastProposal: {
          team: ['CRAIGM', 'ZEHUA', 'LUKEE'],
          votes: ['CRAIGM', 'ZEHUA'],
        },
        hammer: 'KEN',
      },
      user: {
        name: 'KEN',
      },
    }),
    onSelectedPlayers: (players: string[]) => {
      console.log('Selected players:', players);
    },
  },
};
