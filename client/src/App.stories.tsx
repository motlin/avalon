import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import App from './App';
import AvalonGame from './avalon.js';

const meta = {
  component: App,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs', 'test'],
} satisfies Meta<typeof App>;

export default meta;
type Story = StoryObj<typeof meta>;

// Real subscriptions and routing getters, with all Firebase/API actions replaced.
function createStoryGame() {
  const avalon = new AvalonGame();
  avalon.init = () => {};
  avalon._authStateInitialized = true;
  avalon.signInAnonymously = async () => {
    avalon.user = { uid: 'alice', name: 'ALICE', email: 'alice@example.com', stats: {} };
    avalon.stateChanged();
  };
  avalon.logout = async () => {
    avalon.user = null;
    avalon.stateChanged();
  };
  avalon.createLobby = async (name: string) => {
    avalon.user.name = name;
    avalon.user.lobby = 'EXAMPLE';
    avalon.config.playerList = ['ALICE', 'BOB', 'CHARLIE', 'DAVID', 'EVE'];
    avalon.lobby = {
      name: 'EXAMPLE', connected: true,
      admin: { uid: 'alice', name: 'ALICE' },
      game: { state: 'INIT' },
      role: null,
      stop() {},
    };
    avalon.notifyEvent('LOBBY_CONNECTED');
  };
  avalon.startGame = async () => {
    const missions = [2, 3, 2, 3, 3].map(teamSize => ({
      state: 'PENDING', teamSize, failsRequired: 1, numFails: 0,
      team: [], proposals: [],
    }));
    avalon.lobby.game = {
      state: 'ACTIVE', phase: 'TEAM_PROPOSAL', missions,
      players: avalon.config.playerList,
      roles: ['MERLIN', 'PERCIVAL', 'LOYAL FOLLOWER', 'MORGANA', 'EVIL MINION'],
      currentMissionIdx: 0, currentProposalIdx: 0, currentProposer: 'ALICE',
      currentMission: missions[0],
      currentProposal: { proposer: 'ALICE', team: [], votes: [] },
      lastProposal: null, hammer: 'EVE',
    };
    avalon.lobby.role = { role: avalon.config.roleMap.MERLIN, assassin: false, sees: ['DAVID', 'EVE'] };
    avalon.notifyEvent('GAME_STARTED');
  };
  avalon.leaveLobby = async () => {
    avalon.user.lobby = null;
    avalon.unsubscribeFromLobby();
  };
  avalon.cancelGame = async () => {
    avalon.game.state = 'INIT';
    avalon.game.outcome = { state: 'CANCELED', message: 'The game was canceled.', roles: [], votes: {} };
    avalon.notifyEvent('GAME_ENDED');
  };
  return avalon;
}

function createSignedInGame() {
  const avalon = createStoryGame();
  void avalon.signInAnonymously();
  return avalon;
}

function createLobbyGame() {
  const avalon = createSignedInGame();
  void avalon.createLobby('ALICE');
  return avalon;
}

export const Loading: Story = {
  args: { createAvalon: () => {
    const avalon = createStoryGame();
    avalon._authStateInitialized = false;
    return avalon;
  } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('progressbar', { name: 'Loading Avalon' })).toBeVisible();
  },
};

export const SignedOut: Story = {
  args: { createAvalon: createStoryGame },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByPlaceholderText('Email Address')).toBeVisible();
  },
};

export const LobbySelection: Story = {
  args: { createAvalon: createSignedInGame },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Create Lobby' })).toBeVisible();
  },
};

export const WaitingForLobby: Story = {
  args: { createAvalon: () => {
    const avalon = createSignedInGame();
    avalon.user.lobby = 'EXAMPLE';
    return avalon;
  } },
  play: Loading.play,
};

export const InLobby: Story = {
  args: { createAvalon: createLobbyGame },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Start Game' })).toBeVisible();
  },
};

export const InGame: Story = {
  args: { createAvalon: () => {
    const avalon = createLobbyGame();
    void avalon.startGame();
    return avalon;
  } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Team Proposal (1/5)')).toBeVisible();
  },
};

export const RoutingAndGameEvents: Story = {
  args: { createAvalon: createStoryGame },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Anonymous', exact: true }));
    await userEvent.click(canvas.getByRole('button', { name: 'Login', exact: true }));
    await userEvent.click(await canvas.findByRole('button', { name: 'Create Lobby' }));
    await userEvent.click(await canvas.findByRole('button', { name: 'Start Game' }));
    await expect(await canvas.findByText('Game Started')).toBeVisible();
    await expect(canvas.getByText('Team Proposal (1/5)')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'View Role' }));
    await waitFor(() => expect(canvas.getByText('Your role is', { exact: false })).toBeVisible());
  },
};

export const LeaveLobbyAndLogOut: Story = {
  args: { createAvalon: createLobbyGame },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Quit' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Leave Lobby', exact: true }));
    await expect(await canvas.findByRole('button', { name: 'Create Lobby' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Logout' }));
    await expect(await canvas.findByPlaceholderText('Email Address')).toBeVisible();
  },
};

export const CancelGame: Story = {
  args: InGame.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Quit' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel Game', exact: true }));
    await expect(await canvas.findByRole('heading', { name: 'Game Canceled' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Close', exact: true }));
    await expect(canvas.getByRole('button', { name: 'Start Game' })).toBeVisible();
  },
};

export const LobbyNotifications: Story = {
  render: function NotificationStory() {
    const [avalon] = useState(createLobbyGame);
    return (
      <>
        <button onClick={() => avalon.notifyEvent('PLAYER_JOINED', 'FRANK')}>Simulate player joining</button>
        <App createAvalon={() => avalon} />
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Simulate player joining' }));
    const notification = await canvas.findByRole('status', { name: 'Game notifications' });
    await expect(within(notification).getByText('FRANK joined the lobby').textContent).toBe('FRANK joined the lobby');
    await expect(document.title).toBe('Avalon - EXAMPLE - ALICE');
  },
};
