import { useMemo } from 'react';
import { BaseChart } from '@/components/charts/base-chart';
import type { EChartsOption } from 'echarts';
import type { AlertTrendData } from '../types/command-center-types';

interface AlertTrendChartProps {
  data: AlertTrendData;
}

export function AlertTrendChart({ data }: AlertTrendChartProps) {
  const option: EChartsOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'hsl(var(--background))',
        borderColor: 'hsl(var(--border))',
        textStyle: { color: 'hsl(var(--foreground))' },
      },
      legend: {
        data: ['Critical', 'High', 'Medium', 'Low'],
        right: '5%',
        top: 0,
        textStyle: { color: 'hsl(var(--muted-foreground))', fontSize: 12 },
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom: '5%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: data.dates,
        axisLine: { lineStyle: { color: 'hsl(var(--border))' } },
        axisLabel: { color: 'hsl(var(--muted-foreground))', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'hsl(var(--border))', type: 'dashed' } },
        axisLabel: { color: 'hsl(var(--muted-foreground))', fontSize: 10 },
      },
      series: [
        {
          name: 'Critical',
          type: 'bar',
          stack: 'total',
          barWidth: '50%',
          itemStyle: { color: '#ef4444' }, // red
          data: data.critical,
        },
        {
          name: 'High',
          type: 'bar',
          stack: 'total',
          itemStyle: { color: '#f97316' }, // orange
          data: data.high,
        },
        {
          name: 'Medium',
          type: 'bar',
          stack: 'total',
          itemStyle: { color: '#eab308' }, // yellow
          data: data.medium,
        },
        {
          name: 'Low',
          type: 'bar',
          stack: 'total',
          itemStyle: { color: '#3b82f6' }, // blue
          data: data.low,
        }
      ],
    };
  }, [data]);

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm p-4 h-full flex flex-col min-h-[250px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-foreground">Alert Trend</h3>
        <button className="text-xs text-primary hover:underline font-medium">View all →</button>
      </div>
      <div className="flex-1 -mx-2">
        <BaseChart option={option} height="100%" />
      </div>
    </div>
  );
}
