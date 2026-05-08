/**
 * Comprehensive type definitions for VitalSync application
 * Provides centralized type management for consistency across the application
 */

// ============================================================================
// USER & AUTH TYPES
// ============================================================================

export type UserRole = 'patient' | 'doctor' | 'admin' | 'staff';

export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  lastLogin?: Date;
  createdAt?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  role: UserRole;
  confirmPassword: string;
}

// ============================================================================
// PATIENT & HEALTH DATA TYPES
// ============================================================================

export interface VitalSign {
  id: string;
  patientId: string;
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  recordedAt: Date;
  recordedBy: string;
  notes?: string;
}

export interface Patient {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  bloodType: string;
  allergies: string[];
  medicalHistory: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientRecord {
  id: string;
  patientId: string;
  type: 'diagnosis' | 'treatment' | 'prescription' | 'note';
  title: string;
  description: string;
  recordedBy: string;
  recordedAt: Date;
  attachments?: string[];
}

// ============================================================================
// STAFF & TEAM TYPES
// ============================================================================

export interface StaffMember {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  specialization?: string;
  licenseNumber?: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'on-leave';
  joinedAt: Date;
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  staffCount: number;
  headId?: string;
  createdAt: Date;
}

export interface CareTeam {
  id: string;
  patientId: string;
  members: string[]; // Staff UIDs
  role: 'primary' | 'secondary' | 'specialist';
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

// ============================================================================
// TASK & SCHEDULING TYPES
// ============================================================================

export interface Task {
  id: string;
  createdBy: string;
  assignedTo: string;
  patientId?: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  staffId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  type: 'consultation' | 'follow-up' | 'procedure' | 'check-in';
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// ANALYTICS & DASHBOARD TYPES
// ============================================================================

export interface DashboardStats {
  totalPatients: number;
  activeAppointments: number;
  pendingTasks: number;
  departmentStats: DepartmentStat[];
  recentActivities: Activity[];
}

export interface DepartmentStat {
  department: string;
  staffCount: number;
  patientLoad: number;
  efficiency: number;
}

export interface Activity {
  id: string;
  type: 'patient_registered' | 'appointment_scheduled' | 'task_created' | 'vital_recorded';
  userId: string;
  resourceId: string;
  description: string;
  timestamp: Date;
}

export interface ChartData {
  name: string;
  value: number;
  timestamp?: Date;
}

// ============================================================================
// API & ERROR TYPES
// ============================================================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  timestamp: Date;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class ApplicationError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

// ============================================================================
// FORM & VALIDATION TYPES
// ============================================================================

export interface FormError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormError[];
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// ============================================================================
// FIREBASE & DATABASE TYPES
// ============================================================================

export interface FirestoreEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
}

export interface FirestoreCRUDOptions {
  collectionName: string;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  filterField?: string;
  constraints?: any[];
}
