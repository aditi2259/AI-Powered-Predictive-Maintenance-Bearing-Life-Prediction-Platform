// User roles
export type UserRole = 'admin' | 'engineer' | 'manager' | 'sales';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company: string;
  createdAt: Date;
}

// Machine/Plant data
export interface Machine {
  id: string;
  name: string;
  serialNumber: string;
  companyId: string;
  location: string;
  installDate: Date;
  model: string;
  operatingHours: number;
  status: 'active' | 'maintenance' | 'offline';
  bearings: Bearing[];
}

// Bearing data
export interface Bearing {
  id: string;
  machineId: string;
  position: string;
  model: string;
  installDate: Date;
  operatingHours: number;
  lastMaintenanceDate?: Date;
  status: 'healthy' | 'degraded' | 'critical' | 'failed';
  healthScore: number; // 0-100
}

// Sensor readings
export interface SensorReading {
  id: string;
  bearingId: string;
  timestamp: Date;
  vibration: number; // mm/s
  temperature: number; // °C
  acousticEmission?: number; // dB
  rpm?: number;
}

// RUL Prediction
export interface RULPrediction {
  id: string;
  bearingId: string;
  predictedRUL: number; // days
  confidence: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedFailureDate: Date;
  generatedAt: Date;
  explanation: string;
}

// Maintenance Recommendation
export interface MaintenanceRecommendation {
  id: string;
  bearingId: string;
  bearingModel: string;
  machineId: string;
  machineName: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDowntime: number; // hours
  estimatedCost: number;
  generatedAt: Date;
  generatedBy?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'dismissed';
}

// Service Contract
export interface ServiceContract {
  id: string;
  companyId: string;
  customerName: string;
  machineId: string;
  machineName: string;
  startDate: Date;
  endDate: Date;
  serviceType: 'preventive' | 'predictive' | 'reactive';
  monthlyValue: number;
  bearingsIncluded: number;
  status: 'active' | 'expired' | 'pending';
}

// Dashboard stats
export interface DashboardStats {
  totalMachines: number;
  totalBearings: number;
  healthyBearings: number;
  degradedBearings: number;
  criticalBearings: number;
  failedBearings: number;
  averageHealthScore: number;
  pendingRecommendations: number;
  upcomingFailures: number;
}
