/**
 * Comprehensive error handling utilities
 * Provides structured error management across the application
 */

import { ApplicationError, APIError } from '@/types';
import { ERROR_MESSAGES } from './constants';

/**
 * Error codes for different error scenarios
 */
export const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'AUTH_001',
  EMAIL_ALREADY_EXISTS: 'AUTH_002',
  PASSWORD_WEAK: 'AUTH_003',
  UNAUTHORIZED: 'AUTH_004',
  SESSION_EXPIRED: 'AUTH_005',

  // Validation errors
  VALIDATION_ERROR: 'VAL_001',
  INVALID_EMAIL: 'VAL_002',
  INVALID_PASSWORD: 'VAL_003',
  MISSING_REQUIRED_FIELD: 'VAL_004',

  // Firebase errors
  FIREBASE_AUTH_ERROR: 'FB_001',
  FIREBASE_DB_ERROR: 'FB_002',
  DOCUMENT_NOT_FOUND: 'FB_003',

  // API errors
  API_ERROR: 'API_001',
  NETWORK_ERROR: 'API_002',
  TIMEOUT_ERROR: 'API_003',
  BAD_REQUEST: 'API_004',
  NOT_FOUND: 'API_005',
  SERVER_ERROR: 'API_006',

  // Application errors
  UNKNOWN_ERROR: 'APP_001',
  PERMISSION_DENIED: 'APP_002',
  RESOURCE_NOT_FOUND: 'APP_003',
} as const;

/**
 * Creates an ApplicationError instance
 */
export function createError(
  code: string,
  message: string,
  statusCode: number = 500,
  details?: Record<string, unknown>
): ApplicationError {
  return new ApplicationError(code, message, statusCode, details);
}

/**
 * Handles Firebase authentication errors
 */
export function handleFirebaseAuthError(error: any): ApplicationError {
  const code = error?.code || 'UNKNOWN';
  let message: string = ERROR_MESSAGES.SERVER_ERROR;
  let statusCode = 500;

  switch (code) {
    case 'auth/user-not-found':
      message = 'User account not found';
      statusCode = 404;
      break;
    case 'auth/wrong-password':
      message = 'Invalid email or password';
      statusCode = 401;
      break;
    case 'auth/email-already-in-use':
      message = ERROR_MESSAGES.SERVER_ERROR;
      statusCode = 409;
      break;
    case 'auth/weak-password':
      message = ERROR_MESSAGES.INVALID_PASSWORD;
      statusCode = 400;
      break;
    case 'auth/invalid-email':
      message = ERROR_MESSAGES.INVALID_EMAIL;
      statusCode = 400;
      break;
    case 'auth/user-disabled':
      message = 'This account has been disabled';
      statusCode = 403;
      break;
    case 'auth/network-request-failed':
      message = ERROR_MESSAGES.NETWORK_ERROR;
      statusCode = 503;
      break;
  }

  return createError(ERROR_CODES.FIREBASE_AUTH_ERROR, message, statusCode, { firebaseCode: code });
}

/**
 * Handles Firestore database errors
 */
export function handleFirestoreError(error: any): ApplicationError {
  const code = error?.code || 'UNKNOWN';
  let message: string = ERROR_MESSAGES.SERVER_ERROR;
  let statusCode = 500;

  switch (code) {
    case 'permission-denied':
      message = ERROR_MESSAGES.UNAUTHORIZED;
      statusCode = 403;
      break;
    case 'not-found':
      message = ERROR_MESSAGES.NOT_FOUND;
      statusCode = 404;
      break;
    case 'failed-precondition':
      message = 'Operation could not be completed';
      statusCode = 400;
      break;
    case 'unauthenticated':
      message = 'Please log in again';
      statusCode = 401;
      break;
  }

  return createError(ERROR_CODES.FIREBASE_DB_ERROR, message, statusCode, { firebaseCode: code });
}

/**
 * Validates email format
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
  }

  return { isValid: true };
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!password) {
    errors.push(ERROR_MESSAGES.REQUIRED_FIELD);
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validates required fields in an object
 */
export function validateRequiredFields(
  obj: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter((field) => !obj[field]);

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Generic error handler wrapper
 */
export function handleError(error: any, context?: string): ApplicationError {
  // If it's already an ApplicationError, return it
  if (error instanceof ApplicationError) {
    return error;
  }

  // Handle Firebase errors
  if (error?.code?.includes('auth/')) {
    return handleFirebaseAuthError(error);
  }

  if (error?.code?.includes('permission-denied')) {
    return handleFirestoreError(error);
  }

  // Handle network errors
  if (error?.message?.includes('fetch')) {
    return createError(
      ERROR_CODES.NETWORK_ERROR,
      ERROR_MESSAGES.NETWORK_ERROR,
      503,
      { originalError: error.message }
    );
  }

  // Handle timeout errors
  if (error?.name === 'AbortError') {
    return createError(
      ERROR_CODES.TIMEOUT_ERROR,
      'Request timed out. Please try again.',
      408
    );
  }

  // Default error
  console.error(`[ERROR${context ? ` - ${context}` : ''}]:`, error);
  return createError(
    ERROR_CODES.UNKNOWN_ERROR,
    ERROR_MESSAGES.SERVER_ERROR,
    500,
    { originalError: String(error) }
  );
}

/**
 * Safely parse error message from various error types
 */
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof ApplicationError) {
    return error.message;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.error?.message) {
    return error.error.message;
  }

  return ERROR_MESSAGES.SERVER_ERROR;
}

/**
 * Logs error with context for debugging
 */
export function logError(
  error: any,
  context: string,
  additionalInfo?: Record<string, unknown>
): void {
  const timestamp = new Date().toISOString();
  const errorMessage = getErrorMessage(error);

  console.error(`[${timestamp}] ERROR in ${context}:`, {
    message: errorMessage,
    error,
    ...additionalInfo,
  });

  // You can integrate with a logging service here (e.g., Sentry, LogRocket)
  if (process.env.NODE_ENV === 'production') {
    // Send to logging service
  }
}

/**
 * Creates API error response
 */
export function createErrorResponse(
  code: string,
  message: string,
  statusCode: number = 500
): { success: false; error: APIError; timestamp: Date } {
  return {
    success: false,
    error: {
      code,
      message,
    },
    timestamp: new Date(),
  };
}

/**
 * Creates successful API response
 */
export function createSuccessResponse<T>(data: T): { success: true; data: T; timestamp: Date } {
  return {
    success: true,
    data,
    timestamp: new Date(),
  };
}
