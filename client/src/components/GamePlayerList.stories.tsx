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
    players: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
    phase: 'TEAM_PROPOSAL',
    currentProposer: 'ALICE',
    currentProposalIdx: 0,
    currentMission: {
      teamSize: 3,
    },
    currentProposal: {
      team: ['ALICE', 'BOB', 'CHARLIE'],
      votes: ['ALICE', 'BOB'],
    },
    lastProposal: null,
    hammer: 'EVE',
  },
  user: {
    name: 'ALICE',
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
        players: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
        phase: 'PROPOSAL_VOTE',
        currentProposer: 'ALICE',
        currentProposalIdx: 0,
        currentMission: {
          teamSize: 3,
        },
        currentProposal: {
          team: ['ALICE', 'BOB', 'CHARLIE'],
          votes: ['ALICE', 'BOB'],
        },
        lastProposal: null,
        hammer: 'EVE',
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
        players: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
        phase: 'MISSION_VOTE',
        currentProposer: 'ALICE',
        currentProposalIdx: 0,
        currentMission: {
          teamSize: 3,
        },
        currentProposal: {
          team: ['ALICE', 'BOB', 'CHARLIE'],
          votes: ['ALICE', 'BOB'],
        },
        lastProposal: null,
        hammer: 'EVE',
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
        players: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
        phase: 'ASSASSINATION',
        currentProposer: 'ALICE',
        currentProposalIdx: 0,
        currentMission: {
          teamSize: 3,
        },
        currentProposal: {
          team: ['ALICE', 'BOB', 'CHARLIE'],
          votes: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
        },
        lastProposal: {
          team: ['ALICE', 'BOB', 'DIANA'],
          votes: ['ALICE', 'BOB', 'CHARLIE'],
        },
        hammer: 'EVE',
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
        players: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
        phase: 'TEAM_PROPOSAL',
        currentProposer: 'EVE',
        currentProposalIdx: 4,
        currentMission: {
          teamSize: 3,
        },
        currentProposal: {
          team: [],
          votes: [],
        },
        lastProposal: {
          team: ['ALICE', 'BOB', 'DIANA'],
          votes: ['ALICE', 'BOB'],
        },
        hammer: 'EVE',
      },
      user: {
        name: 'EVE',
      },
    }),
    onSelectedPlayers: (players: string[]) => {
      console.log('Selected players:', players);
    },
  },
};
