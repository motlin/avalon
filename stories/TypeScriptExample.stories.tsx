import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

interface TypeScriptExampleProps {
  message: string;
  count: number;
}

const TypeScriptExample: React.FC<TypeScriptExampleProps> = ({ message, count }) => {
  return (
    <div>
      <h3>{message}</h3>
      <p>Count: {count}</p>
    </div>
  );
};

const meta: Meta<typeof TypeScriptExample> = {
  title: 'Example/TypeScriptExample',
  component: TypeScriptExample,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
    },
    count: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'Hello TypeScript!',
    count: 42,
  },
};

export const WithDifferentProps: Story = {
  args: {
    message: 'TypeScript is working!',
    count: 100,
  },
};