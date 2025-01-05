// List of all available feature flags
export enum DashboardFeatureFlag {
  ADMIN_NAVBAR = 'adminNavbar',
  USER_MENU = 'userMenu',
  PROFILE = 'profile',
  SETTINGS = 'settings',
}

// Feature flag descriptions for documentation
export const featureFlagDescriptions: Record<DashboardFeatureFlag, string> = {
  [DashboardFeatureFlag.ADMIN_NAVBAR]: 'Controls the visibility of the admin navigation bar',  
  [DashboardFeatureFlag.USER_MENU]: 'Controls the visibility of the user menu in admin nav',  
  [DashboardFeatureFlag.PROFILE]: 'Controls the functionality of profile settings',  
  [DashboardFeatureFlag.SETTINGS]: 'Controls the functionality of settings',  
} as const;

// Feature flag configuration
export const featureFlags = {
  [DashboardFeatureFlag.ADMIN_NAVBAR]: true,
  [DashboardFeatureFlag.USER_MENU]: false,
  [DashboardFeatureFlag.PROFILE]: false,
  [DashboardFeatureFlag.SETTINGS]: false,
} as const;

export type FeatureFlagsConfig = typeof featureFlags;

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (feature: DashboardFeatureFlag): boolean => {
  return featureFlags[feature] ?? false;
} 