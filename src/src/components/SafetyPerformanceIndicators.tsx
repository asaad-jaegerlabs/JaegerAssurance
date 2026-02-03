import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const incidentTrendData = [
  { month: 'Jan', incidents: 3, resolved: 3 },
  { month: 'Feb', incidents: 5, resolved: 4 },
  { month: 'Mar', incidents: 2, resolved: 2 },
  { month: 'Apr', incidents: 4, resolved: 5 },
  { month: 'May', incidents: 1, resolved: 3 },
  { month: 'Jun', incidents: 2, resolved: 2 },
];

const safetyMetricsData = [
  { metric: 'Equipment Checks', completion: 95 },
  { metric: 'Training', completion: 88 },
  { metric: 'Risk Assessments', completion: 92 },
  { metric: 'Audits', completion: 100 },
  { metric: 'Documentation', completion: 85 },
];

const hazardByCategory = [
  { name: 'Electrical', value: 8 },
  { name: 'Mechanical', value: 12 },
  { name: 'Software', value: 6 },
  { name: 'Environmental', value: 5 },
  { name: 'Human Factors', value: 9 },
];

// Tactical chart colors
const COLORS = ['#38bdf8', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];

export function SafetyPerformanceIndicators() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="tracking-tight">Safety Performance Indicators</h2>
        <p className="text-muted-foreground mt-1 font-mono text-xs tracking-wider uppercase">Key metrics and trends for safety performance monitoring</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="tactical-corners rounded-sm border border-electric-blue/20 p-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="data-label" style={{ color: 'var(--electric-blue)' }}>Total Hazards</div>
              <div className="data-value-large mt-1" style={{ color: 'var(--electric-blue)' }}>40</div>
            </div>
            <AlertCircle className="w-8 h-8 opacity-40" style={{ color: 'var(--electric-blue)' }} />
          </div>
        </div>

        <div className="tactical-corners rounded-sm border border-tactical-green/20 p-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="data-label" style={{ color: 'var(--tactical-green)' }}>Mitigated</div>
              <div className="data-value-large mt-1" style={{ color: 'var(--tactical-green)' }}>32</div>
            </div>
            <CheckCircle className="w-8 h-8 opacity-40" style={{ color: 'var(--tactical-green)' }} />
          </div>
          <div className="tactical-chip tactical-chip-up mt-2">
            <TrendingUp className="w-3 h-3" />
            <span>+5% from last month</span>
          </div>
        </div>

        <div className="tactical-corners rounded-sm border border-warning-amber/20 p-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="data-label" style={{ color: 'var(--warning-amber)' }}>Open Issues</div>
              <div className="data-value-large mt-1" style={{ color: 'var(--warning-amber)' }}>8</div>
            </div>
            <AlertCircle className="w-8 h-8 opacity-40" style={{ color: 'var(--warning-amber)' }} />
          </div>
          <div className="tactical-chip tactical-chip-up mt-2">
            <TrendingDown className="w-3 h-3" />
            <span>-12% from last month</span>
          </div>
        </div>

        <div className="tactical-corners rounded-sm border border-info-cyan/20 p-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="data-label" style={{ color: 'var(--info-cyan)' }}>Safety Score</div>
              <div className="data-value-large mt-1" style={{ color: 'var(--info-cyan)' }}>92%</div>
            </div>
            <TrendingUp className="w-8 h-8 opacity-40" style={{ color: 'var(--info-cyan)' }} />
          </div>
          <div className="tactical-chip tactical-chip-up mt-2">
            <TrendingUp className="w-3 h-3" />
            <span>+3% from last month</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-sm border border-border/40 p-6 scanline-overlay" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <h3 className="mb-4 uppercase tracking-wider text-sm font-semibold">Incident Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={incidentTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
              <XAxis dataKey="month" stroke="hsl(215, 15%, 52%)" fontSize={11} fontFamily="JetBrains Mono" />
              <YAxis stroke="hsl(215, 15%, 52%)" fontSize={11} fontFamily="JetBrains Mono" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-overlay)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '4px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '0.75rem',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} name="New Incidents" dot={{ fill: '#ef4444', r: 3 }} />
              <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} name="Resolved" dot={{ fill: '#22c55e', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-sm border border-border/40 p-6 scanline-overlay" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <h3 className="mb-4 uppercase tracking-wider text-sm font-semibold">Hazards by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={hazardByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                stroke="var(--bg-base)"
                strokeWidth={2}
              >
                {hazardByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-overlay)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '4px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '0.75rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="rounded-sm border border-border/40 p-6 scanline-overlay" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <h3 className="mb-4 uppercase tracking-wider text-sm font-semibold">Safety Metrics Completion</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={safetyMetricsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
            <XAxis dataKey="metric" stroke="hsl(215, 15%, 52%)" fontSize={11} fontFamily="JetBrains Mono" />
            <YAxis domain={[0, 100]} stroke="hsl(215, 15%, 52%)" fontSize={11} fontFamily="JetBrains Mono" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-overlay)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '4px',
                fontFamily: 'JetBrains Mono',
                fontSize: '0.75rem',
              }}
            />
            <Legend />
            <Bar dataKey="completion" fill="#38bdf8" name="Completion %" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
