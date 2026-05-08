/**
 * Application-wide constants and configuration
 * Centralizes all magic strings and values used throughout the app
 */

// ============================================================================
// AUTHENTICATION CONSTANTS
// ============================================================================

export const AUTH_ROUTES = {
  LOGIN: '/login',
  SIGNIN: '/signin',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  HOME: '/',
} as const;

export const PROTECTED_ROUTES = [
  '/dashboard',
  '/patient-details',
  '/care-team',
  '/operations',
] as const;

export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signin',
  '/register',
  '/forgot-password',
] as const;

export const STORAGE_KEYS = {
  AUTH_STATE: 'vitalsync-auth',
  THEME: 'vitalsync-theme',
  USER_PREFERENCES: 'vitalsync-prefs',
} as const;

// ============================================================================
// USER ROLES & PERMISSIONS
// ============================================================================

export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
  STAFF: 'staff',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  patient: 'Patient',
  doctor: 'Doctor',
  admin: 'Administrator',
  staff: 'Staff Member',
};

export const ROLE_COLORS: Record<string, string> = {
  patient: 'bg-blue-100 text-blue-800',
  doctor: 'bg-green-100 text-green-800',
  admin: 'bg-red-100 text-red-800',
  staff: 'bg-yellow-100 text-yellow-800',
};

// ============================================================================
// TASK & STATUS CONSTANTS
// ============================================================================

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export const PRIORITY_VALUES: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
};

// ============================================================================
// APPOINTMENT CONSTANTS
// ============================================================================

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
} as const;

export const APPOINTMENT_TYPE = {
  CONSULTATION: 'consultation',
  FOLLOW_UP: 'follow-up',
  PROCEDURE: 'procedure',
  CHECK_IN: 'check-in',
} as const;

// ============================================================================
// VITAL SIGNS RANGES
// ============================================================================

export const VITAL_RANGES = {
  HEART_RATE: {
    MIN: 60,
    MAX: 100,
    WARNING_LOW: 55,
    WARNING_HIGH: 110,
  },
  BLOOD_PRESSURE_SYSTOLIC: {
    MIN: 90,
    MAX: 120,
    WARNING_HIGH: 140,
  },
  BLOOD_PRESSURE_DIASTOLIC: {
    MIN: 60,
    MAX: 80,
    WARNING_HIGH: 90,
  },
  OXYGEN_SATURATION: {
    MIN: 95,
    MAX: 100,
    WARNING_LOW: 90,
  },
  TEMPERATURE: {
    MIN: 36.5,
    MAX: 37.5,
    WARNING_LOW: 36,
    WARNING_HIGH: 38.5,
  },
  RESPIRATORY_RATE: {
    MIN: 12,
    MAX: 20,
    WARNING_HIGH: 24,
  },
} as const;

// ============================================================================
// PAGINATION & LIMITS
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZES: [10, 25, 50, 100],
} as const;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION_RULES = {
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_PATTERN: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
} as const;

export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and symbols',
  INVALID_NAME: 'Name must be between 2 and 50 characters',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_PHONE: 'Please enter a valid phone number',
  REQUIRED_FIELD: 'This field is required',
  SERVER_ERROR: 'An unexpected error occurred. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You do not have permission to perform this action',
  NOT_FOUND: 'Resource not found',
} as const;

// ============================================================================
// COLLECTION NAMES
// ============================================================================

export const COLLECTIONS = {
  USERS: 'users',
  PATIENTS: 'patients',
  STAFF: 'staff',
  DEPARTMENTS: 'departments',
  TASKS: 'tasks',
  APPOINTMENTS: 'appointments',
  VITAL_SIGNS: 'vital_signs',
  PATIENT_RECORDS: 'patient_records',
  CARE_TEAMS: 'care_teams',
  ACTIVITY_LOG: 'activity_log',
} as const;

// ============================================================================
// TIMING & DURATION
// ============================================================================

export const TIMING = {
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 500,
  API_TIMEOUT: 30000,
  POLLING_INTERVAL: 5000,
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  AI_CHAT_ENABLED: process.env.NEXT_PUBLIC_AI_ENABLED === 'true',
  ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
  NOTIFICATIONS_ENABLED: process.env.NEXT_PUBLIC_NOTIFICATIONS_ENABLED === 'true',
} as const;

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const UI = {
  THEME_LIGHT: 'light',
  THEME_DARK: 'dark',
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 80,
} as const;

// ============================================================================
// CHART COLORS
// ============================================================================

export const CHART_COLORS = {
  PRIMARY: '#10b981',
  SECONDARY: '#3b82f6',
  DANGER: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#06b6d4',
  NEUTRAL: '#6b7280',
} as const;
