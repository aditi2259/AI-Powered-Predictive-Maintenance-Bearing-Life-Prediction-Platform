'use client';

import React, { useState } from 'react';
import { mockMachines, mockBearings, mockSensorReadings } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function MachinesPage() {
  const [selectedMachineId, setSelectedMachineId] = useState(mockMachines[0]?.id);

  const selectedMachine = mockMachines.find((m) => m.id === selectedMachineId);
  const machineBearings = mockBearings.filter((b) => b.machineId === selectedMachineId);
  const machineReadings = mockSensorReadings
    .filter((r) => machineBearings.some((b) => b.id === r.bearingId))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Prepare chart data
  const chartData = machineReadings.reduce((acc, reading) => {
    const time = new Date(reading.timestamp).toLocaleTimeString();
    const existing = acc.find((d: any) => d.time === time);
    if (existing) {
      existing.vibration = (existing.vibration + reading.vibration) / 2;
      existing.temperature = (existing.temperature + reading.temperature) / 2;
    } else {
      acc.push({
        time,
        vibration: reading.vibration,
        temperature: reading.temperature,
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Machines</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage all machines with their bearing health data
        </p>
      </div>

      {/* Machine List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Machine List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Machines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockMachines.map((machine) => (
                  <button
                    key={machine.id}
                    onClick={() => setSelectedMachineId(machine.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedMachineId === machine.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-card'
                    }`}
                  >
                    <div className="font-medium text-sm">{machine.name}</div>
                    <div className="text-xs mt-1">
                      <StatusBadge status={machine.status} className="inline-block" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Machine Details */}
        <div className="lg:col-span-3 space-y-6">
          {selectedMachine && (
            <>
              {/* Machine Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedMachine.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Serial Number</p>
                      <p className="font-medium text-foreground">{selectedMachine.serialNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="mt-1">
                        <StatusBadge status={selectedMachine.status} className="inline-block" />
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Model</p>
                      <p className="font-medium text-foreground">{selectedMachine.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">{selectedMachine.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Install Date</p>
                      <p className="font-medium text-foreground">
                        {selectedMachine.installDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Operating Hours</p>
                      <p className="font-medium text-foreground">
                        {selectedMachine.operatingHours.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sensor Data Visualization */}
              {chartData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Real-time Sensor Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                          <XAxis dataKey="time" stroke="currentColor" opacity={0.5} />
                          <YAxis yAxisId="left" stroke="currentColor" opacity={0.5} />
                          <YAxis yAxisId="right" orientation="right" stroke="currentColor" opacity={0.5} />
                          <Tooltip />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="vibration"
                            stroke="#ef4444"
                            dot={false}
                            name="Vibration (mm/s)"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="temperature"
                            stroke="#f59e0b"
                            dot={false}
                            name="Temperature (°C)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bearings Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Bearings ({machineBearings.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Position</th>
                          <th className="text-left py-3 px-4 font-semibold">Model</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                          <th className="text-left py-3 px-4 font-semibold">Health</th>
                          <th className="text-left py-3 px-4 font-semibold">Hours</th>
                          <th className="text-left py-3 px-4 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {machineBearings.map((bearing) => (
                          <tr key={bearing.id} className="border-b border-border hover:bg-card/50">
                            <td className="py-3 px-4">{bearing.position}</td>
                            <td className="py-3 px-4">{bearing.model}</td>
                            <td className="py-3 px-4">
                              <StatusBadge status={bearing.status} />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      bearing.healthScore >= 80
                                        ? 'bg-emerald-500'
                                        : bearing.healthScore >= 50
                                        ? 'bg-amber-500'
                                        : 'bg-red-500'
                                    }`}
                                    style={{ width: `${bearing.healthScore}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{bearing.healthScore}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{bearing.operatingHours.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <Link href={`/dashboard/predictions?bearing=${bearing.id}`}>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
