'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-2xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-foreground">NBC Bearings</h1>
            {!isAuthenticated && (
              <div className="flex gap-3">
                <Button variant="outline">Sign In</Button>
                <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-accent bg-accent/10 px-4 py-2 rounded-full">
                Predictive Maintenance Platform
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              AI-Powered Bearing Health Monitoring
            </h2>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Predict bearing failures before they happen. Reduce downtime, optimize maintenance costs, and extend equipment life with our intelligent monitoring system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  View Dashboard
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors">
              <div className="text-3xl mb-3 w-8 h-8 flex items-center justify-center bg-primary/10 rounded">✦</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">RUL Predictions</h3>
              <p className="text-muted-foreground">
                AI-powered remaining useful life predictions with confidence scores and risk assessment.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors">
              <div className="text-3xl mb-3 w-8 h-8 flex items-center justify-center bg-accent/10 rounded">■</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Real-time Monitoring</h3>
              <p className="text-muted-foreground">
                Continuous sensor data analysis with vibration, temperature, and acoustic emission monitoring.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors">
              <div className="text-3xl mb-3 w-8 h-8 flex items-center justify-center bg-primary/10 rounded">◆</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Smart Recommendations</h3>
              <p className="text-muted-foreground">
                Actionable maintenance recommendations powered by machine learning insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card/50 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">50%</div>
              <p className="text-muted-foreground mt-2">Average downtime reduction</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">$2.5M+</div>
              <p className="text-muted-foreground mt-2">Maintenance cost savings</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <p className="text-muted-foreground mt-2">Bearings monitored</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">99.9%</div>
              <p className="text-muted-foreground mt-2">System uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">Platform Features</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for predictive bearing maintenance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: 'A',
              title: 'Analytics Dashboard',
              desc: 'Comprehensive analytics across all machines and bearings',
            },
            {
              icon: 'O',
              title: 'Sales Opportunities',
              desc: 'Identify service contract and upgrade opportunities',
            },
            {
              icon: 'M',
              title: 'Maintenance Planning',
              desc: 'Optimize maintenance schedules and reduce costs',
            },
            {
              icon: 'M',
              title: 'Multi-role Support',
              desc: 'Engineer, Manager, Sales, and Admin perspectives',
            },
            {
              icon: 'S',
              title: 'Secure Platform',
              desc: 'Enterprise-grade security and data protection',
            },
            {
              icon: 'A',
              title: 'API Integration',
              desc: 'Easy integration with existing systems',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-lg p-8 hover:border-accent hover:shadow-lg transition-all"
            >
              <div className="text-4xl font-bold mb-4 text-primary w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10">{feature.icon}</div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h4>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 border-y border-border py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Maintenance Strategy?
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join leading manufacturers using NBC Bearings for predictive maintenance
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Monitoring Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2024 NBC Bearings. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
