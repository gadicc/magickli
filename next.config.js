const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    dest: 'public'
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {

    config.module.rules.push({
      test: /\.json5$/i,
      loader: 'json5-loader',
      type: 'javascript/auto'
    });

    return config
  },
});
