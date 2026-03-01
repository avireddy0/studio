'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { BarChart3, Fingerprint } from 'lucide-react';
import styles from './acceleration-section.module.css';

export default function AccelerationSection() {
  const latencyChartRef = useRef<HTMLCanvasElement>(null);
  const coverageChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const chartInstances: Chart[] = [];

    if (latencyChartRef.current) {
        const ctxLatency = latencyChartRef.current.getContext('2d');
        if (ctxLatency) {
            chartInstances.push(new Chart(ctxLatency, {
                type: 'bar',
                data: {
                    labels: ['Manual Audit', 'Excel Audit', 'Envision OS'],
                    datasets: [{
                        label: 'Days to Reality',
                        data: [45, 14, 0.01],
                        backgroundColor: ['#475569', '#3b82f6', '#10b981'],
                        borderRadius: 8,
                        barThickness: 32
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { beginAtZero: true, grid: { color: '#1e1e20' }, ticks: { color: '#94A3B8' } },
                        y: { grid: { display: false }, ticks: { color: '#94A3B8' } }
                    }
                }
            }));
        }
    }

    if (coverageChartRef.current) {
        const ctxCoverage = coverageChartRef.current.getContext('2d');
        if (ctxCoverage) {
            chartInstances.push(new Chart(ctxCoverage, {
                type: 'doughnut',
                data: {
                    labels: ['Verified', 'Scanning'],
                    datasets: [{
                        data: [98, 2],
                        backgroundColor: ['#10B981', '#0f0f11'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '82%',
                    plugins: { legend: { display: false } }
                }
            }));
        }
    }

    return () => {
        chartInstances.forEach(chart => chart.destroy());
    };
  }, []);

  return (
    <section id="metrics" className="scroll-snap-section py-32 border-t border-white/5 bg-[#020202]">
      <div className="container mx-auto px-6">
        <div className={styles['acceleration-micdrop']}>
          <div className={styles['accel-hero-card']}>
            <span className={styles['accel-kicker']}>Bottom Line Impact</span>
            <h2 className={styles['accel-title']}>
              Performance Acceleration <br /> that rewrites construction economics
            </h2>
            <p className={styles['accel-subtitle']}>
              Traditional construction intelligence arrives after margin damage is already baked in.
              Envision OS collapses that lag into a live control loop.
            </p>

            <div className={styles['accel-shock-panel']}>
              <p className={styles['accel-shock-value']}>120,960,000x</p>
              <p className={styles['accel-shock-label']}>faster risk discovery (14 days down to 0.01 seconds)</p>
              <p className={styles['accel-shock-context']}>
                On a $500M portfolio, every 1% leakage avoided preserves $5M in investor value.
              </p>
            </div>

            <div className={styles['accel-lane-grid']} aria-hidden="true">
              <div className={`${styles['accel-lane']} ${styles['legacy']}`}>
                <div className={styles['accel-lane-meta']}>
                  <span>Legacy reporting cadence</span>
                  <strong>14 days</strong>
                </div>
                <div className={styles['accel-lane-track']}>
                  <span className={styles['accel-packet']}></span>
                </div>
              </div>
              <div className={`${styles['accel-lane']} ${styles['envision']}`}>
                <div className={styles['accel-lane-meta']}>
                  <span>Envision OS audit loop</span>
                  <strong>0.01s</strong>
                </div>
                <div className={styles['accel-lane-track']}>
                  <span className={styles['accel-packet']}></span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles['accel-analytics-grid']}>
            <article className={styles['accel-chart-card']}>
              <div className={styles['accel-chart-head']}>
                <h3>
                  <BarChart3 className="size-5 text-accent-emerald" /> Discovery Velocity Benchmark
                </h3>
                <span>Cross-industry outlier performance</span>
              </div>
              <div className={styles['accel-chart-canvas']}>
                <canvas ref={latencyChartRef}></canvas>
              </div>
            </article>

            <article className={styles['accel-chart-card']}>
              <div className={styles['accel-chart-head']}>
                <h3>
                  <Fingerprint className="size-5 text-accent-emerald" /> Audit Shield
                </h3>
                <span>Investor-grade transparency confidence</span>
              </div>
              <div className={styles['accel-donut-wrap']}>
                <div className={styles['accel-donut-canvas']}>
                  <canvas ref={coverageChartRef}></canvas>
                  <div className={styles['accel-donut-overlay']}>
                    <span>98%</span>
                    <small>Transparency</small>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className={styles['accel-impact-grid']}>
            <article className={styles['accel-impact-card']}>
              <span className={styles['accel-impact-value']}>24/7</span>
              <p className={styles['accel-impact-title']}>Continuous audit integrity</p>
              <p className={styles['accel-impact-copy']}>
                Every message, budget delta, and field event is continuously reconciled instead of sampled late.
              </p>
            </article>
            <article className={styles['accel-impact-card']}>
              <span className={styles['accel-impact-value']}>390</span>
              <p className={styles['accel-impact-title']}>Integrated control points</p>
              <p className={styles['accel-impact-copy']}>
                Actions propagate through project, finance, and communication tools as one coordinated system.
              </p>
            </article>
            <article className={styles['accel-impact-card']}>
              <span className={styles['accel-impact-value']}>$5M</span>
              <p className={styles['accel-impact-title']}>Value preserved per 1% leakage</p>
              <p className={styles['accel-impact-copy']}>
                On a representative $500M portfolio, early signal capture prevents avoidable erosion before escalation.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
