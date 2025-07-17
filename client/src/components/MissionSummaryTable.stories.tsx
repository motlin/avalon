import type { Meta, StoryObj } from '@storybook/react';
import MissionSummaryTable from './MissionSummaryTable';

const meta: Meta<typeof MissionSummaryTable> = {
  component: MissionSummaryTable,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    players: {
      control: 'object',
      description: 'Array of player names',
    },
    missions: {
      control: 'object',
      description: 'Array of mission objects with proposals and teams',
    },
    roles: {
      control: 'object',
      description: 'Optional array of player roles',
    },
    missionVotes: {
      control: 'object',
      description: 'Optional mission voting results',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Real game data from 2025-07-16T19:54:25.962Z_VGZ
const realGamePlayers = ['CRAIGM', 'ZEHUA', 'VINAY', 'LUKEE', 'KEN', 'ROB', 'JUSTIN', 'TIFANY', 'FLORA'];

const realGameRoles = [
  { name: 'FLORA', role: 'MORGANA' },
  { name: 'JUSTIN', role: 'EVIL MINION' },
  { name: 'LUKEE', role: 'ASSASSIN' },
  { name: 'KEN', role: 'MERLIN' },
  { name: 'ZEHUA', role: 'PERCIVAL' },
  { name: 'TIFANY', role: 'LOYAL FOLLOWER' },
  { name: 'CRAIGM', role: 'LOYAL FOLLOWER' },
  { name: 'ROB', role: 'LOYAL FOLLOWER' },
  { name: 'VINAY', role: 'LOYAL FOLLOWER' },
];

const realGameMissions = [
  {
    state: "FAIL",
    teamSize: 3,
    failsRequired: 1,
    team: ["LUKEE", "KEN", "VINAY"],
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
    numFails: 1
  },
  {
    state: "SUCCESS",
    teamSize: 4,
    failsRequired: 1,
    team: ["TIFANY", "ROB", "ZEHUA", "CRAIGM"],
    proposals: [
      {
        proposer: "TIFANY",
        state: "APPROVED" as const,
        team: ["TIFANY", "ROB", "ZEHUA", "CRAIGM"],
        votes: ["CRAIGM", "ZEHUA", "JUSTIN", "KEN", "FLORA"]
      }
    ],
    numFails: 0
  },
  {
    state: "FAIL",
    teamSize: 4,
    failsRequired: 1,
    team: ["LUKEE", "TIFANY", "ROB", "ZEHUA"],
    proposals: [
      {
        proposer: "FLORA",
        state: "REJECTED" as const,
        team: ["FLORA", "TIFANY", "ROB", "CRAIGM"],
        votes: ["FLORA", "ROB", "KEN"]
      },
      {
        proposer: "CRAIGM",
        state: "REJECTED" as const,
        team: ["CRAIGM", "ROB", "TIFANY", "KEN"],
        votes: ["ROB", "CRAIGM", "KEN"]
      },
      {
        proposer: "ZEHUA",
        state: "REJECTED" as const,
        team: ["ZEHUA", "CRAIGM", "ROB", "TIFANY"],
        votes: ["ZEHUA", "CRAIGM", "ROB", "TIFANY"]
      },
      {
        proposer: "VINAY",
        state: "REJECTED" as const,
        team: ["VINAY", "TIFANY", "CRAIGM", "ZEHUA"],
        votes: ["ZEHUA", "VINAY", "TIFANY", "CRAIGM"]
      },
      {
        proposer: "LUKEE",
        state: "APPROVED" as const,
        team: ["LUKEE", "TIFANY", "ROB", "ZEHUA"],
        votes: ["LUKEE", "JUSTIN", "VINAY", "ROB", "ZEHUA", "TIFANY", "CRAIGM", "KEN"]
      }
    ],
    numFails: 1
  },
  {
    state: "SUCCESS",
    teamSize: 5,
    failsRequired: 2,
    team: ["ZEHUA", "CRAIGM", "ROB", "VINAY", "TIFANY"],
    proposals: [
      {
        proposer: "KEN",
        state: "REJECTED" as const,
        team: ["KEN", "ROB", "CRAIGM", "TIFANY", "ZEHUA"],
        votes: ["KEN", "ROB", "CRAIGM"]
      },
      {
        proposer: "ROB",
        state: "REJECTED" as const,
        team: ["TIFANY", "ROB", "CRAIGM", "ZEHUA", "KEN"],
        votes: ["ROB", "CRAIGM", "KEN"]
      },
      {
        proposer: "JUSTIN",
        state: "REJECTED" as const,
        team: ["CRAIGM", "KEN", "JUSTIN", "VINAY", "TIFANY"],
        votes: ["JUSTIN"]
      },
      {
        proposer: "TIFANY",
        state: "APPROVED" as const,
        team: ["ZEHUA", "CRAIGM", "ROB", "VINAY", "TIFANY"],
        votes: ["TIFANY", "ZEHUA", "JUSTIN", "ROB", "VINAY", "CRAIGM", "KEN"]
      }
    ],
    numFails: 0
  },
  {
    state: "SUCCESS",
    teamSize: 5,
    failsRequired: 1,
    team: ["CRAIGM", "ZEHUA", "VINAY", "TIFANY", "ROB"],
    proposals: [
      {
        proposer: "FLORA",
        state: "REJECTED" as const,
        team: ["FLORA", "TIFANY", "ROB", "VINAY", "ZEHUA"],
        votes: ["FLORA"]
      },
      {
        proposer: "CRAIGM",
        state: "REJECTED" as const,
        team: ["CRAIGM", "ZEHUA", "ROB", "VINAY", "TIFANY"],
        votes: ["KEN"]
      },
      {
        proposer: "ZEHUA",
        state: "APPROVED" as const,
        team: ["CRAIGM", "ZEHUA", "VINAY", "TIFANY", "ROB"],
        votes: ["ROB", "CRAIGM", "VINAY", "TIFANY", "KEN"]
      }
    ],
    numFails: 0
  }
];

const realGameMissionVotes = {
  0: {
    'VINAY': true,
    'KEN': true,
    'LUKEE': false
  },
  1: {
    'TIFANY': true,
    'ZEHUA': true,
    'ROB': true,
    'CRAIGM': true
  },
  2: {
    'ROB': true,
    'ZEHUA': true,
    'LUKEE': false,
    'TIFANY': true
  },
  3: {
    'VINAY': true,
    'ROB': true,
    'TIFANY': true,
    'ZEHUA': true,
    'CRAIGM': true
  },
  4: {
    'VINAY': true,
    'ROB': true,
    'TIFANY': true,
    'CRAIGM': true,
    'ZEHUA': true
  }
};

// Legacy sample data for comparison
const samplePlayers = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];

const sampleRoles = [
  { name: 'Alice', role: 'Merlin' },
  { name: 'Bob', role: 'Loyal Follower' },
  { name: 'Charlie', role: 'Percival' },
  { name: 'Diana', role: 'Morgana' },
  { name: 'Eve', role: 'Evil Minion' },
];

const sampleMissions = [
  {
    proposals: [
      {
        proposer: 'Alice',
        team: ['Alice', 'Bob'],
        votes: ['Alice', 'Bob', 'Charlie'],
        state: 'APPROVED' as const,
      },
    ],
    team: ['Alice', 'Bob'],
    state: 'COMPLETED',
  },
  {
    proposals: [
      {
        proposer: 'Diana',
        team: ['Diana', 'Eve', 'Charlie'],
        votes: ['Diana', 'Eve'],
        state: 'REJECTED' as const,
      },
      {
        proposer: 'Bob',
        team: ['Bob', 'Charlie', 'Alice'],
        votes: ['Alice', 'Bob', 'Charlie'],
        state: 'APPROVED' as const,
      },
    ],
    team: ['Bob', 'Charlie', 'Alice'],
    state: 'COMPLETED',
  },
  {
    proposals: [
      {
        proposer: 'Charlie',
        team: ['Charlie', 'Alice', 'Bob'],
        votes: ['Charlie', 'Alice'],
        state: 'PENDING' as const,
      },
    ],
    team: [],
    state: 'PENDING',
  },
];

const sampleMissionVotes = {
  0: {
    'Alice': true,
    'Bob': true,
  },
  1: {
    'Bob': true,
    'Charlie': true,
    'Alice': false,
  },
};

export const RealGameComplete: Story = {
  args: {
    players: realGamePlayers,
    missions: realGameMissions,
    roles: realGameRoles,
    missionVotes: realGameMissionVotes,
  },
};

export const RealGameNoRoles: Story = {
  args: {
    players: realGamePlayers,
    missions: realGameMissions,
    missionVotes: realGameMissionVotes,
  },
};

export const RealGameNoMissionVotes: Story = {
  args: {
    players: realGamePlayers,
    missions: realGameMissions,
    roles: realGameRoles,
  },
};

export const Default: Story = {
  args: {
    players: samplePlayers,
    missions: sampleMissions,
  },
};

export const WithRoles: Story = {
  args: {
    players: samplePlayers,
    missions: sampleMissions,
    roles: sampleRoles,
  },
};

export const WithMissionVotes: Story = {
  args: {
    players: samplePlayers,
    missions: sampleMissions,
    missionVotes: sampleMissionVotes,
  },
};

export const FullExample: Story = {
  args: {
    players: samplePlayers,
    missions: sampleMissions,
    roles: sampleRoles,
    missionVotes: sampleMissionVotes,
  },
};

export const EmptyTable: Story = {
  args: {
    players: samplePlayers,
    missions: [],
  },
};

export const SingleMission: Story = {
  args: {
    players: samplePlayers.slice(0, 3),
    missions: [sampleMissions[0]],
    roles: sampleRoles.slice(0, 3),
  },
};