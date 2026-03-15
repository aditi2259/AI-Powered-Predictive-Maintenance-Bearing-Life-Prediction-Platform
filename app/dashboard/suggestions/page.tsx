'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { ImprovementSuggestion } from '@/components/dashboard/improvement-suggestion';
import { mockBearings, mockRULPredictions, mockServiceContracts } from '@/lib/mock-data';

export default function SuggestionsPage() {
  const { user } = useAuth();

  // Calculate metrics for suggestions
  const criticalBearings = mockBearings.filter((b) => b.healthScore < 40);
  const degradedBearings = mockBearings.filter((b) => b.healthScore >= 40 && b.healthScore < 60);
  const replacementDemand90Days = mockRULPredictions.filter(
    (p) => p.predictedRUL <= 90
  ).length;
  const aftermarketValue = replacementDemand90Days * 1214;
  const contractedMachines = mockServiceContracts.length;
  const totalMachines = new Set(mockBearings.map((b) => b.machineId)).size;
  const uncontractedMachines = totalMachines - contractedMachines;

  // Engineer/Maintenance focused suggestions
  const engineerSuggestions = [
    {
      number: 1,
      title: 'Monitor Critical Bearing Trends',
      description: 'Track degradation patterns for critical condition bearings',
      suggestedMetric: 'Critical Bearing Health Trajectory',
      example: [
        { label: 'Critical Bearings', value: criticalBearings.length },
        { label: 'Avg Days to Failure', value: '45 days' },
        { label: 'Replacement Cost', value: '$12,140' },
      ],
      impact:
        'Prevents catastrophic failures and provides early warning for intervention planning.',
    },
    {
      number: 2,
      title: 'Implement Condition-Based Alerts',
      description: 'Create automated alerts when bearings reach degraded status',
      suggestedMetric: 'Health Score Alert Thresholds',
      example: [
        { label: 'Critical Threshold', value: '< 40 (immediate action)' },
        { label: 'Warning Threshold', value: '40-60 (schedule replacement)' },
        { label: 'Monitoring Threshold', value: '60-80 (monitor closely)' },
      ],
      impact: 'Reduces reaction time to bearing failures and enables proactive maintenance.',
    },
    {
      number: 3,
      title: 'Enhance Predictive Model Accuracy',
      description: 'Continuously improve RUL prediction accuracy with historical failure data',
      suggestedMetric: 'Prediction Accuracy Metrics',
      example: [
        { label: 'Current Accuracy', value: '92.4%' },
        { label: 'Predictions Last Month', value: `${replacementDemand90Days * 2}` },
        { label: 'Mean Absolute Error', value: '3.2 days' },
      ],
      impact: 'Increases confidence in predictions and allows for more aggressive preventive scheduling.',
    },
  ];

  // Manager/Operations focused suggestions
  const managerSuggestions = [
    {
      number: 1,
      title: 'Add Fleet Downtime Projection',
      description: 'On your reports page, calculate expected downtime from bearing failures',
      suggestedMetric: 'Projected Downtime Impact (Next 90 Days)',
      example: [
        { label: 'Expected Failures', value: replacementDemand90Days },
        { label: 'Avg Downtime per Failure', value: '4 hours' },
        { label: 'Total Fleet Impact', value: `${replacementDemand90Days * 4} hours` },
      ],
      impact:
        'Enables better operational planning and resource allocation across facilities.',
    },
    {
      number: 2,
      title: 'Track Cost of Unplanned Maintenance',
      description: 'Monitor the financial impact of reactive vs. predictive maintenance',
      suggestedMetric: 'Maintenance Cost Analysis',
      example: [
        { label: 'Reactive Maintenance Cost', value: '$89,000 (estimated yearly)' },
        { label: 'Predictive Maintenance Cost', value: '$45,000 (estimated yearly)' },
        { label: 'Annual Savings', value: '$44,000' },
      ],
      impact: 'Justifies investment in predictive maintenance and demonstrates ROI to leadership.',
    },
    {
      number: 3,
      title: 'Monitor Equipment Utilization',
      description: 'Track bearing life usage and replacement patterns by machine type',
      suggestedMetric: 'Equipment Life Utilization Rate',
      example: [
        { label: 'Avg Bearing Life Used', value: '73%' },
        { label: 'Bearings in Critical Phase', value: `${criticalBearings.length}` },
        { label: 'Replacement Schedule Confidence', value: '94%' },
      ],
      impact:
        'Helps identify machines with excessive wear patterns and guides capital equipment decisions.',
    },
  ];

  // Sales focused suggestions
  const salesSuggestions = [
    {
      number: 1,
      title: 'Highlight Aftermarket Revenue Opportunity',
      description: 'On your sales dashboard, emphasize the aftermarket bearing sales pipeline',
      suggestedMetric: 'Projected Replacement Demand (Next 90 Days)',
      example: [
        { label: 'Expected Bearing Replacements', value: replacementDemand90Days },
        { label: 'Estimated Aftermarket Value', value: `$${aftermarketValue.toLocaleString()}` },
        { label: 'Service Contract Upsell', value: '32 opportunities' },
      ],
      impact:
        'This will help identify and quantify high-value sales opportunities with existing customers.',
    },
    {
      number: 2,
      title: 'Add Contract Coverage Gap Analysis',
      description: 'Display machines without service contracts as direct sales targets',
      suggestedMetric: 'Service Contract Gap Analysis',
      example: [
        { label: 'Uncontracted Machines', value: uncontractedMachines },
        { label: 'Potential Annual Revenue', value: `$${uncontractedMachines * 15000}` },
        { label: 'Contract Conversion Rate', value: '68% (industry avg)' },
      ],
      impact:
        'Creates clear visibility into addressable market and helps prioritize sales efforts.',
    },
    {
      number: 3,
      title: 'Track Upsell and Cross-sell Metrics',
      description: 'Monitor success rate of upgrades from reactive to predictive contracts',
      suggestedMetric: 'Service Tier Upgrade Success',
      example: [
        { label: 'Reactive → Predictive Conversions', value: '8 this quarter' },
        { label: 'Average Deal Value Increase', value: '85%' },
        { label: 'Customer Retention Impact', value: '+22%' },
      ],
      impact:
        'Demonstrates the link between technical improvements and sales success, motivating team adoption.',
    },
  ];

  // Admin focused suggestions
  const adminSuggestions = [
    {
      number: 1,
      title: 'Add System Performance Metrics',
      description: 'On your admin dashboard, monitor API response times and data accuracy',
      suggestedMetric: 'System Health Dashboard',
      example: [
        { label: 'Average API Response Time', value: '142ms' },
        { label: 'Data Sync Success Rate', value: '99.8%' },
        { label: 'AI Prediction Accuracy', value: '94.2%' },
      ],
      impact: 'Ensures system reliability and provides data for infrastructure scaling decisions.',
    },
    {
      number: 2,
      title: 'Implement User Adoption Tracking',
      description: 'Monitor which features are being used and by which user segments',
      suggestedMetric: 'Feature Adoption Metrics',
      example: [
        { label: 'Active Daily Users', value: '12 of 16' },
        { label: 'Most Used Feature', value: 'RUL Predictions (34% of actions)' },
        { label: 'Training Completion Rate', value: '87%' },
      ],
      impact:
        'Identifies training needs and helps optimize the UI based on actual usage patterns.',
    },
    {
      number: 3,
      title: 'Track Data Quality and Completeness',
      description: 'Monitor sensor data quality across all machines and bearings',
      suggestedMetric: 'Data Quality Scorecard',
      example: [
        { label: 'Sensor Data Completeness', value: '98.5%' },
        { label: 'Missing RUL Predictions', value: '0' },
        { label: 'Data Anomalies Detected', value: '2 (auto-resolved)' },
      ],
      impact:
        'Ensures reliable analytics and builds confidence in AI-driven recommendations.',
    },
  ];

  let suggestionsToShow = [];
  if (user?.role === 'engineer') {
    suggestionsToShow = engineerSuggestions;
  } else if (user?.role === 'manager') {
    suggestionsToShow = managerSuggestions;
  } else if (user?.role === 'sales') {
    suggestionsToShow = salesSuggestions;
  } else if (user?.role === 'admin') {
    suggestionsToShow = adminSuggestions;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Improvement Suggestions</h1>
        <p className="text-muted-foreground mt-2">
          Personalized recommendations to enhance your dashboard experience
        </p>
      </div>

      {/* Role-based message */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          These suggestions are tailored for your role as{' '}
          <span className="font-semibold capitalize">{user?.role}</span>. They highlight
          metrics and features that would provide the most value to your daily workflow.
        </p>
      </div>

      {/* Suggestions Grid */}
      <div className="grid gap-6">
        {suggestionsToShow.map((suggestion) => (
          <ImprovementSuggestion
            key={suggestion.number}
            number={suggestion.number}
            title={suggestion.title}
            description={suggestion.description}
            suggestedMetric={suggestion.suggestedMetric}
            example={suggestion.example}
            impact={suggestion.impact}
          />
        ))}
      </div>
    </div>
  );
}
