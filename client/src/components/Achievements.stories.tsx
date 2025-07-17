import type { Meta, StoryObj } from '@storybook/react';
import Achievements from './Achievements';

const meta: Meta<typeof Achievements> = {
  title: 'Game/Achievements',
  component: Achievements,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock role map
const mockRoleMap = {
  MERLIN: { team: 'good' },
  PERCIVAL: { team: 'good' },
  LOYAL_SERVANT: { team: 'good' },
  MORGANA: { team: 'evil' },
  ASSASSIN: { team: 'evil' },
  MORDRED: { team: 'evil' },
  OBERON: { team: 'evil' },
  MINION: { team: 'evil' },
};

// Helper to create a basic mission
const createMission = (state: string, team: string[], numFails = 0, failsRequired = 1) => ({
  state,
  team,
  numFails,
  failsRequired,
  proposals: [
    {
      proposer: team[0],
      team,
      state: 'APPROVED',
      votes: team,
    },
  ],
});

export const NoBadges: Story = {
  args: {
    avalon: {
      lobby: {
        game: {
          players: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
          missions: [
            createMission('SUCCESS', ['Alice', 'Bob']),
            createMission('SUCCESS', ['Charlie', 'Diana']),
            createMission('SUCCESS', ['Alice', 'Charlie', 'Eve']),
            createMission('PENDING', []),
            createMission('PENDING', []),
          ],
          outcome: {
            state: 'GOOD_WIN',
            roles: [
              { name: 'Alice', role: 'MERLIN' },
              { name: 'Bob', role: 'PERCIVAL' },
              { name: 'Charlie', role: 'LOYAL_SERVANT' },
              { name: 'Diana', role: 'MORGANA' },
              { name: 'Eve', role: 'ASSASSIN' },
            ],
          },
        },
      },
      config: {
        roleMap: mockRoleMap,
      },
    },
  },
};

export const CleanSweepGood: Story = {
  args: {
    avalon: {
      lobby: {
        game: {
          players: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
          missions: [
            createMission('SUCCESS', ['Alice', 'Bob']),
            createMission('SUCCESS', ['Charlie', 'Alice']),
            createMission('SUCCESS', ['Alice', 'Charlie', 'Bob']),
            createMission('PENDING', []),
            createMission('PENDING', []),
          ],
          outcome: {
            state: 'GOOD_WIN',
            roles: [
              { name: 'Alice', role: 'MERLIN' },
              { name: 'Bob', role: 'PERCIVAL' },
              { name: 'Charlie', role: 'LOYAL_SERVANT' },
              { name: 'Diana', role: 'MORGANA' },
              { name: 'Eve', role: 'ASSASSIN' },
            ],
          },
        },
      },
      config: {
        roleMap: mockRoleMap,
      },
    },
  },
};

export const CleanSweepEvil: Story = {
  args: {
    avalon: {
      lobby: {
        game: {
          players: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
          missions: [
            createMission('FAIL', ['Alice', 'Diana'], 1),
            createMission('FAIL', ['Bob', 'Eve'], 1),
            createMission('FAIL', ['Charlie', 'Diana', 'Eve'], 2, 2),
            createMission('PENDING', []),
            createMission('PENDING', []),
          ],
          outcome: {
            state: 'EVIL_WIN',
            roles: [
              { name: 'Alice', role: 'MERLIN' },
              { name: 'Bob', role: 'PERCIVAL' },
              { name: 'Charlie', role: 'LOYAL_SERVANT' },
              { name: 'Diana', role: 'MORGANA' },
              { name: 'Eve', role: 'ASSASSIN' },
            ],
          },
        },
      },
      config: {
        roleMap: mockRoleMap,
      },
    },
  },
};

export const TrustingBunch: Story = {
  args: {
    avalon: {
      lobby: {
        game: {
          players: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
          missions: [
            {
              state: 'SUCCESS',
              team: ['Alice', 'Bob'],
              numFails: 0,
              failsRequired: 1,
              proposals: [
                {
                  proposer: 'Alice',
                  team: ['Alice', 'Bob'],
                  state: 'APPROVED',
                  votes: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
                },
              ],
            },
            createMission('SUCCESS', ['Charlie', 'Diana']),
            createMission('SUCCESS', ['Alice', 'Charlie', 'Eve']),
            createMission('PENDING', []),
            createMission('PENDING', []),
          ],
          outcome: {
            state: 'GOOD_WIN',
            roles: [
              { name: 'Alice', role: 'MERLIN' },
              { name: 'Bob', role: 'PERCIVAL' },
              { name: 'Charlie', role: 'LOYAL_SERVANT' },
              { name: 'Diana', role: 'MORGANA' },
              { name: 'Eve', role: 'ASSASSIN' },
            ],
          },
        },
      },
      config: {
        roleMap: mockRoleMap,
      },
    },
  },
};

export const AssassinationBadges: Story = {
  args: {
    avalon: {
      lobby: {
        game: {
          players: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
          missions: [
            createMission('SUCCESS', ['Alice', 'Bob']),
            createMission('SUCCESS', ['Charlie', 'Alice']),
            createMission('SUCCESS', ['Alice', 'Charlie', 'Bob']),
            createMission('PENDING', []),
            createMission('PENDING', []),
          ],
          outcome: {
            state: 'EVIL_WIN',
            roles: [
              { name: 'Alice', role: 'MERLIN' },
              { name: 'Bob', role: 'PERCIVAL' },
              { name: 'Charlie', role: 'LOYAL_SERVANT' },
              { name: 'Diana', role: 'MORGANA' },
              { name: 'Eve', role: 'ASSASSIN' },
            ],
            assassinated: 'Bob',
          },
        },
      },
      config: {
        roleMap: mockRoleMap,
      },
    },
  },
};

export const TrustYou: Story = {
  args: {
    avalon: {
      lobby: {
        game: {
          players: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
          missions: [
            {
              state: 'SUCCESS',
              team: ['Bob', 'Charlie'],
              numFails: 0,
              failsRequired: 1,
              proposals: [
                {
                  proposer: 'Alice',
                  team: ['Bob', 'Charlie'],
                  state: 'APPROVED',
                  votes: ['Alice', 'Bob', 'Charlie'],
                },
              ],
            },
            createMission('SUCCESS', ['Diana', 'Alice']),
            createMission('SUCCESS', ['Alice', 'Charlie', 'Bob']),
            createMission('PENDING', []),
            createMission('PENDING', []),
          ],
          outcome: {
            state: 'GOOD_WIN',
            roles: [
              { name: 'Alice', role: 'MERLIN' },
              { name: 'Bob', role: 'PERCIVAL' },
              { name: 'Charlie', role: 'LOYAL_SERVANT' },
              { name: 'Diana', role: 'MORGANA' },
              { name: 'Eve', role: 'ASSASSIN' },
            ],
          },
        },
      },
      config: {
        roleMap: mockRoleMap,
      },
    },
  },
};

export const CanceledGame: Story = {
  args: {
    avalon: {
      lobby: {
        game: {
          players: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
          missions: [],
          outcome: {
            state: 'CANCELED',
            roles: [],
          },
        },
      },
      config: {
        roleMap: mockRoleMap,
      },
    },
  },
};