import { RULPrediction, Bearing, SensorReading } from './types';

const ML_API_URL = process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8000';

export interface MLSensorData {
  vibration: number;
  temperature: number;
  acoustic_emission?: number;
  operating_hours: number;
  rotations_per_minute?: number;
}

export interface MLRULPredictionRequest {
  bearing_id: string;
  sensor_data: MLSensorData;
  historical_data?: number[];
}

export interface MLRULPredictionResponse {
  bearing_id: string;
  remaining_useful_life_days: number;
  health_score: number;
  risk_level: string;
  degradation_rate: number;
  confidence: number;
  prediction_timestamp: string;
}

export interface MLHealthAnalysis {
  bearing_id: string;
  current_health_score: number;
  health_trend: string;
  estimated_failure_date: string;
  days_to_failure: number;
  risk_category: string;
  recommended_action: string;
  confidence_level: number;
}

/**
 * ML API Client for NBC Bearings
 * Handles all communication with the Python ML API service
 */
export class MLAPIClient {
  private baseURL: string;

  constructor(baseURL: string = ML_API_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Check if ML API is available
   */
  async healthCheck(): Promise<{ status: string; model_loaded: boolean }> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      if (!response.ok) throw new Error('Health check failed');
      return await response.json();
    } catch (error) {
      console.error('[v0] ML API health check failed:', error);
      return { status: 'unavailable', model_loaded: false };
    }
  }

  /**
   * Upload a trained ML model file
   */
  async uploadModel(file: File): Promise<{ message: string; model_loaded: boolean }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseURL}/upload-model`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to upload model');
      }

      return await response.json();
    } catch (error) {
      console.error('[v0] Model upload failed:', error);
      throw error;
    }
  }

  /**
   * Predict RUL for a single bearing
   */
  async predictRUL(request: MLRULPredictionRequest): Promise<MLRULPredictionResponse> {
    try {
      const response = await fetch(`${this.baseURL}/predict-rul`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'RUL prediction failed');
      }

      return await response.json();
    } catch (error) {
      console.error('[v0] RUL prediction failed:', error);
      throw error;
    }
  }

  /**
   * Predict RUL for multiple bearings (batch)
   */
  async batchPredict(
    requests: MLRULPredictionRequest[]
  ): Promise<{ predictions: MLRULPredictionResponse[]; total: number }> {
    try {
      const response = await fetch(`${this.baseURL}/batch-predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requests),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Batch prediction failed');
      }

      return await response.json();
    } catch (error) {
      console.error('[v0] Batch prediction failed:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive health analysis for a bearing
   */
  async analyzeHealth(request: MLRULPredictionRequest): Promise<MLHealthAnalysis> {
    try {
      const response = await fetch(`${this.baseURL}/analyze-health`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Health analysis failed');
      }

      return await response.json();
    } catch (error) {
      console.error('[v0] Health analysis failed:', error);
      throw error;
    }
  }

  /**
   * Convert bearing data to ML API format
   */
  static convertBearingToMLFormat(
    bearing: Bearing,
    sensor: SensorReading,
    historicalScores?: number[]
  ): MLRULPredictionRequest {
    return {
      bearing_id: bearing.id,
      sensor_data: {
        vibration: sensor.vibration,
        temperature: sensor.temperature,
        acoustic_emission: sensor.acousticEmission || 0,
        operating_hours: bearing.operatingHours,
        rotations_per_minute: 3000, // Default RPM
      },
      historical_data: historicalScores,
    };
  }
}

// Singleton instance
export const mlApiClient = new MLAPIClient();
