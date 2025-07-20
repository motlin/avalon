import type { Meta, StoryObj } from '@storybook/react';
import AssassinationAction from './AssassinationAction';

const meta = {
  component: AssassinationAction,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The AssassinationAction component provides the dramatic finale when good wins three missions. The Assassin gets one chance to identify and eliminate Merlin, potentially snatching victory from defeat.

### Assassination Mechanics

- **Triggered When** - Good team wins 3 missions
- **The Assassin** - One evil player designated as Assassin
- **One Shot** - Single attempt to identify Merlin
- **Win Condition** - If Assassin correctly identifies Merlin, evil wins

### Component Features

- **Player Selection** - Click to select assassination target
- **Role Display** - Shows available good team members
- **Confirmation** - Requires explicit confirmation before final choice
- **Spectator View** - Non-assassins see waiting message

### Strategic Elements

The assassination phase adds layers of strategy:
- Merlin must help without revealing identity
- Percival may act suspicious to protect Merlin
- Good players may "take a bullet" by acting like Merlin
- Evil team discusses and debates who Merlin might be
- The final decision often comes down to behavioral analysis

### Taking a Bullet Achievement

When Percival is assassinated instead of Merlin, they earn the "Taking a Bullet" achievement for their sacrifice.
        `,
      },
    },
  },
  argTypes: {
    avalon: {
      description: 'Avalon game state object containing lobby role information and user data',
    },
    playerList: {
      description: 'Array of player names available for assassination',
    },
  },
  tags: ['autodocs'],
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