// This file configures the initialization of Sentry on the client and server.
// The config you add here will be used whenever a user loads a page in their browser or on the server.
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
      // Position the feedback button on the center
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
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: false,
  environment: process.env.NODE_ENV,
});
