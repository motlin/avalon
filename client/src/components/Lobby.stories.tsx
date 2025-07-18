import type { Meta, StoryObj } from '@storybook/react';
import Lobby from './Lobby';

const meta: Meta<typeof Lobby> = {
  component: Lobby,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleRoles = [
  {
    name: 'MERLIN',
    team: 'good' as const,
    description: 'Merlin sees all evil people (except for Mordred), but can also be assassinated.',
    selected: true,
  },
  {
    name: 'PERCIVAL',
    team: 'good' as const,
    description: "Percival can see Merlin and Morgana but does not know which one is which.",
    selected: true,
  },
  {
    name: 'LOYAL FOLLOWER',
    team: 'good' as const,
    description: 'Loyal Follower is a genuinely good person.',
    selected: false,
  },
  {
    name: 'MORGANA',
    team: 'evil' as const,
    description: "Morgana appears indistinguishable from Merlin to Percival. She sees other evil people (except Oberon)",
    selected: false,
  },
  {
    name: 'MORDRED',
    team: 'evil' as const,
    description: "Mordred is invisible to Merlin. Mordred can see other evil people (except Oberon)",
    selected: false,
  },
  {
    name: 'OBERON',
    team: 'evil' as const,
    description: 'Oberon does not see anyone on his team and his teammates do not see him.',
    selected: false,
  },
  {
    name: 'EVIL MINION',
    team: 'evil' as const,
    description: 'Evil Minion is pretty evil. He can see other evil people (except Oberon)',
    selected: true,
  },
  {
    name: 'ASSASSIN',
    team: 'evil' as const,
    description: 'The Assassin can kill Merlin at the end of the game if evil loses all missions.',
    selected: true,
  },
];

const createMockAvalon = (overrides = {}) => ({
  user: {
    name: 'ALICE',
    stats: {
      games: 5,
    },
  },
  config: {
    playerList: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
    selectableRoles: sampleRoles,
    sortList: (newList: string[]) => {
      console.log('Sorting player list:', newList);
    },
  },
  lobby: {
    name: 'test-lobby-123',
    admin: {
      name: 'ALICE',
    },
  },
  isAdmin: true,
  isGameInProgress: false,
  startGame: async (options: { inGameLog: boolean }) => {
    console.log('Starting game with options:', options);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Game started successfully');
        resolve(undefined);
      }, 2000);
    });
  },
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

export const ReadyToStart: Story = {
  args: {
    avalon: createMockAvalon(),
  },
};

export const NotEnoughPlayers: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: ['ALICE', 'BOB', 'CHARLIE'],
        selectableRoles: sampleRoles,
        sortList: (newList: string[]) => {
          console.log('Sorting player list:', newList);
        },
      },
    }),
  },
};

export const TooManyPlayers: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: [
          'ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE', 
          'FRANK', 'GRACE', 'HENRY', 'IVY', 'JACK', 'KAREN'
        ],
        selectableRoles: sampleRoles,
        sortList: (newList: string[]) => {
          console.log('Sorting player list:', newList);
        },
      },
    }),
  },
};

export const NonAdminWaiting: Story = {
  args: {
    avalon: createMockAvalon({
      user: {
        name: 'BOB',
        stats: {
          games: 3,
        },
      },
      isAdmin: false,
    }),
  },
};

export const MaxPlayersReady: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: [
          'ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE', 
          'FRANK', 'GRACE', 'HENRY', 'IVY', 'JACK'
        ],
        selectableRoles: sampleRoles,
        sortList: (newList: string[]) => {
          console.log('Sorting player list:', newList);
        },
      },
    }),
  },
};

export const MinPlayersReady: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
        selectableRoles: sampleRoles,
        sortList: (newList: string[]) => {
          console.log('Sorting player list:', newList);
        },
      },
    }),
  },
};

export const NewPlayerLobby: Story = {
  args: {
    avalon: createMockAvalon({
      user: {
        name: 'NEWBIE',
        stats: {
          games: 0,
        },
      },
      config: {
        playerList: ['NEWBIE', 'ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE'],
        selectableRoles: sampleRoles,
        sortList: (newList: string[]) => {
          console.log('Sorting player list:', newList);
        },
      },
      lobby: {
        name: 'beginner-friendly-lobby',
        admin: {
          name: 'ALICE',
        },
      },
      isAdmin: false,
    }),
  },
};

export const SevenPlayerGame: Story = {
  args: {
    avalon: createMockAvalon({
      config: {
        playerList: ['ALICE', 'BOB', 'CHARLIE', 'DIANA', 'EVE', 'FRANK', 'GRACE'],
        selectableRoles: sampleRoles,
        sortList: (newList: string[]) => {
          console.log('Sorting player list:', newList);
        },
      },
    }),
  },
};