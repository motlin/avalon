import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import styles from './CssModulesExample.module.css';

interface CssModulesExampleProps {
  title: string;
  content: string;
  highlighted?: boolean;
}

const CssModulesExample: React.FC<CssModulesExampleProps> = ({ 
  title, 
  content, 
  highlighted = false 
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <p className={`${styles.content} ${highlighted ? styles.highlighted : ''}`}>
        {content}
      </p>
    </div>
  );
};

const meta: Meta<typeof CssModulesExample> = {
  title: 'Example/CssModulesExample',
  component: CssModulesExample,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    content: {
      control: 'text',
    },
    highlighted: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'CSS Modules Working!',
    content: 'This component uses CSS modules for styling. The styles are scoped and won\'t conflict with other components.',
    highlighted: false,
  },
};

export const Highlighted: Story = {
  args: {
    title: 'Highlighted Version',
    content: 'This version has the highlighted style applied to demonstrate CSS modules functionality.',
    highlighted: true,
  },
};