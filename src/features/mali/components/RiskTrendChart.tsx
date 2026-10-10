import { useMemo } from 'react';
import { BaseChart } from '@/components/charts/base-chart';
import type { EChartsOption } from 'echarts';
import { RiskTrendDataPoint } from '../types/risk-overview';

interface RiskTrendChartProps {
  data: RiskTrendDataPoint[];
}

export function RiskTrendChart({ data }: RiskTrendChartProps) {
  const option: EChartsOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'hsl(var(--background))',
        borderColor: 'hsl(var(--border))',
        textStyle: { color: 'hsl(var(--foreground))' },
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['Avg Score', 'High Risk %'],
        textStyle: { color: '#e5e7eb' },
        top: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: data.map(d => d.timestamp),
          axisLabel: { color: '#e5e7eb', fontSize: 10 },
          axisLine: { lineStyle: { color: 'hsl(var(--border))' } },
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Score',
          nameTextStyle: { color: '#e5e7eb', fontSize: 10 },
          max: 100,
          axisLabel: { color: '#e5e7eb', fontSize: 10 },
          splitLine: { lineStyle: { color: 'hsl(var(--border))' } }
        },
        {
          type: 'value',
          name: 'High Risk %',
          nameTextStyle: { color: '#e5e7eb', fontSize: 10 },
          max: 10,
          axisLabel: { color: '#e5e7eb', fontSize: 10, formatter: '{value}%' },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: 'Avg Score',
          type: 'line',
          smooth: true,
          lineStyle: { width: 2, color: '#3b82f6' },
          showSymbol: false,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
              ]
            }
          },
          data: data.map(d => d.averageScore)
        },
        {
          name: 'High Risk %',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          lineStyle: { width: 2, color: '#ef4444', type: 'dashed' },
          showSymbol: false,
          data: data.map(d => d.highRiskPercentage)
        }
      ]
    };
  }, [data]);

  return (
    <div className="bg-background border border-border rounded-xl p-4 flex flex-col h-full min-h-[300px]">
      <h3 className="font-semibold text-foreground mb-4">Risk Score Trends</h3>
      <div className="flex-1 -mx-2">
        <BaseChart option={option} height="100%" />
      </div>
    </div>
  );
}
