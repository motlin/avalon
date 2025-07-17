import type { Meta, StoryObj } from '@storybook/react';
import LogoutButton from './LogoutButton';

const meta: Meta<typeof LogoutButton> = {
  title: 'UI/LogoutButton',
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

export const Interactive: Story = {
  args: {
    avalon: {
      logout: () => {
        alert('Logout functionality would be triggered here');
      },
    },
  },
};