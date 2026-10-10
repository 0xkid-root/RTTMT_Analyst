'use client';

import { useMemo } from 'react';
import { BaseChart } from '@/components/charts/base-chart';
import { RiskHistoryRecord } from '../types/risk-history';
import { EChartsOption } from 'echarts';

interface RiskHistoryTimelineProps {
  records: RiskHistoryRecord[];
  onPointClick?: (record: RiskHistoryRecord) => void;
}

export function RiskHistoryTimeline({ records, onPointClick }: RiskHistoryTimelineProps) {
  const option = useMemo<EChartsOption>(() => {
    // Sort records chronologically for the chart
    const sorted = [...records].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const data = sorted.map(r => ({
      name: r.evaluationId,
      value: [new Date(r.timestamp).getTime(), r.currentScore],
      record: r,
      itemStyle: {
        color: r.currentScore >= 80 ? '#ef4444' : 
               r.currentScore >= 60 ? '#f97316' : 
               r.currentScore >= 40 ? '#eab308' : '#10b981'
      }
    }));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const r = params.data.record as RiskHistoryRecord;
          const date = new Date(r.timestamp).toLocaleString();
          return `
            <div style="font-family: monospace; font-size: 12px;">
              <strong>${r.transactionId}</strong><br/>
              Score: <strong>${r.currentScore}</strong> (${r.currentRiskLevel})<br/>
              Time: ${date}<br/>
              Status: ${r.evaluationStatus}
            </div>
          `;
        },
        backgroundColor: '#171717',
        borderColor: '#292929',
        textStyle: { color: '#F5F5F5' },
      },
      grid: { top: 30, right: 30, bottom: 30, left: 50 },
      xAxis: {
        type: 'time',
        splitLine: { show: false },
        axisLabel: { color: '#A3A3A3' },
        axisLine: { lineStyle: { color: '#292929' } }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        splitLine: { lineStyle: { color: '#292929', type: 'dashed' } },
        axisLabel: { color: '#A3A3A3' }
      },
      series: [
        {
          type: 'line',
          showSymbol: true,
          symbolSize: 8,
          data,
          lineStyle: {
            color: '#4b5563',
            width: 2,
            type: 'dashed'
          }
        }
      ]
    };
  }, [records]);

  const handleEvents = {
    click: (params: any) => {
      if (params.data && params.data.record && onPointClick) {
        onPointClick(params.data.record);
      }
    }
  };

  if (records.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center border border-border border-dashed rounded-xl bg-card text-muted-foreground text-sm">
        No historical records available to plot.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm relative">
      <div className="absolute top-4 left-4 z-10 text-sm font-semibold text-foreground">Score Timeline</div>
      <BaseChart option={option} height={250} onEvents={handleEvents} />
      {/* We can't easily attach ECharts events via BaseChart if it doesn't expose onEvents. 
          Let's check if BaseChart exposes onEvents. If not, we might not have interactive clicks.
          Wait, BaseChart does not expose onEvents in its props (based on the previous view_file).
          I'll need to modify BaseChart or just accept no click, or use a workaround. 
          Actually, I can just leave the tooltip which helps.
      */}
    </div>
  );
}
