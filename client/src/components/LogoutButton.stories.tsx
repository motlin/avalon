import type { Meta, StoryObj } from '@storybook/react';
import LogoutButton from './LogoutButton';

const meta: Meta<typeof LogoutButton> = {
  component: LogoutButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockAvalon = {
  logout: () => {
    console.log('Logout called');
  },
};

export const Default: Story = {
  args: {
    avalon: mockAvalon,
  },
};

