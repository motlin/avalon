import type { Meta, StoryObj } from '@storybook/react';
import Login from './Login';

const meta: Meta<typeof Login> = {
  component: Login,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs', 'test'],
  argTypes: {
    avalon: {
      control: 'object',
      description: 'Avalon API object with user data and methods',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockAvalonApi = {
  user: {
    name: 'TESTUSER',
    email: 'test@example.com',
    stats: {
      games: 25,
      good: 15,
      wins: 18,
      good_wins: 12,
      playtimeSeconds: 3600,
    },
  },
  globalStats: {
    games: 5000,
    good_wins: 2750,
  },
  createLobby: async (name: string) => {
    console.log('Create lobby called with name:', name);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  },
  joinLobby: async (name: string, lobby: string) => {
    console.log('Join lobby called with name:', name, 'lobby:', lobby);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  },
};

const mockAvalonApiError = {
  ...mockAvalonApi,
  createLobby: async () => {
    throw new Error('Failed to create lobby');
  },
  joinLobby: async () => {
    throw new Error('Lobby not found');
  },
};

export const WithUser: Story = {
  args: {
    avalon: mockAvalonApi,
  },
};

export const WithoutUser: Story = {
  args: {
    avalon: {
      ...mockAvalonApi,
      user: undefined,
    },
  },
};

export const EmptyStats: Story = {
  args: {
    avalon: {
      ...mockAvalonApi,
      user: {
        ...mockAvalonApi.user,
        stats: {},
      },
      globalStats: undefined,
    },
  },
};

export const ErrorScenario: Story = {
  args: {
    avalon: mockAvalonApiError,
  },
};
