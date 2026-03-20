import type { Meta, StoryObj } from '@storybook/react';
import EndGameEventHandler from './EndGameEventHandler';

const meta: Meta<typeof EndGameEventHandler> = {
  title: 'Components/EndGameEventHandler',
  component: EndGameEventHandler,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const createMockAvalon = (gameOutcome: 'GOOD_WIN' | 'EVIL_WIN' | 'CANCELED', assassinated?: string) => {
  const eventListeners: Array<(event: string) => void> = [];

  return {
    game: {
      players: ['CRAIGM', 'ZEHUA', 'VINAY', 'LUKEE', 'KEN'],
      missions: [
        {
          proposals: [
            {
              proposer: 'CRAIGM',
              team: ['CRAIGM', 'ZEHUA'],
              votes: ['CRAIGM', 'ZEHUA', 'VINAY'],
              state: 'APPROVED' as const,
            },
          ],
          team: ['CRAIGM', 'ZEHUA'],
          state: 'COMPLETE',
          evilOnTeam: [],
          failsRequired: 1,
          numFails: 0,
        },
        {
          proposals: [
            {
              proposer: 'ZEHUA',
              team: ['ZEHUA', 'VINAY', 'LUKEE'],
              votes: ['ZEHUA', 'VINAY', 'LUKEE', 'KEN'],
              state: 'APPROVED' as const,
            },
          ],
          team: ['ZEHUA', 'VINAY', 'LUKEE'],
          state: 'COMPLETE',
          evilOnTeam: ['LUKEE'],
          failsRequired: 1,
          numFails: 0,
        },
      ],
      outcome: {
        state: gameOutcome,
        message: gameOutcome === 'GOOD_WIN'
          ? 'The forces of good have triumphed!'
          : gameOutcome === 'EVIL_WIN'
          ? 'Evil has prevailed in this quest!'
          : 'The game has been canceled.',
        assassinated,
        roles: [
          { name: 'CRAIGM', role: 'Merlin' },
          { name: 'ZEHUA', role: 'Percival' },
          { name: 'VINAY', role: 'Loyal Servant of Arthur' },
          { name: 'LUKEE', role: 'Morgana' },
          { name: 'KEN', role: 'Assassin', assassin: true },
        ],
        votes: {
          0: { 'CRAIGM': true, 'ZEHUA': true },
          1: { 'ZEHUA': true, 'VINAY': false, 'LUKEE': false },
        },
      },
    },
    lobby: {
      game: {
        players: ['CRAIGM', 'ZEHUA', 'VINAY', 'LUKEE', 'KEN'],
        missions: [],
        outcome: {
          state: gameOutcome,
          message: '',
          roles: [],
          votes: {},
        },
      },
    },
    config: {
      roles: [
        { name: 'Merlin' },
        { name: 'Percival' },
        { name: 'Loyal Servant of Arthur' },
        { name: 'Morgana' },
        { name: 'Assassin' },
      ],
      roleMap: {
        'Merlin': { team: 'good' },
        'Percival': { team: 'good' },
        'Loyal Servant of Arthur': { team: 'good' },
        'Morgana': { team: 'evil' },
        'Assassin': { team: 'evil' },
      },
    },
    onEvent: (callback: (event: string) => void) => {
      eventListeners.push(callback);

      // Automatically trigger GAME_ENDED event
      setTimeout(() => {
        eventListeners.forEach(listener => listener('GAME_ENDED'));
      }, 100);

      return () => {
        const index = eventListeners.indexOf(callback);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      };
    },
    triggerEvent: (event: string) => {
      eventListeners.forEach(listener => listener(event));
    },
  };
};

export const GoodWins: Story = {
  args: {
    avalon: createMockAvalon('GOOD_WIN'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the end game dialog when good wins the game.',
      },
    },
  },
};

export const EvilWins: Story = {
  args: {
    avalon: createMockAvalon('EVIL_WIN'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the end game dialog when evil wins the game.',
      },
    },
  },
};

export const EvilWinsWithAssassination: Story = {
  args: {
    avalon: createMockAvalon('EVIL_WIN', 'CRAIGM'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the end game dialog when evil wins by assassinating Merlin.',
      },
    },
  },
};

export const GameCanceled: Story = {
  args: {
    avalon: createMockAvalon('CANCELED'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the end game dialog when the game is canceled.',
      },
    },
  },
};

export const InteractiveControls: Story = {
  render: () => {
    const mockAvalon = createMockAvalon('GOOD_WIN', 'CRAIGM');

    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <button onClick={() => mockAvalon.triggerEvent('GAME_ENDED')}>
            Show End Game Dialog
          </button>
          <button onClick={() => mockAvalon.triggerEvent('GAME_STARTED')} style={{ marginLeft: '8px' }}>
            Hide Dialog (Game Started)
          </button>
        </div>
        <EndGameEventHandler avalon={mockAvalon} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive controls to show and hide the end game dialog.',
      },
    },
  },
};
