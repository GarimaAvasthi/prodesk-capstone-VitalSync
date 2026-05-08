/**
 * Environment variable validation
 * Ensures all required environment variables are present and valid
 */

/**
 * Validates required environment variables
 * Throws an error if any required variables are missing
 */
export function validateEnvironmentVariables(): void {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  const missingVars: string[] = [];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:');
    missingVars.forEach((varName) => {
      console.error(`  - ${varName}`);
    });
    console.error('\nPlease check your .env.local file and add the missing variables.');
    console.error('You can use .env.example as a reference.\n');

    // In development, warn but don't fail
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
}

/**
 * Environment configuration object
 */
export const env = {
  // Firebase
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  },

  // AI/ML Services
  ai: {
    googleApiKey: process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY,
    openaiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  },

  // Feature Flags
  features: {
    aiEnabled: process.env.NEXT_PUBLIC_AI_ENABLED === 'true',
    analyticsEnabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
    notificationsEnabled: process.env.NEXT_PUBLIC_NOTIFICATIONS_ENABLED === 'true',
  },

  // Application Configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: (process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || 'development') as
      | 'development'
      | 'staging'
      | 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },

  // Analytics
  analytics: {
    analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  },

  // Error Tracking
  errorTracking: {
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
} as const;

/**
 * Type-safe environment variable accessor
 */
export function getEnv<T = string>(
  key: string,
  defaultValue?: T
): T | string | undefined {
  const value = process.env[key];
  return value !== undefined ? value : defaultValue;
}

/**
 * Assert that an environment variable exists
 */
export function assertEnvVar(varName: string): string {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Required environment variable "${varName}" is not set`);
  }
  return value;
}
