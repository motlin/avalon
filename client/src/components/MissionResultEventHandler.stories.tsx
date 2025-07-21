import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import MissionResultEventHandler from './MissionResultEventHandler';

const meta: Meta<typeof MissionResultEventHandler> = {
  component: MissionResultEventHandler,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const createMockAvalon = (mission: any, initialEvents: string[] = []) => {
  let eventCallback: ((event: string, ...args: any[]) => void) | null = null;

  return {
    lobby: {
      game: {
        currentMissionIdx: 1,
        missions: [mission]
      }
    },
    onEvent: (callback: (event: string, ...args: any[]) => void) => {
      eventCallback = callback;

      setTimeout(() => {
        initialEvents.forEach(event => {
          if (eventCallback) {
            eventCallback(event);
          }
        });
      }, 100);

      return () => {
        eventCallback = null;
      };
    },
    triggerEvent: (event: string, ...args: any[]) => {
      if (eventCallback) {
        eventCallback(event, ...args);
      }
    }
  };
};

const successMission = {
  state: 'SUCCESS',
  team: ['CRAIGM', 'ZEHUA', 'VINAY'],
  numFails: 0
};

const failureMission = {
  state: 'FAILURE',
  team: ['CRAIGM', 'ZEHUA'],
  numFails: 1
};

const failureMissionMultiple = {
  state: 'FAILURE',
  team: ['CRAIGM', 'ZEHUA', 'VINAY', 'LUKEE'],
  numFails: 2
};

export const MissionSucceeded: Story = {
  args: {
    avalon: createMockAvalon(successMission, ['MISSION_RESULT']),
  },
};

export const MissionFailedSingle: Story = {
  args: {
    avalon: createMockAvalon(failureMission, ['MISSION_RESULT']),
  },
};

export const MissionFailedMultiple: Story = {
  args: {
    avalon: createMockAvalon(failureMissionMultiple, ['MISSION_RESULT']),
  },
};

export const Hidden: Story = {
  args: {
    avalon: createMockAvalon(successMission),
  },
};

export const InteractiveExample: Story = {
  render: () => {
    const [mockAvalon] = useState(() => createMockAvalon(successMission));

    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <button onClick={() => mockAvalon.triggerEvent('MISSION_RESULT')}>
            Show Mission Result
          </button>
          <button onClick={() => mockAvalon.triggerEvent('GAME_ENDED')} style={{ marginLeft: '8px' }}>
            Hide Dialog
          </button>
        </div>
        <MissionResultEventHandler avalon={mockAvalon} />
      </div>
    );
  },
};
