import { featureFlags } from "../utils/featureFlags";

// Dashboard configuration
export const dashboardConfig = {
  features: featureFlags,
  apiUrl: "http://localhost:8000",
  environment: "development",
  debugMode: true,
} as const;

export type DashboardConfig = typeof dashboardConfig; 