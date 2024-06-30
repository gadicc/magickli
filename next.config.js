const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  skipWaiting: false,
});

module.exports = withPWA({
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // See also alternative with patch-package:
    // https://stackoverflow.com/a/77722836/1839099
    serverComponentsExternalPackages: ["pdf-parse"],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // https://stackoverflow.com/questions/64926174/module-not-found-cant-resolve-fs-in-next-js-application
    // ./node_modules/nlopt-js/dist/index.js; Module not found: Can't resolve 'fs'
    config.resolve.fallback = { fs: false };

    config.module.rules.push({
      test: /\.json5$/i,
      loader: "json5-loader",
      type: "javascript/auto",
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    config.module.rules.push({
      test: /\.ya?ml$/,
      type: "json", // Required by Webpack v4
      use: "yaml-loader",
    });

    return config;
  },
});
