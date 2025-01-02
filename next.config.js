import { withSentryConfig } from '@sentry/nextjs';

const BUILD_ACTIVITY_POSITION = {
  BOTTOM_RIGHT: "bottom-right",
  // Add other positions if needed
};

const nextConfig = {
  typescript: {
    // ignoreBuildErrors: true,
  },
  eslint: {
    // Fix ESLint errors instead of ignoring them during builds
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
  },
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
    buildActivityPosition: BUILD_ACTIVITY_POSITION.BOTTOM_RIGHT,
  },
};

const sentryWebpackPluginOptions = {
  // The 'org' value should be your Sentry organization slug
  org: "madick",

  // The 'project' value should be your Sentry project slug
  project: "javascript-nextjs",

  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Only print logs for uploading source maps in CI to reduce noise during local development
  silent: true,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  // This option hides the source maps from the generated client bundles, which can help protect your source code.
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  // This will remove Sentry logging statements from the production bundle,
  // which can help reduce the bundle size and improve performance.
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  // This option allows Sentry to automatically instrument Vercel Cron Monitors for better observability.
  // Note: This does not yet work with App Router route handlers.
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);