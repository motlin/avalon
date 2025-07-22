import type { Meta, StoryObj } from '@storybook/react';
import EndGameEventHandler from './EndGameEventHandler';
import realGameData from '../test-data/game-2025-07-16T19:54:25.962Z_VGZ.json';

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
      players: realGameData.players.map(p => p.name),
      missions: realGameData.missions,
      outcome: {
        state: gameOutcome,
        message: gameOutcome === 'GOOD_WIN'
          ? 'The forces of good have triumphed!'
          : gameOutcome === 'EVIL_WIN'
          ? 'Evil has prevailed in this quest!'
          : 'The game has been canceled.',
        assassinated,
        roles: realGameData.outcome.roles,
        votes: realGameData.outcome.votes,
      },
    },
    lobby: {
      game: {
        players: realGameData.players.map(p => p.name),
        missions: realGameData.missions,
        outcome: {
          state: gameOutcome,
          message: gameOutcome === 'GOOD_WIN'
            ? 'The forces of good have triumphed!'
            : gameOutcome === 'EVIL_WIN'
            ? 'Evil has prevailed in this quest!'
            : 'The game has been canceled.',
          roles: realGameData.outcome.roles,
          votes: realGameData.outcome.votes,
        },
      },
    },
    config: {
      roles: realGameData.outcome.roles.map(r => ({ name: r.role })),
      roleMap: {
        'MERLIN': { team: 'good' },
        'PERCIVAL': { team: 'good' },
        'LOYAL FOLLOWER': { team: 'good' },
        'MORGANA': { team: 'evil' },
        'ASSASSIN': { team: 'evil' },
        'EVIL MINION': { team: 'evil' },
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
    avalon: createMockAvalon('EVIL_WIN', realGameData.outcome.assassinated),
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
    const mockAvalon = createMockAvalon('GOOD_WIN', realGameData.outcome.assassinated);

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
