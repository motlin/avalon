import type { Meta, StoryObj } from '@storybook/react';
import Toolbar from './Toolbar';

const meta: Meta<typeof Toolbar> = {
  title: 'Components/Toolbar',
  component: Toolbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The Toolbar component is the main navigation bar of the Avalon game application. It displays different content based on whether the user is in a lobby or not.

### States

1. **In Lobby**: Shows the lobby name with room icon, view role button, and quit button
2. **Not in Lobby**: Shows the user's email and logout button

### Features

- **Lobby Name Display**: Shows the current lobby name with a room icon
- **View Role Button**: Allows players to view their assigned role during the game
- **Quit Button**: Leaves the lobby or cancels the current game
- **Logout Button**: Signs the user out of the application

### Usage

The Toolbar is typically placed at the top of the application and persists across different game states.
        `
      }
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

export const InLobby: Story = {
  args: {
    avalon: {
      user: {
        name: 'Alice',
        email: 'alice@example.com',
        stats: {
          games: 10,
          good: 6,
          wins: 5,
          good_wins: 3,
          playtimeSeconds: 3600
        }
      },
      lobby: {
        name: 'ABC',
        role: {
          role: {
            name: 'Merlin',
            team: 'good',
            description: 'You know who the evil players are, but must stay hidden.'
          },
          assassin: false,
          sees: ['Morgana', 'Assassin']
        }
      },
      globalStats: {
        games: 100,
        good_wins: 45
      },
      isGameInProgress: false
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Toolbar when user is in a lobby, showing lobby name and game controls.'
      }
    }
  }
};

export const NotInLobby: Story = {
  args: {
    avalon: {
      user: {
        name: 'Bob',
        email: 'bob@example.com'
      },
      lobby: null
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Toolbar when user is not in a lobby, showing only email and logout option.'
      }
    }
  }
};

export const LongLobbyName: Story = {
  args: {
    avalon: {
      user: {
        name: 'Charlie',
        email: 'charlie@example.com',
        stats: {
          games: 25,
          good: 15,
          wins: 12,
          good_wins: 8,
          playtimeSeconds: 7200
        }
      },
      lobby: {
        name: 'ABC',
        role: {
          role: {
            name: 'Percival',
            team: 'good',
            description: 'You know who Merlin is, but not who the evil players are.'
          },
          assassin: false,
          sees: ['Merlin']
        }
      },
      globalStats: {
        games: 150,
        good_wins: 68
      },
      isGameInProgress: true
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Toolbar with a long lobby name to test text overflow handling.'
      }
    }
  }
};

export const ShortEmail: Story = {
  args: {
    avalon: {
      user: {
        name: 'Dan',
        email: 'd@e.co'
      },
      lobby: null
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Toolbar with a short email address.'
      }
    }
  }
};
