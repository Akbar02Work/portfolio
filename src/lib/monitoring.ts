type SentryClient = typeof import("@sentry/react");

let monitoringClientPromise: Promise<SentryClient> | null = null;

const getSentryDsn = () => import.meta.env.VITE_SENTRY_DSN;

const isMonitoringEnabled = () => import.meta.env.PROD && Boolean(getSentryDsn());

const loadMonitoringClient = () => {
  if (!isMonitoringEnabled()) return null;

  if (!monitoringClientPromise) {
    const dsn = getSentryDsn();
    monitoringClientPromise = import("@sentry/react").then((Sentry) => {
      Sentry.init({
        dsn,
        environment: "production",
      });
      return Sentry;
    });
  }

  return monitoringClientPromise;
};

export const initMonitoring = () => {
  const clientPromise = loadMonitoringClient();
  if (!clientPromise) return;

  void clientPromise.catch((error) => {
    console.error("Failed to initialize monitoring", error);
  });
};

export const captureError = (
  error: Error,
  context?: Record<string, unknown>
) => {
  const clientPromise = loadMonitoringClient();
  if (clientPromise) {
    void clientPromise
      .then((Sentry) => Sentry.captureException(error, { extra: context }))
      .catch((monitoringError) => {
        console.error(error, context);
        console.error("Failed to capture monitoring error", monitoringError);
      });
    return;
  }

  console.error(error, context);
};
