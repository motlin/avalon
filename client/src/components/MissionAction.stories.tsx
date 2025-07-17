import type { Meta, StoryObj } from '@storybook/react';
import MissionAction from './MissionAction';

const meta = {
  component: MissionAction,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    avalon: {
      description: 'Avalon game state object with mission voting interface',
    },
  },
} satisfies Meta<typeof MissionAction>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockDoMission = (vote: boolean) => {
  console.log('Mission vote:', vote);
};

export const NeedsToVote: Story = {
  args: {
    avalon: {
      user: {
        name: 'Alice',
      },
      game: {
        currentProposal: {
          team: ['Alice', 'Bob', 'Charlie'],
        },
        currentMission: {
          team: [],
        },
      },
      doMission: mockDoMission,
    },
  },
};

export const WaitingForOthers: Story = {
  args: {
    avalon: {
      user: {
        name: 'David',
      },
      game: {
        currentProposal: {
          team: ['Alice', 'Bob', 'Charlie'],
        },
        currentMission: {
          team: ['Alice'],
        },
      },
      doMission: mockDoMission,
    },
  },
};

export const WaitingForResults: Story = {
  args: {
    avalon: {
      user: {
        name: 'Alice',
      },
      game: {
        currentProposal: {
          team: ['Alice', 'Bob', 'Charlie'],
        },
        currentMission: {
          team: ['Alice', 'Bob', 'Charlie'],
        },
      },
      doMission: mockDoMission,
    },
  },
};

export const SinglePlayerWaiting: Story = {
  args: {
    avalon: {
      user: {
        name: 'David',
      },
      game: {
        currentProposal: {
          team: ['Alice', 'Bob'],
        },
        currentMission: {
          team: ['Alice'],
        },
      },
      doMission: mockDoMission,
    },
  },
};