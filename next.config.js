const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
module.exports = async (phase) => {
  /** @type {import("next").NextConfig} */
  const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    // See also alternative with patch-package:
    // https://stackoverflow.com/a/77722836/1839099
    serverExternalPackages: ["pdf-parse"],
    experimental: {},
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
  };

  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import("@serwist/next")).default({
      // Note: This is only an example. If you use Pages Router,
      // use something else that works, such as "service-worker/index.ts".
      swSrc: "src/app/sw.ts",
      swDest: "public/sw.js",
    });
    return withSerwist(nextConfig);
  }

  return nextConfig;
};
