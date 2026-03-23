import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/react';
import * as React from 'react';
import * as globalStorybookConfig from './preview';

// Make React available globally for the test environment
if (typeof window !== 'undefined') {
  window.React = React;
}

const annotations = setProjectAnnotations([globalStorybookConfig]);

beforeAll(annotations.beforeAll);
