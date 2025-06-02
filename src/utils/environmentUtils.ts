
// Environment detection utility
export const isDevelopmentMode = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname.includes('.lovable.dev');

// Logger for debugging
export const logEnvironment = () => {
  console.log(`Running in ${isDevelopmentMode ? 'DEVELOPMENT' : 'PRODUCTION'} mode`);
};
