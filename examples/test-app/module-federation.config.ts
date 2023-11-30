import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'test-app',
  remotes: [],
  exposes: {
    'BaseModule': './src/remotes/base-module.tsx'
  },
  shared: (_libraryName, sharedConfig) => {
    console.log(sharedConfig)
    return sharedConfig
  }
};

export default config;
