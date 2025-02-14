// This file configures the initialization of Sentry on the client and server.
// The config you add here will be used whenever a users loads a page in their browser or on the server.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://a68e2d94fec4a9d74eff0fde4e44d648@o4508219694907392.ingest.de.sentry.io/4508219759591504",

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
      // Position the feedback button on the right side
      buttonPosition: "center",
      // Add some margin to avoid overlapping with other components
      buttonStyle: {
        position: "fixed",
        right: "20px",
        bottom: "20px",
        zIndex: 999,
      },
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Add environment to differentiate between development and production
  environment: process.env.NODE_ENV,
});
