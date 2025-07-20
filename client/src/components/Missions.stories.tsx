import type { Meta, StoryObj } from '@storybook/react';
import Missions from './Missions';

const meta: Meta<typeof Missions> = {
  component: Missions,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    avalon: {
      control: 'object',
      description: 'Avalon game data containing missions and game state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockTeam = {
  joinWithAnd: () => 'ALICE, BOB and CHARLIE'
};

const mockAvalonData = {
  game: {
    missions: [
      {
        state: 'SUCCESS' as const,
        teamSize: 2,
        failsRequired: 1,
        numFails: 0,
        team: mockTeam,
        evilOnTeam: [],
        proposals: [
          {
            proposer: 'ALICE',
            state: 'APPROVED' as const,
            team: ['ALICE', 'BOB'],
            votes: ['ALICE', 'BOB', 'CHARLIE', 'DIANA']
          }
        ],
      },
      {
        state: 'FAIL' as const,
        teamSize: 3,
        failsRequired: 1,
        numFails: 1,
        team: mockTeam,
        evilOnTeam: ['EVE'],
        proposals: [
          {
            proposer: 'BOB',
            state: 'REJECTED' as const,
            team: ['BOB', 'CHARLIE', 'DIANA'],
            votes: ['BOB', 'CHARLIE']
          },
          {
            proposer: 'CHARLIE',
            state: 'APPROVED' as const,
            team: ['ALICE', 'BOB', 'CHARLIE'],
            votes: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE']
          }
        ],
      },
      {
        state: 'PENDING' as const,
        teamSize: 2,
        failsRequired: 1,
        numFails: 0,
        team: mockTeam,
        evilOnTeam: [],
        proposals: [
          {
            proposer: 'DIANA',
            state: 'PENDING' as const,
            team: ['DIANA', 'EVE'],
            votes: []
          }
        ],
      },
      {
        state: 'PENDING' as const,
        teamSize: 3,
        failsRequired: 2,
        numFails: 0,
        team: mockTeam,
        evilOnTeam: [],
        proposals: [],
      },
      {
        state: 'PENDING' as const,
        teamSize: 3,
        failsRequired: 1,
        numFails: 0,
        team: mockTeam,
        evilOnTeam: [],
        proposals: [],
      },
    ],
    currentMissionIdx: 2,
    phase: 'PROPOSAL',
    players: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
    options: {
      inGameLog: false,
    },
  },
  lobby: {
    game: {
      currentMissionIdx: 2,
    },
  },
};

const mockAvalonWithLogs = {
  ...mockAvalonData,
  game: {
    ...mockAvalonData.game,
    options: {
      inGameLog: true,
    },
  },
};

const realGameMissions = [
  {
    state: "FAIL" as const,
    teamSize: 3,
    failsRequired: 1,
    numFails: 1,
    team: {
      joinWithAnd: () => "LUKEE, KEN and VINAY"
    },
    evilOnTeam: ["VINAY"],
    proposals: [
      {
        proposer: "ROB",
        state: "REJECTED" as const,
        team: ["ROB", "KEN", "JUSTIN"],
        votes: ["ROB", "KEN", "JUSTIN", "FLORA"]
      },
      {
        proposer: "JUSTIN",
        state: "APPROVED" as const,
        team: ["LUKEE", "KEN", "VINAY"],
        votes: ["JUSTIN", "FLORA", "VINAY", "KEN", "LUKEE"]
      }
    ],
  },
  {
    state: "SUCCESS" as const,
    teamSize: 4,
    failsRequired: 1,
    numFails: 0,
    team: {
      joinWithAnd: () => "TIFANY, ROB, ZEHUA and CRAIGM"
    },
    evilOnTeam: [],
    proposals: [
      {
        proposer: "TIFANY",
        state: "APPROVED" as const,
        team: ["TIFANY", "ROB", "ZEHUA", "CRAIGM"],
        votes: ["CRAIGM", "ZEHUA", "JUSTIN", "KEN", "FLORA"]
      }
    ],
  },
  {
    state: "PENDING" as const,
    teamSize: 4,
    failsRequired: 1,
    numFails: 0,
    team: {
      joinWithAnd: () => ""
    },
    evilOnTeam: [],
    proposals: [],
  },
  {
    state: "PENDING" as const,
    teamSize: 5,
    failsRequired: 2,
    numFails: 0,
    team: {
      joinWithAnd: () => ""
    },
    evilOnTeam: [],
    proposals: [],
  },
  {
    state: "PENDING" as const,
    teamSize: 5,
    failsRequired: 1,
    numFails: 0,
    team: {
      joinWithAnd: () => ""
    },
    evilOnTeam: [],
    proposals: [],
  }
];

const realGameData = {
  game: {
    missions: realGameMissions,
    currentMissionIdx: 2,
    phase: 'PROPOSAL',
    players: ['CRAIGM', 'ZEHUA', 'VINAY', 'LUKEE', 'KEN', 'ROB', 'JUSTIN', 'TIFANY', 'FLORA'],
    options: {
      inGameLog: true,
    },
  },
  lobby: {
    game: {
      currentMissionIdx: 2,
    },
  },
};

export const Default: Story = {
  args: {
    avalon: mockAvalonData,
  },
};

export const WithInGameLog: Story = {
  args: {
    avalon: mockAvalonWithLogs,
  },
};

export const RealGameData: Story = {
  args: {
    avalon: realGameData,
  },
};

export const AllPending: Story = {
  args: {
    avalon: {
      ...mockAvalonData,
      game: {
        ...mockAvalonData.game,
        missions: mockAvalonData.game.missions.map(m => ({ ...m, state: 'PENDING' as const })),
        currentMissionIdx: 0,
      },
      lobby: {
        game: {
          currentMissionIdx: 0,
        },
      },
    },
  },
};

export const GoodWins: Story = {
  args: {
    avalon: {
      ...mockAvalonData,
      game: {
        ...mockAvalonData.game,
        missions: [
          { ...mockAvalonData.game.missions[0], state: 'SUCCESS' as const },
          { ...mockAvalonData.game.missions[1], state: 'SUCCESS' as const },
          { ...mockAvalonData.game.missions[2], state: 'SUCCESS' as const },
          { ...mockAvalonData.game.missions[3], state: 'PENDING' as const },
          { ...mockAvalonData.game.missions[4], state: 'PENDING' as const },
        ],
        currentMissionIdx: 3,
        phase: 'ASSASSINATION',
      },
      lobby: {
        game: {
          currentMissionIdx: 3,
        },
      },
    },
  },
};

export const EvilWins: Story = {
  args: {
    avalon: {
      ...mockAvalonData,
      game: {
        ...mockAvalonData.game,
        missions: [
          { ...mockAvalonData.game.missions[0], state: 'FAIL' as const },
          { ...mockAvalonData.game.missions[1], state: 'SUCCESS' as const },
          { ...mockAvalonData.game.missions[2], state: 'FAIL' as const },
          { ...mockAvalonData.game.missions[3], state: 'FAIL' as const },
          { ...mockAvalonData.game.missions[4], state: 'PENDING' as const },
        ],
        currentMissionIdx: 4,
        phase: 'GAME_OVER',
      },
      lobby: {
        game: {
          currentMissionIdx: 4,
        },
      },
    },
  },
};