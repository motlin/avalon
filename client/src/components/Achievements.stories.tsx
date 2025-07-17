import type { Meta, StoryObj } from '@storybook/react';
import Achievements from './Achievements';

const meta: Meta<typeof Achievements> = {
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
  'LOYAL FOLLOWER': { team: 'good' },
  MORGANA: { team: 'evil' },
  ASSASSIN: { team: 'evil' },
  MORDRED: { team: 'evil' },
  OBERON: { team: 'evil' },
  'EVIL MINION': { team: 'evil' },
};

// Helper to create a basic mission
const createMission = (state: string, team: string[], numFails = 0, failsRequired = 1, teamSize?: number) => ({
  state,
  team,
  numFails,
  failsRequired,
  teamSize: teamSize || team.length,
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

export const CleanSweepGood: Story = {
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
              teamSize: 2,
              proposals: [
                {
                  proposer: 'Alice',
                  team: ['Alice', 'Diana'],
                  state: 'REJECTED',
                  votes: ['Alice', 'Diana'],
                },
                {
                  proposer: 'Bob',
                  team: ['Alice', 'Bob'],
                  state: 'APPROVED',
                  votes: ['Alice', 'Bob', 'Charlie'],
                },
              ],
            },
            createMission('SUCCESS', ['Charlie', 'Bob'], 0, 1, 2),
            createMission('SUCCESS', ['Alice', 'Charlie', 'Bob'], 0, 1, 3),
            createMission('PENDING', [], 0, 2, 4),
            createMission('PENDING', [], 0, 1, 4),
          ],
          outcome: {
            state: 'GOOD_WIN',
            roles: [
              { name: 'Alice', role: 'LOYAL FOLLOWER' },
              { name: 'Bob', role: 'LOYAL FOLLOWER' },
              { name: 'Charlie', role: 'LOYAL FOLLOWER' },
              { name: 'Diana', role: 'EVIL MINION' },
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
          players: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'],
          missions: [
            {
              state: 'FAIL',
              team: ['Alice', 'Diana'],
              numFails: 1,
              failsRequired: 1,
              teamSize: 2,
              proposals: [
                {
                  proposer: 'Alice',
                  team: ['Alice', 'Bob'],
                  state: 'REJECTED',
                  votes: ['Alice', 'Bob'],
                },
                {
                  proposer: 'Bob',
                  team: ['Alice', 'Diana'],
                  state: 'APPROVED',
                  votes: ['Alice', 'Diana', 'Eve', 'Frank'],
                },
              ],
            },
            createMission('FAIL', ['Bob', 'Eve', 'Charlie'], 1, 1, 3),
            createMission('FAIL', ['Diana', 'Eve', 'Frank', 'Alice'], 2, 2, 4),
            createMission('PENDING', [], 0, 2, 4),
            createMission('PENDING', [], 0, 1, 5),
          ],
          outcome: {
            state: 'EVIL_WIN',
            roles: [
              { name: 'Alice', role: 'LOYAL FOLLOWER' },
              { name: 'Bob', role: 'LOYAL FOLLOWER' },
              { name: 'Charlie', role: 'LOYAL FOLLOWER' },
              { name: 'Diana', role: 'MORGANA' },
              { name: 'Eve', role: 'ASSASSIN' },
              { name: 'Frank', role: 'EVIL MINION' },
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
              team: ['Alice', 'Bob', 'Charlie'],
              numFails: 0,
              failsRequired: 1,
              teamSize: 3,
              proposals: [
                {
                  proposer: 'Alice',
                  team: ['Alice', 'Bob', 'Charlie'],
                  state: 'APPROVED',
                  votes: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
                },
              ],
            },
            {
              state: 'FAIL',
              team: ['Diana', 'Eve', 'Bob'],
              numFails: 1,
              failsRequired: 1,
              teamSize: 3,
              proposals: [
                {
                  proposer: 'Bob',
                  team: ['Diana', 'Eve', 'Bob'],
                  state: 'APPROVED',
                  votes: ['Diana', 'Eve', 'Bob'],
                },
              ],
            },
            {
              state: 'SUCCESS',
              team: ['Alice', 'Charlie', 'Eve'],
              numFails: 0,
              failsRequired: 1,
              teamSize: 3,
              proposals: [
                {
                  proposer: 'Charlie',
                  team: ['Alice', 'Charlie', 'Eve'],
                  state: 'APPROVED',
                  votes: ['Alice', 'Charlie', 'Eve'],
                },
              ],
            },
            {
              state: 'FAIL',
              team: ['Diana', 'Bob', 'Alice', 'Charlie'],
              numFails: 1,
              failsRequired: 2,
              teamSize: 4,
              proposals: [
                {
                  proposer: 'Diana',
                  team: ['Diana', 'Bob', 'Alice', 'Charlie'],
                  state: 'APPROVED',
                  votes: ['Diana', 'Bob', 'Alice', 'Charlie'],
                },
              ],
            },
            createMission('PENDING', [], 0, 1, 4),
          ],
          outcome: {
            state: 'EVIL_WIN',
            roles: [
              { name: 'Alice', role: 'LOYAL FOLLOWER' },
              { name: 'Bob', role: 'LOYAL FOLLOWER' },
              { name: 'Charlie', role: 'LOYAL FOLLOWER' },
              { name: 'Diana', role: 'EVIL MINION' },
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

export const TakingABullet: Story = {
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
              teamSize: 2,
              proposals: [
                {
                  proposer: 'Alice',
                  team: ['Alice', 'Diana'],
                  state: 'REJECTED',
                  votes: ['Alice', 'Diana'],
                },
                {
                  proposer: 'Bob',
                  team: ['Alice', 'Bob'],
                  state: 'APPROVED',
                  votes: ['Alice', 'Bob', 'Charlie', 'Eve'],
                },
              ],
            },
            createMission('SUCCESS', ['Charlie', 'Bob'], 0, 1, 2),
            createMission('SUCCESS', ['Alice', 'Charlie', 'Bob'], 0, 1, 3),
            createMission('PENDING', [], 0, 2, 4),
            createMission('PENDING', [], 0, 1, 4),
          ],
          outcome: {
            state: 'EVIL_WIN',
            roles: [
              { name: 'Alice', role: 'MERLIN' },
              { name: 'Bob', role: 'PERCIVAL' },
              { name: 'Charlie', role: 'LOYAL FOLLOWER' },
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

export const TrustYouGuys: Story = {
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
              teamSize: 2,
              proposals: [
                {
                  proposer: 'Alice',
                  team: ['Bob', 'Charlie'],
                  state: 'APPROVED',
                  votes: ['Alice', 'Bob', 'Charlie'],
                },
              ],
            },
            {
              state: 'FAIL',
              team: ['Diana', 'Eve'],
              numFails: 1,
              failsRequired: 1,
              teamSize: 2,
              proposals: [
                {
                  proposer: 'Bob',
                  team: ['Diana', 'Eve'],
                  state: 'REJECTED',
                  votes: ['Diana', 'Eve'],
                },
                {
                  proposer: 'Charlie',
                  team: ['Diana', 'Eve'],
                  state: 'APPROVED',
                  votes: ['Charlie', 'Diana', 'Eve'],
                },
              ],
            },
            createMission('SUCCESS', ['Alice', 'Bob'], 0, 1, 2),
            createMission('FAIL', ['Diana', 'Eve', 'Charlie'], 1, 1, 3),
            createMission('PENDING', [], 0, 1, 4),
          ],
          outcome: {
            state: 'EVIL_WIN',
            roles: [
              { name: 'Alice', role: 'LOYAL FOLLOWER' },
              { name: 'Bob', role: 'LOYAL FOLLOWER' },
              { name: 'Charlie', role: 'LOYAL FOLLOWER' },
              { name: 'Diana', role: 'EVIL MINION' },
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

export const PerfectCoordination: Story = {
  args: {
    avalon: {
      lobby: {
        game: {
          players: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'],
          missions: [
            createMission('SUCCESS', ['Alice', 'Bob'], 0, 1, 2),
            createMission('FAIL', ['Charlie', 'Diana', 'Eve'], 1, 1, 3),
            createMission('SUCCESS', ['Alice', 'Bob', 'Frank'], 0, 1, 3),
            {
              state: 'FAIL',
              team: ['Diana', 'Eve', 'Frank', 'Charlie'],
              numFails: 2,
              failsRequired: 2,
              teamSize: 4,
              proposals: [
                {
                  proposer: 'Diana',
                  team: ['Diana', 'Eve', 'Alice', 'Bob'],
                  state: 'REJECTED',
                  votes: ['Diana', 'Eve'],
                },
                {
                  proposer: 'Eve',
                  team: ['Diana', 'Eve', 'Frank', 'Charlie'],
                  state: 'APPROVED',
                  votes: ['Diana', 'Eve', 'Frank', 'Charlie'],
                },
              ],
            },
            createMission('PENDING', [], 0, 1, 5),
          ],
          outcome: {
            state: 'EVIL_WIN',
            roles: [
              { name: 'Alice', role: 'LOYAL FOLLOWER' },
              { name: 'Bob', role: 'LOYAL FOLLOWER' },
              { name: 'Charlie', role: 'LOYAL FOLLOWER' },
              { name: 'Diana', role: 'MORGANA' },
              { name: 'Eve', role: 'ASSASSIN' },
              { name: 'Frank', role: 'EVIL MINION' },
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

export const ReversalOfFortune: Story = {
  args: {
    avalon: {
      lobby: {
        game: {
          players: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
          missions: [
            createMission('FAIL', ['Alice', 'Diana'], 1, 1, 2),
            createMission('FAIL', ['Bob', 'Eve'], 1, 1, 2),
            createMission('SUCCESS', ['Alice', 'Bob', 'Charlie'], 0, 1, 3),
            createMission('SUCCESS', ['Alice', 'Bob', 'Charlie'], 0, 2, 4),
            createMission('SUCCESS', ['Alice', 'Bob', 'Charlie', 'Frank'], 0, 1, 4),
          ],
          outcome: {
            state: 'GOOD_WIN',
            roles: [
              { name: 'Alice', role: 'MERLIN' },
              { name: 'Bob', role: 'PERCIVAL' },
              { name: 'Charlie', role: 'LOYAL FOLLOWER' },
              { name: 'Diana', role: 'MORGANA' },
              { name: 'Eve', role: 'ASSASSIN' },
              { name: 'Frank', role: 'LOYAL FOLLOWER' },
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

export const MerlinBetrayal: Story = {
  args: {
    avalon: {
      lobby: {
        game: {
          players: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
          missions: [
            createMission('SUCCESS', ['Bob', 'Charlie'], 0, 1, 2),
            {
              state: 'FAIL',
              team: ['Alice', 'Diana', 'Eve'],
              numFails: 2,
              failsRequired: 1,
              teamSize: 3,
              proposals: [
                {
                  proposer: 'Charlie',
                  team: ['Bob', 'Charlie', 'Diana'],
                  state: 'REJECTED',
                  votes: ['Bob', 'Charlie'],
                },
                {
                  proposer: 'Diana',
                  team: ['Alice', 'Diana', 'Eve'],
                  state: 'REJECTED',
                  votes: ['Diana', 'Eve'],
                },
                {
                  proposer: 'Eve',
                  team: ['Alice', 'Diana', 'Eve'],
                  state: 'REJECTED',
                  votes: ['Diana', 'Eve'],
                },
                {
                  proposer: 'Alice',
                  team: ['Alice', 'Diana', 'Eve'],
                  state: 'APPROVED',
                  votes: ['Alice', 'Diana', 'Eve'],
                },
              ],
            },
            createMission('SUCCESS', ['Bob', 'Charlie', 'Alice'], 0, 1, 3),
            createMission('FAIL', ['Diana', 'Eve', 'Bob', 'Charlie'], 1, 2, 4),
            createMission('PENDING', [], 0, 1, 4),
          ],
          outcome: {
            state: 'EVIL_WIN',
            roles: [
              { name: 'Alice', role: 'MERLIN' },
              { name: 'Bob', role: 'PERCIVAL' },
              { name: 'Charlie', role: 'LOYAL FOLLOWER' },
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