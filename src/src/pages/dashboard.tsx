import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { HazardInformation } from '../components/HazardInformation';
import { FaultTree } from '../components/FaultTree';
import { FMEA } from '../components/FMEA';
import { SafetyPerformanceIndicators } from '../components/SafetyPerformanceIndicators';
import { GSNTree } from '../components/GSNTree';
import { TraceabilityMatrix } from '../components/TraceabilityMatrix';
import { ComplianceDashboard } from '../components/ComplianceDashboard';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Network,
  FileSpreadsheet,
  Link2,
  ClipboardCheck,
  Radio,
  Activity,
} from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function Dashboard(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('hazards');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'hazards', label: 'Hazards', icon: AlertTriangle, description: 'Hazard Registry & FHA' },
    { id: 'faults', label: 'Fault Trees', icon: Network, description: 'Quantitative FTA' },
    { id: 'fmea', label: 'FMEA', icon: FileSpreadsheet, description: 'Failure Modes Analysis' },
    { id: 'spi', label: 'Performance', icon: TrendingUp, description: 'Safety KPIs' },
    { id: 'gsn', label: 'Safety Case', icon: Shield, description: 'GSN Arguments' },
    { id: 'trace', label: 'Traceability', icon: Link2, description: 'Requirements Matrix' },
    { id: 'compliance', label: 'Compliance', icon: ClipboardCheck, description: 'Standards Tracking' },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).toUpperCase();
  };

  return (
    <Layout
      title="Safety Dashboard"
      description="Comprehensive safety management for autonomous systems">
      <TooltipProvider>
        {/* Main container with tactical grid background */}
        <div
          className="min-h-screen tactical-grid"
          style={{
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
          }}
        >
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">

            {/* === COMMAND CENTER HEADER === */}
            <div className="mb-4">
              {/* Top bar with system status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" style={{ color: 'var(--electric-blue)' }} />
                    <span
                      className="text-sm font-semibold tracking-widest uppercase"
                      style={{ color: 'var(--foreground)' }}
                    >
                      Safety Dashboard
                    </span>
                  </div>
                  <span
                    className="text-xs font-mono tracking-wider"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    //
                  </span>
                  <span
                    className="text-xs font-mono tracking-wider uppercase"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    DO-178C / ARP4761A Compliant
                  </span>
                </div>

                {/* System status indicators */}
                <div className="hidden md:flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="status-dot status-dot-nominal" />
                    <span
                      className="text-xs font-mono tracking-wider uppercase"
                      style={{ color: 'var(--tactical-green)' }}
                    >
                      System Nominal
                    </span>
                  </div>
                  <div
                    className="h-3 w-px"
                    style={{ backgroundColor: 'var(--border)' }}
                  />
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" style={{ color: 'var(--muted-foreground)' }} />
                    <span
                      className="text-xs font-mono tabular-nums"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {formatDate(currentTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" style={{ color: 'var(--electric-blue)' }} />
                    <span
                      className="text-xs font-mono tabular-nums"
                      style={{ color: 'var(--electric-blue)' }}
                    >
                      {formatTime(currentTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tactical divider */}
              <div className="tactical-divider" />
            </div>

            {/* === MAIN PANEL === */}
            <div
              className="rounded-sm border shadow-xl"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'rgba(56, 189, 248, 0.1)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(56, 189, 248, 0.05)',
              }}
            >
              {/* Tab Navigation */}
              <div
                className="border-b"
                style={{ borderColor: 'rgba(56, 189, 248, 0.1)' }}
              >
                <nav className="flex -mb-px overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="group flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap min-w-fit"
                        style={{
                          borderBottomColor: isActive ? 'var(--electric-blue)' : 'transparent',
                          color: isActive ? 'var(--electric-blue)' : 'var(--muted-foreground)',
                          backgroundColor: isActive ? 'rgba(56, 189, 248, 0.05)' : 'transparent',
                          transition: 'all 150ms ease',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase' as const,
                        }}
                        title={tab.description}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.color = 'var(--foreground)';
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(56, 189, 248, 0.03)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            (e.currentTarget as HTMLElement).style.color = 'var(--muted-foreground)';
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ opacity: isActive ? 1 : 0.6 }}
                        />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-5">
                {activeTab === 'hazards' && <HazardInformation />}
                {activeTab === 'faults' && <FaultTree />}
                {activeTab === 'fmea' && <FMEA />}
                {activeTab === 'spi' && <SafetyPerformanceIndicators />}
                {activeTab === 'gsn' && <GSNTree />}
                {activeTab === 'trace' && <TraceabilityMatrix />}
                {activeTab === 'compliance' && <ComplianceDashboard />}
              </div>
            </div>

            {/* === FOOTER STATUS BAR === */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="text-[0.625rem] font-mono tracking-widest uppercase"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Safety Management System v2.1
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-[0.625rem] font-mono tracking-widest uppercase"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Classification: Unclassified
                </span>
                <span
                  className="text-[0.625rem] font-mono"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  //
                </span>
                <span
                  className="text-[0.625rem] font-mono tracking-widest uppercase"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  DAL-A Certified
                </span>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </Layout>
  );
}
