import type { Meta, StoryObj } from '@storybook/react';
import ProposalsCounter from './ProposalsCounter';

const meta = {
  title: 'Game/ProposalsCounter',
  component: ProposalsCounter,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    avalon: {
      description: 'Avalon game state object containing the current proposal index',
    },
  },
} satisfies Meta<typeof ProposalsCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstProposal: Story = {
  args: {
    avalon: {
      game: {
        currentProposalIdx: 0,
      },
    },
  },
};

export const SecondProposal: Story = {
  args: {
    avalon: {
      game: {
        currentProposalIdx: 1,
      },
    },
  },
};

export const ThirdProposal: Story = {
  args: {
    avalon: {
      game: {
        currentProposalIdx: 2,
      },
    },
  },
};

export const FourthProposal: Story = {
  args: {
    avalon: {
      game: {
        currentProposalIdx: 3,
      },
    },
  },
};

export const FifthProposal: Story = {
  args: {
    avalon: {
      game: {
        currentProposalIdx: 4,
      },
    },
  },
};