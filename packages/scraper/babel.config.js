const path = require('path');

const productionOptions = {
  compact: false,
  retainLines: false,
  minified: false,
  inputSourceMap: true,
  sourceMaps: 'both',
};

const commonPlugins = [
  require.resolve('@babel/plugin-transform-modules-commonjs'),
  [
    require.resolve('babel-plugin-module-resolver'),
    {
      root: [path.resolve('./src'), path.resolve('./types')],
    },
  ],
];

const commonNodePresets = [
  [
    require.resolve('@babel/preset-env'),
    {
      useBuiltIns: 'entry',
      corejs: {
        version: 3,
      },
      targets: {
        node: 'current',
      },
    },
  ],
  require.resolve('@babel/preset-typescript'),
];

const testingPlugins = [
  [
    require.resolve('@babel/plugin-transform-runtime'),
    {
      regenerator: true,
    },
  ],
];

module.exports = {
  presets: commonNodePresets,
  plugins: commonPlugins,
  env: {
    production: {
      ...productionOptions,
      presets: commonNodePresets,
      plugins: commonPlugins,
    },
    test: {
      plugins: testingPlugins,
    },
  },
};
