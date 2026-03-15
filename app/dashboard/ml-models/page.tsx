'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mlApiClient } from '@/lib/ml-api-client';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

export default function MLModelsPage() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [message, setMessage] = useState('');
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const health = await mlApiClient.healthCheck();
      setApiStatus(health.status === 'ok' ? 'available' : 'unavailable');
      setModelLoaded(health.model_loaded);
    } catch (error) {
      setApiStatus('unavailable');
      setModelLoaded(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setMessage('');
    }
  };

  const handleUploadModel = async () => {
    if (!selectedFile) {
      setMessage('Please select a model file');
      return;
    }

    setLoading(true);
    try {
      const result = await mlApiClient.uploadModel(selectedFile);
      setMessage(`Success: ${result.message}`);
      setModelLoaded(result.model_loaded);
      setSelectedFile(null);
      setTimeout(() => setMessage(''), 5000);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestPrediction = async () => {
    if (!modelLoaded) {
      setMessage('Model not loaded. Please upload a model first.');
      return;
    }

    setLoading(true);
    try {
      const testRequest = {
        bearing_id: 'test_bearing_001',
        sensor_data: {
          vibration: 2.5,
          temperature: 65.2,
          acoustic_emission: 0.8,
          operating_hours: 15000,
          rotations_per_minute: 3000,
        },
      };

      const result = await mlApiClient.predictRUL(testRequest);
      setTestResults(result);
      setMessage('Test prediction successful!');
    } catch (error: any) {
      setMessage(`Prediction error: ${error.message}`);
      setTestResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* API Status */}
      <Card>
        <CardHeader>
          <CardTitle>ML API Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
              <div>
                <p className="font-semibold text-foreground">API Server</p>
                <p className="text-sm text-muted-foreground">{process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8000'}</p>
              </div>
              <div className="text-right">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  apiStatus === 'available' ? 'bg-emerald-500/20 text-emerald-500' :
                  apiStatus === 'checking' ? 'bg-amber-500/20 text-amber-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {apiStatus === 'available' ? 'Online' : apiStatus === 'checking' ? 'Checking...' : 'Offline'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
              <div>
                <p className="font-semibold text-foreground">Model Status</p>
                <p className="text-sm text-muted-foreground">{modelLoaded ? 'Model loaded and ready' : 'No model loaded'}</p>
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                modelLoaded ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
              }`}>
                {modelLoaded ? 'Ready' : 'Not Ready'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload ML Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors">
              <Input
                type="file"
                accept=".joblib,.pkl,.pickle,.h5,.model"
                onChange={handleFileSelect}
                className="hidden"
                id="model-file"
              />
              <label htmlFor="model-file" className="cursor-pointer">
                {selectedFile ? (
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: joblib, pickle, h5
                    </p>
                  </div>
                )}
              </label>
            </div>

            <Button
              onClick={handleUploadModel}
              disabled={!selectedFile || loading || apiStatus !== 'available'}
              className="w-full"
            >
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                'Upload Model'
              )}
            </Button>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.includes('Success') || message.includes('successful')
                  ? 'bg-emerald-500/20 text-emerald-500'
                  : 'bg-red-500/20 text-red-500'
              }`}>
                {message}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Prediction */}
      {modelLoaded && (
        <Card>
          <CardHeader>
            <CardTitle>Test Model Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Test the model with sample sensor data to verify it's working correctly.
              </p>

              <Button
                onClick={handleTestPrediction}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Running Test...
                  </>
                ) : (
                  'Run Test Prediction'
                )}
              </Button>

              {testResults && (
                <div className="space-y-3 p-4 bg-background rounded-lg border border-border">
                  <h4 className="font-semibold text-foreground">Test Results</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bearing ID:</span>
                      <span className="font-semibold text-foreground">{testResults.bearing_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">RUL (Days):</span>
                      <span className="font-semibold text-foreground">{testResults.remaining_useful_life_days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Health Score:</span>
                      <span className="font-semibold text-foreground">{testResults.health_score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Level:</span>
                      <span className={`font-semibold ${
                        testResults.risk_level === 'CRITICAL' ? 'text-red-500' :
                        testResults.risk_level === 'HIGH' ? 'text-orange-500' :
                        testResults.risk_level === 'MEDIUM' ? 'text-amber-500' :
                        'text-emerald-500'
                      }`}>
                        {testResults.risk_level}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="font-semibold text-foreground">{(testResults.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-foreground mb-2">1. Start ML API Server</h4>
              <code className="block bg-background p-3 rounded border border-border text-muted-foreground overflow-x-auto">
                cd ml-api && python main.py
              </code>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">2. Environment Variables</h4>
              <code className="block bg-background p-3 rounded border border-border text-muted-foreground overflow-x-auto">
                NEXT_PUBLIC_ML_API_URL=http://localhost:8000
              </code>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">3. Upload Your Model</h4>
              <p className="text-muted-foreground">
                Use the form above to upload your trained ML model (.joblib file). The model should output RUL predictions (days).
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">4. Make Predictions</h4>
              <p className="text-muted-foreground">
                Once uploaded, the model will automatically be used by the predictions and analytics pages.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
