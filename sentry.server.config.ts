import * as Sentry from "@sentry/nuxt";
 
Sentry.init({
  dsn: "https://aaf819f46f869af0db12cec6eaf9ca9c@o4509830499794944.ingest.de.sentry.io/4509830502154320",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
