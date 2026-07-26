const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

/**
 * libphonenumber-js ships ESM that imports sibling files with explicit `.js`
 * extensions. Metro on React Native fails to resolve those, so force the CJS
 * entry points instead.
 */
const libphonenumberCjs = {
  'libphonenumber-js': 'index.cjs',
  'libphonenumber-js/min': path.join('min', 'index.cjs'),
  'libphonenumber-js/max': path.join('max', 'index.cjs'),
  'libphonenumber-js/mobile': path.join('mobile', 'index.cjs'),
};

const upstreamResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const relativeEntry = libphonenumberCjs[moduleName];
  if (relativeEntry) {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'node_modules', 'libphonenumber-js', relativeEntry),
    };
  }

  if (upstreamResolveRequest) {
    return upstreamResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
