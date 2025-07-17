import type { Meta, StoryObj } from '@storybook/react';
import StatsDisplay from './StatsDisplay';

const meta: Meta<typeof StatsDisplay> = {
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