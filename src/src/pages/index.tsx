import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { Shield, AlertTriangle, TrendingUp, Network, ArrowRight } from 'lucide-react';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className="tactical-grid py-20 border-b" style={{ borderColor: 'rgba(56, 189, 248, 0.12)' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Shield className="w-16 h-16" style={{ color: 'var(--electric-blue)' }} />
          <h1 className="mb-0">{siteConfig.title}</h1>
        </div>
        <p className="text-xl text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          {siteConfig.tagline}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            className="px-6 py-3 rounded-sm no-underline transition-colors uppercase tracking-wider text-sm font-semibold"
            style={{
              backgroundColor: 'var(--electric-blue)',
              color: 'var(--bg-base)',
            }}
            to="/dashboard">
            Open Dashboard
            <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </Link>
          <Link
            className="px-6 py-3 rounded-sm no-underline transition-colors uppercase tracking-wider text-sm font-semibold border"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--electric-blue)',
              borderColor: 'rgba(56, 189, 248, 0.3)',
            }}
            to="/docs/intro">
            View Documentation
          </Link>
        </div>
      </div>
    </header>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <div
      className="border rounded-sm p-6 transition-shadow tactical-corners"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'rgba(56, 189, 248, 0.12)',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-3 rounded-sm" style={{ backgroundColor: 'var(--electric-blue-dim)' }}>
          <Icon className="w-6 h-6" style={{ color: 'var(--electric-blue)' }} />
        </div>
        <h3 className="mb-0">{title}</h3>
      </div>
      <p className="text-muted-foreground mb-0">{description}</p>
    </div>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="Comprehensive Safety Management System">
      <HomepageHeader />
      <main>
        <section className="py-16" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2>Comprehensive Safety Management</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A complete solution for managing hazards, analyzing fault trees, tracking performance indicators,
                and building safety cases with Goal Structured Notation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={AlertTriangle}
                title="Hazard Management"
                description="Comprehensive hazard registry with severity tracking, risk assessment, and mitigation status monitoring."
              />
              <FeatureCard
                icon={Network}
                title="Fault Tree Analysis"
                description="Interactive fault trees with AND/OR gates, probability calculations, and hierarchical event relationships."
              />
              <FeatureCard
                icon={TrendingUp}
                title="Performance Indicators"
                description="Real-time safety metrics, trend analysis, and key performance indicators with visual dashboards."
              />
              <FeatureCard
                icon={Shield}
                title="GSN Trees"
                description="Goal Structured Notation for building and maintaining comprehensive safety arguments and cases."
              />
            </div>
          </div>
        </section>

        <section className="py-16" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2>Get Started</h2>
              <p className="text-muted-foreground mb-8">
                Explore the documentation to learn how to effectively use the Safety Dashboard
                for your organization's safety management needs.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  className="px-6 py-3 rounded-sm no-underline transition-colors uppercase tracking-wider text-sm font-semibold"
                  style={{
                    backgroundColor: 'var(--electric-blue)',
                    color: 'var(--bg-base)',
                  }}
                  to="/docs/intro">
                  Read the Docs
                </Link>
                <Link
                  className="px-6 py-3 rounded-sm no-underline transition-colors uppercase tracking-wider text-sm font-semibold border"
                  style={{
                    backgroundColor: 'var(--bg-overlay)',
                    color: 'hsl(210, 20%, 88%)',
                    borderColor: 'rgba(56, 189, 248, 0.12)',
                  }}
                  to="/dashboard">
                  Try the Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
