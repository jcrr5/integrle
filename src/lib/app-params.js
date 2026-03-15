/**
 * Application parameters - Neutralized for Local Development
 * All base44 cloud dependencies have been removed.
 */

export const appParams = {
  // We keep these keys so imports don't fail, 
  // but we use placeholder values.
  appId: 'local-integrle-app',
  token: 'local-dev-token',
  
  // You can add other local configuration flags here if needed
  isLocal: true,
  version: '0.1.0'
};

// If your app uses a function to get these params, export that too
export const getAppParams = () => appParams;