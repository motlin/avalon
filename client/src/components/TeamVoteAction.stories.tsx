import type { Meta, StoryObj } from '@storybook/react';
import TeamVoteAction from './TeamVoteAction';

const meta = {
  component: TeamVoteAction,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    avalon: {
      description: 'Avalon game state object containing voting information',
    },
  },
} satisfies Meta<typeof TeamVoteAction>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockVoteTeam = () => new Promise<void>((resolve) => {
  setTimeout(resolve, 1000);
});

export const FirstProposal: Story = {
  args: {
    avalon: {
      game: {
        currentProposalIdx: 0,
        currentProposal: {
          team: ['Alice', 'Bob', 'Charlie'],
          votes: [],
        },
        currentProposer: 'Alice',
      },
      user: {
        name: 'Dave',
      },
      voteTeam: mockVoteTeam,
    },
  },
};

export const SecondProposal: Story = {
  args: {
    avalon: {
      game: {
        currentProposalIdx: 1,
        currentProposal: {
          team: ['Bob', 'Charlie', 'Dave'],
          votes: [],
        },
        currentProposer: 'Bob',
      },
      user: {
        name: 'Alice',
      },
      voteTeam: mockVoteTeam,
    },
  },
};

export const YourProposal: Story = {
  args: {
    avalon: {
      game: {
        currentProposalIdx: 2,
        currentProposal: {
          team: ['Alice', 'Eve', 'Frank'],
          votes: [],
        },
        currentProposer: 'Charlie',
      },
      user: {
        name: 'Charlie',
      },
      voteTeam: mockVoteTeam,
    },
  },
};

export const AlreadyVoted: Story = {
  args: {
    avalon: {
      game: {
        currentProposalIdx: 3,
        currentProposal: {
          team: ['Dave', 'Eve'],
          votes: ['Alice'],
        },
        currentProposer: 'Dave',
      },
      user: {
        name: 'Alice',
      },
      voteTeam: mockVoteTeam,
    },
  },
};

export const FinalProposal: Story = {
  args: {
    avalon: {
      game: {
        currentProposalIdx: 4,
        currentProposal: {
          team: ['Alice', 'Bob', 'Charlie', 'Dave'],
          votes: [],
        },
        currentProposer: 'Eve',
      },
      user: {
        name: 'Frank',
      },
      voteTeam: mockVoteTeam,
    },
  },
};