'use server';

import { generateText } from 'ai';
import { Bearing, SensorReading } from '@/lib/types';

export async function generateAIPrediction(bearing: Bearing, sensorReadings: SensorReading[]): Promise<string> {
  // Prepare sensor data summary
  const sensorSummary = sensorReadings.slice(-10).map((r) => ({
    time: r.timestamp.toLocaleTimeString(),
    vibration: r.vibration.toFixed(2),
    temperature: r.temperature,
    acousticEmission: r.acousticEmission?.toFixed(2),
    rpm: r.rpm,
  }));

  const prompt = `You are an expert bearing maintenance engineer analyzing bearing health data.

Bearing Information:
- Position: ${bearing.position}
- Model: ${bearing.model}
- Health Score: ${bearing.healthScore}%
- Current Status: ${bearing.status}
- Operating Hours: ${bearing.operatingHours.toLocaleString()}
- Last Maintenance: ${bearing.lastMaintenanceDate ? bearing.lastMaintenanceDate.toLocaleDateString() : 'Unknown'}

Recent Sensor Readings (Last 10):
${JSON.stringify(sensorSummary, null, 2)}

Based on this bearing health data and sensor readings, provide:
1. A concise technical analysis of the bearing condition
2. Specific maintenance actions recommended
3. Estimated timeline for maintenance
4. Risk factors to monitor
5. Best practices to extend bearing life

Keep the recommendation practical, actionable, and aligned with industrial maintenance standards. Format with clear sections.`;

  try {
    const result = await generateText({
      model: 'openai/gpt-4-mini',
      prompt,
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    return result.text;
  } catch (error) {
    console.error('Error generating AI prediction:', error);
    throw new Error('Failed to generate AI prediction');
  }
}
