import type { Meta, StoryObj } from '@storybook/react';
import TeamProposalAction from './TeamProposalAction';

const meta: Meta<typeof TeamProposalAction> = {
  component: TeamProposalAction,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockAvalon = {
  game: {
    currentProposalIdx: 0,
    currentProposer: 'Alice',
    currentMission: {
      teamSize: 3,
    },
  },
  user: {
    name: 'Alice',
  },
  proposeTeam: (playerList: string[]) => {
    console.log('Proposing team:', playerList);
  },
};

const mockAvalonAsSpectator = {
  ...mockAvalon,
  user: {
    name: 'Bob',
  },
};

export const AsProposer: Story = {
  args: {
    avalon: mockAvalon,
    playerList: ['Alice', 'Bob', 'Charlie'],
  },
};

export const AsProposerInvalidSelection: Story = {
  args: {
    avalon: mockAvalon,
    playerList: ['Alice', 'Bob'],
  },
};

export const AsProposerEmptySelection: Story = {
  args: {
    avalon: mockAvalon,
    playerList: [],
  },
};

export const AsSpectator: Story = {
  args: {
    avalon: mockAvalonAsSpectator,
    playerList: [],
  },
};

export const LaterProposal: Story = {
  args: {
    avalon: {
      ...mockAvalon,
      game: {
        ...mockAvalon.game,
        currentProposalIdx: 3,
        currentMission: {
          teamSize: 4,
        },
      },
    },
    playerList: ['Alice', 'Bob', 'Charlie', 'Diana'],
  },
};

export const Interactive: Story = {
  args: {
    avalon: {
      ...mockAvalon,
      proposeTeam: (playerList: string[]) => {
        alert(`Proposing team: ${playerList.join(', ')}`);
      },
    },
    playerList: ['Alice', 'Bob', 'Charlie'],
  },
};