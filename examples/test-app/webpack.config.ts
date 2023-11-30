import { composePlugins, withNx, NxWebpackExecutionContext } from '@nx/webpack';
import { withReact } from '@nx/react';
import { withModuleFederation } from '@nx/react/module-federation';
import { merge } from 'webpack-merge'
import { Configuration } from 'webpack';
import { join } from 'path'

import baseConfig from './module-federation.config';

const config = {
  ...baseConfig,
};


const withWebpackCache = (config: Configuration, { context }: NxWebpackExecutionContext): Configuration => {
  return merge(config, {
    cache: {
      type: 'filesystem',
      cacheDirectory: join(context.root, '.webpack-cache')
    },
  })
}

// Nx plugins for webpack to build config object from Nx options and context.
export default composePlugins(
  withNx(),
  withReact(),
  withModuleFederation(config),
  withWebpackCache
);
