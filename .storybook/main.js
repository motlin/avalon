/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": [
    "../client/src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-vitest'
  ],
  "framework": {
    "name": '@storybook/react-vite',
    "options": {}
  },
  "viteFinal": async (config) => {
    config.css = {
      ...config.css,
      modules: {
        localsConvention: 'camelCase'
      }
    };
    
    config.resolve = {
      ...config.resolve,
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    };
    
    config.build = {
      ...config.build,
      commonjsOptions: {
        transformMixedEsModules: true
      }
    };
    
    return config;
  }
};
export default config;