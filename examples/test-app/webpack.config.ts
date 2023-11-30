import { composePlugins, withNx, NxWebpackExecutionContext } from '@nx/webpack';
import { withReact } from '@nx/react';
import { merge } from 'webpack-merge';
import { Configuration, container } from 'webpack';
import { join } from 'path';

const withModuleFederation = (config: Configuration, { context }: NxWebpackExecutionContext): Configuration => {
  const AppFederationPlugin = new container.ModuleFederationPlugin({
    name: 'testApp',
    filename: 'testApp.js',
    library: {
      type: 'var',
      name: 'testApp',
    },
    remotes: [],
    exposes: {
      BaseModule: join(context.root, 'examples', 'test-app', 'src', 'remotes', 'base-module.tsx'),
    },
    shared: [
      {
        react: {
          singleton: true,
          requiredVersion: '*',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '*',
        },
      },
    ],
  });
  const plugins: Configuration['plugins'] = [AppFederationPlugin];
  return merge(config, {
    plugins,
  });
};

const withWebpackCache = (config: Configuration, { context }: NxWebpackExecutionContext): Configuration => {
  return merge(config, {
    cache: {
      type: 'filesystem',
      cacheDirectory: join(context.root, '.webpack-cache'),
    },
  });
};

// Nx plugins for webpack to build config object from Nx options and context.
export default composePlugins(withNx(), withReact(), withWebpackCache, withModuleFederation);
