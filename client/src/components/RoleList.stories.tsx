import type { Meta, StoryObj } from '@storybook/react';
import RoleList from './RoleList';

const meta: Meta<typeof RoleList> = {
  title: 'Components/RoleList',
  component: RoleList,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    allowSelect: {
      control: 'boolean',
      description: 'Allow selecting roles with checkboxes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleRoles = [
  {
    name: 'Merlin',
    team: 'good' as const,
    description: 'Merlin sees all evil people (except for Mordred), but can also be assassinated.',
    selected: false,
  },
  {
    name: 'Percival',
    team: 'good' as const,
    description: "Percival can see Merlin and Morgana but does not know which one is which.",
    selected: false,
  },
  {
    name: 'Loyal Follower',
    team: 'good' as const,
    description: 'Loyal Follower is a genuinely good person.',
    selected: true,
  },
  {
    name: 'Morgana',
    team: 'evil' as const,
    description: "Morgana appears indistinguishable from Merlin to Percival. She sees other evil people (except Oberon)",
    selected: false,
  },
  {
    name: 'Mordred',
    team: 'evil' as const,
    description: "Mordred is invisible to Merlin. Mordred can see other evil people (except Oberon)",
    selected: false,
  },
  {
    name: 'Oberon',
    team: 'evil' as const,
    description: 'Oberon does not see anyone on his team and his teammates do not see him.',
    selected: false,
  },
  {
    name: 'Evil Minion',
    team: 'evil' as const,
    description: 'Evil Minion is pretty evil. He can see other evil people (except Oberon)',
    selected: true,
  },
];

export const Default: Story = {
  args: {
    roles: sampleRoles,
    allowSelect: false,
  },
};

export const WithSelection: Story = {
  args: {
    roles: sampleRoles,
    allowSelect: true,
  },
};

export const OnlyGoodRoles: Story = {
  args: {
    roles: sampleRoles.filter(role => role.team === 'good'),
    allowSelect: false,
  },
};

export const OnlyEvilRoles: Story = {
  args: {
    roles: sampleRoles.filter(role => role.team === 'evil'),
    allowSelect: true,
  },
};