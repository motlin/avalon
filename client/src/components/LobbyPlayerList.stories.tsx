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

const createMockAvalon = (overrides = {}) => ({
  config: {
    playerList: ['CRAIGM', 'ZEHUA', 'VINAY', 'LUKEE', 'KEN'],
    sortList: (newList: string[]) => {
      console.log('Sorting list:', newList);
    },
  },
  user: {
    name: 'CRAIGM',
  },
  lobby: {
    admin: {
      name: 'CRAIGM',
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
      user: { name: 'ZEHUA' },
    }),
  },
};

export const SinglePlayer: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: ['CRAIGM'],
        sortList: (newList: string[]) => {
          console.log('Sorting list:', newList);
        },
      },
    }),
  },
};

export const AdminInMiddle: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: ['CRAIGM', 'ZEHUA', 'VINAY', 'LUKEE', 'KEN'],
        sortList: (newList: string[]) => {
          console.log('Sorting list:', newList);
        },
      },
      user: { name: 'VINAY' },
      lobby: {
        admin: { name: 'VINAY' },
      },
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
