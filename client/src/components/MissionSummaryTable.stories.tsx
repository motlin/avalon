import type { Meta, StoryObj } from '@storybook/react';
import MissionSummaryTable from './MissionSummaryTable';
import { realGamePlayers, realGameRoles, realGameMissions, realGameMissionVotes } from '../test-data/realGameData';

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

