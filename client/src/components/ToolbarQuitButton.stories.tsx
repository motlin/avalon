import type { Meta, StoryObj } from '@storybook/react';
import ToolbarQuitButton from './ToolbarQuitButton';

const meta: Meta<typeof ToolbarQuitButton> = {
  component: ToolbarQuitButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockAvalonLobby = {
  isGameInProgress: false,
  cancelGame: () => {
    console.log('Cancel game called');
    return Promise.resolve();
  },
  leaveLobby: () => {
    console.log('Leave lobby called');
  },
};

const mockAvalonGame = {
  isGameInProgress: true,
  cancelGame: () => {
    console.log('Cancel game called');
    return Promise.resolve();
  },
  leaveLobby: () => {
    console.log('Leave lobby called');
  },
};

export const LeaveLobby: Story = {
  args: {
    avalon: mockAvalonLobby,
  },
};

export const CancelGame: Story = {
  args: {
    avalon: mockAvalonGame,
  },
};
