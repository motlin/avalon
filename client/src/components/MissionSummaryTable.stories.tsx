import type { Meta, StoryObj } from '@storybook/react';
import MissionSummaryTable from './MissionSummaryTable';

const meta: Meta<typeof MissionSummaryTable> = {
  title: 'Components/MissionSummaryTable',
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