import type { Meta, StoryObj } from '@storybook/react';
import TeamVoteAction from './TeamVoteAction';

const meta = {
  component: TeamVoteAction,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The TeamVoteAction component handles the team approval voting phase of the game. All players simultaneously vote to approve or reject the proposed mission team.

### Voting Mechanics

- **Approve** ✓ - Support the proposed team composition
- **Reject** ✗ - Oppose the team and pass proposal to next player
- **Anonymous Until Complete** - Votes are hidden until all players vote
- **Majority Rules** - Team is approved if more than half vote approve

### UI Features

- **Team Display** - Shows which players are on the proposed team
- **Vote Status** - Indicates whether you've already voted
- **Proposal Counter** - Shows current proposal number (1-5)
- **Warning on 5th Vote** - The 5th proposal auto-approves (evil wins if team fails)

### Strategic Elements

Voting patterns reveal information:
- Evil players may coordinate to reject good teams
- Good players must balance suspicion with progress
- The 5th vote creates tension and forces decisions
- Vote timing can sometimes reveal alliances
        `,
      },
    },
  },
  argTypes: {
    avalon: {
      description: 'Avalon game state object containing voting information',
    },
  },
  tags: ['autodocs'],
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
