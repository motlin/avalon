import type { Meta, StoryObj } from '@storybook/react';
import GameParticipants from './GameParticipants';

const meta: Meta<typeof GameParticipants> = {
  component: GameParticipants,
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
    roles: ['merlin', 'percival', 'loyal_follower', 'morgana', 'evil_minion'],
  },
  user: {
    name: 'ALICE',
  },
  lobby: {
    role: {
      assassin: false,
    },
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
      roles: ['merlin', 'percival', 'loyal_follower', 'morgana', 'evil_minion'],
    },
  },
  config: {
    roleMap: {
      merlin: {
        name: 'Merlin',
        team: 'good' as const,
        description: 'Merlin sees all evil people (except for Mordred), but can also be assassinated.',
      },
      percival: {
        name: 'Percival',
        team: 'good' as const,
        description: "Percival can see Merlin and Morgana but does not know which one is which.",
      },
      loyal_follower: {
        name: 'Loyal Follower',
        team: 'good' as const,
        description: 'Loyal Follower is a genuinely good person.',
      },
      morgana: {
        name: 'Morgana',
        team: 'evil' as const,
        description: "Morgana appears indistinguishable from Merlin to Percival. She sees other evil people (except Oberon)",
      },
      evil_minion: {
        name: 'Evil Minion',
        team: 'evil' as const,
        description: 'Evil Minion is pretty evil. He can see other evil people (except Oberon)',
      },
    },
  },
  ...overrides,
});

export const Default: Story = {
  args: {
    avalon: createMockAvalon(),
    onSelectedPlayers: (players: string[]) => console.log('Selected players:', players),
  },
};

export const DuringMission: Story = {
  args: {
    avalon: createMockAvalon({
      game: {
        players: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
        phase: 'MISSION',
        currentProposer: 'BOB',
        currentProposalIdx: 1,
        currentMission: {
          teamSize: 4,
        },
        currentProposal: {
          team: ['BOB', 'CHARLIE', 'DIANA', 'EVE'],
          votes: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
        },
        lastProposal: {
          team: ['ALICE', 'BOB', 'CHARLIE'],
          votes: ['ALICE', 'BOB'],
        },
        hammer: 'CHARLIE',
        roles: ['merlin', 'percival', 'loyal_follower', 'morgana', 'evil_minion'],
      },
    }),
    onSelectedPlayers: (players: string[]) => console.log('Selected players:', players),
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
          team: ['EVE', 'ALICE', 'BOB'],
          votes: [],
        },
        lastProposal: {
          team: ['CHARLIE', 'DIANA', 'EVE'],
          votes: ['CHARLIE', 'DIANA'],
        },
        hammer: 'EVE',
        roles: ['merlin', 'percival', 'loyal_follower', 'morgana', 'evil_minion'],
      },
    }),
    onSelectedPlayers: (players: string[]) => console.log('Selected players:', players),
  },
};