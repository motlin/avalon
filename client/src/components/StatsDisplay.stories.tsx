import type { Meta, StoryObj } from '@storybook/react';
import StatsDisplay from './StatsDisplay';

const meta: Meta<typeof StatsDisplay> = {
  title: 'Game/StatsDisplay',
  component: StatsDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    stats: {
      control: 'object',
      description: 'Player statistics object',
    },
    globalStats: {
      control: 'object',
      description: 'Global statistics for all users (optional)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicStats: Story = {
  args: {
    stats: {
      games: 50,
      good: 25,
      wins: 30,
      good_wins: 18,
      playtimeSeconds: 7200, // 2 hours
    },
  },
};

export const NewPlayer: Story = {
  args: {
    stats: {
      games: 2,
      good: 1,
      wins: 1,
      good_wins: 1,
      playtimeSeconds: 300, // 5 minutes
    },
  },
};

export const ExperiencedPlayer: Story = {
  args: {
    stats: {
      games: 200,
      good: 100,
      wins: 120,
      good_wins: 65,
      playtimeSeconds: 28800, // 8 hours
    },
  },
};

export const WithGlobalStats: Story = {
  args: {
    stats: {
      games: 75,
      good: 40,
      wins: 45,
      good_wins: 28,
      playtimeSeconds: 10800, // 3 hours
    },
    globalStats: {
      games: 10000,
      good_wins: 5500,
    },
  },
};

export const EmptyStats: Story = {
  args: {
    stats: {},
  },
};

export const EvilPreference: Story = {
  args: {
    stats: {
      games: 30,
      good: 8,
      wins: 18,
      good_wins: 2,
      playtimeSeconds: 5400, // 1.5 hours
    },
  },
};