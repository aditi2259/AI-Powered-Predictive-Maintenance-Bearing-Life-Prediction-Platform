'use client';

import React, { useState, useCallback, Suspense } from 'react';
import { mockBearings, mockRULPredictions, mockSensorReadings } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { useSearchParams } from 'next/navigation';
import { Bearing, RULPrediction, SensorReading } from '@/lib/types';
import { generateAIPrediction } from '@/app/api/predictions/generate/action';
import { Spinner } from '@/components/ui/spinner';

interface GeneratedPrediction {
  bearingId: string;
  recommendation: string;
  loading: boolean;
}

function PredictionsContent() {
  const searchParams = useSearchParams();
  const selectedBearingId = searchParams.get('bearing');
  const [predictions, setPredictions] = useState<Map<string, GeneratedPrediction>>(new Map());

  const bearing = selectedBearingId
    ? mockBearings.find((b) => b.id === selectedBearingId) || mockBearings[0]
    : mockBearings[0];

  const prediction = mockRULPredictions.find((p) => p.bearingId === bearing.id);
  const bearingReadings = mockSensorReadings.filter((r) => r.bearingId === bearing.id);

  const handleGenerateAIPrediction = useCallback(
    async (bearingData: Bearing) => {
      const key = bearingData.id;
      setPredictions((prev) => {
        const newMap = new Map(prev);
        newMap.set(key, { bearingId: key, recommendation: '', loading: true });
        return newMap;
      });

      try {
        const sensorData = mockSensorReadings.filter((r) => r.bearingId === bearingData.id);
        const result = await generateAIPrediction(bearingData, sensorData);

        setPredictions((prev) => {
          const newMap = new Map(prev);
          newMap.set(key, { bearingId: key, recommendation: result, loading: false });
          return newMap;
        });
      } catch (error) {
        console.error('Error generating prediction:', error);
        setPredictions((prev) => {
          const newMap = new Map(prev);
          newMap.set(key, {
            bearingId: key,
            recommendation: 'Error generating prediction. Please try again.',
            loading: false,
          });
          return newMap;
        });
      }
    },
    []
  );

  const riskColor = {
    low: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950',
    medium: 'border-l-amber-500 bg-amber-50 dark:bg-amber-950',
    high: 'border-l-orange-500 bg-orange-50 dark:bg-orange-950',
    critical: 'border-l-red-500 bg-red-50 dark:bg-red-950',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">RUL Predictions</h1>
        <p className="text-muted-foreground mt-2">
          Remaining useful life predictions powered by AI analysis
        </p>
      </div>

      {/* Main Prediction Card */}
      {prediction && (
        <Card className={`border-l-4 ${riskColor[prediction.riskLevel]}`}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-foreground">
                  {bearing.position} Bearing - {bearing.model}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Health Score: {bearing.healthScore}% | Status:{' '}
                  <StatusBadge status={bearing.status} className="inline-block ml-2" />
                </p>
              </div>
              <StatusBadge
                status={
                  prediction.riskLevel === 'critical'
                    ? 'failed'
                    : prediction.riskLevel === 'high'
                    ? 'critical'
                    : prediction.riskLevel === 'medium'
                    ? 'degraded'
                    : 'healthy'
                }
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Predicted RUL</p>
                <p className="text-3xl font-bold text-foreground">{prediction.predictedRUL}</p>
                <p className="text-xs text-muted-foreground mt-1">days</p>
              </div>

              <div className="bg-background p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Estimated Failure</p>
                <p className="text-lg font-semibold text-foreground">
                  {prediction.estimatedFailureDate.toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.ceil((prediction.estimatedFailureDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days from today
                </p>
              </div>

              <div className="bg-background p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Confidence</p>
                <p className="text-3xl font-bold text-foreground">{prediction.confidence}%</p>
                <p className="text-xs text-muted-foreground mt-1">prediction accuracy</p>
              </div>

              <div className="bg-background p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
                <p className="text-lg font-semibold capitalize text-foreground">
                  {prediction.riskLevel}
                </p>
                <p className="text-xs text-muted-foreground mt-1">based on analysis</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-background p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-3">Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                {prediction.explanation}
              </p>
            </div>

            {/* AI-Generated Recommendation */}
            {predictions.get(bearing.id) && (
              <div className="bg-background p-4 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-3">AI-Generated Recommendation</h3>
                {predictions.get(bearing.id)?.loading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Spinner className="w-4 h-4" />
                    Generating detailed recommendation...
                  </div>
                ) : (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {predictions.get(bearing.id)?.recommendation}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => handleGenerateAIPrediction(bearing)}
                disabled={predictions.get(bearing.id)?.loading}
                className="bg-primary hover:bg-primary/90"
              >
                {predictions.get(bearing.id)?.loading ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Generating...
                  </>
                ) : (
                  'Generate AI Recommendation'
                )}
              </Button>
              <Button variant="outline">Schedule Maintenance</Button>
              <Button variant="outline">View History</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Predictions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Bearing</th>
                  <th className="text-left py-3 px-4 font-semibold">RUL</th>
                  <th className="text-left py-3 px-4 font-semibold">Est. Failure</th>
                  <th className="text-left py-3 px-4 font-semibold">Risk</th>
                  <th className="text-left py-3 px-4 font-semibold">Confidence</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockRULPredictions.map((pred) => {
                  const bear = mockBearings.find((b) => b.id === pred.bearingId);
                  return (
                    <tr key={pred.id} className="border-b border-border hover:bg-card/50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{bear?.position}</div>
                        <div className="text-xs text-muted-foreground">{bear?.model}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold">{pred.predictedRUL} days</td>
                      <td className="py-3 px-4">{pred.estimatedFailureDate.toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={
                            pred.riskLevel === 'critical'
                              ? 'failed'
                              : pred.riskLevel === 'high'
                              ? 'critical'
                              : pred.riskLevel === 'medium'
                              ? 'degraded'
                              : 'healthy'
                          }
                        />
                      </td>
                      <td className="py-3 px-4">{pred.confidence}%</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateAIPrediction(bear!)}
                          disabled={predictions.get(bear?.id!)?.loading}
                        >
                          {predictions.get(bear?.id!)?.loading ? (
                            <Spinner className="w-3 h-3" />
                          ) : (
                            'Generate'
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PredictionsPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading predictions...</div>}>
      <PredictionsContent />
    </Suspense>
  );
}
