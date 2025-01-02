// filepath: /c:/Users/user/Desktop/Projects/Done/NextE/my-app/next.config.js
import { withSentryConfig } from '@sentry/nextjs';

const BUILD_ACTIVITY_POSITION = {
  BOTTOM_RIGHT: "bottom-right",
  // Add other positions if needed
};

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      }
    ]
  },
  experimental: {
    serverActions: true,
    after: true,
  },
  devIndicators: {
    buildActivityPosition: BUILD_ACTIVITY_POSITION.BOTTOM_RIGHT,
  },
  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true,
  },
};

export default withSentryConfig(nextConfig, {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  
  // The 'org' value should be your Sentry organization slug
  org: "madick",

  // The 'project' value should be your Sentry project slug
  project: "javascript-nextjs",
});