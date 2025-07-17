import type { Meta, StoryObj } from '@storybook/react';
import AssassinationAction from './AssassinationAction';

const meta = {
  component: AssassinationAction,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    avalon: {
      description: 'Avalon game state object containing lobby role information and user data',
    },
    playerList: {
      description: 'Array of player names available for assassination',
    },
  },
} satisfies Meta<typeof AssassinationAction>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockAvalonAssassin = {
  lobby: {
    role: {
      role: {
        name: 'ASSASSIN',
        team: 'evil',
        description: 'The same as Evil Minion, but guaranteed to be the Assassin.',
      },
      assassin: true,
      sees: ['MORGANA', 'MORDRED', 'EVIL MINION'],
    },
  },
  user: {
    name: 'player1',
  },
  assassinate: async (target: string) => {
    console.log(`Assassinating ${target}`);
    return Promise.resolve();
  },
};

const mockAvalonNonAssassin = {
  lobby: {
    role: {
      role: {
        name: 'MORGANA',
        team: 'evil',
        description: 'Morgana appears indistinguishable from Merlin to Percival.',
      },
      assassin: false,
      sees: ['MORDRED', 'ASSASSIN', 'EVIL MINION'],
    },
  },
  user: {
    name: 'player1',
  },
  assassinate: async (target: string) => {
    console.log(`Assassinating ${target}`);
    return Promise.resolve();
  },
};

export const AssassinWithValidTarget: Story = {
  args: {
    avalon: mockAvalonAssassin,
    playerList: ['merlin'],
  },
};

export const AssassinWithInvalidTargetSelf: Story = {
  args: {
    avalon: mockAvalonAssassin,
    playerList: ['player1'],
  },
};

export const AssassinWithNoTarget: Story = {
  args: {
    avalon: mockAvalonAssassin,
    playerList: [],
  },
};

export const AssassinWithMultipleTargets: Story = {
  args: {
    avalon: mockAvalonAssassin,
    playerList: ['merlin', 'percival'],
  },
};

export const NonAssassinWaiting: Story = {
  args: {
    avalon: mockAvalonNonAssassin,
    playerList: ['merlin'],
  },
};