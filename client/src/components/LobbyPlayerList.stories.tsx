import type { Meta, StoryObj } from '@storybook/react';
import LobbyPlayerList from './LobbyPlayerList';

const meta: Meta<typeof LobbyPlayerList> = {
  component: LobbyPlayerList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to create mock avalon prop
const createMockAvalon = (overrides = {}) => ({
  config: {
    playerList: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
    sortList: (newList: string[]) => {
      console.log('Sorting list:', newList);
    },
  },
  user: {
    name: 'ALICE',
  },
  lobby: {
    admin: {
      name: 'ALICE',
    },
  },
  isAdmin: true,
  isGameInProgress: false,
  kickPlayer: async (player: string) => {
    console.log('Kicking player:', player);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Player kicked:', player);
        resolve();
      }, 1000);
    });
  },
  ...overrides,
});

export const AdminCanDragAndKick: Story = {
  args: {
    avalon: createMockAvalon(),
  },
};

export const NonAdminView: Story = {
  args: {
    avalon: createMockAvalon({
      isAdmin: false,
      user: { name: 'BOB' },
    }),
  },
};

export const GameInProgress: Story = {
  args: {
    avalon: createMockAvalon({
      isGameInProgress: true,
    }),
  },
};

export const NonAdminDuringGame: Story = {
  args: {
    avalon: createMockAvalon({
      isAdmin: false,
      isGameInProgress: true,
      user: { name: 'CHARLIE' },
    }),
  },
};

export const DifferentAdmin: Story = {
  args: {
    avalon: createMockAvalon({
      user: { name: 'BOB' },
      lobby: {
        admin: { name: 'DIANA' },
      },
      isAdmin: false,
    }),
  },
};

export const AdminDuringGame: Story = {
  args: {
    avalon: createMockAvalon({
      isGameInProgress: true,
      user: { name: 'DIANA' },
      lobby: {
        admin: { name: 'DIANA' },
      },
    }),
  },
};

export const SmallLobby: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: ['ALICE', 'BOB'],
        sortList: (newList: string[]) => {
          console.log('Sorting list:', newList);
        },
      },
    }),
  },
};

export const FullLobby: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE', 'FRANK', 'GRACE', 'HENRY'],
        sortList: (newList: string[]) => {
          console.log('Sorting list:', newList);
        },
      },
    }),
  },
};

export const SinglePlayer: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: ['ALICE'],
        sortList: (newList: string[]) => {
          console.log('Sorting list:', newList);
        },
      },
    }),
  },
};

export const LongPlayerNames: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: [
          'ADMINISTRATOR',
          'VERYLONGPLAYERNAMETHATMIGHTCAUSEISSUES',
          'ANOTHERLONGNAME',
          'SHORT',
          'MEDIUMLENGTH',
        ],
        sortList: (newList: string[]) => {
          console.log('Sorting list:', newList);
        },
      },
      user: { name: 'ADMINISTRATOR' },
      lobby: {
        admin: { name: 'ADMINISTRATOR' },
      },
    }),
  },
};

export const AdminInMiddle: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
        sortList: (newList: string[]) => {
          console.log('Sorting list:', newList);
        },
      },
      user: { name: 'CHARLIE' },
      lobby: {
        admin: { name: 'CHARLIE' },
      },
    }),
  },
};

export const UserNotAdmin: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
        sortList: (newList: string[]) => {
          console.log('Sorting list:', newList);
        },
      },
      user: { name: 'EVE' },
      lobby: {
        admin: { name: 'BOB' },
      },
      isAdmin: false,
    }),
  },
};

export const EmptyLobby: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: [],
        sortList: (newList: string[]) => {
          console.log('Sorting list:', newList);
        },
      },
    }),
  },
};