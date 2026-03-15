import { User, Machine, Bearing, SensorReading, RULPrediction, MaintenanceRecommendation, ServiceContract, DashboardStats } from './types';

// Mock current user (in a real app, this would come from auth)
export const mockCurrentUser: User = {
  id: '1',
  email: 'engineer@nbcbearings.com',
  name: 'Sarah Johnson',
  role: 'engineer',
  company: 'Automotive Manufacturing Co',
  createdAt: new Date('2024-01-15'),
};

// Mock machines
export const mockMachines: Machine[] = [
  {
    id: 'M1',
    name: 'Assembly Line Motor 1',
    serialNumber: 'SN-2021-0001',
    companyId: 'C1',
    location: 'Building A, Floor 2',
    installDate: new Date('2020-06-15'),
    model: 'ABB IE3 90kW',
    operatingHours: 45320,
    status: 'active',
    bearings: [],
  },
  {
    id: 'M2',
    name: 'Conveyor System Motor',
    serialNumber: 'SN-2021-0002',
    companyId: 'C1',
    location: 'Building B, Ground',
    installDate: new Date('2019-03-20'),
    model: 'Siemens 75kW',
    operatingHours: 62850,
    status: 'active',
    bearings: [],
  },
  {
    id: 'M3',
    name: 'Pump Station Motor',
    serialNumber: 'SN-2022-0003',
    companyId: 'C1',
    location: 'Building C, Utility Area',
    installDate: new Date('2022-09-10'),
    model: 'Regal Rexnord 55kW',
    operatingHours: 15600,
    status: 'active',
    bearings: [],
  },
  {
    id: 'M4',
    name: 'CNC Machine Spindle',
    serialNumber: 'SN-2020-0004',
    companyId: 'C1',
    location: 'Building A, Production Floor',
    installDate: new Date('2020-02-01'),
    model: 'DMG Mori Seiki',
    operatingHours: 78450,
    status: 'maintenance',
    bearings: [],
  },
];

// Mock bearings
export const mockBearings: Bearing[] = [
  // Machine M1 - 3 bearings
  {
    id: 'B1',
    machineId: 'M1',
    position: 'Drive End',
    model: 'SKF 6309',
    installDate: new Date('2023-04-10'),
    operatingHours: 8900,
    lastMaintenanceDate: new Date('2024-08-20'),
    status: 'healthy',
    healthScore: 92,
  },
  {
    id: 'B2',
    machineId: 'M1',
    position: 'Non-Drive End',
    model: 'SKF 6309',
    installDate: new Date('2023-04-10'),
    operatingHours: 8900,
    lastMaintenanceDate: new Date('2024-08-20'),
    status: 'degraded',
    healthScore: 65,
  },
  {
    id: 'B3',
    machineId: 'M1',
    position: 'Auxiliary',
    model: 'FAG 6208',
    installDate: new Date('2024-01-15'),
    operatingHours: 3200,
    status: 'healthy',
    healthScore: 88,
  },
  // Machine M2 - 3 bearings
  {
    id: 'B4',
    machineId: 'M2',
    position: 'Drive End',
    model: 'NSK 6310',
    installDate: new Date('2022-11-05'),
    operatingHours: 12450,
    lastMaintenanceDate: new Date('2024-06-15'),
    status: 'critical',
    healthScore: 35,
  },
  {
    id: 'B5',
    machineId: 'M2',
    position: 'Non-Drive End',
    model: 'NSK 6310',
    installDate: new Date('2022-11-05'),
    operatingHours: 12450,
    status: 'healthy',
    healthScore: 78,
  },
  {
    id: 'B6',
    machineId: 'M2',
    position: 'Auxiliary',
    model: 'TIMKEN 6207',
    installDate: new Date('2023-07-20'),
    operatingHours: 6780,
    status: 'healthy',
    healthScore: 85,
  },
  // Machine M3 - 2 bearings
  {
    id: 'B7',
    machineId: 'M3',
    position: 'Drive End',
    model: 'SKF 6311',
    installDate: new Date('2024-02-01'),
    operatingHours: 2100,
    status: 'healthy',
    healthScore: 96,
  },
  {
    id: 'B8',
    machineId: 'M3',
    position: 'Non-Drive End',
    model: 'SKF 6311',
    installDate: new Date('2024-02-01'),
    operatingHours: 2100,
    status: 'healthy',
    healthScore: 94,
  },
  // Machine M4 - 4 bearings
  {
    id: 'B9',
    machineId: 'M4',
    position: 'Spindle Main',
    model: 'NSK 7018 CTRSULP4',
    installDate: new Date('2022-05-15'),
    operatingHours: 18920,
    lastMaintenanceDate: new Date('2024-09-01'),
    status: 'degraded',
    healthScore: 58,
  },
  {
    id: 'B10',
    machineId: 'M4',
    position: 'Spindle Support',
    model: 'TIMKEN 7010WD',
    installDate: new Date('2022-05-15'),
    operatingHours: 18920,
    status: 'critical',
    healthScore: 42,
  },
  {
    id: 'B11',
    machineId: 'M4',
    position: 'Feed Axis',
    model: 'SKF 7010 ACDGA',
    installDate: new Date('2023-08-10'),
    operatingHours: 6750,
    status: 'healthy',
    healthScore: 81,
  },
  {
    id: 'B12',
    machineId: 'M4',
    position: 'Auxiliary Support',
    model: 'FAG 6009',
    installDate: new Date('2023-08-10'),
    operatingHours: 6750,
    status: 'failed',
    healthScore: 5,
  },
];

// Mock sensor readings
export const mockSensorReadings: SensorReading[] = [
  // Recent readings for B2 (degraded)
  {
    id: 'SR1',
    bearingId: 'B2',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    vibration: 8.2,
    temperature: 62,
    acousticEmission: 52,
    rpm: 1800,
  },
  {
    id: 'SR2',
    bearingId: 'B2',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    vibration: 8.5,
    temperature: 64,
    acousticEmission: 54,
    rpm: 1800,
  },
  {
    id: 'SR3',
    bearingId: 'B2',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    vibration: 8.8,
    temperature: 65,
    acousticEmission: 56,
    rpm: 1800,
  },
  // Recent readings for B4 (critical)
  {
    id: 'SR4',
    bearingId: 'B4',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    vibration: 15.2,
    temperature: 78,
    acousticEmission: 72,
    rpm: 1500,
  },
  {
    id: 'SR5',
    bearingId: 'B4',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    vibration: 16.1,
    temperature: 82,
    acousticEmission: 75,
    rpm: 1500,
  },
  {
    id: 'SR6',
    bearingId: 'B4',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    vibration: 17.8,
    temperature: 85,
    acousticEmission: 78,
    rpm: 1500,
  },
  // Healthy bearing readings
  {
    id: 'SR7',
    bearingId: 'B1',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    vibration: 3.2,
    temperature: 45,
    acousticEmission: 35,
    rpm: 1800,
  },
];

// Mock RUL predictions
export const mockRULPredictions: RULPrediction[] = [
  {
    id: 'RUL1',
    bearingId: 'B2',
    predictedRUL: 180,
    confidence: 87,
    riskLevel: 'medium',
    estimatedFailureDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    generatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    explanation: 'Vibration levels showing gradual increase. Temperature elevated by 15°C compared to baseline. Acoustic emissions suggest early spalling development.',
  },
  {
    id: 'RUL2',
    bearingId: 'B4',
    predictedRUL: 14,
    confidence: 94,
    riskLevel: 'critical',
    estimatedFailureDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    generatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    explanation: 'Critical degradation detected. Vibration levels 5x above normal. Temperature elevated to 85°C. Immediate maintenance recommended to prevent catastrophic failure.',
  },
  {
    id: 'RUL3',
    bearingId: 'B9',
    predictedRUL: 210,
    confidence: 82,
    riskLevel: 'medium',
    estimatedFailureDate: new Date(Date.now() + 210 * 24 * 60 * 60 * 1000),
    generatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    explanation: 'Spindle bearing showing wear patterns consistent with high-speed operation. Recommend inspection during next scheduled maintenance window.',
  },
  {
    id: 'RUL4',
    bearingId: 'B10',
    predictedRUL: 21,
    confidence: 91,
    riskLevel: 'high',
    estimatedFailureDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    generatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    explanation: 'Support bearing degradation accelerating. Combined stress from spindle main bearing wear. Plan replacement within 3 weeks to maintain spindle precision.',
  },
];

// Mock maintenance recommendations
export const mockRecommendations: MaintenanceRecommendation[] = [
  {
    id: 'REC1',
    bearingId: 'B4',
    bearingModel: 'NSK 6310',
    machineId: 'M2',
    machineName: 'Conveyor System Motor',
    recommendation: 'Replace bearing immediately. Critical wear detected with elevated vibration and temperature. Continuing operation risks machine failure.',
    priority: 'urgent',
    estimatedDowntime: 4,
    estimatedCost: 850,
    generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
  {
    id: 'REC2',
    bearingId: 'B2',
    bearingModel: 'SKF 6309',
    machineId: 'M1',
    machineName: 'Assembly Line Motor 1',
    recommendation: 'Schedule bearing replacement within next maintenance window. Current health score of 65 indicates early degradation. Proactive replacement will prevent unexpected downtime.',
    priority: 'high',
    estimatedDowntime: 3,
    estimatedCost: 620,
    generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'pending',
  },
  {
    id: 'REC3',
    bearingId: 'B10',
    bearingModel: 'TIMKEN 7010WD',
    machineId: 'M4',
    machineName: 'CNC Machine Spindle',
    recommendation: 'Plan bearing replacement and spindle recalibration. Support bearing failure would compromise spindle precision affecting product quality.',
    priority: 'high',
    estimatedDowntime: 6,
    estimatedCost: 2100,
    generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'scheduled',
  },
];

// Mock service contracts
export const mockServiceContracts: ServiceContract[] = [
  {
    id: 'SC1',
    companyId: 'C1',
    customerName: 'Automotive Manufacturing Co',
    machineId: 'M1',
    machineName: 'Assembly Line Motor 1',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2025-12-31'),
    serviceType: 'predictive',
    monthlyValue: 2500,
    bearingsIncluded: 3,
    status: 'active',
  },
  {
    id: 'SC2',
    companyId: 'C1',
    customerName: 'Automotive Manufacturing Co',
    machineId: 'M2',
    machineName: 'Conveyor System Motor',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2025-03-14'),
    serviceType: 'preventive',
    monthlyValue: 1800,
    bearingsIncluded: 3,
    status: 'active',
  },
  {
    id: 'SC3',
    companyId: 'C1',
    customerName: 'Automotive Manufacturing Co',
    machineId: 'M4',
    machineName: 'CNC Machine Spindle',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2025-05-31'),
    serviceType: 'predictive',
    monthlyValue: 4200,
    bearingsIncluded: 4,
    status: 'active',
  },
];

// Calculate dashboard stats
export const calculateDashboardStats = (): DashboardStats => {
  const totalMachines = mockMachines.length;
  const totalBearings = mockBearings.length;
  const healthyBearings = mockBearings.filter((b) => b.status === 'healthy').length;
  const degradedBearings = mockBearings.filter((b) => b.status === 'degraded').length;
  const criticalBearings = mockBearings.filter((b) => b.status === 'critical').length;
  const failedBearings = mockBearings.filter((b) => b.status === 'failed').length;
  const averageHealthScore =
    mockBearings.reduce((sum, b) => sum + b.healthScore, 0) / totalBearings;
  const pendingRecommendations = mockRecommendations.filter(
    (r) => r.status === 'pending'
  ).length;
  const upcomingFailures = mockRULPredictions.filter(
    (r) => r.predictedRUL < 90
  ).length;

  return {
    totalMachines,
    totalBearings,
    healthyBearings,
    degradedBearings,
    criticalBearings,
    failedBearings,
    averageHealthScore: Math.round(averageHealthScore * 100) / 100,
    pendingRecommendations,
    upcomingFailures,
  };
};
