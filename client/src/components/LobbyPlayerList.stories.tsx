import type { Meta, StoryObj } from '@storybook/react';
import LobbyPlayerList from './LobbyPlayerList';

const meta: Meta<typeof LobbyPlayerList> = {
  title: 'Lobby/LobbyPlayerList',
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
    playerList: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
    sortList: (newList: string[]) => {
      console.log('Sorting list:', newList);
    },
  },
  user: {
    name: 'Alice',
  },
  lobby: {
    admin: {
      name: 'Alice',
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
      user: { name: 'Bob' },
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
      user: { name: 'Charlie' },
    }),
  },
};

export const DifferentAdmin: Story = {
  args: {
    avalon: createMockAvalon({
      user: { name: 'Bob' },
      lobby: {
        admin: { name: 'Diana' },
      },
      isAdmin: false,
    }),
  },
};

export const AdminDuringGame: Story = {
  args: {
    avalon: createMockAvalon({
      isGameInProgress: true,
      user: { name: 'Diana' },
      lobby: {
        admin: { name: 'Diana' },
      },
    }),
  },
};

export const SmallLobby: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: ['Alice', 'Bob'],
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
        playerList: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'],
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
        playerList: ['Alice'],
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
          'Administrator',
          'VeryLongPlayerNameThatMightCauseIssues',
          'AnotherLongName',
          'Short',
          'MediumLength',
        ],
        sortList: (newList: string[]) => {
          console.log('Sorting list:', newList);
        },
      },
      user: { name: 'Administrator' },
      lobby: {
        admin: { name: 'Administrator' },
      },
    }),
  },
};

export const AdminInMiddle: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
        sortList: (newList: string[]) => {
          console.log('Sorting list:', newList);
        },
      },
      user: { name: 'Charlie' },
      lobby: {
        admin: { name: 'Charlie' },
      },
    }),
  },
};

export const UserNotAdmin: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
        sortList: (newList: string[]) => {
          console.log('Sorting list:', newList);
        },
      },
      user: { name: 'Eve' },
      lobby: {
        admin: { name: 'Bob' },
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